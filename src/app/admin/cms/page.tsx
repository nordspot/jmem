"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Bot,
  GraduationCap,
  ShoppingBag,
  Gift,
  FileText,
  Settings,
  Save,
  Loader2,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  Plus,
  Trash2,
  Lock,
  ChevronRight,
} from "lucide-react";

// --- Types ---

interface School {
  slug: string;
  shortName: string;
  title: string;
  description: string;
  descriptionLong?: string;
  startDate?: string;
  endDate?: string;
  price?: string;
  duration?: string;
  language?: string;
  credits?: string;
  accredited: boolean;
}

interface Product {
  sku: string;
  name: string;
  price: number;
  description: string;
  image: string;
  category: string;
  inStock: boolean;
}

interface Offering {
  title: string;
  description: string;
  image: string;
  category: string;
}

type Tab = "schulen" | "produkte" | "angebote" | "seiten" | "einstellungen";

const TABS: { key: Tab; label: string; icon: React.ReactNode }[] = [
  { key: "schulen", label: "Schulen", icon: <GraduationCap className="w-4 h-4" /> },
  { key: "produkte", label: "Produkte", icon: <ShoppingBag className="w-4 h-4" /> },
  { key: "angebote", label: "Angebote", icon: <Gift className="w-4 h-4" /> },
  { key: "seiten", label: "Seiten", icon: <FileText className="w-4 h-4" /> },
  { key: "einstellungen", label: "Einstellungen", icon: <Settings className="w-4 h-4" /> },
];

// --- Parsers ---

function parseSchools(content: string): School[] {
  try {
    const match = content.match(/export\s+const\s+schools:\s*School\[\]\s*=\s*(\[[\s\S]*\]);/);
    if (!match) return [];
    const cleaned = match[1]
      .replace(/\/\/.*/g, "")
      .replace(/,(\s*[\]}])/g, "$1")
      .replace(/(\w+)\s*:/g, '"$1":')
      .replace(/'/g, '"');
    return JSON.parse(cleaned);
  } catch {
    return [];
  }
}

function parseProducts(content: string): Product[] {
  try {
    const match = content.match(/export\s+const\s+products:\s*Product\[\]\s*=\s*(\[[\s\S]*\]);/);
    if (!match) return [];
    const cleaned = match[1]
      .replace(/\/\/.*/g, "")
      .replace(/,(\s*[\]}])/g, "$1")
      .replace(/(\w+)\s*:/g, '"$1":')
      .replace(/'/g, '"');
    return JSON.parse(cleaned);
  } catch {
    return [];
  }
}

function parseOfferings(content: string): Offering[] {
  try {
    const match = content.match(/const\s+offerings\s*=\s*(\[[\s\S]*?\]);/);
    if (!match) return [];
    const cleaned = match[1]
      .replace(/\/\/.*/g, "")
      .replace(/,(\s*[\]}])/g, "$1")
      .replace(/(\w+)\s*:/g, '"$1":')
      .replace(/'/g, '"');
    return JSON.parse(cleaned);
  } catch {
    return [];
  }
}

function parseDeTranslations(content: string): Record<string, unknown> {
  try {
    const match = content.match(/export\s+const\s+de\s*=\s*(\{[\s\S]*\});/);
    if (!match) return {};
    const cleaned = match[1]
      .replace(/\/\/.*/g, "")
      .replace(/,(\s*[\]}])/g, "$1")
      .replace(/(\w+)\s*:/g, '"$1":')
      .replace(/'/g, '"');
    return JSON.parse(cleaned);
  } catch {
    return {};
  }
}

// --- Components ---

function InputField({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  multiline,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  multiline?: boolean;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-400 mb-1">{label}</label>
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={3}
          className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm resize-none focus:outline-none focus:border-[var(--color-primary)]"
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-[var(--color-primary)]"
        />
      )}
    </div>
  );
}

function CheckboxField({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex items-center gap-2 cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="w-4 h-4 rounded bg-gray-800 border-gray-700 text-[var(--color-primary)] focus:ring-[var(--color-primary)]"
      />
      <span className="text-sm text-gray-300">{label}</span>
    </label>
  );
}

// --- School Editor ---

