"use client";

import React, { useState, useEffect } from "react";
import {
  isDeviceOnline,
  setSimulatedOffline,
  getOfflineQueue,
  syncPendingActionsWithFirebase,
  type OfflineSyncAction,
} from "@/lib/maarif/offlineSyncHelper";

export default function NetworkStatusBanner() {
  const [online, setOnline] = useState(true);
  const [queueCount, setQueueCount] = useState(0);
  const [syncToast, setSyncToast] = useState<string | null>(null);

  useEffect(() => {
    setOnline(isDeviceOnline());
    setQueueCount(getOfflineQueue().length);

    const updateStatus = () => {
      const nowOnline = isDeviceOnline();
      setOnline(nowOnline);
      setQueueCount(getOfflineQueue().length);
    };

    const handleQueueUpdate = (e: any) => {
      setQueueCount(e.detail?.count || 0);
    };

    const handleSyncCompleted = (e: any) => {
      setSyncToast(
        `✓ İnternet bağlantısı kuruldu! Çevrimdışı yapılan ${e.detail?.syncedCount || 0} işlem Firebase ile başarıyla senkronize edildi.`
      );
      setTimeout(() => setSyncToast(null), 5000);
    };

    window.addEventListener("online", updateStatus);
    window.addEventListener("offline", updateStatus);
    window.addEventListener("network-status-changed", updateStatus);
    window.addEventListener("offline-queue-updated", handleQueueUpdate);
    window.addEventListener("offline-sync-completed", handleSyncCompleted);

    return () => {
      window.removeEventListener("online", updateStatus);
      window.removeEventListener("offline", updateStatus);
      window.removeEventListener("network-status-changed", updateStatus);
      window.removeEventListener("offline-queue-updated", handleQueueUpdate);
      window.removeEventListener("offline-sync-completed", handleSyncCompleted);
    };
  }, []);

  const handleToggleOfflineSimulation = () => {
    if (online) {
      setSimulatedOffline(true);
    } else {
      setSimulatedOffline(false);
    }
  };

  const handleManualSync = async () => {
    const res = await syncPendingActionsWithFirebase();
    setSyncToast(res.message);
    setTimeout(() => setSyncToast(null), 5000);
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          padding: "0.5rem 1rem",
          borderRadius: "8px",
          fontSize: "0.8rem",
          fontWeight: 600,
          background: online
            ? "linear-gradient(90deg, rgba(237, 247, 237, 0.95) 0%, rgba(246, 255, 246, 0.95) 100%)"
            : "linear-gradient(90deg, rgba(254, 243, 199, 0.95) 0%, rgba(255, 237, 213, 0.95) 100%)",
          border: online ? "1px solid #c6f6d5" : "1.5px solid #f59e0b",
          color: online ? "#22543d" : "#92400e",
          boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
          gap: "0.75rem",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <span
            style={{
              width: "10px",
              height: "10px",
              borderRadius: "50%",
              background: online ? "#38a169" : "#dd6b20",
              boxShadow: online ? "0 0 6px #38a169" : "0 0 6px #dd6b20",
              display: "inline-block",
            }}
          />
          <span>
            {online ? (
              <>
                <strong>PWA Çevrimiçi Mod:</strong> İnternet bağlantısı aktif, Firebase ile anlık senkronizasyon sağlanıyor.
              </>
            ) : (
              <>
                <strong>PWA Çevrimdışı Mod (İnternet Yok):</strong> Haftalık planı inceleyebilir ve tavsiyelere tik atabilirsiniz (LocalStorage devrede).
              </>
            )}
          </span>

          {queueCount > 0 && (
            <span
              style={{
                background: "#fef3c7",
                color: "#b45309",
                border: "1px solid #fcd34d",
                padding: "0.1rem 0.45rem",
                borderRadius: "4px",
                fontSize: "0.75rem",
                fontWeight: 700,
              }}
            >
              ⏳ {queueCount} Bekleyen Senkronizasyon
            </span>
          )}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          {queueCount > 0 && online && (
            <button
              type="button"
              onClick={handleManualSync}
              className="md-btn md-btn-primary"
              style={{ padding: "0.25rem 0.6rem", fontSize: "0.75rem" }}
            >
              Şimdi Senkronize Et
            </button>
          )}

          <button
            type="button"
            onClick={handleToggleOfflineSimulation}
            style={{
              padding: "0.25rem 0.65rem",
              borderRadius: "6px",
              border: online ? "1px solid #f6ad55" : "1px solid #38a169",
              background: online ? "#feebc8" : "#c6f6d5",
              color: online ? "#7b341e" : "#22543d",
              fontSize: "0.75rem",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            {online ? "⚡ Çevrimdışı Modu Test Et (İnterneti Kes)" : "🔄 Çevrimiçi Ol & Senkronize Et"}
          </button>
        </div>
      </div>

      {/* Sync Celebration Toast */}
      {syncToast && (
        <div
          style={{
            position: "fixed",
            bottom: "24px",
            right: "24px",
            zIndex: 400,
            background: "linear-gradient(135deg, #1b4332 0%, #2d6a4f 100%)",
            color: "#ffffff",
            padding: "0.9rem 1.4rem",
            borderRadius: "10px",
            boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
            fontSize: "0.875rem",
            fontWeight: 700,
            display: "flex",
            alignItems: "center",
            gap: "0.6rem",
            border: "1.5px solid #52b788",
            animation: "fadeInUp 0.3s ease",
          }}
        >
          <span style={{ fontSize: "1.2rem" }}>☁️</span>
          <span>{syncToast}</span>
          <button
            type="button"
            onClick={() => setSyncToast(null)}
            style={{ background: "none", border: "none", color: "#ffffff", fontSize: "1rem", cursor: "pointer", marginLeft: "0.5rem" }}
          >
            ✕
          </button>
        </div>
      )}
    </>
  );
}
