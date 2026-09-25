"use client";

import React, { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import TaskModal from "@/components/TaskModal";
import { useAuth } from "@/context/AuthContext";
import {
  createTask,
  updateTaskStatus,
  deleteTask,
  subscribeTasks,
} from "@/lib/firebase/tasksService";
import { subscribeProjects } from "@/lib/firebase/projectsService";
import type { TaskItem, TaskStatus, TaskPriority, Project } from "@/types";

const INITIAL_TASKS: TaskItem[] = [
  {
    id: "task-1",
    title: "Firebase Güvenlik Kurallarını Yapılandır",
    description: "Cloud Firestore ve Auth kurallarını test modundan canlıya geçir.",
    status: "in_progress",
    priority: "high",
    dueDate: "2026-10-01",
    userId: "demo",
  },
  {
    id: "task-2",
    title: "Kullanıcı Profil Kartı Tasarımı",
    description: "Avatar yükleme ve hesap ayarlarını ekle.",
    status: "todo",
    priority: "medium",
    dueDate: "2026-10-05",
    userId: "demo",
  },
  {
    id: "task-3",
    title: "Next.js 16 & TypeScript Entegrasyonu",
    description: "App Router temel yapısı ve layout bileşenleri kuruldu.",
    status: "done",
    priority: "low",
    dueDate: "2026-09-25",
    userId: "demo",
  },
  {
    id: "task-4",
    title: "Gerçek Zamanlı Veri Dinleyicilerini Test Et",
    description: "Firestore onSnapshot ile anlık senkronizasyon kontrolü yap.",
    status: "todo",
    priority: "high",
    dueDate: "2026-10-02",
    userId: "demo",
  },
  {
    id: "task-5",
    title: "E-posta Doğrulama Akışını Geliştir",
    description: "Kullanıcılara e-posta onay linki gönderimi.",
    status: "in_progress",
    priority: "medium",
    dueDate: "2026-10-10",
    userId: "demo",
  },
];

export default function TasksPage() {
  const { user, isConfigured } = useAuth();
  const [tasks, setTasks] = useState<TaskItem[]>(INITIAL_TASKS);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");

  useEffect(() => {
    if (!isConfigured || !user) return;

    const unsubTasks = subscribeTasks(user.uid, (fetched) => {
      setTasks(fetched.length > 0 ? fetched : []);
    });

    const unsubProjects = subscribeProjects(user.uid, (fetched) => {
      setProjects(fetched);
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

  const handleMoveStatus = async (taskId: string, newStatus: TaskStatus) => {
    if (isConfigured && user) {
      await updateTaskStatus(taskId, newStatus);
    } else {
      setTasks(
        tasks.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
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

  const filteredTasks = tasks.filter((t) => {
    const matchesSearch =
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      (t.description && t.description.toLowerCase().includes(search.toLowerCase()));
    const matchesPriority =
      priorityFilter === "all" || t.priority === priorityFilter;
    return matchesSearch && matchesPriority;
  });

  const columns: { status: TaskStatus; title: string; icon: string; color: string }[] = [
    { status: "todo", title: "Yapılacak", icon: "📌", color: "#6366f1" },
    { status: "in_progress", title: "Devam Ediyor", icon: "⏳", color: "var(--accent-firebase)" },
    { status: "done", title: "Tamamlandı", icon: "✅", color: "var(--accent-emerald)" },
  ];

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Navigation onNewTask={() => setIsTaskModalOpen(true)} />

      <main className="container" style={{ flex: 1, padding: "2rem 1.5rem" }}>
        {/* Header & Filter Controls */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "1rem",
            marginBottom: "1.75rem",
          }}
        >
          <div>
            <h1 style={{ fontSize: "1.75rem", marginBottom: "0.25rem" }}>
              Görev Panosu (Kanban)
            </h1>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>
              İşlerinizi sürükleyin veya durum butonlarıyla organize edin.
            </p>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
            <input
              type="text"
              placeholder="Görevlerde ara..."
              className="input-field"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ width: "220px", padding: "0.5rem 0.85rem" }}
            />

            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="input-field"
              style={{ width: "150px", padding: "0.5rem 0.85rem", cursor: "pointer" }}
            >
              <option value="all">Tüm Öncelikler</option>
              <option value="high">🔴 Yüksek</option>
              <option value="medium">🟡 Orta</option>
              <option value="low">🟢 Düşük</option>
            </select>

            <button
              onClick={() => setIsTaskModalOpen(true)}
              className="btn btn-primary"
              style={{ padding: "0.5rem 1rem", fontSize: "0.85rem" }}
            >
              + Görev Ekle
            </button>
          </div>
        </div>

        {/* Kanban Board Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "1.5rem",
            alignItems: "start",
          }}
        >
          {columns.map((col) => {
            const colTasks = filteredTasks.filter((t) => t.status === col.status);
            return (
              <div
                key={col.status}
                className="glass-card"
                style={{
                  padding: "1.25rem",
                  background: "rgba(15, 21, 37, 0.6)",
                  display: "flex",
                  flexDirection: "column",
                  minHeight: "480px",
                }}
              >
                {/* Column Header */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    paddingBottom: "0.75rem",
                    marginBottom: "1rem",
                    borderBottom: "1px solid var(--border-subtle)",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <span>{col.icon}</span>
                    <span style={{ fontWeight: 700, fontSize: "1rem" }}>{col.title}</span>
                  </div>
                  <span
                    style={{
                      fontSize: "0.75rem",
                      fontWeight: 700,
                      padding: "0.15rem 0.5rem",
                      borderRadius: "9999px",
                      background: "rgba(255,255,255,0.08)",
                      color: "var(--text-secondary)",
                    }}
                  >
                    {colTasks.length}
                  </span>
                </div>

                {/* Column Cards */}
                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", flex: 1 }}>
                  {colTasks.length === 0 ? (
                    <div
                      style={{
                        padding: "2rem 1rem",
                        textAlign: "center",
                        color: "var(--text-muted)",
                        fontSize: "0.85rem",
                        border: "1px dashed var(--border-subtle)",
                        borderRadius: "0.6rem",
                      }}
                    >
                      Bu aşamada görev yok
                    </div>
                  ) : (
                    colTasks.map((task) => (
                      <div
                        key={task.id}
                        style={{
                          padding: "1rem",
                          borderRadius: "0.7rem",
                          background: "rgba(255, 255, 255, 0.03)",
                          border: "1px solid var(--border-subtle)",
                          display: "flex",
                          flexDirection: "column",
                          gap: "0.6rem",
                          boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                        }}
                      >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "0.5rem" }}>
                          <div style={{ fontWeight: 600, fontSize: "0.95rem", lineHeight: 1.35 }}>
                            {task.title}
                          </div>
                          <button
                            onClick={() => handleDeleteTask(task.id)}
                            style={{
                              background: "transparent",
                              border: "none",
                              color: "var(--text-muted)",
                              cursor: "pointer",
                              padding: "0.1rem",
                            }}
                            title="Sil"
                          >
                            ✕
                          </button>
                        </div>

                        {task.description && (
                          <div style={{ color: "var(--text-secondary)", fontSize: "0.825rem", lineHeight: 1.4 }}>
                            {task.description}
                          </div>
                        )}

                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            flexWrap: "wrap",
                            gap: "0.5rem",
                            paddingTop: "0.4rem",
                            borderTop: "1px solid rgba(255,255,255,0.05)",
                          }}
                        >
                          <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                            <span
                              style={{
                                fontSize: "0.7rem",
                                padding: "0.15rem 0.45rem",
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

                            {task.dueDate && (
                              <span style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>
                                📅 {task.dueDate}
                              </span>
                            )}
                          </div>

                          {/* Quick Move Buttons */}
                          <div style={{ display: "flex", gap: "0.3rem" }}>
                            {col.status !== "todo" && (
                              <button
                                onClick={() => handleMoveStatus(task.id, "todo")}
                                style={{
                                  padding: "0.2rem 0.4rem",
                                  borderRadius: "0.3rem",
                                  background: "rgba(255,255,255,0.05)",
                                  border: "1px solid var(--border-subtle)",
                                  color: "var(--text-secondary)",
                                  fontSize: "0.7rem",
                                  cursor: "pointer",
                                }}
                                title="Yapılacak'a taşı"
                              >
                                📌
                              </button>
                            )}

                            {col.status !== "in_progress" && (
                              <button
                                onClick={() => handleMoveStatus(task.id, "in_progress")}
                                style={{
                                  padding: "0.2rem 0.4rem",
                                  borderRadius: "0.3rem",
                                  background: "rgba(255,255,255,0.05)",
                                  border: "1px solid var(--border-subtle)",
                                  color: "var(--text-secondary)",
                                  fontSize: "0.7rem",
                                  cursor: "pointer",
                                }}
                                title="Devam Ediyor'a taşı"
                              >
                                ⏳
                              </button>
                            )}

                            {col.status !== "done" && (
                              <button
                                onClick={() => handleMoveStatus(task.id, "done")}
                                style={{
                                  padding: "0.2rem 0.4rem",
                                  borderRadius: "0.3rem",
                                  background: "rgba(255,255,255,0.05)",
                                  border: "1px solid var(--border-subtle)",
                                  color: "var(--text-secondary)",
                                  fontSize: "0.7rem",
                                  cursor: "pointer",
                                }}
                                title="Tamamlandı'ya taşı"
                              >
                                ✅
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </main>

      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        onSubmit={handleCreateTask}
        projects={projects}
      />
    </div>
  );
}
