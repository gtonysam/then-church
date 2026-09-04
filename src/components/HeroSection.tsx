import churchHero from "@/assets/church-hero.jpg";
import { useContentLang } from "@/context/ContentLanguageContext";
import { useSiteContent } from "@/context/SiteContentContext";

export default function HeroSection() {
  const { t } = useContentLang();
  const { content } = useSiteContent();
  const image = content["site.heroImage"] || churchHero;

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center text-center overflow-hidden">
      <img src={image} alt={t("site.name")} className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 gradient-hero" />
      <div className="relative z-10 px-6 max-w-3xl mx-auto">
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="h-px w-16 bg-gold opacity-70" />
          <span className="text-gold font-body text-xs uppercase tracking-[0.3em]">{t("hero.est")}</span>
          <div className="h-px w-16 bg-gold opacity-70" />
        </div>
        <h1 className="font-display text-5xl md:text-7xl font-bold text-primary-foreground leading-tight mb-4">
          {t("hero.title1")}<span className="block italic text-gold">{t("hero.title2")}</span>
        </h1>
        <p className="font-body text-lg md:text-xl text-primary-foreground/80 mb-10 max-w-xl mx-auto leading-relaxed">{t("hero.sub")}</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a href="#schedule" className="px-8 py-3 rounded-full bg-gold text-accent-foreground font-body font-bold text-sm uppercase tracking-widest hover:brightness-110 transition-all duration-200 shadow-gold">{t("hero.cta1")}</a>
          <a href="#about" className="px-8 py-3 rounded-full border border-primary-foreground/50 text-primary-foreground font-body text-sm uppercase tracking-widest hover:border-gold hover:text-gold transition-all duration-200">{t("hero.cta2")}</a>
        </div>
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 animate-bounce">
          <div className="w-px h-8 bg-gold/60" /><div className="w-1.5 h-1.5 rounded-full bg-gold/60" />
        </div>
      </div>
    </section>
  );
}
