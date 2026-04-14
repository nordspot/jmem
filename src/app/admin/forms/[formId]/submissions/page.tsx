"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { AdminNav } from "@/components/AdminNav";
import {
  ArrowLeft,
  Download,
  Loader2,
  Lock,
  Trash2,
  Inbox,
  Search,
  ChevronDown,
  ChevronUp,
  Calendar,
  RefreshCw,
} from "lucide-react";

interface Submission {
  id: string;
  formId: string;
  formName: string;
  data: Record<string, string>;
  labels: Record<string, string>;
  submittedAt: string;
}

export default function SubmissionsPage() {
  const params = useParams();
  const formId = params.formId as string;

  const [authed, setAuthed] = useState(false);
  const [secret, setSecret] = useState("");
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [formName, setFormName] = useState("");
  const [sortAsc, setSortAsc] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("jmem-admin-secret");
    if (saved) {
      setSecret(saved);
      setAuthed(true);
    }
  }, []);

  useEffect(() => {
    if (authed) {
      loadSubmissions();
      loadFormName();
    }
  }, [authed]);

  async function loadFormName() {
    try {
      const res = await fetch(`/api/admin/forms?id=${formId}`, {
        headers: { Authorization: `Bearer ${secret}` },
      });
      const data = await res.json();
      if (data.name) setFormName(data.name);
    } catch {}
  }

  async function loadSubmissions() {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/submissions?formId=${formId}`, {
        headers: { Authorization: `Bearer ${secret}` },
      });
      const data = await res.json();
      if (data.submissions) setSubmissions(data.submissions);
    } catch (e) {
      console.error("Load failed", e);
    }
    setLoading(false);
  }

  async function deleteSubmission(subId: string) {
    if (!confirm("Eintrag wirklich löschen?")) return;
    try {
      await fetch("/api/admin/submissions", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${secret}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ submissionId: subId, formId }),
      });
      setSubmissions((prev) => prev.filter((s) => s.id !== subId));
    } catch {}
  }

  function exportCSV() {
    // Trigger CSV download via the API
    const url = `/api/admin/submissions?formId=${formId}&format=csv`;
    const a = document.createElement("a");
    a.href = url;
    // We need auth — fetch and download as blob
    fetch(url, { headers: { Authorization: `Bearer ${secret}` } })
      .then((res) => res.blob())
      .then((blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `anmeldungen-${formName || formId.slice(0, 8)}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      });
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
            <input type="password" placeholder="Admin Secret" value={secret} onChange={(e) => setSecret(e.target.value)} className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm focus:outline-none focus:border-[var(--color-primary)] mb-4" autoFocus />
            <button type="submit" className="w-full bg-[var(--color-primary)] text-white font-medium py-3 rounded-xl hover:bg-[var(--color-primary-light)] transition-colors">Anmelden</button>
          </form>
        </div>
      </div>
    );
  }

  // Collect all field labels for the table header
  const fieldOrder: { id: string; label: string }[] = [];
  const seenFields = new Set<string>();
  for (const sub of submissions) {
    for (const [fieldId, label] of Object.entries(sub.labels || {})) {
      if (!seenFields.has(fieldId)) {
        seenFields.add(fieldId);
        fieldOrder.push({ id: fieldId, label });
      }
    }
  }

  // Filter and sort
  const filtered = submissions
    .filter((sub) => {
      if (!search) return true;
      const searchLower = search.toLowerCase();
      return Object.values(sub.data).some((v) =>
        v.toLowerCase().includes(searchLower)
      );
    })
    .sort((a, b) => {
      const diff = new Date(a.submittedAt).getTime() - new Date(b.submittedAt).getTime();
      return sortAsc ? diff : -diff;
    });

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col pt-16 lg:pt-20">
      <AdminNav />

      <div className="max-w-[90rem] mx-auto w-full p-4 sm:p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Link
              href={`/admin/forms/${formId}`}
              className="p-2 text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-xl font-bold">Einträge</h1>
              <p className="text-sm text-gray-400 mt-0.5">
                {formName && <span className="text-[var(--color-primary)]">{formName}</span>}
                {" "}&mdash; {submissions.length} Einträge
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={loadSubmissions}
              className="flex items-center gap-1.5 px-3 py-2 bg-gray-800 border border-gray-700 rounded-xl text-xs text-gray-400 hover:text-white transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Aktualisieren
            </button>
            <button
              onClick={exportCSV}
              disabled={submissions.length === 0}
              className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-green-500 transition-colors disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              Excel-Export (CSV)
            </button>
          </div>
        </div>

        {/* Search */}
        {submissions.length > 0 && (
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Einträge durchsuchen..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-900 border border-gray-800 rounded-xl text-white text-sm focus:outline-none focus:border-[var(--color-primary)]"
            />
          </div>
        )}

        {/* Table */}
        {loading ? (
          <div className="text-center py-20">
            <Loader2 className="w-8 h-8 text-[var(--color-primary)] animate-spin mx-auto" />
          </div>
        ) : submissions.length === 0 ? (
          <div className="text-center py-20">
            <Inbox className="w-16 h-16 text-gray-700 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-400 mb-2">Noch keine Einträge</h2>
            <p className="text-gray-600 text-sm">
              Sobald jemand das Formular ausfüllt, erscheinen die Einträge hier.
            </p>
          </div>
        ) : (
          <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-800">
                    <th className="px-4 py-3 text-left">
                      <button
                        onClick={() => setSortAsc(!sortAsc)}
                        className="flex items-center gap-1 text-xs font-medium text-gray-400 hover:text-white"
                      >
                        <Calendar className="w-3.5 h-3.5" />
                        Datum
                        {sortAsc ? (
                          <ChevronUp className="w-3 h-3" />
                        ) : (
                          <ChevronDown className="w-3 h-3" />
                        )}
                      </button>
                    </th>
                    {fieldOrder.map((f) => (
                      <th key={f.id} className="px-4 py-3 text-left text-xs font-medium text-gray-400">
                        {f.label}
                      </th>
                    ))}
                    <th className="px-4 py-3 w-12" />
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((sub) => (
                    <tr
                      key={sub.id}
                      className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors cursor-pointer"
                      onClick={() =>
                        setExpandedId(expandedId === sub.id ? null : sub.id)
                      }
                    >
                      <td className="px-4 py-3 text-xs text-gray-400 whitespace-nowrap">
                        {new Date(sub.submittedAt).toLocaleString("de-CH", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                      {fieldOrder.map((f) => (
                        <td key={f.id} className="px-4 py-3 text-sm text-gray-300 max-w-[200px] truncate">
                          {sub.data[f.id] || "—"}
                        </td>
                      ))}
                      <td className="px-4 py-3">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteSubmission(sub.id);
                          }}
                          className="p-1 text-gray-600 hover:text-red-400 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Expanded detail view */}
            {expandedId && (
              <div className="border-t border-gray-800 p-6 bg-gray-800/20">
                {(() => {
                  const sub = filtered.find((s) => s.id === expandedId);
                  if (!sub) return null;
                  return (
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-semibold text-white">
                          Eintrag vom{" "}
                          {new Date(sub.submittedAt).toLocaleString("de-CH")}
                        </h3>
                        <button
                          onClick={() => setExpandedId(null)}
                          className="text-xs text-gray-400 hover:text-white"
                        >
                          Schliessen
                        </button>
                      </div>
                      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {Object.entries(sub.labels).map(([fieldId, label]) => (
                          <div key={fieldId}>
                            <p className="text-xs text-gray-500 mb-0.5">{label}</p>
                            <p className="text-sm text-white whitespace-pre-wrap">
                              {sub.data[fieldId] || "—"}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
