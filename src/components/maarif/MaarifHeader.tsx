"use client";

import React, { useState } from "react";
import type { UserRole } from "@/types/maarif";
import ApkDownloadModal from "@/components/maarif/ApkDownloadModal";

interface MaarifHeaderProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  activeTab: "defter" | "kazanim" | "ogrenci" | "veli" | "yonetim" | "haftalik";
  onTabChange: (tab: "defter" | "kazanim" | "ogrenci" | "veli" | "yonetim" | "haftalik") => void;
}

export default function MaarifHeader({
  currentRole,
  onRoleChange,
  activeTab,
  onTabChange,
}: MaarifHeaderProps) {
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [showApkModal, setShowApkModal] = useState(false);

  const roleConfig: Record<
    UserRole,
    { title: string; badge: string; icon: string; access: string; defaultTab: "defter" | "kazanim" | "ogrenci" | "veli" | "yonetim" | "haftalik" }
  > = {
    misafir: {
      title: "Misafir Ziyaretçi",
      badge: "Kısıtlı Yetki",
      icon: "👤",
      access: "Sadece yıllık plan ve Maarif Modeli kazanımlarını inceleyebilir.",
      defaultTab: "kazanim",
    },
    ogrenci: {
      title: "Öğrenci (Ali Kerem Öztürk)",
      badge: "9-A • No: 101",
      icon: "🎓",
      access: "Kendi haftalık konularını ve öğretmen tavsiyelerini görür.",
      defaultTab: "ogrenci",
    },
    veli: {
      title: "Veli (Hakan Öztürk)",
      badge: "Ali Kerem'in Velisi",
      icon: "👨‍👩‍👧",
      access: "Çocuğunun hesabına entegre; ders defteri, yoklama ve öğretmen tavsiyelerini takip eder.",
      defaultTab: "veli",
    },
    ogretmen: {
      title: "Öğretmen (Ahmet Yılmaz)",
      badge: "Matematik • Tam Yetki",
      icon: "👨‍🏫",
      access: "Dijital Sınıf Defteri, yoklama, kazanım ve gelişmiş sınıf yönetim paneline tam erişir.",
      defaultTab: "defter",
    },
    yonetici: {
      title: "Okul İdaresi (Müdür Yrd.)",
      badge: "40 Sınıf Denetimi",
      icon: "🏛️",
      access: "Okul geneli 154 öğretmen, 40 sınıf ve 1.580 öğrenci denetim masası.",
      defaultTab: "yonetim",
    },
  };

  const handleSelectRole = (role: UserRole) => {
    onRoleChange(role);
    onTabChange(roleConfig[role].defaultTab);
    setShowRoleModal(false);
  };

  return (
    <>
      <header
        style={{
          background: "linear-gradient(180deg, #102444 0%, #0d1e38 100%)",
          color: "#ffffff",
          borderBottom: "3px solid var(--md-accent-gold)",
          boxShadow: "var(--md-elevation-3)",
        }}
      >
        {/* Top MEB Sub-bar */}
        <div
          style={{
            borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
            padding: "0.5rem 0",
            background: "rgba(0, 0, 0, 0.2)",
            fontSize: "0.8rem",
          }}
        >
          <div
            className="container"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "0.5rem",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <span
                style={{
                  background: "var(--md-accent-gold)",
                  color: "#0a1628",
                  padding: "0.15rem 0.5rem",
                  borderRadius: "4px",
                  fontWeight: 800,
                  fontSize: "0.75rem",
                }}
              >
                T.C. MEB
              </span>
              <span style={{ color: "#e3d9c6", fontWeight: 600 }}>
                CUMHURİYET ANADOLU LİSESİ • TÜRKİYE YÜZYILI MAARİF MODELİ
              </span>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "0.85rem", flexWrap: "wrap" }}>
              <span style={{ color: "#c6923b", fontSize: "0.8rem", fontWeight: 600 }}>
                🎨 Pastel Lacivert & Krem İskelet
              </span>
              <span
                style={{
                  background: "rgba(198, 146, 59, 0.2)",
                  border: "1px solid rgba(198, 146, 59, 0.4)",
                  padding: "0.15rem 0.5rem",
                  borderRadius: "6px",
                  fontSize: "0.725rem",
                  color: "var(--md-accent-gold-light)",
                  fontWeight: 700,
                }}
              >
                📦 JSON Mock Veri (DB Bağımsız)
              </span>
              <button
                onClick={() => setShowApkModal(true)}
                style={{
                  background: "linear-gradient(135deg, rgba(31, 122, 140, 0.4) 0%, rgba(198, 146, 59, 0.3) 100%)",
                  border: "1px solid var(--md-accent-gold)",
                  padding: "0.18rem 0.6rem",
                  borderRadius: "10px",
                  fontSize: "0.725rem",
                  color: "#ffffff",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.35rem",
                  fontWeight: 700,
                  transition: "transform 0.15s",
                }}
                title="Android APK & PWA Mobil Kurulum"
              >
                <span>📱</span>
                <span>Mobil APK & PWA İndir</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Nav Banner */}
        <div className="container" style={{ padding: "0.85rem 1.25rem" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "1rem",
            }}
          >
            {/* App Branding */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.85rem" }}>
              <div
                style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "12px",
                  background: "linear-gradient(135deg, #c6923b 0%, #e0b46c 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#122646",
                  boxShadow: "0 4px 12px rgba(198, 146, 59, 0.35)",
                }}
              >
                <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z" />
                </svg>
              </div>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <span style={{ fontSize: "1.35rem", fontWeight: 800, color: "#ffffff", letterSpacing: "-0.02em" }}>
                    Maarif <span style={{ color: "var(--md-accent-gold-light)" }}>LMS</span>
                  </span>
                  <span
                    style={{
                      background: "rgba(198, 146, 59, 0.2)",
                      color: "var(--md-accent-gold-light)",
                      border: "1px solid rgba(198, 146, 59, 0.4)",
                      padding: "0.1rem 0.4rem",
                      borderRadius: "4px",
                      fontSize: "0.7rem",
                      fontWeight: 700,
                    }}
                  >
                    e-Müfredat
                  </span>
                </div>
                <div style={{ fontSize: "0.8rem", color: "#a8c0de" }}>
                  Dijital Sınıf Defteri & Süreç Odaklı Maarif Takip Portalı
                </div>
              </div>
            </div>

            {/* Current Active Role Badge & Login / Switch Button */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <div
                style={{
                  background: "rgba(0, 0, 0, 0.35)",
                  border: "1px solid rgba(255, 255, 255, 0.15)",
                  padding: "0.35rem 0.75rem",
                  borderRadius: "8px",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.6rem",
                }}
              >
                <span style={{ fontSize: "1.2rem" }}>{roleConfig[currentRole].icon}</span>
                <div>
                  <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "#ffffff" }}>
                    {roleConfig[currentRole].title}
                  </div>
                  <div style={{ fontSize: "0.7rem", color: "var(--md-accent-gold-light)" }}>
                    {roleConfig[currentRole].badge}
                  </div>
                </div>
              </div>

              <button
                onClick={() => setShowApkModal(true)}
                style={{
                  background: "linear-gradient(135deg, #1f7a8c 0%, #155562 100%)",
                  color: "#ffffff",
                  border: "1px solid rgba(255, 255, 255, 0.25)",
                  padding: "0.5rem 0.9rem",
                  borderRadius: "8px",
                  fontSize: "0.825rem",
                  fontWeight: 700,
                  display: "flex",
                  alignItems: "center",
                  gap: "0.4rem",
                  cursor: "pointer",
                  boxShadow: "0 2px 8px rgba(31, 122, 140, 0.35)",
                }}
                title="Android APK İndir & Mobil Uygulama Kur"
              >
                <span>📱</span>
                <span>Mobil APK</span>
              </button>

              <button
                onClick={() => setShowRoleModal(true)}
                className="md-btn md-btn-gold"
                style={{ padding: "0.5rem 0.9rem", fontSize: "0.825rem" }}
              >
                🔑 Rol Değiştir / Giriş
              </button>
            </div>
          </div>

          {/* Role-Specific Navigation Tabs */}
          <div
            style={{
              display: "flex",
              gap: "0.4rem",
              marginTop: "1rem",
              overflowX: "auto",
              paddingBottom: "0.25rem",
            }}
          >
            {/* Misafir: Sadece Yıllık Plan ve Kazanımları inceleyebilir */}
            <button
              onClick={() => onTabChange("kazanim")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.45rem",
                padding: "0.55rem 1rem",
                borderRadius: "8px",
                fontSize: "0.85rem",
                fontWeight: activeTab === "kazanim" ? 700 : 600,
                background: activeTab === "kazanim" ? "rgba(255, 255, 255, 0.14)" : "rgba(255, 255, 255, 0.04)",
                color: activeTab === "kazanim" ? "#ffffff" : "#c2d6ed",
                border: activeTab === "kazanim" ? "1px solid rgba(198, 146, 59, 0.5)" : "1px solid transparent",
                borderBottom: activeTab === "kazanim" ? "3px solid var(--md-accent-gold)" : "3px solid transparent",
                cursor: "pointer",
                whiteSpace: "nowrap",
              }}
            >
              <span>🎯</span>
              <span>Yıllık Plan & Maarif Kazanımları</span>
            </button>

            {/* Öğretmen: Dijital Sınıf Defteri ve Gelişmiş Sınıf Yönetimi */}
            <button
              onClick={() => onTabChange("defter")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.45rem",
                padding: "0.55rem 1rem",
                borderRadius: "8px",
                fontSize: "0.85rem",
                fontWeight: activeTab === "defter" ? 700 : 600,
                background: activeTab === "defter" ? "rgba(255, 255, 255, 0.14)" : "rgba(255, 255, 255, 0.04)",
                color: activeTab === "defter" ? "#ffffff" : "#c2d6ed",
                border: activeTab === "defter" ? "1px solid rgba(198, 146, 59, 0.5)" : "1px solid transparent",
                borderBottom: activeTab === "defter" ? "3px solid var(--md-accent-gold)" : "3px solid transparent",
                cursor: "pointer",
                whiteSpace: "nowrap",
                opacity: currentRole === "misafir" || currentRole === "ogrenci" || currentRole === "veli" ? 0.6 : 1,
              }}
            >
              <span>📖</span>
              <span>Dijital Sınıf Defteri & Yönetim {currentRole === "ogretmen" && "★"}</span>
            </button>

            {/* Öğrenci: Kendi haftalık konularını ve tavsiyelerini görür */}
            <button
              onClick={() => onTabChange("ogrenci")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.45rem",
                padding: "0.55rem 1rem",
                borderRadius: "8px",
                fontSize: "0.85rem",
                fontWeight: activeTab === "ogrenci" ? 700 : 600,
                background: activeTab === "ogrenci" ? "rgba(255, 255, 255, 0.14)" : "rgba(255, 255, 255, 0.04)",
                color: activeTab === "ogrenci" ? "#ffffff" : "#c2d6ed",
                border: activeTab === "ogrenci" ? "1px solid rgba(198, 146, 59, 0.5)" : "1px solid transparent",
                borderBottom: activeTab === "ogrenci" ? "3px solid var(--md-accent-gold)" : "3px solid transparent",
                cursor: "pointer",
                whiteSpace: "nowrap",
                opacity: currentRole === "misafir" ? 0.6 : 1,
              }}
            >
              <span>🎓</span>
              <span>Haftalık Konularım & Tavsiyeler {currentRole === "ogrenci" && "★"}</span>
            </button>

            {/* Veli: Çocuğunun hesabına entegre; durumunu ve tavsiyeleri takip eder */}
            <button
              onClick={() => onTabChange("veli")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.45rem",
                padding: "0.55rem 1rem",
                borderRadius: "8px",
                fontSize: "0.85rem",
                fontWeight: activeTab === "veli" ? 700 : 600,
                background: activeTab === "veli" ? "rgba(255, 255, 255, 0.14)" : "rgba(255, 255, 255, 0.04)",
                color: activeTab === "veli" ? "#ffffff" : "#c2d6ed",
                border: activeTab === "veli" ? "1px solid rgba(198, 146, 59, 0.5)" : "1px solid transparent",
                borderBottom: activeTab === "veli" ? "3px solid var(--md-accent-gold)" : "3px solid transparent",
                cursor: "pointer",
                whiteSpace: "nowrap",
                opacity: currentRole === "misafir" ? 0.6 : 1,
              }}
            >
              <span>👨‍👩‍👧</span>
              <span>Çocuğumun Durumu & Veli Takip {currentRole === "veli" && "★"}</span>
            </button>

            {/* 4. Veli ve Öğrenci Haftalık Takip Ekranı (5-8. Sınıflar, MEB Planı, Maarif Çıktısı, Görev/Test) */}
            <button
              onClick={() => onTabChange("haftalik")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.45rem",
                padding: "0.55rem 1rem",
                borderRadius: "8px",
                fontSize: "0.85rem",
                fontWeight: activeTab === "haftalik" ? 700 : 600,
                background: activeTab === "haftalik" ? "rgba(198, 146, 59, 0.25)" : "rgba(255, 255, 255, 0.04)",
                color: activeTab === "haftalik" ? "var(--md-accent-gold-light)" : "#c2d6ed",
                border: activeTab === "haftalik" ? "1px solid var(--md-accent-gold)" : "1px solid transparent",
                borderBottom: activeTab === "haftalik" ? "3px solid var(--md-accent-gold)" : "3px solid transparent",
                cursor: "pointer",
                whiteSpace: "nowrap",
              }}
            >
              <span>📅</span>
              <span>5-8. Sınıf Haftalık Takip (Veli/Öğrenci)</span>
            </button>

            {/* İdare */}
            <button
              onClick={() => onTabChange("yonetim")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.45rem",
                padding: "0.55rem 1rem",
                borderRadius: "8px",
                fontSize: "0.85rem",
                fontWeight: activeTab === "yonetim" ? 700 : 600,
                background: activeTab === "yonetim" ? "rgba(255, 255, 255, 0.14)" : "rgba(255, 255, 255, 0.04)",
                color: activeTab === "yonetim" ? "#ffffff" : "#c2d6ed",
                border: activeTab === "yonetim" ? "1px solid rgba(198, 146, 59, 0.5)" : "1px solid transparent",
                borderBottom: activeTab === "yonetim" ? "3px solid var(--md-accent-gold)" : "3px solid transparent",
                cursor: "pointer",
                whiteSpace: "nowrap",
                opacity: currentRole === "misafir" || currentRole === "ogrenci" || currentRole === "veli" ? 0.6 : 1,
              }}
            >
              <span>🏛️</span>
              <span>Okul İdaresi (40 Sınıf)</span>
            </button>
          </div>
        </div>
      </header>

      {/* Role Selection & Login Modal */}
      {showRoleModal && (
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
          onClick={() => setShowRoleModal(false)}
        >
          <div
            className="md-card"
            style={{
              width: "100%",
              maxWidth: "600px",
              padding: "2rem",
              background: "#ffffff",
              border: "2px solid var(--md-accent-gold)",
              boxShadow: "var(--md-elevation-4)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
              <div>
                <h3 style={{ fontSize: "1.25rem", color: "var(--md-navy-primary)", fontWeight: 800 }}>
                  🔑 Kullanıcı Rolü & Giriş Seçimi
                </h3>
                <p style={{ color: "var(--md-text-secondary)", fontSize: "0.85rem" }}>
                  Deneyimlemek istediğiniz kullanıcı profilini seçin:
                </p>
              </div>
              <button
                onClick={() => setShowRoleModal(false)}
                style={{ background: "transparent", border: "none", fontSize: "1.25rem", cursor: "pointer", color: "var(--md-text-muted)" }}
              >
                ✕
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
              {/* Misafir */}
              <div
                onClick={() => handleSelectRole("misafir")}
                style={{
                  padding: "1rem",
                  borderRadius: "var(--radius-sm)",
                  border: currentRole === "misafir" ? "2px solid var(--md-navy-primary)" : "1px solid var(--md-cream-border)",
                  background: currentRole === "misafir" ? "var(--md-cream-surface)" : "#ffffff",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  transition: "all 0.15s",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.85rem" }}>
                  <span style={{ fontSize: "1.8rem" }}>👤</span>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: "0.95rem", color: "var(--md-navy-primary)" }}>
                      1. Misafir Ziyaretçi
                    </div>
                    <div style={{ fontSize: "0.8rem", color: "var(--md-text-secondary)" }}>
                      Sadece yıllık plan ve Maarif Modeli kazanımlarını inceleyebilir.
                    </div>
                  </div>
                </div>
                <span className="md-chip md-chip-navy">Seç →</span>
              </div>

              {/* Öğrenci */}
              <div
                onClick={() => handleSelectRole("ogrenci")}
                style={{
                  padding: "1rem",
                  borderRadius: "var(--radius-sm)",
                  border: currentRole === "ogrenci" ? "2px solid var(--md-navy-primary)" : "1px solid var(--md-cream-border)",
                  background: currentRole === "ogrenci" ? "var(--md-cream-surface)" : "#ffffff",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  transition: "all 0.15s",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.85rem" }}>
                  <span style={{ fontSize: "1.8rem" }}>🎓</span>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: "0.95rem", color: "var(--md-navy-primary)" }}>
                      2. Öğrenci (Ali Kerem Öztürk - 9-A)
                    </div>
                    <div style={{ fontSize: "0.8rem", color: "var(--md-text-secondary)" }}>
                      Kendi haftalık ders konularını ve öğretmen tavsiyelerini görür.
                    </div>
                  </div>
                </div>
                <span className="md-chip md-chip-gold">Seç →</span>
              </div>

              {/* Veli */}
              <div
                onClick={() => handleSelectRole("veli")}
                style={{
                  padding: "1rem",
                  borderRadius: "var(--radius-sm)",
                  border: currentRole === "veli" ? "2px solid var(--md-navy-primary)" : "1px solid var(--md-cream-border)",
                  background: currentRole === "veli" ? "var(--md-cream-surface)" : "#ffffff",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  transition: "all 0.15s",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.85rem" }}>
                  <span style={{ fontSize: "1.8rem" }}>👨‍👩‍👧</span>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: "0.95rem", color: "var(--md-navy-primary)" }}>
                      3. Veli (Hakan Öztürk - Çocuğuna Entegre)
                    </div>
                    <div style={{ fontSize: "0.8rem", color: "var(--md-text-secondary)" }}>
                      Çocuğunun hesabına entegre; günlük ders akışı, yoklama ve öğretmen tavsiyelerini takip eder.
                    </div>
                  </div>
                </div>
                <span className="md-chip md-chip-gold">Seç →</span>
              </div>

              {/* Öğretmen */}
              <div
                onClick={() => handleSelectRole("ogretmen")}
                style={{
                  padding: "1rem",
                  borderRadius: "var(--radius-sm)",
                  border: currentRole === "ogretmen" ? "2px solid var(--md-navy-primary)" : "1px solid var(--md-cream-border)",
                  background: currentRole === "ogretmen" ? "var(--md-cream-surface)" : "#ffffff",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  transition: "all 0.15s",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.85rem" }}>
                  <span style={{ fontSize: "1.8rem" }}>👨‍🏫</span>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: "0.95rem", color: "var(--md-navy-primary)" }}>
                      4. Öğretmen (Ahmet Yılmaz - Matematik)
                    </div>
                    <div style={{ fontSize: "0.8rem", color: "var(--md-text-secondary)" }}>
                      "Dijital Sınıf Defteri" ve gelişmiş sınıf yönetim paneline tam erişir.
                    </div>
                  </div>
                </div>
                <span className="md-chip md-chip-present">Seç →</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Android APK & PWA Mobil İndirme Modalı */}
      <ApkDownloadModal
        isOpen={showApkModal}
        onClose={() => setShowApkModal(false)}
      />
    </>
  );
}
