"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, Users, Car } from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();

  const linkBase =
    "flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition";

  const isActive = (route: string) =>
    pathname === route ? "bg-indigo-600 text-white" : "text-gray-700 hover:bg-gray-100";

  return (
    <aside className="w-64 h-screen bg-white border-r shadow-md p-6 flex flex-col">
      <h1 className="text-3xl font-bold mb-10 text-indigo-700">KAVIAR</h1>

      <nav className="flex flex-col gap-3">
        <Link href="/dashboard" className={`${linkBase} ${isActive("/dashboard")}`}>
          <BarChart3 size={20} /> Dashboard
        </Link>

        <Link href="/combos" className={`${linkBase} ${isActive("/combos")}`}>
          <Car size={20} /> Combos
        </Link>

        <Link href="/drivers" className={`${linkBase} ${isActive("/drivers")}`}>
          <Users size={20} /> Motoristas
        </Link>
      </nav>
    </aside>
  );
}