function SchoolEditor({
  school,
  onSave,
  onCancel,
  saving,
}: {
  school: School;
  onSave: (s: School) => void;
  onCancel: () => void;
  saving: boolean;
}) {
  const [data, setData] = useState<School>({ ...school });
  const set = <K extends keyof School>(key: K, val: School[K]) =>
    setData((prev) => ({ ...prev, [key]: val }));

  return (
    <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-white">{school.shortName} bearbeiten</h3>
        <button onClick={onCancel} className="text-gray-500 hover:text-white text-sm">
          Abbrechen
        </button>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <InputField label="Titel" value={data.title} onChange={(v) => set("title", v)} />
        <InputField label="Kurzname" value={data.shortName} onChange={(v) => set("shortName", v)} />
        <div className="md:col-span-2">
          <InputField label="Beschreibung" value={data.description} onChange={(v) => set("description", v)} multiline />
        </div>
        <div className="md:col-span-2">
          <InputField
            label="Ausf. Beschreibung"
            value={data.descriptionLong || ""}
            onChange={(v) => set("descriptionLong", v)}
            multiline
          />
        </div>
        <InputField label="Startdatum" value={data.startDate || ""} onChange={(v) => set("startDate", v)} />
        <InputField label="Enddatum" value={data.endDate || ""} onChange={(v) => set("endDate", v)} />
        <InputField label="Preis" value={data.price || ""} onChange={(v) => set("price", v)} />
        <InputField label="Dauer" value={data.duration || ""} onChange={(v) => set("duration", v)} />
        <InputField label="Sprache" value={data.language || ""} onChange={(v) => set("language", v)} />
        <InputField label="Credits" value={data.credits || ""} onChange={(v) => set("credits", v)} />
        <CheckboxField label="Akkreditiert" checked={data.accredited} onChange={(v) => set("accredited", v)} />
      </div>
      <div className="flex justify-end mt-6">
        <button
          onClick={() => onSave(data)}
          disabled={saving}
          className="flex items-center gap-2 px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-primary-light)] transition-colors disabled:opacity-50"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Speichern
        </button>
      </div>
    </div>
  );
}

// --- Product Editor ---

function ProductEditor({
  product,
  onSave,
  onCancel,
  onDelete,
  saving,
  isNew,
}: {
  product: Product;
  onSave: (p: Product) => void;
  onCancel: () => void;
  onDelete?: () => void;
  saving: boolean;
  isNew?: boolean;
}) {
  const [data, setData] = useState<Product>({ ...product });
  const set = <K extends keyof Product>(key: K, val: Product[K]) =>
    setData((prev) => ({ ...prev, [key]: val }));

  const categories = ["books", "music", "kids", "tricks"];

  return (
    <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-white">{isNew ? "Neues Produkt" : `${product.name} bearbeiten`}</h3>
        <div className="flex items-center gap-3">
          {onDelete && !isNew && (
            <button
              onClick={onDelete}
              className="flex items-center gap-1 text-red-400 hover:text-red-300 text-sm"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Loeschen
            </button>
          )}
          <button onClick={onCancel} className="text-gray-500 hover:text-white text-sm">
            Abbrechen
          </button>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <InputField label="Name" value={data.name} onChange={(v) => set("name", v)} />
        <InputField label="SKU" value={data.sku} onChange={(v) => set("sku", v)} />
        <InputField
          label="Preis (CHF)"
          value={String(data.price)}
          onChange={(v) => set("price", parseFloat(v) || 0)}
          type="number"
        />
        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1">Kategorie</label>
          <select
            value={data.category}
            onChange={(e) => set("category", e.target.value)}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-[var(--color-primary)]"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div className="md:col-span-2">
          <InputField label="Beschreibung" value={data.description} onChange={(v) => set("description", v)} multiline />
        </div>
        <InputField label="Bild-Pfad" value={data.image} onChange={(v) => set("image", v)} />
        <CheckboxField label="Auf Lager" checked={data.inStock} onChange={(v) => set("inStock", v)} />
      </div>
      <div className="flex justify-end mt-6">
        <button
          onClick={() => onSave(data)}
          disabled={saving}
          className="flex items-center gap-2 px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-primary-light)] transition-colors disabled:opacity-50"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Speichern
        </button>
      </div>
    </div>
  );
}

// --- Offering Editor ---

