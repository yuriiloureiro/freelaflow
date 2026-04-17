"use client"; // ✅ Adicione isso
import React from "react";
import { LayoutDashboard, Briefcase, Settings, LogOut } from "lucide-react";
import Link from "next/link";

export default function Sidebar() {
  // ✅ Exportação direta
  const menuItems = [
    { icon: <LayoutDashboard size={20} />, label: "Dashboard", href: "/" },
    { icon: <Briefcase size={20} />, label: "Projetos", href: "/projects" },
    { icon: <Settings size={20} />, label: "Configurações", href: "/settings" },
  ];

  return (
    <aside className="w-64 h-screen bg-[#121214] border-r border-[#27272a] p-6 flex flex-col fixed left-0 top-0 z-50">
      <div className="text-xl font-bold mb-12 flex items-center gap-2">
        <span className="text-indigo-500">FREELA</span>
        <span className="text-white">FLOW</span>
      </div>

      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="flex items-center gap-3 text-zinc-400 hover:text-white transition-all p-3 rounded-xl hover:bg-[#1a1a1e] group"
          >
            <span className="group-hover:text-indigo-400 transition-colors">
              {item.icon}
            </span>
            <span className="font-medium">{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="mt-auto pt-6 border-t border-[#27272a]">
        <button className="flex items-center gap-3 w-full text-zinc-400 hover:text-red-400 transition-colors p-3 rounded-xl hover:bg-red-400/10">
          <LogOut size={20} />
          <span className="font-medium">Sair</span>
        </button>
      </div>
    </aside>
  );
}
