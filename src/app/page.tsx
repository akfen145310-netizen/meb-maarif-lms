"use client";

import React, { useState } from "react";
import MaarifHeader from "@/components/maarif/MaarifHeader";
import DigitalDefterView from "@/components/maarif/DigitalDefterView";
import KazanimTakipView from "@/components/maarif/KazanimTakipView";
import OgrenciView from "@/components/maarif/OgrenciView";
import VeliView from "@/components/maarif/VeliView";
import YonetimStatsView from "@/components/maarif/YonetimStatsView";
import HaftalikTakipEkrani from "@/components/maarif/HaftalikTakipEkrani";
import AccessBarrier from "@/components/maarif/AccessBarrier";
import NetworkStatusBanner from "@/components/maarif/NetworkStatusBanner";
import ApkDownloadModal from "@/components/maarif/ApkDownloadModal";
import type { UserRole } from "@/types/maarif";

export default function MaarifLmsPage() {
  const [currentRole, setCurrentRole] = useState<UserRole>("ogretmen");
  const [activeTab, setActiveTab] = useState<"defter" | "kazanim" | "ogrenci" | "veli" | "yonetim" | "haftalik">("defter");
  const [showApkModal, setShowApkModal] = useState(false);

  const handleRoleChange = (newRole: UserRole) => {
    setCurrentRole(newRole);
    if (newRole === "misafir") {
      setActiveTab("kazanim");
    } else if (newRole === "ogrenci") {
      setActiveTab("ogrenci");
    } else if (newRole === "veli") {
      setActiveTab("veli");
    } else if (newRole === "ogretmen") {
      setActiveTab("defter");
    } else if (newRole === "yonetici") {
      setActiveTab("yonetim");
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "var(--md-cream-bg)" }}>
      {/* MEB Maarif Header with Role Switcher */}
      <MaarifHeader
        currentRole={currentRole}
        onRoleChange={handleRoleChange}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* Main App Content with Role Access Boundaries */}
      <main className="container" style={{ flex: 1, padding: "2rem 1.25rem", width: "100%", display: "flex", flexDirection: "column", gap: "1.25rem" }}>
        {/* PWA Çevrimdışı / Çevrimiçi Durum Göstergesi & Test Paneli */}
        <NetworkStatusBanner />

        {/* Mobil Uygulama & APK İndirme Banner Kartı */}
        <div
          style={{
            background: "linear-gradient(135deg, #102444 0%, #1a3359 100%)",
            color: "#ffffff",
            borderRadius: "14px",
            padding: "0.85rem 1.25rem",
            border: "1.5px solid var(--md-accent-gold)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "0.85rem",
            boxShadow: "var(--md-elevation-2)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.85rem" }}>
            <div
              style={{
                width: "42px",
                height: "42px",
                borderRadius: "10px",
                background: "linear-gradient(135deg, #c6923b 0%, #e0b46c 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.4rem",
                color: "#102444",
                flexShrink: 0,
              }}
            >
              📱
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
                <strong style={{ fontSize: "0.95rem", color: "#ffffff" }}>
                  MEB Maarif LMS Mobil APK & PWA Yayında!
                </strong>
                <span
                  style={{
                    background: "rgba(45, 106, 79, 0.4)",
                    color: "#6ee7b7",
                    border: "1px solid rgba(45, 106, 79, 0.6)",
                    fontSize: "0.7rem",
                    fontWeight: 700,
                    padding: "0.1rem 0.4rem",
                    borderRadius: "4px",
                  }}
                >
                  Android & iOS Tam Uyumlu
                </span>
              </div>
              <p style={{ margin: "0.2rem 0 0 0", fontSize: "0.8rem", color: "#b0c4de" }}>
                Akıllı telefonunuzdan internetiniz yokken bile MEB yıllık planlarını, haftalık ders konularını ve yoklama defterini takip edin.
              </p>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", flexWrap: "wrap" }}>
            <a
              href="/downloads/maarif-lms-v2026.apk"
              download="maarif-lms-v2026.apk"
              style={{
                background: "var(--md-accent-gold)",
                color: "#0a1628",
                padding: "0.5rem 1rem",
                borderRadius: "8px",
                fontSize: "0.825rem",
                fontWeight: 800,
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.4rem",
                boxShadow: "0 2px 8px rgba(198, 146, 59, 0.4)",
              }}
            >
              <span>⬇️</span>
              <span>Hızlı APK İndir (14 MB)</span>
            </a>

            <button
              onClick={() => setShowApkModal(true)}
              style={{
                background: "rgba(255, 255, 255, 0.12)",
                border: "1px solid rgba(255, 255, 255, 0.25)",
                color: "#ffffff",
                padding: "0.5rem 0.85rem",
                borderRadius: "8px",
                fontSize: "0.825rem",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Kurulum Rehberi & QR ↗
            </button>
          </div>
        </div>

        {/* 1. Yıllık Plan & Maarif Kazanımları (Herkese Açık - Misafir dahil) */}
        {activeTab === "kazanim" && <KazanimTakipView />}

        {/* 2. Dijital Sınıf Defteri (Sadece Öğretmen ve Yönetici yetkili) */}
        {activeTab === "defter" &&
          (currentRole === "ogretmen" || currentRole === "yonetici" ? (
            <DigitalDefterView />
          ) : (
            <AccessBarrier
              requiredRole="ogretmen"
              currentRole={currentRole}
              onSwitchRole={handleRoleChange}
            />
          ))}

        {/* 3. Öğrenci: Kendi haftalık konuları ve tavsiyeleri */}
        {activeTab === "ogrenci" &&
          (currentRole === "ogrenci" || currentRole === "ogretmen" || currentRole === "yonetici" ? (
            <OgrenciView />
          ) : (
            <AccessBarrier
              requiredRole="ogrenci"
              currentRole={currentRole}
              onSwitchRole={handleRoleChange}
            />
          ))}

        {/* 4. Veli: Çocuğunun hesabına entegre; durum ve tavsiye takibi */}
        {activeTab === "veli" &&
          (currentRole === "veli" || currentRole === "ogretmen" || currentRole === "yonetici" ? (
            <VeliView />
          ) : (
            <AccessBarrier
              requiredRole="veli"
              currentRole={currentRole}
              onSwitchRole={handleRoleChange}
            />
          ))}

        {/* 5. Veli ve Öğrenci Haftalık Takip Ekranı (5-8. Sınıf Seçimi, Konu, Maarif Çıktısı, Öğretmen Tavsiyeleri) */}
        {activeTab === "haftalik" && (
          <HaftalikTakipEkrani
            initialGrade={8}
            userType={currentRole === "veli" ? "veli" : "ogrenci"}
          />
        )}

        {/* 6. Okul Yönetimi (150+ Öğretmen, 40 Sınıf Denetimi) */}
        {activeTab === "yonetim" &&
          (currentRole === "yonetici" || currentRole === "ogretmen" ? (
            <YonetimStatsView />
          ) : (
            <AccessBarrier
              requiredRole="ogretmen"
              currentRole={currentRole}
              onSwitchRole={handleRoleChange}
            />
          ))}
      </main>

      {/* Mobile PWA Bottom Floating Bar */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
          position: "sticky",
          bottom: 0,
          background: "#102444",
          borderTop: "2px solid var(--md-accent-gold)",
          padding: "0.5rem 0.25rem",
          zIndex: 90,
          boxShadow: "0 -4px 15px rgba(0,0,0,0.15)",
        }}
      >
        <button
          onClick={() => setActiveTab("kazanim")}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            background: "transparent",
            border: "none",
            color: activeTab === "kazanim" ? "var(--md-accent-gold-light)" : "#a3b8cc",
            fontSize: "0.75rem",
            fontWeight: 600,
            cursor: "pointer",
            gap: "0.2rem",
          }}
        >
          <span style={{ fontSize: "1.1rem" }}>🎯</span>
          <span>Yıllık Plan</span>
        </button>

        <button
          onClick={() => setActiveTab("defter")}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            background: "transparent",
            border: "none",
            color: activeTab === "defter" ? "var(--md-accent-gold-light)" : "#a3b8cc",
            fontSize: "0.75rem",
            fontWeight: 600,
            cursor: "pointer",
            gap: "0.2rem",
          }}
        >
          <span style={{ fontSize: "1.1rem" }}>📖</span>
          <span>Sınıf Defteri</span>
        </button>

        <button
          onClick={() => setActiveTab("ogrenci")}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            background: "transparent",
            border: "none",
            color: activeTab === "ogrenci" ? "var(--md-accent-gold-light)" : "#a3b8cc",
            fontSize: "0.75rem",
            fontWeight: 600,
            cursor: "pointer",
            gap: "0.2rem",
          }}
        >
          <span style={{ fontSize: "1.1rem" }}>🎓</span>
          <span>Haftalık Konularım</span>
        </button>

        <button
          onClick={() => setActiveTab("veli")}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            background: "transparent",
            border: "none",
            color: activeTab === "veli" ? "var(--md-accent-gold-light)" : "#a3b8cc",
            fontSize: "0.75rem",
            fontWeight: 600,
            cursor: "pointer",
            gap: "0.2rem",
          }}
        >
          <span style={{ fontSize: "1.1rem" }}>👨‍👩‍👧</span>
          <span>Veli Portalı</span>
        </button>

        <button
          onClick={() => setActiveTab("haftalik")}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            background: "transparent",
            border: "none",
            color: activeTab === "haftalik" ? "var(--md-accent-gold-light)" : "#a3b8cc",
            fontSize: "0.75rem",
            fontWeight: 600,
            cursor: "pointer",
            gap: "0.2rem",
          }}
        >
          <span style={{ fontSize: "1.1rem" }}>📅</span>
          <span>Haftalık Takip</span>
        </button>

        <button
          onClick={() => setActiveTab("yonetim")}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            background: "transparent",
            border: "none",
            color: activeTab === "yonetim" ? "var(--md-accent-gold-light)" : "#a3b8cc",
            fontSize: "0.75rem",
            fontWeight: 600,
            cursor: "pointer",
            gap: "0.2rem",
          }}
        >
          <span style={{ fontSize: "1.1rem" }}>🏛️</span>
          <span>Yönetim</span>
        </button>

        <button
          onClick={() => setShowApkModal(true)}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            background: "transparent",
            border: "none",
            color: "var(--md-accent-gold-light)",
            fontSize: "0.75rem",
            fontWeight: 700,
            cursor: "pointer",
            gap: "0.2rem",
          }}
        >
          <span style={{ fontSize: "1.1rem" }}>📲</span>
          <span>Mobil APK</span>
        </button>
      </div>

      {/* Footer */}
      <footer
        style={{
          background: "#0a1628",
          color: "#a3b8cc",
          borderTop: "1px solid rgba(255,255,255,0.08)",
          padding: "1.5rem 0",
          fontSize: "0.825rem",
        }}
      >
        <div
          className="container"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "1rem",
          }}
        >
          <div>
            <strong>T.C. Millî Eğitim Bakanlığı</strong> • Türkiye Yüzyılı Maarif Modeli LMS Platformu
            <div style={{ color: "#627d98", fontSize: "0.75rem", marginTop: "0.2rem" }}>
              Aktif Rol: <strong style={{ color: "var(--md-accent-gold-light)" }}>{currentRole.toUpperCase()}</strong> • 154 Öğretmen • 40 Sınıf • 1.580 Öğrenci Kapasitesi
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <span style={{ color: "var(--md-accent-gold-light)" }}>● PWA & Çevrimdışı Senkronizasyon</span>
            <span>Versiyon: 2026.2 (Maarif Rol Matrisi)</span>
          </div>
        </div>
      </footer>

      {/* APK & PWA İndirme Modalı */}
      <ApkDownloadModal
        isOpen={showApkModal}
        onClose={() => setShowApkModal(false)}
      />
    </div>
  );
}