function OfferingEditor({
  offering,
  onSave,
  onCancel,
  saving,
}: {
  offering: Offering;
  onSave: (o: Offering) => void;
  onCancel: () => void;
  saving: boolean;
}) {
  const [data, setData] = useState<Offering>({ ...offering });
  const set = <K extends keyof Offering>(key: K, val: Offering[K]) =>
    setData((prev) => ({ ...prev, [key]: val }));

  const categories = ["Familie", "Paare", "Kinder", "Workshop", "Seminar", "Tour", "Erfahrung", "Service"];

  return (
    <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-white">{offering.title} bearbeiten</h3>
        <button onClick={onCancel} className="text-gray-500 hover:text-white text-sm">
          Abbrechen
        </button>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <InputField label="Titel" value={data.title} onChange={(v) => set("title", v)} />
        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1">Kategorie</label>
          <select
            value={data.category}
            onChange={(e) => set("category", e.target.value)}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-[var(--color-primary)]"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div className="md:col-span-2">
          <InputField label="Beschreibung" value={data.description} onChange={(v) => set("description", v)} multiline />
        </div>
        <InputField label="Bild-Pfad" value={data.image} onChange={(v) => set("image", v)} />
      </div>
      <div className="flex justify-end mt-6">
        <button
          onClick={() => onSave(data)}
          disabled={saving}
          className="flex items-center gap-2 px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-primary-light)] transition-colors disabled:opacity-50"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Speichern
        </button>
      </div>
    </div>
  );
}

// --- Main CMS Page ---

