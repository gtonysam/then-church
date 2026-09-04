import { Heart, Users, BookOpen } from "lucide-react";
import { useContentLang } from "@/context/ContentLanguageContext";

export default function AboutSection() {
  const { t } = useContentLang();

  const values = [
    {
      icon: BookOpen,
      titleKey: "about.v1.title",
      descKey: "about.v1.desc",
    },
    {
      icon: Heart,
      titleKey: "about.v2.title",
      descKey: "about.v2.desc",
    },
    {
      icon: Users,
      titleKey: "about.v3.title",
      descKey: "about.v3.desc",
    },
  ];

  return (
    <section id="about" className="py-24 bg-background">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="font-body text-xs uppercase tracking-[0.3em] text-gold mb-3">
            {t("about.eyebrow")}
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
            {t("about.title1")}{" "}
            <span className="italic text-gold">{t("about.title2")}</span>
          </h2>
          <div className="w-16 h-0.5 bg-gold mx-auto mt-4" />
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {values.map((v) => (
            <div
              key={v.titleKey}
              className="bg-card rounded-2xl p-8 shadow-warm border border-border hover:border-gold/40 transition-colors duration-300 group"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-muted group-hover:bg-gold/10 transition-colors mb-5">
                <v.icon className="w-6 h-6 text-gold" />
              </div>
              <h3 className="font-display text-xl font-semibold text-foreground mb-3">
                {t(v.titleKey)}
              </h3>
              <p className="font-body text-muted-foreground leading-relaxed">
                {t(v.descKey)}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-16 bg-navy rounded-2xl px-10 py-12 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-5">
            <div className="absolute -top-8 -left-8 text-gold font-display text-[200px] leading-none select-none">
              "
            </div>
          </div>
          <blockquote className="relative z-10">
            <p className="font-display italic text-2xl md:text-3xl text-primary-foreground leading-relaxed mb-4">
              {t("about.verse")}
            </p>
            <cite className="font-body text-gold text-sm uppercase tracking-widest not-italic">
              {t("about.ref")}
            </cite>
          </blockquote>
        </div>
      </div>
    </section>
  );
}
