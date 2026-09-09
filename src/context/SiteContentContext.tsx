import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from "react";
import { translations as defaultTranslations, Language } from "@/context/LanguageContext";
import { get } from "@/lib/supabase";

export type ScheduleItem = {
  id?: string;
  day: string;
  time: string;
  name_en: string;
  name_ta: string;
  location_en: string;
  location_ta: string;
  sort_order: number;
};

export type EventItem = {
  id?: string;
  event_date: string;
  title_en: string;
  title_ta: string;
  time_en: string;
  time_ta: string;
  location_en: string;
  location_ta: string;
  description_en: string;
  description_ta: string;
  featured: boolean;
  sort_order: number;
};

const defaultExtra: Record<string, string> = {
  "site.name": "Grace Community Church",
  "site.name.ta": "கிருபை சமூக திருச்சபை",
  "site.heroImage": "",
  "contact.phone.val": "+1 (555) 123-4567",
  "contact.email.val": "info@gracecommunitychurch.org",
  "contact.facebook": "#",
  "contact.youtube": "#",
  "contact.instagram": "#",
};

const defaultSchedule: ScheduleItem[] = [
  { day:"Sunday", time:"7:00 AM", name_en:"Early Morning Service", name_ta:"அதிகாலை ஆராதனை", location_en:"Main Sanctuary", location_ta:"பிரதான ஆலயம்", sort_order:0 },
  { day:"Sunday", time:"9:00 AM", name_en:"Family Service", name_ta:"குடும்ப ஆராதனை", location_en:"Main Sanctuary", location_ta:"பிரதான ஆலயம்", sort_order:1 },
  { day:"Sunday", time:"11:00 AM", name_en:"Main Worship Service", name_ta:"பிரதான வழிபாட்டு ஆராதனை", location_en:"Main Sanctuary", location_ta:"பிரதான ஆலயம்", sort_order:2 },
  { day:"Sunday", time:"6:00 PM", name_en:"Evening Praise & Worship", name_ta:"மாலை புகழ் ஆராதனை", location_en:"Fellowship Hall", location_ta:"சங்க அரங்கம்", sort_order:3 },
  { day:"Wednesday", time:"6:00 PM", name_en:"Midweek Bible Study", name_ta:"வாரநடு வேத ஆய்வு", location_en:"Room A", location_ta:"அறை A", sort_order:4 },
  { day:"Wednesday", time:"7:00 PM", name_en:"Youth Group Meeting", name_ta:"இளையோர் குழு கூட்டம்", location_en:"Youth Centre", location_ta:"இளையோர் மையம்", sort_order:5 },
  { day:"Friday", time:"6:30 PM", name_en:"Prayer & Intercession Night", name_ta:"ஜெபம் & பரிந்துரை இரவு", location_en:"Main Sanctuary", location_ta:"பிரதான ஆலயம்", sort_order:6 },
  { day:"Saturday", time:"10:00 AM", name_en:"Children's Sunday School", name_ta:"குழந்தைகள் ஞாயிற்றுப் பள்ளி", location_en:"Children's Wing", location_ta:"குழந்தைகள் பிரிவு", sort_order:7 },
  { day:"Saturday", time:"2:00 PM", name_en:"Women's Fellowship", name_ta:"மகளிர் சங்கம்", location_en:"Fellowship Hall", location_ta:"சங்க அரங்கம்", sort_order:8 },
];

