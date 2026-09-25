"use client";

import React, { useState } from "react";

export default function SetupGuide() {
  const [copied, setCopied] = useState(false);

  const envTemplate = `NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=projeniz.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=projeniz
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=projeniz.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=1234567890
NEXT_PUBLIC_FIREBASE_APP_ID=1:1234567890:web:abcdef
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX`;

  const handleCopy = () => {
    navigator.clipboard.writeText(envTemplate);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const steps = [
    {
      num: "01",
      title: "Firebase Console'da Proje Oluşturun",
      desc: "console.firebase.google.com adresine gidin, yeni bir proje ekleyin (Google Analytics tercihe bağlıdır).",
    },
    {
      num: "02",
      title: "Authentication'ı Etkinleştirin",
      desc: "Sol menüden Build > Authentication bölümüne gidin. 'Get Started' butonuna tıklayarak 'Google' ve 'Email/Password' sağlayıcılarını açın.",
    },
    {
      num: "03",
      title: "Cloud Firestore'u Başlatın",
      desc: "Build > Firestore Database bölümüne gidin. 'Create Database' diyerek başlangıç için 'Test Mode' veya kuralları belirleyerek açın.",
    },
    {
      num: "04",
      title: "Web Uygulaması Ekleyin ve .env.local'e Yazın",
      desc: "Proje Genel Bakış > Web (</>) simgesine tıklayın, uygulamanızı kaydedin ve verilen Firebase Config nesnesini .env.local dosyanıza aktarın.",
    },
  ];

  return (
    <div className="glass-card" style={{ padding: "1.75rem" }}>
      <div style={{ marginBottom: "1.25rem" }}>
        <h2 style={{ fontSize: "1.25rem", marginBottom: "0.25rem" }}>Firebase Hızlı Kurulum Rehberi</h2>
        <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem" }}>
          Gerçek Firebase projenizi bu uygulamaya bağlamak için aşağıdaki 4 basit adımı izleyin.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1rem", marginBottom: "1.5rem" }}>
        {steps.map((s) => (
          <div
            key={s.num}
            style={{
              padding: "1rem",
              background: "rgba(255,255,255,0.02)",
              borderRadius: "0.75rem",
              border: "1px solid var(--border-subtle)",
            }}
          >
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "1.1rem",
                fontWeight: 700,
                color: "var(--accent-firebase)",
                marginBottom: "0.4rem",
              }}
            >
              {s.num}
            </div>
            <div style={{ fontWeight: 600, fontSize: "0.95rem", marginBottom: "0.25rem" }}>{s.title}</div>
            <div style={{ fontSize: "0.825rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>{s.desc}</div>
          </div>
        ))}
      </div>

      <div style={{ position: "relative" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "0.5rem",
          }}
        >
          <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-secondary)" }}>
            Örnek <code className="code-inline">.env.local</code> Şablonu:
          </span>
          <button
            onClick={handleCopy}
            className="btn btn-secondary"
            style={{ padding: "0.35rem 0.75rem", fontSize: "0.8rem" }}
          >
            {copied ? "✓ Kopyalandı" : "Şablonu Kopyala"}
          </button>
        </div>
        <pre className="code-block">
          <code>{envTemplate}</code>
        </pre>
      </div>
    </div>
  );
}
