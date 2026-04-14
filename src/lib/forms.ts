// Form Builder Types

export type FieldType =
  | "text"
  | "email"
  | "textarea"
  | "select"
  | "checkbox"
  | "display"
  | "privacy"
  | "number"
  | "date"
  | "phone";

export interface FormField {
  id: string;
  type: FieldType;
  label: string;
  placeholder?: string;
  required?: boolean;
  options?: string[]; // for select fields
  displayText?: string; // for display-type fields
  width?: "full" | "half"; // layout: full width or half (side by side)
  mergeTag?: string; // e.g. "nameer", "namesie", "e_mail" — for use in email templates
}

export interface EmailConfig {
  enabled: boolean;
  fromName?: string;
  fromEmail?: string;
  subject?: string;
  body?: string; // supports {mergeTag} placeholders
}

export interface FormDefinition {
  id: string;
  name: string;
  slug: string; // URL-friendly identifier
  linkedType?: "school" | "offering" | "standalone";
  linkedSlug?: string; // slug of the school/offering this form belongs to
  fields: FormField[];
  emailToVisitor: EmailConfig; // auto-reply to the person who submitted
  emailToAdmin: EmailConfig; // notification to the admin/team
  adminRecipients: string[]; // email addresses that receive submissions
  responsePage: {
    title?: string;
    message?: string; // shown after submission, supports {mergeTag}
  };
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface FormSubmission {
  id: string;
  formId: string;
  formName: string;
  data: Record<string, string>; // fieldId -> value
  labels: Record<string, string>; // fieldId -> label (for display)
  submittedAt: string;
}

// Default field templates for the builder
export const FIELD_TEMPLATES: { type: FieldType; label: string; icon: string }[] = [
  { type: "text", label: "Textfeld", icon: "Type" },
  { type: "email", label: "E-Mail", icon: "Mail" },
  { type: "textarea", label: "Mehrzeiliges Textfeld", icon: "AlignLeft" },
  { type: "select", label: "Auswahl (Dropdown)", icon: "ChevronDown" },
  { type: "checkbox", label: "Checkbox", icon: "CheckSquare" },
  { type: "number", label: "Zahl", icon: "Hash" },
  { type: "phone", label: "Telefon", icon: "Phone" },
  { type: "date", label: "Datum", icon: "Calendar" },
  { type: "display", label: "Anzeigetext", icon: "FileText" },
  { type: "privacy", label: "Datenschutz-Zustimmung", icon: "Shield" },
];

export function createEmptyForm(): FormDefinition {
  return {
    id: crypto.randomUUID(),
    name: "",
    slug: "",
    linkedType: "standalone",
    fields: [],
    emailToVisitor: { enabled: false },
    emailToAdmin: { enabled: true },
    adminRecipients: [],
    responsePage: {
      title: "Vielen Dank!",
      message: "Deine Anmeldung wurde erfolgreich gesendet.",
    },
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

export function createField(type: FieldType): FormField {
  const id = crypto.randomUUID();
  const base: FormField = { id, type, label: "", required: false, width: "full" };

  switch (type) {
    case "email":
      return { ...base, label: "E-Mail", required: true, mergeTag: "email" };
    case "privacy":
      return {
        ...base,
        label: "Datenschutz",
        required: true,
        displayText:
          "Ich akzeptiere die Datenschutzbestimmungen und bin damit einverstanden, dass meine Daten zur Bearbeitung meiner Anfrage verarbeitet werden.",
      };
    case "display":
      return { ...base, label: "Anzeigetext", displayText: "" };
    case "select":
      return { ...base, label: "", options: ["Option 1", "Option 2"] };
    default:
      return base;
  }
}
