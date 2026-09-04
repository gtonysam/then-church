import { MapPin, Clock, ChevronRight } from "lucide-react";
import { useContentLang } from "@/context/ContentLanguageContext";
import { useSiteContent } from "@/context/SiteContentContext";

function dateParts(date: string) {
  const d = new Date(`${date}T00:00:00`);
  return { month: d.toLocaleString("en-US",{month:"short"}).toUpperCase(), day: String(d.getDate()) };
}
export default function EventsSection() {
  const { t, lang } = useContentLang();
  const { events } = useSiteContent();
  const sorted = [...events].sort((a,b) => Number(b.featured)-Number(a.featured) || a.event_date.localeCompare(b.event_date));
  const featured = sorted.filter(e => e.featured);
  const others = sorted.filter(e => !e.featured);
  const renderEvent = (e: any, featuredStyle=false) => {
    const d = dateParts(e.event_date);
    const title = lang === "ta" ? e.title_ta : e.title_en, desc = lang === "ta" ? e.description_ta : e.description_en, time = lang === "ta" ? e.time_ta : e.time_en, loc = lang === "ta" ? e.location_ta : e.location_en;
    return featuredStyle ? (
      <div key={e.id || e.event_date+e.title_en} className="bg-navy rounded-2xl p-8 md:p-10 mb-8 flex flex-col md:flex-row gap-8 items-start shadow-warm">
        <div className="flex-shrink-0 text-center bg-gold rounded-xl px-6 py-4 min-w-[80px]"><p className="font-body text-xs font-bold uppercase tracking-widest text-accent-foreground">{d.month}</p><p className="font-display text-4xl font-bold text-accent-foreground leading-none">{d.day}</p></div>
        <div className="flex-1"><span className="inline-block font-body text-xs uppercase tracking-widest text-gold bg-gold/10 px-3 py-1 rounded-full mb-3">{t("events.featured")}</span><h3 className="font-display text-2xl md:text-3xl font-bold text-primary-foreground mb-3">{title}</h3><p className="font-body text-primary-foreground/70 leading-relaxed mb-4">{desc}</p><div className="flex flex-wrap gap-4 text-sm text-primary-foreground/60"><span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-gold" />{time}</span><span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-gold" />{loc}</span></div></div>
      </div>
    ) : (
      <div key={e.id || e.event_date+e.title_en} className="bg-card rounded-2xl p-6 flex gap-5 border border-border shadow-warm hover:border-gold/40 transition-colors group">
        <div className="flex-shrink-0 text-center w-14"><p className="font-body text-xs font-bold uppercase tracking-wider text-gold">{d.month}</p><p className="font-display text-3xl font-bold text-foreground leading-none">{d.day}</p></div>
        <div className="flex-1"><h3 className="font-display text-lg font-semibold text-foreground mb-1 group-hover:text-gold transition-colors">{title}</h3><p className="font-body text-sm text-muted-foreground mb-3 leading-relaxed line-clamp-2">{desc}</p><div className="flex flex-wrap gap-3 text-xs text-muted-foreground"><span className="flex items-center gap-1"><Clock className="w-3 h-3 text-gold" />{time}</span><span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-gold" />{loc}</span></div></div><ChevronRight className="w-4 h-4 text-gold/40 group-hover:text-gold self-center transition-colors flex-shrink-0" />
      </div>
    );
  };
  return <section id="events" className="py-24 bg-background"><div className="max-w-6xl mx-auto px-6"><div className="text-center mb-16"><p className="font-body text-xs uppercase tracking-[0.3em] text-gold mb-3">{t("events.eyebrow")}</p><h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">{t("events.title1")} <span className="italic text-gold">{t("events.title2")}</span></h2><div className="w-16 h-0.5 bg-gold mx-auto mt-4" /></div>{featured.map(e=>renderEvent(e,true))}<div className="grid md:grid-cols-2 gap-5">{others.map(e=>renderEvent(e,false))}</div></div></section>;
}
