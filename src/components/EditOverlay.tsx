"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Pencil, X, Send, Loader2, CheckCircle, Wand2, Type, ImageIcon, Save } from "lucide-react";

interface SelectedElement {
  rect: DOMRect;
  el: HTMLElement;
  path: string;
  section: string;
  content: string;
}

type EditMode = "toolbar" | "text" | "ai";

export function EditOverlay() {
  const [enabled, setEnabled] = useState(false);
  const [adminSecret, setAdminSecret] = useState<string | null>(null);
  const [hovered, setHovered] = useState<DOMRect | null>(null);
  const [selected, setSelected] = useState<SelectedElement | null>(null);
  const [editMode, setEditMode] = useState<EditMode>("toolbar");
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [editedText, setEditedText] = useState("");
  const promptRef = useRef<HTMLTextAreaElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

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
      const target = e.target as HTMLElement;
      const editable = findEditableParent(target);
      if (editable) {
        setHovered(editable.getBoundingClientRect());
      } else {
        setHovered(null);
      }
    },
    [enabled, selected, loading, findEditableParent]
  );

  const handleClick = useCallback(
    (e: MouseEvent) => {
      if (!enabled || loading) return;
      const target = e.target as HTMLElement;
      if (overlayRef.current?.contains(target)) return;

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
        });
        setEditedText(editable.innerText || "");
        setEditMode("toolbar");
        setHovered(null);
        setResult(null);
        setPrompt("");
      } else {
        setSelected(null);
      }
    },
    [enabled, loading, findEditableParent]
  );

  useEffect(() => {
    if (enabled) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("click", handleClick, true);
      document.body.style.cursor = "crosshair";
    } else {
      document.body.style.cursor = "";
    }
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("click", handleClick, true);
      document.body.style.cursor = "";
    };
  }, [enabled, handleMouseMove, handleClick]);

  // Enable contentEditable for inline text editing
  function startTextEdit() {
    if (!selected) return;
    setEditMode("text");
    selected.el.contentEditable = "true";
    selected.el.focus();
    selected.el.style.outline = "2px solid var(--color-primary)";
    selected.el.style.outlineOffset = "2px";
  }

  function saveTextEdit() {
    if (!selected || !adminSecret) return;
    const newText = selected.el.innerText || "";
    selected.el.contentEditable = "false";
    selected.el.style.outline = "";
    selected.el.style.outlineOffset = "";

    // Send the text change to the agent
    const contextPrompt = `Der Benutzer hat auf der Live-Website den Text in folgendem Bereich direkt bearbeitet:

**Datei:** ${selected.path}
**Bereich:** ${selected.section}

**Alter Text:**
${selected.content}

**Neuer Text:**
${newText}

Bitte lies die Datei "${selected.path}" und ersetze den alten Text durch den neuen Text. Behalte die Code-Struktur bei.`;

    submitToAgent(contextPrompt);
  }

  function cancelTextEdit() {
    if (!selected) return;
    selected.el.contentEditable = "false";
    selected.el.style.outline = "";
    selected.el.style.outlineOffset = "";
    selected.el.innerText = selected.content;
    setEditMode("toolbar");
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
        const retryData = await retryRes.json();
        setResult({
          type: retryData.type === "committed" ? "success" : retryData.type === "error" ? "error" : "success",
          message: retryData.message || retryData.content || "Fertig",
        });
        if (retryData.type === "committed") setPrompt("");
      } else if (data.type === "committed") {
        setResult({ type: "success", message: data.message || "Gespeichert! Seite wird in ~1 Min. aktualisiert." });
        setPrompt("");
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
    const contextPrompt = `Der Benutzer hat auf der Live-Website folgendes Element ausgewählt:

**Datei:** ${selected.path}
**Bereich:** ${selected.section}
**Aktueller sichtbarer Text:**
${selected.content}

**Gewünschte Änderung:**
${prompt}

Bitte lies zuerst die Datei "${selected.path}" und mache dann die gewünschte Änderung nur in dem beschriebenen Bereich "${selected.section}".`;

    submitToAgent(contextPrompt);
  }

  if (!adminSecret) return null;

  return (
    <>
      {/* Toggle button */}
      <button
        onClick={() => {
          setEnabled(!enabled);
          setSelected(null);
          setHovered(null);
          setResult(null);
          setEditMode("toolbar");
        }}
        className={`fixed bottom-6 left-6 z-[9999] flex items-center gap-2 px-4 py-3 rounded-full shadow-lg transition-all text-sm font-medium ${
          enabled ? "bg-[var(--color-accent)] text-white" : "bg-gray-900 text-white hover:bg-gray-800"
        }`}
      >
        {enabled ? <><X className="w-4 h-4" /> Edit-Modus beenden</> : <><Pencil className="w-4 h-4" /> Edit-Modus</>}
      </button>

      {/* Hover highlight */}
      {enabled && hovered && !selected && (
        <div
          className="fixed z-[9990] pointer-events-none border-2 border-[var(--color-accent)] rounded-lg transition-all duration-75"
          style={{ top: hovered.top - 2, left: hovered.left - 2, width: hovered.width + 4, height: hovered.height + 4 }}
        >
          <div className="absolute -top-7 left-0 bg-[var(--color-accent)] text-white text-xs px-2 py-1 rounded whitespace-nowrap">
            Klicken zum Bearbeiten
          </div>
        </div>
      )}

      {/* Selected element */}
      {enabled && selected && (
        <>
          {/* Selection outline */}
          <div
            className="fixed z-[9990] pointer-events-none border-2 border-[var(--color-primary)] rounded-lg"
            style={{ top: selected.rect.top - 2, left: selected.rect.left - 2, width: selected.rect.width + 4, height: selected.rect.height + 4 }}
          />

          {/* Floating toolbar */}
          <div
            ref={overlayRef}
            className="fixed z-[9999] bg-gray-900 rounded-2xl shadow-2xl border border-gray-700 overflow-hidden"
            style={{
              width: editMode === "toolbar" ? "auto" : "24rem",
              maxWidth: "90vw",
              top: Math.min(selected.rect.bottom + 12, window.innerHeight - (editMode === "toolbar" ? 80 : 320)),
              left: Math.max(8, Math.min(selected.rect.left, window.innerWidth - (editMode === "toolbar" ? 300 : 400))),
            }}
          >
            {/* Mode: Toolbar — choose what to do */}
            {editMode === "toolbar" && (
              <div className="flex items-center gap-1 p-2">
                <span className="text-xs text-gray-500 px-2 mr-1">
                  {selected.path.split("/").pop()}
                </span>
                <button
                  onClick={startTextEdit}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium text-white bg-gray-800 hover:bg-gray-700 transition-colors"
                  title="Text direkt bearbeiten"
                >
                  <Type className="w-3.5 h-3.5" /> Text bearbeiten
                </button>
                <button
                  onClick={() => { setEditMode("ai"); setTimeout(() => promptRef.current?.focus(), 100); }}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium text-white bg-[var(--color-primary)] hover:bg-[var(--color-primary-light)] transition-colors"
                  title="AI-Assistent"
                >
                  <Wand2 className="w-3.5 h-3.5" /> AI ändern
                </button>
                <button
                  onClick={() => { setSelected(null); setResult(null); }}
                  className="p-2 text-gray-500 hover:text-white rounded-lg"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Mode: Text editing — inline contentEditable active */}
            {editMode === "text" && (
              <div className="p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-gray-400 flex items-center gap-1.5">
                    <Type className="w-3.5 h-3.5" /> Text wird bearbeitet...
                  </span>
                  <button onClick={() => { cancelTextEdit(); }} className="text-gray-500 hover:text-white">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-xs text-gray-500 mb-3">Bearbeite den Text direkt auf der Seite, dann klicke Speichern.</p>

                {result && (
                  <div className={`flex items-start gap-2 p-2 rounded-lg mb-3 text-xs ${
                    result.type === "success" ? "bg-green-900/30 text-green-400" : "bg-red-900/30 text-red-400"
                  }`}>
                    {result.type === "success" ? <CheckCircle className="w-3.5 h-3.5 shrink-0" /> : <X className="w-3.5 h-3.5 shrink-0" />}
                    <span>{result.message}</span>
                  </div>
                )}

                <div className="flex gap-2">
                  <button
                    onClick={saveTextEdit}
                    disabled={loading}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-[var(--color-primary)] text-white rounded-lg text-xs font-medium hover:bg-[var(--color-primary-light)] disabled:opacity-50"
                  >
                    {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                    Speichern
                  </button>
                  <button
                    onClick={cancelTextEdit}
                    className="px-3 py-2 bg-gray-800 text-gray-300 rounded-lg text-xs font-medium hover:bg-gray-700"
                  >
                    Abbrechen
                  </button>
                </div>
              </div>
            )}

            {/* Mode: AI prompt */}
            {editMode === "ai" && (
              <div className="p-4 w-96 max-w-[90vw]">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Wand2 className="w-4 h-4 text-[var(--color-primary)]" />
                    <span className="text-xs font-medium text-gray-400">
                      AI-Assistent
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setEditMode("toolbar")}
                      className="text-xs text-gray-500 hover:text-white px-2 py-1"
                    >
                      Zurück
                    </button>
                    <button onClick={() => { setSelected(null); setResult(null); }} className="text-gray-500 hover:text-white">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="bg-gray-800 rounded-lg p-2 mb-3 max-h-16 overflow-y-auto">
                  <p className="text-xs text-gray-400 line-clamp-2">
                    {selected.content.slice(0, 150)}{selected.content.length > 150 && "..."}
                  </p>
                </div>

                <textarea
                  ref={promptRef}
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); submitAIPrompt(); } }}
                  placeholder="Was möchtest du hier ändern?"
                  rows={2}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm resize-none focus:outline-none focus:border-[var(--color-primary)] mb-3"
                />

                {result && (
                  <div className={`flex items-start gap-2 p-2 rounded-lg mb-3 text-xs ${
                    result.type === "success" ? "bg-green-900/30 text-green-400" : "bg-red-900/30 text-red-400"
                  }`}>
                    {result.type === "success" ? <CheckCircle className="w-3.5 h-3.5 shrink-0" /> : <X className="w-3.5 h-3.5 shrink-0" />}
                    <span>{result.message}</span>
                  </div>
                )}

                <button
                  onClick={submitAIPrompt}
                  disabled={loading || !prompt.trim()}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-primary-light)] transition-colors disabled:opacity-50 text-sm font-medium"
                >
                  {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Wird geändert...</> : <><Send className="w-4 h-4" /> Änderung anwenden</>}
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
}
