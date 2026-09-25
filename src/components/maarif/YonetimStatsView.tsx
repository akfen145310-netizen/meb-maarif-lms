"use client";

import React, { useState } from "react";
import { MOCK_SCHOOL_STATS, MOCK_CLASSES } from "@/lib/maarif/seedData";

export default function YonetimStatsView() {
  const [signedAll, setSignedAll] = useState(false);

  const classesLogStatus = MOCK_CLASSES.map((c, idx) => ({
    ...c,
    currentHour: 3,
    status: idx === 1 ? "dolduruluyor" : idx === 3 ? "beklemede" : "imzalandi",
    teacherName: c.rehberOgretmen.split(" (")[0],
    subject: idx % 2 === 0 ? "Matematik" : idx % 3 === 0 ? "Fizik" : "Türk Dili ve Ed.",
    presentCount: c.studentCount - (idx % 3),
  }));

  const handleSignAll = () => {
    setSignedAll(true);
    setTimeout(() => setSignedAll(false), 3000);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.75rem" }}>
      {/* Banner */}
      <div
        className="md-card"
        style={{
          padding: "1.5rem",
          background: "linear-gradient(135deg, #0a1628 0%, #122646 100%)",
          color: "#ffffff",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "1rem",
        }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
            <span style={{ fontSize: "1.6rem" }}>🏛️</span>
            <h2 style={{ fontSize: "1.35rem", fontWeight: 800, color: "#ffffff" }}>
              Okul İdaresi Kapasite & Denetim Masası
            </h2>
          </div>
          <p style={{ color: "#c2d6ed", fontSize: "0.875rem", marginTop: "0.3rem" }}>
            150+ Öğretmen, 40 Sınıf ve 1.500+ Öğrencinin anlık yoklama, defter imza ve sistem ölçeklenme takibi.
          </p>
        </div>

        <button
          onClick={handleSignAll}
          className="md-btn md-btn-gold"
          style={{ padding: "0.65rem 1.25rem", fontSize: "0.9rem" }}
        >
          {signedAll ? "✓ Tüm Defterler Mühürlendi" : "🔏 Tüm Sınıfları Onayla & Mühürle"}
        </button>
      </div>

      {/* Capacity KPI Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1.25rem" }}>
        <div className="md-card" style={{ padding: "1.25rem" }}>
          <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--md-text-muted)", textTransform: "uppercase" }}>
            Öğretmen Kadrosu
          </div>
          <div style={{ fontSize: "2rem", fontWeight: 800, color: "var(--md-navy-primary)", marginTop: "0.2rem" }}>
            {MOCK_SCHOOL_STATS.totalTeachers} Öğretmen
          </div>
          <div style={{ fontSize: "0.75rem", color: "var(--status-present)", fontWeight: 600, marginTop: "0.15rem" }}>
            ● 148 Aktif • 40 Sınıfta Ders Başında
          </div>
        </div>

        <div className="md-card" style={{ padding: "1.25rem" }}>
          <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--md-text-muted)", textTransform: "uppercase" }}>
            Sınıf & Şube Sayısı
          </div>
          <div style={{ fontSize: "2rem", fontWeight: 800, color: "var(--md-accent-gold)", marginTop: "0.2rem" }}>
            {MOCK_SCHOOL_STATS.totalClasses} Sınıf
          </div>
          <div style={{ fontSize: "0.75rem", color: "var(--md-text-secondary)", marginTop: "0.15rem" }}>
            Defter Doldurulma Oranı: <strong>%{MOCK_SCHOOL_STATS.defterFillRate}</strong>
          </div>
        </div>

        <div className="md-card" style={{ padding: "1.25rem" }}>
          <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--md-text-muted)", textTransform: "uppercase" }}>
            Toplam Öğrenci Mevcudu
          </div>
          <div style={{ fontSize: "2rem", fontWeight: 800, color: "var(--status-present)", marginTop: "0.2rem" }}>
            {MOCK_SCHOOL_STATS.totalStudents} Öğrenci
          </div>
          <div style={{ fontSize: "0.75rem", color: "var(--md-text-secondary)", marginTop: "0.15rem" }}>
            Bugünkü Yoklama Oranı: <strong>%{MOCK_SCHOOL_STATS.todayAttendanceRate}</strong>
          </div>
        </div>

        <div className="md-card" style={{ padding: "1.25rem" }}>
          <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--md-text-muted)", textTransform: "uppercase" }}>
            Eşzamanlı Yük (Concurrency)
          </div>
          <div style={{ fontSize: "2rem", fontWeight: 800, color: "var(--md-accent-teal)", marginTop: "0.2rem" }}>
            {MOCK_SCHOOL_STATS.activeConcurrentUsers} Kullanıcı
          </div>
          <div style={{ fontSize: "0.75rem", color: "var(--status-present)", fontWeight: 600, marginTop: "0.15rem" }}>
            ⚡ Firestore Yanıt Süresi: 16ms (Sıfır Kayıp)
          </div>
        </div>
      </div>

      {/* High-Capacity Firestore Scaling Architecture Note */}
      <div
        className="md-card"
        style={{
          padding: "1.25rem 1.5rem",
          background: "linear-gradient(135deg, #f5efe6 0%, #ffffff 100%)",
          border: "1px solid var(--md-cream-border)",
          display: "flex",
          flexDirection: "column",
          gap: "0.5rem",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <span style={{ fontSize: "1.2rem" }}>🛡️</span>
          <h3 style={{ fontSize: "1rem", color: "var(--md-navy-primary)" }}>
            Yüksek Kapasite & Performans Mimari Güvencesi (1500+ Öğrenci & 150 Öğretmen)
          </h3>
        </div>
        <p style={{ fontSize: "0.825rem", color: "var(--md-text-secondary)", lineHeight: 1.5 }}>
          Uygulama, Cloud Firestore üzerinde <strong>okul/dönem/sınıf/tarih</strong> bazında partisyonlanmış (sharded) koleksiyon yapısıyla tasarlanmıştır.
          Tüm yoklama ve defter yazma işlemleri <strong>IndexedDB yerel önbelleği ve asenkron kuyruk</strong> ile desteklendiği için,
          40 sınıf aynı anda ders zilinde yoklama kaydetse bile sistemde hiçbir performans kaybı veya kilitlenme (write-lock) yaşanmaz.
        </p>
      </div>

      {/* 40 Classes Log Live Monitor */}
      <div className="md-card" style={{ padding: "1.5rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
          <div>
            <h3 style={{ fontSize: "1.1rem", color: "var(--md-navy-primary)" }}>
              📋 40 Sınıf Defteri & Yoklama Canlı İzleme (3. Ders Saati)
            </h3>
            <p style={{ color: "var(--md-text-muted)", fontSize: "0.8rem" }}>
              Şu an işlenen derslerin doldurulma ve yönetici e-imza onay durumu
            </p>
          </div>

          <div style={{ display: "flex", gap: "0.5rem" }}>
            <span className="md-chip md-chip-present">38 Sınıf Onaylı</span>
            <span className="md-chip md-chip-excused">1 Sınıf Dolduruyor</span>
            <span className="md-chip md-chip-absent">1 Sınıf Beklemede</span>
          </div>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.875rem" }}>
            <thead>
              <tr style={{ background: "var(--md-cream-surface)", textAlign: "left" }}>
                <th style={{ padding: "0.65rem 0.85rem" }}>Sınıf</th>
                <th style={{ padding: "0.65rem 0.85rem" }}>Ders / Branş</th>
                <th style={{ padding: "0.65rem 0.85rem" }}>Dersi Veren Öğretmen</th>
                <th style={{ padding: "0.65rem 0.85rem" }}>Katılım (Yoklama)</th>
                <th style={{ padding: "0.65rem 0.85rem" }}>Defter Durumu</th>
                <th style={{ padding: "0.65rem 0.85rem", textAlign: "right" }}>İşlem</th>
              </tr>
            </thead>
            <tbody>
              {classesLogStatus.map((cls) => (
                <tr key={cls.id} style={{ borderTop: "1px solid var(--md-cream-border)" }}>
                  <td style={{ padding: "0.65rem 0.85rem", fontWeight: 700, color: "var(--md-navy-primary)" }}>
                    {cls.name}
                  </td>
                  <td style={{ padding: "0.65rem 0.85rem" }}>{cls.subject}</td>
                  <td style={{ padding: "0.65rem 0.85rem", fontWeight: 600 }}>{cls.teacherName}</td>
                  <td style={{ padding: "0.65rem 0.85rem" }}>
                    <span style={{ fontWeight: 700, color: "var(--status-present)" }}>
                      {cls.presentCount}
                    </span>{" "}
                    / {cls.studentCount} Öğrenci
                  </td>
                  <td style={{ padding: "0.65rem 0.85rem" }}>
                    <span
                      style={{
                        padding: "0.2rem 0.5rem",
                        borderRadius: "4px",
                        fontSize: "0.75rem",
                        fontWeight: 700,
                        background:
                          cls.status === "imzalandi"
                            ? "var(--status-present-bg)"
                            : cls.status === "dolduruluyor"
                            ? "var(--status-excused-bg)"
                            : "var(--status-absent-bg)",
                        color:
                          cls.status === "imzalandi"
                            ? "var(--status-present)"
                            : cls.status === "dolduruluyor"
                            ? "var(--status-excused)"
                            : "var(--status-absent)",
                      }}
                    >
                      {cls.status === "imzalandi"
                        ? "✓ E-İmzalandı"
                        : cls.status === "dolduruluyor"
                        ? "⏳ Dolduruluyor"
                        : "⚠️ Beklemede"}
                    </span>
                  </td>
                  <td style={{ padding: "0.65rem 0.85rem", textAlign: "right" }}>
                    <button
                      type="button"
                      className="md-btn md-btn-secondary"
                      style={{ padding: "0.25rem 0.6rem", fontSize: "0.75rem" }}
                    >
                      İncele / Onayla
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
