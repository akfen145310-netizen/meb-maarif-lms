"use client";

import React, { useState, useEffect } from "react";
import type {
  ClassRoom,
  DefterKaydi,
  MaarifKazanimi,
  YoklamaRecord,
  YoklamaStatus,
  TeacherTavsiye,
  Student,
} from "@/types/maarif";
import {
  MOCK_CLASSES,
  MOCK_STUDENTS_9A,
  MOCK_MAARIF_KAZANIMLAR,
  MOCK_DEFTER_KAYITLARI,
  MOCK_TEACHER_TAVSIYELER,
  MOCK_TEACHERS,
  type TeacherProfile,
} from "@/lib/maarif/seedData";
import { saveDefterKaydi, saveTeacherTavsiye } from "@/lib/maarif/maarifService";
import {
  getStoredStudentPhoto,
  getDefaultVesikalikAvatar,
  saveStoredStudentPhoto,
  processAndCompressVesikalik,
} from "@/lib/maarif/studentPhotoHelper";
import StudentPhotoModal from "./StudentPhotoModal";
import { getStoredClasses, createNewClass, type ManagedClass } from "@/lib/maarif/sinifHelper";

const QUICK_TAVSIYE_TEMPLATES = [
  { label: "📖 MEB Kitabını Oku", text: "MEB Ders Kitabı ilgili ünitedeki konu metnini ve kavram haritasını dikkatlice okuyunuz." },
  { label: "🔍 Hatalı Sorularını İncele", text: "Bu haftaki test ve denemelerde yaptığın hatalı soruları incele, çözüm yollarını öğretmenine veya arkadaşına danış." },
  { label: "📝 Fasikülden Test Çöz", text: "Maarif Modeli Beceri Temelli Öğrenme Fasikülü ilgili konudan 2 test çözerek kazanımı pekiştiriniz." },
  { label: "🧠 Kavram Haritası Çıkar", text: "Derste işlenen yeni kavram ve erdem ilişkilerini gösteren 1 sayfalık zihin haritası hazırlayınız." },
  { label: "🧪 Etkinlik Raporunu Tamamla", text: "Ders içi yapılan deneysel gözlem veya etkinlik çalışma yaprağını eksiksiz doldurunuz." },
  { label: "🎯 Süre Tutup 20 Soru Çöz", text: "Maarif soru bankasından süre tutarak 20 adet çoktan seçmeli beceri sorusu çözünüz." },
];

