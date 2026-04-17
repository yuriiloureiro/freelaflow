"use client";
import { useState } from "react";
import { useProjectStore } from "@/store/useProjectStore";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Calendar,
  DollarSign,
  Clock,
  CheckCircle,
  Wallet,
  Plus,
  Check,
} from "lucide-react";

const statusConfig = {
  planning: {
    label: "Planejamento",
    color: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
  },
  in_progress: {
    label: "Em Andamento",
    color: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  },
  done: {
    label: "Finalizado",
    color: "bg-green-500/10 text-green-400 border-green-500/20",
  },
  paid: {
    label: "Pago",
    color: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  },
};

export default function ProjectPage() {
  const { id } = useParams();
  const router = useRouter();
  const { projects, updateProject, addTask, toggleTask } = useProjectStore();
  const [newTask, setNewTask] = useState("");

  const project = projects.find((p) => p.id === id);

  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-zinc-400">
        <p className="text-xl font-semibold">Projeto não encontrado.</p>
        <button
          onClick={() => router.push("/")}
          className="mt-4 text-indigo-400 underline hover:text-indigo-300 transition-colors"
        >
          Voltar ao Dashboard
        </button>
      </div>
    );
  }

  const status = statusConfig[project.status];
  const completedTasks = project.tasks.filter(
    (t) => t.status === "done",
  ).length;

  const handleAddTask = () => {
    if (newTask.trim()) {
      addTask(project.id, newTask.trim());
      setNewTask("");
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-20">
      {/* Botão Voltar */}
      <motion.button
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={() => router.push("/")}
        className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors mb-8 group"
      >
        <ArrowLeft
          size={18}
          className="group-hover:-translate-x-1 transition-transform"
        />
        Voltar ao Dashboard
      </motion.button>

      {/* Título e Status */}
      <motion.header
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12"
      >
        <div>
          <h1 className="text-4xl font-extrabold text-white tracking-tight">
            {project.name}
          </h1>
          <p className="text-zinc-500 text-lg mt-2 font-medium">
            {project.client}
          </p>
        </div>
        <div
          className={`flex items-center gap-2 px-4 py-2 rounded-xl border font-bold text-sm w-fit ${status.color}`}
        >
          {status.label}
        </div>
      </motion.header>

      {/* Cards de Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8"
      >
        <div className="bg-[#121214]/80 backdrop-blur-md border border-[#27272a] p-6 rounded-2xl hover:border-zinc-700 transition-all">
          <div className="flex items-center gap-2 text-zinc-500 text-sm mb-3">
            <DollarSign size={16} className="text-green-500" />
            Valor acordado
          </div>
          <p className="text-3xl font-bold text-white">
            R$ {project.value.toLocaleString()}
          </p>
        </div>

        <div className="bg-[#121214]/80 backdrop-blur-md border border-[#27272a] p-6 rounded-2xl hover:border-zinc-700 transition-all">
          <div className="flex items-center gap-2 text-zinc-500 text-sm mb-3">
            <Calendar size={16} className="text-blue-500" />
            Criado em
          </div>
          <p className="text-3xl font-bold text-white">
            {new Date(project.createdAt).toLocaleDateString("pt-BR", {
              day: "2-digit",
              month: "short",
            })}
          </p>
        </div>
      </motion.div>

      {/* Descrição */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="bg-[#121214]/80 backdrop-blur-md border border-[#27272a] p-8 rounded-3xl mb-8"
      >
        <h2 className="text-xs font-bold text-zinc-500 uppercase tracking-[0.2em] mb-4">
          Sobre o Projeto
        </h2>
        <p className="text-zinc-300 leading-relaxed text-lg">
          {project.description || "Nenhuma descrição fornecida."}
        </p>
      </motion.div>

      {/* Mudar Status */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-[#121214]/80 backdrop-blur-md border border-[#27272a] p-8 rounded-3xl mb-8"
      >
        <h2 className="text-xs font-bold text-zinc-500 uppercase tracking-[0.2em] mb-6">
          Status do Projeto
        </h2>
        <div className="flex flex-wrap gap-3">
          {(Object.keys(statusConfig) as Array<keyof typeof statusConfig>).map(
            (key) => (
              <button
                key={key}
                onClick={() => updateProject(project.id, { status: key })}
                className={`px-6 py-3 rounded-xl text-sm font-bold border transition-all active:scale-95 ${
                  project.status === key
                    ? statusConfig[key].color
                    : "bg-transparent border-[#27272a] text-zinc-600 hover:border-zinc-500 hover:text-zinc-300"
                }`}
              >
                {statusConfig[key].label}
              </button>
            ),
          )}
        </div>
      </motion.div>

      {/* Checklist de Tarefas */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="bg-[#121214]/80 backdrop-blur-md border border-[#27272a] p-8 rounded-3xl"
      >
        <h2 className="text-xs font-bold text-zinc-500 uppercase tracking-[0.2em] mb-6 flex items-center justify-between">
          Checklist
          {project.tasks.length > 0 && (
            <span
              className={`transition-all duration-500 normal-case font-semibold text-sm ${
                completedTasks === project.tasks.length &&
                project.tasks.length > 0
                  ? "text-green-400 drop-shadow-[0_0_8px_rgba(74,222,128,0.4)]"
                  : "text-indigo-400"
              }`}
            >
              {completedTasks === project.tasks.length &&
              project.tasks.length > 0
                ? "✓ Tudo pronto!"
                : `${completedTasks} de ${project.tasks.length} concluídas`}
            </span>
          )}
        </h2>

        {/* Input nova tarefa */}
        <div className="flex gap-3 mb-6">
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddTask()}
            placeholder="Nova tarefa... (Enter para adicionar)"
            className="flex-1 bg-[#09090b] border border-[#27272a] rounded-xl px-4 py-3 text-white placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500 transition-all text-sm"
          />
          <motion.button
            onClick={handleAddTask}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-indigo-600 hover:bg-indigo-500 text-white p-3 rounded-xl transition-all"
          >
            <Plus size={20} />
          </motion.button>
        </div>

        {/* Lista de tarefas */}
        <div className="space-y-3">
          {project.tasks.length > 0 ? (
            project.tasks.map((task) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => toggleTask(project.id, task.id)}
                className="flex items-center gap-4 p-4 bg-[#09090b]/70 backdrop-blur-sm border border-[#27272a] rounded-xl cursor-pointer hover:border-zinc-700 transition-all group"
              >
                <motion.div
                  layout
                  className={`w-6 h-6 rounded-md border flex items-center justify-center flex-shrink-0 transition-all ${
                    task.status === "done"
                      ? "bg-indigo-600 border-indigo-600"
                      : "border-zinc-600 group-hover:border-zinc-400"
                  }`}
                >
                  {task.status === "done" && (
                    <Check size={14} className="text-white" />
                  )}
                </motion.div>
                <span
                  className={`text-sm transition-all ${
                    task.status === "done"
                      ? "line-through text-zinc-600"
                      : "text-zinc-300"
                  }`}
                >
                  {task.title}
                </span>
              </motion.div>
            ))
          ) : (
            <p className="text-zinc-600 text-sm text-center py-6">
              Nenhuma tarefa ainda. Adicione a primeira acima. ☝️
            </p>
          )}
        </div>
      </motion.div>
    </div>
  );
}
