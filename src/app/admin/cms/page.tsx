"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { AdminNav } from "@/components/AdminNav";
import {
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
  Package,
  ChevronDown,
  ChevronUp,
  Truck,
} from "lucide-react";
import { schools as initialSchools, type School } from "@/lib/schools";
import { products as initialProducts, type Product } from "@/lib/products";
import { offerings as initialOfferings, type Offering } from "@/lib/offerings";

// --- Types ---

type Tab = "schulen" | "produkte" | "angebote" | "bestellungen" | "seiten" | "einstellungen";

interface OrderItem {
  sku: string;
  name: string;
  price: number;
  quantity: number;
}

interface OrderRecord {
  id: string;
  items: OrderItem[];
  customer: {
    name: string;
    email: string;
    address: string;
    zip: string;
    city: string;
    country: string;
    phone: string;
    notes: string;
  };
  totalAmount: number;
  status: "pending" | "paid" | "shipped" | "cancelled";
  createdAt: string;
  paidAt?: string;
}

const TABS: { key: Tab; label: string; icon: React.ReactNode }[] = [
  { key: "schulen", label: "Schulen", icon: <GraduationCap className="w-4 h-4" /> },
  { key: "produkte", label: "Produkte", icon: <ShoppingBag className="w-4 h-4" /> },
  { key: "angebote", label: "Angebote", icon: <Gift className="w-4 h-4" /> },
  { key: "bestellungen", label: "Bestellungen", icon: <Package className="w-4 h-4" /> },
  { key: "seiten", label: "Seiten", icon: <FileText className="w-4 h-4" /> },
  { key: "einstellungen", label: "Einstellungen", icon: <Settings className="w-4 h-4" /> },
];

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
              Löschen
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
            onChange={(e) => set("category", e.target.value as Product["category"])}
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
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Data initialized from imports (bundled at build time)
  const [schools, setSchools] = useState(initialSchools);
  const [products, setProducts] = useState(initialProducts);
  const [offerings, setOfferings] = useState(initialOfferings);

  // Orders state
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  // Editor state
  const [editingSchool, setEditingSchool] = useState<School | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingOffering, setEditingOffering] = useState<Offering | null>(null);
  const [isNewProduct, setIsNewProduct] = useState(false);

  // Page content editing (defaults from de.ts)
  const [heroWelcome, setHeroWelcome] = useState("Willkommen bei Jugend mit einer Mission");
  const [heroTagline, setHeroTagline] = useState("passion \u00b7 training \u00b7 mission");
  const [heroSubtitle, setHeroSubtitle] = useState(
    "Gott besser kennenlernen und ihn bekannt machen. Entdecke unsere Schulen, Seminare und Eins\u00e4tze in Wiler bei Seedorf."
  );
  const [ctaDTS, setCtaDTS] = useState("J\u00fcngerschaftsschule DTS");
  const [ctaAngebote, setCtaAngebote] = useState("Angebote ansehen");

  // Settings (hardcoded from known org data)
  const [settingsOrgName, setSettingsOrgName] = useState("Jugend mit einer Mission");
  const [settingsAddress, setSettingsAddress] = useState("Hauptstrasse 15, 3266 Wiler bei Seedorf");
  const [settingsPhone, setSettingsPhone] = useState("+41 32 391 70 30");
  const [settingsEmail, setSettingsEmail] = useState("info@jmemwiler.ch");

  const authHeaders = { Authorization: `Bearer ${secret}` };

  useEffect(() => {
    const saved = localStorage.getItem("jmem-admin-secret");
    if (saved) {
      setSecret(saved);
      setAuthed(true);
    }
  }, []);

  function showFeedback(type: "success" | "error", message: string) {
    setFeedback({ type, message });
    setTimeout(() => setFeedback(null), 4000);
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
        }
      } else if (data.type === "committed") {
        showFeedback("success", data.message || "Gespeichert!");
      } else {
        showFeedback("success", data.message || data.content || "Gespeichert!");
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
    setSchools((prev) => prev.map((s) => (s.slug === updated.slug ? updated : s)));
    setEditingSchool(null);
  }

  function handleSaveProduct(updated: Product) {
    const productJson = JSON.stringify(updated, null, 2);
    if (isNewProduct) {
      saveViaAgent(
        `Add a new product to src/lib/products.ts with the following data: ${productJson}. Keep the same TypeScript format and existing products unchanged.`
      );
      setProducts((prev) => [...prev, updated]);
    } else {
      saveViaAgent(
        `Update the product with SKU "${updated.sku}" in src/lib/products.ts. Replace its data with: ${productJson}. Keep the same TypeScript format and other products unchanged.`
      );
      setProducts((prev) => prev.map((p) => (p.sku === updated.sku ? updated : p)));
    }
    setEditingProduct(null);
    setIsNewProduct(false);
  }

  function handleDeleteProduct(sku: string) {
    if (!confirm("Produkt wirklich löschen?")) return;
    saveViaAgent(
      `Remove the product with SKU "${sku}" from src/lib/products.ts. Keep the same TypeScript format and other products unchanged.`
    );
    setProducts((prev) => prev.filter((p) => p.sku !== sku));
    setEditingProduct(null);
  }

  function handleSaveOffering(updated: Offering) {
    const offeringJson = JSON.stringify(updated, null, 2);
    saveViaAgent(
      `Update the offering titled "${editingOffering?.title}" in src/lib/offerings.ts. Replace its data with: ${offeringJson}. Keep the same format, other offerings, and the rest of the file unchanged.`
    );
    setOfferings((prev) =>
      prev.map((o) => (o.title === editingOffering?.title ? updated : o))
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

  async function fetchOrders() {
    setOrdersLoading(true);
    try {
      const res = await fetch("/api/shop/orders", {
        headers: authHeaders,
      });
      const data = await res.json();
      if (data.orders) {
        setOrders(data.orders);
      } else if (data.error) {
        showFeedback("error", data.error);
      }
    } catch {
      showFeedback("error", "Bestellungen konnten nicht geladen werden.");
    }
    setOrdersLoading(false);
  }

  async function updateOrderStatus(orderId: string, status: string) {
    setSaving(true);
    try {
      const res = await fetch("/api/shop/orders", {
        method: "PUT",
        headers: { ...authHeaders, "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, status }),
      });
      const data = await res.json();
      if (data.success) {
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, status: status as OrderRecord["status"] } : o))
        );
        showFeedback("success", `Bestellung ${orderId} als "${status}" markiert.`);
      } else {
        showFeedback("error", data.error || "Status konnte nicht aktualisiert werden.");
      }
    } catch {
      showFeedback("error", "Fehler beim Aktualisieren des Status.");
    }
    setSaving(false);
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
    <div className="min-h-screen bg-gray-950 text-white flex flex-col pt-16 lg:pt-20">
      <AdminNav />
      <div className="flex flex-1">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 border-r border-gray-800 flex flex-col shrink-0">
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
                        stock: 10,
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
                </div>
              )}
            </div>
          )}

          {/* === BESTELLUNGEN === */}
          {activeTab === "bestellungen" && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Bestellungen</h2>
                <button
                  onClick={fetchOrders}
                  disabled={ordersLoading}
                  className="flex items-center gap-2 px-3 py-2 bg-[var(--color-primary)] text-white rounded-lg text-sm hover:bg-[var(--color-primary-light)] transition-colors disabled:opacity-50"
                >
                  {ordersLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Package className="w-4 h-4" />
                  )}
                  Laden
                </button>
              </div>

              {orders.length === 0 && !ordersLoading ? (
                <div className="text-center py-12 text-gray-500">
                  <Package className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p className="text-sm">
                    Keine Bestellungen vorhanden. Klicke &quot;Laden&quot; um Bestellungen abzurufen.
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {orders.map((order) => {
                    const isExpanded = expandedOrder === order.id;
                    const statusColors: Record<string, string> = {
                      pending: "bg-yellow-900/30 text-yellow-400",
                      paid: "bg-green-900/30 text-green-400",
                      shipped: "bg-blue-900/30 text-blue-400",
                      cancelled: "bg-red-900/30 text-red-400",
                    };
                    const statusLabels: Record<string, string> = {
                      pending: "Ausstehend",
                      paid: "Bezahlt",
                      shipped: "Versendet",
                      cancelled: "Storniert",
                    };

                    return (
                      <div
                        key={order.id}
                        className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden"
                      >
                        <button
                          onClick={() =>
                            setExpandedOrder(isExpanded ? null : order.id)
                          }
                          className="w-full flex items-center justify-between p-4 hover:bg-gray-800/50 transition-colors text-left"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <span className="text-xs font-mono bg-gray-800 text-gray-400 px-2 py-0.5 rounded shrink-0">
                              {order.id}
                            </span>
                            <span
                              className={`text-xs px-2 py-0.5 rounded shrink-0 ${
                                statusColors[order.status] || "bg-gray-800 text-gray-400"
                              }`}
                            >
                              {statusLabels[order.status] || order.status}
                            </span>
                            <span className="text-sm text-white truncate">
                              {order.customer.name}
                            </span>
                            <span className="text-xs text-gray-500 shrink-0">
                              CHF {order.totalAmount.toFixed(2)}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <span className="text-xs text-gray-600">
                              {new Date(order.createdAt).toLocaleDateString("de-CH")}
                            </span>
                            {isExpanded ? (
                              <ChevronUp className="w-4 h-4 text-gray-600" />
                            ) : (
                              <ChevronDown className="w-4 h-4 text-gray-600" />
                            )}
                          </div>
                        </button>

                        {isExpanded && (
                          <div className="border-t border-gray-800 p-4 space-y-4">
                            {/* Customer Info */}
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <p className="text-xs text-gray-500 mb-1">Kunde</p>
                                <p className="text-white">{order.customer.name}</p>
                                <p className="text-gray-400">{order.customer.email}</p>
                                {order.customer.phone && (
                                  <p className="text-gray-400">{order.customer.phone}</p>
                                )}
                              </div>
                              <div>
                                <p className="text-xs text-gray-500 mb-1">Adresse</p>
                                <p className="text-white">{order.customer.address}</p>
                                <p className="text-gray-400">
                                  {order.customer.zip} {order.customer.city}
                                </p>
                                <p className="text-gray-400">{order.customer.country}</p>
                              </div>
                            </div>

                            {order.customer.notes && (
                              <div>
                                <p className="text-xs text-gray-500 mb-1">Bemerkungen</p>
                                <p className="text-sm text-gray-300 bg-gray-800 rounded-lg p-3">
                                  {order.customer.notes}
                                </p>
                              </div>
                            )}

                            {/* Items */}
                            <div>
                              <p className="text-xs text-gray-500 mb-2">Artikel</p>
                              <div className="space-y-1">
                                {order.items.map((item, idx) => (
                                  <div
                                    key={idx}
                                    className="flex items-center justify-between text-sm bg-gray-800 rounded-lg px-3 py-2"
                                  >
                                    <span className="text-white">
                                      {item.quantity}x {item.name}
                                    </span>
                                    <span className="text-gray-400">
                                      CHF {(item.price * item.quantity).toFixed(2)}
                                    </span>
                                  </div>
                                ))}
                              </div>
                              <div className="flex justify-end mt-2">
                                <span className="text-sm font-bold text-white">
                                  Total: CHF {order.totalAmount.toFixed(2)}
                                </span>
                              </div>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-2 pt-2 border-t border-gray-800">
                              {order.status === "paid" && (
                                <button
                                  onClick={() => updateOrderStatus(order.id, "shipped")}
                                  disabled={saving}
                                  className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-500 transition-colors disabled:opacity-50"
                                >
                                  <Truck className="w-4 h-4" />
                                  Als versendet markieren
                                </button>
                              )}
                              {order.status === "pending" && (
                                <button
                                  onClick={() => updateOrderStatus(order.id, "cancelled")}
                                  disabled={saving}
                                  className="flex items-center gap-2 px-3 py-2 bg-red-600/20 text-red-400 rounded-lg text-sm hover:bg-red-600/30 transition-colors disabled:opacity-50"
                                >
                                  Stornieren
                                </button>
                              )}
                              <span className="text-xs text-gray-600 ml-auto">
                                Erstellt: {new Date(order.createdAt).toLocaleString("de-CH")}
                                {order.paidAt && (
                                  <> | Bezahlt: {new Date(order.paidAt).toLocaleString("de-CH")}</>
                                )}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
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
      </main>
      </div>
    </div>
  );
}