export default function DigitalDefterView() {
  const [activeSubTab, setActiveSubTab] = useState<"defter" | "yonetim" | "fotograf">("defter");
  const [selectedStudentForPhoto, setSelectedStudentForPhoto] = useState<Student | null>(null);
  const [photoRefreshKey, setPhotoRefreshKey] = useState(0);

  // Dedicated Fotoğraf Masası State
  const [photoTargetStudentId, setPhotoTargetStudentId] = useState<string>(MOCK_STUDENTS_9A[0].id);
  const [photoCompressData, setPhotoCompressData] = useState<{
    originalKb: number;
    compressedKb: number;
    dataUrl: string;
    width: number;
    height: number;
  } | null>(null);
  const [isPhotoCompressing, setIsPhotoCompressing] = useState<boolean>(false);
  const [photoSavedToast, setPhotoSavedToast] = useState<boolean>(false);
  const [photoSearchQuery, setPhotoSearchQuery] = useState<string>("");

  const handlePhotoFileUpload = async (file: File) => {
    if (!file) return;
    setIsPhotoCompressing(true);
    const originalKb = Math.round(file.size / 1024);

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = async () => {
        try {
          // 3:4 Vesikalık kırpma ve KESİNLİKLE browser-image-compression ile < 150 KB sıkıştırma
          const res = await processAndCompressVesikalik(img);
          setPhotoCompressData({
            originalKb,
            compressedKb: res.sizeKb,
            dataUrl: res.dataUrl,
            width: res.width,
            height: res.height,
          });
        } catch (err) {
          console.error("Fotoğraf işleme hatası:", err);
        } finally {
          setIsPhotoCompressing(false);
        }
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleSaveDirectPhoto = () => {
    if (!photoCompressData || !photoTargetStudentId) return;
    saveStoredStudentPhoto(photoTargetStudentId, photoCompressData.dataUrl);
    setPhotoRefreshKey((k) => k + 1);
    setPhotoSavedToast(true);
    setTimeout(() => setPhotoSavedToast(false), 3500);
  };

  const handleResetStudentPhoto = (studentId: string) => {
    if (typeof window !== "undefined") {
      try {
        const raw = localStorage.getItem("maarif_student_photos_v1");
        if (raw) {
          const map = JSON.parse(raw);
          delete map[studentId];
          localStorage.setItem("maarif_student_photos_v1", JSON.stringify(map));
          window.dispatchEvent(
            new CustomEvent("student-photo-updated", {
              detail: { studentId, photoDataUrl: null },
            })
          );
        }
      } catch (e) {
        console.error(e);
      }
    }
    setPhotoRefreshKey((k) => k + 1);
    if (photoTargetStudentId === studentId) {
      setPhotoCompressData(null);
    }
  };

  useEffect(() => {
    const onPhotoUpdated = () => {
      setPhotoRefreshKey((k) => k + 1);
    };
    window.addEventListener("student-photo-updated", onPhotoUpdated);
    return () => window.removeEventListener("student-photo-updated", onPhotoUpdated);
  }, []);

  const getAvatarUrl = (studentId: string, name: string, studentNo: string) => {
    return getStoredStudentPhoto(studentId) || getDefaultVesikalikAvatar(name, studentNo);
  };

  // Sınıf Yönetimi & Katılım Kodları State
  const [managedClasses, setManagedClasses] = useState<ManagedClass[]>([]);
  const [showCreateClassModal, setShowCreateClassModal] = useState<boolean>(false);
  const [newClassName, setNewClassName] = useState<string>("8-A");
  const [newClassGrade, setNewClassGrade] = useState<number>(8);
  const [newClassBranch, setNewClassBranch] = useState<string>("A");
  const [createdClassToast, setCreatedClassToast] = useState<ManagedClass | null>(null);
  const [copiedCodeToast, setCopiedCodeToast] = useState<string | null>(null);

  useEffect(() => {
    const list = getStoredClasses();
    setManagedClasses(list);

    const onClassListUpdated = () => {
      setManagedClasses(getStoredClasses());
    };
    window.addEventListener("class-list-updated", onClassListUpdated);
    return () => window.removeEventListener("class-list-updated", onClassListUpdated);
  }, []);

  const handleCreateNewClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClassName.trim()) return;

    const { newClass, all } = createNewClass(
      newClassName.trim(),
      newClassGrade,
      newClassBranch.trim()
    );
    setManagedClasses(all);
    setSelectedClass(newClass.id);
    setCreatedClassToast(newClass);
    setShowCreateClassModal(false);
  };

  // Aktif Öğretmen State (6 Branş Öğretmeni Desteği)
  const [activeTeacher, setActiveTeacher] = useState<TeacherProfile>(MOCK_TEACHERS[2]); // Varsayılan: Ahmet Yılmaz (Matematik)
  const [selectedClass, setSelectedClass] = useState<string>(MOCK_CLASSES[0]?.id || "cls-8a");
  const [lessonHour, setLessonHour] = useState<number>(3);
  const [subject, setSubject] = useState<string>("Matematik");
  const [topic, setTopic] = useState<string>("Çarpanlar ve Katlar / EBOB ve EKOK Problemleri");
  const [odev, setOdev] = useState<string>("MEB 8. Sınıf LGS Örnek Sorular Kitapçığı EBOB-EKOK konusundan 25 yeni nesil problem çözülecek.");
  const [ogretmenNotu, setOgretmenNotu] = useState<string>("Öğrencilerin kavramsal anlama düzeyleri yüksek, akıl yürütme becerileri değerlendirildi.");
  const [selectedKazanimlar, setSelectedKazanimlar] = useState<MaarifKazanimi[]>([
    MOCK_MAARIF_KAZANIMLAR[0], // MAT.8.1.1
  ]);

  // Öğretmen branşı değiştiğinde defter alanlarını senkronize et
  const handleSelectTeacher = (teacher: TeacherProfile) => {
    setActiveTeacher(teacher);
    setSubject(teacher.subject);
    setTopic(teacher.defaultKonu);
    setTavsiyeSubject(teacher.subject);
    setTavsiyeKonu(teacher.defaultKonu);

    // Eşleşen kazanımı otomatik seç
    const matching = MOCK_MAARIF_KAZANIMLAR.find((k) => k.kod === teacher.defaultKazanimKodu);
    if (matching) {
      setSelectedKazanimlar([matching]);
    }
  };

  // Yoklama state
  const [yoklama, setYoklama] = useState<YoklamaRecord[]>(
    MOCK_STUDENTS_9A.map((s) => ({
      studentId: s.id,
      studentName: s.name,
      studentNo: s.studentNo,
      status: "geldi",
    }))
  );

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [pastRecords, setPastRecords] = useState<DefterKaydi[]>(MOCK_DEFTER_KAYITLARI);
  const [kazanimSearch, setKazanimSearch] = useState("");
  const [filterOnlyMyBranch, setFilterOnlyMyBranch] = useState(true);

  // Gelişmiş Sınıf Yönetimi & Tavsiye Yazma State
  const [targetStudentId, setTargetStudentId] = useState<string>(MOCK_STUDENTS_9A[0].id);
  const [tavsiyeSubject, setTavsiyeSubject] = useState<string>("Matematik");
  const [tavsiyeKonu, setTavsiyeKonu] = useState<string>("Çarpanlar ve Katlar / EBOB-EKOK");
  const [tavsiyeBeceri, setTavsiyeBeceri] = useState<string>("Kavramsal Beceri (Akıl Yürütme)");
  const [tavsiyeOncelik, setTavsiyeOncelik] = useState<"normal" | "onemli" | "tebrik">("onemli");
  const [tavsiyeMetni, setTavsiyeMetni] = useState<string>("");
  const [tavsiyeSavedSuccess, setTavsiyeSavedSuccess] = useState<boolean>(false);
  const [allTavsiyeler, setAllTavsiyeler] = useState<TeacherTavsiye[]>(MOCK_TEACHER_TAVSIYELER);

  const currentClassObj = MOCK_CLASSES.find((c) => c.id === selectedClass) || MOCK_CLASSES[0];
  const targetStudent = MOCK_STUDENTS_9A.find((s) => s.id === targetStudentId) || MOCK_STUDENTS_9A[0];

  const handleStatusChange = (studentId: string, status: YoklamaStatus) => {
    setYoklama((prev) =>
      prev.map((r) => (r.studentId === studentId ? { ...r, status } : r))
    );
  };

  const handleMarkAllPresent = () => {
    setYoklama((prev) => prev.map((r) => ({ ...r, status: "geldi" })));
  };

  const handleToggleKazanim = (kazanim: MaarifKazanimi) => {
    if (selectedKazanimlar.some((k) => k.id === kazanim.id)) {
      setSelectedKazanimlar(selectedKazanimlar.filter((k) => k.id !== kazanim.id));
    } else {
      setSelectedKazanimlar([...selectedKazanimlar, kazanim]);
    }
  };

  const handleSaveDefter = async () => {
    const newEntry: Omit<DefterKaydi, "id" | "createdAt"> = {
      date: new Date().toISOString().split("T")[0],
      lessonHour,
      classId: selectedClass,
      className: currentClassObj.name,
      subject,
      teacherId: activeTeacher.id,
      teacherName: `${activeTeacher.name} (${activeTeacher.subject})`,
      topic,
      selectedKazanimlar,
      yoklama,
      tavsiye: odev,
      odev,
      ogretmenNotu,
      imzalandi: true,
      onaylayanYonetici: "Müdür Yrd. Selim Aras (E-İmzalı)",
    };

    const savedId = await saveDefterKaydi(newEntry);
    setPastRecords([
      { id: savedId, ...newEntry, createdAt: new Date().toISOString() },
      ...pastRecords,
    ]);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 4000);
  };

  const handleSaveTavsiye = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tavsiyeMetni.trim()) return;

    const newTavsiye: TeacherTavsiye = {
      id: `tav-${Date.now()}`,
      studentId: targetStudent.id,
      studentName: targetStudent.name,
      teacherId: activeTeacher.id,
      teacherName: `${activeTeacher.name} (${activeTeacher.subject})`,
      subject: tavsiyeSubject,
      tarih: new Date().toISOString().split("T")[0],
      haftalikKonu: tavsiyeKonu,
      tavsiyeMetni: tavsiyeMetni.trim(),
      beceriAlani: tavsiyeBeceri,
      oncelik: tavsiyeOncelik,
    };

    await saveTeacherTavsiye(newTavsiye);
    setAllTavsiyeler([newTavsiye, ...allTavsiyeler]);
    MOCK_TEACHER_TAVSIYELER.unshift(newTavsiye); // Synchronize seedData so other role views see it
    setTavsiyeSavedSuccess(true);
    setTavsiyeMetni("");
    setTimeout(() => setTavsiyeSavedSuccess(false), 3500);
  };

  const presentCount = yoklama.filter((y) => y.status === "geldi").length;
  const absentCount = yoklama.filter((y) => y.status === "gelmedi").length;
  const lateCount = yoklama.filter((y) => y.status === "gec").length;
  const excusedCount = yoklama.filter((y) => y.status === "izinli").length;

  const filteredAvailableKazanimlar = MOCK_MAARIF_KAZANIMLAR.filter((k) => {
    if (kazanimSearch) {
      return (
        k.title.toLowerCase().includes(kazanimSearch.toLowerCase()) ||
        k.kod.toLowerCase().includes(kazanimSearch.toLowerCase()) ||
        k.subject.toLowerCase().includes(kazanimSearch.toLowerCase()) ||
        k.erdemDeger.toLowerCase().includes(kazanimSearch.toLowerCase())
      );
    }
    if (filterOnlyMyBranch) {
      return (
        k.subject.toLowerCase().includes(activeTeacher.subject.toLowerCase()) ||
        (activeTeacher.subject.includes("İnkılap") && k.subject.includes("İnkılap")) ||
        (activeTeacher.subject.includes("Sosyal") && k.subject.includes("Sosyal"))
      );
    }
    return true;
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.75rem" }}>
      {/* Header Info Banner */}
      <div
        className="md-card"
        style={{
          padding: "1.25rem 1.5rem",
          background: "linear-gradient(135deg, #ffffff 0%, #fbf9f5 100%)",
          borderLeft: "6px solid var(--md-navy-primary)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "1rem",
        }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
            <span style={{ fontSize: "1.5rem" }}>👨‍🏫</span>
            <h2 style={{ fontSize: "1.35rem", fontWeight: 800 }}>Öğretmen Yetkili Yönetim Alanı</h2>
            <span className="md-chip md-chip-gold">{activeTeacher.name} ({activeTeacher.branchBadge})</span>
          </div>
          <p style={{ color: "var(--md-text-secondary)", fontSize: "0.875rem", marginTop: "0.25rem" }}>
            Dijital Sınıf Defteri doldurma, yoklama alma, Maarif Modeli kazanımları ve öğrenciye tavsiye yazma.
          </p>

          {/* Branş Öğretmenleri Arasında Hızlı Geçiş (6 Öğretmen Rolü) */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.35rem", flexWrap: "wrap", marginTop: "0.6rem" }}>
            <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--md-navy-primary)", marginRight: "0.2rem" }}>
              Öğretmen Girişi:
            </span>
            {MOCK_TEACHERS.map((tch) => {
              const isActive = activeTeacher.id === tch.id;
              return (
                <button
                  key={tch.id}
                  type="button"
                  onClick={() => handleSelectTeacher(tch)}
                  style={{
                    padding: "0.25rem 0.65rem",
                    borderRadius: "999px",
                    border: isActive ? "2px solid var(--md-accent-gold)" : "1px solid var(--md-cream-border)",
                    background: isActive ? "var(--md-navy-primary)" : "#ffffff",
                    color: isActive ? "#ffffff" : "var(--md-text-primary)",
                    fontSize: "0.75rem",
                    fontWeight: isActive ? 700 : 500,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.3rem",
                    boxShadow: isActive ? "0 2px 6px rgba(18, 38, 70, 0.25)" : "none",
                  }}
                  title={`${tch.name} - ${tch.subject} olarak işlem yap`}
                >
                  <span>{tch.avatarIcon}</span>
                  <span>{tch.name} ({tch.subject})</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Sub-tab Switcher: Defter vs Gelişmiş Sınıf Yönetimi vs Fotoğraf */}
        <div className="md-tabs">
          <button
            onClick={() => setActiveSubTab("defter")}
            className={`md-tab-item ${activeSubTab === "defter" ? "active" : ""}`}
          >
            📖 Dijital Sınıf Defteri
          </button>
          <button
            onClick={() => setActiveSubTab("yonetim")}
            className={`md-tab-item ${activeSubTab === "yonetim" ? "active" : ""}`}
          >
            👥 Gelişmiş Sınıf Yönetimi & Tavsiye Ekle
          </button>
          <button
            onClick={() => setActiveSubTab("fotograf")}
            className={`md-tab-item ${activeSubTab === "fotograf" ? "active" : ""}`}
          >
            📸 Öğrenci Fotoğraf Yükleme (&lt; 150 KB)
          </button>
        </div>
      </div>

      {savedSuccess && (
        <div
          style={{
            padding: "1rem 1.5rem",
            background: "#d8f3dc",
            border: "1.5px solid #2d6a4f",
            borderRadius: "var(--radius-sm)",
            color: "#1b4332",
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            boxShadow: "var(--md-elevation-2)",
          }}
        >
          <span style={{ fontSize: "1.3rem" }}>✅</span>
          <div>
            <strong>Sınıf Defteri Başarıyla Kaydedildi ve E-İmzalandı!</strong>
            <div style={{ fontSize: "0.85rem", fontWeight: 400 }}>
              Kayıt MEB veri tabanına işlendi, velilere bildirimler iletildi.
            </div>
          </div>
        </div>
      )}

      {/* VIEW 1: DİJİTAL SINIF DEFTERİ */}
      {activeSubTab === "defter" && (
        <div style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: "1.75rem", alignItems: "start" }}>
          {/* Left Column: Lesson Details & Attendance Table */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            {/* Sınıf, Ders Saati ve Branş Seçimi */}
            <div className="md-card" style={{ padding: "1.5rem" }}>
              <h3 style={{ fontSize: "1.1rem", marginBottom: "1rem", color: "var(--md-navy-primary)" }}>
                1. Ders ve Sınıf Bilgileri
              </h3>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem", marginBottom: "0.75rem" }}>
                <div className="md-form-group">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.25rem" }}>
                    <label className="md-label" style={{ margin: 0 }}>Sınıf / Şube</label>
                    <button
                      type="button"
                      onClick={() => setShowCreateClassModal(true)}
                      style={{
                        background: "none",
                        border: "none",
                        color: "var(--md-navy-primary)",
                        fontSize: "0.78rem",
                        fontWeight: 700,
                        cursor: "pointer",
                        textDecoration: "underline",
                      }}
                    >
                      ➕ Sınıf Oluştur
                    </button>
                  </div>
                  <select
                    value={selectedClass}
                    onChange={(e) => setSelectedClass(e.target.value)}
                    className="md-select"
                  >
                    {(managedClasses.length > 0 ? managedClasses : MOCK_CLASSES).map((c) => {
                      const joinCode = "joinCode" in c ? (c as ManagedClass).joinCode : "";
                      return (
                        <option key={c.id} value={c.id}>
                          {c.name} ({c.studentCount} Öğr){joinCode ? ` • Kod: ${joinCode}` : ""}
                        </option>
                      );
                    })}
                  </select>
                </div>

                <div className="md-form-group">
                  <label className="md-label">Ders Saati</label>
                  <select
                    value={lessonHour}
                    onChange={(e) => setLessonHour(Number(e.target.value))}
                    className="md-select"
                  >
                    <option value={1}>1. Ders (08:30 - 09:10)</option>
                    <option value={2}>2. Ders (09:20 - 10:00)</option>
                    <option value={3}>3. Ders (10:10 - 10:50)</option>
                    <option value={4}>4. Ders (11:00 - 11:40)</option>
                    <option value={5}>5. Ders (11:50 - 12:30)</option>
                    <option value={6}>6. Ders (13:15 - 13:55)</option>
                    <option value={7}>7. Ders (14:05 - 14:45)</option>
                    <option value={8}>8. Ders (14:55 - 15:35)</option>
                  </select>
                </div>

                <div className="md-form-group">
                  <label className="md-label">Ders / Branş</label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="md-select"
                  >
                    <option value="Matematik">Matematik</option>
                    <option value="Türk Dili ve Edebiyatı">Türk Dili ve Edebiyatı</option>
                    <option value="Fen Bilimleri">Fen Bilimleri</option>
                    <option value="Fizik">Fizik</option>
                    <option value="Tarih">Tarih</option>
                    <option value="Biyoloji">Biyoloji</option>
                    <option value="İngilizce">İngilizce</option>
                  </select>
                </div>
              </div>

              {/* Sınıf Katılım Kodu Şeridi */}
              {(() => {
                const currentManaged = managedClasses.find((c) => c.id === selectedClass);
                const joinCode = currentManaged?.joinCode || "SINIF-8A-8844";
                return (
                  <div
                    style={{
                      marginBottom: "1rem",
                      padding: "0.65rem 0.9rem",
                      background: "rgba(198, 146, 59, 0.08)",
                      border: "1px dashed var(--md-accent-gold)",
                      borderRadius: "var(--radius-sm)",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      flexWrap: "wrap",
                      gap: "0.5rem",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                      <span style={{ fontSize: "1.1rem" }}>🔑</span>
                      <div>
                        <div style={{ fontSize: "0.72rem", color: "var(--md-text-muted)", fontWeight: 700 }}>
                          SINIF KATILIM KODU (Öğrenci & Veli İçin):
                        </div>
                        <div style={{ fontSize: "0.95rem", fontWeight: 800, color: "var(--md-navy-primary)", fontFamily: "var(--font-mono)" }}>
                          {joinCode}
                        </div>
                      </div>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <span style={{ fontSize: "0.72rem", color: "var(--md-text-muted)" }}>
                        Öğrenci kaydolunca veli otomatik entegre olur
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          if (typeof navigator !== "undefined" && navigator.clipboard) {
                            navigator.clipboard.writeText(joinCode);
                            setCopiedCodeToast(joinCode);
                            setTimeout(() => setCopiedCodeToast(null), 2500);
                          }
                        }}
                        className="md-btn md-btn-secondary"
                        style={{ padding: "0.25rem 0.6rem", fontSize: "0.75rem" }}
                      >
                        {copiedCodeToast === joinCode ? "✓ Kopyalandı!" : "Kodu Kopyala"}
                      </button>
                    </div>
                  </div>
                );
              })()}

              <div className="md-form-group">
                <label className="md-label">İşlenen Ders Konusu / Etkinlik Başlığı *</label>
                <input
                  type="text"
                  className="md-input"
                  placeholder="Örn: Önermelerde Koşullu Önerme ve Doğruluk Tabloları"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                />
              </div>
            </div>

            {/* Yoklama Bölümü */}
            <div className="md-card" style={{ padding: "1.5rem" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: "0.5rem",
                  marginBottom: "1rem",
                }}
              >
                <div>
                  <h3 style={{ fontSize: "1.1rem", color: "var(--md-navy-primary)" }}>
                    2. Sınıf Yoklaması ({currentClassObj.name})
                  </h3>
                  <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.3rem" }}>
                    <span className="md-chip md-chip-present">Geldi: {presentCount}</span>
                    <span className="md-chip md-chip-absent">Gelmedi: {absentCount}</span>
                    <span className="md-chip md-chip-excused">İzinli: {excusedCount}</span>
                    <span className="md-chip md-chip-late">Geç: {lateCount}</span>
                  </div>
                </div>

                <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                  <button
                    type="button"
                    onClick={() => setActiveSubTab("fotograf")}
                    className="md-btn md-btn-secondary"
                    style={{
                      padding: "0.45rem 0.85rem",
                      fontSize: "0.8rem",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.4rem",
                    }}
                  >
                    📸 Fotoğraf Yükleme Masası
                  </button>
                  <button
                    type="button"
                    onClick={handleMarkAllPresent}
                    className="md-btn md-btn-secondary"
                    style={{ padding: "0.45rem 0.85rem", fontSize: "0.8rem" }}
                  >
                    ✓ Tümünü Geldi Yap
                  </button>
                </div>
              </div>

              {/* Attendance Table */}
              <div
                style={{
                  overflowX: "auto",
                  border: "1px solid var(--md-cream-border)",
                  borderRadius: "var(--radius-sm)",
                }}
              >
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.875rem" }}>
                  <thead>
                    <tr style={{ background: "var(--md-cream-surface)", textAlign: "left" }}>
                      <th style={{ padding: "0.65rem 0.85rem", width: "60px" }}>No</th>
                      <th style={{ padding: "0.65rem 0.85rem" }}>Öğrenci Adı Soyadı</th>
                      <th style={{ padding: "0.65rem 0.85rem", textAlign: "center" }}>Yoklama Durumu</th>
                    </tr>
                  </thead>
                  <tbody>
                    {yoklama.map((y) => (
                      <tr
                        key={y.studentId}
                        style={{
                          borderTop: "1px solid var(--md-cream-border)",
                          background:
                            y.status === "gelmedi"
                              ? "rgba(176, 42, 55, 0.05)"
                              : y.status === "gec"
                              ? "rgba(5, 81, 96, 0.05)"
                              : "transparent",
                        }}
                      >
                        <td style={{ padding: "0.65rem 0.85rem", fontWeight: 700, color: "var(--md-text-muted)" }}>
                          {y.studentNo}
                        </td>
                        <td style={{ padding: "0.65rem 0.85rem" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                            {/* Öğrenci Adının Hemen Solundaki Küçük Daire Avatar */}
                            <div
                              onClick={() => {
                                const found = MOCK_STUDENTS_9A.find((s) => s.id === y.studentId);
                                if (found) setSelectedStudentForPhoto(found);
                              }}
                              title="Fotoğrafı güncellemek veya vesikalığı büyütmek için tıklayınız"
                              style={{
                                width: "36px",
                                height: "36px",
                                minWidth: "36px",
                                borderRadius: "50%",
                                overflow: "hidden",
                                border: "2px solid var(--md-accent-gold)",
                                background: "#e8edf3",
                                boxShadow: "0 1px 3px rgba(18, 38, 70, 0.15)",
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                transition: "transform 0.15s",
                              }}
                            >
                              <img
                                src={getAvatarUrl(y.studentId, y.studentName, y.studentNo)}
                                alt={y.studentName}
                                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                              />
                            </div>

                            <div>
                              <div style={{ fontWeight: 700, color: "var(--md-navy-primary)", fontSize: "0.9rem" }}>
                                {y.studentName}
                              </div>
                              <div style={{ fontSize: "0.7rem", color: "var(--md-text-muted)" }}>
                                9-A • Vesikalık Kayıtlı
                              </div>
                            </div>
                          </div>
                        </td>
                        <td style={{ padding: "0.65rem 0.85rem" }}>
                          <div style={{ display: "flex", justifyContent: "center", gap: "0.3rem" }}>
                            <button
                              type="button"
                              onClick={() => handleStatusChange(y.studentId, "geldi")}
                              style={{
                                padding: "0.3rem 0.6rem",
                                borderRadius: "4px",
                                border: "none",
                                fontSize: "0.75rem",
                                fontWeight: 700,
                                cursor: "pointer",
                                background: y.status === "geldi" ? "var(--status-present)" : "var(--md-cream-surface)",
                                color: y.status === "geldi" ? "#ffffff" : "var(--md-text-secondary)",
                              }}
                            >
                              Geldi
                            </button>
                            <button
                              type="button"
                              onClick={() => handleStatusChange(y.studentId, "gelmedi")}
                              style={{
                                padding: "0.3rem 0.6rem",
                                borderRadius: "4px",
                                border: "none",
                                fontSize: "0.75rem",
                                fontWeight: 700,
                                cursor: "pointer",
                                background: y.status === "gelmedi" ? "var(--status-absent)" : "var(--md-cream-surface)",
                                color: y.status === "gelmedi" ? "#ffffff" : "var(--md-text-secondary)",
                              }}
                            >
                              Yok
                            </button>
                            <button
                              type="button"
                              onClick={() => handleStatusChange(y.studentId, "gec")}
                              style={{
                                padding: "0.3rem 0.6rem",
                                borderRadius: "4px",
                                border: "none",
                                fontSize: "0.75rem",
                                fontWeight: 700,
                                cursor: "pointer",
                                background: y.status === "gec" ? "var(--status-late)" : "var(--md-cream-surface)",
                                color: y.status === "gec" ? "#ffffff" : "var(--md-text-secondary)",
                              }}
                            >
                              Geç
                            </button>
                            <button
                              type="button"
                              onClick={() => handleStatusChange(y.studentId, "izinli")}
                              style={{
                                padding: "0.3rem 0.6rem",
                                borderRadius: "4px",
                                border: "none",
                                fontSize: "0.75rem",
                                fontWeight: 700,
                                cursor: "pointer",
                                background: y.status === "izinli" ? "var(--status-excused)" : "var(--md-cream-surface)",
                                color: y.status === "izinli" ? "#ffffff" : "var(--md-text-secondary)",
                              }}
                            >
                              İzinli
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Sınıf Tavsiyesi ve Notlar */}
            <div className="md-card" style={{ padding: "1.5rem" }}>
              <h3 style={{ fontSize: "1.1rem", marginBottom: "1rem", color: "var(--md-navy-primary)" }}>
                3. Sınıf Tavsiyesi ve Süreç Değerlendirme Notu
              </h3>

              <div className="md-form-group">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.3rem" }}>
                  <label className="md-label" style={{ margin: 0 }}>
                    Sınıfa Verilen Haftalık Tavsiye (Örn: "Şu konudan 2 test çözülecek") *
                  </label>
                  <span style={{ fontSize: "0.72rem", color: "var(--md-accent-gold)", fontWeight: 700 }}>
                    ⚡ Hızlı Şablonlar
                  </span>
                </div>

                {/* Hızlı Tavsiye Şablonları */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem", marginBottom: "0.5rem" }}>
                  {QUICK_TAVSIYE_TEMPLATES.map((tpl, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setOdev(tpl.text)}
                      className="md-btn md-btn-secondary"
                      style={{ fontSize: "0.72rem", padding: "0.2rem 0.55rem", borderRadius: "999px" }}
                      title="Bu şablonu tavsiye alanına ekle"
                    >
                      {tpl.label}
                    </button>
                  ))}
                </div>

                <textarea
                  className="md-textarea"
                  rows={2}
                  value={odev}
                  onChange={(e) => setOdev(e.target.value)}
                  placeholder="Örn: Mantık ve önermeler konusundan 2 test çözülecek; Maarif Alıştırma Kitabı Sayfa 30-33 arasındaki problemler incelenecek."
                />
                <span style={{ fontSize: "0.75rem", color: "var(--md-accent-gold)", fontWeight: 600, marginTop: "0.25rem", display: "block" }}>
                  💡 Kural: Maarif Modeli kapsamında tüm haftalık görev ve pekiştirmeler "Tavsiye" olarak tanımlanır. Öğrenci veya veli tamamladığında tik atarak onaylar ve şeffaf arşivde yeşil renkle saklanır.
                </span>
              </div>

              <div className="md-form-group">
                <label className="md-label">Ders İçi Gözlem & Öğretmen Notu</label>
                <textarea
                  className="md-textarea"
                  rows={2}
                  value={ogretmenNotu}
                  onChange={(e) => setOgretmenNotu(e.target.value)}
                  placeholder="Örn: Konu sınıf genelinde kavrandı, etkinlik aktif katılım ile tamamlandı."
                />
              </div>

              {/* Submit & E-Signature Action */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: "1rem",
                  marginTop: "1.25rem",
                  paddingTop: "1.25rem",
                  borderTop: "1px solid var(--md-cream-border)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <span style={{ fontSize: "1.2rem" }}>🔏</span>
                  <div style={{ fontSize: "0.8rem", color: "var(--md-text-secondary)" }}>
                    İmzalayan: <strong>{activeTeacher.name} ({activeTeacher.branchBadge})</strong>
                    <br />
                    Sertifika: {activeTeacher.eImzaSertifika}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleSaveDefter}
                  className="md-btn md-btn-primary"
                  style={{ padding: "0.75rem 1.5rem", fontSize: "0.95rem" }}
                >
                  🖊️ Defteri Kaydet ve E-İmzala
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Maarif Outcomes & Past Records */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            {/* Maarif Modeli Kazanım Seçici */}
            <div className="md-card" style={{ padding: "1.5rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
                <div>
                  <h3 style={{ fontSize: "1.1rem", color: "var(--md-navy-primary)" }}>
                    🎯 Maarif Modeli Kazanım Seçimi
                  </h3>
                  <p style={{ color: "var(--md-text-muted)", fontSize: "0.785rem" }}>
                    Derste hedeflenen beceri ve erdemleri işaretleyin
                  </p>
                </div>
                <span className="md-chip md-chip-gold">
                  {selectedKazanimlar.length} Seçili
                </span>
              </div>

              <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem", alignItems: "center", flexWrap: "wrap" }}>
                <input
                  type="text"
                  className="md-input"
                  placeholder="Kazanım, ders veya kod ara (örn: FEN, TÜR, İNG)..."
                  value={kazanimSearch}
                  onChange={(e) => setKazanimSearch(e.target.value)}
                  style={{ flex: 1, minWidth: "170px", fontSize: "0.85rem", padding: "0.5rem 0.8rem" }}
                />
                <button
                  type="button"
                  onClick={() => setFilterOnlyMyBranch(!filterOnlyMyBranch)}
                  style={{
                    padding: "0.5rem 0.75rem",
                    borderRadius: "var(--radius-sm)",
                    border: "1px solid var(--md-cream-border)",
                    background: filterOnlyMyBranch ? "var(--md-cream-surface)" : "#ffffff",
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    cursor: "pointer",
                    color: "var(--md-navy-primary)",
                  }}
                  title="Tüm dersleri veya sadece kendi branşınızı listeleyin"
                >
                  {filterOnlyMyBranch ? `🎯 Sadece ${activeTeacher.subject}` : "🌐 Tüm Dersler"}
                </button>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem", maxHeight: "360px", overflowY: "auto" }}>
                {filteredAvailableKazanimlar.map((k) => {
                  const isSelected = selectedKazanimlar.some((sel) => sel.id === k.id);
                  return (
                    <div
                      key={k.id}
                      onClick={() => handleToggleKazanim(k)}
                      style={{
                        padding: "0.85rem",
                        borderRadius: "var(--radius-sm)",
                        border: isSelected
                          ? "2px solid var(--md-navy-primary)"
                          : "1px solid var(--md-cream-border)",
                        background: isSelected ? "var(--md-cream-surface)" : "#ffffff",
                        cursor: "pointer",
                        transition: "all 0.15s",
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.3rem" }}>
                        <span
                          style={{
                            fontFamily: "var(--font-mono)",
                            fontSize: "0.75rem",
                            fontWeight: 700,
                            color: "var(--md-navy-primary)",
                            background: "rgba(18, 38, 70, 0.08)",
                            padding: "0.15rem 0.4rem",
                            borderRadius: "4px",
                          }}
                        >
                          {k.kod}
                        </span>
                        <div style={{ display: "flex", gap: "0.3rem" }}>
                          <span className="md-chip md-chip-gold" style={{ fontSize: "0.7rem", padding: "0.1rem 0.4rem" }}>
                            {k.erdemDeger}
                          </span>
                          <span className="md-chip md-chip-navy" style={{ fontSize: "0.7rem", padding: "0.1rem 0.4rem" }}>
                            {k.beceriAlani}
                          </span>
                        </div>
                      </div>

                      <div style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--md-text-primary)", marginBottom: "0.2rem" }}>
                        {k.title}
                      </div>

                      <div style={{ fontSize: "0.775rem", color: "var(--md-text-secondary)", lineHeight: 1.35 }}>
                        {k.ogrenmeCiktisi}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Geçmiş Defter Kayıtları */}
            <div className="md-card" style={{ padding: "1.5rem" }}>
              <h3 style={{ fontSize: "1.1rem", marginBottom: "1rem", color: "var(--md-navy-primary)" }}>
                📋 Bugün Doldurulan Defterler ({selectedClass === "cls-9a" ? "9-A" : "Sınıf"})
              </h3>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {pastRecords.map((rec) => (
                  <div
                    key={rec.id}
                    style={{
                      padding: "0.85rem 1rem",
                      borderRadius: "var(--radius-sm)",
                      background: "var(--md-cream-surface)",
                      border: "1px solid var(--md-cream-border)",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.3rem" }}>
                      <span style={{ fontWeight: 700, fontSize: "0.9rem", color: "var(--md-navy-primary)" }}>
                        {rec.lessonHour}. Ders: {rec.subject}
                      </span>
                      <span
                        style={{
                          fontSize: "0.7rem",
                          color: "var(--status-present)",
                          fontWeight: 700,
                          background: "var(--status-present-bg)",
                          padding: "0.15rem 0.45rem",
                          borderRadius: "4px",
                        }}
                      >
                        ✓ {rec.imzalandi ? "E-İmzalı" : "Beklemede"}
                      </span>
                    </div>

                    <div style={{ fontSize: "0.825rem", color: "var(--md-text-primary)", marginBottom: "0.25rem" }}>
                      <strong>Konu:</strong> {rec.topic}
                    </div>

                    <div style={{ fontSize: "0.75rem", color: "var(--md-text-muted)" }}>
                      Öğretmen: {rec.teacherName} • Onay: {rec.onaylayanYonetici || "İdare Onayında"}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: GELİŞMİŞ SINIF YÖNETİMİ & ÖĞRENCİYE TAVSİYE YAZMA */}
      {activeSubTab === "yonetim" && (
        <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "1.75rem", alignItems: "start" }}>
          {/* Left Column: Sınıf Öğrenci Listesi & Tavsiye Formu */}
          <div className="md-card" style={{ padding: "1.5rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <div>
                <h3 style={{ fontSize: "1.15rem", color: "var(--md-navy-primary)" }}>
                  💡 Öğrenciye Özel Gelişim Tavsiyesi Ekle
                </h3>
                <p style={{ color: "var(--md-text-muted)", fontSize: "0.8rem" }}>
                  Yazdığınız tavsiye anında hem Öğrenci hem de Veli portalında görüntülenecektir.
                </p>
              </div>
              <span className="md-chip md-chip-gold">9-A Şubesi</span>
            </div>

            {tavsiyeSavedSuccess && (
              <div
                style={{
                  padding: "0.85rem 1rem",
                  background: "#d8f3dc",
                  border: "1px solid #2d6a4f",
                  borderRadius: "var(--radius-sm)",
                  color: "#1b4332",
                  fontWeight: 600,
                  fontSize: "0.85rem",
                  marginBottom: "1rem",
                }}
              >
                ✓ Öğretmen tavsiyesi kaydedildi! Öğrenci ve Veli portallarına anında senkronize edildi.
              </div>
            )}

            <form onSubmit={handleSaveTavsiye}>
              <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: "1rem", marginBottom: "0.75rem" }}>
                <div className="md-form-group">
                  <label className="md-label">Öğrenci Seç *</label>
                  <select
                    value={targetStudentId}
                    onChange={(e) => setTargetStudentId(e.target.value)}
                    className="md-select"
                  >
                    {MOCK_STUDENTS_9A.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.studentNo} - {s.name} (Veli: {s.parentName})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="md-form-group">
                  <label className="md-label">Ders / Branş</label>
                  <select
                    value={tavsiyeSubject}
                    onChange={(e) => setTavsiyeSubject(e.target.value)}
                    className="md-select"
                  >
                    <option value="Matematik">Matematik</option>
                    <option value="Türkçe">Türkçe</option>
                    <option value="Fen Bilimleri">Fen Bilimleri</option>
                    <option value="İngilizce">İngilizce</option>
                    <option value="Sosyal Bilgiler">Sosyal Bilgiler</option>
                    <option value="T.C. İnkılap Tarihi ve Atatürkçülük">T.C. İnkılap Tarihi</option>
                    <option value="Din Kültürü ve Ahlak Bilgisi">Din Kültürü ve Ahlak Bilgisi</option>
                  </select>
                </div>
              </div>

              {/* Seçili Öğrencinin Vesikalık Avatar Kartı */}
              <div
                style={{
                  padding: "0.75rem 1rem",
                  borderRadius: "8px",
                  background: "var(--md-cream-surface)",
                  border: "1px solid var(--md-cream-border)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "0.75rem",
                  marginBottom: "1rem",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <div
                    style={{
                      width: "44px",
                      height: "44px",
                      borderRadius: "50%",
                      overflow: "hidden",
                      border: "2px solid var(--md-accent-gold)",
                      boxShadow: "0 1px 3px rgba(18, 38, 70, 0.15)",
                      flexShrink: 0,
                    }}
                  >
                    <img
                      src={getAvatarUrl(targetStudent.id, targetStudent.name, targetStudent.studentNo)}
                      alt={targetStudent.name}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  </div>
                  <div>
                    <div style={{ fontWeight: 800, color: "var(--md-navy-primary)", fontSize: "0.95rem" }}>
                      {targetStudent.name}
                    </div>
                    <div style={{ fontSize: "0.75rem", color: "var(--md-text-muted)" }}>
                      No: {targetStudent.studentNo} • Sınıf: 9-A • Veli: {targetStudent.parentName}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedStudentForPhoto(targetStudent)}
                  className="md-btn md-btn-secondary"
                  style={{ fontSize: "0.75rem", padding: "0.35rem 0.75rem" }}
                >
                  📷 Vesikalığı Güncelle / Çek
                </button>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
                <div className="md-form-group">
                  <label className="md-label">Haftalık Konu Başlığı *</label>
                  <input
                    type="text"
                    required
                    className="md-input"
                    value={tavsiyeKonu}
                    onChange={(e) => setTavsiyeKonu(e.target.value)}
                    placeholder="Örn: Koşullu Önermeler ve Kümeler"
                  />
                </div>

                <div className="md-form-group">
                  <label className="md-label">Hedef Beceri / Erdem Alanı</label>
                  <select
                    value={tavsiyeBeceri}
                    onChange={(e) => setTavsiyeBeceri(e.target.value)}
                    className="md-select"
                  >
                    <option value="Kavramsal Beceri (Akıl Yürütme)">Kavramsal Beceri (Akıl Yürütme)</option>
                    <option value="Sosyo-Duygusal Beceri & Erdem">Sosyo-Duygusal Beceri & Erdem</option>
                    <option value="Okuryazarlık (Problem Çözme)">Okuryazarlık (Problem Çözme)</option>
                    <option value="Eğilim (Bilimsel Merak & Azim)">Eğilim (Bilimsel Merak & Azim)</option>
                  </select>
                </div>
              </div>

              <div className="md-form-group">
                <label className="md-label">Tavsiye Türü / Öncelik</label>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <button
                    type="button"
                    onClick={() => setTavsiyeOncelik("normal")}
                    style={{
                      padding: "0.4rem 0.8rem",
                      borderRadius: "6px",
                      border: "none",
                      fontSize: "0.8rem",
                      fontWeight: 600,
                      cursor: "pointer",
                      background: tavsiyeOncelik === "normal" ? "var(--md-navy-primary)" : "var(--md-cream-surface)",
                      color: tavsiyeOncelik === "normal" ? "#fff" : "var(--md-text-secondary)",
                    }}
                  >
                    Normal Tavsiye
                  </button>
                  <button
                    type="button"
                    onClick={() => setTavsiyeOncelik("onemli")}
                    style={{
                      padding: "0.4rem 0.8rem",
                      borderRadius: "6px",
                      border: "none",
                      fontSize: "0.8rem",
                      fontWeight: 600,
                      cursor: "pointer",
                      background: tavsiyeOncelik === "onemli" ? "var(--md-accent-gold)" : "var(--md-cream-surface)",
                      color: tavsiyeOncelik === "onemli" ? "#fff" : "var(--md-text-secondary)",
                    }}
                  >
                    ⭐ Önemli Tavsiye
                  </button>
                  <button
                    type="button"
                    onClick={() => setTavsiyeOncelik("tebrik")}
                    style={{
                      padding: "0.4rem 0.8rem",
                      borderRadius: "6px",
                      border: "none",
                      fontSize: "0.8rem",
                      fontWeight: 600,
                      cursor: "pointer",
                      background: tavsiyeOncelik === "tebrik" ? "var(--status-present)" : "var(--md-cream-surface)",
                      color: tavsiyeOncelik === "tebrik" ? "#fff" : "var(--md-text-secondary)",
                    }}
                  >
                    🎉 Başarı Tebriği
                  </button>
                </div>
              </div>

              <div className="md-form-group">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.3rem" }}>
                  <label className="md-label" style={{ margin: 0 }}>Öğretmen Tavsiye Metni & Rehber Notu *</label>
                  <span style={{ fontSize: "0.72rem", color: "var(--md-accent-gold)", fontWeight: 700 }}>
                    ⚡ Hızlı Şablonlar
                  </span>
                </div>

                {/* Hızlı Tavsiye Şablonları */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem", marginBottom: "0.5rem" }}>
                  {QUICK_TAVSIYE_TEMPLATES.map((tpl, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setTavsiyeMetni(tpl.text)}
                      className="md-btn md-btn-secondary"
                      style={{ fontSize: "0.72rem", padding: "0.2rem 0.55rem", borderRadius: "999px" }}
                      title="Bu şablonu tavsiye alanına ekle"
                    >
                      {tpl.label}
                    </button>
                  ))}
                </div>

                <textarea
                  required
                  className="md-textarea"
                  rows={4}
                  value={tavsiyeMetni}
                  onChange={(e) => setTavsiyeMetni(e.target.value)}
                  placeholder={`Örn: ${targetStudent.name} derste önermeler konusunu çok iyi anladı. Çalışma Kitabı Sayfa 32'deki mantıksal ispat sorularını çözmesi akıl yürütme becerisini pekiştirecektir...`}
                />
              </div>

              <button type="submit" className="md-btn md-btn-primary" style={{ width: "100%", padding: "0.75rem" }}>
                💾 Tavsiyeyi Kaydet (Öğrenci & Veliye Anında İlet)
              </button>
            </form>
          </div>

          {/* Right Column: Verilen Son Tavsiyeler & Sınıf Başarı Dağılımı */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <div className="md-card" style={{ padding: "1.5rem" }}>
              <h3 style={{ fontSize: "1.1rem", marginBottom: "0.75rem", color: "var(--md-navy-primary)" }}>
                📋 İletilen Öğretmen Tavsiyeleri
              </h3>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {allTavsiyeler.map((t) => (
                  <div
                    key={t.id}
                    style={{
                      padding: "0.85rem 1rem",
                      borderRadius: "var(--radius-sm)",
                      background: "var(--md-cream-surface)",
                      border: "1px solid var(--md-cream-border)",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.25rem" }}>
                      <strong style={{ fontSize: "0.875rem", color: "var(--md-navy-primary)" }}>
                        {t.studentName} ({t.subject})
                      </strong>
                      <span className="md-chip md-chip-gold" style={{ fontSize: "0.7rem", padding: "0.1rem 0.4rem" }}>
                        {t.oncelik === "tebrik" ? "Tebrik" : "Tavsiye"}
                      </span>
                    </div>

                    <div style={{ fontSize: "0.8rem", color: "var(--md-text-secondary)", lineHeight: 1.4 }}>
                      "{t.tavsiyeMetni}"
                    </div>

                    <div style={{ fontSize: "0.7rem", color: "var(--md-text-muted)", marginTop: "0.3rem" }}>
                      Tarih: {t.tarih} • {t.teacherName}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 3: ÖĞRENCİ FOTOĞRAF YÖNETİMİ & BROWSER-IMAGE-COMPRESSION YÜKLEME ALANI */}
      {activeSubTab === "fotograf" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {/* Bilgilendirme ve Kural Banner'ı */}
          <div
            className="md-card"
            style={{
              padding: "1.5rem",
              background: "linear-gradient(135deg, #122646 0%, #1a3359 100%)",
              color: "#ffffff",
              border: "1.5px solid var(--md-accent-gold)",
              boxShadow: "var(--md-elevation-3)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem" }}>
              <div style={{ maxWidth: "750px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.4rem" }}>
                  <span style={{ fontSize: "1.6rem" }}>📸</span>
                  <h3 style={{ fontSize: "1.25rem", fontWeight: 800, color: "#ffffff" }}>
                    Öğrenci Fotoğraf Yükleme ve Sıkıştırma Masası
                  </h3>
                </div>
                <p style={{ color: "rgba(255,255,255,0.85)", fontSize: "0.875rem", lineHeight: 1.5 }}>
                  Türkiye Yüzyılı Maarif Modeli ve MEB dijital sınıf defteri standartlarında, öğrenci fotoğrafları
                  istemci tarafında <strong>browser-image-compression</strong> kütüphanesiyle otomatik olarak{" "}
                  <strong>150 KB altına (&lt; 142 KB)</strong> sıkıştırılır ve 3:4 vesikalık formatına dönüştürülür.
                </p>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem", alignItems: "flex-end" }}>
                <span
                  style={{
                    background: "rgba(45, 106, 79, 0.85)",
                    color: "#ffffff",
                    border: "1px solid #74c69d",
                    padding: "0.35rem 0.75rem",
                    borderRadius: "999px",
                    fontSize: "0.78rem",
                    fontWeight: 700,
                    display: "flex",
                    alignItems: "center",
                    gap: "0.4rem",
                  }}
                >
                  🛡️ browser-image-compression &lt; 150 KB Aktif
                </span>
                <span
                  style={{
                    background: "rgba(198, 146, 59, 0.25)",
                    color: "var(--md-accent-gold)",
                    border: "1px solid var(--md-accent-gold)",
                    padding: "0.25rem 0.65rem",
                    borderRadius: "999px",
                    fontSize: "0.75rem",
                    fontWeight: 600,
                  }}
                >
                  📐 3:4 Vesikalık (400 x 533 px)
                </span>
              </div>
            </div>
          </div>

          {/* Başarı Bildirimi */}
          {photoSavedToast && (
            <div
              style={{
                padding: "1rem 1.5rem",
                background: "#d8f3dc",
                border: "1.5px solid #2d6a4f",
                borderRadius: "var(--radius-sm)",
                color: "#1b4332",
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                boxShadow: "var(--md-elevation-2)",
              }}
            >
              <span style={{ fontSize: "1.3rem" }}>✅</span>
              <div>
                <strong>Fotoğraf Başarıyla Sıkıştırıldı ve Sisteme Kaydedildi!</strong>
                <div style={{ fontSize: "0.85rem", fontWeight: 400 }}>
                  Görsel 150 KB altına optimize edildi. Sınıf yoklama listesinde ve öğrenci/veli panelinde anında güncellendi.
                </div>
              </div>
            </div>
          )}

          {/* Çalışma Alanı: 2 Kolon (Sol: Yükleme & Sıkıştırma Laboratuvarı, Sağ: Sınıf Öğrenci Listesi / Galerisi) */}
          <div style={{ display: "grid", gridTemplateColumns: "1.15fr 1fr", gap: "1.75rem", alignItems: "start" }}>
            {/* SOL KOLON: Fotoğraf Yükleme, Sıkıştırma & Önizleme */}
            <div className="md-card" style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              <div style={{ borderBottom: "1.5px solid var(--md-cream-border)", paddingBottom: "0.75rem" }}>
                <h4 style={{ fontSize: "1.1rem", color: "var(--md-navy-primary)", fontWeight: 700 }}>
                  1. Fotoğraf Yükleme ve browser-image-compression Optimizasyonu
                </h4>
                <p style={{ color: "var(--md-text-muted)", fontSize: "0.8rem" }}>
                  Fotoğrafı seçin veya sürükleyin; sistem anında &lt; 150 KB altına sıkıştıracaktır.
                </p>
              </div>

              {/* Öğrenci Seçimi */}
              <div className="md-form-group">
                <label className="md-label">İşlem Yapılacak Öğrenci</label>
                <select
                  value={photoTargetStudentId}
                  onChange={(e) => {
                    setPhotoTargetStudentId(e.target.value);
                    setPhotoCompressData(null);
                  }}
                  className="md-select"
                  style={{ fontSize: "0.95rem", fontWeight: 600 }}
                >
                  {MOCK_STUDENTS_9A.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.studentNo} - {s.name} ({getStoredStudentPhoto(s.id) ? "Vesikalık Kayıtlı" : "Varsayılan Avatar"})
                    </option>
                  ))}
                </select>
              </div>

              {/* Mevcut Öğrenci Kısa Kartı */}
              {(() => {
                const cur = MOCK_STUDENTS_9A.find((s) => s.id === photoTargetStudentId) || MOCK_STUDENTS_9A[0];
                const hasCustom = Boolean(getStoredStudentPhoto(cur.id));
                return (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "0.75rem 1rem",
                      background: "var(--md-cream-surface)",
                      borderRadius: "var(--radius-sm)",
                      border: "1px solid var(--md-cream-border)",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                      <div
                        style={{
                          width: "44px",
                          height: "44px",
                          borderRadius: "50%",
                          overflow: "hidden",
                          border: "2px solid var(--md-accent-gold)",
                          boxShadow: "0 2px 4px rgba(18, 38, 70, 0.15)",
                        }}
                      >
                        <img
                          src={getAvatarUrl(cur.id, cur.name, cur.studentNo)}
                          alt={cur.name}
                          style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, color: "var(--md-navy-primary)", fontSize: "0.95rem" }}>
                          {cur.name}
                        </div>
                        <div style={{ fontSize: "0.75rem", color: "var(--md-text-muted)" }}>
                          Öğrenci No: {cur.studentNo} • Sınıf: 9-A • Veli: {cur.parentName}
                        </div>
                      </div>
                    </div>

                    <span
                      style={{
                        padding: "0.25rem 0.6rem",
                        borderRadius: "999px",
                        fontSize: "0.72rem",
                        fontWeight: 700,
                        background: hasCustom ? "var(--status-present-bg)" : "rgba(18, 38, 70, 0.08)",
                        color: hasCustom ? "var(--status-present)" : "var(--md-text-secondary)",
                      }}
                    >
                      {hasCustom ? "✓ Özel Vesikalık" : "Varsayılan Avatar"}
                    </span>
                  </div>
                );
              })()}

              {/* Drag & Drop Yükleme Alanı ve Butonlar */}
              <div
                style={{
                  border: "2px dashed var(--md-accent-gold)",
                  borderRadius: "var(--radius-md)",
                  padding: "1.75rem 1.25rem",
                  textAlign: "center",
                  background: isPhotoCompressing ? "rgba(198, 146, 59, 0.05)" : "var(--md-cream-surface)",
                  cursor: "pointer",
                  transition: "background 0.2s",
                }}
                onClick={() => {
                  const input = document.getElementById("direct-file-input") as HTMLInputElement;
                  if (input) input.click();
                }}
                onDragOver={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  const file = e.dataTransfer.files?.[0];
                  if (file && file.type.startsWith("image/")) {
                    handlePhotoFileUpload(file);
                  }
                }}
              >
                <input
                  id="direct-file-input"
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handlePhotoFileUpload(file);
                  }}
                />

                <div style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>
                  {isPhotoCompressing ? "⏳" : "📁"}
                </div>

                <div style={{ fontWeight: 700, color: "var(--md-navy-primary)", fontSize: "0.95rem" }}>
                  {isPhotoCompressing
                    ? "browser-image-compression çalışıyor... Lütfen bekleyiniz..."
                    : "Görsel Dosyasını Buraya Sürükleyin veya Seçin"}
                </div>
                <div style={{ fontSize: "0.8rem", color: "var(--md-text-muted)", marginTop: "0.3rem" }}>
                  JPG, PNG veya WEBP (Otomatik olarak 3:4 vesikalık kırpılır ve &lt; 150 KB yapılır)
                </div>

                <div style={{ display: "flex", justifyContent: "center", gap: "0.75rem", marginTop: "1rem" }}>
                  <button
                    type="button"
                    className="md-btn md-btn-primary"
                    style={{ fontSize: "0.85rem", padding: "0.5rem 1rem" }}
                    onClick={(e) => {
                      e.stopPropagation();
                      const input = document.getElementById("direct-file-input") as HTMLInputElement;
                      if (input) input.click();
                    }}
                  >
                    📂 Bilgisayardan Seç
                  </button>

                  <button
                    type="button"
                    className="md-btn md-btn-secondary"
                    style={{ fontSize: "0.85rem", padding: "0.5rem 1rem" }}
                    onClick={(e) => {
                      e.stopPropagation();
                      const s = MOCK_STUDENTS_9A.find((st) => st.id === photoTargetStudentId);
                      if (s) setSelectedStudentForPhoto(s);
                    }}
                  >
                    📸 Kamera ile Canlı Çek
                  </button>
                </div>
              </div>

              {/* Sıkıştırma Telemetrisi & Önizleme Bölümü */}
              {photoCompressData && (
                <div
                  style={{
                    background: "var(--md-cream-bg)",
                    border: "1px solid var(--md-cream-border)",
                    borderRadius: "var(--radius-sm)",
                    padding: "1.25rem",
                    display: "flex",
                    flexDirection: "column",
                    gap: "1rem",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <strong style={{ color: "var(--md-navy-primary)", fontSize: "0.95rem" }}>
                      📊 browser-image-compression Telemetri Sonuçları
                    </strong>
                    <span
                      style={{
                        background: photoCompressData.compressedKb <= 150 ? "#d8f3dc" : "#ffccd5",
                        color: photoCompressData.compressedKb <= 150 ? "#1b4332" : "#800f2f",
                        border: `1px solid ${photoCompressData.compressedKb <= 150 ? "#74c69d" : "#ff4d6d"}`,
                        padding: "0.2rem 0.6rem",
                        borderRadius: "999px",
                        fontSize: "0.75rem",
                        fontWeight: 700,
                      }}
                    >
                      {photoCompressData.compressedKb <= 150 ? "✓ 150 KB Kuralı Sağlandı" : "Sınır Aşıldı"}
                    </span>
                  </div>

                  {/* 4'lü İstatistik Kutusu */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "0.5rem" }}>
                    <div style={{ background: "#ffffff", padding: "0.6rem", borderRadius: "6px", textAlign: "center", border: "1px solid var(--md-cream-border)" }}>
                      <div style={{ fontSize: "0.68rem", color: "var(--md-text-muted)" }}>Orijinal</div>
                      <div style={{ fontSize: "0.875rem", fontWeight: 700, color: "var(--md-text-secondary)" }}>
                        {photoCompressData.originalKb} KB
                      </div>
                    </div>

                    <div style={{ background: "#ffffff", padding: "0.6rem", borderRadius: "6px", textAlign: "center", border: "1px solid #74c69d" }}>
                      <div style={{ fontSize: "0.68rem", color: "var(--status-present)" }}>Sıkıştırılmış</div>
                      <div style={{ fontSize: "0.875rem", fontWeight: 800, color: "var(--status-present)" }}>
                        {photoCompressData.compressedKb} KB
                      </div>
                    </div>

                    <div style={{ background: "#ffffff", padding: "0.6rem", borderRadius: "6px", textAlign: "center", border: "1px solid var(--md-cream-border)" }}>
                      <div style={{ fontSize: "0.68rem", color: "var(--md-text-muted)" }}>Tasarruf</div>
                      <div style={{ fontSize: "0.875rem", fontWeight: 700, color: "var(--md-accent-gold)" }}>
                        -%{Math.max(0, Math.round(((photoCompressData.originalKb - photoCompressData.compressedKb) / (photoCompressData.originalKb || 1)) * 100))}
                      </div>
                    </div>

                    <div style={{ background: "#ffffff", padding: "0.6rem", borderRadius: "6px", textAlign: "center", border: "1px solid var(--md-cream-border)" }}>
                      <div style={{ fontSize: "0.68rem", color: "var(--md-text-muted)" }}>Çözünürlük</div>
                      <div style={{ fontSize: "0.875rem", fontWeight: 700, color: "var(--md-navy-primary)" }}>
                        {photoCompressData.width}x{photoCompressData.height}
                      </div>
                    </div>
                  </div>

                  {/* Görsel Önizlemeler: Hem 3:4 Vesikalık hem Sınıf Yoklama Avatarı */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: "1rem", alignItems: "center" }}>
                    {/* 3:4 Vesikalık Kart */}
                    <div style={{ textAlign: "center" }}>
                      <div style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--md-text-muted)", marginBottom: "0.3rem" }}>
                        Resmi Vesikalık (3:4 Oranı)
                      </div>
                      <div
                        style={{
                          width: "120px",
                          height: "160px",
                          margin: "0 auto",
                          borderRadius: "6px",
                          overflow: "hidden",
                          border: "2px solid var(--md-accent-gold)",
                          boxShadow: "var(--md-elevation-2)",
                        }}
                      >
                        <img
                          src={photoCompressData.dataUrl}
                          alt="Vesikalık Önizleme"
                          style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                      </div>
                    </div>

                    {/* Sınıf Defteri Yoklama Görünümü Simülasyonu */}
                    <div>
                      <div style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--md-text-muted)", marginBottom: "0.4rem" }}>
                        Sınıf Defteri Yoklama Önizlemesi
                      </div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.75rem",
                          padding: "0.6rem 0.8rem",
                          background: "#ffffff",
                          borderRadius: "var(--radius-sm)",
                          border: "1px solid var(--md-cream-border)",
                        }}
                      >
                        <div
                          style={{
                            width: "36px",
                            height: "36px",
                            borderRadius: "50%",
                            overflow: "hidden",
                            border: "2px solid var(--md-accent-gold)",
                            boxShadow: "0 1px 3px rgba(18, 38, 70, 0.15)",
                          }}
                        >
                          <img
                            src={photoCompressData.dataUrl}
                            alt="Yoklama Avatar"
                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                          />
                        </div>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: "0.85rem", color: "var(--md-navy-primary)" }}>
                            {MOCK_STUDENTS_9A.find((s) => s.id === photoTargetStudentId)?.name}
                          </div>
                          <div style={{ fontSize: "0.7rem", color: "var(--status-present)", fontWeight: 600 }}>
                            ● Geldi • Vesikalık Hazır
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Kaydet & Sıfırla Butonları */}
                  <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.5rem" }}>
                    <button
                      type="button"
                      onClick={handleSaveDirectPhoto}
                      className="md-btn md-btn-primary"
                      style={{ flex: 1, padding: "0.65rem 1rem", fontSize: "0.875rem" }}
                    >
                      💾 Fotoğrafı Kaydet ve Veritabanına Aktar (&lt; 150 KB)
                    </button>

                    <button
                      type="button"
                      onClick={() => setPhotoCompressData(null)}
                      className="md-btn md-btn-secondary"
                      style={{ padding: "0.65rem 1rem", fontSize: "0.85rem" }}
                    >
                      Vazgeç
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* SAĞ KOLON: 9-A Sınıfı Öğrenci Albümü & Hızlı Yönetim */}
            <div className="md-card" style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <h4 style={{ fontSize: "1.1rem", color: "var(--md-navy-primary)", fontWeight: 700 }}>
                    2. Sınıf Öğrenci Vesikalık Durum Listesi
                  </h4>
                  <p style={{ color: "var(--md-text-muted)", fontSize: "0.8rem" }}>
                    9-A Şubesi ({MOCK_STUDENTS_9A.length} Öğrenci)
                  </p>
                </div>
                <span className="md-chip md-chip-gold">9-A</span>
              </div>

              {/* Arama Alanı */}
              <input
                type="text"
                placeholder="Öğrenci adı veya numarası ara..."
                className="md-input"
                style={{ padding: "0.45rem 0.75rem", fontSize: "0.85rem" }}
                value={photoSearchQuery}
                onChange={(e) => setPhotoSearchQuery(e.target.value)}
              />

              {/* Öğrenci Listesi */}
              <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem", maxHeight: "550px", overflowY: "auto" }}>
                {MOCK_STUDENTS_9A.filter(
                  (s) =>
                    !photoSearchQuery ||
                    s.name.toLowerCase().includes(photoSearchQuery.toLowerCase()) ||
                    s.studentNo.includes(photoSearchQuery)
                ).map((student) => {
                  const hasCustom = Boolean(getStoredStudentPhoto(student.id));
                  const isSelected = photoTargetStudentId === student.id;

                  return (
                    <div
                      key={student.id}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "0.75rem 0.85rem",
                        borderRadius: "var(--radius-sm)",
                        background: isSelected ? "rgba(198, 146, 59, 0.08)" : "var(--md-cream-surface)",
                        border: isSelected ? "1.5px solid var(--md-accent-gold)" : "1px solid var(--md-cream-border)",
                        transition: "all 0.15s ease",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                        {/* 36px Dairesel Avatar */}
                        <div
                          onClick={() => setSelectedStudentForPhoto(student)}
                          title="Fotoğrafı büyük görmek veya kameradan çekmek için tıklayın"
                          style={{
                            width: "38px",
                            height: "38px",
                            minWidth: "38px",
                            borderRadius: "50%",
                            overflow: "hidden",
                            border: "2px solid var(--md-accent-gold)",
                            boxShadow: "0 1px 3px rgba(18, 38, 70, 0.15)",
                            cursor: "pointer",
                          }}
                        >
                          <img
                            src={getAvatarUrl(student.id, student.name, student.studentNo)}
                            alt={student.name}
                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                          />
                        </div>

                        <div>
                          <div style={{ fontWeight: 700, color: "var(--md-navy-primary)", fontSize: "0.875rem" }}>
                            {student.studentNo} • {student.name}
                          </div>
                          <div style={{ fontSize: "0.72rem", color: "var(--md-text-muted)" }}>
                            Veli: {student.parentName}
                          </div>
                        </div>
                      </div>

                      <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                        <span
                          style={{
                            padding: "0.2rem 0.5rem",
                            borderRadius: "999px",
                            fontSize: "0.7rem",
                            fontWeight: 600,
                            background: hasCustom ? "var(--status-present-bg)" : "var(--md-cream-border)",
                            color: hasCustom ? "var(--status-present)" : "var(--md-text-secondary)",
                          }}
                        >
                          {hasCustom ? "✓ Yüklü (&lt;150KB)" : "Varsayılan"}
                        </span>

                        <button
                          type="button"
                          onClick={() => {
                            setPhotoTargetStudentId(student.id);
                            const fileInput = document.getElementById("direct-file-input") as HTMLInputElement;
                            if (fileInput) fileInput.click();
                          }}
                          className="md-btn md-btn-secondary"
                          style={{ padding: "0.3rem 0.6rem", fontSize: "0.75rem" }}
                          title="Bu öğrenciye fotoğraf yükle"
                        >
                          Yükle
                        </button>

                        {hasCustom && (
                          <button
                            type="button"
                            onClick={() => handleResetStudentPhoto(student.id)}
                            style={{
                              background: "none",
                              border: "none",
                              cursor: "pointer",
                              fontSize: "0.85rem",
                              color: "var(--status-absent)",
                              padding: "0.2rem",
                            }}
                            title="Fotoğrafı kaldır ve varsayılan avatara dön"
                          >
                            🗑️
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sınıf Oluşturma Modalı */}
      {showCreateClassModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(10, 22, 40, 0.75)",
            backdropFilter: "blur(6px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 600,
            padding: "1rem",
          }}
          onClick={() => setShowCreateClassModal(false)}
        >
          <div
            className="md-card"
            style={{
              width: "100%",
              maxWidth: "520px",
              padding: "2rem",
              background: "#ffffff",
              border: "2px solid var(--md-accent-gold)",
              boxShadow: "var(--md-elevation-4)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <span style={{ fontSize: "1.5rem" }}>🏫</span>
                <h3 style={{ fontSize: "1.2rem", fontWeight: 800, color: "var(--md-navy-primary)", margin: 0 }}>
                  Yeni Dijital Sınıf Oluştur
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowCreateClassModal(false)}
                style={{ background: "none", border: "none", fontSize: "1.3rem", cursor: "pointer", color: "var(--md-text-muted)" }}
              >
                ✕
              </button>
            </div>

            <p style={{ fontSize: "0.85rem", color: "var(--md-text-secondary)", marginBottom: "1.25rem", lineHeight: 1.45 }}>
              Açacağınız sınıf için sistem otomatik olarak bir <strong>Sınıf Katılım Kodu</strong> üretir. Öğrenciler bu kodla sınıfa kaydolur ve velileri de otomatik olarak o sınıfa bağlanır.
            </p>

            <form onSubmit={handleCreateNewClass} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: "1rem" }}>
                <div className="md-form-group">
                  <label className="md-label">Sınıf / Şube Adı *</label>
                  <input
                    type="text"
                    required
                    className="md-input"
                    placeholder="Örn: 8-A"
                    value={newClassName}
                    onChange={(e) => setNewClassName(e.target.value)}
                  />
                </div>

                <div className="md-form-group">
                  <label className="md-label">Kademe (Sınıf Seviyesi)</label>
                  <select
                    className="md-select"
                    value={newClassGrade}
                    onChange={(e) => {
                      const g = Number(e.target.value);
                      setNewClassGrade(g);
                      setNewClassName(`${g}-${newClassBranch}`);
                    }}
                  >
                    <option value={5}>5. Sınıf</option>
                    <option value={6}>6. Sınıf</option>
                    <option value={7}>7. Sınıf</option>
                    <option value={8}>8. Sınıf (LGS)</option>
                    <option value={9}>9. Sınıf</option>
                    <option value={10}>10. Sınıf</option>
                  </select>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "1rem" }}>
                <div className="md-form-group">
                  <label className="md-label">Şube Harfi</label>
                  <input
                    type="text"
                    className="md-input"
                    value={newClassBranch}
                    onChange={(e) => {
                      const b = e.target.value.toUpperCase();
                      setNewClassBranch(b);
                      setNewClassName(`${newClassGrade}-${b}`);
                    }}
                    placeholder="A"
                  />
                </div>

                <div className="md-form-group">
                  <label className="md-label">Rehber Öğretmen</label>
                  <input
                    type="text"
                    readOnly
                    className="md-input"
                    value="Ahmet Yılmaz (Matematik)"
                    style={{ background: "var(--md-cream-surface)" }}
                  />
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem", marginTop: "1rem" }}>
                <button
                  type="button"
                  onClick={() => setShowCreateClassModal(false)}
                  className="md-btn md-btn-secondary"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="md-btn md-btn-primary"
                  style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}
                >
                  <span>🚀</span>
                  <span>Sınıfı Oluştur & Katılım Kodu Üret</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Öğrenci Vesikalık Fotoğrafı Kırpma & Kamera Modal */}
      {selectedStudentForPhoto && (
        <StudentPhotoModal
          student={selectedStudentForPhoto}
          isOpen={Boolean(selectedStudentForPhoto)}
          onClose={() => setSelectedStudentForPhoto(null)}
          onPhotoSaved={() => setPhotoRefreshKey((k) => k + 1)}
        />
      )}
    </div>
  );
}
