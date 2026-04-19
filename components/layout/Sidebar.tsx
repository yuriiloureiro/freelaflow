"use client";
import React from "react";
import {
  LayoutDashboard,
  Briefcase,
  Settings,
  LogOut,
  DollarSign,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation"; // ✅ Adicionado usePathname
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useAuth } from "@/lib/AuthContext";

export default function Sidebar() {
  const pathname = usePathname(); // ✅ Pega a rota atual
  const router = useRouter();
  const { user } = useAuth();

  const menuItems = [
    { icon: <LayoutDashboard size={20} />, label: "Dashboard", href: "/" },
    { icon: <Briefcase size={20} />, label: "Projetos", href: "/projects" },
    {
      icon: <DollarSign size={20} />,
      label: "Financeiro",
      href: "/financeiro",
    },
    { icon: <Settings size={20} />, label: "Configurações", href: "/settings" },
  ];

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/login");
  };

  return (
    <aside className="w-64 h-screen bg-[#121214] border-r border-[#27272a] p-6 hidden lg:flex flex-col fixed left-0 top-0 z-50">
      <div className="text-xl font-bold mb-12 flex items-center gap-2">
        <span className="text-indigo-500 font-black tracking-tighter">
          FREELA
        </span>
        <span className="text-white font-light tracking-widest">FLOW</span>
      </div>

      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => {
          // ✅ Verifica se o link é o ativo
          const isActive =
            pathname === item.href ||
            (item.href !== "/" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center gap-3 transition-all p-3 rounded-xl group ${
                isActive
                  ? "bg-indigo-600/10 text-white"
                  : "text-zinc-500 hover:text-zinc-200 hover:bg-[#1a1a1e]"
              }`}
            >
              <span
                className={`${isActive ? "text-indigo-500" : "group-hover:text-zinc-300"} transition-colors`}
              >
                {item.icon}
              </span>
              <span className="font-semibold text-sm">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Usuário + Logout */}
      <div className="mt-auto pt-6 border-t border-[#27272a] space-y-3">
        {user && (
          <div className="px-3 py-2 bg-zinc-900/50 rounded-2xl border border-zinc-800/50">
            <p className="text-zinc-600 text-[9px] uppercase font-black tracking-[0.2em] mb-1">
              Desenvolvedor
            </p>
            <p className="text-zinc-400 text-xs truncate font-medium">
              {user.email}
            </p>
          </div>
        )}

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full text-zinc-500 hover:text-red-400 transition-all p-3 rounded-xl hover:bg-red-400/5 group"
        >
          <LogOut
            size={20}
            className="group-hover:rotate-12 transition-transform"
          />
          <span className="font-semibold text-sm">Sair</span>
        </button>
      </div>
    </aside>
  );
}
