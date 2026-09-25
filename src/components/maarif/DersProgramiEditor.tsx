"use client";

import React, { useState, useEffect } from "react";
import {
  getStudentSchedule,
  saveStudentSchedule,
  DEFAULT_WEEKLY_SCHEDULE,
  GRADE_WEEKLY_SCHEDULES,
  type WeeklySchedule,
  type LessonSlot,
} from "@/lib/maarif/dersProgramiHelper";

interface DersProgramiEditorProps {
  studentId: string;
}

const AVAILABLE_SUBJECTS = [
  "Matematik",
  "Türkçe",
  "Fen Bilimleri",
  "T.C. İnkılap Tarihi",
  "Sosyal Bilgiler",
  "İngilizce",
  "Din Kültürü",
  "Beden Eğitimi",
  "Görsel Sanatlar",
  "Müzik",
  "Bilişim Teknolojileri",
  "Rehberlik",
];

const PRESET_TOPICS: Record<string, { topic: string; kazanimKodu: string; erdem: string; etkinlikAdi: string }> = {
  Matematik: { topic: "Çarpanlar ve Katlar / Üslü Sayılar", kazanimKodu: "MAT.8.1.1", erdem: "Akıl Yürütme", etkinlikAdi: "Problem Çözme Yaprağı" },
  Türkçe: { topic: "Paragrafta Anlam ve Fiilimsiler", kazanimKodu: "TÜR.8.1.1", erdem: "Dürüstlük", etkinlikAdi: "Metin Tahlil Çizelgesi" },
  "Fen Bilimleri": { topic: "Mevsimlerin Oluşumu ve DNA", kazanimKodu: "FEN.8.1.1", erdem: "Sorumluluk", etkinlikAdi: "Model ve Deney Çalışması" },
  "T.C. İnkılap Tarihi": { topic: "Bir Kahraman Doğuyor / Milli Uyanış", kazanimKodu: "İNK.8.1.1", erdem: "Vatanseverlik", etkinlikAdi: "Tarihsel Harita İncelemesi" },
  "Sosyal Bilgiler": { topic: "Birey ve Toplum / Haklarımız", kazanimKodu: "SOS.7.1.1", erdem: "Adalet", etkinlikAdi: "Örnek Olay Değerlendirmesi" },
  İngilizce: { topic: "Friendship & Teen Life", kazanimKodu: "İNG.8.1.1", erdem: "Saygı", etkinlikAdi: "Diyalog ve Kelime Kartları" },
  "Din Kültürü": { topic: "Kader İnancı ve Yardımlaşma", kazanimKodu: "DİN.8.1.1", erdem: "Merhamet", etkinlikAdi: "Ayet ve Hadis Yorumlama" },
  "Beden Eğitimi": { topic: "Takım Sporları ve Fair-Play", kazanimKodu: "BED.8.1.1", erdem: "Dürüstlük", etkinlikAdi: "Grup Egzersizi" },
  "Görsel Sanatlar": { topic: "Perspektif ve Renk Uyumu", kazanimKodu: "GÖR.8.1.1", erdem: "Estetik", etkinlikAdi: "Çizim Çalışması" },
  Müzik: { topic: "Geleneksel Müziğimiz ve Ritim", kazanimKodu: "MÜZ.8.1.1", erdem: "Vatanseverlik", etkinlikAdi: "Ritim Uygulaması" },
  "Bilişim Teknolojileri": { topic: "Algoritma ve Güvenli İnternet", kazanimKodu: "BİL.8.1.1", erdem: "Dürüstlük", etkinlikAdi: "Akış Şeması Çizimi" },
  Rehberlik: { topic: "Hedef Belirleme ve Zaman Yönetimi", kazanimKodu: "REH.8.1.1", erdem: "Çalışkanlık", etkinlikAdi: "Haftalık Plan Günlüğü" },
};

