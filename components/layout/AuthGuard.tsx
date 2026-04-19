"use client";
import { useAuth } from "@/lib/AuthContext";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import Sidebar from "./Sidebar";
import {
  Loader2,
  LayoutDashboard,
  Briefcase,
  DollarSign,
  Settings,
} from "lucide-react";
import Link from "next/link";

const mobileMenuItems = [
  { icon: LayoutDashboard, label: "Início", href: "/" },
  { icon: Briefcase, label: "Jobs", href: "/projects" },
  { icon: DollarSign, label: "Grana", href: "/financeiro" },
  { icon: Settings, label: "Configs", href: "/settings" },
];

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const isLoginPage = pathname === "/login";

  useEffect(() => {
    if (!loading && !user && !isLoginPage) router.push("/login");
    if (!loading && user && isLoginPage) router.push("/");
  }, [user, loading, isLoginPage, router]);

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-[#09090b]">
        <Loader2 size={32} className="animate-spin text-indigo-500" />
      </div>
    );
  }

  if (isLoginPage) {
    return <div className="min-h-screen w-screen bg-[#09090b]">{children}</div>;
  }

  if (user) {
    return (
      <div className="flex min-h-screen w-full">
        <Sidebar />
        <main className="flex-1 lg:ml-64 p-4 lg:p-8 overflow-y-auto pb-24 lg:pb-8">
          {children}
        </main>

        {/* Mobile Bottom Nav */}
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-[#121214]/80 backdrop-blur-lg border-t border-zinc-800/50 px-6 py-3 z-50">
          <div className="flex items-center justify-between">
            {mobileMenuItems.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== "/" && pathname.startsWith(item.href));
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex flex-col items-center gap-1 transition-all ${
                    isActive ? "text-indigo-500" : "text-zinc-500"
                  }`}
                >
                  <div
                    className={`p-1 rounded-lg ${isActive ? "bg-indigo-500/10" : ""}`}
                  >
                    <Icon size={20} />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-tighter">
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </nav>
      </div>
    );
  }

  return null;
}
