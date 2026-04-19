"use client";
import { useProjectStore } from "@/store/useProjectStore";
import {
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle2,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { motion } from "framer-motion";

export default function FinanceiroPage() {
  const { projects } = useProjectStore();

  const totalRecebido = projects
    .filter((p) => p.status === "paid")
    .reduce((acc, p) => acc + p.value, 0);

  const totalPendente = projects
    .filter((p) => p.status !== "paid")
    .reduce((acc, p) => acc + p.value, 0);

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(val);

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-10">
      <header>
        <h1 className="text-3xl font-bold text-white">Gestão Financeira</h1>
        <p className="text-zinc-500 mt-1">
          Visão detalhada de faturamento e recebimentos.
        </p>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-[#121214] border border-zinc-800/50 p-6 rounded-[32px] space-y-4">
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500">
              <TrendingUp size={24} />
            </div>
            <span className="text-emerald-500 bg-emerald-500/5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
              Recebido
            </span>
          </div>
          <div>
            <p className="text-zinc-500 text-sm font-medium">
              Faturamento Total
            </p>
            <h2 className="text-3xl font-bold text-white mt-1">
              {formatCurrency(totalRecebido)}
            </h2>
          </div>
        </div>

        <div className="bg-[#121214] border border-zinc-800/50 p-6 rounded-[32px] space-y-4">
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 bg-amber-500/10 rounded-2xl flex items-center justify-center text-amber-500">
              <Clock size={24} />
            </div>
            <span className="text-amber-500 bg-amber-500/5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
              A receber
            </span>
          </div>
          <div>
            <p className="text-zinc-500 text-sm font-medium">
              Aguardando Pagamento
            </p>
            <h2 className="text-3xl font-bold text-white mt-1">
              {formatCurrency(totalPendente)}
            </h2>
          </div>
        </div>

        <div className="bg-indigo-600 p-6 rounded-[32px] space-y-4 shadow-xl shadow-indigo-600/20">
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-white">
              <DollarSign size={24} />
            </div>
          </div>
          <div>
            <p className="text-indigo-200 text-sm font-medium">
              Volume Total em Projetos
            </p>
            <h2 className="text-3xl font-bold text-white mt-1">
              {formatCurrency(totalRecebido + totalPendente)}
            </h2>
          </div>
        </div>
      </div>

      {/* Histórico/Lista Financeira */}
      <div className="bg-[#121214] border border-zinc-800/50 rounded-[32px] overflow-hidden">
        <div className="p-8 border-b border-zinc-900 flex items-center justify-between">
          <h3 className="font-bold text-lg">Histórico de Movimentações</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-900 bg-zinc-900/20">
                <th className="px-8 py-4 text-[10px] font-bold uppercase text-zinc-500 tracking-widest">
                  Projeto / Cliente
                </th>
                <th className="px-8 py-4 text-[10px] font-bold uppercase text-zinc-500 tracking-widest text-center">
                  Data
                </th>
                <th className="px-8 py-4 text-[10px] font-bold uppercase text-zinc-500 tracking-widest text-center">
                  Status
                </th>
                <th className="px-8 py-4 text-[10px] font-bold uppercase text-zinc-500 tracking-widest text-right">
                  Valor
                </th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project) => (
                <tr
                  key={project.id}
                  className="border-b border-zinc-900 last:border-0 hover:bg-zinc-900/30 transition-colors group"
                >
                  <td className="px-8 py-5">
                    <div>
                      <p className="text-white font-medium group-hover:text-indigo-400 transition-colors">
                        {project.name}
                      </p>
                      <p className="text-zinc-600 text-xs">{project.client}</p>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-center text-zinc-500 text-sm">
                    {new Date(project.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex justify-center">
                      <span
                        className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase border ${
                          project.status === "paid"
                            ? "text-emerald-500 border-emerald-500/20 bg-emerald-500/5"
                            : "text-zinc-500 border-zinc-800 bg-zinc-900"
                        }`}
                      >
                        {project.status === "paid" ? "Liquidado" : "Em Aberto"}
                      </span>
                    </div>
                  </td>
                  <td
                    className={`px-8 py-5 text-right font-bold ${project.status === "paid" ? "text-white" : "text-zinc-500"}`}
                  >
                    {formatCurrency(project.value)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {projects.length === 0 && (
            <div className="p-20 text-center text-zinc-600">
              <DollarSign className="mx-auto mb-4 opacity-10" size={48} />
              Nenhum registro financeiro encontrado.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
