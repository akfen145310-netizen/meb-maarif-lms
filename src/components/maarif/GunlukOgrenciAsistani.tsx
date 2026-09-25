"use client";

import React, { useState, useEffect } from "react";
import {
  getTodayClasses,
  getAssistantCheckin,
  saveAssistantCheckin,
  getTodayDayName,
  type LessonSlot,
  type AssistantCheckinRecord,
} from "@/lib/maarif/dersProgramiHelper";
import { isDeviceOnline, enqueueOfflineAction } from "@/lib/maarif/offlineSyncHelper";
import KavramYanilgisiCard from "./KavramYanilgisiCard";
import LgsVurgusuCard from "./LgsVurgusuCard";

interface GunlukOgrenciAsistaniProps {
  studentId: string;
  studentName: string;
  grade?: number;
  userType?: "ogrenci" | "veli";
}

const LESSON_MISCONCEPTIONS: Record<string, { baslik: string; aciklama: string; dogrusu: string }> = {
  "Fen Bilimleri": {
    baslik: "⚠️ Kritik Kavram Yanılgısı: Dünya'nın Güneş'e Mesafesi",
    aciklama: "Öğrencilerin %70'i Dünya Güneş'e yaklaştığında yaz, uzaklaştığında kış yaşandığını düşünmektedir.",
    dogrusu: "Mevsimlerin Dünya'nın Güneş'e mesafesiyle HİÇBİR İLGİSİ YOKTUR! Nitekim Kuzey Yarımküre'de kış yaşanırken (3 Ocak), Dünya Güneş'e en yakın (günberi) konumdadır! Asıl etken 23° 27' eksen eğikliği ve ışınların geliş açısıdır.",
  },
  Matematik: {
    baslik: "⚠️ Sık Yapılan Hata: EBOB ile EKOK Soru Ayrımı",
    aciklama: "Soruda 'en az' görünce hemen EKOK, 'en çok' görünce EBOB almak yanıltıcıdır.",
    dogrusu: "Bütünden eşit parçalara ayrılma (bölme/paylaştırma) varsa EBOB; küçük parçalardan büyük bir bütün oluşturuluyorsa (katlama/birleştirme) EKOK kullanılır!",
  },
  Türkçe: {
    baslik: "⚠️ Fiilimsi ve Kalıcı İsim Ayrımı",
    aciklama: "Dolmuş, sarma, dondurma, danışma gibi sözcüklerdeki ekler fiilimsi sanılmaktadır.",
    dogrusu: "Kalıplaşmış isimler eylem bildirmez, somut bir varlığı karşılar ve olumsuzu (-me/-ma) yapılamaz.",
  },
};

const LESSON_LGS_TIPS: Record<string, { soruTipi: string; cozumIpuclari: string[]; ornekSoruAnalizi: string }> = {
  "Fen Bilimleri": {
    soruTipi: "Deney Düzeneği, Işık Yoğunluğu & Gölge Boyu Grafiği",
    cozumIpuclari: [
      "1. Kural: Işın dik açıyla (90°) geldiğinde birim alana düşen ısı enerjisi maksimumdur (Yaz).",
      "2. Kural: Öğle vakti dik açıyla gelen ışınlarda gölge boyu minimum, eğik kış ışınlarında maksimumdur.",
      "3. Kural: Ekinoks tarihlerinde (21 Mart, 23 Eylül) tüm dünyada gece-gündüz 12 saattir.",
    ],
    ornekSoruAnalizi: "LGS Fen Bilimleri testinin 1. sorusu daima Mevsimler ve İklim konusundan gelir. MEB, farklı yarımkürelerdeki şehirlerin gölge boyu grafiklerini eşleştirmeyi çok sever.",
  },
  Matematik: {
    soruTipi: "Yeni Nesil Senaryolu Modelleme & Şekilli Alan Problemleri",
    cozumIpuclari: [
      "1. Kural: Dikdörtgen levhaların kenar uzunlukları ortak bölen (EBOB) üzerinden test edilmelidir.",
      "2. Kural: 'Aralarında asal' şartı verildiyse sayıların 1 dışında ortak böleni olmadığını doğrulayın.",
      "3. Kural: EBOB(a, b) × EKOK(a, b) = a × b kuralını uygulayın.",
    ],
    ornekSoruAnalizi: "LGS Matematik testinin 1. sorusu her yıl istisnasız EBOB-EKOK veya Asal Çarpanlar modellemesidir.",
  },
};

