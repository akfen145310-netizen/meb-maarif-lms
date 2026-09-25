"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Navigation from "@/components/Navigation";
import TaskModal from "@/components/TaskModal";
import ProjectModal from "@/components/ProjectModal";
import { useAuth } from "@/context/AuthContext";
import {
  createTask,
  updateTaskStatus,
  deleteTask,
  subscribeTasks,
} from "@/lib/firebase/tasksService";
import {
  createProject,
  subscribeProjects,
} from "@/lib/firebase/projectsService";
import type { TaskItem, Project, TaskStatus } from "@/types";

const INITIAL_DEMO_TASKS: TaskItem[] = [
  {
    id: "demo-task-1",
    title: "Firebase Güvenlik Kurallarını Yapılandır",
    description: "Cloud Firestore ve Auth kurallarını test modundan canlıya geçir.",
    status: "in_progress",
    priority: "high",
    dueDate: "2026-10-01",
    userId: "demo",
  },
  {
    id: "demo-task-2",
    title: "Kullanıcı Profil Kartı Tasarımı",
    description: "Avatar yükleme ve hesap ayarlarını ekle.",
    status: "todo",
    priority: "medium",
    dueDate: "2026-10-05",
    userId: "demo",
  },
  {
    id: "demo-task-3",
    title: "Next.js 16 & TypeScript Entegrasyonu",
    description: "App Router temel yapısı ve layout bileşenleri kuruldu.",
    status: "done",
    priority: "low",
    dueDate: "2026-09-25",
    userId: "demo",
  },
];

const INITIAL_DEMO_PROJECTS: Project[] = [
  {
    id: "demo-proj-1",
    title: "Web Platformu v1.0",
    description: "Next.js ve Firebase tabanlı ana ürün geliştirme süreci.",
    color: "#6366f1",
    ownerId: "demo",
    taskCount: 3,
  },
  {
    id: "demo-proj-2",
    title: "Pazarlama & Lansman",
    description: "SEO optimizasyonları ve sosyal medya varlığı.",
    color: "#ff9100",
    ownerId: "demo",
    taskCount: 1,
  },
];

