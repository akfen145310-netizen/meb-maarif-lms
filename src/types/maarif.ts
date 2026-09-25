export type UserRole = "misafir" | "ogrenci" | "veli" | "ogretmen" | "yonetici";

export type YoklamaStatus = "geldi" | "gelmedi" | "izinli" | "gec";

export interface MaarifKazanimi {
  id: string;
  grade: number;
  subject: string;
  kod: string;
  title: string;
  unite: string;
  beceriAlani: "Kavramsal Beceri" | "Sosyo-Duygusal" | "Okuryazarlık" | "Eğilim";
  erdemDeger: "Adalet" | "Dürüstlük" | "Merhamet" | "Sorumluluk" | "Vatanseverlik" | "Saygı" | "Çalışkanlık";
  ogrenmeCiktisi: string;
  surecOdakliDegerlendirme: string;
  kavramYanilgisi?: {
    baslik?: string;
    aciklama: string;
    dogrusu: string;
  };
  isLgsKritik?: boolean;
  lgsVurgusu?: {
    onemDerecesi: "Kritik" | "Çok Yüksek" | "Yüksek";
    soruTipi: string;
    cozumIpuclari: string[];
    ornekSoruAnalizi: string;
  };
}

export interface Student {
  id: string;
  studentNo: string;
  name: string;
  classId: string;
  className: string;
  parentName: string;
  parentPhone: string;
  devamsizlikGun: number;
  kazanimTamamlamaOrani: number;
  entegreVeliKodu?: string;
  photoUrl?: string; // İstemci tarafında 3:4 vesikalık sıkıştırılmış fotoğraf
}

export interface ClassRoom {
  id: string;
  name: string;
  grade: number;
  branch: string;
  studentCount: number;
  rehberOgretmen: string;
}

export interface YoklamaRecord {
  studentId: string;
  studentName: string;
  studentNo: string;
  status: YoklamaStatus;
  aciklama?: string;
  photoUrl?: string; // Öğrencinin adının hemen solunda gösterilecek avatar
}

export interface DefterKaydi {
  id: string;
  date: string;
  lessonHour: number;
  classId: string;
  className: string;
  subject: string;
  teacherId: string;
  teacherName: string;
  topic: string;
  selectedKazanimlar: MaarifKazanimi[];
  yoklama: YoklamaRecord[];
  tavsiye?: string; // Sınıfa verilen haftalık tavsiye (Ödev yerine kullanılır)
  odev?: string; // Geriye dönük uyumluluk
  ogretmenNotu?: string;
  imzalandi: boolean;
  onaylayanYonetici?: string;
  createdAt?: unknown;
}

export interface TeacherTavsiye {
  id: string;
  studentId: string;
  studentName: string;
  teacherId: string;
  teacherName: string;
  subject: string;
  tarih: string;
  haftalikKonu: string;
  tavsiyeMetni: string;
  beceriAlani?: string;
  oncelik: "normal" | "onemli" | "tebrik";
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  target: "tumu" | "ogretmenler" | "veliler" | "ogrenciler" | "sinif";
  targetClassId?: string;
  author: string;
  date: string;
  priority: "normal" | "onemli" | "acil";
}

export interface SchoolCapacityStats {
  totalTeachers: number;
  totalClasses: number;
  totalStudents: number;
  todayAttendanceRate: number;
  defterFillRate: number;
  weeklyCompletedKazanimCount: number;
  activeConcurrentUsers: number;
}
