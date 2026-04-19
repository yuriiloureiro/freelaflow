"use client";
import { useState } from "react";
import { useProjectStore } from "@/store/useProjectStore";
import {
  Search,
  Filter,
  Plus,
  ChevronRight,
  Calendar,
  DollarSign,
  Tag,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import NewProjectModal from "@/components/projects/NewProjectModal";
import Link from "next/link";

const STATUS_COLORS: Record<string, string> = {
  planning: "bg-amber-500/10 text-amber-500 border-amber-500/20",
  in_progress: "bg-indigo-500/10 text-indigo-500 border-indigo-500/20",
  done: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  paid: "bg-zinc-500/10 text-zinc-400 border-zinc-500/10",
};

const STATUS_LABELS: Record<string, string> = {
  planning: "Planejamento",
  in_progress: "Em Andamento",
  done: "Concluído",
  paid: "Pago",
};

export default function ProjectsPage() {
  const { projects } = useProjectStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Lógica de Filtro e Busca
  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.client.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || project.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header Interativo */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Seus Projetos</h1>
          <p className="text-zinc-500 mt-1 text-sm">
            Gerencie e acompanhe todos os seus jobs em um só lugar.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20"
        >
          <Plus size={20} />
          Novo Projeto
        </button>
      </div>

      {/* Barra de Ferramentas (Busca + Filtros) */}
      <div className="bg-[#121214] border border-zinc-800/50 p-4 rounded-2xl flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600"
            size={18}
          />
          <input
            type="text"
            placeholder="Buscar por nome ou cliente..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#0a0a0b] border border-zinc-800 text-white rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter className="text-zinc-600 mr-2" size={18} />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="flex-1 md:w-48 bg-[#0a0a0b] border border-zinc-800 text-zinc-400 rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500 transition-colors"
          >
            <option value="all">Todos os status</option>
            <option value="planning">Planejamento</option>
            <option value="in_progress">Em Andamento</option>
            <option value="done">Concluído</option>
            <option value="paid">Pago</option>
          </select>
        </div>
      </div>

      {/* Grid de Projetos */}
      <div className="grid grid-cols-1 gap-4">
        <AnimatePresence mode="popLayout">
          {filteredProjects.length > 0 ? (
            filteredProjects.map((project) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="group relative bg-[#121214] border border-zinc-800/50 hover:border-indigo-500/30 rounded-2xl transition-all overflow-hidden"
              >
                <Link href={`/projects/${project.id}`} className="block p-5">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <h3 className="text-lg font-bold text-white group-hover:text-indigo-400 transition-colors">
                          {project.name}
                        </h3>
                        <span
                          className={`text-[10px] uppercase tracking-widest font-bold px-2 py-0.5 rounded border ${STATUS_COLORS[project.status]}`}
                        >
                          {STATUS_LABELS[project.status]}
                        </span>
                      </div>
                      <p className="text-zinc-500 text-sm flex items-center gap-2">
                        <Tag size={14} className="text-zinc-700" />
                        {project.client}
                      </p>
                    </div>

                    <div className="flex items-center gap-8 md:gap-12 text-sm text-zinc-400">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                          <DollarSign size={16} />
                        </div>
                        <div>
                          <p className="text-[10px] text-zinc-600 uppercase font-bold tracking-tighter leading-none">
                            Valor
                          </p>
                          <p className="font-medium text-zinc-300">
                            {new Intl.NumberFormat("pt-BR", {
                              style: "currency",
                              currency: "BRL",
                            }).format(project.value)}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-500">
                          <Calendar size={16} />
                        </div>
                        <div>
                          <p className="text-[10px] text-zinc-600 uppercase font-bold tracking-tighter leading-none">
                            Prazo
                          </p>
                          <p className="font-medium text-zinc-300">
                            {project.deadline || "S/ prazo"}
                          </p>
                        </div>
                      </div>

                      <ChevronRight
                        className="text-zinc-700 group-hover:text-indigo-500 transition-all translate-x-0 group-hover:translate-x-1"
                        size={20}
                      />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-20 bg-[#121214] border border-zinc-800/30 border-dashed rounded-[32px]">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-zinc-900 rounded-full mb-4">
                <Search size={32} className="text-zinc-700" />
              </div>
              <h2 className="text-xl font-bold text-zinc-400">
                Nenhum projeto encontrado
              </h2>
              <p className="text-zinc-600">
                Tente mudar os filtros ou criar um novo job.
              </p>
            </div>
          )}
        </AnimatePresence>
      </div>

      <NewProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
