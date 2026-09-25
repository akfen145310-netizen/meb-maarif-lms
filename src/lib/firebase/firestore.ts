import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
  type DocumentData,
  type QuerySnapshot,
} from "firebase/firestore";
import { db, isFirebaseConfigured } from "./config";

export interface FirestoreDocument<T = DocumentData> {
  id: string;
  data: T;
}

/**
 * Adds a new document to a specified collection.
 */
export async function addDocument<T extends Record<string, unknown>>(
  collectionName: string,
  data: T
): Promise<string | null> {
  if (!db || !isFirebaseConfigured) {
    throw new Error("Firebase Firestore is not configured yet.");
  }
  const colRef = collection(db, collectionName);
  const docRef = await addDoc(colRef, {
    ...data,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

/**
 * Fetches all documents from a collection ordered by createdAt desc.
 */
export async function getCollectionDocuments(
  collectionName: string
): Promise<Array<{ id: string; [key: string]: unknown }>> {
  if (!db || !isFirebaseConfigured) {
    return [];
  }
  const colRef = collection(db, collectionName);
  const q = query(colRef, orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((docSnap) => ({
    id: docSnap.id,
    ...docSnap.data(),
  }));
}

/**
 * Deletes a document by ID.
 */
export async function deleteDocument(
  collectionName: string,
  id: string
): Promise<void> {
  if (!db || !isFirebaseConfigured) {
    throw new Error("Firebase Firestore is not configured yet.");
  }
  const docRef = doc(db, collectionName, id);
  await deleteDoc(docRef);
}

/**
 * Real-time listener for a Firestore collection.
 */
export function subscribeToCollection(
  collectionName: string,
  callback: (docs: Array<{ id: string; [key: string]: unknown }>) => void,
  onError?: (error: Error) => void
): () => void {
  if (!db || !isFirebaseConfigured) {
    callback([]);
    return () => {};
  }

  const colRef = collection(db, collectionName);
  const q = query(colRef, orderBy("createdAt", "desc"));

  return onSnapshot(
    q,
    (snapshot: QuerySnapshot<DocumentData>) => {
      const items = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      }));
      callback(items);
    },
    (error) => {
      console.error(`Error subscribing to ${collectionName}:`, error);
      if (onError) onError(error);
    }
  );
}