const defaultEvents: EventItem[] = [
  { event_date:"2026-02-23", title_en:"Annual Church Anniversary", title_ta:"ஆண்டு திருச்சபை நினைவு விழா", time_en:"10:00 AM – 4:00 PM", time_ta:"காலை 10:00 – மாலை 4:00", location_en:"Main Sanctuary & Grounds", location_ta:"பிரதான ஆலயம் & வளாகம்", description_en:"Celebrate 70 years of God's faithfulness! Special music, testimonies, and a thanksgiving service.", description_ta:"கடவுளின் 70 ஆண்டு உண்மையை கொண்டாடுங்கள்! சிறப்பு இசை, சாட்சிகள் மற்றும் நன்றி ஆராதனை.", featured:true, sort_order:0 },
  { event_date:"2026-03-07", title_en:"Easter Drama & Concert", title_ta:"ஈஸ்டர் நாடகம் & இசை நிகழ்ச்சி", time_en:"6:00 PM", time_ta:"மாலை 6:00", location_en:"Main Sanctuary", location_ta:"பிரதான ஆலயம்", description_en:"A powerful dramatic presentation of the Easter story followed by a live praise concert.", description_ta:"ஈஸ்டர் கதையின் சக்திவாய்ந்த நாடக நிகழ்வுக்கு பிறகு நேரடி புகழ் கச்சேரி.", featured:false, sort_order:1 },
  { event_date:"2026-03-14", title_en:"Men's Breakfast Retreat", title_ta:"ஆண்களின் காலை உணவு ஒன்றுகூடல்", time_en:"7:00 AM", time_ta:"காலை 7:00", location_en:"Fellowship Hall", location_ta:"சங்க அரங்கம்", description_en:"Men of all ages gather for fellowship, breakfast, and a word of encouragement.", description_ta:"எல்லா வயதினரும் கூட்டுறவு, காலை உணவு மற்றும் ஊக்கமளிக்கும் வார்த்தைக்காக ஒன்று கூடுகிறார்கள்.", featured:false, sort_order:2 },
  { event_date:"2026-03-28", title_en:"Good Friday Service", title_ta:"நல்ல வெள்ளி ஆராதனை", time_en:"12:00 PM – 3:00 PM", time_ta:"மதியம் 12:00 – மாலை 3:00", location_en:"Main Sanctuary", location_ta:"பிரதான ஆலயம்", description_en:"A solemn and reflective three-hour service commemorating the crucifixion of Christ.", description_ta:"கிறிஸ்துவின் சிலுவைச் சாவை நினைவுகூரும் மூன்று மணி நேர தியான ஆராதனை.", featured:false, sort_order:3 },
  { event_date:"2026-04-05", title_en:"Youth Leadership Conference", title_ta:"இளையோர் தலைமைத்துவ மாநாடு", time_en:"9:00 AM – 5:00 PM", time_ta:"காலை 9:00 – மாலை 5:00", location_en:"Conference Hall", location_ta:"மாநாட்டு அரங்கம்", description_en:"Equipping the next generation of church leaders with skills, vision, and spiritual depth.", description_ta:"திருச்சபையின் அடுத்த தலைமுறை தலைவர்களை திறன்களும் ஆன்மிக ஆழமும் கொண்டு தயார்படுத்துதல்.", featured:false, sort_order:4 },
  { event_date:"2026-04-19", title_en:"Community Health Fair", title_ta:"சமூக சுகாதார விழா", time_en:"10:00 AM – 2:00 PM", time_ta:"காலை 10:00 – மதியம் 2:00", location_en:"Church Grounds", location_ta:"திருச்சபை வளாகம்", description_en:"Free health screenings, counselling, and wellness resources open to the entire community.", description_ta:"இலவச உடல்நல பரிசோதனை, ஆலோசனை மற்றும் ஆரோக்கிய வளங்கள் முழு சமூகத்திற்கும் திறந்தவை.", featured:false, sort_order:5 },
];

type ContextType = {
  content: Record<string, string>;
  schedule: ScheduleItem[];
  events: EventItem[];
  churchId: number | null;
  loading: boolean;
  refresh: () => Promise<void>;
  t: (key: string, lang: Language) => string;
};

const SiteContentContext = createContext<ContextType | null>(null);

function flattenTranslations() {
  const out: Record<string,string> = { ...defaultExtra };
  for (const lang of ["en","ta"] as Language[]) {
    for (const [key, value] of Object.entries(defaultTranslations[lang])) out[`${lang}.${key}`] = value;
    for (const [key, value] of Object.entries(defaultExtra)) out[`${lang}.${key}`] = value;
  }
  return out;
}

const fallback = flattenTranslations();

export function SiteContentProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<Record<string,string>>(fallback);
  const [schedule, setSchedule] = useState(defaultSchedule);
  const [events, setEvents] = useState(defaultEvents);
  const [loading, setLoading] = useState(true);
  const [churchId, setChurchId] =
  useState<number | null>(null);

const refresh = async () => {
  try {
    const [siteRows, scheduleRows, eventRows] =
      await Promise.all([
        get(
          "site_content?select=content,church_id&id=eq.1&limit=1"
        ),
        get(
          "schedule_items?select=*&order=sort_order.asc"
        ),
        get(
          "events?select=*&order=event_date.asc,sort_order.asc"
        ),
      ]);

    if (siteRows?.[0]) {
      const currentChurchId =
        Number(siteRows[0].church_id);

      if (Number.isFinite(currentChurchId)) {
        setChurchId(currentChurchId);
      }

      if (siteRows[0].content) {
        setContent({
          ...fallback,
          ...siteRows[0].content,
        });
      }
    }

    if (
      Array.isArray(scheduleRows) &&
      scheduleRows.length
    ) {
      setSchedule(scheduleRows);
    }

    if (
      Array.isArray(eventRows) &&
      eventRows.length
    ) {
      setEvents(eventRows);
    }
  } catch (error) {
    console.error(
      "Failed to load site content:",
      error
    );
  } finally {
    setLoading(false);
  }
};
  useEffect(() => { refresh(); }, []);

 const value = useMemo(
  () => ({
    content,
    schedule,
    events,
    churchId,
    loading,
    refresh,

    t: (
      key: string,
      lang: Language
    ) =>
      content[`${lang}.${key}`] ??
      defaultTranslations[lang][key] ??
      content[key] ??
      key,
  }),
  [
    content,
    schedule,
    events,
    churchId,
    loading,
  ]
);

  return <SiteContentContext.Provider value={value}>{children}</SiteContentContext.Provider>;
}

export function useSiteContent() {
  const ctx = useContext(SiteContentContext);
  if (!ctx) throw new Error("useSiteContent must be used inside SiteContentProvider");
  return ctx;
}

export { fallback as defaultContent };
