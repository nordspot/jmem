"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Pencil, X, Send, Loader2, CheckCircle, Wand2 } from "lucide-react";

interface SelectedElement {
  rect: DOMRect;
  path: string;
  section: string;
  content: string;
  html: string;
}

export function EditOverlay() {
  const [enabled, setEnabled] = useState(false);
  const [adminSecret, setAdminSecret] = useState<string | null>(null);
  const [hovered, setHovered] = useState<DOMRect | null>(null);
  const [selected, setSelected] = useState<SelectedElement | null>(null);
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ type: "success" | "error"; message: string } | null>(null);
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
          rect: editable.getBoundingClientRect(),
          path: editable.dataset.editPath || "",
          section: editable.dataset.editSection || "",
          content: editable.innerText?.slice(0, 500) || "",
          html: editable.innerHTML?.slice(0, 1000) || "",
        });
        setHovered(null);
        setTimeout(() => promptRef.current?.focus(), 100);
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

  async function submitChange() {
    if (!prompt.trim() || !selected || !adminSecret) return;
    setLoading(true);
    setResult(null);

    const contextPrompt = `
Der Benutzer hat auf der Live-Website folgendes Element ausgewählt:

**Datei:** ${selected.path}
**Bereich:** ${selected.section}
**Aktueller sichtbarer Text:**
${selected.content}

**Gewünschte Änderung:**
${prompt}

Bitte lies zuerst die Datei "${selected.path}" und mache dann die gewünschte Änderung nur in dem beschriebenen Bereich "${selected.section}".
    `.trim();

    try {
      const res = await fetch("/api/admin/agent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${adminSecret}`,
        },
        body: JSON.stringify({ prompt: contextPrompt }),
      });

      const data = await res.json();

      if (data.error) {
        setResult({ type: "error", message: data.error });
      } else if (data.type === "needsFiles") {
        const retryRes = await fetch("/api/admin/agent", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${adminSecret}`,
          },
          body: JSON.stringify({ prompt: contextPrompt, fileContents: data.files }),
        });
        const retryData = await retryRes.json();
        if (retryData.type === "committed") {
          setResult({
            type: "success",
            message: retryData.message || "Änderung gespeichert! Seite wird in ~1 Minute aktualisiert.",
          });
          setPrompt("");
        } else {
          setResult({
            type: retryData.type === "error" ? "error" : "success",
            message: retryData.content || retryData.message || "Fertig",
          });
        }
      } else if (data.type === "committed") {
        setResult({
          type: "success",
          message: data.message || "Änderung gespeichert! Seite wird in ~1 Minute aktualisiert.",
        });
        setPrompt("");
      } else {
        setResult({
          type: "success",
          message: data.content || data.message || "Fertig",
        });
      }
    } catch {
      setResult({ type: "error", message: "Verbindungsfehler" });
    }
    setLoading(false);
  }

  // ALL hooks are above — safe to return early now
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
        }}
        className={`fixed bottom-6 left-6 z-[9999] flex items-center gap-2 px-4 py-3 rounded-full shadow-lg transition-all text-sm font-medium ${
          enabled
            ? "bg-[var(--color-accent)] text-white"
            : "bg-gray-900 text-white hover:bg-gray-800"
        }`}
      >
        {enabled ? (
          <><X className="w-4 h-4" /> Edit-Modus beenden</>
        ) : (
          <><Pencil className="w-4 h-4" /> Edit-Modus</>
        )}
      </button>

      {/* Hover highlight */}
      {enabled && hovered && !selected && (
        <div
          className="fixed z-[9990] pointer-events-none border-2 border-[var(--color-accent)] rounded-lg"
          style={{
            top: hovered.top - 2,
            left: hovered.left - 2,
            width: hovered.width + 4,
            height: hovered.height + 4,
          }}
        >
          <div className="absolute -top-6 left-0 bg-[var(--color-accent)] text-white text-xs px-2 py-0.5 rounded">
            Klicken zum Bearbeiten
          </div>
        </div>
      )}

      {/* Selected element + prompt */}
      {enabled && selected && (
        <>
          <div
            className="fixed z-[9990] pointer-events-none border-2 border-[var(--color-primary)] rounded-lg bg-[var(--color-primary)]/5"
            style={{
              top: selected.rect.top - 2,
              left: selected.rect.left - 2,
              width: selected.rect.width + 4,
              height: selected.rect.height + 4,
            }}
          />

          <div
            ref={overlayRef}
            className="fixed z-[9999] w-96 max-w-[90vw] bg-gray-900 rounded-2xl shadow-2xl border border-gray-700 overflow-hidden"
            style={{
              top: Math.min(selected.rect.bottom + 12, window.innerHeight - 280),
              left: Math.max(8, Math.min(selected.rect.left, window.innerWidth - 400)),
            }}
          >
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Wand2 className="w-4 h-4 text-[var(--color-primary)]" />
                  <span className="text-xs font-medium text-gray-400">
                    {selected.path.split("/").pop()}
                    {selected.section && ` → ${selected.section}`}
                  </span>
                </div>
                <button onClick={() => { setSelected(null); setResult(null); }} className="text-gray-500 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="bg-gray-800 rounded-lg p-2 mb-3 max-h-20 overflow-y-auto">
                <p className="text-xs text-gray-400 line-clamp-3">
                  {selected.content.slice(0, 200)}{selected.content.length > 200 && "..."}
                </p>
              </div>

              <textarea
                ref={promptRef}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); submitChange(); } }}
                placeholder="Was möchtest du hier ändern?"
                rows={2}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm resize-none focus:outline-none focus:border-[var(--color-primary)] mb-3"
              />

              {result && (
                <div className={`flex items-start gap-2 p-2 rounded-lg mb-3 text-xs ${
                  result.type === "success" ? "bg-green-900/30 text-green-400" : "bg-red-900/30 text-red-400"
                }`}>
                  {result.type === "success" ? <CheckCircle className="w-3.5 h-3.5 mt-0.5 shrink-0" /> : <X className="w-3.5 h-3.5 mt-0.5 shrink-0" />}
                  <span>{result.message}</span>
                </div>
              )}

              <button
                onClick={submitChange}
                disabled={loading || !prompt.trim()}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-primary-light)] transition-colors disabled:opacity-50 text-sm font-medium"
              >
                {loading ? (<><Loader2 className="w-4 h-4 animate-spin" /> Wird geändert...</>) : (<><Send className="w-4 h-4" /> Änderung anwenden</>)}
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}
