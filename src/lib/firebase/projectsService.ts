import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import { db, isFirebaseConfigured } from "./config";
import type { Project } from "@/types";

const COLLECTION = "projects";

export async function createProject(project: {
  title: string;
  description: string;
  color: string;
  ownerId: string;
}): Promise<string> {
  if (!db || !isFirebaseConfigured) {
    throw new Error("Firebase Firestore yapılandırılmadı.");
  }

  const docRef = await addDoc(collection(db, COLLECTION), {
    ...project,
    createdAt: serverTimestamp(),
  });

  return docRef.id;
}

export async function deleteProject(projectId: string): Promise<void> {
  if (!db || !isFirebaseConfigured) return;
  const docRef = doc(db, COLLECTION, projectId);
  await deleteDoc(docRef);
}

export function subscribeProjects(
  userId: string,
  callback: (projects: Project[]) => void,
  onError?: (err: Error) => void
): () => void {
  if (!db || !isFirebaseConfigured || !userId) {
    callback([]);
    return () => {};
  }

  const q = query(
    collection(db, COLLECTION),
    where("ownerId", "==", userId),
    orderBy("createdAt", "desc")
  );

  return onSnapshot(
    q,
    (snapshot) => {
      const items: Project[] = snapshot.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Omit<Project, "id">),
      }));
      callback(items);
    },
    (error) => {
      console.warn("subscribeProjects listener error:", error);
      if (onError) onError(error);
    }
  );
}
