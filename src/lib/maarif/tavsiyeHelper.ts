/**
 * Türkiye Yüzyılı Maarif Modeli - Tavsiye Sistemi Yardımcısı
 * KURAL 1: Sistemde "Ödev" kelimesi KESİNLİKLE kullanılmayacak, yerine "Tavsiye" kullanılacaktır.
 * KURAL 2: Öğretmenler sınıfa/öğrenciye tavsiye gönderir (Örn: "Şu konudan 2 test çözülecek").
 * KURAL 3: Öğrenci veya Veli tik attığında "Harika gidiyorsun!" pozitif geri bildirim ve rozetler belirir.
 * KURAL 4: Tik atılsa bile tavsiye ekrandan SİLİNMEZ, şeffaf bir arşiv olarak yeşil renkli / üstü çizili şekilde "Tamamlandı" statüsünde kalır.
 */

export interface TavsiyeCompletionRecord {
  id: string;
  completed: boolean;
  completedAt?: string;
  completedBy?: "ogrenci" | "veli" | "ogretmen";
  motivationMessage?: string;
  badge?: string;
}

const STORAGE_KEY = "maarif_tavsiye_completions_v1";

const MOTIVATION_MESSAGES = [
  "🎉 Harika gidiyorsun! Öğretmeninin tavsiyesini başarıyla yerine getirdin!",
  "🌟 Süpersin! Bir adımı daha geride bıraktın, Maarif Başarı Yıldızı rozeti kazandın!",
  "🚀 Muhteşem gayret! Hedeflerine doğru kararlılıkla ilerliyorsun!",
  "👏 Tebrikler! Bilgi ve becerilerini pekiştirerek harika bir ilerleme kaydettin!",
  "🏅 Harika bir çalışma! Öğretmeninin rehberliğinde başarıya ulaştın!",
  "✨ Çok iyi gidiyorsun! Düzenli çalışma alışkanlığın takdire şayan!",
];

const ROZETLER = [
  { name: "🌟 Maarif Başarı Yıldızı", desc: "Tavsiyeyi zamanında ve eksiksiz tamamlama rozeti" },
  { name: "🎯 Süper Hedefçi", desc: "Öğretmen önerisini başarıyla yerine getirme rozeti" },
  { name: "🚀 Gayret & Azim Rozeti", desc: "Süreç değerlendirme çalışmalarını tamamlama rozeti" },
  { name: "💡 Akıl Yürütme Ustası", desc: "Beceri temelli soruları tamamlama rozeti" },
];

export function getStoredTavsiyeCompletions(): Record<string, TavsiyeCompletionRecord> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function isTavsiyeCompleted(tavsiyeId: string): boolean {
  const map = getStoredTavsiyeCompletions();
  return Boolean(map[tavsiyeId]?.completed);
}

import { isDeviceOnline, enqueueOfflineAction } from "./offlineSyncHelper";

export function getTavsiyeCompletionInfo(tavsiyeId: string): TavsiyeCompletionRecord | null {
  const map = getStoredTavsiyeCompletions();
  return map[tavsiyeId] || null;
}

export function toggleTavsiyeCompletion(
  tavsiyeId: string,
  completedBy: "ogrenci" | "veli" | "ogretmen" = "ogrenci"
): {
  isCompleted: boolean;
  record: TavsiyeCompletionRecord;
  message?: string;
  badge?: string;
} {
  if (typeof window === "undefined") {
    return {
      isCompleted: false,
      record: { id: tavsiyeId, completed: false },
    };
  }

  const map = getStoredTavsiyeCompletions();
  const currentlyCompleted = Boolean(map[tavsiyeId]?.completed);
  const nextCompleted = !currentlyCompleted;

  let message = "";
  let badge = "";

  if (nextCompleted) {
    const randomMsgIndex = Math.floor(Math.random() * MOTIVATION_MESSAGES.length);
    const randomBadgeIndex = Math.floor(Math.random() * ROZETLER.length);
    message = MOTIVATION_MESSAGES[randomMsgIndex];
    badge = ROZETLER[randomBadgeIndex].name;

    const now = new Date();
    const formattedDate = `${now.toLocaleDateString("tr-TR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })} ${now.toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" })}`;

    map[tavsiyeId] = {
      id: tavsiyeId,
      completed: true,
      completedAt: formattedDate,
      completedBy,
      motivationMessage: message,
      badge,
    };
  } else {
    // Geri alma işlemi: Silinmez, statüsü güncellenir
    map[tavsiyeId] = {
      id: tavsiyeId,
      completed: false,
    };
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(map));

    // Çevrimdışıysa PWA senkronizasyon kuyruğuna ekle
    if (!isDeviceOnline()) {
      enqueueOfflineAction({
        type: "tavsiye_toggle",
        payload: {
          tavsiyeId,
          completed: nextCompleted,
          completedBy,
          timestamp: new Date().toISOString(),
        },
      });
    }

    window.dispatchEvent(
      new CustomEvent("tavsiye-status-updated", {
        detail: {
          tavsiyeId,
          isCompleted: nextCompleted,
          message,
          badge,
          completedBy,
        },
      })
    );
  } catch (err) {
    console.error("Tavsiye durumu kaydedilemedi:", err);
  }

  return {
    isCompleted: nextCompleted,
    record: map[tavsiyeId],
    message,
    badge,
  };
}