export default function GunlukOgrenciAsistani({
  studentId,
  studentName,
  grade = 8,
  userType = "ogrenci",
}: GunlukOgrenciAsistaniProps) {
  const [selectedDay, setSelectedDay] = useState<"Pazartesi" | "Salı" | "Çarşamba" | "Perşembe" | "Cuma">(
    getTodayDayName()
  );
  const [selectedLessonIndex, setSelectedLessonIndex] = useState<number>(0);
  const [todayLessons, setTodayLessons] = useState<LessonSlot[]>([]);
  const [etkinlikYapildi, setEtkinlikYapildi] = useState(false);
  const [tavsiyelerKontrolEdildi, setTavsiyelerKontrolEdildi] = useState(false);
  const [soruCozumuTamamlandi, setSoruCozumuTamamlandi] = useState(false);
  const [studentNote, setStudentNote] = useState("");
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [existingRecord, setExistingRecord] = useState<AssistantCheckinRecord | null>(null);

  const todayDateStr = "2026-09-25"; // Sabit güncel tarih

  const refreshLessons = () => {
    const lessons = getTodayClasses(studentId, selectedDay, grade);
    setTodayLessons(lessons);

    const activeLesson = lessons[selectedLessonIndex] || lessons[0];
    if (activeLesson) {
      const record = getAssistantCheckin(studentId, `${todayDateStr}_${selectedDay}_${activeLesson.subject}`);
      if (record) {
        setExistingRecord(record);
        setEtkinlikYapildi(record.etkinlikYapildi);
        setTavsiyelerKontrolEdildi(record.tavsiyelerKontrolEdildi);
        setSoruCozumuTamamlandi(record.soruCozumuTamamlandi);
        setStudentNote(record.ogrenciNotu || "");
      } else {
        setExistingRecord(null);
        setEtkinlikYapildi(false);
        setTavsiyelerKontrolEdildi(false);
        setSoruCozumuTamamlandi(false);
        setStudentNote("");
      }
    }
  };

  useEffect(() => {
    refreshLessons();
  }, [studentId, selectedDay, selectedLessonIndex]);

  useEffect(() => {
    const handleUpdate = () => refreshLessons();
    window.addEventListener("assistant-checkin-updated", handleUpdate);
    window.addEventListener("student-schedule-updated", handleUpdate);
    return () => {
      window.removeEventListener("assistant-checkin-updated", handleUpdate);
      window.removeEventListener("student-schedule-updated", handleUpdate);
    };
  }, [studentId, selectedDay, selectedLessonIndex]);

  const activeLesson = todayLessons[selectedLessonIndex] || todayLessons[0] || {
    subject: "Fen Bilimleri",
    kazanimKodu: "FEN.8.1.1",
    topic: "Mevsimlerin Oluşumu ve İklim Değişikliği",
    etkinlikAdi: "Mevsimler Modeli ve Sera Etkisi Gözlemi",
    erdem: "Sorumluluk",
  };

  const handleSaveCheckin = (e: React.FormEvent) => {
    e.preventDefault();
    const isCompleted = etkinlikYapildi && tavsiyelerKontrolEdildi;

    const record: AssistantCheckinRecord = {
      studentId,
      dateStr: `${todayDateStr}_${selectedDay}_${activeLesson.subject}`,
      dayName: selectedDay,
      subject: activeLesson.subject,
      kazanimKodu: activeLesson.kazanimKodu,
      etkinlikYapildi,
      tavsiyelerKontrolEdildi,
      soruCozumuTamamlandi,
      tamamlandi: isCompleted,
      checkedAt: new Date().toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" }),
      ogrenciNotu: studentNote,
    };

    saveAssistantCheckin(studentId, record);

    // Çevrimdışıysa kuyruğa al
    if (!isDeviceOnline()) {
      enqueueOfflineAction({
        type: "asistan_checkin",
        payload: { studentId, record },
      });
    }

    setExistingRecord(record);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 4000);
  };

  const isMatched = existingRecord?.tamamlandi || (etkinlikYapildi && tavsiyelerKontrolEdildi);

  return (
    <div
      className="md-card"
      style={{
        padding: "1.5rem",
        background: isMatched
          ? "linear-gradient(135deg, #f0fdf4 0%, #ffffff 100%)"
          : "linear-gradient(135deg, #ffffff 0%, #fbf9f5 100%)",
        border: isMatched ? "2px solid #52b788" : "1.5px solid var(--md-accent-gold)",
        boxShadow: "var(--md-elevation-3)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Sağ Üst Eşleşme Rozeti */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "0.75rem", marginBottom: "1rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <div
            style={{
              width: "46px",
              height: "46px",
              borderRadius: "12px",
              background: "linear-gradient(135deg, #122646 0%, #1f487e 100%)",
              color: "#ffffff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.5rem",
              boxShadow: "0 4px 10px rgba(18, 38, 70, 0.2)",
            }}
          >
            🤖
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <h3 style={{ fontSize: "1.15rem", fontWeight: 800, color: "var(--md-navy-primary)", margin: 0 }}>
                Günlük Öğrenci Asistanı & Akıllı Eşleşme
              </h3>
              <span className="md-chip md-chip-gold" style={{ fontSize: "0.72rem" }}>
                {userType === "veli" ? "👨‍👩‍👧 Veli Takip Formu" : "🎓 Öğrenci Asistanı"}
              </span>
            </div>
            <p style={{ fontSize: "0.8rem", color: "var(--md-text-secondary)", marginTop: "0.2rem" }}>
              Okulda işlenen Maarif ders kazanımı ile evde yapılan çalışmayı anında eşleştirir.
            </p>
          </div>
        </div>

        {/* Gün Seçici (Haftanın günlerini test etme imkanı) */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
          <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--md-text-muted)" }}>Gün:</span>
          {(["Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma"] as const).map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => {
                setSelectedDay(d);
                setSelectedLessonIndex(0);
              }}
              style={{
                padding: "0.25rem 0.6rem",
                borderRadius: "6px",
                border: selectedDay === d ? "1px solid var(--md-navy-primary)" : "1px solid var(--md-cream-border)",
                background: selectedDay === d ? "var(--md-navy-primary)" : "var(--md-cream-surface)",
                color: selectedDay === d ? "#ffffff" : "var(--md-navy-primary)",
                fontSize: "0.75rem",
                fontWeight: selectedDay === d ? 700 : 500,
                cursor: "pointer",
                transition: "all 0.15s",
              }}
            >
              {d.slice(0, 3)}
            </button>
          ))}
        </div>
      </div>

      {/* O Günkü Ders Programı Şeridi */}
      <div
        style={{
          display: "flex",
          gap: "0.5rem",
          overflowX: "auto",
          paddingBottom: "0.5rem",
          marginBottom: "1.25rem",
          borderBottom: "1px solid var(--md-cream-border)",
        }}
      >
        <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--md-text-muted)", alignSelf: "center", marginRight: "0.25rem" }}>
          {selectedDay} Dersleri:
        </span>
        {todayLessons.map((l, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => setSelectedLessonIndex(idx)}
            style={{
              padding: "0.35rem 0.75rem",
              borderRadius: "999px",
              border: selectedLessonIndex === idx ? "1.5px solid var(--md-accent-gold)" : "1px solid var(--md-cream-border)",
              background: selectedLessonIndex === idx ? "rgba(198, 146, 59, 0.15)" : "#ffffff",
              color: selectedLessonIndex === idx ? "#7a4e0c" : "var(--md-text-secondary)",
              fontSize: "0.78rem",
              fontWeight: selectedLessonIndex === idx ? 800 : 500,
              cursor: "pointer",
              whiteSpace: "nowrap",
            }}
          >
            {l.hour}. Saat: {l.subject}
          </button>
        ))}
      </div>

      {/* ASİSTANIN ANLIK BİLDİRİM VE SORU BALONU */}
      <div
        style={{
          padding: "1.25rem",
          borderRadius: "var(--radius-sm)",
          background: "linear-gradient(135deg, #122646 0%, #1a3359 100%)",
          color: "#ffffff",
          boxShadow: "0 4px 12px rgba(18, 38, 70, 0.25)",
          marginBottom: "1.25rem",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.4rem" }}>
          <span style={{ fontSize: "1.2rem" }}>📢</span>
          <strong style={{ fontSize: "0.95rem", color: "var(--md-accent-gold)" }}>
            Günlük Akıllı Bildirim & Eşleşme Sorusu:
          </strong>
        </div>

        <p style={{ fontSize: "1rem", fontWeight: 700, lineHeight: 1.5, margin: 0, color: "#fdfefe" }}>
          "Bugünkü {activeLesson.subject} dersinde <u style={{ color: "var(--md-accent-gold)" }}>{activeLesson.kazanimKodu} ({activeLesson.topic})</u> kazanımı işlendi.
          Etkinliğini yaptın mı? Tavsiyelerini kontrol ettin mi?"
        </p>

        <div style={{ display: "flex", gap: "1rem", marginTop: "0.6rem", fontSize: "0.78rem", color: "rgba(255,255,255,0.8)" }}>
          <span>📌 <strong>Okul Etkinliği:</strong> {activeLesson.etkinlikAdi}</span>
          <span>•</span>
          <span>🌱 <strong>Erdem:</strong> {activeLesson.erdem}</span>
        </div>
      </div>

      {/* Günün Dersi İçin Kavram Yanılgısı Uyarısı */}
      {LESSON_MISCONCEPTIONS[activeLesson.subject] && (
        <div style={{ marginBottom: "1rem" }}>
          <KavramYanilgisiCard
            baslik={LESSON_MISCONCEPTIONS[activeLesson.subject].baslik}
            aciklama={LESSON_MISCONCEPTIONS[activeLesson.subject].aciklama}
            dogrusu={LESSON_MISCONCEPTIONS[activeLesson.subject].dogrusu}
            dersAdi={activeLesson.subject}
            kazanimKodu={activeLesson.kazanimKodu}
          />
        </div>
      )}

      {/* 8. Sınıf Günün Dersi İçin LGS Vurgusu & Çözüm İpuçları */}
      {LESSON_LGS_TIPS[activeLesson.subject] && (
        <div style={{ marginBottom: "1rem" }}>
          <LgsVurgusuCard
            data={{
              onemDerecesi: "Kritik",
              soruTipi: LESSON_LGS_TIPS[activeLesson.subject].soruTipi,
              cozumIpuclari: LESSON_LGS_TIPS[activeLesson.subject].cozumIpuclari,
              ornekSoruAnalizi: LESSON_LGS_TIPS[activeLesson.subject].ornekSoruAnalizi,
            }}
            kazanimKodu={activeLesson.kazanimKodu}
            subject={activeLesson.subject}
          />
        </div>
      )}

      {/* Kontrol Formu ve Checkboxlar */}
      <form onSubmit={handleSaveCheckin}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.5fr 1fr",
            gap: "1.25rem",
            background: "var(--md-cream-surface)",
            padding: "1.25rem",
            borderRadius: "var(--radius-sm)",
            border: "1px solid var(--md-cream-border)",
            marginBottom: "1rem",
          }}
        >
          {/* Sol Kolon: Onay Kutuları */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.6rem",
                padding: "0.6rem 0.8rem",
                background: etkinlikYapildi ? "#d8f3dc" : "#ffffff",
                border: etkinlikYapildi ? "1.5px solid #52b788" : "1px solid var(--md-cream-border)",
                borderRadius: "6px",
                cursor: "pointer",
                transition: "all 0.15s",
              }}
            >
              <input
                type="checkbox"
                checked={etkinlikYapildi}
                onChange={(e) => setEtkinlikYapildi(e.target.checked)}
                style={{ width: "18px", height: "18px", accentColor: "var(--status-present)" }}
              />
              <span style={{ fontSize: "0.85rem", fontWeight: 700, color: etkinlikYapildi ? "#1b4332" : "var(--md-navy-primary)" }}>
                ✓ "{activeLesson.etkinlikAdi}" okul etkinliğini yaptım / tamamladım
              </span>
            </label>

            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.6rem",
                padding: "0.6rem 0.8rem",
                background: tavsiyelerKontrolEdildi ? "#d8f3dc" : "#ffffff",
                border: tavsiyelerKontrolEdildi ? "1.5px solid #52b788" : "1px solid var(--md-cream-border)",
                borderRadius: "6px",
                cursor: "pointer",
                transition: "all 0.15s",
              }}
            >
              <input
                type="checkbox"
                checked={tavsiyelerKontrolEdildi}
                onChange={(e) => setTavsiyelerKontrolEdildi(e.target.checked)}
                style={{ width: "18px", height: "18px", accentColor: "var(--status-present)" }}
              />
              <span style={{ fontSize: "0.85rem", fontWeight: 700, color: tavsiyelerKontrolEdildi ? "#1b4332" : "var(--md-navy-primary)" }}>
                ✓ Öğretmenimin verdiği haftalık tavsiyeleri (test/çalışma) kontrol ettim
              </span>
            </label>

            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.6rem",
                padding: "0.6rem 0.8rem",
                background: soruCozumuTamamlandi ? "#d8f3dc" : "#ffffff",
                border: soruCozumuTamamlandi ? "1.5px solid #52b788" : "1px solid var(--md-cream-border)",
                borderRadius: "6px",
                cursor: "pointer",
                transition: "all 0.15s",
              }}
            >
              <input
                type="checkbox"
                checked={soruCozumuTamamlandi}
                onChange={(e) => setSoruCozumuTamamlandi(e.target.checked)}
                style={{ width: "18px", height: "18px", accentColor: "var(--status-present)" }}
              />
              <span style={{ fontSize: "0.85rem", fontWeight: 600, color: soruCozumuTamamlandi ? "#1b4332" : "var(--md-text-primary)" }}>
                ✓ Evde ilgili konudan 20 pekiştirme sorusu çözdüm
              </span>
            </label>
          </div>

          {/* Sağ Kolon: Öğrenci / Veli Notu */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
            <label className="md-label" style={{ fontSize: "0.8rem" }}>
              {userType === "veli" ? "Veli Gözlem Notu (Opsiyonel)" : "Günün Notu / Anlamadığın Yer (Öğretmene İletilir)"}
            </label>
            <textarea
              className="md-textarea"
              rows={4}
              value={studentNote}
              onChange={(e) => setStudentNote(e.target.value)}
              placeholder="Örn: Eksen eğikliğinin mevsimlere etkisini çok iyi anladım. Sıcaklık grafiği sorusunu yarın öğretmene soracağım..."
              style={{ fontSize: "0.8rem" }}
            />
          </div>
        </div>

        {/* Eylem Çubuğu ve Sonuç Durumu */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.75rem" }}>
          <div>
            {isMatched ? (
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.4rem",
                  padding: "0.4rem 0.8rem",
                  background: "#d8f3dc",
                  color: "#1b4332",
                  border: "1px solid #74c69d",
                  borderRadius: "999px",
                  fontSize: "0.825rem",
                  fontWeight: 700,
                }}
              >
                🎯 Okul ile Ev Çalışması Anında Eşleşti (%100 Tamamlandı)
              </span>
            ) : (
              <span style={{ fontSize: "0.8rem", color: "var(--md-text-muted)" }}>
                ⚠️ Okul ve ev çalışmasını eşleştirmek için yukarıdaki maddeleri onaylayınız.
              </span>
            )}
          </div>

          <button
            type="submit"
            className="md-btn md-btn-primary"
            style={{ padding: "0.6rem 1.4rem", fontSize: "0.875rem", display: "flex", alignItems: "center", gap: "0.5rem" }}
          >
            <span>💾</span>
            <span>Eşleştirmeyi Kaydet & Onayla</span>
          </button>
        </div>
      </form>

      {savedSuccess && (
        <div
          style={{
            marginTop: "1rem",
            padding: "0.75rem 1rem",
            background: "#d8f3dc",
            border: "1px solid #2d6a4f",
            borderRadius: "var(--radius-sm)",
            color: "#1b4332",
            fontSize: "0.85rem",
            fontWeight: 600,
          }}
        >
          ✓ Harika! {activeLesson.subject} dersi için okulda işlenen kazanım ile evdeki çalışma başarıyla eşleştirildi ve veli/öğretmen sistemine işlendi.
        </div>
      )}
    </div>
  );
}