export default function CmsPage() {
  const [authed, setAuthed] = useState(false);
  const [secret, setSecret] = useState("");
  const [activeTab, setActiveTab] = useState<Tab>("schulen");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Raw file contents
  const [rawFiles, setRawFiles] = useState<Record<string, string>>({});

  // Parsed data
  const [schools, setSchools] = useState<School[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [offerings, setOfferings] = useState<Offering[]>([]);
  const [translations, setTranslations] = useState<Record<string, unknown>>({});

  // Editor state
  const [editingSchool, setEditingSchool] = useState<School | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingOffering, setEditingOffering] = useState<Offering | null>(null);
  const [isNewProduct, setIsNewProduct] = useState(false);

  // Page content editing
  const [heroWelcome, setHeroWelcome] = useState("");
  const [heroTagline, setHeroTagline] = useState("");
  const [heroSubtitle, setHeroSubtitle] = useState("");
  const [ctaDTS, setCtaDTS] = useState("");
  const [ctaAngebote, setCtaAngebote] = useState("");

  // Settings
  const [settingsOrgName, setSettingsOrgName] = useState("Jugend mit einer Mission");
  const [settingsAddress, setSettingsAddress] = useState("");
  const [settingsPhone, setSettingsPhone] = useState("");
  const [settingsEmail, setSettingsEmail] = useState("");

  const authHeaders = { Authorization: `Bearer ${secret}` };

  useEffect(() => {
    const saved = localStorage.getItem("jmem-admin-secret");
    if (saved) {
      setSecret(saved);
      setAuthed(true);
    }
  }, []);

  useEffect(() => {
    if (authed) loadContent();
  }, [authed]);

  function showFeedback(type: "success" | "error", message: string) {
    setFeedback({ type, message });
    setTimeout(() => setFeedback(null), 4000);
  }

  async function loadContent() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/cms", { headers: authHeaders });
      const data = await res.json();
      if (data.error) {
        showFeedback("error", data.error);
        setLoading(false);
        return;
      }

      const files = data.files as Record<string, string>;
      setRawFiles(files);

      if (files["src/lib/schools.ts"]) {
        setSchools(parseSchools(files["src/lib/schools.ts"]));
      }
      if (files["src/lib/products.ts"]) {
        setProducts(parseProducts(files["src/lib/products.ts"]));
      }
      if (files["src/app/angebote/page.tsx"]) {
        setOfferings(parseOfferings(files["src/app/angebote/page.tsx"]));
      }
      if (files["src/lib/i18n/de.ts"]) {
        const t = parseDeTranslations(files["src/lib/i18n/de.ts"]);
        setTranslations(t);
        const hero = t.hero as Record<string, string> | undefined;
        if (hero) {
          setHeroWelcome(hero.welcome || "");
          setHeroTagline(hero.tagline || "");
          setHeroSubtitle(hero.subtitle || "");
          setCtaDTS(hero.ctaDTS || "");
          setCtaAngebote(hero.ctaAngebote || "");
        }
        const contact = t.contact as Record<string, string> | undefined;
        if (contact) {
          setSettingsAddress(contact.address || "");
          setSettingsPhone(contact.phone || "");
          setSettingsEmail(contact.email || "");
        }
        const footer = t.footer as Record<string, string> | undefined;
        if (footer) {
          setSettingsOrgName(footer.orgName || "Jugend mit einer Mission");
        }
      }
    } catch {
      showFeedback("error", "Fehler beim Laden der Inhalte");
    }
    setLoading(false);
  }

  async function saveViaAgent(prompt: string) {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/agent", {
        method: "POST",
        headers: { ...authHeaders, "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();

      if (data.error) {
        showFeedback("error", data.error);
      } else if (data.type === "needsFiles") {
        // Auto-retry with file contents
        const retryRes = await fetch("/api/admin/agent", {
          method: "POST",
          headers: { ...authHeaders, "Content-Type": "application/json" },
          body: JSON.stringify({ prompt, fileContents: data.files }),
        });
        const retryData = await retryRes.json();
        if (retryData.error) {
          showFeedback("error", retryData.error);
        } else {
          showFeedback("success", retryData.message || "Gespeichert!");
          await loadContent();
        }
      } else if (data.type === "committed") {
        showFeedback("success", data.message || "Gespeichert!");
        await loadContent();
      } else {
        showFeedback("success", data.message || data.content || "Gespeichert!");
        await loadContent();
      }
    } catch {
      showFeedback("error", "Speichern fehlgeschlagen");
    }
    setSaving(false);
  }

  function handleSaveSchool(updated: School) {
    const schoolJson = JSON.stringify(updated, null, 2);
    saveViaAgent(
      `Update the school with slug "${updated.slug}" in src/lib/schools.ts. Replace its data with the following values: ${schoolJson}. Keep the same TypeScript format, interfaces, and other schools unchanged.`
    );
    setEditingSchool(null);
  }

  function handleSaveProduct(updated: Product) {
    const productJson = JSON.stringify(updated, null, 2);
    if (isNewProduct) {
      saveViaAgent(
        `Add a new product to src/lib/products.ts with the following data: ${productJson}. Keep the same TypeScript format and existing products unchanged.`
      );
    } else {
      saveViaAgent(
        `Update the product with SKU "${updated.sku}" in src/lib/products.ts. Replace its data with: ${productJson}. Keep the same TypeScript format and other products unchanged.`
      );
    }
    setEditingProduct(null);
    setIsNewProduct(false);
  }

  function handleDeleteProduct(sku: string) {
    if (!confirm("Produkt wirklich loeschen?")) return;
    saveViaAgent(
      `Remove the product with SKU "${sku}" from src/lib/products.ts. Keep the same TypeScript format and other products unchanged.`
    );
    setEditingProduct(null);
  }

  function handleSaveOffering(updated: Offering) {
    const offeringJson = JSON.stringify(updated, null, 2);
    saveViaAgent(
      `Update the offering titled "${editingOffering?.title}" in src/app/angebote/page.tsx. Replace its data with: ${offeringJson}. Keep the same format, other offerings, and the rest of the file unchanged.`
    );
    setEditingOffering(null);
  }

  function handleSavePages() {
    saveViaAgent(
      `Update src/lib/i18n/de.ts: In the hero section, set welcome to "${heroWelcome}", tagline to "${heroTagline}", subtitle to "${heroSubtitle}", ctaDTS to "${ctaDTS}", ctaAngebote to "${ctaAngebote}". Keep everything else unchanged.`
    );
  }

  function handleSaveSettings() {
    saveViaAgent(
      `Update src/lib/i18n/de.ts: In the footer section, set orgName to "${settingsOrgName}". In the contact section, set address to "${settingsAddress}", phone to "${settingsPhone}", email to "${settingsEmail}". Keep everything else unchanged.`
    );
  }

  function handleLogin() {
    localStorage.setItem("jmem-admin-secret", secret);
    setAuthed(true);
  }

  // --- Login screen ---
  if (!authed) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
        <div className="w-full max-w-sm bg-gray-900 rounded-2xl p-8 border border-gray-800">
          <div className="flex items-center justify-center gap-3 mb-8">
            <Lock className="w-8 h-8 text-[var(--color-primary)]" />
            <h1 className="text-2xl font-bold text-white">JMEM CMS</h1>
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
    <div className="min-h-screen bg-gray-950 text-white flex">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 border-r border-gray-800 flex flex-col shrink-0">
        <div className="p-4 border-b border-gray-800">
          <Link
            href="/admin"
            className="flex items-center gap-2 text-gray-400 hover:text-white text-sm mb-3 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Zurueck zum Agent
          </Link>
          <h1 className="text-lg font-bold text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-[var(--color-primary)]" />
            CMS
          </h1>
        </div>
        <nav className="flex-1 p-2">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => {
                setActiveTab(t.key);
                setEditingSchool(null);
                setEditingProduct(null);
                setEditingOffering(null);
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors mb-1 ${
                activeTab === t.key
                  ? "bg-[var(--color-primary)] text-white"
                  : "text-gray-400 hover:text-white hover:bg-gray-800"
              }`}
            >
              {t.icon}
              {t.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        {/* Feedback banner */}
        {feedback && (
          <div
            className={`mx-4 mt-4 px-4 py-3 rounded-xl flex items-center gap-2 text-sm ${
              feedback.type === "success"
                ? "bg-green-900/30 border border-green-800 text-green-300"
                : "bg-red-900/30 border border-red-800 text-red-300"
            }`}
          >
            {feedback.type === "success" ? (
              <CheckCircle className="w-4 h-4 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0" />
            )}
            {feedback.message}
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-32">
            <Loader2 className="w-8 h-8 text-[var(--color-primary)] animate-spin" />
          </div>
        ) : (
          <div className="p-6">
            {/* === SCHULEN === */}
            {activeTab === "schulen" && (
              <div>
                <h2 className="text-xl font-bold mb-6">Schulen</h2>
                {editingSchool ? (
                  <SchoolEditor
                    school={editingSchool}
                    onSave={handleSaveSchool}
                    onCancel={() => setEditingSchool(null)}
                    saving={saving}
                  />
                ) : (
                  <div className="space-y-2">
                    {schools.map((s) => (
                      <button
                        key={s.slug}
                        onClick={() => setEditingSchool(s)}
                        className="w-full flex items-center justify-between bg-gray-900 border border-gray-800 rounded-xl p-4 hover:border-gray-700 transition-colors text-left"
                      >
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-mono bg-gray-800 text-gray-400 px-2 py-0.5 rounded">
                              {s.shortName}
                            </span>
                            {s.accredited && (
                              <span className="text-xs bg-green-900/30 text-green-400 px-2 py-0.5 rounded">
                                Akkreditiert
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-white font-medium">{s.title}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {[s.startDate, s.duration, s.price].filter(Boolean).join(" · ")}
                          </p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-600" />
                      </button>
                    ))}
                    {schools.length === 0 && (
                      <p className="text-gray-500 text-sm text-center py-12">
                        Keine Schulen gefunden. Daten konnten nicht geparst werden.
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* === PRODUKTE === */}
            {activeTab === "produkte" && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold">Produkte</h2>
                  {!editingProduct && (
                    <button
                      onClick={() => {
                        setIsNewProduct(true);
                        setEditingProduct({
                          sku: "",
                          name: "",
                          price: 0,
                          description: "",
                          image: "/images/products/",
                          category: "books",
                          inStock: true,
                        });
                      }}
                      className="flex items-center gap-2 px-3 py-2 bg-[var(--color-primary)] text-white rounded-lg text-sm hover:bg-[var(--color-primary-light)] transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      Neues Produkt
                    </button>
                  )}
                </div>
                {editingProduct ? (
                  <ProductEditor
                    product={editingProduct}
                    onSave={handleSaveProduct}
                    onCancel={() => {
                      setEditingProduct(null);
                      setIsNewProduct(false);
                    }}
                    onDelete={
                      !isNewProduct ? () => handleDeleteProduct(editingProduct.sku) : undefined
                    }
                    saving={saving}
                    isNew={isNewProduct}
                  />
                ) : (
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {products.map((p) => (
                      <button
                        key={p.sku}
                        onClick={() => setEditingProduct(p)}
                        className="bg-gray-900 border border-gray-800 rounded-xl p-4 hover:border-gray-700 transition-colors text-left"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xs font-mono bg-gray-800 text-gray-400 px-2 py-0.5 rounded">
                            #{p.sku}
                          </span>
                          <span
                            className={`text-xs px-2 py-0.5 rounded ${
                              p.inStock
                                ? "bg-green-900/30 text-green-400"
                                : "bg-red-900/30 text-red-400"
                            }`}
                          >
                            {p.inStock ? "Auf Lager" : "Ausverkauft"}
                          </span>
                        </div>
                        <p className="text-sm text-white font-medium truncate">{p.name}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          CHF {p.price} · {p.category}
                        </p>
                      </button>
                    ))}
                    {products.length === 0 && (
                      <p className="text-gray-500 text-sm text-center py-12 col-span-full">
                        Keine Produkte gefunden. Daten konnten nicht geparst werden.
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* === ANGEBOTE === */}
            {activeTab === "angebote" && (
              <div>
                <h2 className="text-xl font-bold mb-6">Angebote</h2>
                {editingOffering ? (
                  <OfferingEditor
                    offering={editingOffering}
                    onSave={handleSaveOffering}
                    onCancel={() => setEditingOffering(null)}
                    saving={saving}
                  />
                ) : (
                  <div className="space-y-2">
                    {offerings.map((o) => (
                      <button
                        key={o.title}
                        onClick={() => setEditingOffering(o)}
                        className="w-full flex items-center justify-between bg-gray-900 border border-gray-800 rounded-xl p-4 hover:border-gray-700 transition-colors text-left"
                      >
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs bg-gray-800 text-gray-400 px-2 py-0.5 rounded">
                              {o.category}
                            </span>
                          </div>
                          <p className="text-sm text-white font-medium">{o.title}</p>
                          <p className="text-xs text-gray-500 mt-1 truncate max-w-lg">
                            {o.description}
                          </p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-600" />
                      </button>
                    ))}
                    {offerings.length === 0 && (
                      <p className="text-gray-500 text-sm text-center py-12">
                        Keine Angebote gefunden. Daten konnten nicht geparst werden.
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* === SEITEN === */}
            {activeTab === "seiten" && (
              <div>
                <h2 className="text-xl font-bold mb-6">Seiten-Inhalte</h2>
                <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
                  <h3 className="text-base font-bold text-white mb-4">Homepage Hero</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <InputField
                      label="Willkommen-Text"
                      value={heroWelcome}
                      onChange={setHeroWelcome}
                    />
                    <InputField label="Tagline" value={heroTagline} onChange={setHeroTagline} />
                    <div className="md:col-span-2">
                      <InputField
                        label="Untertitel"
                        value={heroSubtitle}
                        onChange={setHeroSubtitle}
                        multiline
                      />
                    </div>
                    <InputField label="CTA: DTS Button" value={ctaDTS} onChange={setCtaDTS} />
                    <InputField
                      label="CTA: Angebote Button"
                      value={ctaAngebote}
                      onChange={setCtaAngebote}
                    />
                  </div>
                  <div className="flex justify-end mt-6">
                    <button
                      onClick={handleSavePages}
                      disabled={saving}
                      className="flex items-center gap-2 px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-primary-light)] transition-colors disabled:opacity-50"
                    >
                      {saving ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Save className="w-4 h-4" />
                      )}
                      Speichern
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* === EINSTELLUNGEN === */}
            {activeTab === "einstellungen" && (
              <div>
                <h2 className="text-xl font-bold mb-6">Einstellungen</h2>
                <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
                  <h3 className="text-base font-bold text-white mb-4">Organisation</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <InputField
                      label="Name der Organisation"
                      value={settingsOrgName}
                      onChange={setSettingsOrgName}
                    />
                    <InputField
                      label="Adresse"
                      value={settingsAddress}
                      onChange={setSettingsAddress}
                    />
                    <InputField
                      label="Telefon"
                      value={settingsPhone}
                      onChange={setSettingsPhone}
                    />
                    <InputField
                      label="E-Mail"
                      value={settingsEmail}
                      onChange={setSettingsEmail}
                    />
                  </div>
                  <div className="flex justify-end mt-6">
                    <button
                      onClick={handleSaveSettings}
                      disabled={saving}
                      className="flex items-center gap-2 px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-primary-light)] transition-colors disabled:opacity-50"
                    >
                      {saving ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Save className="w-4 h-4" />
                      )}
                      Speichern
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
