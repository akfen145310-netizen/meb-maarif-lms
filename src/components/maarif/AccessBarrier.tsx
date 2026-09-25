"use client";

import React from "react";
import type { UserRole } from "@/types/maarif";

interface AccessBarrierProps {
  requiredRole: "ogretmen" | "ogrenci" | "veli";
  currentRole: UserRole;
  onSwitchRole: (role: UserRole) => void;
}

export default function AccessBarrier({
  requiredRole,
  currentRole,
  onSwitchRole,
}: AccessBarrierProps) {
  const roleNames: Record<string, string> = {
    ogretmen: "Öğretmen",
    ogrenci: "Öğrenci",
    veli: "Veli",
  };

  const roleDescriptions: Record<string, string> = {
    ogretmen: "Dijital Sınıf Defteri ve gelişmiş sınıf yönetim paneline sadece dersi veren öğretmenler erişebilir.",
    ogrenci: "Haftalık ders konuları ve öğretmen tavsiyelerine erişmek için öğrenci girişi yapılması gerekmektedir.",
    veli: "Çocuğunun ders defterini, yoklamasını ve öğretmen tavsiyelerini takip etmek için veli hesabına entegre olunmalıdır.",
  };

  return (
    <div
      className="md-card"
      style={{
        padding: "3rem 2rem",
        textAlign: "center",
        maxWidth: "680px",
        margin: "2rem auto",
        background: "#ffffff",
        border: "2px solid var(--md-cream-border)",
        boxShadow: "var(--md-elevation-3)",
      }}
    >
      <div
        style={{
          width: "72px",
          height: "72px",
          borderRadius: "50%",
          background: "rgba(18, 38, 70, 0.08)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "2rem",
          margin: "0 auto 1.25rem auto",
        }}
      >
        🔒
      </div>

      <div className="md-chip md-chip-gold" style={{ marginBottom: "0.75rem" }}>
        MEB Güvenlik & Yetki Kuralı
      </div>

      <h2 style={{ fontSize: "1.4rem", color: "var(--md-navy-primary)", marginBottom: "0.5rem" }}>
        {roleNames[requiredRole]} Girişi Gereklidir
      </h2>

      <p style={{ color: "var(--md-text-secondary)", fontSize: "0.95rem", lineHeight: 1.6, marginBottom: "1.5rem" }}>
        Şu anda <strong>{currentRole === "misafir" ? "Misafir" : currentRole}</strong> rolündesiniz. {roleDescriptions[requiredRole]}
      </p>

      <div
        style={{
          background: "var(--md-cream-surface)",
          padding: "1rem",
          borderRadius: "var(--radius-sm)",
          border: "1px solid var(--md-cream-border)",
          fontSize: "0.85rem",
          color: "var(--md-text-primary)",
          marginBottom: "1.75rem",
          textAlign: "left",
        }}
      >
        <strong>Kullanıcı Rolleri Yetki Matrisi:</strong>
        <ul style={{ paddingLeft: "1.25rem", marginTop: "0.4rem", lineHeight: 1.5, color: "var(--md-text-secondary)" }}>
          <li><strong>Misafir:</strong> Sadece yıllık plan ve kazanımları inceleyebilir.</li>
          <li><strong>Öğrenci:</strong> Kendi haftalık konularını ve öğretmen tavsiyelerini görür.</li>
          <li><strong>Veli:</strong> Çocuğunun hesabına entegre olur; durumunu ve tavsiyeleri takip eder.</li>
          <li><strong>Öğretmen:</strong> "Dijital Sınıf Defteri" ve gelişmiş sınıf yönetim paneline erişir.</li>
        </ul>
      </div>

      <div style={{ display: "flex", justifyContent: "center", gap: "1rem", flexWrap: "wrap" }}>
        <button
          onClick={() => onSwitchRole(requiredRole)}
          className="md-btn md-btn-primary"
          style={{ padding: "0.75rem 1.5rem", fontSize: "0.95rem" }}
        >
          🔑 {roleNames[requiredRole]} Olarak Giriş Yap / Test Et
        </button>
        <button
          onClick={() => onSwitchRole("misafir")}
          className="md-btn md-btn-secondary"
          style={{ padding: "0.75rem 1.25rem" }}
        >
          Yıllık Plana Geri Dön
        </button>
      </div>
    </div>
  );
}
