"use client";

import React, { useState } from "react";

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (project: {
    title: string;
    description: string;
    color: string;
  }) => Promise<void>;
}

const COLORS = [
  "#6366f1", // Indigo
  "#ff9100", // Flame / Orange
  "#06b6d4", // Cyan
  "#10b981", // Emerald
  "#ec4899", // Pink
  "#8b5cf6", // Purple
];

export default function ProjectModal({
  isOpen,
  onClose,
  onSubmit,
}: ProjectModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState(COLORS[0]);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setLoading(true);
    try {
      await onSubmit({
        title: title.trim(),
        description: description.trim(),
        color,
      });
      setTitle("");
      setDescription("");
      setColor(COLORS[0]);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0, 0, 0, 0.75)",
        backdropFilter: "blur(8px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 200,
        padding: "1rem",
      }}
      onClick={onClose}
    >
      <div
        className="glass-card"
        style={{
          width: "100%",
          maxWidth: "480px",
          padding: "1.75rem",
          background: "#0c101d",
          border: "1px solid rgba(255, 255, 255, 0.12)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "1.25rem",
          }}
        >
          <h3 style={{ fontSize: "1.2rem", fontWeight: 700 }}>+ Yeni Proje Oluştur</h3>
          <button
            onClick={onClose}
            style={{
              background: "transparent",
              border: "none",
              color: "var(--text-muted)",
              cursor: "pointer",
              fontSize: "1.2rem",
            }}
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label className="input-label">Proje Adı *</label>
            <input
              type="text"
              required
              className="input-field"
              placeholder="Örn: Mobil Uygulama Yenileme"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              autoFocus
            />
          </div>

          <div className="input-group">
            <label className="input-label">Açıklama</label>
            <textarea
              className="input-field"
              rows={3}
              placeholder="Projenin amacı, kapsamı ve hedefleri..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{ resize: "vertical" }}
            />
          </div>

          <div style={{ marginBottom: "1.5rem" }}>
            <label className="input-label" style={{ display: "block", marginBottom: "0.5rem" }}>
              Tema Rengi
            </label>
            <div style={{ display: "flex", gap: "0.75rem" }}>
              {COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "50%",
                    background: c,
                    border: color === c ? "3px solid #ffffff" : "2px solid transparent",
                    cursor: "pointer",
                    boxShadow: color === c ? `0 0 12px ${c}` : "none",
                    transition: "all 0.2s",
                  }}
                />
              ))}
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem" }}>
            <button type="button" onClick={onClose} className="btn btn-secondary">
              İptal
            </button>
            <button type="submit" disabled={loading} className="btn btn-primary">
              {loading ? "Oluşturuluyor..." : "Projeyi Başlat"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
