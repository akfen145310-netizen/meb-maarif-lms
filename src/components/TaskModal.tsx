"use client";

import React, { useState } from "react";
import type { TaskPriority, TaskStatus, Project } from "@/types";

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (task: {
    title: string;
    description: string;
    priority: TaskPriority;
    status: TaskStatus;
    dueDate?: string;
    projectId?: string;
  }) => Promise<void>;
  projects?: Project[];
}

export default function TaskModal({
  isOpen,
  onClose,
  onSubmit,
  projects = [],
}: TaskModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<TaskPriority>("medium");
  const [status, setStatus] = useState<TaskStatus>("todo");
  const [dueDate, setDueDate] = useState("");
  const [projectId, setProjectId] = useState("");
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
        priority,
        status,
        dueDate: dueDate || undefined,
        projectId: projectId || undefined,
      });
      setTitle("");
      setDescription("");
      setPriority("medium");
      setStatus("todo");
      setDueDate("");
      setProjectId("");
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
          maxWidth: "520px",
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
          <h3 style={{ fontSize: "1.2rem", fontWeight: 700 }}>+ Yeni Görev Oluştur</h3>
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
            <label className="input-label">Görev Başlığı *</label>
            <input
              type="text"
              required
              className="input-field"
              placeholder="Örn: Landing page tasarımını güncelle"
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
              placeholder="Görev hakkında detaylar, isterler veya bağlantılar..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{ resize: "vertical" }}
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
            <div>
              <label className="input-label" style={{ display: "block", marginBottom: "0.4rem" }}>
                Öncelik
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as TaskPriority)}
                className="input-field"
                style={{ cursor: "pointer" }}
              >
                <option value="low">🟢 Düşük Öncelik</option>
                <option value="medium">🟡 Orta Öncelik</option>
                <option value="high">🔴 Yüksek Öncelik</option>
              </select>
            </div>

            <div>
              <label className="input-label" style={{ display: "block", marginBottom: "0.4rem" }}>
                Başlangıç Durumu
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as TaskStatus)}
                className="input-field"
                style={{ cursor: "pointer" }}
              >
                <option value="todo">📌 Yapılacak</option>
                <option value="in_progress">⏳ Devam Ediyor</option>
                <option value="done">✅ Tamamlandı</option>
              </select>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.5rem" }}>
            <div>
              <label className="input-label" style={{ display: "block", marginBottom: "0.4rem" }}>
                Bitiş Tarihi
              </label>
              <input
                type="date"
                className="input-field"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>

            {projects.length > 0 && (
              <div>
                <label className="input-label" style={{ display: "block", marginBottom: "0.4rem" }}>
                  Proje
                </label>
                <select
                  value={projectId}
                  onChange={(e) => setProjectId(e.target.value)}
                  className="input-field"
                  style={{ cursor: "pointer" }}
                >
                  <option value="">Genel / Projesiz</option>
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.title}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem" }}>
            <button type="button" onClick={onClose} className="btn btn-secondary">
              İptal
            </button>
            <button type="submit" disabled={loading} className="btn btn-primary">
              {loading ? "Oluşturuluyor..." : "Görevi Kaydet"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
