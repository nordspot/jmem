"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bot, History, FileText, Pencil, Package, ClipboardList } from "lucide-react";

const adminLinks = [
  { href: "/admin", label: "AI Agent", icon: Bot, exact: true },
  { href: "/admin/cms", label: "CMS", icon: FileText },
  { href: "/admin#history", label: "Verlauf", icon: History },
];

interface AdminNavProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

export function AdminNav({ activeTab, onTabChange }: AdminNavProps) {
  const pathname = usePathname();

  return (
    <div className="bg-gray-900 border-b border-gray-800 sticky top-16 lg:top-20 z-40">
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between h-12">
        <div className="flex items-center gap-1">
          {/* Agent tab */}
          {onTabChange ? (
            <button
              onClick={() => onTabChange("agent")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                activeTab === "agent"
                  ? "bg-[var(--color-primary)] text-white"
                  : "text-gray-400 hover:text-white hover:bg-gray-800"
              }`}
            >
              <Bot className="w-3.5 h-3.5" />
              AI Agent
            </button>
          ) : (
            <Link
              href="/admin"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                pathname === "/admin"
                  ? "bg-[var(--color-primary)] text-white"
                  : "text-gray-400 hover:text-white hover:bg-gray-800"
              }`}
            >
              <Bot className="w-3.5 h-3.5" />
              AI Agent
            </Link>
          )}

          {/* History tab */}
          {onTabChange ? (
            <button
              onClick={() => onTabChange("history")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                activeTab === "history"
                  ? "bg-[var(--color-primary)] text-white"
                  : "text-gray-400 hover:text-white hover:bg-gray-800"
              }`}
            >
              <History className="w-3.5 h-3.5" />
              Verlauf
            </button>
          ) : (
            <Link
              href="/admin"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
            >
              <History className="w-3.5 h-3.5" />
              Verlauf
            </Link>
          )}

          {/* CMS */}
          <Link
            href="/admin/cms"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              pathname === "/admin/cms"
                ? "bg-[var(--color-primary)] text-white"
                : "text-gray-400 hover:text-white hover:bg-gray-800"
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            CMS
          </Link>

          {/* Formulare */}
          <Link
            href="/admin/forms"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              pathname?.startsWith("/admin/forms")
                ? "bg-[var(--color-primary)] text-white"
                : "text-gray-400 hover:text-white hover:bg-gray-800"
            }`}
          >
            <ClipboardList className="w-3.5 h-3.5" />
            Formulare
          </Link>

          {/* Bestellungen */}
          <Link
            href="/admin/cms?tab=bestellungen"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
          >
            <Package className="w-3.5 h-3.5" />
            Bestellungen
          </Link>
        </div>

        {/* Live-Edit link */}
        <Link
          href="/"
          onClick={() => {
            localStorage.setItem("jmem-edit-mode", "true");
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-[var(--color-accent)] hover:bg-[var(--color-accent)]/10 transition-colors"
        >
          <Pencil className="w-3.5 h-3.5" />
          Live-Edit
        </Link>
      </div>
    </div>
  );
}
