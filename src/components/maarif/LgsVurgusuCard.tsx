"use client";

import React, { useState } from "react";

export interface LgsVurgusuData {
  onemDerecesi?: "Kritik" | "Çok Yüksek" | "Yüksek";
  soruTipi: string;
  cozumIpuclari: string[];
  ornekSoruAnalizi: string;
}

interface LgsVurgusuCardProps {
  data: LgsVurgusuData;
  kazanimKodu?: string;
  subject?: string;
}

export default function LgsVurgusuCard({ data, kazanimKodu, subject }: LgsVurgusuCardProps) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div
      style={{
        borderRadius: "var(--radius-sm)",
        background: "linear-gradient(135deg, #f0f4ff 0%, #fafcff 100%)",
        border: "1.5px solid #3b82f6",
        padding: "1rem 1.25rem",
        boxShadow: "0 4px 12px rgba(59, 130, 246, 0.12)",
        position: "relative",
      }}
    >
      <div
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          cursor: "pointer",
          userSelect: "none",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", flexWrap: "wrap" }}>
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.25rem",
              background: "linear-gradient(135deg, #1d4ed8 0%, #2563eb 100%)",
              color: "#ffffff",
              padding: "0.25rem 0.6rem",
              borderRadius: "6px",
              fontSize: "0.75rem",
              fontWeight: 800,
              letterSpacing: "0.5px",
              boxShadow: "0 2px 6px rgba(29, 78, 216, 0.3)",
            }}
          >
            <span>🎯</span>
            <span>LGS KRİTİK KAZANIM</span>
          </span>

          <span
            style={{
              fontSize: "0.72rem",
              fontWeight: 800,
              padding: "0.2rem 0.5rem",
              borderRadius: "4px",
              background: "#fee2e2",
              color: "#b91c1c",
            }}
          >
            🔥 {data.onemDerecesi || "Kritik"} Öncelikli
          </span>

          <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--md-navy-primary)" }}>
            Senaryo Temelli & Yeni Nesil Soru Çözüm İpuçları
          </span>
        </div>

        <button
          type="button"
          style={{
            background: "none",
            border: "none",
            fontSize: "0.75rem",
            color: "#1d4ed8",
            fontWeight: 700,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "0.2rem",
          }}
        >
          <span>{isOpen ? "Kapat" : "İpuçlarını Aç"}</span>
          <span style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}>
            ▼
          </span>
        </button>
      </div>

      {isOpen && (
        <div style={{ marginTop: "0.85rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {/* LGS Soru Tipi Modeli */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap", fontSize: "0.825rem" }}>
            <span style={{ fontWeight: 700, color: "#1e3a8a" }}>Soru Tipi Modeli:</span>
            <span
              style={{
                background: "#e0e7ff",
                color: "#1e40af",
                padding: "0.15rem 0.5rem",
                borderRadius: "4px",
                fontWeight: 600,
              }}
            >
              {data.soruTipi}
            </span>
          </div>

          {/* Senaryo Temelli Adım Adım Taktikler */}
          <div
            style={{
              padding: "0.75rem 1rem",
              borderRadius: "6px",
              background: "#ffffff",
              border: "1px solid #bfdbfe",
            }}
          >
            <div style={{ fontSize: "0.785rem", fontWeight: 800, color: "#1e40af", marginBottom: "0.4rem" }}>
              💡 Yeni Nesil Soru Çözüm Taktikleri:
            </div>
            <ul style={{ margin: 0, paddingLeft: "1.2rem", fontSize: "0.825rem", color: "var(--md-text-primary)", lineHeight: 1.55 }}>
              {data.cozumIpuclari.map((ipucu, idx) => (
                <li key={idx} style={{ marginBottom: "0.25rem" }}>
                  {ipucu}
                </li>
              ))}
            </ul>
          </div>

          {/* MEB Örnek & Çıkmış Soru Analizi */}
          <div
            style={{
              padding: "0.6rem 0.85rem",
              borderRadius: "6px",
              background: "rgba(245, 158, 11, 0.08)",
              borderLeft: "3.5px solid #f59e0b",
              fontSize: "0.8rem",
              color: "#92400e",
              lineHeight: 1.45,
            }}
          >
            <strong>📊 MEB Sınav Analizi & Çeldirici Tuzağı:</strong> {data.ornekSoruAnalizi}
          </div>
        </div>
      )}
    </div>
  );
}
