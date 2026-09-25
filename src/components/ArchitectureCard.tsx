"use client";

import React from "react";

export default function ArchitectureCard() {
  const tree = [
    { name: "src/lib/firebase/config.ts", desc: "Firebase App, Auth, Firestore istemci başlatma ve yapılandırma kontrolü." },
    { name: "src/lib/firebase/firestore.ts", desc: "Firestore CRUD işlemleri (addDoc, getDocs, deleteDoc, subscribeToCollection)." },
    { name: "src/context/AuthContext.tsx", desc: "React Context ile oturum yönetimi (Google, E-posta, Çıkış, useAuth hook)." },
    { name: "src/components/", desc: "Modüler arayüz bileşenleri (AuthCard, FirestoreCard, SetupGuide vb.)." },
    { name: "src/app/layout.tsx", desc: "Kök şablon, Plus Jakarta Sans yazı tipi ve AuthProvider sarmalayıcısı." },
    { name: "src/app/page.tsx", desc: "Ana sayfa paneli ve etkileşimli test arayüzü." },
    { name: ".env.local.example", desc: "Firebase ortam değişkenleri için örnek ve açıklayıcı şablon." },
  ];

  return (
    <div className="glass-card" style={{ padding: "1.75rem" }}>
      <div style={{ marginBottom: "1.25rem" }}>
        <h2 style={{ fontSize: "1.25rem", marginBottom: "0.25rem" }}>Proje Mimarisi & Klasör Yapısı</h2>
        <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem" }}>
          Next.js App Router ve modüler Firebase mimarisinin organizasyonu
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        {tree.map((item) => (
          <div
            key={item.name}
            style={{
              padding: "0.75rem 1rem",
              background: "rgba(255,255,255,0.02)",
              borderRadius: "0.6rem",
              border: "1px solid var(--border-subtle)",
              display: "flex",
              flexDirection: "column",
              gap: "0.25rem",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <span style={{ color: "var(--accent-cyan)", fontSize: "0.9rem" }}>📁</span>
              <code className="code-inline" style={{ color: "var(--text-primary)", fontWeight: 600 }}>
                {item.name}
              </code>
            </div>
            <div style={{ color: "var(--text-secondary)", fontSize: "0.825rem", paddingLeft: "1.6rem" }}>
              {item.desc}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