export default function DashboardPage() {
  const { user, isConfigured } = useAuth();
  const [tasks, setTasks] = useState<TaskItem[]>(INITIAL_DEMO_TASKS);
  const [projects, setProjects] = useState<Project[]>(INITIAL_DEMO_PROJECTS);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);

  useEffect(() => {
    if (!isConfigured || !user) return;

    const unsubTasks = subscribeTasks(user.uid, (fetchedTasks) => {
      setTasks(fetchedTasks.length > 0 ? fetchedTasks : []);
    });

    const unsubProjects = subscribeProjects(user.uid, (fetchedProjects) => {
      setProjects(fetchedProjects.length > 0 ? fetchedProjects : []);
    });

    return () => {
      unsubTasks();
      unsubProjects();
    };
  }, [isConfigured, user]);

  const handleCreateTask = async (taskData: Omit<TaskItem, "id" | "userId">) => {
    if (isConfigured && user) {
      await createTask({
        ...taskData,
        userId: user.uid,
      });
    } else {
      const newTask: TaskItem = {
        id: `mock-${Date.now()}`,
        ...taskData,
        userId: "local",
      };
      setTasks([newTask, ...tasks]);
    }
  };

  const handleCreateProject = async (projData: { title: string; description: string; color: string }) => {
    if (isConfigured && user) {
      await createProject({
        ...projData,
        ownerId: user.uid,
      });
    } else {
      const newProj: Project = {
        id: `mock-proj-${Date.now()}`,
        ...projData,
        ownerId: "local",
        taskCount: 0,
      };
      setProjects([newProj, ...projects]);
    }
  };

  const handleToggleStatus = async (taskId: string, currentStatus: TaskStatus) => {
    const nextStatus: TaskStatus = currentStatus === "done" ? "todo" : "done";
    if (isConfigured && user) {
      await updateTaskStatus(taskId, nextStatus);
    } else {
      setTasks(
        tasks.map((t) => (t.id === taskId ? { ...t, status: nextStatus } : t))
      );
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (isConfigured && user) {
      await deleteTask(taskId);
    } else {
      setTasks(tasks.filter((t) => t.id !== taskId));
    }
  };

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === "done").length;
  const inProgressTasks = tasks.filter((t) => t.status === "in_progress").length;
  const todoTasks = tasks.filter((t) => t.status === "todo").length;

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Navigation onNewTask={() => setIsTaskModalOpen(true)} />

      <main className="container" style={{ flex: 1, padding: "2rem 1.5rem" }}>
        {/* Welcome Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "1rem",
            marginBottom: "2rem",
          }}
        >
          <div>
            <h1 style={{ fontSize: "1.75rem", marginBottom: "0.25rem" }}>
              Hoş Geldiniz, {user?.displayName || user?.email?.split("@")[0] || "Misafir"} 👋
            </h1>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>
              Bugünkü görevleriniz, projeleriniz ve ilerleme durumunuz.
            </p>
          </div>

          <div style={{ display: "flex", gap: "0.75rem" }}>
            <button
              onClick={() => setIsProjectModalOpen(true)}
              className="btn btn-secondary"
              style={{ padding: "0.55rem 1rem", fontSize: "0.85rem" }}
            >
              + Yeni Proje
            </button>
            <button
              onClick={() => setIsTaskModalOpen(true)}
              className="btn btn-primary"
              style={{ padding: "0.55rem 1.1rem", fontSize: "0.85rem" }}
            >
              + Görev Ekle
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "1.25rem",
            marginBottom: "2rem",
          }}
        >
          <div className="glass-card" style={{ padding: "1.25rem" }}>
            <div style={{ color: "var(--text-muted)", fontSize: "0.8rem", fontWeight: 600, textTransform: "uppercase" }}>
              Toplam Görev
            </div>
            <div style={{ fontSize: "2rem", fontWeight: 800, marginTop: "0.4rem", color: "var(--text-primary)" }}>
              {totalTasks}
            </div>
            <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginTop: "0.2rem" }}>
              Kayıtlı tüm işler
            </div>
          </div>

          <div className="glass-card" style={{ padding: "1.25rem" }}>
            <div style={{ color: "var(--text-muted)", fontSize: "0.8rem", fontWeight: 600, textTransform: "uppercase" }}>
              Devam Eden
            </div>
            <div style={{ fontSize: "2rem", fontWeight: 800, marginTop: "0.4rem", color: "var(--accent-firebase)" }}>
              {inProgressTasks}
            </div>
            <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginTop: "0.2rem" }}>
              Şu an üzerinde çalışılan
            </div>
          </div>

          <div className="glass-card" style={{ padding: "1.25rem" }}>
            <div style={{ color: "var(--text-muted)", fontSize: "0.8rem", fontWeight: 600, textTransform: "uppercase" }}>
              Tamamlanan
            </div>
            <div style={{ fontSize: "2rem", fontWeight: 800, marginTop: "0.4rem", color: "var(--accent-emerald)" }}>
              {completedTasks}
            </div>
            <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginTop: "0.2rem" }}>
              {totalTasks > 0 ? `%${Math.round((completedTasks / totalTasks) * 100)} tamamlanma oranı` : "0%"}
            </div>
          </div>

          <div className="glass-card" style={{ padding: "1.25rem" }}>
            <div style={{ color: "var(--text-muted)", fontSize: "0.8rem", fontWeight: 600, textTransform: "uppercase" }}>
              Aktif Projeler
            </div>
            <div style={{ fontSize: "2rem", fontWeight: 800, marginTop: "0.4rem", color: "var(--accent-cyan)" }}>
              {projects.length}
            </div>
            <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginTop: "0.2rem" }}>
              Yönetilen çalışma alanı
            </div>
          </div>
        </div>

        {/* Two Column Layout: Tasks & Projects */}
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "1.75rem", alignItems: "start" }}>
          {/* Recent Tasks */}
          <div className="glass-card" style={{ padding: "1.5rem" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "1.25rem",
              }}
            >
              <div>
                <h2 style={{ fontSize: "1.15rem", fontWeight: 700 }}>Son Görevler</h2>
                <p style={{ color: "var(--text-secondary)", fontSize: "0.8rem" }}>
                  Hızlı durum güncellemesi ve görev listesi
                </p>
              </div>
              <Link
                href="/tasks"
                className="btn btn-secondary"
                style={{ padding: "0.35rem 0.75rem", fontSize: "0.8rem" }}
              >
                Panoyu Aç →
              </Link>
            </div>

            {tasks.length === 0 ? (
              <div
                style={{
                  padding: "2rem",
                  textAlign: "center",
                  color: "var(--text-muted)",
                  border: "1px dashed var(--border-subtle)",
                  borderRadius: "0.6rem",
                }}
              >
                Henüz bir görev bulunmuyor. Yeni bir görev ekleyerek başlayabilirsiniz.
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                {tasks.slice(0, 5).map((task) => (
                  <div
                    key={task.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "0.85rem 1rem",
                      background: "rgba(255,255,255,0.02)",
                      borderRadius: "0.6rem",
                      border: "1px solid var(--border-subtle)",
                      transition: "all 0.2s",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "0.85rem", flex: 1, minWidth: 0 }}>
                      <input
                        type="checkbox"
                        checked={task.status === "done"}
                        onChange={() => handleToggleStatus(task.id, task.status)}
                        style={{
                          width: "18px",
                          height: "18px",
                          cursor: "pointer",
                          accentColor: "var(--accent-firebase)",
                        }}
                      />
                      <div style={{ minWidth: 0 }}>
                        <div
                          style={{
                            fontSize: "0.925rem",
                            fontWeight: 500,
                            textDecoration: task.status === "done" ? "line-through" : "none",
                            color: task.status === "done" ? "var(--text-muted)" : "var(--text-primary)",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {task.title}
                        </div>
                        {task.dueDate && (
                          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.15rem" }}>
                            📅 Son Tarih: {task.dueDate}
                          </div>
                        )}
                      </div>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                      <span
                        style={{
                          fontSize: "0.75rem",
                          padding: "0.2rem 0.5rem",
                          borderRadius: "0.3rem",
                          fontWeight: 600,
                          background:
                            task.priority === "high"
                              ? "rgba(244, 63, 94, 0.15)"
                              : task.priority === "medium"
                              ? "rgba(245, 158, 11, 0.15)"
                              : "rgba(16, 185, 129, 0.15)",
                          color:
                            task.priority === "high"
                              ? "#fb7185"
                              : task.priority === "medium"
                              ? "#fbbf24"
                              : "#34d399",
                        }}
                      >
                        {task.priority === "high" ? "Yüksek" : task.priority === "medium" ? "Orta" : "Düşük"}
                      </span>

                      <button
                        onClick={() => handleDeleteTask(task.id)}
                        style={{
                          background: "transparent",
                          border: "none",
                          color: "var(--text-muted)",
                          cursor: "pointer",
                          padding: "0.2rem",
                        }}
                        title="Sil"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Projects Summary */}
          <div className="glass-card" style={{ padding: "1.5rem" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "1.25rem",
              }}
            >
              <div>
                <h2 style={{ fontSize: "1.15rem", fontWeight: 700 }}>Projeler</h2>
                <p style={{ color: "var(--text-secondary)", fontSize: "0.8rem" }}>
                  Aktif projeleriniz
                </p>
              </div>
              <Link
                href="/projects"
                className="btn btn-secondary"
                style={{ padding: "0.35rem 0.75rem", fontSize: "0.8rem" }}
              >
                Tümü →
              </Link>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {projects.map((proj) => (
                <div
                  key={proj.id}
                  style={{
                    padding: "1rem",
                    borderRadius: "0.6rem",
                    background: "rgba(255,255,255,0.02)",
                    border: "1px solid var(--border-subtle)",
                    borderLeft: `4px solid ${proj.color || "var(--accent-indigo)"}`,
                  }}
                >
                  <div style={{ fontWeight: 600, fontSize: "0.95rem", marginBottom: "0.25rem" }}>
                    {proj.title}
                  </div>
                  <div style={{ color: "var(--text-secondary)", fontSize: "0.8rem", lineHeight: 1.4 }}>
                    {proj.description}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Modals */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        onSubmit={handleCreateTask}
        projects={projects}
      />
      <ProjectModal
        isOpen={isProjectModalOpen}
        onClose={() => setIsProjectModalOpen(false)}
        onSubmit={handleCreateProject}
      />
    </div>
  );
}
