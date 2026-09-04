import { Clock, Calendar } from "lucide-react";
import { useContentLang } from "@/context/ContentLanguageContext";
import { useSiteContent } from "@/context/SiteContentContext";

const dayMap: Record<string,string> = { Sunday:"schedule.sunday", Wednesday:"schedule.wednesday", Friday:"schedule.friday", Saturday:"schedule.saturday" };

export default function ScheduleSection() {
  const { t, lang } = useContentLang();
  const { schedule } = useSiteContent();
  const groups = Object.entries(schedule.reduce<Record<string, typeof schedule>>((acc, item) => {
    (acc[item.day] ||= []).push(item); return acc;
  }, {}));

  return (
    <section id="schedule" className="py-24 bg-muted">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="font-body text-xs uppercase tracking-[0.3em] text-gold mb-3">{t("schedule.eyebrow")}</p>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">{t("schedule.title1")} <span className="italic text-gold">{t("schedule.title2")}</span></h2>
          <div className="w-16 h-0.5 bg-gold mx-auto mt-4" />
          <p className="font-body text-muted-foreground mt-6 max-w-xl mx-auto">{t("schedule.sub")}</p>
        </div>
        <div className="grid md:grid-cols-2 gap-6 mb-16">
          {groups.map(([day, items]) => (
            <div key={day} className="bg-card rounded-2xl overflow-hidden shadow-warm border border-border">
              <div className="bg-navy px-6 py-4 flex items-center gap-3">
                <Calendar className="w-4 h-4 text-gold" />
                <h3 className="font-display text-lg font-semibold text-primary-foreground">{t(dayMap[day] || day)}</h3>
              </div>
              <ul className="divide-y divide-border">
                {items.map((svc) => (
                  <li key={svc.id || `${svc.day}-${svc.time}-${svc.name_en}`} className="px-6 py-4 flex items-start justify-between gap-4 hover:bg-muted/50 transition-colors">
                    <div className="flex items-start gap-3">
                      <Clock className="w-4 h-4 text-gold mt-0.5 flex-shrink-0" />
                      <div><p className="font-body font-bold text-foreground text-sm">{lang === "ta" ? svc.name_ta : svc.name_en}</p><p className="font-body text-xs text-muted-foreground mt-0.5">{lang === "ta" ? svc.location_ta : svc.location_en}</p></div>
                    </div>
                    <span className="font-body text-xs font-bold text-gold whitespace-nowrap bg-gold/10 px-2 py-1 rounded-full">{svc.time}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div>
          <h3 className="font-display text-2xl font-semibold text-foreground mb-6 text-center">{t("schedule.monthly.title1")} <span className="italic text-gold">{t("schedule.monthly.title2")}</span></h3>
          <div className="grid md:grid-cols-3 gap-6">
            {[1,2,3].map((n) => (
              <div key={n} className="bg-card rounded-2xl p-6 border border-border shadow-warm hover:border-gold/40 transition-colors">
                <span className="inline-block font-body text-xs uppercase tracking-widest text-gold bg-gold/10 px-3 py-1 rounded-full mb-4">{t(`schedule.m${n}.date`)}</span>
                <h4 className="font-display text-lg font-semibold text-foreground mb-2">{t(`schedule.m${n}.name`)}</h4>
                <p className="font-body text-sm text-muted-foreground leading-relaxed">{t(`schedule.m${n}.desc`)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
