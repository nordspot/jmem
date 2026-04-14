"use client";

import { useState, useEffect, useCallback, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { AdminNav } from "@/components/AdminNav";
import {
  ArrowLeft,
  Save,
  Loader2,
  Lock,
  Plus,
  Trash2,
  GripVertical,
  ChevronDown,
  ChevronUp,
  Eye,
  Mail,
  Type,
  AlignLeft,
  CheckSquare,
  Hash,
  Phone,
  Calendar,
  FileText,
  Shield,
  Settings,
  Inbox,
  ExternalLink,
  Copy,
  CheckCircle,
  ToggleLeft,
  ToggleRight,
  Undo2,
  Redo2,
  Clock,
  AlertTriangle,
} from "lucide-react";
import {
  type FormDefinition,
  type FormField,
  type FieldType,
  FIELD_TEMPLATES,
  createEmptyForm,
  createField,
} from "@/lib/forms";
import { schools } from "@/lib/schools";
import { offerings } from "@/lib/offerings";

const FIELD_ICONS: Record<string, React.ReactNode> = {
  text: <Type className="w-4 h-4" />,
  email: <Mail className="w-4 h-4" />,
  textarea: <AlignLeft className="w-4 h-4" />,
  select: <ChevronDown className="w-4 h-4" />,
  checkbox: <CheckSquare className="w-4 h-4" />,
  number: <Hash className="w-4 h-4" />,
  phone: <Phone className="w-4 h-4" />,
  date: <Calendar className="w-4 h-4" />,
  display: <FileText className="w-4 h-4" />,
  privacy: <Shield className="w-4 h-4" />,
};

type EditorTab = "fields" | "emails" | "settings";

const MAX_HISTORY = 50;
const AUTOSAVE_DELAY = 2000; // 2s debounce for localStorage draft

export default function FormEditorPageWrapper() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-950" />}>
      <FormEditorPage />
    </Suspense>
  );
}

function FormEditorPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const formId = searchParams.get("id") || "new";
  const isNew = formId === "new";

  const [authed, setAuthed] = useState(false);
  const [secret, setSecret] = useState("");
  const [form, setForm] = useState<FormDefinition>(createEmptyForm());
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [tab, setTab] = useState<EditorTab>("fields");
  const [expandedField, setExpandedField] = useState<string | null>(null);
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [newRecipient, setNewRecipient] = useState("");
  const [showVersions, setShowVersions] = useState(false);
  const [versions, setVersions] = useState<{ timestamp: string; name: string }[]>([]);
  const [loadingVersions, setLoadingVersions] = useState(false);
  const [hasDraft, setHasDraft] = useState(false);

  // --- Undo/Redo ---
  const historyRef = useRef<string[]>([]);
  const historyIdxRef = useRef(-1);
  const skipHistoryRef = useRef(false);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  // Track "clean" state (last saved snapshot) for dirty detection
  const lastSavedRef = useRef<string>("");
  const [isDirty, setIsDirty] = useState(false);

  // Push current form state to undo history
  const pushHistory = useCallback((formState: FormDefinition) => {
    if (skipHistoryRef.current) {
      skipHistoryRef.current = false;
      return;
    }
    const json = JSON.stringify(formState);
    // Don't push if identical to current
    if (historyRef.current[historyIdxRef.current] === json) return;

    // Trim any redo states
    historyRef.current = historyRef.current.slice(0, historyIdxRef.current + 1);
    historyRef.current.push(json);
    // Cap history
    if (historyRef.current.length > MAX_HISTORY) {
      historyRef.current = historyRef.current.slice(-MAX_HISTORY);
    }
    historyIdxRef.current = historyRef.current.length - 1;
    setCanUndo(historyIdxRef.current > 0);
    setCanRedo(false);
    setIsDirty(json !== lastSavedRef.current);
  }, []);

  function undo() {
    if (historyIdxRef.current <= 0) return;
    historyIdxRef.current--;
    const prev = JSON.parse(historyRef.current[historyIdxRef.current]);
    skipHistoryRef.current = true;
    setForm(prev);
    setCanUndo(historyIdxRef.current > 0);
    setCanRedo(true);
    setIsDirty(historyRef.current[historyIdxRef.current] !== lastSavedRef.current);
  }

  function redo() {
    if (historyIdxRef.current >= historyRef.current.length - 1) return;
    historyIdxRef.current++;
    const next = JSON.parse(historyRef.current[historyIdxRef.current]);
    skipHistoryRef.current = true;
    setForm(next);
    setCanUndo(true);
    setCanRedo(historyIdxRef.current < historyRef.current.length - 1);
    setIsDirty(historyRef.current[historyIdxRef.current] !== lastSavedRef.current);
  }

  // Keyboard shortcuts: Ctrl+Z / Ctrl+Shift+Z / Ctrl+S
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key === "z" && !e.shiftKey) {
        e.preventDefault();
        undo();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "z" && e.shiftKey) {
        e.preventDefault();
        redo();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "y") {
        e.preventDefault();
        redo();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        saveForm();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [form, secret]); // re-bind when form/secret changes so saveForm has fresh closure

  // Push to history on every form change
  useEffect(() => {
    pushHistory(form);
  }, [form, pushHistory]);

  // --- Auto-save draft to localStorage ---
  const autosaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!authed || loading) return;
    if (autosaveTimerRef.current) clearTimeout(autosaveTimerRef.current);
    autosaveTimerRef.current = setTimeout(() => {
      const key = `jmem-form-draft-${form.id}`;
      localStorage.setItem(key, JSON.stringify(form));
    }, AUTOSAVE_DELAY);
    return () => {
      if (autosaveTimerRef.current) clearTimeout(autosaveTimerRef.current);
    };
  }, [form, authed, loading]);

  // --- Warn on unsaved changes ---
  useEffect(() => {
    function handleBeforeUnload(e: BeforeUnloadEvent) {
      if (isDirty) {
        e.preventDefault();
      }
    }
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty]);

  // --- Auth ---
  useEffect(() => {
    const saved = localStorage.getItem("jmem-admin-secret");
    if (saved) {
      setSecret(saved);
      setAuthed(true);
    }
  }, []);

  // --- Load form ---
  useEffect(() => {
    if (authed && !isNew) loadForm();
  }, [authed, isNew]);

  async function loadForm() {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/forms?id=${formId}`, {
        headers: { Authorization: `Bearer ${secret}` },
      });
      const data = await res.json();
      if (data.id) {
        // Check for local draft
        const draftKey = `jmem-form-draft-${data.id}`;
        const draftStr = localStorage.getItem(draftKey);
        if (draftStr) {
          try {
            const draft = JSON.parse(draftStr);
            // Only offer draft if it's newer than the saved version
            if (draft.updatedAt && data.updatedAt && draft.updatedAt > data.updatedAt) {
              setHasDraft(true);
            }
          } catch {}
        }

        setForm(data);
        const snapshot = JSON.stringify(data);
        lastSavedRef.current = snapshot;
        historyRef.current = [snapshot];
        historyIdxRef.current = 0;
        setCanUndo(false);
        setCanRedo(false);
        setIsDirty(false);
      }
    } catch (e) {
      console.error("Load failed", e);
    }
    setLoading(false);
  }

  function restoreDraft() {
    const draftStr = localStorage.getItem(`jmem-form-draft-${form.id}`);
    if (draftStr) {
      const draft = JSON.parse(draftStr);
      setForm(draft);
      setHasDraft(false);
    }
  }

  function discardDraft() {
    localStorage.removeItem(`jmem-form-draft-${form.id}`);
    setHasDraft(false);
  }

  // --- Save form + version snapshot ---
  async function saveForm() {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/forms", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${secret}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
        // Update clean state
        const snapshot = JSON.stringify(form);
        lastSavedRef.current = snapshot;
        setIsDirty(false);
        // Clear draft
        localStorage.removeItem(`jmem-form-draft-${form.id}`);
        // Save version snapshot
        fetch("/api/admin/forms-versions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${secret}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ formId: form.id, snapshot: form }),
        }).catch(() => {}); // fire and forget
        if (isNew) {
          router.replace(`/admin/forms/editor?id=${form.id}`);
        }
      }
    } catch (e) {
      console.error("Save failed", e);
    }
    setSaving(false);
  }

  // --- Version history ---
  async function loadVersions() {
    setLoadingVersions(true);
    try {
      const res = await fetch(`/api/admin/forms-versions?formId=${form.id}`, {
        headers: { Authorization: `Bearer ${secret}` },
      });
      const data = await res.json();
      if (data.versions) setVersions(data.versions);
    } catch {}
    setLoadingVersions(false);
  }

  async function restoreVersion(timestamp: string) {
    if (!confirm("Diese Version wiederherstellen? Aktuelle Änderungen gehen verloren.")) return;
    try {
      const res = await fetch(
        `/api/admin/forms-versions?formId=${form.id}&timestamp=${timestamp}`,
        { headers: { Authorization: `Bearer ${secret}` } }
      );
      const data = await res.json();
      if (data.snapshot) {
        setForm(data.snapshot);
        setShowVersions(false);
      }
    } catch {}
  }

  // --- Form mutations ---
  function updateForm(updates: Partial<FormDefinition>) {
    setForm((prev) => ({ ...prev, ...updates }));
  }

  function addField(type: FieldType) {
    const field = createField(type);
    setForm((prev) => ({ ...prev, fields: [...prev.fields, field] }));
    setExpandedField(field.id);
  }

  function updateField(fieldId: string, updates: Partial<FormField>) {
    setForm((prev) => ({
      ...prev,
      fields: prev.fields.map((f) =>
        f.id === fieldId ? { ...f, ...updates } : f
      ),
    }));
  }

  function removeField(fieldId: string) {
    setForm((prev) => ({
      ...prev,
      fields: prev.fields.filter((f) => f.id !== fieldId),
    }));
    if (expandedField === fieldId) setExpandedField(null);
  }

  function moveField(fromIdx: number, toIdx: number) {
    setForm((prev) => {
      const fields = [...prev.fields];
      const [moved] = fields.splice(fromIdx, 1);
      fields.splice(toIdx, 0, moved);
      return { ...prev, fields };
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[var(--color-primary)] animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col pt-16 lg:pt-20">
      <AdminNav />

      <div className="max-w-6xl mx-auto w-full p-4 sm:p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Link
              href="/admin/forms"
              className="p-2 text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <input
                type="text"
                value={form.name}
                onChange={(e) => updateForm({ name: e.target.value })}
                placeholder="Formularname..."
                className="text-xl font-bold bg-transparent border-none outline-none text-white placeholder:text-gray-600 w-full"
              />
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xs text-gray-500">Slug:</span>
                <input
                  type="text"
                  value={form.slug}
                  onChange={(e) =>
                    updateForm({
                      slug: e.target.value
                        .toLowerCase()
                        .replace(/[^a-z0-9-]/g, "-"),
                    })
                  }
                  placeholder="formular-slug"
                  className="text-xs text-gray-400 bg-transparent border-none outline-none"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Undo / Redo */}
            <div className="flex items-center bg-gray-800 border border-gray-700 rounded-xl overflow-hidden">
              <button
                onClick={undo}
                disabled={!canUndo}
                title="Rückgängig (Ctrl+Z)"
                className="p-2 text-gray-400 hover:text-white disabled:text-gray-700 disabled:cursor-not-allowed transition-colors"
              >
                <Undo2 className="w-4 h-4" />
              </button>
              <div className="w-px h-5 bg-gray-700" />
              <button
                onClick={redo}
                disabled={!canRedo}
                title="Wiederholen (Ctrl+Shift+Z)"
                className="p-2 text-gray-400 hover:text-white disabled:text-gray-700 disabled:cursor-not-allowed transition-colors"
              >
                <Redo2 className="w-4 h-4" />
              </button>
            </div>

            {/* Version history */}
            {!isNew && (
              <button
                onClick={() => { setShowVersions(!showVersions); if (!showVersions) loadVersions(); }}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs transition-colors ${
                  showVersions
                    ? "bg-gray-700 text-white"
                    : "bg-gray-800 border border-gray-700 text-gray-400 hover:text-white hover:border-gray-600"
                }`}
                title="Versionen"
              >
                <Clock className="w-3.5 h-3.5" />
                Versionen
              </button>
            )}

            {!isNew && (
              <Link
                href={`/admin/forms/submissions?formId=${form.id}`}
                className="flex items-center gap-1.5 px-3 py-2 bg-gray-800 border border-gray-700 rounded-xl text-xs text-gray-400 hover:text-white hover:border-gray-600 transition-colors"
              >
                <Inbox className="w-3.5 h-3.5" />
                Einträge
              </Link>
            )}
            <button
              onClick={() => setShowPreview(!showPreview)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                showPreview
                  ? "bg-[var(--color-accent)] text-white"
                  : "bg-gray-800 border border-gray-700 text-gray-400 hover:text-white hover:border-gray-600"
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              Vorschau
            </button>
            <button
              onClick={saveForm}
              disabled={saving || !form.name}
              className="flex items-center gap-2 bg-[var(--color-primary)] text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-[var(--color-primary-light)] transition-colors disabled:opacity-50"
            >
              {saving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : saved ? (
                <CheckCircle className="w-4 h-4" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              {saving ? "Speichern..." : saved ? "Gespeichert!" : "Speichern"}
            </button>
            {isDirty && (
              <span className="text-xs text-yellow-500 flex items-center gap-1" title="Nicht gespeicherte Änderungen">
                <AlertTriangle className="w-3 h-3" />
              </span>
            )}
          </div>
        </div>

        {/* Editor Tabs */}
        <div className="flex gap-1 mb-6 bg-gray-900 rounded-xl p-1 w-fit">
          {(
            [
              { key: "fields", label: "Felder", icon: <Type className="w-3.5 h-3.5" /> },
              { key: "emails", label: "E-Mails", icon: <Mail className="w-3.5 h-3.5" /> },
              { key: "settings", label: "Einstellungen", icon: <Settings className="w-3.5 h-3.5" /> },
            ] as { key: EditorTab; label: string; icon: React.ReactNode }[]
          ).map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium transition-colors ${
                tab === t.key
                  ? "bg-[var(--color-primary)] text-white"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              {t.icon}
              {t.label}
            </button>
          ))}
        </div>

        {/* Draft recovery banner */}
        {hasDraft && (
          <div className="mb-6 bg-yellow-900/20 border border-yellow-700/50 rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-yellow-500 shrink-0" />
              <div>
                <p className="text-sm font-medium text-yellow-300">Ungespeicherter Entwurf gefunden</p>
                <p className="text-xs text-yellow-500/70 mt-0.5">Du hast einen lokalen Entwurf, der neuer ist als die gespeicherte Version.</p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button onClick={discardDraft} className="px-3 py-1.5 text-xs text-gray-400 hover:text-white transition-colors">
                Verwerfen
              </button>
              <button onClick={restoreDraft} className="px-3 py-1.5 bg-yellow-600 text-white text-xs font-medium rounded-lg hover:bg-yellow-500 transition-colors">
                Entwurf laden
              </button>
            </div>
          </div>
        )}

        {/* Version history panel */}
        {showVersions && (
          <div className="mb-6 bg-gray-900 border border-gray-800 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-[var(--color-primary)]" />
                Versionen
              </h3>
              <button onClick={() => setShowVersions(false)} className="text-xs text-gray-400 hover:text-white">
                Schliessen
              </button>
            </div>
            {loadingVersions ? (
              <div className="py-4 text-center">
                <Loader2 className="w-5 h-5 text-[var(--color-primary)] animate-spin mx-auto" />
              </div>
            ) : versions.length === 0 ? (
              <p className="text-xs text-gray-500 py-2">Noch keine Versionen gespeichert. Versionen werden bei jedem Speichern erstellt.</p>
            ) : (
              <div className="space-y-1 max-h-48 overflow-y-auto">
                {versions.map((v) => (
                  <div key={v.timestamp} className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-gray-800 transition-colors group">
                    <div>
                      <p className="text-xs text-gray-300">
                        {new Date(v.timestamp).toLocaleString("de-CH", {
                          day: "2-digit", month: "2-digit", year: "numeric",
                          hour: "2-digit", minute: "2-digit",
                        })}
                      </p>
                      <p className="text-xs text-gray-500">{v.name}</p>
                    </div>
                    <button
                      onClick={() => restoreVersion(v.timestamp)}
                      className="text-xs text-[var(--color-primary)] opacity-0 group-hover:opacity-100 transition-opacity font-medium"
                    >
                      Wiederherstellen
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="grid lg:grid-cols-[1fr,380px] gap-6">
          {/* Main area */}
          <div>
            {tab === "fields" && (
              <>
                {/* Field list */}
                <div className="space-y-2 mb-6">
                  {form.fields.length === 0 && (
                    <div className="bg-gray-900 border border-dashed border-gray-700 rounded-xl p-8 text-center">
                      <Type className="w-10 h-10 text-gray-700 mx-auto mb-3" />
                      <p className="text-sm text-gray-500">
                        Noch keine Felder. Füge Felder aus der Palette rechts hinzu.
                      </p>
                    </div>
                  )}

                  {form.fields.map((field, idx) => (
                    <div
                      key={field.id}
                      draggable
                      onDragStart={() => setDragIdx(idx)}
                      onDragOver={(e) => {
                        e.preventDefault();
                        if (dragIdx !== null && dragIdx !== idx) {
                          moveField(dragIdx, idx);
                          setDragIdx(idx);
                        }
                      }}
                      onDragEnd={() => setDragIdx(null)}
                      className={`bg-gray-900 border rounded-xl transition-all ${
                        expandedField === field.id
                          ? "border-[var(--color-primary)]/50"
                          : "border-gray-800 hover:border-gray-700"
                      }`}
                    >
                      {/* Field header */}
                      <div
                        className="flex items-center gap-3 px-4 py-3 cursor-pointer select-none"
                        onClick={() =>
                          setExpandedField(
                            expandedField === field.id ? null : field.id
                          )
                        }
                      >
                        <GripVertical className="w-4 h-4 text-gray-600 cursor-grab shrink-0" />
                        <div className="w-8 h-8 rounded-lg bg-gray-800 flex items-center justify-center shrink-0">
                          {FIELD_ICONS[field.type]}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-white truncate">
                            {field.label || FIELD_TEMPLATES.find((t) => t.type === field.type)?.label || field.type}
                          </p>
                          <p className="text-xs text-gray-500">
                            {FIELD_TEMPLATES.find((t) => t.type === field.type)?.label}
                            {field.required && " • Pflichtfeld"}
                            {field.width === "half" && " • Halbe Breite"}
                          </p>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeField(field.id);
                          }}
                          className="p-1.5 text-gray-600 hover:text-red-400 transition-colors shrink-0"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        {expandedField === field.id ? (
                          <ChevronUp className="w-4 h-4 text-gray-500 shrink-0" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-gray-500 shrink-0" />
                        )}
                      </div>

                      {/* Field settings (expanded) */}
                      {expandedField === field.id && (
                        <div className="px-4 pb-4 border-t border-gray-800 pt-4 space-y-4">
                          {/* Label */}
                          <div>
                            <label className="text-xs text-gray-400 mb-1 block">Beschriftung</label>
                            <input
                              type="text"
                              value={field.label}
                              onChange={(e) => updateField(field.id, { label: e.target.value })}
                              placeholder="Feldname..."
                              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white focus:outline-none focus:border-[var(--color-primary)]"
                            />
                          </div>

                          {/* Placeholder */}
                          {!["display", "privacy", "checkbox"].includes(field.type) && (
                            <div>
                              <label className="text-xs text-gray-400 mb-1 block">Platzhalter</label>
                              <input
                                type="text"
                                value={field.placeholder || ""}
                                onChange={(e) => updateField(field.id, { placeholder: e.target.value })}
                                placeholder="Platzhaltertext..."
                                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white focus:outline-none focus:border-[var(--color-primary)]"
                              />
                            </div>
                          )}

                          {/* Display text (for display/privacy fields) */}
                          {(field.type === "display" || field.type === "privacy") && (
                            <div>
                              <label className="text-xs text-gray-400 mb-1 block">Anzeigetext</label>
                              <textarea
                                value={field.displayText || ""}
                                onChange={(e) => updateField(field.id, { displayText: e.target.value })}
                                rows={3}
                                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white focus:outline-none focus:border-[var(--color-primary)] resize-none"
                              />
                            </div>
                          )}

                          {/* Select options */}
                          {field.type === "select" && (
                            <div>
                              <label className="text-xs text-gray-400 mb-1 block">Optionen (eine pro Zeile)</label>
                              <textarea
                                value={(field.options || []).join("\n")}
                                onChange={(e) =>
                                  updateField(field.id, {
                                    options: e.target.value.split("\n"),
                                  })
                                }
                                rows={4}
                                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white focus:outline-none focus:border-[var(--color-primary)] resize-none font-mono"
                              />
                            </div>
                          )}

                          {/* Row: Required + Width + Merge Tag */}
                          <div className="flex flex-wrap gap-4">
                            {!["display"].includes(field.type) && (
                              <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={field.required || false}
                                  onChange={(e) => updateField(field.id, { required: e.target.checked })}
                                  className="w-4 h-4 rounded border-gray-700 bg-gray-800 text-[var(--color-primary)] focus:ring-0"
                                />
                                <span className="text-xs text-gray-300">Pflichtfeld</span>
                              </label>
                            )}

                            {!["display", "privacy"].includes(field.type) && (
                              <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={field.width === "half"}
                                  onChange={(e) => updateField(field.id, { width: e.target.checked ? "half" : "full" })}
                                  className="w-4 h-4 rounded border-gray-700 bg-gray-800 text-[var(--color-primary)] focus:ring-0"
                                />
                                <span className="text-xs text-gray-300">Halbe Breite</span>
                              </label>
                            )}
                          </div>

                          {/* Merge tag */}
                          {!["display", "privacy"].includes(field.type) && (
                            <div>
                              <label className="text-xs text-gray-400 mb-1 block">
                                Merge-Tag (für E-Mail-Vorlagen, z.B. "nameer")
                              </label>
                              <input
                                type="text"
                                value={field.mergeTag || ""}
                                onChange={(e) =>
                                  updateField(field.id, {
                                    mergeTag: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ""),
                                  })
                                }
                                placeholder="z.B. nameer, namesie, email"
                                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white font-mono focus:outline-none focus:border-[var(--color-primary)]"
                              />
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </>
            )}

            {tab === "emails" && (
              <div className="space-y-6">
                {/* Email to Admin */}
                <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                      <Mail className="w-4 h-4 text-[var(--color-primary)]" />
                      E-Mail an Empfänger (Team)
                    </h3>
                    <button
                      onClick={() =>
                        updateForm({
                          emailToAdmin: {
                            ...form.emailToAdmin,
                            enabled: !form.emailToAdmin.enabled,
                          },
                        })
                      }
                      className={`text-xs px-3 py-1 rounded-full font-medium ${
                        form.emailToAdmin.enabled
                          ? "bg-green-900/30 text-green-400"
                          : "bg-gray-800 text-gray-500"
                      }`}
                    >
                      {form.emailToAdmin.enabled ? "Aktiv" : "Inaktiv"}
                    </button>
                  </div>

                  {form.emailToAdmin.enabled && (
                    <div className="space-y-4">
                      {/* Recipients */}
                      <div>
                        <label className="text-xs text-gray-400 mb-2 block">Empfänger</label>
                        <div className="space-y-2">
                          {form.adminRecipients.map((email, i) => (
                            <div key={i} className="flex items-center gap-2">
                              <input
                                type="email"
                                value={email}
                                onChange={(e) => {
                                  const updated = [...form.adminRecipients];
                                  updated[i] = e.target.value;
                                  updateForm({ adminRecipients: updated });
                                }}
                                className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white focus:outline-none focus:border-[var(--color-primary)]"
                              />
                              <button
                                onClick={() =>
                                  updateForm({
                                    adminRecipients: form.adminRecipients.filter((_, j) => j !== i),
                                  })
                                }
                                className="p-1.5 text-gray-600 hover:text-red-400"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                          <div className="flex items-center gap-2">
                            <input
                              type="email"
                              value={newRecipient}
                              onChange={(e) => setNewRecipient(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter" && newRecipient) {
                                  e.preventDefault();
                                  updateForm({
                                    adminRecipients: [...form.adminRecipients, newRecipient],
                                  });
                                  setNewRecipient("");
                                }
                              }}
                              placeholder="neue-adresse@jmemwiler.ch"
                              className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white focus:outline-none focus:border-[var(--color-primary)]"
                            />
                            <button
                              onClick={() => {
                                if (newRecipient) {
                                  updateForm({
                                    adminRecipients: [...form.adminRecipients, newRecipient],
                                  });
                                  setNewRecipient("");
                                }
                              }}
                              className="p-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-400 hover:text-white"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs text-gray-400 mb-1 block">Absendername</label>
                          <input
                            type="text"
                            value={form.emailToAdmin.fromName || ""}
                            onChange={(e) =>
                              updateForm({
                                emailToAdmin: { ...form.emailToAdmin, fromName: e.target.value },
                              })
                            }
                            placeholder="JMEM Wiler"
                            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white focus:outline-none focus:border-[var(--color-primary)]"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-gray-400 mb-1 block">Absender-Email</label>
                          <input
                            type="email"
                            value={form.emailToAdmin.fromEmail || ""}
                            onChange={(e) =>
                              updateForm({
                                emailToAdmin: { ...form.emailToAdmin, fromEmail: e.target.value },
                              })
                            }
                            placeholder="noreply@jmemwiler.ch"
                            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white focus:outline-none focus:border-[var(--color-primary)]"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-xs text-gray-400 mb-1 block">Betreff</label>
                        <input
                          type="text"
                          value={form.emailToAdmin.subject || ""}
                          onChange={(e) =>
                            updateForm({
                              emailToAdmin: { ...form.emailToAdmin, subject: e.target.value },
                            })
                          }
                          placeholder={`Neue Anmeldung: ${form.name || "Formular"}`}
                          className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white focus:outline-none focus:border-[var(--color-primary)]"
                        />
                      </div>

                      <div>
                        <label className="text-xs text-gray-400 mb-1 block">
                          Inhalt <span className="text-gray-600">({"{alle_felder}"} = alle Formulardaten)</span>
                        </label>
                        <textarea
                          value={form.emailToAdmin.body || ""}
                          onChange={(e) =>
                            updateForm({
                              emailToAdmin: { ...form.emailToAdmin, body: e.target.value },
                            })
                          }
                          rows={5}
                          placeholder="{alle_felder}"
                          className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white font-mono focus:outline-none focus:border-[var(--color-primary)] resize-none"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Email to Visitor */}
                <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                      <Mail className="w-4 h-4 text-green-400" />
                      Bestätigungs-E-Mail an Besucher
                    </h3>
                    <button
                      onClick={() =>
                        updateForm({
                          emailToVisitor: {
                            ...form.emailToVisitor,
                            enabled: !form.emailToVisitor.enabled,
                          },
                        })
                      }
                      className={`text-xs px-3 py-1 rounded-full font-medium ${
                        form.emailToVisitor.enabled
                          ? "bg-green-900/30 text-green-400"
                          : "bg-gray-800 text-gray-500"
                      }`}
                    >
                      {form.emailToVisitor.enabled ? "Aktiv" : "Inaktiv"}
                    </button>
                  </div>

                  {form.emailToVisitor.enabled && (
                    <div className="space-y-4">
                      <div className="bg-gray-800/50 rounded-lg p-3 text-xs text-gray-400">
                        Die E-Mail wird an die Adresse des Besuchers geschickt (Feld mit Typ "E-Mail" im Formular).
                        Verwende Merge-Tags wie {"{nameer}"}, {"{namesie}"}, {"{email}"} etc.
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs text-gray-400 mb-1 block">Absendername</label>
                          <input
                            type="text"
                            value={form.emailToVisitor.fromName || ""}
                            onChange={(e) =>
                              updateForm({
                                emailToVisitor: { ...form.emailToVisitor, fromName: e.target.value },
                              })
                            }
                            placeholder="Generations JMEM Wiler"
                            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white focus:outline-none focus:border-[var(--color-primary)]"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-gray-400 mb-1 block">Absender-Email</label>
                          <input
                            type="email"
                            value={form.emailToVisitor.fromEmail || ""}
                            onChange={(e) =>
                              updateForm({
                                emailToVisitor: { ...form.emailToVisitor, fromEmail: e.target.value },
                              })
                            }
                            placeholder="generations@jmemwiler.ch"
                            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white focus:outline-none focus:border-[var(--color-primary)]"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-xs text-gray-400 mb-1 block">Betreff</label>
                        <input
                          type="text"
                          value={form.emailToVisitor.subject || ""}
                          onChange={(e) =>
                            updateForm({
                              emailToVisitor: { ...form.emailToVisitor, subject: e.target.value },
                            })
                          }
                          placeholder={`Bestätigung: ${form.name}`}
                          className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white focus:outline-none focus:border-[var(--color-primary)]"
                        />
                      </div>

                      <div>
                        <label className="text-xs text-gray-400 mb-1 block">
                          Inhalt <span className="text-gray-600">(Merge-Tags: {"{nameer}"}, {"{namesie}"}, {"{email}"}, etc.)</span>
                        </label>
                        <textarea
                          value={form.emailToVisitor.body || ""}
                          onChange={(e) =>
                            updateForm({
                              emailToVisitor: { ...form.emailToVisitor, body: e.target.value },
                            })
                          }
                          rows={8}
                          placeholder={`Liebe {namesie}, lieber {nameer}\n\nHerzlichen Dank für eure Anmeldung an "${form.name || "..."}".\n\nWir freuen uns auf euch!\n\nHerzliche Grüsse\nJMEM Wiler`}
                          className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white font-mono focus:outline-none focus:border-[var(--color-primary)] resize-none"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {tab === "settings" && (
              <div className="space-y-6">
                {/* Link to school/offering */}
                <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
                  <h3 className="text-sm font-semibold text-white mb-4">Verknüpfung</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs text-gray-400 mb-1 block">Typ</label>
                      <select
                        value={form.linkedType || "standalone"}
                        onChange={(e) =>
                          updateForm({
                            linkedType: e.target.value as FormDefinition["linkedType"],
                            linkedSlug: "",
                          })
                        }
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white focus:outline-none focus:border-[var(--color-primary)]"
                      >
                        <option value="standalone">Eigenständig</option>
                        <option value="school">Schule</option>
                        <option value="offering">Angebot</option>
                      </select>
                    </div>

                    {form.linkedType === "school" && (
                      <div>
                        <label className="text-xs text-gray-400 mb-1 block">Schule</label>
                        <select
                          value={form.linkedSlug || ""}
                          onChange={(e) => updateForm({ linkedSlug: e.target.value })}
                          className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white focus:outline-none focus:border-[var(--color-primary)]"
                        >
                          <option value="">Schule wählen...</option>
                          {schools.map((s) => (
                            <option key={s.slug} value={s.slug}>
                              {s.shortName} - {s.title}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}

                    {form.linkedType === "offering" && (
                      <div>
                        <label className="text-xs text-gray-400 mb-1 block">Angebot</label>
                        <select
                          value={form.linkedSlug || ""}
                          onChange={(e) => updateForm({ linkedSlug: e.target.value })}
                          className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white focus:outline-none focus:border-[var(--color-primary)]"
                        >
                          <option value="">Angebot wählen...</option>
                          {offerings.map((o, i) => (
                            <option key={i} value={o.title.toLowerCase().replace(/[^a-z0-9]/g, "-")}>
                              {o.title}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>
                </div>

                {/* Response page */}
                <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
                  <h3 className="text-sm font-semibold text-white mb-4">Antwortseite (nach Absenden)</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs text-gray-400 mb-1 block">Titel</label>
                      <input
                        type="text"
                        value={form.responsePage.title || ""}
                        onChange={(e) =>
                          updateForm({
                            responsePage: { ...form.responsePage, title: e.target.value },
                          })
                        }
                        placeholder="Vielen Dank!"
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white focus:outline-none focus:border-[var(--color-primary)]"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-400 mb-1 block">
                        Nachricht <span className="text-gray-600">(Merge-Tags erlaubt)</span>
                      </label>
                      <textarea
                        value={form.responsePage.message || ""}
                        onChange={(e) =>
                          updateForm({
                            responsePage: { ...form.responsePage, message: e.target.value },
                          })
                        }
                        rows={4}
                        placeholder="Deine Anmeldung wurde erfolgreich gesendet. Die Bestätigung wurde an {email} verschickt."
                        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white font-mono focus:outline-none focus:border-[var(--color-primary)] resize-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Active toggle */}
                <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-semibold text-white">Formular aktiv</h3>
                      <p className="text-xs text-gray-500 mt-1">
                        Inaktive Formulare werden nicht auf der Seite angezeigt
                      </p>
                    </div>
                    <button
                      onClick={() => updateForm({ active: !form.active })}
                      className="text-2xl"
                    >
                      {form.active ? (
                        <ToggleRight className="w-10 h-10 text-green-400" />
                      ) : (
                        <ToggleLeft className="w-10 h-10 text-gray-600" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar: Field palette OR Preview */}
          <div className="lg:sticky lg:top-36 lg:self-start">
            {showPreview ? (
              /* Live Preview */
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <div className="mb-4 pb-3 border-b border-gray-200">
                  <h3 className="text-lg font-bold text-gray-900">{form.name || "Vorschau"}</h3>
                </div>
                <div className="space-y-4">
                  {form.fields.map((field) => (
                    <div key={field.id} className={field.width === "half" ? "inline-block w-[48%] mr-[4%] align-top" : ""}>
                      {field.type === "display" ? (
                        <p className="text-sm text-gray-700 whitespace-pre-wrap">
                          {field.displayText}
                        </p>
                      ) : field.type === "privacy" ? (
                        <label className="flex items-start gap-2 text-xs text-gray-600">
                          <input type="checkbox" className="mt-0.5" disabled />
                          <span>{field.displayText}</span>
                        </label>
                      ) : (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            {field.label}
                            {field.required && <span className="text-red-500 ml-0.5">*</span>}
                          </label>
                          {field.type === "textarea" ? (
                            <textarea rows={3} disabled placeholder={field.placeholder} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm resize-none" />
                          ) : field.type === "select" ? (
                            <select disabled className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-400">
                              <option>{field.placeholder || "Bitte wählen..."}</option>
                              {field.options?.map((o, i) => <option key={i}>{o}</option>)}
                            </select>
                          ) : field.type === "checkbox" ? (
                            <label className="flex items-center gap-2 text-sm text-gray-700">
                              <input type="checkbox" disabled />
                              {field.label}
                            </label>
                          ) : (
                            <input
                              type={field.type === "email" ? "email" : field.type === "number" ? "number" : field.type === "date" ? "date" : field.type === "phone" ? "tel" : "text"}
                              disabled
                              placeholder={field.placeholder}
                              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                            />
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                  {form.fields.length > 0 && (
                    <button disabled className="bg-[var(--color-primary)] text-white font-medium px-6 py-2.5 rounded-full text-sm opacity-80 mt-2">
                      Absenden
                    </button>
                  )}
                </div>
              </div>
            ) : (
              /* Field palette */
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
                <h3 className="text-sm font-semibold text-white mb-3">Feld hinzufügen</h3>
                <div className="grid grid-cols-2 gap-2">
                  {FIELD_TEMPLATES.map((tmpl) => (
                    <button
                      key={tmpl.type}
                      onClick={() => addField(tmpl.type)}
                      className="flex items-center gap-2 px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-xs text-gray-300 hover:text-white hover:border-[var(--color-primary)]/50 hover:bg-gray-750 transition-colors text-left"
                    >
                      <div className="w-7 h-7 rounded bg-gray-700 flex items-center justify-center shrink-0">
                        {FIELD_ICONS[tmpl.type]}
                      </div>
                      {tmpl.label}
                    </button>
                  ))}
                </div>

                {/* Available merge tags */}
                {form.fields.some((f) => f.mergeTag) && (
                  <div className="mt-4 pt-4 border-t border-gray-800">
                    <h4 className="text-xs font-semibold text-gray-400 mb-2">Merge-Tags</h4>
                    <div className="space-y-1">
                      {form.fields
                        .filter((f) => f.mergeTag)
                        .map((f) => (
                          <div key={f.id} className="flex items-center justify-between text-xs">
                            <span className="text-gray-500">{f.label}</span>
                            <code className="text-[var(--color-primary)] font-mono">{`{${f.mergeTag}}`}</code>
                          </div>
                        ))}
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500">Alle Felder</span>
                        <code className="text-[var(--color-primary)] font-mono">{"{alle_felder}"}</code>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
