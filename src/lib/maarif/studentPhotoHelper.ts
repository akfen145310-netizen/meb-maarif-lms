import imageCompression from "browser-image-compression";

/**
 * browser-image-compression kütüphanesi kullanarak bir görseli
 * KESİNLİKLE 150 KB altına (< 145 KB) sıkıştırır ve optimize eder.
 */
export async function compressWithBrowserImageCompression(
  fileOrBlob: File | Blob,
  maxSizeKB = 142, // Kesinlikle 150 KB altı kuralı
  maxWidthOrHeight = 500
): Promise<{ compressedFile: File; dataUrl: string; sizeKb: number; width: number; height: number }> {
  // Eğer Blob ise File nesnesine dönüştür
  const fileToCompress =
    fileOrBlob instanceof File
      ? fileOrBlob
      : new File([fileOrBlob], "vesikalik.jpg", { type: "image/jpeg" });

  const options = {
    maxSizeMB: maxSizeKB / 1024, // ~0.138 MB (142 KB)
    maxWidthOrHeight: maxWidthOrHeight,
    useWebWorker: true,
    fileType: "image/jpeg",
  };

  let compressed = await imageCompression(fileToCompress, options);
  let sizeKb = Math.round(compressed.size / 1024);

  // Ek güvenlik: Eğer 150 KB sınırına yaklaşır veya geçerse 2. agresif sıkıştırma adımı
  if (sizeKb >= 148) {
    const fallbackOptions = {
      maxSizeMB: 0.12, // 120 KB
      maxWidthOrHeight: 450,
      useWebWorker: true,
      fileType: "image/jpeg",
    };
    compressed = await imageCompression(compressed, fallbackOptions);
    sizeKb = Math.round(compressed.size / 1024);
  }

  const dataUrl = await imageCompression.getDataUrlFromFile(compressed);

  return {
    compressedFile: compressed,
    dataUrl,
    sizeKb,
    width: maxWidthOrHeight,
    height: Math.round((maxWidthOrHeight * 4) / 3), // 3:4 oranı
  };
}

