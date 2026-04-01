import { de } from "./i18n/de";
import { en } from "./i18n/en";

export type { Dictionary } from "./i18n/de";
export type Lang = "de" | "en";

const dictionaries = { de, en } as const;

export function getDictionary(lang: Lang) {
  return dictionaries[lang];
}
