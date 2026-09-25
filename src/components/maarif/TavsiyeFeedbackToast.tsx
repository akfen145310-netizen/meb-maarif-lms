"use client";

import React, { useState, useEffect } from "react";

interface FeedbackEventDetail {
  tavsiyeId: string;
  isCompleted: boolean;
  message?: string;
  badge?: string;
  completedBy?: string;
}

export default function TavsiyeFeedbackToast() {
  const [activeFeedback, setActiveFeedback] = useState<FeedbackEventDetail | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      const customEvent = e as CustomEvent<FeedbackEventDetail>;
      if (customEvent.detail && customEvent.detail.isCompleted) {
        setActiveFeedback(customEvent.detail);
        setVisible(true);

        // Otomatik 4.5 saniye sonra gizleme
        const timer = setTimeout(() => {
          setVisible(false);
        }, 4500);

        return () => clearTimeout(timer);
      }
    };

    window.addEventListener("tavsiye-status-updated", handler);
    return () => window.removeEventListener("tavsiye-status-updated", handler);
  }, []);

  if (!visible || !activeFeedback) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: "1.75rem",
        right: "1.75rem",
        zIndex: 9999,
        maxWidth: "460px",
        animation: "slideInUp 0.35s cubic-bezier(0.16, 1, 0.3, 1)",
      }}
    >
      <div
        className="md-card"
        style={{
          padding: "1.25rem 1.5rem",
          background: "linear-gradient(135deg, #122646 0%, #1f4277 100%)",
          color: "#ffffff",
          border: "2px solid var(--md-accent-gold)",
          borderRadius: "var(--radius-md)",
          boxShadow: "0 10px 30px rgba(18, 38, 70, 0.4), 0 0 20px rgba(198, 146, 59, 0.3)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Parıltı Efekti */}
        <div
          style={{
            position: "absolute",
            top: "-20px",
            right: "-20px",
            width: "90px",
            height: "90px",
            background: "radial-gradient(circle, rgba(198, 146, 59, 0.4) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "0.75rem" }}>
          <div style={{ display: "flex", gap: "0.85rem", alignItems: "flex-start" }}>
            <div
              style={{
                fontSize: "2rem",
                lineHeight: 1,
                padding: "0.3rem",
                borderRadius: "50%",
                background: "rgba(255, 255, 255, 0.12)",
                border: "1.5px solid var(--md-accent-gold)",
              }}
            >
              🎉
            </div>

            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.25rem" }}>
                <h4 style={{ fontSize: "1.1rem", fontWeight: 800, color: "#ffffff", margin: 0 }}>
                  Harika Gidiyorsun!
                </h4>
                {activeFeedback.badge && (
                  <span
                    style={{
                      background: "rgba(198, 146, 59, 0.25)",
                      color: "var(--md-accent-gold)",
                      border: "1px solid var(--md-accent-gold)",
                      fontSize: "0.72rem",
                      fontWeight: 700,
                      padding: "0.15rem 0.5rem",
                      borderRadius: "999px",
                    }}
                  >
                    {activeFeedback.badge}
                  </span>
                )}
              </div>

              <p style={{ fontSize: "0.875rem", color: "rgba(255, 255, 255, 0.95)", lineHeight: 1.45, margin: "0.25rem 0" }}>
                {activeFeedback.message || "Öğretmeninizin tavsiyesini başarıyla yerine getirdiniz!"}
              </p>

              <div
                style={{
                  fontSize: "0.75rem",
                  color: "#a8dadc",
                  marginTop: "0.4rem",
                  background: "rgba(255, 255, 255, 0.08)",
                  padding: "0.25rem 0.6rem",
                  borderRadius: "4px",
                  display: "inline-block",
                }}
              >
                ✓ Şeffaf Arşiv: Tavsiye silinmez, yeşil renkli olarak kayıtlı kalır.
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setVisible(false)}
            style={{
              background: "transparent",
              border: "none",
              color: "rgba(255, 255, 255, 0.7)",
              cursor: "pointer",
              fontSize: "1.2rem",
              lineHeight: 1,
              padding: "0.2rem",
            }}
            title="Kapat"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}
