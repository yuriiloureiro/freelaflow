"use client";
import { useState, useEffect } from "react";
import { useProjectStore } from "@/store/useProjectStore";
import {
  DollarSign,
  Briefcase,
  CheckCircle,
  Clock,
  Calendar,
} from "lucide-react";
import { motion } from "framer-motion";
import NewProjectModal from "@/components/projects/NewProjectModal";
import Link from "next/link";

export default function Dashboard() {
  const { projects, fetchProjects } = useProjectStore();

  useEffect(() => {
    fetchProjects();
  }, []);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const totalInvoiced = projects
    .filter((p) => p.status === "paid" || p.status === "done")
    .reduce((acc, p) => acc + p.value, 0);

  const now = new Date();
  const currentMonthRevenue = projects
    .filter((p) => p.status === "paid" && p.paidAt)
    .filter((p) => {
      const paidDate = new Date(p.paidAt!);
      return (
        paidDate.getMonth() === now.getMonth() &&
        paidDate.getFullYear() === now.getFullYear()
      );
    })
    .reduce((acc, p) => acc + p.value, 0);

  const activeProjects = projects.filter(
    (p) => p.status === "in_progress",
  ).length;
  const completedProjects = projects.filter(
    (p) => p.status === "done" || p.status === "paid",
  ).length;

  const stats = [
    {
      label: "Total Faturado",
      value: `R$ ${totalInvoiced.toLocaleString()}`,
      icon: <DollarSign className="text-green-500" />,
      color: "bg-green-500/10",
    },
    {
      label: "Projetos Ativos",
      value: activeProjects,
      icon: <Clock className="text-blue-500" />,
      color: "bg-blue-500/10",
    },
    {
      label: "Finalizados",
      value: completedProjects,
      icon: <CheckCircle className="text-indigo-500" />,
      color: "bg-indigo-500/10",
    },
    {
      label: "Total de Clientes",
      value: new Set(projects.map((p) => p.client)).size,
      icon: <Briefcase className="text-zinc-400" />,
      color: "bg-zinc-500/10",
    },
    {
      label: "Faturado este mês",
      value: `R$ ${currentMonthRevenue.toLocaleString()}`,
      icon: <Calendar className="text-purple-500" />,
      color: "bg-purple-500/10",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header com animação */}
      <motion.header
        className="mb-10"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-3xl font-bold text-white tracking-tight">
          Bem-vindo, Yuri 👋
        </h1>
        <p className="text-zinc-400 mt-1">
          Aqui está o resumo dos seus jobs de hoje.
        </p>
      </motion.header>

      {/* Grid de Stats com animação */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            className="bg-[#121214]/80 backdrop-blur-md border border-[#27272a] p-6 rounded-2xl hover:border-indigo-500/40 transition-all cursor-default"
            whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
          >
            <div
              className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center mb-4`}
            >
              {stat.icon}
            </div>
            <p className="text-zinc-400 text-sm font-medium">{stat.label}</p>
            <h3 className="text-2xl font-bold text-white mt-1">{stat.value}</h3>
          </motion.div>
        ))}
      </motion.div>

      {/* Listagem de Projetos ou Empty State */}
      {projects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((project) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-[#121214]/80 backdrop-blur-md border border-[#27272a] p-6 rounded-2xl hover:border-indigo-500/40 transition-all group"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-white group-hover:text-indigo-400 transition-colors">
                    {project.name}
                  </h3>
                  <p className="text-zinc-500 text-sm">{project.client}</p>
                </div>
                <span className="bg-indigo-500/10 text-indigo-400 text-xs font-bold px-3 py-1 rounded-full border border-indigo-500/20">
                  {project.status === "planning"
                    ? "Planejamento"
                    : project.status}
                </span>
              </div>

              <div className="flex justify-between items-end mt-8">
                <div>
                  <p className="text-zinc-500 text-xs mb-1">
                    Valor do contrato
                  </p>
                  <p className="text-white font-bold text-lg">
                    R$ {project.value.toLocaleString()}
                  </p>
                </div>

                {/* ✅ AQUI: Link real no lugar do button */}
                <Link
                  href={`/projects/${project.id}`}
                  className="text-zinc-400 hover:text-white text-sm font-medium underline underline-offset-4 transition-colors"
                >
                  Ver detalhes →
                </Link>
              </div>
            </motion.div>
          ))}

          {/* Card de adicionar novo projeto */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="border-2 border-dashed border-[#27272a] rounded-2xl p-6 flex items-center justify-center text-zinc-500 hover:border-indigo-500/40 hover:text-indigo-400 transition-all"
          >
            + Adicionar novo projeto
          </button>
        </div>
      ) : (
        /* Estado Vazio */
        <motion.div
          className="bg-[#121214]/80 backdrop-blur-md border border-[#27272a] rounded-2xl p-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="max-w-xs mx-auto">
            <div className="w-16 h-16 bg-zinc-800/60 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Briefcase className="w-8 h-8 text-zinc-500" />
            </div>
            <h2 className="text-xl font-semibold text-white">
              Nenhum projeto ainda
            </h2>
            <p className="text-zinc-400 mt-2 mb-6 text-sm leading-relaxed">
              Comece cadastrando seu primeiro cliente para visualizar as
              métricas.
            </p>
            <motion.button
              onClick={() => setIsModalOpen(true)}
              className="bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white px-6 py-2.5 rounded-xl font-medium transition-all shadow-lg shadow-indigo-600/20"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              + Novo Projeto
            </motion.button>
          </div>
        </motion.div>
      )}

      {/* Modal de Novo Projeto */}
      <NewProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
