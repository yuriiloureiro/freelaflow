// store/useProjectStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type ProjectStatus = "planning" | "in_progress" | "done" | "paid";
export type TaskStatus = "todo" | "doing" | "done";

export interface Task {
  id: string;
  title: string;
  status: TaskStatus;
}

export interface Project {
  id: string;
  name: string;
  client: string;
  value: number;
  status: ProjectStatus;
  description: string;
  deadline?: string;
  tasks: Task[];
  createdAt: string;
}

interface ProjectState {
  projects: Project[];
  addProject: (project: Project) => void;
  updateProject: (id: string, updatedProject: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  addTask: (projectId: string, title: string) => void; // ✅ Nova
  toggleTask: (projectId: string, taskId: string) => void; // ✅ Nova
}

export const useProjectStore = create<ProjectState>()(
  persist(
    (set) => ({
      projects: [],

      addProject: (project: Project) =>
        set((state) => ({ projects: [...state.projects, project] })),

      updateProject: (id: string, updatedProject: Partial<Project>) =>
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === id ? { ...p, ...updatedProject } : p,
          ),
        })),

      deleteProject: (id: string) =>
        set((state) => ({
          projects: state.projects.filter((p) => p.id !== id),
        })),

      // ✅ Adiciona uma nova tarefa com status "todo" por padrão
      addTask: (projectId: string, title: string) =>
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === projectId
              ? {
                  ...p,
                  tasks: [
                    ...p.tasks,
                    { id: crypto.randomUUID(), title, status: "todo" },
                  ],
                }
              : p,
          ),
        })),

      // ✅ Alterna entre "todo" e "done" (simples por enquanto)
      toggleTask: (projectId: string, taskId: string) =>
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === projectId
              ? {
                  ...p,
                  tasks: p.tasks.map((t) =>
                    t.id === taskId
                      ? { ...t, status: t.status === "done" ? "todo" : "done" }
                      : t,
                  ),
                }
              : p,
          ),
        })),
    }),
    {
      name: "freelaflow-storage",
    },
  ),
);
