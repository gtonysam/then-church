import { useState } from "react";
import { Menu, X, Cross } from "lucide-react";
import { useContentLang } from "@/context/ContentLanguageContext";
import { useSiteContent } from "@/context/SiteContentContext";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { lang, toggle, t } = useContentLang();
  const { content } = useSiteContent();

  const navLinks = [
    { key: "nav.home", href: "#home" },
    { key: "nav.about", href: "#about" },
    { key: "nav.schedule", href: "#schedule" },
    { key: "nav.events", href: "#events" },
    { key: "nav.contact", href: "#contact" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-navy/95 backdrop-blur-sm shadow-warm">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <a href="#home" className="flex items-center gap-2">
          <Cross className="h-5 w-5 text-gold" />
          <span className="font-display text-lg font-bold text-primary-foreground tracking-wide">
            {lang === "en" ? (content["site.name"] || "Grace Community Church") : (content["ta.site.name"] )}
          </span>
        </a>

        {/* Desktop Links */}
        <ul className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <li key={link.key}>
              <a
                href={link.href}
                className="font-body text-sm text-primary-foreground/80 hover:text-gold transition-colors duration-200 uppercase tracking-wider"
              >
                {t(link.key)}
              </a>
            </li>
          ))}
        </ul>

        {/* Right side: Language toggle + CTA */}
        <div className="hidden md:flex items-center gap-3">
          {/* Language Toggle */}
          <button
            onClick={toggle}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-gold/40 hover:border-gold text-gold font-body text-xs font-bold uppercase tracking-wider transition-all duration-200"
            aria-label="Toggle language"
          >
            <span className={lang === "en" ? "text-gold" : "text-primary-foreground/40"}>EN</span>
            <span className="text-primary-foreground/30">|</span>
            <span className={lang === "ta" ? "text-gold" : "text-primary-foreground/40"}>தமிழ்</span>
          </button>

          <a
            href="#contact"
            className="inline-flex items-center px-5 py-2 rounded-full bg-gold text-accent-foreground font-body font-bold text-sm uppercase tracking-wider hover:brightness-110 transition-all duration-200 shadow-gold"
          >
            {t("nav.join")}
          </a>
        </div>

        {/* Mobile Toggle */}
        <div className="md:hidden flex items-center gap-3">
          <button
            onClick={toggle}
            className="flex items-center gap-1 px-2.5 py-1 rounded-full border border-gold/40 text-gold font-body text-xs font-bold"
          >
            <span className={lang === "en" ? "text-gold" : "text-primary-foreground/40"}>EN</span>
            <span className="text-primary-foreground/30">|</span>
            <span className={lang === "ta" ? "text-gold" : "text-primary-foreground/40"}>த</span>
          </button>
          <button
            className="text-primary-foreground"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden bg-navy border-t border-white/10">
          <ul className="flex flex-col px-6 py-4 gap-4">
            {navLinks.map((link) => (
              <li key={link.key}>
                <a
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block text-primary-foreground/80 hover:text-gold transition-colors font-body text-sm uppercase tracking-wider"
                >
                  {t(link.key)}
                </a>
              </li>
            ))}
            <li>
              <a
                href="#contact"
                onClick={() => setOpen(false)}
                className="inline-flex items-center px-5 py-2 rounded-full bg-gold text-accent-foreground font-body text-sm uppercase tracking-wider font-bold"
              >
                {t("nav.join")}
              </a>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
}
