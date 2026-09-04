import { createContext, useContext, useState, ReactNode } from "react";

export type Language = "en" | "ta";

interface LanguageContextType {
  lang: Language;
  toggle: () => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

export const translations: Record<Language, Record<string, string>> = {
  en: {
    // Nav
    "nav.home": "Home",
    "nav.about": "About",
    "nav.schedule": "Schedule",
    "nav.events": "Events",
    "nav.contact": "Contact",
    "nav.join": "Join Us",

    // Hero
    "hero.est": "Est. 1954",
    "hero.title1": "Grace Community",
    "hero.title2": "Church",
    "hero.sub": "A place of worship, fellowship, and hope. You are welcome here — every Sunday and every day.",
    "hero.cta1": "View Schedule",
    "hero.cta2": "Learn More",

    // About
    "about.eyebrow": "Who We Are",
    "about.title1": "A Church Built on",
    "about.title2": "Faith & Love",
    "about.v1.title": "Biblical Teaching",
    "about.v1.desc": "Grounded in Scripture, our services offer deep, practical teachings that inspire and transform lives.",
    "about.v2.title": "Compassionate Community",
    "about.v2.desc": "We care for one another and serve our neighbours — because love in action changes the world.",
    "about.v3.title": "Welcoming to All",
    "about.v3.desc": "No matter where you are on your journey, there is a seat for you at Grace Community Church.",
    "about.verse": '"For where two or three gather in my name, there am I with them."',
    "about.ref": "Matthew 18:20",

    // Schedule
    "schedule.eyebrow": "Service Times",
    "schedule.title1": "Weekly",
    "schedule.title2": "Schedule",
    "schedule.sub": "All are welcome. Come as you are and experience the presence of God with us.",
    "schedule.sunday": "Sunday",
    "schedule.wednesday": "Wednesday",
    "schedule.friday": "Friday",
    "schedule.saturday": "Saturday",
    "schedule.s1": "Early Morning Service",
    "schedule.s2": "Family Service",
    "schedule.s3": "Main Worship Service",
    "schedule.s4": "Evening Praise & Worship",
    "schedule.s5": "Midweek Bible Study",
    "schedule.s6": "Youth Group Meeting",
    "schedule.s7": "Prayer & Intercession Night",
    "schedule.s8": "Children's Sunday School",
    "schedule.s9": "Women's Fellowship",
    "schedule.loc.sanctuary": "Main Sanctuary",
    "schedule.loc.hall": "Fellowship Hall",
    "schedule.loc.roomA": "Room A",
    "schedule.loc.youth": "Youth Centre",
    "schedule.loc.children": "Children's Wing",
    "schedule.monthly.title1": "Monthly",
    "schedule.monthly.title2": "Highlights",
    "schedule.m1.date": "First Sunday",
    "schedule.m1.name": "Holy Communion Service",
    "schedule.m1.desc": "Join us for a special celebration of the Lord's Supper.",
    "schedule.m2.date": "Last Saturday",
    "schedule.m2.name": "Community Outreach",
    "schedule.m2.desc": "We serve meals and distribute essentials in the local community.",
    "schedule.m3.date": "Third Friday",
    "schedule.m3.name": "Healing & Deliverance Service",
    "schedule.m3.desc": "A powerful night of prayer, healing, and breakthrough.",

    // Events
    "events.eyebrow": "What's Coming Up",
    "events.title1": "Upcoming",
    "events.title2": "Events",
    "events.featured": "✦ Featured Event",
    "events.e1.title": "Annual Church Anniversary",
    "events.e1.time": "10:00 AM – 4:00 PM",
    "events.e1.loc": "Main Sanctuary & Grounds",
    "events.e1.desc": "Celebrate 70 years of God's faithfulness! Special music, testimonies, and a thanksgiving service.",
    "events.e2.title": "Easter Drama & Concert",
    "events.e2.time": "6:00 PM",
    "events.e2.loc": "Main Sanctuary",
    "events.e2.desc": "A powerful dramatic presentation of the Easter story followed by a live praise concert.",
    "events.e3.title": "Men's Breakfast Retreat",
    "events.e3.time": "7:00 AM",
    "events.e3.loc": "Fellowship Hall",
    "events.e3.desc": "Men of all ages gather for fellowship, breakfast, and a word of encouragement.",
    "events.e4.title": "Good Friday Service",
    "events.e4.time": "12:00 PM – 3:00 PM",
    "events.e4.loc": "Main Sanctuary",
    "events.e4.desc": "A solemn and reflective three-hour service commemorating the crucifixion of Christ.",
    "events.e5.title": "Youth Leadership Conference",
    "events.e5.time": "9:00 AM – 5:00 PM",
    "events.e5.loc": "Conference Hall",
    "events.e5.desc": "Equipping the next generation of church leaders with skills, vision, and spiritual depth.",
    "events.e6.title": "Community Health Fair",
    "events.e6.time": "10:00 AM – 2:00 PM",
    "events.e6.loc": "Church Grounds",
    "events.e6.desc": "Free health screenings, counselling, and wellness resources open to the entire community.",

    // Contact
    "contact.eyebrow": "We'd Love to Hear From You",
    "contact.title1": "Get in",
    "contact.title2": "Touch",
    "contact.findus": "Find Us",
    "contact.address.label": "Address",
    "contact.address.val": "123 Faith Avenue, Grace District\nYour City, State 00100",
    "contact.phone.label": "Phone",
    "contact.email.label": "Email",
    "contact.follow": "Follow Us",
    "contact.form.title": "Send a Message",
    "contact.form.fname": "First Name",
    "contact.form.lname": "Last Name",
    "contact.form.email": "Email",
    "contact.form.message": "Message",
    "contact.form.placeholder.fname": "John",
    "contact.form.placeholder.lname": "Doe",
    "contact.form.placeholder.email": "john@example.com",
    "contact.form.placeholder.message": "How can we help you?",
    "contact.form.submit": "Send Message",

    // Footer
    "footer.rights": "All rights reserved.",
    "footer.verse": '"Jesus Christ is Lord."',
  },

  ta: {
    // Nav
    "nav.home": "முகப்பு",
    "nav.about": "பற்றி",
    "nav.schedule": "அட்டவணை",
    "nav.events": "நிகழ்வுகள்",
    "nav.contact": "தொடர்பு",
    "nav.join": "சேருங்கள்",

    // Hero
    "hero.est": "நிறுவப்பட்டது 1954",
    "hero.title1": "கிருபை சமூக",
    "hero.title2": "திருச்சபை",
    "hero.sub": "வழிபாடு, கூட்டுறவு மற்றும் நம்பிக்கையின் இடம். நீங்கள் இங்கே வரவேற்கப்படுகிறீர்கள் — ஒவ்வொரு ஞாயிற்றுக்கிழமையும் ஒவ்வொரு நாளும்.",
    "hero.cta1": "அட்டவணை பார்க்க",
    "hero.cta2": "மேலும் அறிய",

    // About
    "about.eyebrow": "நாம் யார்",
    "about.title1": "நம்பிக்கையிலும் அன்பிலும்",
    "about.title2": "கட்டப்பட்ட திருச்சபை",
    "about.v1.title": "வேத போதனை",
    "about.v1.desc": "வேதாகமத்தை அடிப்படையாகக் கொண்டு, நமது ஆராதனைகள் ஆழமான, நடைமுறை போதனைகளை வழங்குகின்றன.",
    "about.v2.title": "அன்பான சமூகம்",
    "about.v2.desc": "நாம் ஒருவரையொருவர் அக்கறையோடு நேசிக்கிறோம் மற்றும் நமது அண்டை வீட்டாரை சேவிக்கிறோம்.",
    "about.v3.title": "அனைவரையும் வரவேற்கிறோம்",
    "about.v3.desc": "உங்கள் ஆன்மீக பயணத்தில் நீங்கள் எங்கே இருந்தாலும், கிருபை சமூக திருச்சபையில் உங்களுக்கு இடம் உண்டு.",
    "about.verse": '"இரண்டு அல்லது மூன்று பேர் என் நாமத்தினாலே கூடியிருக்கும் இடத்திலே நான் அவர்கள் நடுவில் இருக்கிறேன்."',
    "about.ref": "மத்தேயு 18:20",

    // Schedule
    "schedule.eyebrow": "ஆராதனை நேரங்கள்",
    "schedule.title1": "வார",
    "schedule.title2": "அட்டவணை",
    "schedule.sub": "அனைவரும் வரவேற்கப்படுகிறார்கள். நீங்கள் இருக்கும் நிலையிலேயே வாருங்கள், கடவுளின் சந்நிதியை அனுபவியுங்கள்.",
    "schedule.sunday": "ஞாயிறு",
    "schedule.wednesday": "புதன்",
    "schedule.friday": "வெள்ளி",
    "schedule.saturday": "சனி",
    "schedule.s1": "அதிகாலை ஆராதனை",
    "schedule.s2": "குடும்ப ஆராதனை",
    "schedule.s3": "பிரதான வழிபாட்டு ஆராதனை",
    "schedule.s4": "மாலை புகழ் ஆராதனை",
    "schedule.s5": "வாரநடு வேத ஆய்வு",
    "schedule.s6": "இளையோர் குழு கூட்டம்",
    "schedule.s7": "ஜெபம் & பரிந்துரை இரவு",
    "schedule.s8": "குழந்தைகள் ஞாயிற்றுப் பள்ளி",
    "schedule.s9": "மகளிர் சங்கம்",
    "schedule.loc.sanctuary": "பிரதான ஆலயம்",
    "schedule.loc.hall": "சங்க அரங்கம்",
    "schedule.loc.roomA": "அறை A",
    "schedule.loc.youth": "இளையோர் மையம்",
    "schedule.loc.children": "குழந்தைகள் பிரிவு",
    "schedule.monthly.title1": "மாதாந்திர",
    "schedule.monthly.title2": "சிறப்பு நிகழ்வுகள்",
    "schedule.m1.date": "முதல் ஞாயிறு",
    "schedule.m1.name": "பரிசுத்த விருந்து ஆராதனை",
    "schedule.m1.desc": "ஆண்டவரின் பந்தியை சிறப்பாக கொண்டாட எங்களுடன் சேருங்கள்.",
    "schedule.m2.date": "கடைசி சனி",
    "schedule.m2.name": "சமூக சேவை",
    "schedule.m2.desc": "நாங்கள் உணவு வழங்கி, அவசியப் பொருட்களை சமூகத்தில் விநியோகிக்கிறோம்.",
    "schedule.m3.date": "மூன்றாம் வெள்ளி",
    "schedule.m3.name": "சுகமளிப்பு & விடுதலை ஆராதனை",
    "schedule.m3.desc": "ஜெபம், குணமாதல் மற்றும் மாற்றத்தின் வலிமையான இரவு.",

    // Events
    "events.eyebrow": "வரவிருப்பவை",
    "events.title1": "வரவிருக்கும்",
    "events.title2": "நிகழ்வுகள்",
    "events.featured": "✦ சிறப்பு நிகழ்வு",
    "events.e1.title": "ஆண்டு திருச்சபை நினைவு விழா",
    "events.e1.time": "காலை 10:00 – மாலை 4:00",
    "events.e1.loc": "பிரதான ஆலயம் & வளாகம்",
    "events.e1.desc": "கடவுளின் 70 ஆண்டு உண்மையை கொண்டாடுங்கள்! சிறப்பு இசை, சாட்சிகள் மற்றும் நன்றி ஆராதனை.",
    "events.e2.title": "ஈஸ்டர் நாடகம் & இசை நிகழ்ச்சி",
    "events.e2.time": "மாலை 6:00",
    "events.e2.loc": "பிரதான ஆலயம்",
    "events.e2.desc": "ஈஸ்டர் கதையின் சக்திவாய்ந்த நாடக நிகழ்வுக்கு பிறகு நேரடி புகழ் கச்சேரி.",
    "events.e3.title": "ஆண்களின் காலை உணவு ஒன்றுகூடல்",
    "events.e3.time": "காலை 7:00",
    "events.e3.loc": "சங்க அரங்கம்",
    "events.e3.desc": "எல்லா வயதினரும் கூட்டுறவு, காலை உணவு மற்றும் ஊக்கமளிக்கும் வார்த்தைக்காக ஒன்று கூடுகிறார்கள்.",
    "events.e4.title": "நல்ல வெள்ளி ஆராதனை",
    "events.e4.time": "மதியம் 12:00 – மாலை 3:00",
    "events.e4.loc": "பிரதான ஆலயம்",
    "events.e4.desc": "கிறிஸ்துவின் சிலுவைச் சாவை நினைவுகூரும் மூன்று மணி நேர தியான ஆராதனை.",
    "events.e5.title": "இளையோர் தலைமைத்துவ மாநாடு",
    "events.e5.time": "காலை 9:00 – மாலை 5:00",
    "events.e5.loc": "மாநாட்டு அரங்கம்",
    "events.e5.desc": "திருச்சபையின் அடுத்த தலைமுறை தலைவர்களை திறன்களும் ஆன்மிக ஆழமும் கொண்டு தயார்படுத்துதல்.",
    "events.e6.title": "சமூக சுகாதார விழா",
    "events.e6.time": "காலை 10:00 – மதியம் 2:00",
    "events.e6.loc": "திருச்சபை வளாகம்",
    "events.e6.desc": "இலவச உடல்நல பரிசோதனை, ஆலோசனை மற்றும் ஆரோக்கிய வளங்கள் முழு சமூகத்திற்கும் திறந்தவை.",

    // Contact
    "contact.eyebrow": "உங்களிடமிருந்து கேட்கவும் மகிழ்ச்சியாக இருப்போம்",
    "contact.title1": "தொடர்பு",
    "contact.title2": "கொள்ளுங்கள்",
    "contact.findus": "எங்களை கண்டுபிடிக்க",
    "contact.address.label": "முகவரி",
    "contact.address.val": "123 நம்பிக்கை தெரு, கிருபை மாவட்டம்\nஉங்கள் நகரம், மாநிலம் 00100",
    "contact.phone.label": "தொலைபேசி",
    "contact.email.label": "மின்னஞ்சல்",
    "contact.follow": "எங்களை பின்தொடருங்கள்",
    "contact.form.title": "செய்தி அனுப்புங்கள்",
    "contact.form.fname": "முதல் பெயர்",
    "contact.form.lname": "கடைசி பெயர்",
    "contact.form.email": "மின்னஞ்சல்",
    "contact.form.message": "செய்தி",
    "contact.form.placeholder.fname": "யோகன்",
    "contact.form.placeholder.lname": "தாஸ்",
    "contact.form.placeholder.email": "yohan@example.com",
    "contact.form.placeholder.message": "நாங்கள் உங்களுக்கு எவ்வாறு உதவலாம்?",
    "contact.form.submit": "செய்தி அனுப்பு",

    // Footer
    "footer.rights": "அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை.",
    "footer.verse": '"இயேசு கிறிஸ்து ஆண்டவர்."',
  },
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Language>("en");

  const toggle = () => setLang((l) => (l === "en" ? "ta" : "en"));

  const t = (key: string): string =>
    translations[lang][key] ?? translations["en"][key] ?? key;

  return (
    <LanguageContext.Provider value={{ lang, toggle, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLang() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLang must be used inside LanguageProvider");
  return ctx;
}
