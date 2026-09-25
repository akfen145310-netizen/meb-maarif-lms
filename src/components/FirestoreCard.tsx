"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  addDocument,
  deleteDocument,
  subscribeToCollection,
} from "@/lib/firebase/firestore";

interface TodoItem {
  id: string;
  title: string;
  category: string;
  createdAt?: { seconds: number } | string | Date;
}

const MOCK_ITEMS: TodoItem[] = [
  { id: "mock-1", title: "Firebase Projesini Konsoldan Oluştur", category: "Altyapı" },
  { id: "mock-2", title: ".env.local dosyasına API anahtarlarını yapıştır", category: "Yapılandırma" },
  { id: "mock-3", title: "Authentication ve Firestore kurallarını ayarla", category: "Güvenlik" },
];

export default function FirestoreCard() {
  const { isConfigured, user } = useAuth();
  const [items, setItems] = useState<TodoItem[]>([]);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Genel");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!isConfigured) {
      setItems(MOCK_ITEMS);
      return;
    }

    const unsubscribe = subscribeToCollection(
      "tasks",
      (docs) => {
        const mapped = docs.map((doc) => ({
          id: doc.id,
          title: (doc.title as string) || "Başlıksız",
          category: (doc.category as string) || "Genel",
          createdAt: doc.createdAt as TodoItem["createdAt"],
        }));
        setItems(mapped);
      },
      (err) => {
        console.warn("Firestore subscription error:", err);
        setErrorMsg("Firestore koleksiyonuna erişilemedi: " + err.message);
      }
    );

    return () => unsubscribe();
  }, [isConfigured]);

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    setErrorMsg(null);

    if (!isConfigured) {
      // Local preview mode
      const newItem: TodoItem = {
        id: `mock-${Date.now()}`,
        title: title.trim(),
        category,
      };
      setItems([newItem, ...items]);
      setTitle("");
      return;
    }

    setLoading(true);
    try {
      await addDocument("tasks", {
        title: title.trim(),
        category,
        userId: user ? user.uid : "anonymous",
      });
      setTitle("");
    } catch (err: unknown) {
      const error = err as Error;
      console.error("Add item error:", error);
      setErrorMsg("Kayıt eklenirken hata: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteItem = async (id: string) => {
    if (!isConfigured) {
      setItems(items.filter((item) => item.id !== id));
      return;
    }

    try {
      await deleteDocument("tasks", id);
    } catch (err: unknown) {
      const error = err as Error;
      console.error("Delete item error:", error);
      setErrorMsg("Kayıt silinirken hata: " + error.message);
    }
  };

  return (
    <div className="glass-card" style={{ padding: "1.75rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
        <div>
          <h2 style={{ fontSize: "1.25rem", marginBottom: "0.25rem" }}>Cloud Firestore (Veritabanı)</h2>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem" }}>
            Gerçek zamanlı belge ekleme & listeleme
          </p>
        </div>
        <span className="badge badge-firebase">
          {isConfigured ? "⚡ Canlı Firestore" : "🧪 Önizleme Modu"}
        </span>
      </div>

      {errorMsg && (
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
          {errorMsg}
        </div>
      )}

      {/* Add Document Form */}
      <form onSubmit={handleAddItem} style={{ marginBottom: "1.5rem" }}>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <input
            type="text"
            className="input-field"
            placeholder="Yeni bir not / görev ekleyin..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{ flex: 1 }}
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="input-field"
            style={{ width: "130px", cursor: "pointer" }}
          >
            <option value="Genel">Genel</option>
            <option value="Önemli">Önemli</option>
            <option value="Firebase">Firebase</option>
            <option value="Tasarım">Tasarım</option>
          </select>
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{ whiteSpace: "nowrap" }}
          >
            {loading ? "..." : "+ Ekle"}
          </button>
        </div>
      </form>

      {/* Document List */}
      <div>
        <div
          style={{
            fontSize: "0.8rem",
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            color: "var(--text-muted)",
            marginBottom: "0.75rem",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <span>Koleksiyon: <code className="code-inline">tasks</code></span>
          <span>{items.length} Öğe</span>
        </div>

        {items.length === 0 ? (
          <div
            style={{
              padding: "2rem",
              textAlign: "center",
              background: "rgba(255,255,255,0.02)",
              borderRadius: "0.6rem",
              border: "1px dashed var(--border-subtle)",
              color: "var(--text-muted)",
              fontSize: "0.9rem",
            }}
          >
            Henüz eklenmiş bir belge yok. Yukarıdaki formdan yeni bir veri ekleyebilirsiniz.
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", maxHeight: "280px", overflowY: "auto" }}>
            {items.map((item) => (
              <div
                key={item.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "0.75rem 1rem",
                  background: "rgba(255,255,255,0.03)",
                  borderRadius: "0.6rem",
                  border: "1px solid var(--border-subtle)",
                  transition: "background 0.2s",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <span
                    style={{
                      fontSize: "0.75rem",
                      padding: "0.2rem 0.5rem",
                      borderRadius: "0.3rem",
                      background: "rgba(255, 145, 0, 0.15)",
                      color: "#ff9100",
                      fontWeight: 600,
                    }}
                  >
                    {item.category}
                  </span>
                  <span style={{ fontSize: "0.9rem", color: "var(--text-primary)" }}>{item.title}</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleDeleteItem(item.id)}
                  style={{
                    background: "transparent",
                    border: "none",
                    color: "var(--text-muted)",
                    cursor: "pointer",
                    padding: "0.25rem",
                    borderRadius: "0.3rem",
                    display: "flex",
                    alignItems: "center",
                  }}
                  title="Sil"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
