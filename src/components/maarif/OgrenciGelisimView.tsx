"use client";

import React, { useState } from "react";
import { MOCK_STUDENTS_9A, MOCK_DEFTER_KAYITLARI } from "@/lib/maarif/seedData";
import type { Student } from "@/types/maarif";

export default function OgrenciGelisimView() {
  const [selectedStudentId, setSelectedStudentId] = useState<string>(MOCK_STUDENTS_9A[0].id);

  const student = MOCK_STUDENTS_9A.find((s) => s.id === selectedStudentId) || MOCK_STUDENTS_9A[0];

  const studentLogs = MOCK_DEFTER_KAYITLARI.map((log) => {
    const studentStatus = log.yoklama.find((y) => y.studentId === student.id)?.status || "geldi";
    return {
      ...log,
      myStatus: studentStatus,
    };
  });

  const erdemKarnesi = [
    { erdem: "Dürüstlük", puan: 96, seviye: "Yetkin", desc: "Tavsiye ve araştırmalarda akademik dürüstlük ve kaynak doğruluğuna tam riayet." },
    { erdem: "Adalet & Eşitlik", puan: 92, seviye: "Yetkin", desc: "Akran değerlendirmelerinde tarafsız ve hakkaniyetli yaklaşım." },
    { erdem: "Sorumluluk", puan: 88, seviye: "Geliştirilmeli", desc: "Verilen çalışma yapraklarını zamanında teslim etme bilinci." },
    { erdem: "Saygı & Nezaket", puan: 98, seviye: "Üst Düzey", desc: "Ders içi diyaloglarda ve grup çalışmalarında örnek nezaket." },
    { erdem: "Vatanseverlik", puan: 95, seviye: "Yetkin", desc: "Kültürel değerlere ve Türkçenin doğru kullanımına yüksek hassasiyet." },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.75rem" }}>
      {/* Banner & Student Switcher */}
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
              color: "#102444",
              boxShadow: "0 4px 12px rgba(198, 146, 59, 0.35)",
            }}
          >
            {student.name.charAt(0)}
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <h2 style={{ fontSize: "1.35rem", fontWeight: 800, color: "#ffffff" }}>{student.name}</h2>
              <span
                style={{
                  background: "rgba(255, 255, 255, 0.15)",
                  padding: "0.15rem 0.5rem",
                  borderRadius: "4px",
                  fontSize: "0.75rem",
                  fontFamily: "var(--font-mono)",
                }}
              >
                No: {student.studentNo} • {student.className}
              </span>
            </div>
            <p style={{ color: "#c2d6ed", fontSize: "0.85rem", marginTop: "0.2rem" }}>
              Veli: <strong>{student.parentName}</strong> ({student.parentPhone}) • Rehber Öğretmen: Ahmet Yılmaz
            </p>
          </div>
        </div>

        {/* Switch student dropdown */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
          <span style={{ fontSize: "0.8rem", color: "#a8c0de" }}>Öğrenci Seç:</span>
          <select
            value={selectedStudentId}
            onChange={(e) => setSelectedStudentId(e.target.value)}
            style={{
              padding: "0.5rem 0.8rem",
              background: "rgba(255, 255, 255, 0.15)",
              color: "#ffffff",
              border: "1px solid rgba(255, 255, 255, 0.25)",
              borderRadius: "8px",
              fontSize: "0.85rem",
              cursor: "pointer",
            }}
          >
            {MOCK_STUDENTS_9A.map((s) => (
              <option key={s.id} value={s.id} style={{ color: "#000" }}>
                {s.name} ({s.studentNo})
              </option>
            ))}
          </select>
        </div>
      </div>

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
            Maksimum sınır: 10 gün (Kalan: {10 - student.devamsizlikGun} gün)
          </div>
        </div>

        <div className="md-card" style={{ padding: "1.25rem" }}>
          <div style={{ fontSize: "0.785rem", fontWeight: 700, color: "var(--md-text-muted)", textTransform: "uppercase" }}>
            Kazanım Tamamlama
          </div>
          <div style={{ fontSize: "2rem", fontWeight: 800, color: "var(--md-accent-gold)", marginTop: "0.2rem" }}>
            %{student.kazanimTamamlamaOrani}
          </div>
          <div style={{ fontSize: "0.75rem", color: "var(--md-text-secondary)", marginTop: "0.15rem" }}>
            Maarif Modeli 1. Dönem hedeflerine uyum
          </div>
        </div>

        <div className="md-card" style={{ padding: "1.25rem" }}>
          <div style={{ fontSize: "0.785rem", fontWeight: 700, color: "var(--md-text-muted)", textTransform: "uppercase" }}>
            Bugün İşlenen Dersler
          </div>
          <div style={{ fontSize: "2rem", fontWeight: 800, color: "var(--md-navy-primary)", marginTop: "0.2rem" }}>
            6 Ders
          </div>
          <div style={{ fontSize: "0.75rem", color: "var(--status-present)", fontWeight: 600, marginTop: "0.15rem" }}>
            ✓ Tüm derslerde yoklama alındı
          </div>
        </div>

        <div className="md-card" style={{ padding: "1.25rem" }}>
          <div style={{ fontSize: "0.785rem", fontWeight: 700, color: "var(--md-text-muted)", textTransform: "uppercase" }}>
            Bekleyen Tavsiyeler
          </div>
          <div style={{ fontSize: "2rem", fontWeight: 800, color: "var(--md-accent-coral)", marginTop: "0.2rem" }}>
            2 Tavsiye
          </div>
          <div style={{ fontSize: "0.75rem", color: "var(--md-text-secondary)", marginTop: "0.15rem" }}>
            En yakın teslim: 28 Eylül
          </div>
        </div>
      </div>

      {/* Two Column Layout: Today's Class Log Stream & Maarif Character/Virtue Report Card */}
      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "1.75rem", alignItems: "start" }}>
        {/* Today's Class Log Feed (Çocuğum Bugün Ne Öğrendi?) */}
        <div className="md-card" style={{ padding: "1.5rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
            <div>
              <h3 style={{ fontSize: "1.1rem", color: "var(--md-navy-primary)" }}>
                📅 Günlük Ders Defteri Akışı (Bugün Ne İşlendi?)
              </h3>
              <p style={{ color: "var(--md-text-muted)", fontSize: "0.8rem" }}>
                Öğretmenlerin deftere girdiği ders konuları, yoklama ve tavsiyeler
              </p>
            </div>
            <span className="md-chip md-chip-navy">25 Eylül 2026</span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {studentLogs.map((log) => (
              <div
                key={log.id}
                style={{
                  padding: "1.15rem",
                  borderRadius: "var(--radius-sm)",
                  background: "var(--md-cream-surface)",
                  border: "1px solid var(--md-cream-border)",
                  borderLeft: "5px solid var(--md-navy-primary)",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.4rem" }}>
                  <div style={{ fontWeight: 800, fontSize: "0.95rem", color: "var(--md-navy-primary)" }}>
                    {log.lessonHour}. Ders: {log.subject}
                  </div>
                  <span
                    className={
                      log.myStatus === "geldi"
                        ? "md-chip md-chip-present"
                        : log.myStatus === "gec"
                        ? "md-chip md-chip-late"
                        : "md-chip md-chip-absent"
                    }
                  >
                    Yoklama: {log.myStatus === "geldi" ? "Derste Vardı" : log.myStatus === "gec" ? "Geç Kaldı" : "Yok Yazıldı"}
                  </span>
                </div>

                <div style={{ fontSize: "0.85rem", color: "var(--md-text-primary)", marginBottom: "0.4rem" }}>
                  <strong>İşlenen Konu:</strong> {log.topic}
                </div>

                {log.odev && (
                  <div
                    style={{
                      padding: "0.6rem 0.8rem",
                      background: "#ffffff",
                      borderRadius: "6px",
                      border: "1px dashed var(--md-accent-gold)",
                      fontSize: "0.8rem",
                      color: "var(--md-text-primary)",
                      marginBottom: "0.4rem",
                    }}
                  >
                    <strong style={{ color: "var(--md-accent-gold)" }}>💡 Öğretmen Tavsiyesi: </strong>
                    {log.odev}
                  </div>
                )}

                <div style={{ fontSize: "0.75rem", color: "var(--md-text-muted)" }}>
                  Öğretmen: <strong>{log.teacherName}</strong> • {log.imzalandi ? "✓ E-İmza ile Onaylı" : "Beklemede"}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Maarif Erdem & Beceri Gelişim Karnesi */}
        <div className="md-card" style={{ padding: "1.5rem" }}>
          <div style={{ marginBottom: "1rem" }}>
            <h3 style={{ fontSize: "1.1rem", color: "var(--md-navy-primary)" }}>
              🌟 Maarif Modeli Erdem & Beceri Karnesi
            </h3>
            <p style={{ color: "var(--md-text-muted)", fontSize: "0.8rem" }}>
              Öğretmen gözlemleri ve süreç odaklı rubrik değerlendirme özeti
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
            {erdemKarnesi.map((item) => (
              <div
                key={item.erdem}
                style={{
                  padding: "0.85rem 1rem",
                  borderRadius: "var(--radius-sm)",
                  background: "var(--md-cream-surface)",
                  border: "1px solid var(--md-cream-border)",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.3rem" }}>
                  <span style={{ fontWeight: 700, fontSize: "0.9rem", color: "var(--md-navy-primary)" }}>
                    {item.erdem}
                  </span>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                    <span
                      style={{
                        fontSize: "0.75rem",
                        padding: "0.15rem 0.45rem",
                        borderRadius: "4px",
                        background: item.puan >= 90 ? "var(--status-present-bg)" : "var(--status-excused-bg)",
                        color: item.puan >= 90 ? "var(--status-present)" : "var(--status-excused)",
                        fontWeight: 700,
                      }}
                    >
                      {item.seviye}
                    </span>
                    <span style={{ fontWeight: 800, fontSize: "0.9rem", color: "var(--md-navy-primary)" }}>
                      %{item.puan}
                    </span>
                  </div>
                </div>

                <div
                  style={{
                    height: "6px",
                    borderRadius: "3px",
                    background: "rgba(0,0,0,0.06)",
                    overflow: "hidden",
                    marginBottom: "0.3rem",
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      width: `${item.puan}%`,
                      background: "linear-gradient(90deg, var(--md-navy-primary) 0%, var(--md-accent-gold) 100%)",
                      borderRadius: "3px",
                    }}
                  />
                </div>

                <div style={{ fontSize: "0.725rem", color: "var(--md-text-secondary)", lineHeight: 1.35 }}>
                  {item.desc}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
