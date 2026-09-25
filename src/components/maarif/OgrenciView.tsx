"use client";

import React, { useState, useEffect } from "react";
import { MOCK_STUDENTS_9A, MOCK_TEACHER_TAVSIYELER } from "@/lib/maarif/seedData";
import HaftalikTakipEkrani from "./HaftalikTakipEkrani";
import { getStoredStudentPhoto, getDefaultVesikalikAvatar } from "@/lib/maarif/studentPhotoHelper";
import StudentPhotoModal from "./StudentPhotoModal";
import type { TeacherTavsiye } from "@/types/maarif";
import {
  isTavsiyeCompleted,
  toggleTavsiyeCompletion,
  getTavsiyeCompletionInfo,
} from "@/lib/maarif/tavsiyeHelper";
import TavsiyeFeedbackToast from "./TavsiyeFeedbackToast";
import GunlukOgrenciAsistani from "./GunlukOgrenciAsistani";
import DersProgramiEditor from "./DersProgramiEditor";
import {
  getStudentEnrollment,
  enrollStudentWithCode,
  getStoredClasses,
  type StudentEnrollment,
} from "@/lib/maarif/sinifHelper";

export default function OgrenciView() {
  const [selectedStudentIndex, setSelectedStudentIndex] = useState<number>(0);
  const currentStudent = MOCK_STUDENTS_9A[selectedStudentIndex] || MOCK_STUDENTS_9A[0];
  const [selectedWeek, setSelectedWeek] = useState<number>(4);
  const [subTab, setSubTab] = useState<"asistan" | "haftalikTakip" | "programEditor" | "sinifim">("asistan");
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [joinCodeInput, setJoinCodeInput] = useState("");
  const [joinStatusMessage, setJoinStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [enrollment, setEnrollment] = useState<StudentEnrollment | null>(null);
  const [photoRefreshKey, setPhotoRefreshKey] = useState(0);

  useEffect(() => {
    setEnrollment(getStudentEnrollment(currentStudent.id));

    const onPhotoUpdated = () => {
      setPhotoRefreshKey((k) => k + 1);
    };
    const onTavsiyeUpdated = () => {
      setPhotoRefreshKey((k) => k + 1);
    };
    const onClassEnrolled = (e: any) => {
      if (e.detail?.studentId === currentStudent.id) {
        setEnrollment(e.detail.enrollment);
      }
    };
    window.addEventListener("student-photo-updated", onPhotoUpdated);
    window.addEventListener("tavsiye-status-updated", onTavsiyeUpdated);
    window.addEventListener("student-class-enrolled", onClassEnrolled);
    return () => {
      window.removeEventListener("student-photo-updated", onPhotoUpdated);
      window.removeEventListener("tavsiye-status-updated", onTavsiyeUpdated);
      window.removeEventListener("student-class-enrolled", onClassEnrolled);
    };
  }, [currentStudent.id]);

  const handleEnrollSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!joinCodeInput.trim()) return;
    const res = enrollStudentWithCode(joinCodeInput, currentStudent);
    if (res.success && res.enrolledClass) {
      setJoinStatusMessage({ type: "success", text: res.message });
      setEnrollment(getStudentEnrollment(currentStudent.id));
      setTimeout(() => {
        setJoinStatusMessage(null);
        setShowJoinModal(false);
        setJoinCodeInput("");
      }, 2500);
    } else {
      setJoinStatusMessage({ type: "error", text: res.message });
    }
  };

  const studentAvatar =
    getStoredStudentPhoto(currentStudent.id) ||
    getDefaultVesikalikAvatar(currentStudent.name, currentStudent.studentNo);

  const haftalikKonular = [
    {
      gun: "Pazartesi",
      ders: "Matematik",
      saat: "1. ve 2. Ders",
      konu: "Önermeler, Doğruluk Değerleri ve Denklik",
      kod: "MAT.9.1.1",
      erdem: "Adalet & Akıl Yürütme",
      ogretmen: "Ahmet Yılmaz",
      odev: "Çalışma Kitabı Sayfa 24-26",
      hasTavsiye: true,
    },
    {
      gun: "Salı",
      ders: "Türk Dili ve Edebiyatı",
      saat: "3. ve 4. Ders",
      konu: "Edebi Metinlerde Örtük Anlam ve Metin Çözümlemesi",
      kod: "TDE.9.1.1",
      erdem: "Dürüstlük",
      ogretmen: "Zeynep Kaya",
      odev: "Kaşağı Hikayesi Tahlil Yazısı",
      hasTavsiye: true,
    },
    {
      gun: "Çarşamba",
      ders: "Fizik",
      saat: "2. Ders",
      konu: "Fizik Biliminin Doğası ve Bilimsel Araştırma Etiği",
      kod: "FİZ.9.1.1",
      erdem: "Bilimsel Dürüstlük",
      ogretmen: "Mehmet Demir",
      odev: "Deney Güvenlik Raporu",
      hasTavsiye: false,
    },
    {
      gun: "Perşembe",
      ders: "Tarih",
      saat: "5. Ders",
      konu: "Tarihsel Kanıt ve Kaynak Çeşitliliği",
      kod: "TAR.9.1.1",
      erdem: "Tarafsızlık",
      ogretmen: "Fatma Çelik",
      odev: "Kaynak Analizi Çalışma Yaprağı",
      hasTavsiye: false,
    },
    {
      gun: "Cuma",
      ders: "İngilizce",
      saat: "4. Ders",
      konu: "Intercultural Communication & Cultural Respect",
      kod: "İNG.9.1.1",
      erdem: "Saygı & Nezaket",
      ogretmen: "Canan Şahin",
      odev: "İngilizce Diyalog Kaydı",
      hasTavsiye: false,
    },
  ];

  const studentTavsiyeler = MOCK_TEACHER_TAVSIYELER.filter(
    (t) => t.studentId === currentStudent.id
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.75rem" }}>
      {/* Student Banner */}
      <div
        className="md-card"
        style={{
          padding: "1.5rem",
          background: "linear-gradient(135deg, #102444 0%, #1a3359 100%)",
          color: "#ffffff",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "1.25rem",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          {/* Öğrenci Vesikalık Avatarı (Tıklanabilir) */}
          <div
            onClick={() => setShowPhotoModal(true)}
            title="Vesikalık profil fotoğrafınızı güncellemek için tıklayınız"
            style={{
              width: "58px",
              height: "58px",
              borderRadius: "50%",
              overflow: "hidden",
              border: "2.5px solid var(--md-accent-gold)",
              boxShadow: "0 4px 12px rgba(198, 146, 59, 0.35)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "#e8edf3",
              flexShrink: 0,
              transition: "transform 0.15s",
            }}
          >
            <img
              src={studentAvatar}
              alt={currentStudent.name}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>

          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
              <h2 style={{ fontSize: "1.35rem", fontWeight: 800, color: "#ffffff" }}>
                {currentStudent.name}
              </h2>
              <span
                style={{
                  background: "rgba(255, 255, 255, 0.15)",
                  padding: "0.15rem 0.5rem",
                  borderRadius: "4px",
                  fontSize: "0.75rem",
                  fontFamily: "var(--font-mono)",
                }}
              >
                No: {currentStudent.studentNo} • Sınıf: {enrollment ? enrollment.className : currentStudent.className}
              </span>
              {enrollment && (
                <span
                  style={{
                    background: "var(--status-present-bg)",
                    color: "var(--status-present)",
                    padding: "0.15rem 0.5rem",
                    borderRadius: "4px",
                    fontSize: "0.72rem",
                    fontWeight: 700,
                  }}
                >
                  ✓ Kod ile Kayıtlı (Veli Entegre)
                </span>
              )}
            </div>
            <p style={{ color: "#c2d6ed", fontSize: "0.85rem", marginTop: "0.2rem", marginBottom: "0.4rem" }}>
              Öğrenci Portalı • Haftalık Ders Akışı, Günlük Asistan & Öğretmen Tavsiyeleri
            </p>

            {/* Hızlı Öğrenci/Kademe Değiştirici */}
            <div style={{ display: "flex", gap: "0.3rem", flexWrap: "wrap", alignItems: "center" }}>
              <span style={{ fontSize: "0.72rem", color: "#a8c0de", fontWeight: 700 }}>
                Öğrenci Seç:
              </span>
              {[
                { name: "Ali Kerem (8-A)", idx: 0 },
                { name: "Zeynep D. (7-A)", idx: 8 },
                { name: "Deniz K. (6-A)", idx: 10 },
                { name: "Efe Y. (5-A)", idx: 12 },
              ].map((std) => (
                <button
                  key={std.idx}
                  type="button"
                  onClick={() => setSelectedStudentIndex(std.idx)}
                  style={{
                    padding: "0.15rem 0.5rem",
                    borderRadius: "999px",
                    border: selectedStudentIndex === std.idx ? "1.5px solid var(--md-accent-gold)" : "1px solid rgba(255,255,255,0.25)",
                    background: selectedStudentIndex === std.idx ? "rgba(255,255,255,0.25)" : "rgba(255,255,255,0.08)",
                    color: "#ffffff",
                    fontSize: "0.72rem",
                    cursor: "pointer",
                  }}
                >
                  {std.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
          <button
            type="button"
            onClick={() => setShowJoinModal(true)}
            className="md-btn md-btn-secondary"
            style={{
              padding: "0.45rem 0.85rem",
              fontSize: "0.8rem",
              display: "flex",
              alignItems: "center",
              gap: "0.4rem",
              background: "rgba(255, 255, 255, 0.15)",
              color: "#ffffff",
              border: "1px solid rgba(255, 255, 255, 0.3)",
            }}
          >
            <span>🔑</span>
            <span>Sınıf Katılım Kodu Gir</span>
          </button>

          <button
            type="button"
            onClick={() => setShowPhotoModal(true)}
            className="md-btn md-btn-gold"
            style={{ padding: "0.45rem 0.85rem", fontSize: "0.8rem", display: "flex", alignItems: "center", gap: "0.4rem" }}
          >
            <span>📷</span>
            <span>Vesikalık Çek / Yükle</span>
          </button>

          <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
            <span style={{ fontSize: "0.8rem", color: "#a8c0de" }}>Hafta:</span>
            <select
              value={selectedWeek}
              onChange={(e) => setSelectedWeek(Number(e.target.value))}
              style={{
                padding: "0.45rem 0.75rem",
                background: "rgba(255, 255, 255, 0.15)",
                color: "#ffffff",
                border: "1px solid rgba(255, 255, 255, 0.25)",
                borderRadius: "8px",
                fontSize: "0.85rem",
                cursor: "pointer",
              }}
            >
              <option value={3} style={{ color: "#000" }}>3. Hafta (14 - 18 Eylül)</option>
              <option value={4} style={{ color: "#000" }}>4. Hafta (21 - 25 Eylül) • Güncel</option>
              <option value={5} style={{ color: "#000" }}>5. Hafta (28 Eylül - 2 Ekim)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Sınıf Katılım Kodu Giriş Modalı */}
      {showJoinModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(10, 22, 40, 0.8)",
            backdropFilter: "blur(8px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 300,
            padding: "1rem",
          }}
          onClick={() => setShowJoinModal(false)}
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
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                <span style={{ fontSize: "1.4rem" }}>🔑</span>
                <h3 style={{ fontSize: "1.2rem", color: "var(--md-navy-primary)", margin: 0 }}>
                  Sınıf Katılım Kodu ile Sınıfa Kaydol
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowJoinModal(false)}
                style={{ background: "none", border: "none", fontSize: "1.2rem", cursor: "pointer", color: "var(--md-text-muted)" }}
              >
                ✕
              </button>
            </div>

            <p style={{ fontSize: "0.85rem", color: "var(--md-text-secondary)", marginBottom: "1rem", lineHeight: 1.5 }}>
              Öğretmeninizin "Sınıf Oluştur" ekranında ürettiği <strong>Sınıf Katılım Kodunu</strong> giriniz.
              <br />
              <strong style={{ color: "var(--md-navy-primary)" }}>Önemli Kural:</strong> Siz bu kodla sınıfa kaydolduğunuzda, <strong>Veliniz de otomatik olarak bu sınıfa entegre edilir.</strong>
            </p>

            {joinStatusMessage && (
              <div
                style={{
                  padding: "0.85rem 1rem",
                  borderRadius: "8px",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  marginBottom: "1rem",
                  background: joinStatusMessage.type === "success" ? "#d8f3dc" : "#ffebee",
                  color: joinStatusMessage.type === "success" ? "#1b4332" : "#c62828",
                  border: joinStatusMessage.type === "success" ? "1px solid #52b788" : "1px solid #ef5350",
                }}
              >
                {joinStatusMessage.text}
              </div>
            )}

            <form onSubmit={handleEnrollSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div className="md-form-group">
                <label className="md-label">Sınıf Katılım Kodu</label>
                <input
                  type="text"
                  required
                  className="md-input"
                  placeholder="Örn: SINIF-8A-8844"
                  value={joinCodeInput}
                  onChange={(e) => setJoinCodeInput(e.target.value.toUpperCase())}
                  style={{ fontFamily: "var(--font-mono)", fontSize: "1rem", fontWeight: 700, letterSpacing: "1px" }}
                />
              </div>

              {/* Hızlı Test Çipleri */}
              <div>
                <span style={{ fontSize: "0.75rem", color: "var(--md-text-muted)", fontWeight: 600 }}>
                  Test İçin Hazır Öğretmen Sınıf Kodları:
                </span>
                <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap", marginTop: "0.4rem" }}>
                  {[
                    { name: "8-A", code: "SINIF-8A-8844" },
                    { name: "9-A", code: "SINIF-9A-9901" },
                    { name: "7-A", code: "SINIF-7A-7703" },
                    { name: "6-B", code: "SINIF-6B-6622" },
                  ].map((cls) => (
                    <button
                      key={cls.code}
                      type="button"
                      onClick={() => setJoinCodeInput(cls.code)}
                      style={{
                        padding: "0.25rem 0.55rem",
                        borderRadius: "6px",
                        border: "1px dashed var(--md-cream-border)",
                        background: "var(--md-cream-surface)",
                        fontSize: "0.75rem",
                        fontWeight: 600,
                        cursor: "pointer",
                        color: "var(--md-navy-primary)",
                      }}
                    >
                      {cls.name} ({cls.code})
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem", marginTop: "0.75rem" }}>
                <button
                  type="button"
                  onClick={() => setShowJoinModal(false)}
                  className="md-btn md-btn-secondary"
                  style={{ padding: "0.5rem 1rem", fontSize: "0.85rem" }}
                >
                  Vazgeç
                </button>
                <button
                  type="submit"
                  className="md-btn md-btn-primary"
                  style={{ padding: "0.5rem 1.25rem", fontSize: "0.85rem" }}
                >
                  Sınıfa Kaydol & Veliyi Entegre Et
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Sub Tabs within Student View */}
      <div style={{ display: "flex", gap: "0.75rem", borderBottom: "2px solid var(--md-cream-border)", paddingBottom: "0.5rem", flexWrap: "wrap" }}>
        <button
          type="button"
          onClick={() => setSubTab("asistan")}
          style={{
            padding: "0.6rem 1.25rem",
            borderRadius: "8px",
            border: "none",
            fontSize: "0.9rem",
            fontWeight: 700,
            cursor: "pointer",
            background: subTab === "asistan" ? "var(--md-navy-primary)" : "var(--md-cream-surface)",
            color: subTab === "asistan" ? "#ffffff" : "var(--md-navy-primary)",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          <span>🤖</span>
          <span>Günlük Öğrenci Asistanı (Okul & Ev Eşleşmesi)</span>
        </button>

        <button
          type="button"
          onClick={() => setSubTab("programEditor")}
          style={{
            padding: "0.6rem 1.25rem",
            borderRadius: "8px",
            border: "none",
            fontSize: "0.9rem",
            fontWeight: 700,
            cursor: "pointer",
            background: subTab === "programEditor" ? "var(--md-navy-primary)" : "var(--md-cream-surface)",
            color: subTab === "programEditor" ? "#ffffff" : "var(--md-navy-primary)",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          <span>🗓️</span>
          <span>Okul Ders Programım (Giriş & Düzenleme)</span>
        </button>

        <button
          type="button"
          onClick={() => setSubTab("haftalikTakip")}
          style={{
            padding: "0.6rem 1.25rem",
            borderRadius: "8px",
            border: "none",
            fontSize: "0.9rem",
            fontWeight: 700,
            cursor: "pointer",
            background: subTab === "haftalikTakip" ? "var(--md-navy-primary)" : "var(--md-cream-surface)",
            color: subTab === "haftalikTakip" ? "#ffffff" : "var(--md-navy-primary)",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          <span>📅</span>
          <span>5, 6, 7, 8. Sınıf Haftalık Takip & Görev/Test Ekranı</span>
        </button>

        <button
          type="button"
          onClick={() => setSubTab("sinifim")}
          style={{
            padding: "0.6rem 1.25rem",
            borderRadius: "8px",
            border: "none",
            fontSize: "0.9rem",
            fontWeight: 700,
            cursor: "pointer",
            background: subTab === "sinifim" ? "var(--md-navy-primary)" : "var(--md-cream-surface)",
            color: subTab === "sinifim" ? "#ffffff" : "var(--md-navy-primary)",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          <span>🎓</span>
          <span>{enrollment ? enrollment.className : "9-A"} Sınıfım & Öğretmen Tavsiyeleri</span>
        </button>
      </div>

      {/* Tab Renderings */}
      {subTab === "asistan" && (
        <GunlukOgrenciAsistani
          studentId={currentStudent.id}
          studentName={currentStudent.name}
          grade={enrollment ? enrollment.grade : (Number(currentStudent.className.split("-")[0]) || 8)}
          userType="ogrenci"
        />
      )}

      {subTab === "programEditor" && (
        <DersProgramiEditor studentId={currentStudent.id} />
      )}

      {subTab === "haftalikTakip" && (
        <HaftalikTakipEkrani
          userType="ogrenci"
          initialGrade={enrollment ? enrollment.grade : (Number(currentStudent.className.split("-")[0]) || 8)}
        />
      )}

      {subTab === "sinifim" && (
        /* Two Column Layout: Left Haftalık Konular, Right Öğretmen Tavsiyeleri */
        <div style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: "1.75rem", alignItems: "start" }}>
          {/* Left: Haftalık Ders Konularım */}
          <div className="md-card" style={{ padding: "1.5rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <div>
                <h3 style={{ fontSize: "1.15rem", color: "var(--md-navy-primary)" }}>
                  📅 Bu Haftaki Ders Konularım & Müfredat Planım
                </h3>
                <p style={{ color: "var(--md-text-muted)", fontSize: "0.8rem" }}>
                  Türkiye Yüzyılı Maarif Modeli kapsamında bu hafta işlenen dersler
                </p>
              </div>
            <span className="md-chip md-chip-gold">{selectedWeek}. Hafta</span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
            {haftalikKonular.map((k, idx) => (
              <div
                key={idx}
                style={{
                  padding: "1rem 1.25rem",
                  borderRadius: "var(--radius-sm)",
                  background: "var(--md-cream-surface)",
                  border: "1px solid var(--md-cream-border)",
                  borderLeft: "5px solid var(--md-navy-primary)",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.4rem",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <span
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontWeight: 700,
                        fontSize: "0.75rem",
                        background: "rgba(18, 38, 70, 0.08)",
                        padding: "0.15rem 0.4rem",
                        borderRadius: "4px",
                        color: "var(--md-navy-primary)",
                      }}
                    >
                      {k.gun} • {k.saat}
                    </span>
                    <strong style={{ fontSize: "0.95rem", color: "var(--md-navy-primary)" }}>
                      {k.ders}
                    </strong>
                  </div>

                  <span className="md-chip md-chip-gold" style={{ fontSize: "0.7rem" }}>
                    {k.erdem}
                  </span>
                </div>

                <div style={{ fontSize: "0.875rem", color: "var(--md-text-primary)", fontWeight: 600 }}>
                  {k.konu}
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    fontSize: "0.75rem",
                    color: "var(--md-text-muted)",
                    paddingTop: "0.3rem",
                    borderTop: "1px solid var(--md-cream-border)",
                  }}
                >
                  <span>Öğretmen: <strong>{k.ogretmen}</strong></span>
                  <span>💡 Öğretmen Tavsiyesi: <em>{k.odev}</em></span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Öğretmenlerimin Tavsiyeleri */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <div className="md-card" style={{ padding: "1.5rem", border: "1.5px solid var(--md-accent-gold)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.75rem" }}>
              <span style={{ fontSize: "1.3rem" }}>💡</span>
              <div>
                <h3 style={{ fontSize: "1.1rem", color: "var(--md-navy-primary)" }}>
                  Öğretmenlerimin Tavsiyeleri
                </h3>
                <p style={{ color: "var(--md-text-muted)", fontSize: "0.8rem" }}>
                  Ders öğretmenlerinin bizzat senin için yazdığı gelişim önerileri
                </p>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {studentTavsiyeler.map((t) => {
                const isCompleted = isTavsiyeCompleted(t.id);
                const info = getTavsiyeCompletionInfo(t.id);

                return (
                  <div
                    key={t.id}
                    style={{
                      padding: "1rem",
                      borderRadius: "var(--radius-sm)",
                      background: isCompleted
                        ? "rgba(216, 243, 220, 0.45)"
                        : t.oncelik === "tebrik"
                        ? "rgba(45, 106, 79, 0.06)"
                        : "#ffffff",
                      border: isCompleted
                        ? "1.5px solid #52b788"
                        : t.oncelik === "tebrik"
                        ? "1.5px solid var(--status-present)"
                        : "1px solid var(--md-cream-border)",
                      boxShadow: "var(--md-elevation-1)",
                      transition: "all 0.2s ease",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.4rem" }}>
                      <span style={{ fontWeight: 700, fontSize: "0.9rem", color: isCompleted ? "#1b4332" : "var(--md-navy-primary)" }}>
                        {t.teacherName}
                      </span>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                        <span
                          style={{
                            fontSize: "0.7rem",
                            padding: "0.15rem 0.45rem",
                            borderRadius: "4px",
                            background: isCompleted
                              ? "#d8f3dc"
                              : t.oncelik === "tebrik"
                              ? "var(--status-present-bg)"
                              : "var(--md-cream-surface)",
                            color: isCompleted
                              ? "#1b4332"
                              : t.oncelik === "tebrik"
                              ? "var(--status-present)"
                              : "var(--md-navy-primary)",
                            fontWeight: 700,
                          }}
                        >
                          {isCompleted ? "✓ Tamamlandı" : t.subject}
                        </span>
                      </div>
                    </div>

                    <div style={{ fontSize: "0.785rem", color: "var(--md-accent-teal)", fontWeight: 600, marginBottom: "0.4rem" }}>
                      Konu: {t.haftalikKonu} • {t.beceriAlani}
                    </div>

                    <p
                      style={{
                        fontSize: "0.85rem",
                        color: isCompleted ? "#2d6a4f" : "var(--md-text-secondary)",
                        lineHeight: 1.5,
                        marginBottom: "0.6rem",
                        textDecoration: isCompleted ? "line-through" : "none",
                        opacity: isCompleted ? 0.88 : 1,
                      }}
                    >
                      "{t.tavsiyeMetni}"
                    </p>

                    {/* Checkbox ile Tamamlama & Şeffaf Arşiv */}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        paddingTop: "0.4rem",
                        borderTop: "1px dashed var(--md-cream-border)",
                        flexWrap: "wrap",
                        gap: "0.4rem",
                      }}
                    >
                      <label
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.4rem",
                          fontSize: "0.78rem",
                          fontWeight: 700,
                          color: isCompleted ? "var(--status-present)" : "var(--md-navy-primary)",
                          cursor: "pointer",
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={isCompleted}
                          onChange={() => toggleTavsiyeCompletion(t.id, "ogrenci")}
                          style={{
                            width: "16px",
                            height: "16px",
                            cursor: "pointer",
                            accentColor: "var(--status-present)",
                          }}
                        />
                        {isCompleted ? "✓ Yerine Getirildi (Şeffaf Arşiv)" : "Tavsiyeyi yerine getirdim"}
                      </label>

                      <div style={{ fontSize: "0.7rem", color: "var(--md-text-muted)" }}>
                        {isCompleted && info?.completedAt ? `Tamamlanma: ${info.completedAt}` : `Tarih: ${t.tarih}`}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Goals Card */}
          <div className="md-card" style={{ padding: "1.25rem" }}>
            <h4 style={{ fontSize: "0.95rem", color: "var(--md-navy-primary)", marginBottom: "0.5rem" }}>
              🎯 Bu Haftaki Maarif Hedeflerin
            </h4>
            <ul style={{ fontSize: "0.825rem", color: "var(--md-text-secondary)", paddingLeft: "1.2rem", lineHeight: 1.6 }}>
              <li>Matematik: Önermeler doğruluk tablosunda 20 pratik soru çöz.</li>
              <li>Edebiyat: Dürüstlük erdemi üzerine yazdığın tahlili Cuma gününe kadar teslim et.</li>
              <li>Fizik: Bilim etiği kurallarını içeren infografiği incele.</li>
            </ul>
          </div>
        </div>
      </div>
      )}

      {/* Öğrenci Vesikalık Fotoğrafı Kırpma & Kamera Modal */}
      {showPhotoModal && (
        <StudentPhotoModal
          student={currentStudent}
          isOpen={showPhotoModal}
          onClose={() => setShowPhotoModal(false)}
          onPhotoSaved={() => setPhotoRefreshKey((k) => k + 1)}
        />
      )}
      {/* Pozitif Geri Bildirim ve Rozet Bildirimi */}
      <TavsiyeFeedbackToast />
    </div>
  );
}
