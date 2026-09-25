import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import { db, isFirebaseConfigured } from "./config";
import type { TaskItem, TaskStatus, TaskPriority } from "@/types";

const COLLECTION = "tasks";

export async function createTask(task: {
  title: string;
  description?: string;
  projectId?: string;
  priority: TaskPriority;
  status?: TaskStatus;
  dueDate?: string;
  userId: string;
}): Promise<string> {
  if (!db || !isFirebaseConfigured) {
    throw new Error("Firebase Firestore yapılandırılmadı.");
  }

  const docRef = await addDoc(collection(db, COLLECTION), {
    ...task,
    status: task.status || "todo",
    createdAt: serverTimestamp(),
  });

  return docRef.id;
}

export async function updateTaskStatus(
  taskId: string,
  status: TaskStatus
): Promise<void> {
  if (!db || !isFirebaseConfigured) return;
  const docRef = doc(db, COLLECTION, taskId);
  await updateDoc(docRef, { status });
}

export async function updateTask(
  taskId: string,
  updates: Partial<TaskItem>
): Promise<void> {
  if (!db || !isFirebaseConfigured) return;
  const docRef = doc(db, COLLECTION, taskId);
  await updateDoc(docRef, { ...updates });
}

export async function deleteTask(taskId: string): Promise<void> {
  if (!db || !isFirebaseConfigured) return;
  const docRef = doc(db, COLLECTION, taskId);
  await deleteDoc(docRef);
}

export function subscribeTasks(
  userId: string,
  callback: (tasks: TaskItem[]) => void,
  onError?: (err: Error) => void
): () => void {
  if (!db || !isFirebaseConfigured || !userId) {
    callback([]);
    return () => {};
  }

  const q = query(
    collection(db, COLLECTION),
    where("userId", "==", userId),
    orderBy("createdAt", "desc")
  );

  return onSnapshot(
    q,
    (snapshot) => {
      const items: TaskItem[] = snapshot.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Omit<TaskItem, "id">),
      }));
      callback(items);
    },
    (error) => {
      console.warn("subscribeTasks listener error:", error);
      if (onError) onError(error);
    }
  );
}
