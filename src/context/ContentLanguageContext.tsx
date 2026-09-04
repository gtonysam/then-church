import { useLang, Language } from "@/context/LanguageContext";
import { useSiteContent } from "@/context/SiteContentContext";

export function useContentLang() {
  const { lang, toggle } = useLang();
  const { t: dbt } = useSiteContent();
  return {
    lang,
    toggle,
    t: (key: string) => dbt(key, lang as Language),
  };
}
