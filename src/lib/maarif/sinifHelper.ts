/**
 * Türkiye Yüzyılı Maarif Modeli - Sınıf Yönetimi ve Katılım Kodu Yardımcısı
 * KURAL: Öğretmen "Sınıf Oluştur" diyerek dijital sınıf (Örn: 8-A) açar.
 * Üretilen "Sınıf Katılım Kodu" ile öğrenci kaydolunca, VELİ DE OTOMATİK OLARAK o sınıfa entegre olur.
 */

import { MOCK_CLASSES } from "./seedData";
import type { ClassRoom, Student } from "@/types/maarif";

export interface ManagedClass extends ClassRoom {
  joinCode: string;
  createdAt: string;
}

const STORAGE_CLASSES_KEY = "maarif_managed_classes_v2";
const STORAGE_ENROLLMENT_KEY = "maarif_student_enrollments_v2";

const INITIAL_CLASSES: ManagedClass[] = [
  {
    id: "cls-8a",
    name: "8-A",
    grade: 8,
    branch: "A",
    studentCount: 32,
    rehberOgretmen: "Ahmet Yılmaz (Matematik)",
    joinCode: "SINIF-8A-8844",
    createdAt: "2026-09-01",
  },
  {
    id: "cls-9a",
    name: "9-A",
    grade: 9,
    branch: "A",
    studentCount: 38,
    rehberOgretmen: "Ahmet Yılmaz (Matematik)",
    joinCode: "SINIF-9A-9901",
    createdAt: "2026-09-01",
  },
  {
    id: "cls-7a",
    name: "7-A",
    grade: 7,
    branch: "A",
    studentCount: 30,
    rehberOgretmen: "Zeynep Kaya (Edebiyat)",
    joinCode: "SINIF-7A-7703",
    createdAt: "2026-09-01",
  },
  {
    id: "cls-6b",
    name: "6-B",
    grade: 6,
    branch: "B",
    studentCount: 28,
    rehberOgretmen: "Mehmet Demir (Fen Bilimleri)",
    joinCode: "SINIF-6B-6622",
    createdAt: "2026-09-01",
  },
];

export function getStoredClasses(): ManagedClass[] {
  if (typeof window === "undefined") return INITIAL_CLASSES;
  try {
    const raw = localStorage.getItem(STORAGE_CLASSES_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_CLASSES_KEY, JSON.stringify(INITIAL_CLASSES));
      return INITIAL_CLASSES;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_CLASSES;
  }
}

export function generateJoinCode(className: string): string {
  const cleanName = className.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `SINIF-${cleanName}-${randomNum}`;
}

export function createNewClass(
  className: string,
  grade: number,
  branch: string,
  rehberOgretmen = "Ahmet Yılmaz (Öğretmen)"
): { newClass: ManagedClass; all: ManagedClass[] } {
  const classes = getStoredClasses();
  const joinCode = generateJoinCode(className);
  const newClass: ManagedClass = {
    id: `cls-${className.toLowerCase().replace(/[^a-z0-9]/g, "")}-${Date.now().toString().slice(-4)}`,
    name: className,
    grade,
    branch: branch.toUpperCase(),
    studentCount: 1, // Kurucu öğretmen & yeni açılan şube
    rehberOgretmen,
    joinCode,
    createdAt: new Date().toISOString().split("T")[0],
  };

  const updated = [newClass, ...classes];
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(STORAGE_CLASSES_KEY, JSON.stringify(updated));
      window.dispatchEvent(
        new CustomEvent("class-list-updated", { detail: { newClass, all: updated } })
      );
    } catch (e) {
      console.error(e);
    }
  }

  return { newClass, all: updated };
}

export interface StudentEnrollment {
  studentId: string;
  classId: string;
  className: string;
  grade?: number;
  joinCode: string;
  enrolledAt: string;
  parentSynced: boolean;
}

export function getStudentEnrollment(studentId: string): StudentEnrollment | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_ENROLLMENT_KEY);
    if (!raw) return null;
    const map = JSON.parse(raw);
    return map[studentId] || null;
  } catch {
    return null;
  }
}

/**
 * Öğrenci Katılım Kodu ile Sınıfa Kaydolur.
 * KESİN KURAL: Öğrenci kaydolunca Veli de otomatik olarak o sınıfa entegre olur!
 */
export function enrollStudentWithCode(
  joinCode: string,
  student: Student
): { success: boolean; enrolledClass?: ManagedClass; message: string } {
  const trimmedCode = joinCode.trim().toUpperCase();
  const classes = getStoredClasses();
  const targetClass = classes.find((c) => c.joinCode.toUpperCase() === trimmedCode);

  if (!targetClass) {
    return {
      success: false,
      message: `Geçersiz Katılım Kodu ("${trimmedCode}"). Lütfen öğretmeninizden aldığınız kodu kontrol ediniz (Örn: SINIF-8A-8844).`,
    };
  }

  const enrollment: StudentEnrollment = {
    studentId: student.id,
    classId: targetClass.id,
    className: targetClass.name,
    grade: targetClass.grade,
    joinCode: targetClass.joinCode,
    enrolledAt: new Date().toISOString(),
    parentSynced: true, // Veli de otomatik entegre!
  };

  if (typeof window !== "undefined") {
    try {
      const raw = localStorage.getItem(STORAGE_ENROLLMENT_KEY);
      const map = raw ? JSON.parse(raw) : {};
      map[student.id] = enrollment;
      localStorage.setItem(STORAGE_ENROLLMENT_KEY, JSON.stringify(map));

      // Canlı Bildirim: Hem öğrenci hem veli ekranı anında güncellenir
      window.dispatchEvent(
        new CustomEvent("student-class-enrolled", {
          detail: {
            studentId: student.id,
            classObj: targetClass,
            enrollment,
            parentSynced: true,
          },
        })
      );
    } catch (err) {
      console.error("Sınıf kaydı yapılamadı:", err);
    }
  }

  return {
    success: true,
    enrolledClass: targetClass,
    message: `Tebrikler! ${targetClass.name} sınıfına başarıyla kaydoldunuz. Veli hesabınız da otomatik olarak bu sınıfa entegre edildi.`,
  };
}
