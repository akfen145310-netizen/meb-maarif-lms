"use client";

import React, { useState } from "react";
import { MOCK_ANNOUNCEMENTS, MOCK_STUDENTS_9A } from "@/lib/maarif/seedData";
import type { Announcement } from "@/types/maarif";

export default function IletisimHubView() {
  const [announcements, setAnnouncements] = useState<Announcement[]>(MOCK_ANNOUNCEMENTS);
  const [targetFilter, setTargetFilter] = useState<string>("tumu");

  // Quick message composer state
  const [selectedStudentId, setSelectedStudentId] = useState<string>(MOCK_STUDENTS_9A[0].id);
  const [messageSubject, setMessageSubject] = useState<string>("Maarif Modeli Gelişim ve Tavsiye Bilgilendirmesi");
  const [messageBody, setMessageBody] = useState<string>(
    "Sayın Velimiz; Ali Kerem'in Matematik dersi 1. ünite kavramsal beceri performansı çok iyi düzeydedir. Verilen çalışma kitabındaki alıştırmaları hafta sonuna kadar tamamlamasını rica ederiz."
  );
  const [sentSuccess, setSentSuccess] = useState<boolean>(false);

  // New announcement modal / form
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newTarget, setNewTarget] = useState<Announcement["target"]>("veliler");
  const [newPriority, setNewPriority] = useState<Announcement["priority"]>("normal");
  const [showAnnForm, setShowAnnForm] = useState(false);

  const selectedStudent = MOCK_STUDENTS_9A.find((s) => s.id === selectedStudentId) || MOCK_STUDENTS_9A[0];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    setSentSuccess(true);
    setTimeout(() => setSentSuccess(false), 3500);
  };

  const handleAddAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newAnn: Announcement = {
      id: `ann-${Date.now()}`,
      title: newTitle.trim(),
      content: newContent.trim(),
      target: newTarget,
      author: "Ahmet Yılmaz (Öğretmen)",
      date: "2026-09-25",
      priority: newPriority,
    };

    setAnnouncements([newAnn, ...announcements]);
    setNewTitle("");
    setNewContent("");
    setShowAnnForm(false);
  };

  const filteredAnnouncements = announcements.filter((a) => {
    if (targetFilter === "tumu") return true;
    return a.target === targetFilter;
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.75rem" }}>
      {/* Banner */}
      <div
        className="md-card"
        style={{
          padding: "1.5rem",
          background: "linear-gradient(135deg, #1f7a8c 0%, #122646 100%)",
          color: "#ffffff",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "1rem",
        }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
            <span style={{ fontSize: "1.6rem" }}>💬</span>
            <h2 style={{ fontSize: "1.35rem", fontWeight: 800, color: "#ffffff" }}>
              Öğretmen - Veli - Öğrenci İletişim & Duyuru Portalı
            </h2>
          </div>
          <p style={{ color: "#d8f3dc", fontSize: "0.875rem", marginTop: "0.3rem" }}>
            Anlık devamsızlık bildirimleri, ders notları, veli mesajlaşması ve okul geneli duyurular.
          </p>
        </div>

        <button
          onClick={() => setShowAnnForm(!showAnnForm)}
          className="md-btn md-btn-gold"
          style={{ padding: "0.6rem 1.25rem" }}
        >
          {showAnnForm ? "✕ Formu Kapat" : "+ Yeni Duyuru Yayınla"}
        </button>
      </div>

      {sentSuccess && (
        <div
          style={{
            padding: "1rem 1.5rem",
            background: "#d8f3dc",
            border: "1.5px solid #2d6a4f",
            borderRadius: "var(--radius-sm)",
            color: "#1b4332",
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            boxShadow: "var(--md-elevation-2)",
          }}
        >
          <span style={{ fontSize: "1.3rem" }}>📲</span>
          <div>
            <strong>Veliye Doğrudan Bildirim İletildi!</strong>
            <div style={{ fontSize: "0.85rem", fontWeight: 400 }}>
              {selectedStudent.parentName} ({selectedStudent.parentPhone}) adına SMS ve mobil PWA bildirimi gönderildi.
            </div>
          </div>
        </div>
      )}

      {/* New Announcement Form Modal */}
      {showAnnForm && (
        <div className="md-card" style={{ padding: "1.5rem", border: "2px solid var(--md-accent-gold)" }}>
          <h3 style={{ fontSize: "1.1rem", marginBottom: "1rem", color: "var(--md-navy-primary)" }}>
            📢 Yeni Duyuru / Bildiri Oluştur
          </h3>
          <form onSubmit={handleAddAnnouncement}>
            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
              <div className="md-form-group">
                <label className="md-label">Duyuru Başlığı *</label>
                <input
                  type="text"
                  required
                  className="md-input"
                  placeholder="Örn: 9-A Veli Toplantısı ve Maarif Modeli Bilgilendirmesi"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                />
              </div>

              <div className="md-form-group">
                <label className="md-label">Hedef Kitle</label>
                <select
                  value={newTarget}
                  onChange={(e) => setNewTarget(e.target.value as Announcement["target"])}
                  className="md-select"
                >
                  <option value="veliler">Veliler</option>
                  <option value="ogrenciler">Öğrenciler</option>
                  <option value="ogretmenler">Öğretmenler</option>
                  <option value="sinif">Sınıf (9-A)</option>
                  <option value="tumu">Tüm Okul</option>
                </select>
              </div>

              <div className="md-form-group">
                <label className="md-label">Öncelik Derecesi</label>
                <select
                  value={newPriority}
                  onChange={(e) => setNewPriority(e.target.value as Announcement["priority"])}
                  className="md-select"
                >
                  <option value="normal">Normal</option>
                  <option value="onemli">Önemli</option>
                  <option value="acil">Acil Bildirim</option>
                </select>
              </div>
            </div>

            <div className="md-form-group">
              <label className="md-label">Duyuru İçeriği</label>
              <textarea
                required
                className="md-textarea"
                rows={3}
                placeholder="Duyuru metnini detaylıca yazınız..."
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
              />
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem" }}>
              <button type="button" onClick={() => setShowAnnForm(false)} className="md-btn md-btn-secondary">
                İptal
              </button>
              <button type="submit" className="md-btn md-btn-primary">
                Duyuruyu Yayınla
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Two Column Layout: Parent Direct Messaging & School Announcements */}
      <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1.3fr", gap: "1.75rem", alignItems: "start" }}>
        {/* Left Column: Direct Parent Communication */}
        <div className="md-card" style={{ padding: "1.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
            <span style={{ fontSize: "1.3rem" }}>✉️</span>
            <div>
              <h3 style={{ fontSize: "1.1rem", color: "var(--md-navy-primary)" }}>
                Veliye Özel Bildirim & Mesaj Gönder
              </h3>
              <p style={{ color: "var(--md-text-muted)", fontSize: "0.8rem" }}>
                Öğrenci bazında gelişim, tavsiye ve devamsızlık notu iletme
              </p>
            </div>
          </div>

          <form onSubmit={handleSendMessage}>
            <div className="md-form-group">
              <label className="md-label">Öğrenci & Veli Seçimi</label>
              <select
                value={selectedStudentId}
                onChange={(e) => setSelectedStudentId(e.target.value)}
                className="md-select"
              >
                {MOCK_STUDENTS_9A.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.studentNo} - {s.name} (Veli: {s.parentName} • {s.parentPhone})
                  </option>
                ))}
              </select>
            </div>

            {/* Quick Templates */}
            <div style={{ marginBottom: "1rem" }}>
              <label className="md-label" style={{ display: "block", marginBottom: "0.4rem" }}>
                Hızlı Şablonlar:
              </label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
                <button
                  type="button"
                  onClick={() =>
                    setMessageBody(
                      `Sayın ${selectedStudent.parentName}; ${selectedStudent.name} bugün ders içi tartışmalarda üstün bir sorumluluk ve kavrayış sergilemiştir. Tebrik ederiz.`
                    )
                  }
                  className="md-btn md-btn-secondary"
                  style={{ fontSize: "0.75rem", padding: "0.3rem 0.6rem" }}
                >
                  ⭐ Başarı & Tebrik
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setMessageBody(
                      `Sayın ${selectedStudent.parentName}; ${selectedStudent.name} 25 Eylül tarihli Matematik dersi yoklamasında sınıfta bulunmamıştır. Bilginize sunarız.`
                    )
                  }
                  className="md-btn md-btn-secondary"
                  style={{ fontSize: "0.75rem", padding: "0.3rem 0.6rem" }}
                >
                  ⚠️ Devamsızlık Uyarısı
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setMessageBody(
                      `Sayın ${selectedStudent.parentName}; Maarif Modeli Matematik 9 Çalışma Kitabı Sayfa 30-33 arasındaki haftalık tavsiyenin kontrolü yarın yapılacaktır.`
                    )
                  }
                  className="md-btn md-btn-secondary"
                  style={{ fontSize: "0.75rem", padding: "0.3rem 0.6rem" }}
                >
                  💡 Tavsiye Hatırlatması
                </button>
              </div>
            </div>

            <div className="md-form-group">
              <label className="md-label">Konu</label>
              <input
                type="text"
                className="md-input"
                value={messageSubject}
                onChange={(e) => setMessageSubject(e.target.value)}
              />
            </div>

            <div className="md-form-group">
              <label className="md-label">Mesaj İçeriği</label>
              <textarea
                className="md-textarea"
                rows={4}
                value={messageBody}
                onChange={(e) => setMessageBody(e.target.value)}
              />
            </div>

            <button type="submit" className="md-btn md-btn-primary" style={{ width: "100%", padding: "0.75rem" }}>
              📩 Veliye SMS ve Portaldan Bildirim İlet
            </button>
          </form>
        </div>

        {/* Right Column: Announcements Board */}
        <div className="md-card" style={{ padding: "1.5rem" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "1rem",
              flexWrap: "wrap",
              gap: "0.5rem",
            }}
          >
            <div>
              <h3 style={{ fontSize: "1.1rem", color: "var(--md-navy-primary)" }}>
                📢 Okul ve Sınıf Duyuru Panosu
              </h3>
              <p style={{ color: "var(--md-text-muted)", fontSize: "0.8rem" }}>
                Resmi MEB duyuruları ve sınıf bilgilendirmeleri
              </p>
            </div>

            <div className="md-tabs" style={{ padding: "0.2rem" }}>
              <button
                onClick={() => setTargetFilter("tumu")}
                className={`md-tab-item ${targetFilter === "tumu" ? "active" : ""}`}
                style={{ fontSize: "0.75rem", padding: "0.3rem 0.6rem" }}
              >
                Tümü
              </button>
              <button
                onClick={() => setTargetFilter("veliler")}
                className={`md-tab-item ${targetFilter === "veliler" ? "active" : ""}`}
                style={{ fontSize: "0.75rem", padding: "0.3rem 0.6rem" }}
              >
                Veliler
              </button>
              <button
                onClick={() => setTargetFilter("ogrenciler")}
                className={`md-tab-item ${targetFilter === "ogrenciler" ? "active" : ""}`}
                style={{ fontSize: "0.75rem", padding: "0.3rem 0.6rem" }}
              >
                Öğrenciler
              </button>
              <button
                onClick={() => setTargetFilter("ogretmenler")}
                className={`md-tab-item ${targetFilter === "ogretmenler" ? "active" : ""}`}
                style={{ fontSize: "0.75rem", padding: "0.3rem 0.6rem" }}
              >
                Öğretmenler
              </button>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
            {filteredAnnouncements.map((ann) => (
              <div
                key={ann.id}
                style={{
                  padding: "1rem 1.25rem",
                  borderRadius: "var(--radius-sm)",
                  background: "var(--md-cream-surface)",
                  border:
                    ann.priority === "acil"
                      ? "1.5px solid var(--md-accent-coral)"
                      : ann.priority === "onemli"
                      ? "1.5px solid var(--md-accent-gold)"
                      : "1px solid var(--md-cream-border)",
                  position: "relative",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.4rem" }}>
                  <div style={{ fontWeight: 700, fontSize: "0.95rem", color: "var(--md-navy-primary)", paddingRight: "1rem" }}>
                    {ann.title}
                  </div>
                  <span
                    style={{
                      fontSize: "0.7rem",
                      fontWeight: 700,
                      padding: "0.15rem 0.5rem",
                      borderRadius: "4px",
                      background:
                        ann.priority === "acil"
                          ? "#f8d7da"
                          : ann.priority === "onemli"
                          ? "#fff3cd"
                          : "rgba(18, 38, 70, 0.08)",
                      color:
                        ann.priority === "acil"
                          ? "#842029"
                          : ann.priority === "onemli"
                          ? "#664d03"
                          : "var(--md-navy-primary)",
                    }}
                  >
                    {ann.priority === "acil" ? "🚨 Acil" : ann.priority === "onemli" ? "⭐ Önemli" : "Genel"}
                  </span>
                </div>

                <p style={{ fontSize: "0.85rem", color: "var(--md-text-secondary)", lineHeight: 1.5, marginBottom: "0.6rem" }}>
                  {ann.content}
                </p>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: "0.75rem",
                    color: "var(--md-text-muted)",
                    borderTop: "1px solid var(--md-cream-border)",
                    paddingTop: "0.5rem",
                  }}
                >
                  <span>Yayınlayan: <strong>{ann.author}</strong></span>
                  <span>Tarih: {ann.date} • Kitle: {ann.target}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
