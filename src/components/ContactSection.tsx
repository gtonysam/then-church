import { MapPin, Phone, Mail, Facebook, Youtube, Instagram } from "lucide-react";
import { useContentLang } from "@/context/ContentLanguageContext";
import { useSiteContent } from "@/context/SiteContentContext";

export default function ContactSection() {
  const { t } = useContentLang();
  const { content } = useSiteContent();

  return (
    <section id="contact" className="py-24 bg-navy">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="font-body text-xs uppercase tracking-[0.3em] text-gold mb-3">
            {t("contact.eyebrow")}
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-primary-foreground mb-4">
            {t("contact.title1")}{" "}
            <span className="italic text-gold">{t("contact.title2")}</span>
          </h2>
          <div className="w-16 h-0.5 bg-gold mx-auto mt-4" />
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          <div className="space-y-8">
            <div>
              <h3 className="font-display text-xl font-semibold text-primary-foreground mb-5">
                {t("contact.findus")}
              </h3>
              <ul className="space-y-5">
                {[
                  { icon: MapPin, labelKey: "contact.address.label", val: t("contact.address.val") },
                  { icon: Phone, labelKey: "contact.phone.label", val: content["contact.phone.val"] || t("contact.phone.val") },
                  { icon: Mail, labelKey: "contact.email.label", val: content["contact.email.val"] || t("contact.email.val") },
                ].map(({ icon: Icon, labelKey, val }) => (
                  <li key={labelKey} className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center mt-0.5">
                      <Icon className="w-5 h-5 text-gold" />
                    </div>
                    <div>
                      <p className="font-body text-sm font-bold text-primary-foreground uppercase tracking-wider mb-1">
                        {t(labelKey)}
                      </p>
                      <p className="font-body text-sm text-primary-foreground/70 leading-relaxed whitespace-pre-line">
                        {val}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-display text-lg font-semibold text-primary-foreground mb-4">
                {t("contact.follow")}
              </h3>
              <div className="flex gap-3">
                {[
                  [Facebook, content["contact.facebook"] || "#"],
                  [Youtube, content["contact.youtube"] || "#"],
                  [Instagram, content["contact.instagram"] || "#"],
                ].map(([Icon, href], i) => (
                  <a
                    key={i}
                    href={href as string}
                    target={href !== "#" ? "_blank" : undefined}
                    rel={href !== "#" ? "noreferrer" : undefined}
                    className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center hover:bg-gold hover:text-accent-foreground transition-all duration-200 text-gold"
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white/5 rounded-2xl p-8 border border-white/10">
            <h3 className="font-display text-xl font-semibold text-primary-foreground mb-6">
              {t("contact.form.title")}
            </h3>
            <form className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                {(["fname", "lname"] as const).map((field) => (
                  <div key={field}>
                    <label className="block font-body text-xs uppercase tracking-wider text-primary-foreground/60 mb-2">
                      {t(`contact.form.${field}`)}
                    </label>
                    <input
                      type="text"
                      placeholder={t(`contact.form.placeholder.${field}`)}
                      className="w-full bg-white/5 border border-white/15 rounded-lg px-4 py-3 text-primary-foreground placeholder-primary-foreground/30 font-body text-sm focus:outline-none focus:border-gold transition-colors"
                    />
                  </div>
                ))}
              </div>

              <div>
                <label className="block font-body text-xs uppercase tracking-wider text-primary-foreground/60 mb-2">
                  {t("contact.form.email")}
                </label>
                <input
                  type="email"
                  placeholder={t("contact.form.placeholder.email")}
                  className="w-full bg-white/5 border border-white/15 rounded-lg px-4 py-3 text-primary-foreground placeholder-primary-foreground/30 font-body text-sm focus:outline-none focus:border-gold transition-colors"
                />
              </div>

              <div>
                <label className="block font-body text-xs uppercase tracking-wider text-primary-foreground/60 mb-2">
                  {t("contact.form.message")}
                </label>
                <textarea
                  rows={4}
                  placeholder={t("contact.form.placeholder.message")}
                  className="w-full bg-white/5 border border-white/15 rounded-lg px-4 py-3 text-primary-foreground placeholder-primary-foreground/30 font-body text-sm focus:outline-none focus:border-gold transition-colors resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-full bg-gold text-accent-foreground font-body font-bold text-sm uppercase tracking-widest hover:brightness-110 transition-all duration-200 shadow-gold"
              >
                {t("contact.form.submit")}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