export default function DersProgramiEditor({ studentId }: DersProgramiEditorProps) {
  const [schedule, setSchedule] = useState<WeeklySchedule>(DEFAULT_WEEKLY_SCHEDULE);
  const [activeDay, setActiveDay] = useState<string>("Pazartesi");
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    const loaded = getStudentSchedule(studentId);
    setSchedule(loaded);
  }, [studentId]);

  const handleSubjectChange = (day: string, hourIndex: number, newSubject: string) => {
    setSchedule((prev) => {
      const dayLessons = [...(prev[day] || [])];
      const preset = PRESET_TOPICS[newSubject] || {
        topic: `${newSubject} Temel Konuları`,
        kazanimKodu: `${newSubject.slice(0, 3).toUpperCase()}.8.1.1`,
        erdem: "Çalışkanlık",
        etkinlikAdi: `${newSubject} Ders Etkinliği`,
      };

      dayLessons[hourIndex] = {
        ...dayLessons[hourIndex],
        subject: newSubject,
        topic: preset.topic,
        kazanimKodu: preset.kazanimKodu,
        erdem: preset.erdem,
        etkinlikAdi: preset.etkinlikAdi,
      };

      return {
        ...prev,
        [day]: dayLessons,
      };
    });
  };

  const handleTopicChange = (day: string, hourIndex: number, newTopic: string) => {
    setSchedule((prev) => {
      const dayLessons = [...(prev[day] || [])];
      dayLessons[hourIndex] = {
        ...dayLessons[hourIndex],
        topic: newTopic,
      };
      return {
        ...prev,
        [day]: dayLessons,
      };
    });
  };

  const handleSave = () => {
    saveStudentSchedule(studentId, schedule);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3500);
  };

  const handleLoadGradePreset = (grade: number) => {
    const preset = GRADE_WEEKLY_SCHEDULES[grade] || DEFAULT_WEEKLY_SCHEDULE;
    setSchedule(preset);
    saveStudentSchedule(studentId, preset);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3500);
  };

  const days = ["Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma"];
  const currentLessons = schedule[activeDay] || [];

  return (
    <div className="md-card" style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span style={{ fontSize: "1.4rem" }}>🗓️</span>
            <h3 style={{ fontSize: "1.2rem", fontWeight: 800, color: "var(--md-navy-primary)", margin: 0 }}>
              Haftalık Okul Ders Programım (Giriş & Düzenleme)
            </h3>
          </div>
          <p style={{ fontSize: "0.825rem", color: "var(--md-text-secondary)", marginTop: "0.25rem" }}>
            Kendi okul ders programınızı giriniz veya MEB Maarif Modeli sınıf şablonunuzu tek tıkla yükleyiniz.
          </p>

          {/* Sınıf Şablonu Seçicisi */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.35rem", marginTop: "0.5rem", flexWrap: "wrap" }}>
            <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--md-navy-primary)" }}>
              MEB Sınıf Şablonu Yükle:
            </span>
            {[5, 6, 7, 8].map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => handleLoadGradePreset(g)}
                className="md-btn md-btn-secondary"
                style={{ fontSize: "0.72rem", padding: "0.25rem 0.55rem", borderRadius: "999px" }}
              >
                {g === 8 ? "🎯 8. Sınıf (LGS)" : `📘 ${g}. Sınıf`}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", gap: "0.5rem" }}>
          <button
            type="button"
            onClick={() => handleLoadGradePreset(8)}
            className="md-btn md-btn-secondary"
            style={{ fontSize: "0.8rem", padding: "0.45rem 0.85rem" }}
          >
            ↺ LGS Standart Şablonu
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="md-btn md-btn-primary"
            style={{ fontSize: "0.85rem", padding: "0.5rem 1.15rem", display: "flex", alignItems: "center", gap: "0.4rem" }}
          >
            <span>💾</span>
            <span>Programı Kaydet</span>
          </button>
        </div>
      </div>

      {savedSuccess && (
        <div
          style={{
            padding: "0.85rem 1rem",
            background: "#d8f3dc",
            border: "1px solid #2d6a4f",
            borderRadius: "var(--radius-sm)",
            color: "#1b4332",
            fontSize: "0.85rem",
            fontWeight: 700,
          }}
        >
          ✓ Ders programınız başarıyla kaydedildi! Günlük Öğrenci Asistanı yeni derslerinize göre senkronize edildi.
        </div>
      )}

      {/* Gün Sekmeleri */}
      <div className="md-tabs" style={{ marginBottom: "0.5rem" }}>
        {days.map((d) => (
          <button
            key={d}
            type="button"
            onClick={() => setActiveDay(d)}
            className={`md-tab-item ${activeDay === d ? "active" : ""}`}
            style={{ fontSize: "0.85rem", padding: "0.55rem 1.1rem" }}
          >
            {d} ({schedule[d]?.length || 0} Ders)
          </button>
        ))}
      </div>

      {/* Aktif Günün Ders Saatleri Tablosu */}
      <div style={{ overflowX: "auto", border: "1px solid var(--md-cream-border)", borderRadius: "var(--radius-sm)" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem" }}>
          <thead>
            <tr style={{ background: "var(--md-cream-surface)", textAlign: "left", borderBottom: "1.5px solid var(--md-cream-border)" }}>
              <th style={{ padding: "0.75rem 1rem", width: "90px" }}>Ders Saati</th>
              <th style={{ padding: "0.75rem 1rem", width: "180px" }}>Ders / Branş</th>
              <th style={{ padding: "0.75rem 1rem" }}>İşlenen Konu / Kazanım Başlığı</th>
              <th style={{ padding: "0.75rem 1rem", width: "140px" }}>Kazanım Kodu</th>
              <th style={{ padding: "0.75rem 1rem", width: "130px" }}>Erdem / Değer</th>
            </tr>
          </thead>
          <tbody>
            {currentLessons.map((slot, idx) => (
              <tr
                key={idx}
                style={{
                  borderBottom: "1px solid var(--md-cream-border)",
                  background: idx % 2 === 0 ? "#ffffff" : "var(--md-cream-surface)",
                }}
              >
                <td style={{ padding: "0.75rem 1rem", fontWeight: 700, color: "var(--md-navy-primary)" }}>
                  <div>{slot.hour}. Ders</div>
                  <div style={{ fontSize: "0.7rem", color: "var(--md-text-muted)", fontWeight: 400 }}>{slot.timeRange}</div>
                </td>

                <td style={{ padding: "0.75rem 1rem" }}>
                  <select
                    value={slot.subject}
                    onChange={(e) => handleSubjectChange(activeDay, idx, e.target.value)}
                    className="md-select"
                    style={{ padding: "0.4rem 0.6rem", fontSize: "0.85rem", fontWeight: 700 }}
                  >
                    {AVAILABLE_SUBJECTS.map((sub) => (
                      <option key={sub} value={sub}>
                        {sub}
                      </option>
                    ))}
                  </select>
                </td>

                <td style={{ padding: "0.75rem 1rem" }}>
                  <input
                    type="text"
                    className="md-input"
                    value={slot.topic}
                    onChange={(e) => handleTopicChange(activeDay, idx, e.target.value)}
                    style={{ padding: "0.4rem 0.6rem", fontSize: "0.825rem" }}
                  />
                  <div style={{ fontSize: "0.7rem", color: "var(--md-text-muted)", marginTop: "0.2rem" }}>
                    Etkinlik: {slot.etkinlikAdi}
                  </div>
                </td>

                <td style={{ padding: "0.75rem 1rem" }}>
                  <span
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "0.75rem",
                      padding: "0.2rem 0.45rem",
                      borderRadius: "4px",
                      background: "rgba(18, 38, 70, 0.08)",
                      color: "var(--md-navy-primary)",
                      fontWeight: 700,
                    }}
                  >
                    {slot.kazanimKodu}
                  </span>
                </td>

                <td style={{ padding: "0.75rem 1rem" }}>
                  <span className="md-chip md-chip-gold" style={{ fontSize: "0.72rem", padding: "0.15rem 0.45rem" }}>
                    {slot.erdem}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
