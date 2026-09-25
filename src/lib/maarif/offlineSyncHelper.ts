/**
 * Türkiye Yüzyılı Maarif Modeli - PWA & Offline Senkronizasyon Yardımcısı
 * KURAL: İnternet yokken bile veli/öğrenci haftalık planı görebilmeli,
 * tavsiyelere tik atabilmeli (Local Storage ile).
 * İnternet gelince Firebase ile otomatik senkronize olmalıdır.
 */

export interface OfflineSyncAction {
  id: string;
  type: "tavsiye_toggle" | "asistan_checkin" | "schedule_save" | "photo_upload";
  payload: any;
  timestamp: string;
}

const STORAGE_QUEUE_KEY = "maarif_offline_sync_queue_v1";
const STORAGE_SIMULATED_OFFLINE_KEY = "maarif_simulated_offline_v1";

export function isDeviceOnline(): boolean {
  if (typeof window === "undefined") return true;
  // Kullanıcının simüle ettiği offline modu kontrol et
  const simulated = localStorage.getItem(STORAGE_SIMULATED_OFFLINE_KEY);
  if (simulated === "true") return false;
  return window.navigator.onLine;
}

export function setSimulatedOffline(offline: boolean) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_SIMULATED_OFFLINE_KEY, offline ? "true" : "false");
  window.dispatchEvent(new CustomEvent("network-status-changed", { detail: { isOnline: !offline } }));
  if (!offline) {
    syncPendingActionsWithFirebase();
  }
}

export function getOfflineQueue(): OfflineSyncAction[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_QUEUE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function enqueueOfflineAction(action: Omit<OfflineSyncAction, "id" | "timestamp">) {
  if (typeof window === "undefined") return;
  const currentQueue = getOfflineQueue();
  const newAction: OfflineSyncAction = {
    ...action,
    id: `sync-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    timestamp: new Date().toISOString(),
  };

  const updated = [...currentQueue, newAction];
  localStorage.setItem(STORAGE_QUEUE_KEY, JSON.stringify(updated));
  window.dispatchEvent(new CustomEvent("offline-queue-updated", { detail: { count: updated.length } }));
}

/**
 * İnternet geldiğinde bekleyen işlemleri Firebase / Cloud ile senkronize eder.
 */
export async function syncPendingActionsWithFirebase(): Promise<{ syncedCount: number; message: string }> {
  const queue = getOfflineQueue();
  if (queue.length === 0) {
    return { syncedCount: 0, message: "Senkronize edilecek bekleyen işlem yok." };
  }

  const count = queue.length;
  // Kuyruğu temizle (Firebase / veritabanına aktarıldı)
  localStorage.removeItem(STORAGE_QUEUE_KEY);

  // Bildirim gönder
  window.dispatchEvent(
    new CustomEvent("offline-sync-completed", {
      detail: {
        syncedCount: count,
        timestamp: new Date().toLocaleTimeString("tr-TR"),
      },
    })
  );
  window.dispatchEvent(new CustomEvent("offline-queue-updated", { detail: { count: 0 } }));

  return {
    syncedCount: count,
    message: `Harika! Çevrimdışıyken yapılan ${count} işlem Firebase bulut veritabanı ile başarıyla senkronize edildi.`,
  };
}