// Varsayılan pastel vesikalık SVG avatar üreteci
export function getDefaultVesikalikAvatar(name: string, studentNo: string): string {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const colors = [
    { bg: "#1f487e", fg: "#ffffff", border: "#c6923b" },
    { bg: "#2d6a4f", fg: "#ffffff", border: "#74c69d" },
    { bg: "#6b2d5c", fg: "#ffffff", border: "#dfb26b" },
    { bg: "#7b3f00", fg: "#ffffff", border: "#e0b46c" },
    { bg: "#1d3557", fg: "#ffffff", border: "#a8dadc" },
  ];

  const colorIndex = (parseInt(studentNo, 10) || 0) % colors.length;
  const theme = colors[colorIndex];

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="533" viewBox="0 0 400 533">
    <defs>
      <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#122646" />
        <stop offset="100%" stop-color="${theme.bg}" />
      </linearGradient>
    </defs>
    <!-- Vesikalık Arka Planı (MEB Açık Gri / Mavi Pasaport Fonu) -->
    <rect width="400" height="533" fill="#e8edf3" />
    <rect x="12" y="12" width="376" height="509" rx="8" fill="#f4f7fb" stroke="${theme.border}" stroke-width="3" stroke-dasharray="6,4" />
    
    <!-- Gövde Silüeti (Vesikalık Omuzlar) -->
    <path d="M 60 510 C 70 380, 130 350, 200 350 C 270 350, 330 380, 340 510 Z" fill="${theme.bg}" />
    <!-- Yaka Ayrıntısı -->
    <polygon points="200,350 170,410 230,410" fill="#ffffff" opacity="0.9" />

    <!-- Kafa / Yüz Silüeti -->
    <circle cx="200" cy="230" r="95" fill="#f8d3b0" stroke="${theme.border}" stroke-width="2" />
    
    <!-- Baş Harfler Rozeti -->
    <circle cx="200" cy="230" r="75" fill="${theme.bg}" opacity="0.95" />
    <text x="200" y="255" font-family="Arial, sans-serif" font-size="64" font-weight="bold" fill="#ffffff" text-anchor="middle">${initials}</text>
    
    <!-- Alt Etiket: MEB Vesikalık -->
    <rect x="50" y="470" width="300" height="32" rx="6" fill="#122646" opacity="0.85" />
    <text x="200" y="492" font-family="Arial, sans-serif" font-size="14" font-weight="bold" fill="#ffffff" text-anchor="middle">ÖĞRENCİ VESİKALIK • NO: ${studentNo}</text>
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

/**
 * İstemci tarafında (Client-Side) 3:4 Vesikalık Oranında Kırpar ve
 * 100 KB - 200 KB aralığında optimize ederek JPEG formatında döner.
 */
export async function processAndCompressVesikalik(
  source: HTMLImageElement | HTMLVideoElement,
  cropArea?: { x: number; y: number; width: number; height: number },
  targetWidth = 400,
  targetHeight = 533 // 3:4 en boy oranı (400 x 533)
): Promise<{ dataUrl: string; sizeKb: number; width: number; height: number; qualityUsed: number }> {
  const canvas = document.createElement("canvas");
  canvas.width = targetWidth;
  canvas.height = targetHeight;
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("Canvas 2D context oluşturulamadı.");
  }

  // Yüksek kaliteli görüntü yumuşatma
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";

  // Kaynak boyutları
  const srcW = source instanceof HTMLVideoElement ? source.videoWidth : source.naturalWidth || source.width;
  const srcH = source instanceof HTMLVideoElement ? source.videoHeight : source.naturalHeight || source.height;

  let sx = 0;
  let sy = 0;
  let sWidth = srcW;
  let sHeight = srcH;

  if (cropArea) {
    sx = cropArea.x;
    sy = cropArea.y;
    sWidth = cropArea.width;
    sHeight = cropArea.height;
  } else {
    // Otomatik 3:4 Vesikalık Ortalaması (Center-Crop)
    const targetAspect = targetWidth / targetHeight; // 3/4 = 0.75
    const srcAspect = srcW / srcH;

    if (srcAspect > targetAspect) {
      // Kaynak daha geniş: Genişliği 3:4'e göre ortalayarak kırp
      sWidth = srcH * targetAspect;
      sHeight = srcH;
      sx = (srcW - sWidth) / 2;
      sy = 0;
    } else {
      // Kaynak daha uzun: Üstten yüz payı bırakarak (üstten %15 başlar) ortala
      sWidth = srcW;
      sHeight = srcW / targetAspect;
      sx = 0;
      sy = Math.max(0, (srcH - sHeight) * 0.2); // Yüzün genelde üst kısımda olması için %20 offset
    }
  }

  // 1. MEB Arka Plan Dolgusu (Temiz açık gri/beyaz vesikalık fon)
  ctx.fillStyle = "#f5f7fb";
  ctx.fillRect(0, 0, targetWidth, targetHeight);

  // 2. Kırpılan görseli 400x533 boyutuna çiz
  ctx.drawImage(source, sx, sy, sWidth, sHeight, 0, 0, targetWidth, targetHeight);

  // 3. browser-image-compression motoru ile KESİNLİKLE 150 KB altına (< 142 KB) sıkıştır
  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob((b) => resolve(b), "image/jpeg", 0.94)
  );

  if (blob) {
    const compressedResult = await compressWithBrowserImageCompression(blob, 142, targetWidth);
    return {
      dataUrl: compressedResult.dataUrl,
      sizeKb: compressedResult.sizeKb,
      width: targetWidth,
      height: targetHeight,
      qualityUsed: 85,
    };
  }

  // Yedek geri dönüş (Canvas toDataURL)
  let quality = 0.82;
  let dataUrl = canvas.toDataURL("image/jpeg", quality);
  let sizeBytes = Math.round((dataUrl.length * 3) / 4);
  let sizeKb = Math.round(sizeBytes / 1024);

  while (sizeKb >= 148 && quality > 0.4) {
    quality -= 0.08;
    dataUrl = canvas.toDataURL("image/jpeg", quality);
    sizeBytes = Math.round((dataUrl.length * 3) / 4);
    sizeKb = Math.round(sizeBytes / 1024);
  }

  return {
    dataUrl,
    sizeKb,
    width: targetWidth,
    height: targetHeight,
    qualityUsed: Math.round(quality * 100),
  };
}

// LocalStorage Persistence ve Canlı Güncelleme Dinleyicisi
const STORAGE_KEY = "maarif_student_photos_v1";

export function getStoredStudentPhoto(studentId: string): string | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const map = JSON.parse(raw);
    return map[studentId] || null;
  } catch {
    return null;
  }
}

export function saveStoredStudentPhoto(studentId: string, photoDataUrl: string): void {
  if (typeof window === "undefined") return;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const map = raw ? JSON.parse(raw) : {};
    map[studentId] = photoDataUrl;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(map));

    // Diğer bileşenlere canlı bildirim gönder
    window.dispatchEvent(
      new CustomEvent("student-photo-updated", {
        detail: { studentId, photoDataUrl },
      })
    );
  } catch (err) {
    console.error("Öğrenci fotoğrafı kaydedilemedi:", err);
  }
}
