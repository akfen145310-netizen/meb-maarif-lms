"use client";

import React, { useState } from "react";

interface KavramYanilgisiCardProps {
  baslik?: string;
  aciklama: string;
  dogrusu: string;
  dersAdi?: string;
  kazanimKodu?: string;
  compact?: boolean;
}

export default function KavramYanilgisiCard({
  baslik = "Dikkat: Sık Yapılan Hata / Kavram Yanılgısı",
  aciklama,
  dogrusu,
  dersAdi,
  kazanimKodu,
  compact = false,
}: KavramYanilgisiCardProps) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div
      style={{
        borderRadius: "var(--radius-sm)",
        background: "linear-gradient(135deg, #fff9f0 0%, #fffbf5 100%)",
        border: "1.5px solid #f6ad55",
        padding: compact ? "0.75rem 1rem" : "1rem 1.25rem",
        boxShadow: "0 2px 6px rgba(221, 107, 32, 0.08)",
        transition: "all 0.2s ease",
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
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: "24px",
              height: "24px",
              borderRadius: "50%",
              background: "#dd6b20",
              color: "#ffffff",
              fontSize: "0.85rem",
              fontWeight: 800,
            }}
          >
            !
          </span>
          <strong style={{ fontSize: "0.875rem", color: "#9c4221", fontWeight: 800 }}>
            {baslik}
          </strong>
          {dersAdi && (
            <span
              style={{
                fontSize: "0.7rem",
                padding: "0.1rem 0.4rem",
                borderRadius: "4px",
                background: "rgba(221, 107, 32, 0.15)",
                color: "#9c4221",
                fontWeight: 700,
              }}
            >
              {dersAdi}
            </span>
          )}
        </div>

        <button
          type="button"
          style={{
            background: "none",
            border: "none",
            fontSize: "0.75rem",
            color: "#9c4221",
            fontWeight: 700,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "0.2rem",
          }}
        >
          <span>{isOpen ? "Gizle" : "İncele"}</span>
          <span style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}>
            ▼
          </span>
        </button>
      </div>

      {isOpen && (
        <div style={{ marginTop: "0.75rem", display: "flex", flexDirection: "column", gap: "0.6rem" }}>
          {/* Sık Düşülen Yanılgı */}
          <div
            style={{
              padding: "0.6rem 0.85rem",
              borderRadius: "6px",
              background: "rgba(239, 68, 68, 0.08)",
              borderLeft: "3.5px solid #ef4444",
              display: "flex",
              flexDirection: "column",
              gap: "0.2rem",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
              <span style={{ fontSize: "0.8rem", color: "#b91c1c", fontWeight: 800 }}>❌ Sık Yapılan Yanılgı:</span>
            </div>
            <p style={{ margin: 0, fontSize: "0.825rem", color: "#7f1d1d", lineHeight: 1.45 }}>
              {aciklama}
            </p>
          </div>

          {/* İşin Doğrusu ve Bilimsel Açıklama */}
          <div
            style={{
              padding: "0.6rem 0.85rem",
              borderRadius: "6px",
              background: "rgba(16, 185, 129, 0.08)",
              borderLeft: "3.5px solid #10b981",
              display: "flex",
              flexDirection: "column",
              gap: "0.2rem",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
              <span style={{ fontSize: "0.8rem", color: "#065f46", fontWeight: 800 }}>✅ İşin Doğrusu & Bilimsel Gerçek:</span>
            </div>
            <p style={{ margin: 0, fontSize: "0.825rem", color: "#064e3b", lineHeight: 1.45, fontWeight: 600 }}>
              {dogrusu}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
