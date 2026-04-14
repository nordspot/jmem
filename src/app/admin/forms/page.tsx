"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { AdminNav } from "@/components/AdminNav";
import {
  Plus,
  FileText,
  Loader2,
  Lock,
  ToggleLeft,
  ToggleRight,
  Trash2,
  GraduationCap,
  Gift,
  ExternalLink,
  Inbox,
  Search,
} from "lucide-react";

interface FormSummary {
  id: string;
  name: string;
  slug: string;
  linkedType?: string;
  linkedSlug?: string;
  fieldCount: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function FormsListPage() {
  const [authed, setAuthed] = useState(false);
  const [secret, setSecret] = useState("");
  const [forms, setForms] = useState<FormSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("jmem-admin-secret");
    if (saved) {
      setSecret(saved);
      setAuthed(true);
    }
  }, []);

  useEffect(() => {
    if (authed) loadForms();
  }, [authed]);

  async function loadForms() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/forms", {
        headers: { Authorization: `Bearer ${secret}` },
      });
      const data = await res.json();
      if (data.forms) setForms(data.forms);
    } catch (e) {
      console.error("Failed to load forms", e);
    }
    setLoading(false);
  }

  async function deleteForm(id: string, name: string) {
    if (!confirm(`Formular "${name}" wirklich löschen?`)) return;
    try {
      await fetch("/api/admin/forms", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${secret}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });
      setForms((prev) => prev.filter((f) => f.id !== id));
    } catch (e) {
      console.error("Delete failed", e);
    }
  }

  function handleLogin() {
    localStorage.setItem("jmem-admin-secret", secret);
    setAuthed(true);
  }

  if (!authed) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
        <div className="w-full max-w-sm bg-gray-900 rounded-2xl p-8 border border-gray-800">
          <div className="flex items-center justify-center gap-3 mb-8">
            <Lock className="w-8 h-8 text-[var(--color-primary)]" />
            <h1 className="text-2xl font-bold text-white">JMEM Admin</h1>
          </div>
          <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
            <input
              type="password"
              placeholder="Admin Secret"
              value={secret}
              onChange={(e) => setSecret(e.target.value)}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm focus:outline-none focus:border-[var(--color-primary)] mb-4"
              autoFocus
            />
            <button type="submit" className="w-full bg-[var(--color-primary)] text-white font-medium py-3 rounded-xl hover:bg-[var(--color-primary-light)] transition-colors">
              Anmelden
            </button>
          </form>
        </div>
      </div>
    );
  }

  const filtered = forms.filter((f) =>
    f.name.toLowerCase().includes(search.toLowerCase()) ||
    f.slug.toLowerCase().includes(search.toLowerCase()) ||
    (f.linkedSlug || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col pt-16 lg:pt-20">
      <AdminNav />

      <div className="max-w-5xl mx-auto w-full p-4 sm:p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold">Formulare</h1>
            <p className="text-sm text-gray-400 mt-1">
              Anmeldeformulare für Schulen, Angebote und Events
            </p>
          </div>
          <Link
            href="/admin/forms/editor?id=new"
            className="flex items-center gap-2 bg-[var(--color-primary)] text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-[var(--color-primary-light)] transition-colors"
          >
            <Plus className="w-4 h-4" />
            Neues Formular
          </Link>
        </div>

        {/* Search */}
        {forms.length > 0 && (
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Formular suchen..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-900 border border-gray-800 rounded-xl text-white text-sm focus:outline-none focus:border-[var(--color-primary)]"
            />
          </div>
        )}

        {/* Forms list */}
        {loading ? (
          <div className="text-center py-20">
            <Loader2 className="w-8 h-8 text-[var(--color-primary)] animate-spin mx-auto" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <FileText className="w-16 h-16 text-gray-700 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-400 mb-2">
              {forms.length === 0 ? "Noch keine Formulare" : "Keine Treffer"}
            </h2>
            <p className="text-gray-600 text-sm mb-6">
              {forms.length === 0
                ? "Erstelle dein erstes Formular für Anmeldungen."
                : "Versuche einen anderen Suchbegriff."}
            </p>
            {forms.length === 0 && (
              <Link
                href="/admin/forms/editor?id=new"
                className="inline-flex items-center gap-2 bg-[var(--color-primary)] text-white px-6 py-3 rounded-xl text-sm font-medium hover:bg-[var(--color-primary-light)] transition-colors"
              >
                <Plus className="w-4 h-4" />
                Formular erstellen
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((form) => (
              <div
                key={form.id}
                className="bg-gray-900 border border-gray-800 rounded-xl p-4 hover:border-gray-700 transition-colors group"
              >
                <div className="flex items-center justify-between gap-4">
                  <Link
                    href={`/admin/forms/editor?id=${form.id}`}
                    className="flex-1 min-w-0"
                  >
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-semibold text-white group-hover:text-[var(--color-primary)] transition-colors truncate">
                        {form.name || "Unbenanntes Formular"}
                      </h3>
                      {!form.active && (
                        <span className="text-xs bg-gray-800 text-gray-500 px-2 py-0.5 rounded shrink-0">
                          Inaktiv
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      {form.linkedType && form.linkedType !== "standalone" && (
                        <span className="flex items-center gap-1">
                          {form.linkedType === "school" ? (
                            <GraduationCap className="w-3 h-3" />
                          ) : (
                            <Gift className="w-3 h-3" />
                          )}
                          {form.linkedSlug}
                        </span>
                      )}
                      <span>{form.fieldCount} Felder</span>
                      <span>
                        Erstellt:{" "}
                        {new Date(form.createdAt).toLocaleDateString("de-CH")}
                      </span>
                    </div>
                  </Link>

                  <div className="flex items-center gap-2 shrink-0">
                    <Link
                      href={`/admin/forms/submissions?formId=${form.id}`}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-800 border border-gray-700 rounded-lg text-xs text-gray-400 hover:text-white hover:border-gray-600 transition-colors"
                    >
                      <Inbox className="w-3.5 h-3.5" />
                      Einträge
                    </Link>
                    <button
                      onClick={() => deleteForm(form.id, form.name)}
                      className="p-1.5 text-gray-600 hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
