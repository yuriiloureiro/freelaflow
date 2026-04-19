"use client";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useProjectStore } from "@/store/useProjectStore";
import { TaskStatus } from "@/store/useProjectStore";
import {
  ArrowLeft,
  Calendar,
  DollarSign,
  Clock,
  CheckCircle2,
  Plus,
  Trash2,
  Tag,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ProjectDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { projects, addTask, updateTaskStatus, deleteProject, updateProject } =
    useProjectStore();

  const [newTaskTitle, setNewTaskTitle] = useState("");
  const project = projects.find((p) => p.id === id);

  if (!project)
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-zinc-500 animate-pulse">
          Carregando detalhes do projeto...
        </p>
      </div>
    );

  const handleMarkAsPaid = async () => {
    if (project.status === "paid") return;
    const confirmed = confirm(
      "Deseja marcar este projeto como LIQUIDADO? Isso atualizará seu faturamento no financeiro.",
    );
    if (confirmed) {
      await updateProject(project.id, {
        status: "paid",
        paidAt: new Date().toISOString(),
      });
    }
  };

  const handleDelete = async () => {
    if (confirm("Tem certeza que deseja excluir este projeto?")) {
      await deleteProject(project.id);
      router.push("/projects");
    }
  };

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    await addTask(project.id, newTaskTitle);
    setNewTaskTitle("");
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors group"
        >
          <ArrowLeft
            size={20}
            className="group-hover:-translate-x-1 transition-transform"
          />
          Voltar para lista
        </button>

        <button
          onClick={handleDelete}
          className="text-zinc-700 hover:text-red-500 transition-colors p-2"
          title="Excluir projeto"
        >
          <Trash2 size={20} />
        </button>
      </div>

      {/* Grid Principal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content: Kanban */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header + Form */}
          <div className="flex items-center justify-between bg-[#121214] border border-zinc-800/50 p-6 rounded-[24px]">
            <h2 className="text-lg font-bold flex items-center gap-3">
              <CheckCircle2 className="text-indigo-500" size={20} />
              Quadro de Tarefas
            </h2>
            <form onSubmit={handleAddTask} className="flex gap-2">
              <input
                type="text"
                placeholder="Nova tarefa..."
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                className="bg-[#0a0a0b] border border-zinc-800 text-xs text-white rounded-lg px-4 py-2 focus:border-indigo-500 outline-none w-48 transition-all"
              />
              <button
                type="submit"
                className="bg-indigo-600 p-2 rounded-lg hover:bg-indigo-500 transition-colors"
              >
                <Plus size={16} />
              </button>
            </form>
          </div>

          {/* Colunas Kanban */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {(["todo", "doing", "done"] as const).map((status) => (
              <div key={status} className="space-y-4">
                {/* Header da Coluna */}
                <div className="flex items-center gap-2 px-2">
                  <div
                    className={`w-1.5 h-1.5 rounded-full ${
                      status === "todo"
                        ? "bg-zinc-500"
                        : status === "doing"
                          ? "bg-amber-500"
                          : "bg-emerald-500"
                    }`}
                  />
                  <h3 className="text-[10px] uppercase font-bold tracking-widest text-zinc-500">
                    {status === "todo"
                      ? "A fazer"
                      : status === "doing"
                        ? "Fazendo"
                        : "Concluído"}
                  </h3>
                  <span className="text-[10px] text-zinc-700 bg-zinc-900 px-1.5 py-0.5 rounded ml-auto font-mono">
                    {project.tasks.filter((t) => t.status === status).length}
                  </span>
                </div>

                {/* Cards */}
                <div className="space-y-3 min-h-[100px]">
                  <AnimatePresence mode="popLayout">
                    {project.tasks
                      .filter((t) => t.status === status)
                      .map((task) => (
                        <motion.div
                          key={task.id}
                          layout
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          className="bg-[#121214] border border-zinc-800/50 p-4 rounded-xl group hover:border-indigo-500/30 transition-all"
                        >
                          <p
                            className={`text-xs mb-4 transition-all ${
                              task.status === "done"
                                ? "text-zinc-500/50 line-through italic"
                                : "text-zinc-200 font-medium"
                            }`}
                          >
                            {task.title}
                          </p>

                          <div className="flex items-center justify-between pt-3 border-t border-zinc-900 group-hover:border-zinc-800 transition-all">
                            <select
                              value={task.status}
                              onChange={(e) =>
                                updateTaskStatus(
                                  project.id,
                                  task.id,
                                  e.target.value as TaskStatus,
                                )
                              }
                              className="bg-transparent text-[10px] text-zinc-600 hover:text-indigo-400 outline-none cursor-pointer uppercase font-bold tracking-tighter"
                            >
                              <option value="todo">Mover: Todo</option>
                              <option value="doing">Mover: Doing</option>
                              <option value="done">Mover: Done</option>
                            </select>
                          </div>
                        </motion.div>
                      ))}
                  </AnimatePresence>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* FIM Main Content */}

        {/* Sidebar: Detalhes */}
        <div className="space-y-6">
          <div className="bg-[#121214] border border-zinc-800/50 rounded-[32px] p-8">
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold text-white mb-2">
                  {project.name}
                </h1>
                <p className="text-zinc-500 text-sm flex items-center gap-2">
                  <Tag size={14} className="text-zinc-700" />
                  {project.client}
                </p>
              </div>

              <div className="pt-6 border-t border-zinc-800/50 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-zinc-500">
                    <DollarSign size={18} className="text-zinc-700" />
                    <span className="text-sm">Valor</span>
                  </div>
                  <span className="font-bold text-emerald-500">
                    {new Intl.NumberFormat("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    }).format(project.value)}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-zinc-500">
                    <Calendar size={18} className="text-zinc-700" />
                    <span className="text-sm">Prazo</span>
                  </div>
                  <span className="font-medium text-zinc-300">
                    {project.deadline || "S/ prazo"}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-zinc-500">
                    <Clock size={18} className="text-zinc-700" />
                    <span className="text-sm">Criado em</span>
                  </div>
                  <span className="font-medium text-zinc-400 text-xs">
                    {new Date(project.createdAt).toLocaleDateString()}
                  </span>
                </div>

                {/* Botão de Liquidação */}
                <div className="pt-4">
                  {project.status === "paid" ? (
                    <div className="w-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 py-3 rounded-2xl flex items-center justify-center gap-2 font-bold text-xs uppercase tracking-widest">
                      <CheckCircle2 size={16} />
                      Projeto Pago
                    </div>
                  ) : (
                    <button
                      onClick={handleMarkAsPaid}
                      className="w-full bg-zinc-900 hover:bg-emerald-600 border border-zinc-800 hover:border-emerald-500 text-zinc-400 hover:text-white py-4 rounded-2xl flex items-center justify-center gap-2 font-bold text-xs uppercase tracking-widest transition-all group"
                    >
                      <DollarSign
                        size={16}
                        className="group-hover:scale-125 transition-transform"
                      />
                      Marcar como Pago
                    </button>
                  )}
                </div>
              </div>

              <div className="pt-6 border-t border-zinc-800/50">
                <p className="text-zinc-600 text-[10px] uppercase font-bold tracking-widest mb-3">
                  Descrição
                </p>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  {project.description || "Nenhuma descrição informada."}
                </p>
              </div>
            </div>
          </div>
        </div>
        {/* FIM Sidebar */}
      </div>
      {/* FIM Grid Principal */}
    </div>
  );
}
