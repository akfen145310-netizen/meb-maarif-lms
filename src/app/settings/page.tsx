"use client";

import React from "react";
import Navigation from "@/components/Navigation";
import { useAuth } from "@/context/AuthContext";
import { firebaseConfig } from "@/lib/firebase/config";

export default function SettingsPage() {
  const { user, userProfile, isConfigured, logout } = useAuth();

  const configItems = [
    { key: "API Key", value: firebaseConfig.apiKey ? "••••••••" + firebaseConfig.apiKey.slice(-6) : "Tanımlanmadı", ok: Boolean(firebaseConfig.apiKey) },
    { key: "Auth Domain", value: firebaseConfig.authDomain || "Tanımlanmadı", ok: Boolean(firebaseConfig.authDomain) },
    { key: "Project ID", value: firebaseConfig.projectId || "Tanımlanmadı", ok: Boolean(firebaseConfig.projectId) },
    { key: "Storage Bucket", value: firebaseConfig.storageBucket || "Tanımlanmadı", ok: Boolean(firebaseConfig.storageBucket) },
    { key: "App ID", value: firebaseConfig.appId ? "••••••••" + firebaseConfig.appId.slice(-6) : "Tanımlanmadı", ok: Boolean(firebaseConfig.appId) },
  ];

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Navigation />

      <main className="container" style={{ flex: 1, padding: "2rem 1.5rem", maxWidth: "900px" }}>
        <div style={{ marginBottom: "2rem" }}>
          <h1 style={{ fontSize: "1.75rem", marginBottom: "0.25rem" }}>Uygulama & Hesap Ayarları</h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>
            Profil bilgileri, Firebase bağlantı durumu ve sistem yapılandırması.
          </p>
        </div>

        {/* Profile Card */}
        <div className="glass-card" style={{ padding: "1.75rem", marginBottom: "1.75rem" }}>
          <h2 style={{ fontSize: "1.15rem", marginBottom: "1rem" }}>👤 Kullanıcı Profili</h2>

          {user ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
                <div
                  style={{
                    width: "56px",
                    height: "56px",
                    borderRadius: "50%",
                    background: "var(--grad-firebase)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "1.5rem",
                    fontWeight: 700,
                    color: "#fff",
                  }}
                >
                  {user.displayName ? user.displayName.charAt(0).toUpperCase() : user.email?.charAt(0).toUpperCase() || "U"}
                </div>
                <div>
                  <div style={{ fontSize: "1.1rem", fontWeight: 700 }}>
                    {userProfile?.displayName || user.displayName || "İsimsiz Kullanıcı"}
                  </div>
                  <div style={{ color: "var(--text-secondary)", fontSize: "0.875rem" }}>
                    {user.email}
                  </div>
                  <div style={{ display: "inline-flex", gap: "0.5rem", marginTop: "0.4rem" }}>
                    <span className="badge badge-firebase">Rol: {userProfile?.role || "member"}</span>
                    <span className="badge badge-next">E-posta Onaylı: {user.emailVerified ? "Evet" : "Hayır"}</span>
                  </div>
                </div>
              </div>

              <div
                style={{
                  padding: "0.75rem 1rem",
                  background: "rgba(255,255,255,0.02)",
                  borderRadius: "0.5rem",
                  border: "1px solid var(--border-subtle)",
                  fontSize: "0.85rem",
                }}
              >
                <span style={{ color: "var(--text-muted)" }}>Firebase UID: </span>
                <code className="code-inline">{user.uid}</code>
              </div>

              <div>
                <button onClick={logout} className="btn btn-danger" style={{ padding: "0.5rem 1rem", fontSize: "0.85rem" }}>
                  Oturumu Kapat
                </button>
              </div>
            </div>
          ) : (
            <div style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>
              Henüz oturum açılmadı. Ana sayfadaki Firebase Auth panelinden Google veya E-posta ile giriş yapabilirsiniz.
            </div>
          )}
        </div>

        {/* Firebase Config Status Card */}
        <div className="glass-card" style={{ padding: "1.75rem", marginBottom: "1.75rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
            <h2 style={{ fontSize: "1.15rem" }}>🔥 Firebase Bağlantı Tanıları</h2>
            <span className={`badge ${isConfigured ? "badge-status-online" : "badge-status-waiting"}`}>
              {isConfigured ? "🟢 Bağlantı Aktif" : "🟡 .env.local Bekleniyor"}
            </span>
          </div>

          <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", marginBottom: "1.25rem" }}>
            Ortam değişkenlerinizin doğru yüklendiğini buradan teyit edebilirsiniz:
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
            {configItems.map((item) => (
              <div
                key={item.key}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "0.75rem 1rem",
                  background: "rgba(255,255,255,0.02)",
                  borderRadius: "0.5rem",
                  border: "1px solid var(--border-subtle)",
                  fontSize: "0.85rem",
                }}
              >
                <span style={{ fontWeight: 600, color: "var(--text-primary)" }}>{item.key}</span>
                <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                  <code className="code-inline">{item.value}</code>
                  <span>{item.ok ? "✅" : "⚠️"}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Security Rules Reference Card */}
        <div className="glass-card" style={{ padding: "1.75rem" }}>
          <h2 style={{ fontSize: "1.15rem", marginBottom: "0.5rem" }}>🛡️ Önerilen Firestore Güvenlik Kuralları</h2>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", marginBottom: "1rem" }}>
            Canlıya geçmeden önce Firebase Console &gt; Firestore Database &gt; Rules sekmesine eklemeniz önerilen kural şablonu:
          </p>

          <pre className="code-block">
            <code>{`rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Kullanıcı profili sadece ilgili kullanıcı tarafından okunup yazılabilir
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Görevler sadece oturum açmış kullanıcıların kendi görevleri için geçerlidir
    match /tasks/{taskId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
    }

    // Projeler
    match /projects/{projectId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.ownerId;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.ownerId;
    }
  }
}`}</code>
          </pre>
        </div>
      </main>
    </div>
  );
}
