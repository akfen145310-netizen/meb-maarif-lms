"use client";

import React, { useState, useEffect } from "react";

interface ApkDownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ApkDownloadModal({ isOpen, onClose }: ApkDownloadModalProps) {
  const [activeTab, setActiveTab] = useState<"apk" | "pwa" | "qr">("apk");
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [downloadStarted, setDownloadStarted] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true);
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  if (!isOpen) return null;

  const handleInstallPwa = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === "accepted") {
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
    } else {
      alert("Cihazınızda doğrudan PWA kurulum desteği tarayıcı menüsünden sağlanmaktadır. Chrome veya Safari menüsünden 'Ana Ekrana Ekle' seçeneğini kullanabilirsiniz.");
    }
  };

  const handleDownloadApkClick = () => {
    setDownloadStarted(true);
    setTimeout(() => {
      setDownloadStarted(false);
    }, 4000);
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(10, 22, 40, 0.8)",
        backdropFilter: "blur(5px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        padding: "1rem",
      }}
      onClick={onClose}
    >
      <div
        className="md-card animate-fade-in"
        style={{
          width: "100%",
          maxWidth: "640px",
          maxHeight: "90vh",
          overflowY: "auto",
          background: "#ffffff",
          borderRadius: "20px",
          border: "2px solid var(--md-accent-gold)",
          boxShadow: "0 25px 50px -12px rgba(10, 22, 40, 0.45)",
          padding: "0",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div
          style={{
            background: "linear-gradient(135deg, #102444 0%, #1a3359 100%)",
            color: "#ffffff",
            padding: "1.25rem 1.5rem",
            borderTopLeftRadius: "18px",
            borderTopRightRadius: "18px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: "2px solid var(--md-accent-gold)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.85rem" }}>
            <div
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "12px",
                background: "linear-gradient(135deg, #c6923b 0%, #e0b46c 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.5rem",
                color: "#102444",
                boxShadow: "0 4px 10px rgba(198, 146, 59, 0.4)",
              }}
            >
              📱
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <h3 style={{ fontSize: "1.2rem", fontWeight: 800, color: "#ffffff", margin: 0 }}>
                  Maarif LMS Mobil
                </h3>
                <span
                  style={{
                    background: "rgba(198, 146, 59, 0.25)",
                    color: "var(--md-accent-gold-light)",
                    border: "1px solid rgba(198, 146, 59, 0.5)",
                    fontSize: "0.7rem",
                    fontWeight: 700,
                    padding: "0.15rem 0.45rem",
                    borderRadius: "6px",
                  }}
                >
                  APK & PWA v2026.2
                </span>
              </div>
              <p style={{ fontSize: "0.8rem", color: "#a3b8cc", margin: "0.2rem 0 0 0" }}>
                Android Telefon, Tablet ve iOS Uyumlu Mobil Kurulum
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: "rgba(255, 255, 255, 0.12)",
              border: "none",
              color: "#ffffff",
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              cursor: "pointer",
              fontSize: "1.1rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "background 0.2s",
            }}
            title="Kapat"
          >
            ✕
          </button>
        </div>

        {/* Tab Selection */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: "0.5rem",
            padding: "1rem 1.5rem 0.5rem 1.5rem",
            background: "var(--md-cream-surface)",
            borderBottom: "1px solid var(--md-cream-border)",
          }}
        >
          <button
            onClick={() => setActiveTab("apk")}
            style={{
              padding: "0.6rem 0.5rem",
              borderRadius: "10px",
              border: "1.5px solid",
              borderColor: activeTab === "apk" ? "var(--md-navy-primary)" : "var(--md-cream-border)",
              background: activeTab === "apk" ? "var(--md-navy-primary)" : "#ffffff",
              color: activeTab === "apk" ? "#ffffff" : "var(--md-navy-primary)",
              fontWeight: 700,
              fontSize: "0.825rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.4rem",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            <span>🤖</span>
            <span>Android APK</span>
          </button>

          <button
            onClick={() => setActiveTab("pwa")}
            style={{
              padding: "0.6rem 0.5rem",
              borderRadius: "10px",
              border: "1.5px solid",
              borderColor: activeTab === "pwa" ? "var(--md-navy-primary)" : "var(--md-cream-border)",
              background: activeTab === "pwa" ? "var(--md-navy-primary)" : "#ffffff",
              color: activeTab === "pwa" ? "#ffffff" : "var(--md-navy-primary)",
              fontWeight: 700,
              fontSize: "0.825rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.4rem",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            <span>⚡</span>
            <span>PWA & iOS</span>
          </button>

          <button
            onClick={() => setActiveTab("qr")}
            style={{
              padding: "0.6rem 0.5rem",
              borderRadius: "10px",
              border: "1.5px solid",
              borderColor: activeTab === "qr" ? "var(--md-navy-primary)" : "var(--md-cream-border)",
              background: activeTab === "qr" ? "var(--md-navy-primary)" : "#ffffff",
              color: activeTab === "qr" ? "#ffffff" : "var(--md-navy-primary)",
              fontWeight: 700,
              fontSize: "0.825rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.4rem",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            <span>📱</span>
            <span>QR ile Tara</span>
          </button>
        </div>

        {/* Tab Content */}
        <div style={{ padding: "1.5rem" }}>
          {/* TAB 1: Android APK */}
          {activeTab === "apk" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              {/* APK Card */}
              <div
                style={{
                  background: "linear-gradient(135deg, rgba(18, 38, 70, 0.04) 0%, rgba(198, 146, 59, 0.08) 100%)",
                  border: "1.5px solid var(--md-cream-border)",
                  borderRadius: "14px",
                  padding: "1.25rem",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.85rem",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "0.5rem" }}>
                  <div>
                    <h4 style={{ color: "var(--md-navy-primary)", fontSize: "1.1rem", fontWeight: 700, margin: 0 }}>
                      MEB Maarif LMS Android APK Paketi
                    </h4>
                    <p style={{ fontSize: "0.8rem", color: "var(--md-text-secondary)", marginTop: "0.2rem" }}>
                      Doğrudan Android telefonunuza yükleyebileceğiniz resmi dağıtım paketi.
                    </p>
                  </div>
                  <span
                    style={{
                      background: "rgba(45, 106, 79, 0.15)",
                      color: "var(--status-present)",
                      border: "1px solid rgba(45, 106, 79, 0.3)",
                      padding: "0.25rem 0.6rem",
                      borderRadius: "20px",
                      fontSize: "0.75rem",
                      fontWeight: 700,
                    }}
                  >
                    ● İmzalı & Güvenli
                  </span>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
                    gap: "0.6rem",
                    fontSize: "0.8rem",
                    color: "var(--md-navy-primary)",
                  }}
                >
                  <div style={{ background: "#ffffff", padding: "0.5rem 0.75rem", borderRadius: "8px", border: "1px solid var(--md-cream-border)" }}>
                    <div style={{ color: "var(--md-text-muted)", fontSize: "0.7rem" }}>Boyut</div>
                    <strong>14.2 MB</strong>
                  </div>
                  <div style={{ background: "#ffffff", padding: "0.5rem 0.75rem", borderRadius: "8px", border: "1px solid var(--md-cream-border)" }}>
                    <div style={{ color: "var(--md-text-muted)", fontSize: "0.7rem" }}>Gereksinim</div>
                    <strong>Android 8.0+</strong>
                  </div>
                  <div style={{ background: "#ffffff", padding: "0.5rem 0.75rem", borderRadius: "8px", border: "1px solid var(--md-cream-border)" }}>
                    <div style={{ color: "var(--md-text-muted)", fontSize: "0.7rem" }}>Sürüm</div>
                    <strong>v2026.2 Maarif</strong>
                  </div>
                </div>

                {/* Direct Download Action Button */}
                <a
                  href="/downloads/maarif-lms-v2026.apk"
                  download="maarif-lms-v2026.apk"
                  onClick={handleDownloadApkClick}
                  className="md-btn md-btn-gold"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.75rem",
                    padding: "0.9rem 1.5rem",
                    borderRadius: "12px",
                    fontSize: "1rem",
                    fontWeight: 800,
                    textDecoration: "none",
                    boxShadow: "0 6px 16px rgba(198, 146, 59, 0.35)",
                    transition: "all 0.2s",
                  }}
                >
                  <span style={{ fontSize: "1.3rem" }}>⬇️</span>
                  <span>Android APK İndir (v2026.2)</span>
                </a>

                {downloadStarted && (
                  <div
                    style={{
                      background: "rgba(45, 106, 79, 0.12)",
                      border: "1px solid rgba(45, 106, 79, 0.3)",
                      color: "var(--status-present)",
                      padding: "0.6rem 0.9rem",
                      borderRadius: "8px",
                      fontSize: "0.825rem",
                      fontWeight: 600,
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                    }}
                  >
                    <span>✅</span>
                    <span>İndirme başlatıldı! Bildirim çubuğundan dosyanızı kontrol edebilirsiniz.</span>
                  </div>
                )}
              </div>

              {/* Kurulum Talimatları */}
              <div>
                <h5 style={{ fontSize: "0.9rem", fontWeight: 700, color: "var(--md-navy-primary)", marginBottom: "0.6rem" }}>
                  📋 Android Telefona Nasıl Kurulur?
                </h5>
                <ol
                  style={{
                    paddingLeft: "1.25rem",
                    fontSize: "0.825rem",
                    color: "var(--md-text-secondary)",
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.4rem",
                    lineHeight: 1.5,
                  }}
                >
                  <li>
                    Yukarıdaki <strong>"Android APK İndir"</strong> butonuna basarak dosyayı telefonunuza kaydedin.
                  </li>
                  <li>
                    Dosya inince bildirim çubuğundan veya <em>Dosyalarım &gt; İndirilenler</em> klasöründen <code>maarif-lms-v2026.apk</code> dosyasına dokunun.
                  </li>
                  <li>
                    Telefonunuz <em>"Bilinmeyen kaynaklardan uygulama yükle"</em> uyarısı verirse <strong>"Ayarlar &gt; Bu Kaynaktan İzin Ver"</strong> seçeneğini açın.
                  </li>
                  <li>
                    <strong>"Yükle"</strong> butonuna dokunun. Kurulum bittiğinde uygulama simgesi ana ekranınıza yerleşecektir.
                  </li>
                </ol>
              </div>
            </div>
          )}

          {/* TAB 2: PWA & iOS */}
          {activeTab === "pwa" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              <div
                style={{
                  background: "var(--md-cream-surface)",
                  border: "1px solid var(--md-cream-border)",
                  borderRadius: "14px",
                  padding: "1.25rem",
                  display: "flex",
                  flexDirection: "column",
                  gap: "1rem",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <span style={{ fontSize: "2rem" }}>⚡</span>
                  <div>
                    <h4 style={{ color: "var(--md-navy-primary)", fontSize: "1.05rem", fontWeight: 700, margin: 0 }}>
                      Anında Kurulum (PWA Web Uygulaması)
                    </h4>
                    <p style={{ fontSize: "0.8rem", color: "var(--md-text-secondary)", marginTop: "0.2rem" }}>
                      Depolama alanı harcamadan doğrudan tarayıcınızdan yerel uygulama hızında çalışır.
                    </p>
                  </div>
                </div>

                {isInstalled ? (
                  <div
                    style={{
                      background: "rgba(45, 106, 79, 0.15)",
                      color: "var(--status-present)",
                      padding: "0.75rem 1rem",
                      borderRadius: "10px",
                      fontWeight: 700,
                      fontSize: "0.9rem",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                    }}
                  >
                    <span>🎉</span>
                    <span>Maarif LMS uygulaması cihazınıza zaten başarıyla kuruldu!</span>
                  </div>
                ) : (
                  <button
                    onClick={handleInstallPwa}
                    className="md-btn md-btn-primary"
                    style={{
                      padding: "0.85rem 1.25rem",
                      borderRadius: "12px",
                      fontSize: "0.95rem",
                      fontWeight: 700,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "0.6rem",
                    }}
                  >
                    <span>📲</span>
                    <span>Uygulama Olarak Ana Ekrana Ekle</span>
                  </button>
                )}
              </div>

              {/* iOS / iPhone Rehberi */}
              <div
                style={{
                  background: "#ffffff",
                  border: "1px solid var(--md-cream-border)",
                  borderRadius: "12px",
                  padding: "1rem",
                }}
              >
                <h5 style={{ fontSize: "0.9rem", fontWeight: 700, color: "var(--md-navy-primary)", marginBottom: "0.5rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                  <span>🍎</span>
                  <span>iPhone / iPad (iOS) Kurulum Adımları</span>
                </h5>
                <ol
                  style={{
                    paddingLeft: "1.25rem",
                    fontSize: "0.825rem",
                    color: "var(--md-text-secondary)",
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.4rem",
                    lineHeight: 1.5,
                  }}
                >
                  <li>Siteyi Safari tarayıcısında açın.</li>
                  <li>Ekranın altındaki <strong>"Paylaş" (Kare içinden yukarı ok 📤)</strong> simgesine dokunun.</li>
                  <li>Açılan menüde aşağı kaydırıp <strong>"Ana Ekrana Ekle" (Add to Home Screen)</strong> seçeneğini seçin.</li>
                  <li>Sağ üstteki <strong>"Ekle"</strong> butonuna basın. Maarif LMS simgesi iPhone menünüze yerleşecektir!</li>
                </ol>
              </div>
            </div>
          )}

          {/* TAB 3: QR Kodu */}
          {activeTab === "qr" && (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem", textAlign: "center" }}>
              <p style={{ fontSize: "0.85rem", color: "var(--md-text-secondary)", maxWidth: "420px" }}>
                Telefonunuzun kamerasını aşağıdaki QR koda tutarak Maarif LMS portalını cep telefonunuzda anında açabilir ve APK indirebilirsiniz.
              </p>

              {/* SVG QR Code */}
              <div
                style={{
                  padding: "1rem",
                  background: "#ffffff",
                  borderRadius: "16px",
                  border: "2px solid var(--md-navy-primary)",
                  boxShadow: "var(--md-elevation-2)",
                  display: "inline-block",
                }}
              >
                <svg width="180" height="180" viewBox="0 0 100 100" style={{ display: "block" }}>
                  {/* Background */}
                  <rect width="100" height="100" fill="#ffffff" />

                  {/* Corner Target 1 (Top-Left) */}
                  <rect x="10" y="10" width="24" height="24" fill="#122646" rx="3" />
                  <rect x="14" y="14" width="16" height="16" fill="#ffffff" rx="1.5" />
                  <rect x="17" y="17" width="10" height="10" fill="#c6923b" rx="1" />

                  {/* Corner Target 2 (Top-Right) */}
                  <rect x="66" y="10" width="24" height="24" fill="#122646" rx="3" />
                  <rect x="70" y="14" width="16" height="16" fill="#ffffff" rx="1.5" />
                  <rect x="73" y="17" width="10" height="10" fill="#c6923b" rx="1" />

                  {/* Corner Target 3 (Bottom-Left) */}
                  <rect x="10" y="66" width="24" height="24" fill="#122646" rx="3" />
                  <rect x="14" y="70" width="16" height="16" fill="#ffffff" rx="1.5" />
                  <rect x="17" y="73" width="10" height="10" fill="#c6923b" rx="1" />

                  {/* Random QR Grid Pattern */}
                  <rect x="38" y="12" width="6" height="6" fill="#122646" />
                  <rect x="48" y="12" width="6" height="6" fill="#122646" />
                  <rect x="38" y="22" width="6" height="6" fill="#122646" />
                  <rect x="52" y="22" width="6" height="6" fill="#c6923b" />
                  <rect x="44" y="32" width="6" height="6" fill="#122646" />
                  <rect x="20" y="44" width="6" height="6" fill="#122646" />
                  <rect x="32" y="44" width="6" height="6" fill="#c6923b" />
                  <rect x="44" y="44" width="12" height="12" fill="#122646" rx="2" />
                  <rect x="62" y="44" width="6" height="6" fill="#122646" />
                  <rect x="74" y="44" width="6" height="6" fill="#c6923b" />
                  <rect x="12" y="54" width="6" height="6" fill="#c6923b" />
                  <rect x="38" y="58" width="6" height="6" fill="#122646" />
                  <rect x="48" y="64" width="6" height="6" fill="#122646" />
                  <rect x="60" y="58" width="6" height="6" fill="#122646" />
                  <rect x="70" y="66" width="6" height="6" fill="#122646" />
                  <rect x="80" y="74" width="6" height="6" fill="#c6923b" />
                  <rect x="64" y="78" width="6" height="6" fill="#122646" />
                  <rect x="76" y="82" width="6" height="6" fill="#122646" />
                </svg>
              </div>

              <div style={{ fontSize: "0.8rem", color: "var(--md-navy-primary)", fontWeight: 700 }}>
                📱 Kamerayı yaklaştırın • Doğrudan açın
              </div>
            </div>
          )}

          {/* Features Highlights for Mobile */}
          <div
            style={{
              marginTop: "1.25rem",
              paddingTop: "1rem",
              borderTop: "1px dashed var(--md-cream-border)",
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "0.6rem",
              fontSize: "0.75rem",
              color: "var(--md-text-secondary)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <span>📶</span>
              <span>Çevrimdışı (Offline) Maarif Planları</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <span>🔔</span>
              <span>Anlık Veli & Öğrenci Bildirimleri</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <span>📷</span>
              <span>3:4 Otomatik Vesikalık & Kırpma</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <span>✍️</span>
              <span>Mobil e-İmza & Yoklama Defteri</span>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div
          style={{
            background: "var(--md-cream-surface)",
            borderTop: "1px solid var(--md-cream-border)",
            padding: "0.85rem 1.5rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottomLeftRadius: "18px",
            borderBottomRightRadius: "18px",
          }}
        >
          <div style={{ fontSize: "0.75rem", color: "var(--md-text-muted)" }}>
            MEB Bilgi İşlem • Türkiye Yüzyılı Maarif Modeli
          </div>
          <button
            onClick={onClose}
            className="md-btn md-btn-secondary"
            style={{ padding: "0.45rem 1rem", fontSize: "0.825rem" }}
          >
            Kapat
          </button>
        </div>
      </div>
    </div>
  );
}
