import { create } from "zustand";
import { persist } from "zustand/middleware";
import { db } from "../lib/firebase";
import {
  updateDoc,
  deleteDoc,
  doc,
  setDoc,
  getDocs,
  collection,
} from "firebase/firestore";

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
  paidAt?: string;
}

interface ProjectState {
  projects: Project[];
  fetchProjects: () => Promise<void>;
  addProject: (project: Project) => Promise<void>;
  updateProject: (
    id: string,
    updatedProject: Partial<Project>,
  ) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  addTask: (projectId: string, title: string) => Promise<void>;
  toggleTask: (projectId: string, taskId: string) => Promise<void>;
  updateTaskStatus: (
    projectId: string,
    taskId: string,
    newStatus: TaskStatus,
  ) => Promise<void>;
}

export const useProjectStore = create<ProjectState>()(
  persist(
    (set, get) => ({
      projects: [],

      fetchProjects: async () => {
        const querySnapshot = await getDocs(collection(db, "projects"));
        const projectsData = querySnapshot.docs.map(
          (doc) => doc.data() as Project,
        );
        set({ projects: projectsData });
      },

      addProject: async (project: Project) => {
        await setDoc(doc(db, "projects", project.id), project);
        set((state) => ({ projects: [...state.projects, project] }));
      },

      updateProject: async (id: string, updatedProject: Partial<Project>) => {
        const projectRef = doc(db, "projects", id);
        await updateDoc(projectRef, updatedProject as { [x: string]: unknown });
        set((state) => ({
          projects: state.projects.map(
            (p): Project => (p.id === id ? { ...p, ...updatedProject } : p),
          ),
        }));
      },

      deleteProject: async (id: string) => {
        await deleteDoc(doc(db, "projects", id));
        set((state) => ({
          projects: state.projects.filter((p) => p.id !== id),
        }));
      },

      addTask: async (projectId: string, title: string) => {
        const newTask: Task = {
          id: crypto.randomUUID(),
          title,
          status: "todo",
        };
        const project = get().projects.find((p) => p.id === projectId);

        if (project) {
          const updatedTasks = [...project.tasks, newTask];
          await updateDoc(doc(db, "projects", projectId), {
            tasks: updatedTasks,
          });
          set((state) => ({
            projects: state.projects.map(
              (p): Project =>
                p.id === projectId ? { ...p, tasks: updatedTasks } : p,
            ),
          }));
        }
      },

      toggleTask: async (projectId: string, taskId: string) => {
        const project = get().projects.find((p) => p.id === projectId);

        if (project) {
          const updatedTasks = project.tasks.map(
            (t): Task =>
              t.id === taskId
                ? { ...t, status: t.status === "done" ? "todo" : "done" }
                : t,
          );

          await updateDoc(doc(db, "projects", projectId), {
            tasks: updatedTasks,
          });

          set((state) => ({
            projects: state.projects.map(
              (p): Project =>
                p.id === projectId ? { ...p, tasks: updatedTasks } : p,
            ),
          }));
        }
      },

      updateTaskStatus: async (
        projectId: string,
        taskId: string,
        newStatus: TaskStatus,
      ) => {
        const project = get().projects.find((p) => p.id === projectId);

        if (project) {
          const updatedTasks = project.tasks.map(
            (t): Task => (t.id === taskId ? { ...t, status: newStatus } : t),
          );

          await updateDoc(doc(db, "projects", projectId), {
            tasks: updatedTasks,
          });

          set((state) => ({
            projects: state.projects.map(
              (p): Project =>
                p.id === projectId ? { ...p, tasks: updatedTasks } : p,
            ),
          }));
        }
      },
    }),
    {
      name: "freelaflow-storage",
    },
  ),
);
