"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function Navigation({ onNewTask }: { onNewTask?: () => void }) {
  const pathname = usePathname();
  const { user, isConfigured, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: "Genel Bakış", href: "/dashboard", icon: "📊" },
    { label: "Görev Panosu", href: "/tasks", icon: "📋" },
    { label: "Projeler", href: "/projects", icon: "📁" },
    { label: "Ayarlar", href: "/settings", icon: "⚙️" },
  ];

  return (
    <nav
      style={{
        borderBottom: "1px solid var(--border-subtle)",
        background: "rgba(7, 9, 14, 0.85)",
        backdropFilter: "blur(20px)",
        position: "sticky",
        top: 0,
        zIndex: 100,
      }}
    >
      <div
        className="container"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: "68px",
        }}
      >
        {/* Brand */}
        <div style={{ display: "flex", alignItems: "center", gap: "2rem" }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "10px",
                background: "var(--grad-firebase)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "var(--shadow-flame)",
              }}
            >
              <span style={{ fontSize: "1.1rem" }}>⚡</span>
            </div>
            <div>
              <span style={{ fontWeight: 800, fontSize: "1.1rem", letterSpacing: "-0.02em" }}>
                Task<span style={{ color: "var(--accent-firebase)" }}>Flow</span>
              </span>
              <span
                style={{
                  fontSize: "0.65rem",
                  marginLeft: "0.4rem",
                  padding: "0.15rem 0.4rem",
                  borderRadius: "9999px",
                  background: "rgba(255,255,255,0.08)",
                  color: "var(--text-secondary)",
                }}
              >
                SaaS
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div style={{ display: "flex", gap: "0.4rem" }}>
            {navLinks.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.4rem",
                    padding: "0.5rem 0.85rem",
                    borderRadius: "0.5rem",
                    fontSize: "0.875rem",
                    fontWeight: active ? 600 : 500,
                    color: active ? "#ffffff" : "var(--text-secondary)",
                    background: active ? "rgba(255,255,255,0.08)" : "transparent",
                    transition: "all 0.2s",
                  }}
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Right Section */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          {onNewTask && (
            <button
              onClick={onNewTask}
              className="btn btn-primary"
              style={{ padding: "0.45rem 0.9rem", fontSize: "0.85rem" }}
            >
              <span>+</span> Yeni Görev
            </button>
          )}

          <div
            style={{
              padding: "0.3rem 0.65rem",
              borderRadius: "9999px",
              fontSize: "0.75rem",
              display: "flex",
              alignItems: "center",
              gap: "0.4rem",
              background: isConfigured ? "rgba(16, 185, 129, 0.12)" : "rgba(245, 158, 11, 0.12)",
              color: isConfigured ? "#34d399" : "#fbbf24",
              border: `1px solid ${isConfigured ? "rgba(16, 185, 129, 0.2)" : "rgba(245, 158, 11, 0.2)"}`,
            }}
          >
            <span style={{ fontSize: "0.6rem" }}>{isConfigured ? "●" : "○"}</span>
            <span>{isConfigured ? "Firebase Canlı" : "Önizleme"}</span>
          </div>

          {user ? (
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
              <div
                style={{
                  width: "34px",
                  height: "34px",
                  borderRadius: "50%",
                  background: "var(--grad-next)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 700,
                  fontSize: "0.85rem",
                  color: "#fff",
                }}
                title={user.email || ""}
              >
                {user.displayName ? user.displayName.charAt(0).toUpperCase() : user.email?.charAt(0).toUpperCase() || "U"}
              </div>
              <button
                onClick={logout}
                className="btn btn-secondary"
                style={{ padding: "0.4rem 0.7rem", fontSize: "0.8rem" }}
                title="Çıkış Yap"
              >
                Çıkış
              </button>
            </div>
          ) : (
            <Link
              href="/"
              className="btn btn-secondary"
              style={{ padding: "0.45rem 0.85rem", fontSize: "0.85rem" }}
            >
              Giriş Yap
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
