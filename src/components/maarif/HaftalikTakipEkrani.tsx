"use client";

import React, { useState, useEffect } from "react";
import { HAFTALIK_MUB_PLANLARI, type HaftalikDersPlani } from "@/lib/maarif/haftalikPlanData";
import {
  isTavsiyeCompleted,
  toggleTavsiyeCompletion,
  getTavsiyeCompletionInfo,
} from "@/lib/maarif/tavsiyeHelper";
import TavsiyeFeedbackToast from "./TavsiyeFeedbackToast";
import KavramYanilgisiCard from "./KavramYanilgisiCard";
import LgsVurgusuCard from "./LgsVurgusuCard";
import NetworkStatusBanner from "./NetworkStatusBanner";

interface HaftalikTakipEkraniProps {
  initialGrade?: number;
  userType?: "veli" | "ogrenci";
}

export default function HaftalikTakipEkrani({
  initialGrade = 8,
  userType = "ogrenci",
}: HaftalikTakipEkraniProps) {
  const [selectedGrade, setSelectedGrade] = useState<number>(initialGrade);
  const [currentWeek, setCurrentWeek] = useState<number>(4);
  const [expandedSubject, setExpandedSubject] = useState<string>("Matematik");
  const [completedTasks, setCompletedTasks] = useState<Record<string, boolean>>({});
  const [, setRefreshKey] = useState(0);

  useEffect(() => {
    const onTavsiyeUpdated = () => setRefreshKey((k) => k + 1);
    window.addEventListener("tavsiye-status-updated", onTavsiyeUpdated);
    return () => window.removeEventListener("tavsiye-status-updated", onTavsiyeUpdated);
  }, []);

  // 8. Sınıf için Sosyal Bilgiler yerine İnkılap Tarihi gelir!
  const dersListesi =
    selectedGrade === 8
      ? [
          { name: "Türkçe", icon: "📖", color: "#1f7a8c" },
          { name: "Matematik", icon: "📐", color: "#c6923b" },
          { name: "Fen Bilimleri", icon: "🔬", color: "#52796f" },
          { name: "T.C. İnkılap Tarihi ve Atatürkçülük", icon: "🇹🇷", color: "#d95d39" },
          { name: "İngilizce", icon: "🇬🇧", color: "#254474" },
          { name: "Din Kültürü ve Ahlak Bilgisi", icon: "🕌", color: "#6b705c" },
        ]
      : [
          { name: "Türkçe", icon: "📖", color: "#1f7a8c" },
          { name: "Matematik", icon: "📐", color: "#c6923b" },
          { name: "Fen Bilimleri", icon: "🔬", color: "#52796f" },
          { name: "Sosyal Bilgiler", icon: "🌍", color: "#d95d39" },
          { name: "İngilizce", icon: "🇬🇧", color: "#254474" },
          { name: "Din Kültürü ve Ahlak Bilgisi", icon: "🕌", color: "#6b705c" },
        ];

  const handlePrevWeek = () => {
    if (currentWeek > 1) setCurrentWeek(currentWeek - 1);
  };

  const handleNextWeek = () => {
    if (currentWeek < 36) setCurrentWeek(currentWeek + 1);
  };

  const handleToggleTavsiye = (taskKey: string) => {
    const res = toggleTavsiyeCompletion(taskKey, userType);
    setCompletedTasks((prev) => ({
      ...prev,
      [taskKey]: res.isCompleted,
    }));
  };

  // Hafta tarihleri hesaplama
  const getWeekDates = (week: number) => {
    const dates: Record<number, string> = {
      1: "1 - 5 Eylül 2026",
      2: "8 - 12 Eylül 2026",
      3: "15 - 19 Eylül 2026",
      4: "22 - 26 Eylül 2026 (Güncel)",
      5: "29 Eylül - 3 Ekim 2026",
      6: "6 - 10 Ekim 2026",
    };
    return dates[week] || `${week}. Hafta Müfredat Dönemi`;
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {/* PWA & Offline Durum Göstergesi */}
      <NetworkStatusBanner />

      {/* Top Banner */}
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
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
            <span style={{ fontSize: "1.6rem" }}>📅</span>
            <h2 style={{ fontSize: "1.35rem", fontWeight: 800, color: "#ffffff" }}>
              Veli ve Öğrenci Haftalık Takip Ekranı
            </h2>
            <span className="md-chip md-chip-gold">
              {userType === "veli" ? "👨‍👩‍👧 Veli Görünümü" : "🎓 Öğrenci Görünümü"}
            </span>
          </div>
          <p style={{ color: "#c2d6ed", fontSize: "0.85rem", marginTop: "0.3rem" }}>
            MEB yıllık planı, güncel haftanın konusu, Maarif Modeli çıktısı ve o hafta için verilen öğretmen tavsiyeleri (görev/test).
          </p>
        </div>

        {/* Grade Selector (5, 6, 7 veya 8) */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <span style={{ fontSize: "0.85rem", color: "#a8c0de", fontWeight: 600 }}>Sınıf Seçimi:</span>
          <div
            style={{
              display: "inline-flex",
              background: "rgba(0,0,0,0.3)",
              padding: "0.25rem",
              borderRadius: "8px",
              border: "1px solid rgba(255,255,255,0.15)",
              gap: "0.2rem",
            }}
          >
            {[5, 6, 7, 8].map((grade) => (
              <button
                key={grade}
                type="button"
                onClick={() => setSelectedGrade(grade)}
                style={{
                  padding: "0.45rem 0.85rem",
                  borderRadius: "6px",
                  border: "none",
                  fontSize: "0.85rem",
                  fontWeight: selectedGrade === grade ? 800 : 500,
                  background: selectedGrade === grade ? "var(--md-accent-gold)" : "transparent",
                  color: selectedGrade === grade ? "#0f1d33" : "#ffffff",
                  cursor: "pointer",
                  transition: "all 0.15s",
                }}
              >
                {grade}. Sınıf
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Week Navigation Header ("Önceki / Sonraki Hafta" Okları) */}
      <div
        className="md-card"
        style={{
          padding: "1rem 1.5rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "1rem",
          background: "#ffffff",
          border: "1.5px solid var(--md-cream-border)",
        }}
      >
        <button
          type="button"
          onClick={handlePrevWeek}
          disabled={currentWeek <= 1}
          className="md-btn md-btn-secondary"
          style={{ padding: "0.5rem 1rem", fontSize: "0.85rem" }}
        >
          ← Önceki Hafta
        </button>

        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "1.15rem", fontWeight: 800, color: "var(--md-navy-primary)" }}>
            {currentWeek}. Hafta
          </div>
          <div style={{ fontSize: "0.8rem", color: "var(--md-text-muted)", marginTop: "0.15rem" }}>
            📅 {getWeekDates(currentWeek)} • {selectedGrade}. Sınıf Müfredatı
          </div>
        </div>

        <button
          type="button"
          onClick={handleNextWeek}
          disabled={currentWeek >= 36}
          className="md-btn md-btn-secondary"
          style={{ padding: "0.5rem 1rem", fontSize: "0.85rem" }}
        >
          Sonraki Hafta →
        </button>
      </div>

      {/* 8. Sınıf Bilgilendirme Notu */}
      {selectedGrade === 8 && (
        <div
          style={{
            padding: "0.75rem 1.25rem",
            background: "rgba(217, 93, 57, 0.08)",
            border: "1px solid rgba(217, 93, 57, 0.25)",
            borderRadius: "var(--radius-sm)",
            fontSize: "0.825rem",
            color: "#842029",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          <span>ℹ️</span>
          <span>
            <strong>MEB Müfredat Kuralı:</strong> 8. Sınıf LGS kademesinde <em>Sosyal Bilgiler</em> dersi yerine otomatik olarak <strong>T.C. İnkılap Tarihi ve Atatürkçülük</strong> dersi listelenmektedir.
          </span>
        </div>
      )}

      {/* Alt Alta Sıralı Ders Listesi */}
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {dersListesi.map((dersItem) => {
          const isExpanded = expandedSubject === dersItem.name;

          // Bu sınıf, ders ve hafta için planı bul veya en yakın planı eşleştir
          const plan =
            HAFTALIK_MUB_PLANLARI.find(
              (p) =>
                p.grade === selectedGrade &&
                p.ders === dersItem.name &&
                p.hafta === currentWeek
            ) ||
            HAFTALIK_MUB_PLANLARI.find(
              (p) => p.grade === selectedGrade && p.ders === dersItem.name
            ) ||
            HAFTALIK_MUB_PLANLARI.find((p) => p.ders === dersItem.name) || {
              grade: selectedGrade,
              ders: dersItem.name,
              hafta: currentWeek,
              konu: `${dersItem.name} ${currentWeek}. Hafta Temel Konusu ve Kavramları`,
              kazanimKodu: `${dersItem.name.slice(0, 3).toUpperCase()}.${selectedGrade}.${currentWeek}.1`,
              kazanimBasligi: `${dersItem.name} dersi ${currentWeek}. hafta öğrenme alanı kazanım göstergeleri.`,
              maarifCiktisi: "Konuyla ilgili temel kavramları eleştirel düşünme ve erdem ilkeleriyle analiz eder.",
              erdemDeger: "Sorumluluk & Çalışkanlık",
              beceriAlani: "Kavramsal Akıl Yürütme",
              ogretmenTavsiyesi: {
                gorev: `MEB Maarif Modeli ${selectedGrade}. Sınıf ${dersItem.name} çalışma fasikülü alıştırmaları.`,
                testKitabi: `MEB ${selectedGrade}. Sınıf ${dersItem.name} Kazanım Testi ${currentWeek}`,
                soruSayisi: 20,
                ogretmenNotu: "Konu tekrarını tamamladıktan sonra soruları süre tutarak çözünüz.",
                teslimTarihi: "Hafta sonu",
              },
            };

          const taskKey = `${selectedGrade}-${dersItem.name}-${currentWeek}`;
          const isTaskCompleted = isTavsiyeCompleted(taskKey) || Boolean(completedTasks[taskKey]);
          const completionInfo = getTavsiyeCompletionInfo(taskKey);

          return (
            <div
              key={dersItem.name}
              className="md-card"
              style={{
                borderRadius: "var(--radius-md)",
                border: isExpanded
                  ? "2px solid var(--md-navy-primary)"
                  : "1px solid var(--md-cream-border)",
                overflow: "hidden",
                transition: "all 0.2s",
                boxShadow: isExpanded ? "var(--md-elevation-3)" : "var(--md-elevation-1)",
              }}
            >
              {/* Ders Başlık Satırı (Tıklanabilir) */}
              <div
                onClick={() => setExpandedSubject(isExpanded ? "" : dersItem.name)}
                style={{
                  padding: "1.15rem 1.5rem",
                  background: isExpanded ? "var(--md-cream-surface)" : "#ffffff",
                  cursor: "pointer",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: "0.75rem",
                  userSelect: "none",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.85rem" }}>
                  <div
                    style={{
                      width: "42px",
                      height: "42px",
                      borderRadius: "10px",
                      background: isExpanded ? "var(--md-navy-primary)" : "var(--md-cream-surface)",
                      color: isExpanded ? "#ffffff" : "var(--md-navy-primary)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "1.3rem",
                      border: "1px solid var(--md-cream-border)",
                    }}
                  >
                    {dersItem.icon}
                  </div>

                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
                      <h3 style={{ fontSize: "1.05rem", fontWeight: 800, color: "var(--md-navy-primary)" }}>
                        {dersItem.name}
                      </h3>
                      <span
                        style={{
                          fontSize: "0.7rem",
                          fontFamily: "var(--font-mono)",
                          padding: "0.1rem 0.4rem",
                          borderRadius: "4px",
                          background: "rgba(18, 38, 70, 0.08)",
                          color: "var(--md-navy-primary)",
                          fontWeight: 700,
                        }}
                      >
                        {plan.kazanimKodu}
                      </span>
                      {plan.isLgsKritik && (
                        <span
                          style={{
                            fontSize: "0.68rem",
                            fontWeight: 800,
                            padding: "0.15rem 0.45rem",
                            borderRadius: "4px",
                            background: "linear-gradient(135deg, #1d4ed8 0%, #2563eb 100%)",
                            color: "#ffffff",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "0.25rem",
                            boxShadow: "0 2px 4px rgba(29, 78, 216, 0.25)",
                          }}
                        >
                          <span>🎯</span>
                          <span>LGS KRİTİK</span>
                        </span>
                      )}
                      {plan.kavramYanilgisi && (
                        <span
                          style={{
                            fontSize: "0.68rem",
                            fontWeight: 700,
                            padding: "0.15rem 0.45rem",
                            borderRadius: "4px",
                            background: "rgba(221, 107, 32, 0.12)",
                            color: "#c05621",
                            border: "1px solid rgba(221, 107, 32, 0.3)",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "0.2rem",
                          }}
                        >
                          <span>⚠️</span>
                          <span>Kavram Yanılgısı Uyarısı</span>
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: "0.825rem", color: "var(--md-text-secondary)", marginTop: "0.15rem" }}>
                      <strong>Konu:</strong> {plan.konu}
                    </div>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <span className="md-chip md-chip-gold" style={{ fontSize: "0.75rem" }}>
                    {plan.erdemDeger.split(" &")[0]}
                  </span>

                  <span
                    style={{
                      width: "28px",
                      height: "28px",
                      borderRadius: "50%",
                      background: "rgba(0,0,0,0.05)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "0.85rem",
                      fontWeight: 700,
                      transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
                      transition: "transform 0.2s",
                      color: "var(--md-navy-primary)",
                    }}
                  >
                    ▼
                  </span>
                </div>
              </div>

              {/* Tıklanınca Açılan Ayrıntı: MEB Planı, Kazanım, Maarif Çıktısı & Öğretmen Tavsiyeleri */}
              {isExpanded && (
                <div
                  style={{
                    padding: "1.5rem",
                    background: "#ffffff",
                    borderTop: "1px solid var(--md-cream-border)",
                    display: "flex",
                    flexDirection: "column",
                    gap: "1.25rem",
                  }}
                >
                  {/* MEB Konusu & Kazanımı */}
                  <div
                    style={{
                      padding: "1rem 1.25rem",
                      borderRadius: "var(--radius-sm)",
                      background: "var(--md-cream-surface)",
                      border: "1px solid var(--md-cream-border)",
                      borderLeft: "5px solid var(--md-navy-primary)",
                    }}
                  >
                    <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--md-text-muted)", textTransform: "uppercase" }}>
                      MEB Yıllık Plan Kazanımı ({plan.kazanimKodu})
                    </div>
                    <div style={{ fontSize: "0.95rem", fontWeight: 700, color: "var(--md-navy-primary)", marginTop: "0.25rem" }}>
                      {plan.kazanimBasligi}
                    </div>
                  </div>

                  {/* Türkiye Yüzyılı Maarif Modeli Öğrenme Çıktısı */}
                  <div
                    style={{
                      padding: "1rem 1.25rem",
                      borderRadius: "var(--radius-sm)",
                      background: "rgba(198, 146, 59, 0.08)",
                      border: "1px solid rgba(198, 146, 59, 0.3)",
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.35rem",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                        <span style={{ fontSize: "1rem" }}>🇹🇷</span>
                        <strong style={{ fontSize: "0.85rem", color: "#8a5814" }}>
                          Türkiye Yüzyılı Maarif Modeli Öğrenme Çıktısı
                        </strong>
                      </div>
                      <span className="md-chip md-chip-gold" style={{ fontSize: "0.7rem", padding: "0.1rem 0.4rem" }}>
                        {plan.beceriAlani}
                      </span>
                    </div>

                    <p style={{ fontSize: "0.875rem", color: "var(--md-text-primary)", lineHeight: 1.45 }}>
                      {plan.maarifCiktisi}
                    </p>

                    <div style={{ fontSize: "0.75rem", color: "#8a5814", fontWeight: 600 }}>
                      Hedeflenen Erdem & Değer: <u>{plan.erdemDeger}</u>
                    </div>
                  </div>

                  {/* Kavram Yanılgısı / Dikkat Uyarı Kutusu */}
                  {plan.kavramYanilgisi && (
                    <KavramYanilgisiCard
                      baslik={plan.kavramYanilgisi.baslik}
                      aciklama={plan.kavramYanilgisi.aciklama}
                      dogrusu={plan.kavramYanilgisi.dogrusu}
                      dersAdi={dersItem.name}
                      kazanimKodu={plan.kazanimKodu}
                    />
                  )}

                  {/* LGS Vurgusu & Yeni Nesil Soru Çözüm İpuçları (8. Sınıf) */}
                  {plan.isLgsKritik && plan.lgsVurgusu && (
                    <LgsVurgusuCard
                      data={plan.lgsVurgusu}
                      kazanimKodu={plan.kazanimKodu}
                      subject={dersItem.name}
                    />
                  )}

                  {/* Öğretmen Tavsiyesi (Test / Çalışma) Bölümü */}
                  <div
                    style={{
                      padding: "1.25rem",
                      borderRadius: "var(--radius-sm)",
                      background: isTaskCompleted ? "rgba(216, 243, 220, 0.45)" : "#fcfaf7",
                      border: isTaskCompleted ? "2px solid #52b788" : "1.5px solid var(--md-accent-gold)",
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.75rem",
                      transition: "all 0.25s ease",
                      boxShadow: isTaskCompleted ? "0 2px 8px rgba(45, 106, 79, 0.15)" : "none",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.5rem" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <span style={{ fontSize: "1.2rem" }}>💡</span>
                        <h4 style={{ fontSize: "0.95rem", color: isTaskCompleted ? "#1b4332" : "var(--md-navy-primary)", fontWeight: 800 }}>
                          Bu Hafta İçin Verilmiş Öğretmen Tavsiyesi (Çalışma / Test)
                        </h4>
                      </div>

                      <label
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.45rem",
                          fontSize: "0.825rem",
                          fontWeight: 700,
                          color: isTaskCompleted ? "var(--status-present)" : "var(--md-text-muted)",
                          cursor: "pointer",
                          padding: "0.3rem 0.6rem",
                          background: isTaskCompleted ? "#d8f3dc" : "transparent",
                          borderRadius: "6px",
                          border: isTaskCompleted ? "1px solid #74c69d" : "1px solid transparent",
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={isTaskCompleted}
                          onChange={() => handleToggleTavsiye(taskKey)}
                          style={{
                            width: "18px",
                            height: "18px",
                            cursor: "pointer",
                            accentColor: "var(--status-present)",
                          }}
                        />
                        {isTaskCompleted ? "✓ Tavsiye Tamamlandı (Şeffaf Arşiv)" : "Tamamlandı Olarak İşaretle"}
                      </label>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "1rem" }}>
                      <div>
                        <div
                          style={{
                            fontSize: "0.875rem",
                            color: isTaskCompleted ? "#2d6a4f" : "var(--md-text-primary)",
                            lineHeight: 1.5,
                            marginBottom: "0.4rem",
                            textDecoration: isTaskCompleted ? "line-through" : "none",
                            opacity: isTaskCompleted ? 0.88 : 1,
                          }}
                        >
                          <strong>Verilen Tavsiye / Çalışma: </strong>
                          {plan.ogretmenTavsiyesi.gorev}
                        </div>

                        <div style={{ fontSize: "0.825rem", color: "var(--md-text-secondary)", fontStyle: "italic", marginBottom: "0.3rem" }}>
                          <strong>Öğretmen Tavsiye Notu: </strong>"{plan.ogretmenTavsiyesi.ogretmenNotu}"
                        </div>

                        {isTaskCompleted && (
                          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginTop: "0.4rem", flexWrap: "wrap" }}>
                            <span
                              style={{
                                padding: "0.2rem 0.55rem",
                                borderRadius: "4px",
                                background: "#d8f3dc",
                                border: "1px solid #74c69d",
                                fontSize: "0.75rem",
                                fontWeight: 700,
                                color: "#1b4332",
                              }}
                            >
                              🎉 Harika gidiyorsun! {completionInfo?.badge || "🌟 Maarif Başarı Rozeti"}
                            </span>
                            <span style={{ fontSize: "0.72rem", color: "#2d6a4f" }}>
                              Tamamlanma: {completionInfo?.completedAt || "Az önce"}
                            </span>
                          </div>
                        )}
                      </div>

                      <div
                        style={{
                          padding: "0.75rem",
                          background: "#ffffff",
                          borderRadius: "6px",
                          border: "1px solid var(--md-cream-border)",
                          display: "flex",
                          flexDirection: "column",
                          gap: "0.3rem",
                          fontSize: "0.785rem",
                        }}
                      >
                        <div>
                          <strong style={{ color: "var(--md-navy-primary)" }}>Önerilen Kaynak:</strong>
                          <br />
                          {plan.ogretmenTavsiyesi.testKitabi}
                        </div>
                        <div style={{ color: "var(--md-accent-teal)", fontWeight: 600 }}>
                          Soru Hedefi: {plan.ogretmenTavsiyesi.soruSayisi} Soru
                        </div>
                        <div style={{ color: "var(--md-text-muted)" }}>
                          📅 Teslim / Kontrol: {plan.ogretmenTavsiyesi.teslimTarihi}
                        </div>
                      </div>
                    </div>

                    <div style={{ fontSize: "0.72rem", color: "var(--md-text-muted)", fontStyle: "italic", borderTop: "1px dashed rgba(0,0,0,0.08)", paddingTop: "0.4rem" }}>
                      📌 <strong>Kural:</strong> Tik atılan tavsiyeler ekrandan silinmez; şeffaf arşiv statüsünde yeşil renkli olarak kayıt altında tutulur.
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Pozitif Geri Bildirim ve Rozet Bildirimi */}
      <TavsiyeFeedbackToast />
    </div>
  );
}
