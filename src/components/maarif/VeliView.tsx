"use client";

import React, { useState, useEffect } from "react";
import {
  MOCK_STUDENTS_9A,
  MOCK_DEFTER_KAYITLARI,
  MOCK_TEACHER_TAVSIYELER,
} from "@/lib/maarif/seedData";
import HaftalikTakipEkrani from "./HaftalikTakipEkrani";
import { getStoredStudentPhoto, getDefaultVesikalikAvatar } from "@/lib/maarif/studentPhotoHelper";
import StudentPhotoModal from "./StudentPhotoModal";
import type { Student, TeacherTavsiye } from "@/types/maarif";
import {
  isTavsiyeCompleted,
  toggleTavsiyeCompletion,
  getTavsiyeCompletionInfo,
} from "@/lib/maarif/tavsiyeHelper";
import TavsiyeFeedbackToast from "./TavsiyeFeedbackToast";
import GunlukOgrenciAsistani from "./GunlukOgrenciAsistani";
import { getStudentEnrollment, type StudentEnrollment } from "@/lib/maarif/sinifHelper";

export default function VeliView() {
  const [selectedStudentId, setSelectedStudentId] = useState<string>(MOCK_STUDENTS_9A[0].id);
  const [veliSubTab, setVeliSubTab] = useState<"asistan" | "haftalikTakip" | "ozet">("asistan");
  const [showIntegrateModal, setShowIntegrateModal] = useState(false);
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [photoRefreshKey, setPhotoRefreshKey] = useState(0);
  const [integrationCode, setIntegrationCode] = useState("");
  const [integrationSuccess, setIntegrationSuccess] = useState(false);
  const [enrollment, setEnrollment] = useState<StudentEnrollment | null>(null);

  useEffect(() => {
    setEnrollment(getStudentEnrollment(selectedStudentId));

    const onPhotoUpdated = () => {
      setPhotoRefreshKey((k) => k + 1);
    };
    const onTavsiyeUpdated = () => {
      setPhotoRefreshKey((k) => k + 1);
    };
    const onClassEnrolled = (e: any) => {
      if (e.detail?.studentId === selectedStudentId) {
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
  }, [selectedStudentId]);

  // Message to teacher state
  const [messageSubject, setMessageSubject] = useState("Ders ve Tavsiye Takibi Hakkında");
  const [messageText, setMessageText] = useState("");
  const [messageSent, setMessageSent] = useState(false);

  const student = MOCK_STUDENTS_9A.find((s) => s.id === selectedStudentId) || MOCK_STUDENTS_9A[0];

  const childAvatar =
    getStoredStudentPhoto(student.id) ||
    getDefaultVesikalikAvatar(student.name, student.studentNo);

  const studentLogs = MOCK_DEFTER_KAYITLARI.map((log) => {
    const status = log.yoklama.find((y) => y.studentId === student.id)?.status || "geldi";
    return { ...log, myStatus: status };
  });

  const studentTavsiyeler = MOCK_TEACHER_TAVSIYELER.filter(
    (t) => t.studentId === student.id
  );

  const handleIntegrateStudent = (e: React.FormEvent) => {
    e.preventDefault();
    setIntegrationSuccess(true);
    setTimeout(() => {
      setIntegrationSuccess(false);
      setShowIntegrateModal(false);
      setIntegrationCode("");
    }, 2500);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim()) return;
    setMessageSent(true);
    setTimeout(() => {
      setMessageSent(false);
      setMessageText("");
    }, 3000);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.75rem" }}>
      {/* Parent Banner with Entegre Öğrenci Info */}
      <div
        className="md-card"
        style={{
          padding: "1.5rem",
          background: "linear-gradient(135deg, #122646 0%, #1a3359 100%)",
          color: "#ffffff",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "1.25rem",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <div
            style={{
              width: "56px",
              height: "56px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, #c6923b 0%, #dfb26b 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.6rem",
              fontWeight: 800,
              color: "#122646",
              boxShadow: "0 4px 12px rgba(198, 146, 59, 0.35)",
            }}
          >
            👨‍👩‍👧
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <h2 style={{ fontSize: "1.35rem", fontWeight: 800, color: "#ffffff" }}>
                Veli Portalı: {student.parentName}
              </h2>
              <span
                style={{
                  background: "var(--status-present-bg)",
                  color: "var(--status-present)",
                  padding: "0.15rem 0.5rem",
                  borderRadius: "4px",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                }}
              >
                ● Çocuğun Hesabına Entegre
              </span>
              {enrollment && (
                <span
                  style={{
                    background: "rgba(198, 146, 59, 0.2)",
                    color: "var(--md-accent-gold)",
                    padding: "0.15rem 0.55rem",
                    borderRadius: "4px",
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    border: "1px solid rgba(198, 146, 59, 0.4)",
                  }}
                >
                  ✓ {enrollment.className} Sınıfına Otomatik Entegre Edildi
                </span>
              )}
            </div>

            {/* Çocuğun Bilgileri ve Vesikalık Daire Avatarı */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginTop: "0.4rem", flexWrap: "wrap" }}>
              <div
                onClick={() => setShowPhotoModal(true)}
                title="Çocuğunuzun vesikalık fotoğrafını incelemek/güncellemek için tıklayın"
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "50%",
                  overflow: "hidden",
                  border: "2px solid var(--md-accent-gold)",
                  cursor: "pointer",
                  background: "#e8edf3",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                  flexShrink: 0,
                }}
              >
                <img src={childAvatar} alt={student.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>

              <span style={{ color: "#c2d6ed", fontSize: "0.85rem" }}>
                Entegre Öğrenci: <strong>{student.name}</strong> ({enrollment ? enrollment.className : student.className} • No: {student.studentNo})
              </span>

              <button
                type="button"
                onClick={() => setShowPhotoModal(true)}
                className="md-btn md-btn-gold"
                style={{ padding: "0.25rem 0.65rem", fontSize: "0.75rem", display: "inline-flex", alignItems: "center", gap: "0.3rem" }}
              >
                <span>📷</span>
                <span>Vesikalık Çek / Yükle</span>
              </button>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", gap: "0.6rem" }}>
          <button
            onClick={() => setShowIntegrateModal(true)}
            className="md-btn md-btn-secondary"
            style={{ padding: "0.5rem 1rem", fontSize: "0.85rem" }}
          >
            + Başka Öğrenci Entegre Et
          </button>
        </div>
      </div>

      {/* Integration Modal */}
      {showIntegrateModal && (
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
          onClick={() => setShowIntegrateModal(false)}
        >
          <div
            className="md-card"
            style={{
              width: "100%",
              maxWidth: "500px",
              padding: "2rem",
              background: "#ffffff",
              border: "2px solid var(--md-accent-gold)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ fontSize: "1.2rem", color: "var(--md-navy-primary)", marginBottom: "0.5rem" }}>
              🔗 Çocuğunuzun Hesabına Entegre Olun
            </h3>
            <p style={{ fontSize: "0.85rem", color: "var(--md-text-secondary)", marginBottom: "1.25rem" }}>
              Okul idaresi veya rehber öğretmen tarafından verilen <strong>Öğrenci Veli Entegrasyon Kodu</strong> veya T.C. Kimlik / Okul No ile hesabınızı bağlayabilirsiniz.
            </p>

            {integrationSuccess ? (
              <div
                style={{
                  padding: "1rem",
                  background: "#d8f3dc",
                  color: "#1b4332",
                  borderRadius: "var(--radius-sm)",
                  fontWeight: 600,
                  fontSize: "0.9rem",
                  textAlign: "center",
                }}
              >
                ✓ Öğrenci hesabı başarıyla entegre edildi! Bilgiler senkronize ediliyor...
              </div>
            ) : (
              <form onSubmit={handleIntegrateStudent}>
                <div className="md-form-group">
                  <label className="md-label">Veli Entegrasyon Kodu (Örn: VELI-9A-104)</label>
                  <input
                    type="text"
                    required
                    className="md-input"
                    placeholder="VELI-9A-104"
                    value={integrationCode}
                    onChange={(e) => setIntegrationCode(e.target.value)}
                  />
                </div>

                <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem", marginTop: "1rem" }}>
                  <button type="button" onClick={() => setShowIntegrateModal(false)} className="md-btn md-btn-secondary">
                    İptal
                  </button>
                  <button type="submit" className="md-btn md-btn-primary">
                    Hesaba Entegre Ol
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Sub Tabs within Veli View */}
      <div style={{ display: "flex", gap: "0.75rem", borderBottom: "2px solid var(--md-cream-border)", paddingBottom: "0.5rem", flexWrap: "wrap" }}>
        <button
          type="button"
          onClick={() => setVeliSubTab("asistan")}
          style={{
            padding: "0.6rem 1.25rem",
            borderRadius: "8px",
            border: "none",
            fontSize: "0.9rem",
            fontWeight: 700,
            cursor: "pointer",
            background: veliSubTab === "asistan" ? "var(--md-navy-primary)" : "var(--md-cream-surface)",
            color: veliSubTab === "asistan" ? "#ffffff" : "var(--md-navy-primary)",
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
          onClick={() => setVeliSubTab("haftalikTakip")}
          style={{
            padding: "0.6rem 1.25rem",
            borderRadius: "8px",
            border: "none",
            fontSize: "0.9rem",
            fontWeight: 700,
            cursor: "pointer",
            background: veliSubTab === "haftalikTakip" ? "var(--md-navy-primary)" : "var(--md-cream-surface)",
            color: veliSubTab === "haftalikTakip" ? "#ffffff" : "var(--md-navy-primary)",
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
          onClick={() => setVeliSubTab("ozet")}
          style={{
            padding: "0.6rem 1.25rem",
            borderRadius: "8px",
            border: "none",
            fontSize: "0.9rem",
            fontWeight: 700,
            cursor: "pointer",
            background: veliSubTab === "ozet" ? "var(--md-navy-primary)" : "var(--md-cream-surface)",
            color: veliSubTab === "ozet" ? "#ffffff" : "var(--md-navy-primary)",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          <span>📋</span>
          <span>Günlük Ders Defteri, Yoklama & Öğretmene Mesaj</span>
        </button>
      </div>

      {veliSubTab === "asistan" && (
        <GunlukOgrenciAsistani
          studentId={student.id}
          studentName={student.name}
          grade={enrollment ? enrollment.grade : (Number(student.className.split("-")[0]) || 8)}
          userType="veli"
        />
      )}

      {veliSubTab === "haftalikTakip" && (
        <HaftalikTakipEkrani
          userType="veli"
          initialGrade={enrollment ? enrollment.grade : (Number(student.className.split("-")[0]) || 8)}
        />
      )}

      {veliSubTab === "ozet" && (
        <>
          {/* Summary KPI Cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1.25rem" }}>
        <div className="md-card" style={{ padding: "1.25rem" }}>
          <div style={{ fontSize: "0.785rem", fontWeight: 700, color: "var(--md-text-muted)", textTransform: "uppercase" }}>
            Devamsızlık Durumu
          </div>
          <div style={{ fontSize: "2rem", fontWeight: 800, color: "var(--status-present)", marginTop: "0.2rem" }}>
            {student.devamsizlikGun} Gün
          </div>
          <div style={{ fontSize: "0.75rem", color: "var(--md-text-secondary)", marginTop: "0.15rem" }}>
            Kalan yasal hak: {10 - student.devamsizlikGun} gün
          </div>
        </div>

        <div className="md-card" style={{ padding: "1.25rem" }}>
          <div style={{ fontSize: "0.785rem", fontWeight: 700, color: "var(--md-text-muted)", textTransform: "uppercase" }}>
            Öğretmen Tavsiyesi
          </div>
          <div style={{ fontSize: "2rem", fontWeight: 800, color: "var(--md-accent-gold)", marginTop: "0.2rem" }}>
            {studentTavsiyeler.length} Not
          </div>
          <div style={{ fontSize: "0.75rem", color: "var(--status-present)", fontWeight: 600, marginTop: "0.15rem" }}>
            ✓ Bu hafta yeni gelişim tavsiyesi var
          </div>
        </div>

        <div className="md-card" style={{ padding: "1.25rem" }}>
          <div style={{ fontSize: "0.785rem", fontWeight: 700, color: "var(--md-text-muted)", textTransform: "uppercase" }}>
            Bugünkü Katılım
          </div>
          <div style={{ fontSize: "2rem", fontWeight: 800, color: "var(--md-navy-primary)", marginTop: "0.2rem" }}>
            Eksiksiz
          </div>
          <div style={{ fontSize: "0.75rem", color: "var(--status-present)", fontWeight: 600, marginTop: "0.15rem" }}>
            Tüm derslerde sınıfta bulundu
          </div>
        </div>

        <div className="md-card" style={{ padding: "1.25rem" }}>
          <div style={{ fontSize: "0.785rem", fontWeight: 700, color: "var(--md-text-muted)", textTransform: "uppercase" }}>
            Kazanım Uyumu
          </div>
          <div style={{ fontSize: "2rem", fontWeight: 800, color: "var(--md-accent-teal)", marginTop: "0.2rem" }}>
            %{student.kazanimTamamlamaOrani}
          </div>
          <div style={{ fontSize: "0.75rem", color: "var(--md-text-secondary)", marginTop: "0.15rem" }}>
            Maarif Modeli erdem ve beceri karnesi
          </div>
        </div>
      </div>

      {/* Two Columns: Left Teacher Advice & Daily Class Log, Right Direct Message to Teacher */}
      <div style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: "1.75rem", alignItems: "start" }}>
        {/* Left: Öğretmen Tavsiyeleri & Günlük Ders Defteri Akışı */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {/* Öğretmen Tavsiyeleri Bölümü */}
          <div className="md-card" style={{ padding: "1.5rem", border: "1.5px solid var(--md-accent-gold)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.85rem" }}>
              <span style={{ fontSize: "1.3rem" }}>💡</span>
              <div>
                <h3 style={{ fontSize: "1.1rem", color: "var(--md-navy-primary)" }}>
                  Öğretmen Tavsiyeleri & Gelişim Notları
                </h3>
                <p style={{ color: "var(--md-text-muted)", fontSize: "0.8rem" }}>
                  Ders öğretmenlerinin {student.name} için hazırladığı tavsiye ve öneriler
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
                        ? "rgba(45, 106, 79, 0.05)"
                        : "var(--md-cream-surface)",
                      border: isCompleted
                        ? "1.5px solid #52b788"
                        : t.oncelik === "tebrik"
                        ? "1.5px solid var(--status-present)"
                        : "1px solid var(--md-cream-border)",
                      transition: "all 0.2s ease",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.3rem" }}>
                      <strong style={{ fontSize: "0.95rem", color: isCompleted ? "#1b4332" : "var(--md-navy-primary)" }}>
                        {t.teacherName} ({t.subject})
                      </strong>
                      <span
                        style={{
                          fontSize: "0.7rem",
                          padding: "0.15rem 0.45rem",
                          borderRadius: "4px",
                          fontWeight: 700,
                          background: isCompleted
                            ? "#d8f3dc"
                            : t.oncelik === "tebrik"
                            ? "var(--status-present-bg)"
                            : "rgba(18, 38, 70, 0.08)",
                          color: isCompleted
                            ? "#1b4332"
                            : t.oncelik === "tebrik"
                            ? "var(--status-present)"
                            : "var(--md-navy-primary)",
                        }}
                      >
                        {isCompleted ? "✓ Tamamlandı" : t.oncelik === "tebrik" ? "⭐ Tebrik" : "💡 Gelişim Tavsiyesi"}
                      </span>
                    </div>

                    <div style={{ fontSize: "0.785rem", color: "var(--md-accent-teal)", fontWeight: 600, marginBottom: "0.4rem" }}>
                      İşlenen Konu: {t.haftalikKonu} • {t.beceriAlani}
                    </div>

                    <p
                      style={{
                        fontSize: "0.85rem",
                        color: isCompleted ? "#2d6a4f" : "var(--md-text-primary)",
                        lineHeight: 1.5,
                        marginBottom: "0.6rem",
                        textDecoration: isCompleted ? "line-through" : "none",
                        opacity: isCompleted ? 0.88 : 1,
                      }}
                    >
                      "{t.tavsiyeMetni}"
                    </p>

                    {/* Veli Onay Kutusu (Checkbox) & Şeffaf Arşiv */}
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
                          gap: "0.45rem",
                          fontSize: "0.78rem",
                          fontWeight: 700,
                          color: isCompleted ? "var(--status-present)" : "var(--md-navy-primary)",
                          cursor: "pointer",
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={isCompleted}
                          onChange={() => toggleTavsiyeCompletion(t.id, "veli")}
                          style={{
                            width: "16px",
                            height: "16px",
                            cursor: "pointer",
                            accentColor: "var(--status-present)",
                          }}
                        />
                        {isCompleted ? "✓ Çocuğum Bu Tavsiyeyi Tamamladı (Şeffaf Arşiv)" : "Çocuğum bu tavsiyeyi tamamladı"}
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

          {/* Günlük Ders Defteri Akışı */}
          <div className="md-card" style={{ padding: "1.5rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <div>
                <h3 style={{ fontSize: "1.1rem", color: "var(--md-navy-primary)" }}>
                  📅 Çocuğumun Günlük Ders Defteri (Bugün Ne İşlendi?)
                </h3>
                <p style={{ color: "var(--md-text-muted)", fontSize: "0.8rem" }}>
                  Öğretmenin sınıf defterine işlediği ders konuları, yoklama ve tavsiyeler
                </p>
              </div>
              <span className="md-chip md-chip-navy">Bugün</span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
              {studentLogs.map((log) => (
                <div
                  key={log.id}
                  style={{
                    padding: "1rem",
                    borderRadius: "var(--radius-sm)",
                    background: "var(--md-cream-surface)",
                    border: "1px solid var(--md-cream-border)",
                    borderLeft: "5px solid var(--md-navy-primary)",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.3rem" }}>
                    <span style={{ fontWeight: 800, fontSize: "0.95rem", color: "var(--md-navy-primary)" }}>
                      {log.lessonHour}. Ders: {log.subject}
                    </span>
                    <span className="md-chip md-chip-present" style={{ fontSize: "0.75rem" }}>
                      ✓ Derste Vardı
                    </span>
                  </div>

                  <div style={{ fontSize: "0.85rem", color: "var(--md-text-primary)", marginBottom: "0.3rem" }}>
                    <strong>İşlenen Konu:</strong> {log.topic}
                  </div>

                  {log.odev && (
                    <div
                      style={{
                        padding: "0.5rem 0.75rem",
                        background: "#ffffff",
                        borderRadius: "6px",
                        border: "1px dashed var(--md-accent-gold)",
                        fontSize: "0.8rem",
                        color: "var(--md-text-primary)",
                        marginBottom: "0.3rem",
                      }}
                    >
                      <strong style={{ color: "var(--md-accent-gold)" }}>💡 Öğretmen Tavsiyesi: </strong>
                      {log.odev}
                    </div>
                  )}

                  <div style={{ fontSize: "0.75rem", color: "var(--md-text-muted)" }}>
                    Öğretmen: {log.teacherName} • E-İmza ile Onaylı
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Message to Teacher & Guidance */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <div className="md-card" style={{ padding: "1.5rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
              <span style={{ fontSize: "1.3rem" }}>✉️</span>
              <div>
                <h3 style={{ fontSize: "1.1rem", color: "var(--md-navy-primary)" }}>
                  Rehber Öğretmene Mesaj İlet
                </h3>
                <p style={{ color: "var(--md-text-muted)", fontSize: "0.8rem" }}>
                  Ahmet Yılmaz (Sınıf Rehber Öğretmeni)
                </p>
              </div>
            </div>

            {messageSent ? (
              <div
                style={{
                  padding: "1rem",
                  background: "#d8f3dc",
                  color: "#1b4332",
                  borderRadius: "var(--radius-sm)",
                  fontWeight: 600,
                  fontSize: "0.875rem",
                }}
              >
                ✓ Mesajınız rehber öğretmene başarıyla iletildi. En kısa sürede dönüş sağlanacaktır.
              </div>
            ) : (
              <form onSubmit={handleSendMessage}>
                <div className="md-form-group">
                  <label className="md-label">Konu</label>
                  <input
                    type="text"
                    required
                    className="md-input"
                    value={messageSubject}
                    onChange={(e) => setMessageSubject(e.target.value)}
                  />
                </div>

                <div className="md-form-group">
                  <label className="md-label">Mesajınız</label>
                  <textarea
                    required
                    className="md-textarea"
                    rows={4}
                    placeholder="Öğrencinizin ders gelişimi, izin veya görüşme talebinizi buraya yazabilirsiniz..."
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                  />
                </div>

                <button type="submit" className="md-btn md-btn-primary" style={{ width: "100%" }}>
                  Öğretmene Gönder
                </button>
              </form>
            )}
          </div>

          {/* Maarif Parent Guidance Card */}
          <div className="md-card" style={{ padding: "1.5rem", background: "var(--md-cream-surface)" }}>
            <h4 style={{ fontSize: "0.95rem", color: "var(--md-navy-primary)", marginBottom: "0.5rem" }}>
              🇹🇷 Maarif Modeli Veli Bilgilendirme Notu
            </h4>
            <p style={{ fontSize: "0.8rem", color: "var(--md-text-secondary)", lineHeight: 1.5 }}>
              Yeni müfredatta sınav notlarından ziyade öğrencinin süreç içindeki <strong>erdemi, sorumluluğu, ders içi çabası ve beceri gelişimi</strong> esas alınmaktadır.
              Öğretmen tavsiyelerindeki çalışma kitabı alıştırmalarını çocuğunuzla birlikte takip etmeniz gelişimini hızlandıracaktır.
            </p>
          </div>
        </div>
      </div>
      </>
      )}

      {/* Çocuğun Vesikalık Fotoğrafı Kırpma & Kamera Modal */}
      {showPhotoModal && (
        <StudentPhotoModal
          student={student}
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
