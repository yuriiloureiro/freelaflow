"use client";
import { useAuth } from "@/lib/AuthContext";
import { User, Shield, Palette, Mail, Info } from "lucide-react";

export default function SettingsPage() {
  const { user } = useAuth();

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-white">Configurações</h1>
        <p className="text-zinc-500 mt-1">
          Gerencie sua conta e preferências do sistema.
        </p>
      </header>

      <div className="space-y-6">
        {/* Perfil */}
        <div className="bg-[#121214] border border-zinc-800/50 rounded-[32px] overflow-hidden">
          <div className="p-8 border-b border-zinc-800/50 flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white font-bold text-xl uppercase">
              {user?.email?.charAt(0)}
            </div>
            <div>
              <h3 className="font-bold text-lg">Perfil do Desenvolvedor</h3>
              <p className="text-zinc-500 text-sm">{user?.email}</p>
            </div>
          </div>

          <div className="p-8 space-y-6">
            <div className="flex items-center justify-between py-4 border-b border-zinc-900">
              <div className="flex items-center gap-3">
                <Mail size={18} className="text-zinc-600" />
                <span className="text-zinc-400 text-sm font-medium">
                  Email de Acesso
                </span>
              </div>
              <span className="text-white text-sm font-mono">
                {user?.email}
              </span>
            </div>

            <div className="flex items-center justify-between py-4 border-b border-zinc-900">
              <div className="flex items-center gap-3">
                <Shield size={18} className="text-zinc-600" />
                <span className="text-zinc-400 text-sm font-medium">
                  Status da Conta
                </span>
              </div>
              <span className="text-emerald-500 text-[10px] font-bold uppercase bg-emerald-500/10 px-2 py-1 rounded">
                Ativa / Pro
              </span>
            </div>

            <div className="flex items-center justify-between py-4">
              <div className="flex items-center gap-3">
                <Palette size={18} className="text-zinc-600" />
                <span className="text-zinc-400 text-sm font-medium">
                  Tema do Sistema
                </span>
              </div>
              <span className="text-indigo-500 text-xs font-bold uppercase">
                Deep Dark Mode
              </span>
            </div>
          </div>
        </div>

        {/* Sobre */}
        <div className="bg-indigo-600/5 border border-indigo-500/10 rounded-[32px] p-8 flex gap-6">
          <div className="w-12 h-12 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-500 shrink-0">
            <Info size={24} />
          </div>
          <div className="space-y-2">
            <h3 className="font-bold text-indigo-400">FreelaFlow v1.0.0</h3>
            <p className="text-zinc-500 text-sm leading-relaxed">
              O FreelaFlow é um sistema de gestão de projetos desenvolvido para
              desenvolvedores freelancers. Utiliza tecnologias modernas como
              Next.js 14, Tailwind CSS, Zustand e Firebase para garantir
              performance e escalabilidade.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
