"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  Pencil, X, Send, Loader2, CheckCircle, AlertTriangle,
  Wand2, Type, RotateCcw, EyeOff,
} from "lucide-react";

interface SelectedElement {
  rect: DOMRect;
  el: HTMLElement;
  path: string;
  section: string;
  content: string;
  originalHTML: string;
}

export function EditOverlay() {
  const [enabled, setEnabled] = useState(false);
  const [adminSecret, setAdminSecret] = useState<string | null>(null);
  const [hovered, setHovered] = useState<DOMRect | null>(null);
  const [selected, setSelected] = useState<SelectedElement | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showAI, setShowAI] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const promptRef = useRef<HTMLTextAreaElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const secret = localStorage.getItem("jmem-admin-secret");
    if (secret) setAdminSecret(secret);
    const autoEdit = localStorage.getItem("jmem-edit-mode");
    if (autoEdit && secret) {
      setEnabled(true);
      localStorage.removeItem("jmem-edit-mode");
    }
  }, []);

  const findEditableParent = useCallback((el: HTMLElement): HTMLElement | null => {
    let current: HTMLElement | null = el;
    while (current) {
      if (current.dataset.editPath) return current;
      current = current.parentElement;
    }
    return null;
  }, []);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!enabled || selected || loading) return;
      const editable = findEditableParent(e.target as HTMLElement);
      setHovered(editable ? editable.getBoundingClientRect() : null);
    },
    [enabled, selected, loading, findEditableParent]
  );

  const handleClick = useCallback(
    (e: MouseEvent) => {
      if (!enabled || loading) return;
      const target = e.target as HTMLElement;
      if (panelRef.current?.contains(target)) return;
      if (isEditing) return;

      const editable = findEditableParent(target);
      if (editable) {
        e.preventDefault();
        e.stopPropagation();
        setSelected({
          el: editable,
          rect: editable.getBoundingClientRect(),
          path: editable.dataset.editPath || "",
          section: editable.dataset.editSection || "",
          content: editable.innerText?.slice(0, 500) || "",
          originalHTML: editable.innerHTML,
        });
        setIsEditing(false);
        setShowAI(false);
        setHovered(null);
        setResult(null);
        setPrompt("");
      } else {
        deselect();
      }
    },
    [enabled, loading, isEditing, findEditableParent]
  );

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape") {
      if (isEditing) revertEdit();
      else if (showAI) setShowAI(false);
      else if (selected) deselect();
      else exitEditMode();
    }
  }, [isEditing, showAI, selected, enabled]);

  useEffect(() => {
    if (enabled) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("click", handleClick, true);
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("click", handleClick, true);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [enabled, handleMouseMove, handleClick, handleKeyDown]);

  function deselect() {
    if (isEditing && selected) revertEdit();
    setSelected(null);
    setShowAI(false);
    setResult(null);
  }

  function exitEditMode() {
    if (isEditing && selected) revertEdit();
    setEnabled(false);
    setSelected(null);
    setHovered(null);
    setShowAI(false);
    setResult(null);
  }

  function startTextEdit() {
    if (!selected) return;
    setIsEditing(true);
    setShowAI(false);
    selected.el.contentEditable = "true";
    selected.el.style.outline = "2px dashed var(--color-primary)";
    selected.el.style.outlineOffset = "4px";
    selected.el.focus();
  }

  function revertEdit() {
    if (!selected) return;
    selected.el.contentEditable = "false";
    selected.el.style.outline = "";
    selected.el.style.outlineOffset = "";
    selected.el.innerHTML = selected.originalHTML;
    setIsEditing(false);
  }

  function saveTextEdit() {
    if (!selected || !adminSecret) return;
    const newText = selected.el.innerText || "";
    selected.el.contentEditable = "false";
    selected.el.style.outline = "";
    selected.el.style.outlineOffset = "";
    setIsEditing(false);

    submitToAgent(`Der Benutzer hat auf der Live-Website den Text in folgendem Bereich direkt bearbeitet:

**Datei:** ${selected.path}
**Bereich:** ${selected.section}

**Alter Text:**
${selected.content}

**Neuer Text:**
${newText}

Bitte lies die Datei "${selected.path}" und ersetze den alten Text durch den neuen Text. Behalte die Code-Struktur bei.`);
  }

  async function submitToAgent(contextPrompt: string) {
    if (!adminSecret) return;
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/admin/agent", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${adminSecret}` },
        body: JSON.stringify({ prompt: contextPrompt }),
      });
      const data = await res.json();
      if (data.error) {
        setResult({ type: "error", message: data.error });
      } else if (data.type === "needsFiles") {
        const retryRes = await fetch("/api/admin/agent", {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${adminSecret}` },
          body: JSON.stringify({ prompt: contextPrompt, fileContents: data.files }),
        });
        const rd = await retryRes.json();
        setResult({
          type: rd.type === "committed" ? "success" : rd.type === "error" ? "error" : "success",
          message: rd.message || rd.content || "Fertig",
        });
      } else if (data.type === "committed") {
        setResult({ type: "success", message: data.message || "Gespeichert! Seite wird in ~1 Min. aktualisiert." });
      } else {
        setResult({ type: "success", message: data.content || data.message || "Fertig" });
      }
    } catch {
      setResult({ type: "error", message: "Verbindungsfehler" });
    }
    setLoading(false);
  }

  function submitAIPrompt() {
    if (!prompt.trim() || !selected) return;
    submitToAgent(`Der Benutzer hat auf der Live-Website folgendes Element ausgewählt:

**Datei:** ${selected.path}
**Bereich:** ${selected.section}
**Aktueller sichtbarer Text:**
${selected.content}

**Gewünschte Änderung:**
${prompt}

Bitte lies zuerst die Datei "${selected.path}" und mache dann die gewünschte Änderung nur in dem beschriebenen Bereich "${selected.section}".`);
  }

  if (!adminSecret) return null;

  return (
    <>
      {/* ===== Top bar when edit mode is on ===== */}
      {enabled && (
        <div className="fixed top-0 left-0 right-0 z-[10000] bg-gray-900/95 backdrop-blur border-b border-gray-700 h-10 flex items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-xs font-medium text-white">Edit-Modus</span>
            <span className="text-[10px] text-gray-500 hidden sm:inline">Bereich anklicken · ESC zum Schliessen</span>
          </div>
          <button
            onClick={exitEditMode}
            className="flex items-center gap-1.5 px-3 py-1 rounded text-xs font-medium text-gray-300 hover:text-white hover:bg-gray-800 transition-colors"
          >
            <EyeOff className="w-3 h-3" /> Beenden
          </button>
        </div>
      )}

      {/* ===== Toggle button ===== */}
      {!enabled && (
        <button
          onClick={() => setEnabled(true)}
          className="fixed bottom-6 left-6 z-[9999] flex items-center gap-2 px-4 py-3 rounded-full shadow-lg text-sm font-medium bg-gray-900 text-white hover:bg-gray-800"
        >
          <Pencil className="w-4 h-4" /> Edit-Modus
        </button>
      )}

      {/* ===== Hover highlight ===== */}
      {enabled && hovered && !selected && (
        <div
          className="fixed z-[9990] pointer-events-none rounded-lg"
          style={{
            top: hovered.top - 3, left: hovered.left - 3,
            width: hovered.width + 6, height: hovered.height + 6,
            border: "2px dashed rgba(227,66,52,0.5)",
            background: "rgba(227,66,52,0.03)",
          }}
        >
          <div className="absolute -top-6 left-2 bg-[var(--color-accent)] text-white text-[10px] px-2 py-0.5 rounded shadow">
            Bearbeiten
          </div>
        </div>
      )}

      {/* ===== Selection outline ===== */}
      {enabled && selected && (
        <div
          className="fixed z-[9990] pointer-events-none rounded-lg"
          style={{
            top: selected.rect.top - 3, left: selected.rect.left - 3,
            width: selected.rect.width + 6, height: selected.rect.height + 6,
            border: `2px solid ${isEditing ? "var(--color-primary)" : "var(--color-accent)"}`,
            background: isEditing ? "rgba(31,139,199,0.04)" : "rgba(227,66,52,0.04)",
          }}
        />
      )}

      {/* ===== Action panel ===== */}
      {enabled && selected && (
        <div
          ref={panelRef}
          className="fixed z-[9999] bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden"
          style={{
            width: showAI ? "24rem" : "auto",
            maxWidth: "92vw",
            top: Math.min(selected.rect.bottom + 14, window.innerHeight - (showAI ? 300 : isEditing ? 140 : 56)),
            left: Math.max(8, Math.min(selected.rect.left, window.innerWidth - (showAI ? 400 : 360))),
          }}
        >
          {/* --- Toolbar (default) --- */}
          {!showAI && !isEditing && (
            <div className="flex items-center gap-1 p-1.5">
              <span className="text-[10px] text-gray-400 px-2 truncate max-w-24">{selected.section || selected.path.split("/").pop()}</span>
              <div className="w-px h-4 bg-gray-200" />
              <button onClick={startTextEdit} className="flex items-center gap-1 px-2.5 py-1.5 rounded text-xs font-medium text-gray-700 hover:bg-gray-100">
                <Type className="w-3.5 h-3.5" /> Text
              </button>
              <button onClick={() => { setShowAI(true); setTimeout(() => promptRef.current?.focus(), 100); }} className="flex items-center gap-1 px-2.5 py-1.5 rounded text-xs font-medium text-white bg-[var(--color-primary)] hover:bg-[var(--color-primary-light)]">
                <Wand2 className="w-3.5 h-3.5" /> AI
              </button>
              <button onClick={deselect} className="p-1.5 text-gray-400 hover:text-gray-600 rounded" title="ESC">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* --- Text editing --- */}
          {isEditing && !showAI && (
            <div className="p-3">
              <div className="flex items-center gap-2 mb-2">
                <Type className="w-4 h-4 text-[var(--color-primary)]" />
                <span className="text-xs font-medium text-gray-600">Text bearbeiten</span>
                <span className="text-[10px] text-gray-400 ml-auto">Tippe direkt auf der Seite</span>
              </div>
              {result && (
                <div className={`flex items-start gap-2 p-2 rounded mb-2 text-xs ${
                  result.type === "success" ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"
                }`}>
                  {result.type === "success" ? <CheckCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" /> : <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />}
                  <span>{result.message}</span>
                </div>
              )}
              <div className="flex gap-2">
                <button onClick={saveTextEdit} disabled={loading} className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-[var(--color-primary)] text-white rounded-lg text-xs font-medium hover:bg-[var(--color-primary-light)] disabled:opacity-50">
                  {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle className="w-3.5 h-3.5" />} Speichern
                </button>
                <button onClick={revertEdit} className="flex items-center gap-1.5 px-3 py-2 bg-gray-100 text-gray-600 rounded-lg text-xs font-medium hover:bg-gray-200">
                  <RotateCcw className="w-3.5 h-3.5" /> Verwerfen
                </button>
              </div>
            </div>
          )}

          {/* --- AI panel --- */}
          {showAI && (
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Wand2 className="w-4 h-4 text-[var(--color-primary)]" />
                  <span className="text-sm font-medium text-gray-700">AI-Assistent</span>
                </div>
                <button onClick={() => setShowAI(false)} className="text-gray-400 hover:text-gray-600"><X className="w-4 h-4" /></button>
              </div>
              <div className="bg-gray-50 rounded-lg p-2 mb-3 max-h-14 overflow-y-auto border border-gray-100">
                <p className="text-xs text-gray-500 line-clamp-2">{selected.content.slice(0, 150)}{selected.content.length > 150 && "..."}</p>
              </div>
              <textarea
                ref={promptRef} value={prompt} onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); submitAIPrompt(); } }}
                placeholder="Beschreibe die gewünschte Änderung..."
                rows={3}
                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-gray-800 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] mb-3"
              />
              {result && (
                <div className={`flex items-start gap-2 p-2 rounded mb-3 text-xs ${
                  result.type === "success" ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"
                }`}>
                  {result.type === "success" ? <CheckCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" /> : <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />}
                  <span>{result.message}</span>
                </div>
              )}
              <button onClick={submitAIPrompt} disabled={loading || !prompt.trim()} className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-primary-light)] disabled:opacity-50 text-sm font-medium">
                {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Wird geändert...</> : <><Send className="w-4 h-4" /> Anwenden</>}
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
}
