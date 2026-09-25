import {
  collection,
  addDoc,
  doc,
  updateDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import { db, isFirebaseConfigured } from "@/lib/firebase/config";
import type { DefterKaydi, Announcement, MaarifKazanimi, TeacherTavsiye } from "@/types/maarif";
import {
  MOCK_DEFTER_KAYITLARI,
  MOCK_ANNOUNCEMENTS,
  MOCK_MAARIF_KAZANIMLAR,
  MOCK_TEACHER_TAVSIYELER,
} from "./seedData";

const DEFTER_COLLECTION = "defter_kayitlari";
const ANNOUNCEMENT_COLLECTION = "duyurular";
const TAVSIYE_COLLECTION = "ogretmen_tavsiyeleri";

/**
 * Saves or creates a digital class log entry
 */
export async function saveDefterKaydi(
  kayit: Omit<DefterKaydi, "id" | "createdAt">
): Promise<string> {
  if (db && isFirebaseConfigured) {
    const docRef = await addDoc(collection(db, DEFTER_COLLECTION), {
      ...kayit,
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  }
  return `mock-def-${Date.now()}`;
}

/**
 * Signs and confirms a class log entry
 */
export async function signDefterKaydi(id: string, approverName: string): Promise<void> {
  if (db && isFirebaseConfigured) {
    const docRef = doc(db, DEFTER_COLLECTION, id);
    await updateDoc(docRef, {
      imzalandi: true,
      onaylayanYonetici: approverName,
    });
  }
}

/**
 * Saves a new teacher advice/recommendation for a student
 */
export async function saveTeacherTavsiye(
  tavsiye: Omit<TeacherTavsiye, "id">
): Promise<string> {
  if (db && isFirebaseConfigured) {
    const docRef = await addDoc(collection(db, TAVSIYE_COLLECTION), {
      ...tavsiye,
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  }
  return `mock-tav-${Date.now()}`;
}

/**
 * Subscribes to teacher recommendations for a specific student or all
 */
export function subscribeTeacherTavsiyeler(
  studentId?: string,
  callback?: (tavsiyeler: TeacherTavsiye[]) => void
): () => void {
  if (!callback) return () => {};

  if (!db || !isFirebaseConfigured) {
    const res = studentId
      ? MOCK_TEACHER_TAVSIYELER.filter((t) => t.studentId === studentId)
      : MOCK_TEACHER_TAVSIYELER;
    callback(res);
    return () => {};
  }

  const q = studentId
    ? query(
        collection(db, TAVSIYE_COLLECTION),
        where("studentId", "==", studentId),
        orderBy("tarih", "desc")
      )
    : query(collection(db, TAVSIYE_COLLECTION), orderBy("tarih", "desc"));

  return onSnapshot(
    q,
    (snapshot) => {
      const items: TeacherTavsiye[] = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...(docSnap.data() as Omit<TeacherTavsiye, "id">),
      }));
      callback(items.length > 0 ? items : MOCK_TEACHER_TAVSIYELER);
    },
    (err) => {
      console.warn("Firestore tavsiyeler subscription fallback:", err);
      callback(
        studentId
          ? MOCK_TEACHER_TAVSIYELER.filter((t) => t.studentId === studentId)
          : MOCK_TEACHER_TAVSIYELER
      );
    }
  );
}

/**
 * Subscribes to class log entries for a given class or date
 */
export function subscribeDefterKayitlari(
  classId: string,
  callback: (kayitlar: DefterKaydi[]) => void
): () => void {
  if (!db || !isFirebaseConfigured) {
    callback(MOCK_DEFTER_KAYITLARI.filter((k) => !classId || k.classId === classId));
    return () => {};
  }

  const q = classId
    ? query(
        collection(db, DEFTER_COLLECTION),
        where("classId", "==", classId),
        orderBy("date", "desc")
      )
    : query(collection(db, DEFTER_COLLECTION), orderBy("date", "desc"));

  return onSnapshot(
    q,
    (snapshot) => {
      const items: DefterKaydi[] = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...(docSnap.data() as Omit<DefterKaydi, "id">),
      }));
      callback(items.length > 0 ? items : MOCK_DEFTER_KAYITLARI);
    },
    (err) => {
      console.warn("Firestore defter subscription fallback:", err);
      callback(MOCK_DEFTER_KAYITLARI);
    }
  );
}

/**
 * Subscribes to school announcements
 */
export function subscribeAnnouncements(
  callback: (announcements: Announcement[]) => void
): () => void {
  if (!db || !isFirebaseConfigured) {
    callback(MOCK_ANNOUNCEMENTS);
    return () => {};
  }

  const q = query(
    collection(db, ANNOUNCEMENT_COLLECTION),
    orderBy("date", "desc")
  );

  return onSnapshot(
    q,
    (snapshot) => {
      const items: Announcement[] = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...(docSnap.data() as Omit<Announcement, "id">),
      }));
      callback(items.length > 0 ? items : MOCK_ANNOUNCEMENTS);
    },
    (err) => {
      console.warn("Firestore announcements subscription fallback:", err);
      callback(MOCK_ANNOUNCEMENTS);
    }
  );
}

/**
 * Filters Maarif Modeli outcomes by subject and grade
 */
export function filterMaarifKazanimlar(
  subject?: string,
  grade?: number,
  search?: string
): MaarifKazanimi[] {
  return MOCK_MAARIF_KAZANIMLAR.filter((k) => {
    const matchesSubject = !subject || k.subject.toLowerCase() === subject.toLowerCase();
    const matchesGrade = !grade || k.grade === grade;
    const matchesSearch =
      !search ||
      k.title.toLowerCase().includes(search.toLowerCase()) ||
      k.kod.toLowerCase().includes(search.toLowerCase()) ||
      k.unite.toLowerCase().includes(search.toLowerCase()) ||
      k.erdemDeger.toLowerCase().includes(search.toLowerCase());
    return matchesSubject && matchesGrade && matchesSearch;
  });
}
