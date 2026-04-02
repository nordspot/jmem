"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Send,
  History,
  RotateCcw,
  Search,
  Bot,
  User,
  CheckCircle,
  AlertCircle,
  Loader2,
  GitCommit,
  Lock,
  FileCode,
  X,
  Paperclip,
  FileText,
  Image as ImageIcon,
} from "lucide-react";

interface Attachment {
  type: "image" | "document";
  media_type: string;
  data: string;
  name: string;
}

interface Message {
  id: string;
  role: "user" | "agent";
  content: string;
  type?: "message" | "committed" | "question" | "error" | "needsFiles";
  commitSha?: string;
  filesChanged?: string[];
  timestamp: Date;
  attachments?: Attachment[];
}

interface Commit {
  sha: string;
  message: string;
  author: string;
  date: string;
  url: string;
  isAgent: boolean;
}

const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB
const ACCEPTED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "application/pdf",
];

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // Remove data URL prefix (data:type;base64,)
      const base64 = result.split(",")[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [secret, setSecret] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState<"agent" | "history">("agent");
  const [commits, setCommits] = useState<Commit[]>([]);
  const [historySearch, setHistorySearch] = useState("");
  const [agentOnly, setAgentOnly] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [reverting, setReverting] = useState<string | null>(null);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatAreaRef = useRef<HTMLDivElement>(null);

  const authHeaders = { Authorization: `Bearer ${secret}` };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const saved = localStorage.getItem("jmem-admin-secret");
    if (saved) {
      setSecret(saved);
      setAuthed(true);
    }
  }, []);

  function handleLogin() {
    localStorage.setItem("jmem-admin-secret", secret);
    setAuthed(true);
  }

  // --- File handling ---

  const processFiles = useCallback(async (files: FileList | File[]) => {
    const newAttachments: Attachment[] = [];
    for (const file of Array.from(files)) {
      if (!ACCEPTED_TYPES.includes(file.type)) {
        alert(`Dateityp nicht unterstuetzt: ${file.type}`);
        continue;
      }
      if (file.size > MAX_FILE_SIZE) {
        alert(`Datei zu gross (max 20MB): ${file.name}`);
        continue;
      }
      const data = await fileToBase64(file);
      newAttachments.push({
        type: file.type.startsWith("image/") ? "image" : "document",
        media_type: file.type,
        data,
        name: file.name,
      });
    }
    setAttachments((prev) => [...prev, ...newAttachments]);
  }, []);

  function removeAttachment(index: number) {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  }

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragOver(false);
      if (e.dataTransfer.files.length > 0) {
        processFiles(e.dataTransfer.files);
      }
    },
    [processFiles]
  );

  // --- History ---

  async function loadHistory() {
    setLoadingHistory(true);
    try {
      const params = new URLSearchParams();
      if (historySearch) params.set("q", historySearch);
      if (agentOnly) params.set("agent", "true");
      const res = await fetch(`/api/admin/history?${params}`, { headers: authHeaders });
      const data = await res.json();
      if (data.commits) setCommits(data.commits);
    } catch (e) {
      console.error("Failed to load history", e);
    }
    setLoadingHistory(false);
  }

  useEffect(() => {
    if (authed && tab === "history") loadHistory();
  }, [tab, authed, agentOnly]);

  async function handleRevert(sha: string) {
    if (!confirm(`Commit ${sha.slice(0, 7)} wirklich rueckgaengig machen?`)) return;
    setReverting(sha);
    try {
      const res = await fetch("/api/admin/rollback", {
        method: "POST",
        headers: { ...authHeaders, "Content-Type": "application/json" },
        body: JSON.stringify({ sha }),
      });
      const data = await res.json();
      if (data.success) {
        alert(`Erfolgreich rueckgaengig gemacht. Neuer Commit: ${data.sha.slice(0, 7)}`);
        loadHistory();
      } else {
        alert(`Fehler: ${data.error}`);
      }
    } catch {
      alert("Rollback fehlgeschlagen");
    }
    setReverting(null);
  }

  // --- Send message ---

  async function sendMessage() {
    if ((!input.trim() && attachments.length === 0) || loading) return;

    const currentAttachments = [...attachments];
    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
      attachments: currentAttachments.length > 0 ? currentAttachments : undefined,
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setAttachments([]);
    setLoading(true);

    try {
      const body: Record<string, unknown> = { prompt: userMsg.content };
      if (currentAttachments.length > 0) {
        body.attachments = currentAttachments;
      }

      const res = await fetch("/api/admin/agent", {
        method: "POST",
        headers: { ...authHeaders, "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (data.error) {
        setMessages((prev) => [
          ...prev,
          { id: crypto.randomUUID(), role: "agent", content: data.error, type: "error", timestamp: new Date() },
        ]);
      } else if (data.type === "needsFiles") {
        setMessages((prev) => [
          ...prev,
          { id: crypto.randomUUID(), role: "agent", content: "Dateien werden gelesen...", type: "message", timestamp: new Date() },
        ]);

        const retryBody: Record<string, unknown> = {
          prompt: data.originalPrompt,
          fileContents: data.files,
        };
        if (currentAttachments.length > 0) {
          retryBody.attachments = currentAttachments;
        }

        const retryRes = await fetch("/api/admin/agent", {
          method: "POST",
          headers: { ...authHeaders, "Content-Type": "application/json" },
          body: JSON.stringify(retryBody),
        });
        const retryData = await retryRes.json();
        addAgentMessage(retryData);
      } else {
        addAgentMessage(data);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { id: crypto.randomUUID(), role: "agent", content: "Verbindungsfehler", type: "error", timestamp: new Date() },
      ]);
    }

    setLoading(false);
  }

  function addAgentMessage(data: Record<string, unknown>) {
    const msg: Message = {
      id: crypto.randomUUID(),
      role: "agent",
      content: (data.message || data.content || "Fertig") as string,
      type: (data.type || "message") as Message["type"],
      commitSha: data.commitSha as string | undefined,
      filesChanged: data.filesChanged as string[] | undefined,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, msg]);
  }

  // Login screen
  if (!authed) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
        <div className="w-full max-w-sm bg-gray-900 rounded-2xl p-8 border border-gray-800">
          <div className="flex items-center justify-center gap-3 mb-8">
            <Lock className="w-8 h-8 text-[var(--color-primary)]" />
            <h1 className="text-2xl font-bold text-white">JMEM Admin</h1>
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleLogin();
            }}
          >
            <input
              type="password"
              placeholder="Admin Secret"
              value={secret}
              onChange={(e) => setSecret(e.target.value)}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm focus:outline-none focus:border-[var(--color-primary)] mb-4"
              autoFocus
            />
            <button
              type="submit"
              className="w-full bg-[var(--color-primary)] text-white font-medium py-3 rounded-xl hover:bg-[var(--color-primary-light)] transition-colors"
            >
              Anmelden
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      {/* Header */}
      <header className="bg-gray-900 border-b border-gray-800 px-4 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Bot className="w-6 h-6 text-[var(--color-primary)]" />
            <h1 className="text-lg font-bold">JMEM CMS Agent</h1>
          </div>
          <div className="flex gap-1 bg-gray-800 rounded-xl p-1">
            <button
              onClick={() => setTab("agent")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                tab === "agent" ? "bg-[var(--color-primary)] text-white" : "text-gray-400 hover:text-white"
              }`}
            >
              <Bot className="w-4 h-4 inline mr-1.5" />
              Agent
            </button>
            <button
              onClick={() => setTab("history")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                tab === "history" ? "bg-[var(--color-primary)] text-white" : "text-gray-400 hover:text-white"
              }`}
            >
              <History className="w-4 h-4 inline mr-1.5" />
              Verlauf
            </button>
            <Link
              href="/admin/cms"
              className="px-4 py-2 rounded-lg text-sm font-medium transition-colors text-gray-400 hover:text-white"
            >
              <FileText className="w-4 h-4 inline mr-1.5" />
              CMS
            </Link>
          </div>
        </div>
      </header>

      {tab === "agent" ? (
        /* Agent Chat */
        <div
          ref={chatAreaRef}
          className={`flex-1 flex flex-col max-w-4xl mx-auto w-full ${
            dragOver ? "ring-2 ring-[var(--color-primary)] ring-inset" : ""
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {/* Drag overlay */}
          {dragOver && (
            <div className="absolute inset-0 bg-[var(--color-primary)]/10 z-10 flex items-center justify-center pointer-events-none">
              <div className="bg-gray-900 border-2 border-dashed border-[var(--color-primary)] rounded-2xl px-8 py-6 text-center">
                <Paperclip className="w-8 h-8 text-[var(--color-primary)] mx-auto mb-2" />
                <p className="text-white font-medium">Dateien hier ablegen</p>
              </div>
            </div>
          )}

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 && (
              <div className="text-center py-20">
                <Bot className="w-16 h-16 text-gray-700 mx-auto mb-4" />
                <h2 className="text-xl font-bold text-gray-400 mb-2">CMS Agent</h2>
                <p className="text-gray-600 text-sm max-w-md mx-auto mb-8">
                  Beschreibe, was du aendern moechtest. Der Agent liest die Dateien, macht die Aenderungen und committet sie automatisch.
                </p>
                <div className="flex flex-wrap gap-2 justify-center max-w-lg mx-auto">
                  {[
                    "Fuege ein neues Buch zum Shop hinzu",
                    "Aktualisiere die DTS-Startdaten",
                    "Aendere die Telefonnummer",
                    "Neues Angebot: Worship Night",
                  ].map((suggestion) => (
                    <button
                      key={suggestion}
                      onClick={() => setInput(suggestion)}
                      className="text-xs px-3 py-2 bg-gray-800 text-gray-400 rounded-lg hover:bg-gray-700 hover:text-white transition-colors"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 ${msg.role === "user" ? "justify-end" : ""}`}
              >
                {msg.role === "agent" && (
                  <div className="w-8 h-8 rounded-full bg-[var(--color-primary)]/20 flex items-center justify-center shrink-0 mt-1">
                    <Bot className="w-4 h-4 text-[var(--color-primary)]" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                    msg.role === "user"
                      ? "bg-[var(--color-primary)] text-white"
                      : msg.type === "error"
                        ? "bg-red-900/30 border border-red-800 text-red-300"
                        : msg.type === "committed"
                          ? "bg-green-900/30 border border-green-800 text-green-300"
                          : "bg-gray-800 text-gray-200"
                  }`}
                >
                  {/* Show attachment previews in user messages */}
                  {msg.attachments && msg.attachments.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-2">
                      {msg.attachments.map((att, i) => (
                        <div key={i} className="relative">
                          {att.type === "image" ? (
                            <img
                              src={`data:${att.media_type};base64,${att.data}`}
                              alt={att.name}
                              className="w-16 h-16 rounded-lg object-cover"
                            />
                          ) : (
                            <div className="flex items-center gap-1.5 bg-white/10 rounded-lg px-2.5 py-1.5">
                              <FileText className="w-3.5 h-3.5" />
                              <span className="text-xs truncate max-w-[100px]">{att.name}</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                  <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                  {msg.type === "committed" && (
                    <div className="mt-3 space-y-2">
                      {msg.commitSha && (
                        <div className="flex items-center gap-2 text-xs text-green-400">
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>Commit: {msg.commitSha.slice(0, 7)}</span>
                        </div>
                      )}
                      {msg.filesChanged && msg.filesChanged.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {msg.filesChanged.map((f) => (
                            <span key={f} className="text-xs bg-green-900/50 text-green-400 px-2 py-0.5 rounded">
                              <FileCode className="w-3 h-3 inline mr-1" />
                              {f.split("/").pop()}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
                {msg.role === "user" && (
                  <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center shrink-0 mt-1">
                    <User className="w-4 h-4 text-gray-300" />
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-[var(--color-primary)]/20 flex items-center justify-center shrink-0">
                  <Loader2 className="w-4 h-4 text-[var(--color-primary)] animate-spin" />
                </div>
                <div className="bg-gray-800 rounded-2xl px-4 py-3">
                  <p className="text-sm text-gray-400">Arbeitet...</p>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Attachment previews */}
          {attachments.length > 0 && (
            <div className="px-4 pt-2 flex flex-wrap gap-2">
              {attachments.map((att, i) => (
                <div
                  key={i}
                  className="relative group bg-gray-800 rounded-lg border border-gray-700 overflow-hidden"
                >
                  {att.type === "image" ? (
                    <img
                      src={`data:${att.media_type};base64,${att.data}`}
                      alt={att.name}
                      className="w-16 h-16 object-cover"
                    />
                  ) : (
                    <div className="w-16 h-16 flex flex-col items-center justify-center p-1">
                      <FileText className="w-5 h-5 text-gray-400 mb-1" />
                      <span className="text-[10px] text-gray-500 truncate w-full text-center">
                        {att.name}
                      </span>
                    </div>
                  )}
                  <button
                    onClick={() => removeAttachment(i)}
                    className="absolute -top-1 -right-1 w-5 h-5 bg-red-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3 h-3 text-white" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="p-4 border-t border-gray-800">
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept={ACCEPTED_TYPES.join(",")}
              className="hidden"
              onChange={(e) => {
                if (e.target.files) processFiles(e.target.files);
                e.target.value = "";
              }}
            />
            <form
              onSubmit={(e) => {
                e.preventDefault();
                sendMessage();
              }}
              className="flex gap-3"
            >
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-3 bg-gray-800 border border-gray-700 rounded-xl text-gray-400 hover:text-white hover:border-gray-600 transition-colors"
                title="Datei anhaengen"
              >
                <Paperclip className="w-5 h-5" />
              </button>
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
                placeholder="Was moechtest du aendern?"
                rows={1}
                className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm resize-none focus:outline-none focus:border-[var(--color-primary)]"
              />
              <button
                type="submit"
                disabled={loading || (!input.trim() && attachments.length === 0)}
                className="px-4 py-3 bg-[var(--color-primary)] text-white rounded-xl hover:bg-[var(--color-primary-light)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-5 h-5" />
              </button>
            </form>
          </div>
        </div>
      ) : (
        /* History Tab */
        <div className="flex-1 max-w-4xl mx-auto w-full p-4">
          {/* Search */}
          <div className="flex gap-3 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                placeholder="Commits durchsuchen..."
                value={historySearch}
                onChange={(e) => setHistorySearch(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && loadHistory()}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm focus:outline-none focus:border-[var(--color-primary)]"
              />
            </div>
            <button
              onClick={() => setAgentOnly(!agentOnly)}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                agentOnly ? "bg-[var(--color-primary)] text-white" : "bg-gray-800 text-gray-400 border border-gray-700"
              }`}
            >
              <Bot className="w-4 h-4 inline mr-1" />
              Nur Agent
            </button>
            <button
              onClick={loadHistory}
              className="px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-gray-400 hover:text-white transition-colors"
            >
              <Search className="w-4 h-4" />
            </button>
          </div>

          {/* Commits */}
          {loadingHistory ? (
            <div className="text-center py-20">
              <Loader2 className="w-8 h-8 text-[var(--color-primary)] animate-spin mx-auto" />
            </div>
          ) : (
            <div className="space-y-2">
              {commits.map((commit) => (
                <div
                  key={commit.sha}
                  className={`bg-gray-900 border rounded-xl p-4 ${
                    commit.isAgent ? "border-[var(--color-primary)]/30" : "border-gray-800"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <GitCommit className="w-4 h-4 text-gray-500 shrink-0" />
                        <code className="text-xs text-gray-500">{commit.sha.slice(0, 7)}</code>
                        {commit.isAgent && (
                          <span className="text-xs bg-[var(--color-primary)]/20 text-[var(--color-primary)] px-2 py-0.5 rounded">
                            Agent
                          </span>
                        )}
                        <span className="text-xs text-gray-600">
                          {new Date(commit.date).toLocaleString("de-CH")}
                        </span>
                      </div>
                      <p className="text-sm text-gray-300 truncate">{commit.message}</p>
                      <p className="text-xs text-gray-600 mt-1">{commit.author}</p>
                    </div>
                    {commit.isAgent && (
                      <button
                        onClick={() => handleRevert(commit.sha)}
                        disabled={reverting === commit.sha}
                        className="px-3 py-1.5 bg-red-900/30 border border-red-800 text-red-400 rounded-lg text-xs font-medium hover:bg-red-900/50 transition-colors disabled:opacity-50 shrink-0"
                      >
                        {reverting === commit.sha ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : (
                          <>
                            <RotateCcw className="w-3 h-3 inline mr-1" />
                            Rueckgaengig
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              ))}
              {commits.length === 0 && (
                <div className="text-center py-20 text-gray-600">
                  <History className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p className="text-sm">Keine Commits gefunden</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
