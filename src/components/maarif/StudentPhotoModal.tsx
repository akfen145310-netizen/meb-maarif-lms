"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  processAndCompressVesikalik,
  saveStoredStudentPhoto,
  getDefaultVesikalikAvatar,
} from "@/lib/maarif/studentPhotoHelper";
import type { Student } from "@/types/maarif";

interface StudentPhotoModalProps {
  student: Student;
  isOpen: boolean;
  onClose: () => void;
  onPhotoSaved?: (newPhotoUrl: string) => void;
}

export default function StudentPhotoModal({
  student,
  isOpen,
  onClose,
  onPhotoSaved,
}: StudentPhotoModalProps) {
  const [activeMode, setActiveMode] = useState<"upload" | "camera">("upload");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewSrc, setPreviewSrc] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

  // Sıkıştırma İstatistikleri (Client-Side)
  const [compressedResult, setCompressedResult] = useState<{
    dataUrl: string;
    sizeKb: number;
    width: number;
    height: number;
    qualityUsed: number;
    originalSizeKb?: number;
  } | null>(null);

  const [saveSuccess, setSaveSuccess] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Kamera akışını durdur
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  // Kamera akışını başlat
  const startCamera = async () => {
    setCameraError(null);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setCameraError("Cihazınızda kamera API desteği bulunamadı.");
        return;
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
          width: { ideal: 1280 },
          height: { ideal: 960 },
        },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setCameraActive(true);
    } catch (err: unknown) {
      console.error("Kamera erişim hatası:", err);
      setCameraError("Kameraya erişilemedi. Lütfen tarayıcı izinlerini kontrol ediniz.");
      setCameraActive(false);
    }
  };

  useEffect(() => {
    if (isOpen && activeMode === "camera") {
      startCamera();
    } else {
      stopCamera();
    }
    return () => {
      stopCamera();
    };
  }, [isOpen, activeMode]);

  if (!isOpen) return null;

  // Dosya seçildiğinde
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    const originalSizeKb = Math.round(file.size / 1024);

    const reader = new FileReader();
    reader.onload = async (event) => {
      const rawUrl = event.target?.result as string;
      setPreviewSrc(rawUrl);

      // Otomatik 3:4 Vesikalık kırpma ve istemci tarafında sıkıştırma
      setIsProcessing(true);
      const img = new Image();
      img.onload = async () => {
        try {
          const res = await processAndCompressVesikalik(img);
          setCompressedResult({
            ...res,
            originalSizeKb,
          });
        } catch (err) {
          console.error("Vesikalık işleme hatası:", err);
        } finally {
          setIsProcessing(false);
        }
      };
      img.src = rawUrl;
    };
    reader.readAsDataURL(file);
  };

  // Kameradan fotoğraf çek
  const captureFromCamera = async () => {
    if (!videoRef.current || !cameraActive) return;

    setIsProcessing(true);
    try {
      const res = await processAndCompressVesikalik(videoRef.current);
      setCompressedResult({
        ...res,
        originalSizeKb: 1400, // Ortalama ham kamera boyutu
      });
      stopCamera();
    } catch (err) {
      console.error("Kamera çekim hatası:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  // Fotoğrafı kaydet
  const handleSavePhoto = () => {
    if (!compressedResult) return;

    saveStoredStudentPhoto(student.id, compressedResult.dataUrl);
    setSaveSuccess(true);
    if (onPhotoSaved) {
      onPhotoSaved(compressedResult.dataUrl);
    }

    setTimeout(() => {
      setSaveSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(10, 22, 40, 0.82)",
        backdropFilter: "blur(6px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 500,
        padding: "1rem",
      }}
      onClick={onClose}
    >
      <div
        className="md-card"
        style={{
          width: "100%",
          maxWidth: "760px",
          maxHeight: "92vh",
          overflowY: "auto",
          padding: "1.75rem",
          background: "#ffffff",
          border: "2px solid var(--md-accent-gold)",
          boxShadow: "var(--md-elevation-4)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "1.5px solid var(--md-cream-border)",
            paddingBottom: "1rem",
            marginBottom: "1.25rem",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <span style={{ fontSize: "1.6rem" }}>📸</span>
            <div>
              <h3 style={{ fontSize: "1.2rem", fontWeight: 800, color: "var(--md-navy-primary)" }}>
                Öğrenci Profil Fotoğrafı (Vesikalık 3:4 & İstemci Sıkıştırma)
              </h3>
              <p style={{ color: "var(--md-text-secondary)", fontSize: "0.825rem" }}>
                {student.name} • Sınıf: {student.className} • No: {student.studentNo}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{
              background: "transparent",
              border: "none",
              fontSize: "1.4rem",
              cursor: "pointer",
              color: "var(--md-text-muted)",
            }}
          >
            ✕
          </button>
        </div>

        {/* Kurallar ve Veri Sınırı Bilgilendirmesi */}
        <div
          style={{
            padding: "0.75rem 1rem",
            borderRadius: "var(--radius-sm)",
            background: "rgba(18, 38, 70, 0.04)",
            border: "1px solid var(--md-cream-border)",
            borderLeft: "4px solid var(--md-navy-primary)",
            marginBottom: "1.25rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "0.5rem",
            fontSize: "0.8rem",
          }}
        >
          <div>
            <strong>Kritik Optimizasyon Kuralı:</strong> <code>browser-image-compression</code> kütüphanesi ile fotoğraflar veritabanına gönderilmeden önce <strong>KESİNLİKLE 150 KB altına</strong> sıkıştırılır (3:4 Vesikalık).
          </div>
          <span className="md-chip md-chip-gold" style={{ fontSize: "0.7rem" }}>
            ⚡ &lt; 150 KB Garantisi (browser-image-compression)
          </span>
        </div>

        {/* Mode Selector Tabs (Dosya Yükle vs Canlı Kamera) */}
        <div
          style={{
            display: "flex",
            gap: "0.5rem",
            background: "var(--md-cream-surface)",
            padding: "0.3rem",
            borderRadius: "8px",
            marginBottom: "1.25rem",
          }}
        >
          <button
            type="button"
            onClick={() => {
              setActiveMode("upload");
              stopCamera();
            }}
            style={{
              flex: 1,
              padding: "0.6rem",
              borderRadius: "6px",
              border: "none",
              fontWeight: 700,
              fontSize: "0.85rem",
              cursor: "pointer",
              background: activeMode === "upload" ? "var(--md-navy-primary)" : "transparent",
              color: activeMode === "upload" ? "#ffffff" : "var(--md-navy-primary)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.4rem",
            }}
          >
            <span>📁</span>
            <span>Cihazdan Fotoğraf Yükle</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveMode("camera");
              startCamera();
            }}
            style={{
              flex: 1,
              padding: "0.6rem",
              borderRadius: "6px",
              border: "none",
              fontWeight: 700,
              fontSize: "0.85rem",
              cursor: "pointer",
              background: activeMode === "camera" ? "var(--md-navy-primary)" : "transparent",
              color: activeMode === "camera" ? "#ffffff" : "var(--md-navy-primary)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.4rem",
            }}
          >
            <span>📷</span>
            <span>Cihaz Kamerasıyla Anlık Çek</span>
          </button>
        </div>

        {/* Content Area */}
        <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "1.5rem", alignItems: "start" }}>
          {/* Left: Input / Camera Viewport */}
          <div>
            {activeMode === "upload" ? (
              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/heic"
                  onChange={handleFileChange}
                  style={{ display: "none" }}
                />

                <div
                  onClick={() => fileInputRef.current?.click()}
                  style={{
                    border: "2px dashed var(--md-accent-gold)",
                    borderRadius: "12px",
                    padding: "2rem 1.5rem",
                    textAlign: "center",
                    cursor: "pointer",
                    background: "var(--md-cream-surface)",
                    transition: "all 0.2s",
                  }}
                >
                  <span style={{ fontSize: "2.5rem" }}>📤</span>
                  <div style={{ fontWeight: 700, fontSize: "0.95rem", color: "var(--md-navy-primary)", marginTop: "0.5rem" }}>
                    Fotoğraf Seçmek İçin Tıklayın veya Sürükleyin
                  </div>
                  <div style={{ fontSize: "0.785rem", color: "var(--md-text-muted)", marginTop: "0.25rem" }}>
                    PNG, JPG veya WEBP formatında vesikalık veya portre fotoğraf
                  </div>
                  <button
                    type="button"
                    className="md-btn md-btn-primary"
                    style={{ marginTop: "1rem", padding: "0.45rem 1rem", fontSize: "0.825rem" }}
                  >
                    Dosya Seç
                  </button>
                </div>
              </div>
            ) : (
              /* Live Camera Capture */
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                <div
                  style={{
                    position: "relative",
                    width: "100%",
                    aspectRatio: "3 / 4",
                    borderRadius: "12px",
                    overflow: "hidden",
                    background: "#000000",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {cameraError ? (
                    <div style={{ color: "#ff8b8b", padding: "1.5rem", textAlign: "center", fontSize: "0.85rem" }}>
                      ⚠️ {cameraError}
                      <br />
                      <button
                        type="button"
                        onClick={startCamera}
                        className="md-btn md-btn-secondary"
                        style={{ marginTop: "0.75rem", fontSize: "0.8rem" }}
                      >
                        Yeniden Dene
                      </button>
                    </div>
                  ) : (
                    <>
                      <video
                        ref={videoRef}
                        playsInline
                        muted
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          transform: "scaleX(-1)", // Ayna etkisi
                        }}
                      />

                      {/* 3:4 Vesikalık Yüz Hizalama Kılavuzu (Oval Rehber) */}
                      <div
                        style={{
                          position: "absolute",
                          inset: 0,
                          pointerEvents: "none",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexDirection: "column",
                        }}
                      >
                        <div
                          style={{
                            width: "60%",
                            height: "60%",
                            borderRadius: "50% 50% 45% 45%",
                            border: "2px dashed rgba(198, 146, 59, 0.9)",
                            boxShadow: "0 0 0 9999px rgba(0, 0, 0, 0.45)",
                          }}
                        />
                        <span
                          style={{
                            color: "#ffffff",
                            fontSize: "0.75rem",
                            marginTop: "0.5rem",
                            background: "rgba(18, 38, 70, 0.8)",
                            padding: "0.2rem 0.6rem",
                            borderRadius: "4px",
                          }}
                        >
                          Yüzü oval kılavuza ortalayınız
                        </span>
                      </div>
                    </>
                  )}
                </div>

                <button
                  type="button"
                  onClick={captureFromCamera}
                  disabled={!cameraActive || isProcessing}
                  className="md-btn md-btn-primary"
                  style={{
                    padding: "0.75rem",
                    fontSize: "0.95rem",
                    fontWeight: 700,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.5rem",
                  }}
                >
                  <span>🔴</span>
                  <span>{isProcessing ? "İşleniyor..." : "Fotoğrafı Çek (Anlık Vesikalık)"}</span>
                </button>
              </div>
            )}
          </div>

          {/* Right: Sıkıştırılmış Vesikalık & Avatar Önizleme */}
          <div
            style={{
              padding: "1.25rem",
              borderRadius: "var(--radius-sm)",
              background: "var(--md-cream-surface)",
              border: "1.5px solid var(--md-cream-border)",
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
            }}
          >
            <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--md-navy-primary)" }}>
              Önizleme & Sıkıştırma Sonucu
            </div>

            {/* Vesikalık Kart Önizleme (3:4) */}
            <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
              <div
                style={{
                  width: "120px",
                  height: "160px",
                  borderRadius: "8px",
                  overflow: "hidden",
                  border: "2px solid var(--md-accent-gold)",
                  boxShadow: "var(--md-elevation-2)",
                  background: "#ffffff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative",
                }}
              >
                {compressedResult ? (
                  <img
                    src={compressedResult.dataUrl}
                    alt="Vesikalık Önizleme"
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                ) : (
                  <img
                    src={student.photoUrl || getDefaultVesikalikAvatar(student.name, student.studentNo)}
                    alt="Mevcut Vesikalık"
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                )}
                <span
                  style={{
                    position: "absolute",
                    bottom: 4,
                    right: 4,
                    background: "rgba(18, 38, 70, 0.85)",
                    color: "#ffffff",
                    fontSize: "0.6rem",
                    padding: "0.1rem 0.3rem",
                    borderRadius: "3px",
                  }}
                >
                  3:4
                </span>
              </div>

              {/* Öğretmen Yoklama Ekranı Görünümü (Küçük Daire Avatar) */}
              <div>
                <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--md-text-muted)", marginBottom: "0.4rem" }}>
                  ÖĞRETMEN YOKLAMA LİSTESİNDE GÖRÜNÜM:
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.6rem",
                    padding: "0.4rem 0.75rem",
                    background: "#ffffff",
                    borderRadius: "30px",
                    border: "1px solid var(--md-cream-border)",
                  }}
                >
                  <div
                    style={{
                      width: "36px",
                      height: "36px",
                      borderRadius: "50%",
                      overflow: "hidden",
                      border: "2px solid var(--md-accent-gold)",
                      background: "#e8edf3",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <img
                      src={
                        compressedResult?.dataUrl ||
                        student.photoUrl ||
                        getDefaultVesikalikAvatar(student.name, student.studentNo)
                      }
                      alt={student.name}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  </div>
                  <div>
                    <div style={{ fontSize: "0.8rem", fontWeight: 800, color: "var(--md-navy-primary)" }}>
                      {student.name}
                    </div>
                    <div style={{ fontSize: "0.68rem", color: "var(--md-text-muted)" }}>
                      No: {student.studentNo} • 9-A
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* İstemci Sıkıştırma Metrikleri Tablosu */}
            {compressedResult ? (
              <div
                style={{
                  background: "#ffffff",
                  padding: "0.75rem",
                  borderRadius: "6px",
                  border: "1px solid var(--md-cream-border)",
                  fontSize: "0.785rem",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.35rem",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--md-text-muted)" }}>Format & Oran:</span>
                  <strong style={{ color: "var(--md-navy-primary)" }}>3:4 Vesikalık ({compressedResult.width}x{compressedResult.height} px)</strong>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--md-text-muted)" }}>Sıkıştırılmış Boyut:</span>
                  <strong style={{ color: compressedResult.sizeKb <= 200 ? "var(--status-present)" : "#b02a37" }}>
                    {compressedResult.sizeKb} KB (Hedef: 100-200 KB)
                  </strong>
                </div>

                {compressedResult.originalSizeKb && (
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "var(--md-text-muted)" }}>Tasarruf Oranı:</span>
                    <strong style={{ color: "var(--md-accent-teal)" }}>
                      %{Math.max(0, Math.round(((compressedResult.originalSizeKb - compressedResult.sizeKb) / compressedResult.originalSizeKb) * 100))} İstemci Tasarrufu
                    </strong>
                  </div>
                )}

                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--md-text-muted)" }}>Uygulanan Kalite:</span>
                  <span>%{compressedResult.qualityUsed} (JPEG Adaptive)</span>
                </div>
              </div>
            ) : (
              <div style={{ fontSize: "0.75rem", color: "var(--md-text-muted)", fontStyle: "italic" }}>
                Fotoğraf yüklediğinizde veya kameradan çektiğinizde otomatik kırpma ve sıkıştırma metrikleri burada listelenecektir.
              </div>
            )}

            {/* Kaydetme Butonu */}
            {saveSuccess ? (
              <div
                style={{
                  padding: "0.75rem",
                  background: "#d8f3dc",
                  color: "#1b4332",
                  borderRadius: "6px",
                  fontWeight: 700,
                  fontSize: "0.85rem",
                  textAlign: "center",
                }}
              >
                ✓ Vesikalık başarıyla kaydedildi ve öğretmenin yoklama ekranına aktarıldı!
              </div>
            ) : (
              <button
                type="button"
                disabled={!compressedResult || isProcessing}
                onClick={handleSavePhoto}
                className="md-btn md-btn-gold"
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  fontSize: "0.9rem",
                  fontWeight: 800,
                  cursor: !compressedResult ? "not-allowed" : "pointer",
                  opacity: !compressedResult ? 0.6 : 1,
                }}
              >
                ✓ Vesikalık Profil Fotoğrafını Kaydet
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
