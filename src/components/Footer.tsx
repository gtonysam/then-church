import { Cross } from "lucide-react";
import { useContentLang } from "@/context/ContentLanguageContext";
import { useSiteContent } from "@/context/SiteContentContext";

export default function Footer() {
  const { lang, t } = useContentLang();
  const { content } = useSiteContent();

  return (
    <footer className="bg-foreground py-8">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Cross className="h-4 w-4 text-gold" />
          <span className="font-display text-primary-foreground/80 text-sm">
            {lang === "en" ? (content["site.name"] || "Grace Community Church") : (content["ta.site.name"] || "கிருபை சமூக திருச்சபை")}
          </span>
        </div>
        <p className="font-body text-xs text-primary-foreground/40 text-center">
          © {new Date().getFullYear()} {lang === "en" ? (content["site.name"] || "Grace Community Church") : (content["ta.site.name"] || "கிருபை சமூக திருச்சபை")}. {t("footer.rights")}
        </p>
        <p className="font-body text-xs text-gold italic">
          {t("footer.verse")}
        </p>
      </div>
    </footer>
  );
}
