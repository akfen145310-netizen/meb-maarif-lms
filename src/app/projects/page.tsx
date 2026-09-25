"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Navigation from "@/components/Navigation";
import ProjectModal from "@/components/ProjectModal";
import { useAuth } from "@/context/AuthContext";
import {
  createProject,
  deleteProject,
  subscribeProjects,
} from "@/lib/firebase/projectsService";
import { subscribeTasks } from "@/lib/firebase/tasksService";
import type { Project, TaskItem } from "@/types";

const INITIAL_PROJECTS: Project[] = [
  {
    id: "proj-1",
    title: "Web Platformu v1.0",
    description: "Next.js 16 ve Firebase ile geliştirilen ana SaaS ürünü ve kullanıcı panelleri.",
    color: "#6366f1",
    ownerId: "demo",
  },
  {
    id: "proj-2",
    title: "Mobil API & Entegrasyon",
    description: "Firebase Functions ve Cloud Firestore güvenlik kuralları yapılandırması.",
    color: "#ff9100",
    ownerId: "demo",
  },
  {
    id: "proj-3",
    title: "Pazarlama & Lansman",
    description: "Kullanıcı edinim stratejileri, SEO çalışmaları ve e-posta bildirimleri.",
    color: "#06b6d4",
    ownerId: "demo",
  },
];

export default function ProjectsPage() {
  const { user, isConfigured } = useAuth();
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (!isConfigured || !user) return;

    const unsubProjects = subscribeProjects(user.uid, (fetched) => {
      setProjects(fetched.length > 0 ? fetched : []);
    });

    const unsubTasks = subscribeTasks(user.uid, (fetchedTasks) => {
      setTasks(fetchedTasks);
    });

    return () => {
      unsubProjects();
      unsubTasks();
    };
  }, [isConfigured, user]);

  const handleCreateProject = async (projData: {
    title: string;
    description: string;
    color: string;
  }) => {
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
      };
      setProjects([newProj, ...projects]);
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (isConfigured && user) {
      await deleteProject(id);
    } else {
      setProjects(projects.filter((p) => p.id !== id));
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Navigation />

      <main className="container" style={{ flex: 1, padding: "2rem 1.5rem" }}>
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
            <h1 style={{ fontSize: "1.75rem", marginBottom: "0.25rem" }}>Projeler</h1>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>
              Tüm çalışma alanlarınızı ve proje bazlı iş akışlarınızı yönetin.
            </p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="btn btn-primary"
            style={{ padding: "0.55rem 1.1rem", fontSize: "0.85rem" }}
          >
            + Yeni Proje Oluştur
          </button>
        </div>

        {/* Projects Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "1.5rem",
          }}
        >
          {projects.map((proj) => {
            const projectTasks = tasks.filter((t) => t.projectId === proj.id);
            const completed = projectTasks.filter((t) => t.status === "done").length;
            const progress =
              projectTasks.length > 0
                ? Math.round((completed / projectTasks.length) * 100)
                : 0;

            return (
              <div
                key={proj.id}
                className="glass-card"
                style={{
                  padding: "1.5rem",
                  borderLeft: `5px solid ${proj.color || "var(--accent-indigo)"}`,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      marginBottom: "0.6rem",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <span
                        style={{
                          width: "12px",
                          height: "12px",
                          borderRadius: "50%",
                          background: proj.color || "var(--accent-indigo)",
                        }}
                      />
                      <h3 style={{ fontSize: "1.15rem", fontWeight: 700 }}>{proj.title}</h3>
                    </div>

                    <button
                      onClick={() => handleDeleteProject(proj.id)}
                      style={{
                        background: "transparent",
                        border: "none",
                        color: "var(--text-muted)",
                        cursor: "pointer",
                        padding: "0.2rem",
                      }}
                      title="Projeyi Sil"
                    >
                      ✕
                    </button>
                  </div>

                  <p
                    style={{
                      color: "var(--text-secondary)",
                      fontSize: "0.875rem",
                      lineHeight: 1.5,
                      marginBottom: "1.25rem",
                    }}
                  >
                    {proj.description || "Açıklama belirtilmemiş."}
                  </p>
                </div>

                <div>
                  {projectTasks.length > 0 && (
                    <div style={{ marginBottom: "1rem" }}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          fontSize: "0.75rem",
                          color: "var(--text-secondary)",
                          marginBottom: "0.3rem",
                        }}
                      >
                        <span>İlerleme ({completed}/{projectTasks.length})</span>
                        <span>%{progress}</span>
                      </div>
                      <div
                        style={{
                          width: "100%",
                          height: "6px",
                          borderRadius: "3px",
                          background: "rgba(255,255,255,0.06)",
                          overflow: "hidden",
                        }}
                      >
                        <div
                          style={{
                            width: `${progress}%`,
                            height: "100%",
                            background: proj.color || "var(--accent-indigo)",
                            borderRadius: "3px",
                            transition: "width 0.3s ease",
                          }}
                        />
                      </div>
                    </div>
                  )}

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      paddingTop: "0.75rem",
                      borderTop: "1px solid var(--border-subtle)",
                    }}
                  >
                    <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                      {projectTasks.length} Bağlı Görev
                    </span>
                    <Link
                      href="/tasks"
                      style={{
                        fontSize: "0.8rem",
                        color: "var(--accent-cyan)",
                        fontWeight: 600,
                      }}
                    >
                      Görevleri Gör →
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      <ProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateProject}
      />
    </div>
  );
}
