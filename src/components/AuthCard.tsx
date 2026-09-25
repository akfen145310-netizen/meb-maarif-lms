"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";

export default function AuthCard() {
  const {
    user,
    loading,
    isConfigured,
    authError,
    signInWithGoogle,
    signInWithEmail,
    signUpWithEmail,
    logout,
    clearError,
  } = useAuth();

  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [localFeedback, setLocalFeedback] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setLocalFeedback(null);

    if (!email || !password) {
      setLocalFeedback("Lütfen e-posta ve şifre alanlarını doldurun.");
      return;
    }

    if (!isConfigured) {
      setLocalFeedback(
        "Firebase API anahtarları henüz .env.local içine girilmedi. Lütfen 'Kurulum Rehberi' sekmesini inceleyin."
      );
      return;
    }

    setActionLoading(true);
    try {
      if (mode === "signin") {
        await signInWithEmail(email, password);
      } else {
        await signUpWithEmail(email, password);
      }
      setEmail("");
      setPassword("");
    } catch {
      // Error handled by AuthContext
    } finally {
      setActionLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    clearError();
    setLocalFeedback(null);

    if (!isConfigured) {
      setLocalFeedback(
        "Google ile giriş için .env.local dosyasına Firebase yapılandırma bilgilerinizi eklemelisiniz."
      );
      return;
    }

    setActionLoading(true);
    try {
      await signInWithGoogle();
    } catch {
      // Error handled by AuthContext
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="glass-card" style={{ padding: "1.75rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
        <div>
          <h2 style={{ fontSize: "1.25rem", marginBottom: "0.25rem" }}>Kimlik Doğrulama (Auth)</h2>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem" }}>
            Firebase Authentication (Google & E-posta/Şifre)
          </p>
        </div>
        <span className={`badge ${isConfigured ? "badge-status-online" : "badge-status-waiting"}`}>
          {isConfigured ? "🟢 Firebase Bağlı" : "🟡 Beklemede (.env.local)"}
        </span>
      </div>

      {loading ? (
        <div style={{ padding: "2rem", textAlign: "center", color: "var(--text-secondary)" }}>
          Oturum durumu kontrol ediliyor...
        </div>
      ) : user ? (
        /* Signed In State */
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              background: "rgba(255,255,255,0.03)",
              padding: "1rem",
              borderRadius: "0.75rem",
              border: "1px solid var(--border-subtle)",
            }}
          >
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "50%",
                background: "var(--grad-firebase)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 700,
                fontSize: "1.2rem",
                color: "#fff",
              }}
            >
              {user.displayName ? user.displayName.charAt(0).toUpperCase() : user.email?.charAt(0).toUpperCase() || "U"}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 600, fontSize: "0.95rem" }}>
                {user.displayName || "İsimsiz Kullanıcı"}
              </div>
              <div style={{ color: "var(--text-secondary)", fontSize: "0.85rem", overflow: "hidden", textOverflow: "ellipsis" }}>
                {user.email}
              </div>
              <div style={{ color: "var(--text-muted)", fontSize: "0.75rem", marginTop: "0.2rem" }}>
                UID: <span className="code-inline">{user.uid}</span>
              </div>
            </div>
          </div>

          <button onClick={logout} className="btn btn-danger" style={{ width: "100%" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
            Güvenli Çıkış Yap
          </button>
        </div>
      ) : (
        /* Not Signed In Form */
        <div>
          {/* Mode Switcher */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              background: "rgba(0,0,0,0.25)",
              padding: "0.25rem",
              borderRadius: "0.6rem",
              marginBottom: "1.25rem",
              border: "1px solid var(--border-subtle)",
            }}
          >
            <button
              type="button"
              onClick={() => {
                setMode("signin");
                clearError();
                setLocalFeedback(null);
              }}
              style={{
                padding: "0.5rem",
                borderRadius: "0.45rem",
                background: mode === "signin" ? "rgba(255,255,255,0.1)" : "transparent",
                color: mode === "signin" ? "#fff" : "var(--text-muted)",
                border: "none",
                fontWeight: 600,
                fontSize: "0.85rem",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
            >
              Giriş Yap
            </button>
            <button
              type="button"
              onClick={() => {
                setMode("signup");
                clearError();
                setLocalFeedback(null);
              }}
              style={{
                padding: "0.5rem",
                borderRadius: "0.45rem",
                background: mode === "signup" ? "rgba(255,255,255,0.1)" : "transparent",
                color: mode === "signup" ? "#fff" : "var(--text-muted)",
                border: "none",
                fontWeight: 600,
                fontSize: "0.85rem",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
            >
              Kayıt Ol
            </button>
          </div>

          {(authError || localFeedback) && (
            <div
              style={{
                padding: "0.75rem 1rem",
                background: "rgba(244, 63, 94, 0.12)",
                border: "1px solid rgba(244, 63, 94, 0.3)",
                borderRadius: "0.6rem",
                color: "#fda4af",
                fontSize: "0.85rem",
                marginBottom: "1rem",
              }}
            >
              {authError || localFeedback}
            </div>
          )}

          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={actionLoading}
            className="btn btn-google"
            style={{ width: "100%", marginBottom: "1rem" }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.15z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.15C3.25 21.36 7.33 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.26C.46 8.16 0 9.98 0 12s.46 3.84 1.26 5.42l4.02-3.15z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.25 2.64 1.26 6.58l4.02 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
              />
            </svg>
            Google ile {mode === "signin" ? "Giriş Yap" : "Kayıt Ol"}
          </button>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              margin: "1rem 0",
              color: "var(--text-muted)",
              fontSize: "0.75rem",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            <div style={{ flex: 1, height: "1px", background: "var(--border-subtle)" }} />
            <span style={{ padding: "0 0.75rem" }}>veya e-posta ile</span>
            <div style={{ flex: 1, height: "1px", background: "var(--border-subtle)" }} />
          </div>

          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label className="input-label" htmlFor="auth-email">E-posta Adresi</label>
              <input
                id="auth-email"
                type="email"
                className="input-field"
                placeholder="adiniz@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
            </div>

            <div className="input-group">
              <label className="input-label" htmlFor="auth-password">Şifre</label>
              <input
                id="auth-password"
                type="password"
                className="input-field"
                placeholder="En az 6 karakter"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete={mode === "signin" ? "current-password" : "new-password"}
              />
            </div>

            <button
              type="submit"
              disabled={actionLoading}
              className="btn btn-primary"
              style={{ width: "100%", marginTop: "0.5rem" }}
            >
              {actionLoading ? "İşleniyor..." : mode === "signin" ? "Giriş Yap" : "Hesap Oluştur"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
