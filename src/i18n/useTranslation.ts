import { useLanguage } from "../state/language";
import { en, fi, type Translations } from "./translations";

const translations: Record<string, Translations> = { EN: en, FI: fi };

export function useTranslation(): Translations {
  const { language } = useLanguage();
  return translations[language] ?? en;
}
