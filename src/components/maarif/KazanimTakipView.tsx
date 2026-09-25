"use client";

import React, { useState } from "react";
import mockYillikPlanlarData from "@/data/mockYillikPlanlar.json";
import { MOCK_MAARIF_KAZANIMLAR } from "@/lib/maarif/seedData";
import KavramYanilgisiCard from "./KavramYanilgisiCard";
import LgsVurgusuCard from "./LgsVurgusuCard";

export default function KazanimTakipView() {
  const [selectedGrade, setSelectedGrade] = useState<number>(5);
  const [selectedSubject, setSelectedSubject] = useState<string>("Tümü");
  const [search, setSearch] = useState<string>("");
  const [viewMode, setViewMode] = useState<"kartlar" | "json">("kartlar");
  const [copiedJson, setCopiedJson] = useState(false);

  const erdemler = [
    { name: "Adalet", count: 28, color: "#1f7a8c" },
    { name: "Dürüstlük", count: 32, color: "#c6923b" },
    { name: "Merhamet", count: 24, color: "#52796f" },
    { name: "Sorumluluk", count: 36, color: "#122646" },
    { name: "Vatanseverlik", count: 22, color: "#d95d39" },
    { name: "Saygı", count: 30, color: "#6b705c" },
  ];

  const beceriler = [
    { name: "Kavramsal Beceriler", desc: "Eleştirel düşünme, mantıksal akıl yürütme, problem çözme", pct: 84 },
    { name: "Sosyo-Duygusal Beceriler", desc: "Öz farkındalık, empati, iş birliği ve iletişim", pct: 78 },
    { name: "Okuryazarlık Becerileri", desc: "Dijital, finansal, fen ve dil okuryazarlığı", pct: 88 },
    { name: "Eğilimler", desc: "Merak, bilimsel etik, estetik duyarlılık ve azim", pct: 72 },
  ];

  // 5, 6, 7, 8. Sınıf planlarını JSON dosyasından çek
  const gradeJsonData = mockYillikPlanlarData.yillikPlanlar.find(
    (g) => g.grade === selectedGrade
  );

  // JSON planlarından düz liste üret
  const jsonPlanItems = gradeJsonData
    ? gradeJsonData.dersler.flatMap((ders) =>
        ders.plan.map((item: any) => ({
          id: `json-${selectedGrade}-${ders.dersAdi}-${item.hafta}`,
          grade: selectedGrade,
          dersAdi: ders.dersAdi,
          ogretmen: ders.ogretmen,
          hafta: item.hafta,
          ay: item.ay,
          unite: item.unite,
          konu: item.konu,
          kod: item.kazanimKodu,
          title: item.kazanimBasligi,
          ogrenmeCiktisi: item.maarifCiktisi,
          erdemDeger: item.erdemDeger,
          beceriAlani: item.beceriAlani,
          surecOdakliDegerlendirme: item.surecOdakliDegerlendirme,
          ogretmenTavsiyesi: item.ogretmenTavsiyesi,
          kavramYanilgisi: item.kavramYanilgisi,
          isLgsKritik: item.isLgsKritik,
          lgsVurgusu: item.lgsVurgusu,
        }))
      )
    : [];

  // 9. Sınıf ve üzeri için MOCK_MAARIF_KAZANIMLAR
  const highSchoolItems = MOCK_MAARIF_KAZANIMLAR.filter(
    (k) => k.grade === selectedGrade
  ).map((k) => ({
    id: k.id,
    grade: k.grade,
    dersAdi: k.subject,
    ogretmen: "Zümre Öğretmeni",
    hafta: 4,
    ay: "Eylül",
    unite: k.unite,
    konu: k.title,
    kod: k.kod,
    title: k.title,
    ogrenmeCiktisi: k.ogrenmeCiktisi,
    erdemDeger: k.erdemDeger,
    beceriAlani: "Kavramsal Akıl Yürütme",
    surecOdakliDegerlendirme: k.surecOdakliDegerlendirme,
    ogretmenTavsiyesi: {
      gorev: "Kazanım kavrama alıştırmaları ve süreç formu.",
      testKitabi: "MEB Maarif Modeli Çalışma Kitabı",
      soruSayisi: 20,
      ogretmenNotu: "Konu tekrarını tamamlayınız.",
      teslimTarihi: "Hafta sonu",
    },
    kavramYanilgisi: k.kavramYanilgisi,
    isLgsKritik: k.isLgsKritik,
    lgsVurgusu: k.lgsVurgusu,
  }));

  const allDisplayItems = selectedGrade >= 5 && selectedGrade <= 8 ? jsonPlanItems : highSchoolItems;

  const filteredItems = allDisplayItems.filter((item) => {
    const matchSubject = selectedSubject === "Tümü" || item.dersAdi === selectedSubject;
    const matchSearch =
      !search ||
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.kod.toLowerCase().includes(search.toLowerCase()) ||
      item.konu.toLowerCase().includes(search.toLowerCase()) ||
      item.erdemDeger.toLowerCase().includes(search.toLowerCase());
    return matchSubject && matchSearch;
  });

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(mockYillikPlanlarData, null, 2));
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2000);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.75rem" }}>
      {/* Top Banner (Pastel Lacivert & Krem) */}
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
            <span style={{ fontSize: "1.6rem" }}>🎯</span>
            <h2 style={{ fontSize: "1.35rem", fontWeight: 800, color: "#ffffff" }}>
              MEB Yıllık Plan & Maarif Modeli Kazanım Takibi
            </h2>
            <span
              style={{
                background: "rgba(198, 146, 59, 0.25)",
                color: "var(--md-accent-gold-light)",
                border: "1px solid rgba(198, 146, 59, 0.5)",
                fontSize: "0.75rem",
                padding: "0.2rem 0.5rem",
                borderRadius: "4px",
                fontWeight: 700,
              }}
            >
              📦 JSON Mock Veri
            </span>
          </div>
          <p style={{ color: "#c2d6ed", fontSize: "0.875rem", marginTop: "0.3rem", maxWidth: "720px" }}>
            Harici veritabanına bağlanmadan, %100 yerel JSON formatındaki sahte (mock) MEB yıllık plan ve
            Türkiye Yüzyılı Maarif Modeli erdem-değer-eylem kazanım iskeleti.
          </p>
        </div>

        {/* View Mode Toggle: Kartlar vs Raw JSON */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <button
            type="button"
            onClick={() => setViewMode("kartlar")}
            style={{
              padding: "0.5rem 1rem",
              borderRadius: "6px",
              border: "none",
              fontSize: "0.85rem",
              fontWeight: 700,
              cursor: "pointer",
              background: viewMode === "kartlar" ? "var(--md-accent-gold)" : "rgba(255,255,255,0.12)",
              color: viewMode === "kartlar" ? "#0f1d33" : "#ffffff",
            }}
          >
            📋 Kart Görünümü
          </button>
          <button
            type="button"
            onClick={() => setViewMode("json")}
            style={{
              padding: "0.5rem 1rem",
              borderRadius: "6px",
              border: "none",
              fontSize: "0.85rem",
              fontWeight: 700,
              cursor: "pointer",
              background: viewMode === "json" ? "var(--md-accent-gold)" : "rgba(255,255,255,0.12)",
              color: viewMode === "json" ? "#0f1d33" : "#ffffff",
            }}
          >
            📄 JSON Sahte Veri
          </button>
        </div>
      </div>

      {/* Pastel Renk Bilgilendirme Rozeti */}
      <div
        style={{
          padding: "0.85rem 1.25rem",
          background: "var(--md-cream-surface)",
          border: "1px solid var(--md-cream-border)",
          borderLeft: "5px solid var(--md-navy-primary)",
          borderRadius: "var(--radius-sm)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "0.75rem",
          fontSize: "0.85rem",
          color: "var(--md-text-primary)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
          <span style={{ fontSize: "1.2rem" }}>🎨</span>
          <div>
            <strong>Arayüz İskeleti:</strong> Pastel lacivert (<code>#122646</code> / <code>#1a3359</code>) ve pastel krem (<code>#f9f7f2</code> / <code>#f4efe6</code>) renk paleti.
            <div style={{ fontSize: "0.785rem", color: "var(--md-text-secondary)", marginTop: "0.1rem" }}>
              Veritabanına bağlanmadan, <code>src/data/mockYillikPlanlar.json</code> içerisindeki MEB yıllık plan verilerini kullanmaktadır.
            </div>
          </div>
        </div>

        <span className="md-chip md-chip-present">
          ✓ Çevrimdışı & Yerel Mock Modu Aktif
        </span>
      </div>

      {viewMode === "json" ? (
        /* Raw JSON Mock Data Inspector */
        <div className="md-card" style={{ padding: "1.5rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
            <div>
              <h3 style={{ fontSize: "1.1rem", color: "var(--md-navy-primary)" }}>
                📄 JSON Formatında Sahte (Mock) Yıllık Plan Verisi
              </h3>
              <p style={{ color: "var(--md-text-muted)", fontSize: "0.8rem" }}>
                Dosya Yolu: <code>src/data/mockYillikPlanlar.json</code> (5, 6, 7 ve 8. Sınıf tüm dersler ve Maarif çıktıları)
              </p>
            </div>
            <button
              type="button"
              onClick={handleCopyJson}
              className="md-btn md-btn-secondary"
              style={{ fontSize: "0.85rem" }}
            >
              {copiedJson ? "✓ JSON Kopyalandı!" : "📋 JSON Kopyala"}
            </button>
          </div>

          <pre
            style={{
              padding: "1.25rem",
              borderRadius: "8px",
              background: "#0a1628",
              color: "#a8c0de",
              fontFamily: "var(--font-mono)",
              fontSize: "0.825rem",
              lineHeight: 1.5,
              maxHeight: "550px",
              overflowY: "auto",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            {JSON.stringify(mockYillikPlanlarData, null, 2)}
          </pre>
        </div>
      ) : (
        /* Normal Kart Görünümü */
        <>
          {/* Erdem & Beceri Dağılımı İstatistikleri */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
            {/* Erdem - Değer - Eylem */}
            <div className="md-card" style={{ padding: "1.5rem" }}>
              <h3 style={{ fontSize: "1.1rem", marginBottom: "0.25rem", color: "var(--md-navy-primary)" }}>
                Erdem - Değer - Eylem Çerçevesi
              </h3>
              <p style={{ color: "var(--md-text-muted)", fontSize: "0.8rem", marginBottom: "1rem" }}>
                Müfredat kazanımlarına entegre edilen ahlaki ve insani değer göstergeleri
              </p>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.75rem" }}>
                {erdemler.map((e) => (
                  <div
                    key={e.name}
                    style={{
                      padding: "0.85rem",
                      borderRadius: "var(--radius-sm)",
                      background: "var(--md-cream-surface)",
                      border: "1px solid var(--md-cream-border)",
                      textAlign: "center",
                    }}
                  >
                    <div style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--md-text-primary)" }}>
                      {e.name}
                    </div>
                    <div style={{ fontSize: "1.25rem", fontWeight: 800, color: e.color, marginTop: "0.2rem" }}>
                      {e.count}
                    </div>
                    <div style={{ fontSize: "0.7rem", color: "var(--md-text-muted)" }}>İşlenen Kazanım</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Beceri Alanları & Süreç Odaklı Ölçme */}
            <div className="md-card" style={{ padding: "1.5rem" }}>
              <h3 style={{ fontSize: "1.1rem", marginBottom: "0.25rem", color: "var(--md-navy-primary)" }}>
                Gelişim ve Beceri Alanları
              </h3>
              <p style={{ color: "var(--md-text-muted)", fontSize: "0.8rem", marginBottom: "1rem" }}>
                Süreç odaklı değerlendirme ve öğrenci yetkinlik seviyeleri
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
                {beceriler.map((b) => (
                  <div key={b.name}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", marginBottom: "0.25rem" }}>
                      <span style={{ fontWeight: 600 }}>{b.name}</span>
                      <span style={{ fontWeight: 700, color: "var(--md-navy-primary)" }}>%{b.pct}</span>
                    </div>
                    <div
                      style={{
                        height: "8px",
                        borderRadius: "4px",
                        background: "var(--md-cream-surface)",
                        overflow: "hidden",
                        border: "1px solid var(--md-cream-border)",
                      }}
                    >
                      <div
                        style={{
                          height: "100%",
                          width: `${b.pct}%`,
                          background: "linear-gradient(90deg, var(--md-navy-primary) 0%, var(--md-accent-gold) 100%)",
                          borderRadius: "4px",
                        }}
                      />
                    </div>
                    <div style={{ fontSize: "0.725rem", color: "var(--md-text-muted)", marginTop: "0.15rem" }}>
                      {b.desc}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Kazanım Kataloğu & Filtreleme */}
          <div className="md-card" style={{ padding: "1.5rem" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "1rem",
                marginBottom: "1.25rem",
              }}
            >
              <div>
                <h3 style={{ fontSize: "1.15rem", color: "var(--md-navy-primary)" }}>
                  MEB e-Müfredat Yıllık Plan Kazanım Listesi (Mock JSON)
                </h3>
                <p style={{ color: "var(--md-text-secondary)", fontSize: "0.825rem" }}>
                  Ders ve sınıf bazında Türkiye Yüzyılı Maarif Modeli öğrenme çıktıları
                </p>
              </div>

              {/* Sınıf, Ders ve Arama Filtreleri */}
              <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap", alignItems: "center" }}>
                {/* 5, 6, 7, 8, 9 Sınıf Seçici */}
                <select
                  value={selectedGrade}
                  onChange={(e) => {
                    setSelectedGrade(Number(e.target.value));
                    setSelectedSubject("Tümü");
                  }}
                  className="md-select"
                  style={{ width: "135px", padding: "0.5rem" }}
                >
                  <option value={5}>5. Sınıf</option>
                  <option value={6}>6. Sınıf</option>
                  <option value={7}>7. Sınıf</option>
                  <option value={8}>8. Sınıf (LGS)</option>
                  <option value={9}>9. Sınıf</option>
                </select>

                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="md-select"
                  style={{ width: "180px", padding: "0.5rem" }}
                >
                  <option value="Tümü">Tüm Dersler</option>
                  <option value="Türkçe">Türkçe</option>
                  <option value="Matematik">Matematik</option>
                  <option value="Fen Bilimleri">Fen Bilimleri</option>
                  {selectedGrade === 8 ? (
                    <option value="T.C. İnkılap Tarihi ve Atatürkçülük">İnkılap Tarihi</option>
                  ) : (
                    <option value="Sosyal Bilgiler">Sosyal Bilgiler</option>
                  )}
                  <option value="İngilizce">İngilizce</option>
                  <option value="Din Kültürü ve Ahlak Bilgisi">Din Kültürü</option>
                </select>

                <input
                  type="text"
                  placeholder="Kazanımlarda ara..."
                  className="md-input"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  style={{ width: "200px", padding: "0.5rem" }}
                />
              </div>
            </div>

            {/* 8. Sınıf İnkılap Tarihi Kural Bildirimi */}
            {selectedGrade === 8 && (
              <div
                style={{
                  padding: "0.65rem 1rem",
                  background: "rgba(217, 93, 57, 0.08)",
                  border: "1px solid rgba(217, 93, 57, 0.25)",
                  borderRadius: "var(--radius-sm)",
                  fontSize: "0.8rem",
                  color: "#842029",
                  marginBottom: "1rem",
                }}
              >
                ℹ️ <strong>8. Sınıf Kuralı:</strong> MEB LGS müfredatında Sosyal Bilgiler yerine <strong>T.C. İnkılap Tarihi ve Atatürkçülük</strong> yer almaktadır.
              </div>
            )}

            {/* Kazanımlar Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))", gap: "1rem" }}>
              {filteredItems.map((k) => (
                <div
                  key={k.id}
                  style={{
                    padding: "1.25rem",
                    borderRadius: "var(--radius-sm)",
                    background: "var(--md-cream-surface)",
                    border: "1px solid var(--md-cream-border)",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    gap: "0.75rem",
                  }}
                >
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.4rem", flexWrap: "wrap", gap: "0.4rem" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", flexWrap: "wrap" }}>
                        <span
                          style={{
                            fontFamily: "var(--font-mono)",
                            fontSize: "0.8rem",
                            fontWeight: 700,
                            color: "var(--md-navy-primary)",
                            background: "rgba(18, 38, 70, 0.08)",
                            padding: "0.2rem 0.5rem",
                            borderRadius: "4px",
                          }}
                        >
                          {k.kod} • {k.dersAdi} • {k.hafta}. Hafta
                        </span>
                        {k.isLgsKritik && (
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
                              gap: "0.2rem",
                            }}
                          >
                            <span>🎯</span>
                            <span>LGS KRİTİK</span>
                          </span>
                        )}
                      </div>

                      <span className="md-chip md-chip-gold">
                        {k.erdemDeger}
                      </span>
                    </div>

                    <div style={{ fontWeight: 700, fontSize: "0.95rem", color: "var(--md-navy-primary)", marginBottom: "0.3rem" }}>
                      {k.title}
                    </div>

                    <div style={{ fontSize: "0.8rem", color: "var(--md-text-muted)", marginBottom: "0.5rem" }}>
                      <strong>Ünite/Tema:</strong> {k.unite} • <strong>Öğretmen:</strong> {k.ogretmen}
                    </div>

                    <div
                      style={{
                        padding: "0.6rem 0.8rem",
                        background: "#ffffff",
                        borderRadius: "6px",
                        border: "1px solid var(--md-cream-border)",
                        fontSize: "0.825rem",
                        color: "var(--md-text-secondary)",
                        lineHeight: 1.45,
                        marginBottom: "0.5rem",
                      }}
                    >
                      <strong style={{ color: "var(--md-navy-primary)" }}>Maarif Öğrenme Çıktısı: </strong>
                      {k.ogrenmeCiktisi}
                    </div>

                    {/* Kavram Yanılgısı Uyarısı */}
                    {k.kavramYanilgisi && (
                      <div style={{ marginBottom: "0.5rem" }}>
                        <KavramYanilgisiCard
                          baslik={k.kavramYanilgisi.baslik}
                          aciklama={k.kavramYanilgisi.aciklama}
                          dogrusu={k.kavramYanilgisi.dogrusu}
                          dersAdi={k.dersAdi}
                          kazanimKodu={k.kod}
                          compact
                        />
                      </div>
                    )}

                    {/* LGS Vurgusu & Çözüm İpuçları */}
                    {k.isLgsKritik && k.lgsVurgusu && (
                      <div style={{ marginBottom: "0.5rem" }}>
                        <LgsVurgusuCard
                          data={k.lgsVurgusu}
                          kazanimKodu={k.kod}
                          subject={k.dersAdi}
                        />
                      </div>
                    )}

                    {/* Öğretmen Tavsiyesi (Görev / Test) */}
                    {k.ogretmenTavsiyesi && (
                      <div
                        style={{
                          padding: "0.6rem 0.8rem",
                          background: "#fcfaf7",
                          borderRadius: "6px",
                          border: "1px dashed var(--md-accent-gold)",
                          fontSize: "0.8rem",
                          color: "var(--md-text-primary)",
                          marginBottom: "0.5rem",
                        }}
                      >
                        <div style={{ fontWeight: 700, color: "var(--md-navy-primary)", marginBottom: "0.2rem" }}>
                          💡 Öğretmen Tavsiyesi (Görev / Test):
                        </div>
                        <div><strong>Görev:</strong> {k.ogretmenTavsiyesi.gorev}</div>
                        <div style={{ color: "var(--md-accent-teal)", fontWeight: 600 }}>
                          Kaynak: {k.ogretmenTavsiyesi.testKitabi} ({k.ogretmenTavsiyesi.soruSayisi} Soru)
                        </div>
                      </div>
                    )}
                  </div>

                  <div
                    style={{
                      fontSize: "0.75rem",
                      color: "var(--md-accent-teal)",
                      fontWeight: 600,
                      display: "flex",
                      alignItems: "center",
                      gap: "0.3rem",
                      borderTop: "1px solid var(--md-cream-border)",
                      paddingTop: "0.5rem",
                    }}
                  >
                    <span>🔍</span> Ölçme: {k.surecOdakliDegerlendirme}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
