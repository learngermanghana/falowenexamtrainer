import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { changeInterfaceLanguage } from "../i18n";
import { updatePageMeta } from "../lib/pageMeta";
import academyProfile from "../data/publicAcademyProfile.json";
import VisitorQuestionHelper from "./VisitorQuestionHelper";
import FalowenHomepageCarousel from "./FalowenHomepageCarousel";
import HomepageStartPaths from "./HomepageStartPaths";
import "./LandingPageMarketing.css";

const COPY = {
  en: {
    language: "Language", login: "Log in", signup: "Sign up", returning: "Already signed up?",
    navSwahili: "Learn Swahili", navPartnerships: "Partnerships", navClasses: "Upcoming Classes", navMusic: "Music", navExams: "Exam practice", navBooks: "Books", navHelp: "About us",
    classScheduleAction: "View full class schedule",
    eyebrow: "GERMAN LEARNING THAT FITS YOUR LIFE",
    title: "Learn German your way.",
    titleAccent: "Grow with Falowen.",
    subtitle: "From A1 to C2, learn with live classes or at your own pace. Get recorded lectures, interactive workbooks, AI-powered practice and real tutor support — all in one place.",
    start: "Start 7 days free trial", placement: "Take free placement test",
    smallNote: "Not sure where to begin? Discover your level first.",
    heroPhoto: "Real German classes. Real support.",
    levels: "A1–C2", flexible: "Live or self-paced", supported: "AI + tutor support",
    featuresEyebrow: "WHY LEARN WITH FALOWEN",
    featuresTitle: "Four ways to move forward in German.",
    featuresIntro: "Whether you're beginning, improving your skills or preparing for an exam, Falowen helps you take the next step.",
    supportEyebrow: "LEARN WITH FALOWEN",
    supportTitle: "Follow a structured course at your own pace",
    supportText: "Join a live class or study independently from home. When life gets busy, use recorded lessons to catch up on your own schedule.",
    supportPractice: "Get tutor feedback on your work, and practise between lessons with music, books and the Falowen Study Buddy. You can also connect your Falowen account to ChatGPT to review what you’ve learned and prepare for your next lesson.",
    hybridEyebrow: "FLEXIBLE GERMAN LEARNING",
    hybridTitle: "Learn German your way.",
    hybridIntro: "Choose how you learn with Learn Language Education Academy and Falowen.",
    hybridInPersonTitle: "In person",
    hybridInPersonText: "Attend teacher-led classes in Accra.",
    hybridOnlineTitle: "Live online",
    hybridOnlineText: "Join interactive lessons from wherever you are.",
    hybridRecordedTitle: "Recorded lectures",
    hybridRecordedText: "Replay lessons and practise at your own pace on Falowen.",
    hybridAction: "Explore learning options",
    supportLink: "About our academy",
    reviewsIntro: "Hear it from our students",
    finalEyebrow: "YOUR NEXT STEP",
    finalTitle: "Your German journey starts here.",
    finalText: "Choose a class or learn at your own pace. We bring your lessons, practice and support together.",
    footerGhana: "German language school in Ghana", footerCourses: "German courses A1–C2", footerMusic: "Music", footerBooks: "German A1 coursebook", footerExam: "Free Goethe exam practice", footerReviews: "Student reviews", footerHelp: "About us", footerChatgpt: "Falowen in ChatGPT",
    footerCourseLevels: "German courses by level", footerGoetheLevels: "Goethe-style preparation by level",
    contact: "Questions? Chat with us on WhatsApp",
    featureCopy: {},
    metaTitle: "Falowen | Learn German and Swahili Online",
    metaDescription: "Learn German in Ghana with Falowen: German classes in Accra or online, A1–C2 courses and exam practice, plus Swahili courses on the Falowen app.",
  },
  de: {
    language: "Sprache", login: "Anmelden", signup: "Registrieren", returning: "Schon registriert?",
    navSwahili: "Kiswahili lernen", navPartnerships: "Partnerschaften", navClasses: "Kommende Kurse", navMusic: "Musik", navExams: "Prüfungsvorbereitung", navBooks: "Bücher", navHelp: "Über uns",
    classScheduleAction: "Vollständigen Kursplan ansehen",
    eyebrow: "DEUTSCH LERNEN, WIE ES ZU DIR PASST",
    title: "Lerne Deutsch auf deine Weise.",
    titleAccent: "Mit Falowen kommst du weiter.",
    subtitle: "Von A1 bis C2: Live-Kurse oder selbstständiges Lernen, mit Unterrichtsaufzeichnungen, interaktiven Arbeitsheften, KI-Übungen und Unterstützung von Lehrkräften.",
    start: "7 Tage kostenlos testen", placement: "Kostenlosen Einstufungstest machen",
    smallNote: "Noch unsicher beim Niveau? Finde deinen passenden Einstieg.",
    heroPhoto: "Echter Deutschunterricht. Persönliche Unterstützung.",
    levels: "A1–C2", flexible: "Live oder im eigenen Tempo", supported: "KI + Lehrkräfte",
    featuresEyebrow: "WARUM FALOWEN",
    featuresTitle: "Vier Wege, um mit Deutsch weiterzukommen.",
    featuresIntro: "Ganz gleich, ob du beginnst, dein Deutsch verbesserst oder eine Prüfung vorbereitest.",
    supportEyebrow: "DEINE LERNUNTERSTÜTZUNG",
    supportTitle: "Mit KI üben. Mit Lehrkräften besser werden.",
    supportText: "Schau dir Lektionen erneut an, übe so oft du möchtest und erhalte hilfreiches Feedback und Unterstützung.",
    hybridEyebrow: "FLEXIBEL DEUTSCH LERNEN",
    hybridTitle: "Lerne Deutsch auf deine Weise.",
    hybridIntro: "Entscheide selbst, wie du mit der Learn Language Education Academy und Falowen lernst.",
    hybridInPersonTitle: "Vor Ort",
    hybridInPersonText: "Besuche Deutschunterricht mit Lehrkräften in Accra.",
    hybridOnlineTitle: "Live online",
    hybridOnlineText: "Nimm von überall am interaktiven Unterricht teil.",
    hybridRecordedTitle: "Aufgezeichnete Lektionen",
    hybridRecordedText: "Sieh dir Lektionen erneut an und übe in deinem Tempo auf Falowen.",
    hybridAction: "Lernmöglichkeiten entdecken",
    supportLink: "Über unsere Akademie",
    reviewsIntro: "Das sagen unsere Lernenden",
    finalEyebrow: "DEIN NÄCHSTER SCHRITT",
    finalTitle: "Dein Deutschweg beginnt hier.",
    finalText: "Wähle einen Live-Kurs oder lerne selbstständig. Falowen verbindet Unterricht, Übungen und Unterstützung.",
    footerGhana: "Deutschschule in Ghana", footerCourses: "Deutschkurse A1–C2", footerMusic: "Musik", footerBooks: "A1 Kursbuch", footerExam: "Goethe-Prüfungsübungen", footerReviews: "Bewertungen", footerHelp: "Über uns", footerChatgpt: "Falowen mit ChatGPT",
    footerCourseLevels: "Deutschkurse nach Niveau", footerGoetheLevels: "Goethe-Prüfungsvorbereitung nach Niveau",
    contact: "Fragen? Schreib uns auf WhatsApp",
    featureCopy: {
      placement: ["Finde dein Deutschniveau", "Mache einen kostenlosen Einstufungstest und finde deinen Einstieg.", "Einstufungstest machen"],
      exams: ["Bereite dich auf Goethe-Prüfungen vor", "Übe mit Beispieltests und vollständigen Probeprüfungen für Lesen, Hören, Schreiben und Sprechen, mit KI-Feedback.", "Prüfungen üben"],
      class: ["Lerne im Live-Kurs", "Lerne mit Lehrkräften, erhalte Feedback und sieh dir aufgezeichnete Lektionen erneut an.", "Live-Kurse ansehen"],
      self: ["Lerne in deinem Tempo", "Lerne selbstständig mit Arbeitsheften, Unterrichtsaufzeichnungen, KI-Übungen und Unterstützung.", "Selbstständig starten"],
    },
    metaTitle: "Falowen | Deutsch und Kiswahili online lernen",
    metaDescription: "Lerne Deutsch von A1 bis C2 mit Live-Kursen und Prüfungstraining oder starte mit dem Online-Kursbuch Kiswahili A1.",
  },
  fr: {
    language: "Langue", login: "Se connecter", signup: "S'inscrire", returning: "Déjà inscrit ?",
    navSwahili: "Apprendre le swahili", navPartnerships: "Partenariats", navClasses: "Prochains cours", navMusic: "Musique", navExams: "Examens blancs", navBooks: "Livres", navHelp: "À propos",
    classScheduleAction: "Voir le calendrier complet des cours",
    eyebrow: "APPRENDRE L'ALLEMAND À VOTRE RYTHME",
    title: "Apprenez l'allemand à votre façon.",
    titleAccent: "Progressez avec Falowen.",
    subtitle: "Du niveau A1 au C2 : cours en direct ou à votre rythme, vidéos enregistrées, cahiers interactifs, exercices avec IA et aide d'enseignants.",
    start: "Essayer gratuitement pendant 7 jours", placement: "Faire le test de niveau gratuit",
    smallNote: "Vous ne connaissez pas votre niveau ? Commencez par le test gratuit.",
    heroPhoto: "De vrais cours d'allemand. Un soutien humain.",
    levels: "A1–C2", flexible: "En direct ou à son rythme", supported: "IA + enseignants",
    featuresEyebrow: "POURQUOI FALOWEN",
    featuresTitle: "Quatre façons de progresser en allemand.",
    featuresIntro: "Débutez, perfectionnez vos compétences ou préparez votre examen à votre rythme.",
    supportEyebrow: "VOTRE ACCOMPAGNEMENT",
    supportTitle: "Pratiquez avec l'IA. Progressez avec un enseignant.",
    supportText: "Revoyez les cours, exercez-vous autant que nécessaire et profitez de conseils d'enseignants.",
    hybridEyebrow: "APPRENEZ L'ALLEMAND À VOTRE FAÇON",
    hybridTitle: "Apprenez l'allemand à votre rythme.",
    hybridIntro: "Choisissez comment apprendre avec Learn Language Education Academy et Falowen.",
    hybridInPersonTitle: "En présentiel",
    hybridInPersonText: "Participez aux cours avec un enseignant à Accra.",
    hybridOnlineTitle: "En direct",
    hybridOnlineText: "Suivez des cours interactifs où que vous soyez.",
    hybridRecordedTitle: "Cours enregistrés",
    hybridRecordedText: "Revoyez les leçons et entraînez-vous à votre rythme sur Falowen.",
    hybridAction: "Découvrir les formules",
    supportLink: "À propos de notre école",
    reviewsIntro: "L'avis de nos élèves",
    finalEyebrow: "VOTRE PROCHAINE ÉTAPE",
    finalTitle: "Votre apprentissage commence ici.",
    finalText: "Choisissez un cours en direct ou apprenez à votre rythme. Falowen réunit les cours, exercices et aides.",
    footerGhana: "École d’allemand au Ghana", footerCourses: "Cours A1–C2", footerMusic: "Musique", footerBooks: "Livre d’allemand A1", footerExam: "Examens de type Goethe", footerReviews: "Avis des élèves", footerHelp: "À propos", footerChatgpt: "Falowen dans ChatGPT",
    footerCourseLevels: "Cours d’allemand par niveau", footerGoetheLevels: "Préparation Goethe par niveau",
    contact: "Des questions ? Contactez-nous sur WhatsApp",
    featureCopy: {
      placement: ["Trouvez votre niveau d'allemand", "Faites un test de niveau gratuit pour savoir par où commencer.", "Faire le test"],
      exams: ["Préparez les examens de type Goethe", "Entraînez-vous avec des examens blancs complets et des exemples en lecture, écoute, écrit et oral, avec l'aide de l'IA.", "Préparer l'examen"],
      class: ["Apprenez en classe", "Suivez des cours avec un enseignant, obtenez des corrections et revoyez les leçons enregistrées.", "Voir les cours"],
      self: ["Apprenez à votre rythme", "Étudiez en autonomie avec des cahiers, cours enregistrés, exercices avec IA et aide humaine.", "Étudier en autonomie"],
    },
    metaTitle: "Falowen | Apprendre l’allemand et le swahili en ligne",
    metaDescription: "Apprenez l’allemand du niveau A1 au C2 avec des cours en direct et des exercices d’examen, ou commencez le swahili avec le cahier A1 en ligne.",
  },
};

COPY.sw = { ...COPY.en, ...{
  "language": "Lugha",
  "login": "Ingia",
  "signup": "Jisajili",
  "returning": "Tayari una akaunti?",
  "navSwahili": "Jifunze Kiswahili",
  "navPartnerships": "Ushirikiano",
  "navClasses": "Madarasa yajayo",
  "navMusic": "Muziki",
  "navExams": "Mazoezi ya mitihani",
  "navBooks": "Vitabu",
  "navHelp": "Kutuhusu",
  "classScheduleAction": "Tazama ratiba kamili ya madarasa",
  "eyebrow": "JIFUNZE KIJERUMANI KWA NJIA INAYOKUFAA",
  "title": "Jifunze Kijerumani kwa njia yako.",
  "titleAccent": "Endelea mbele na Falowen.",
  "subtitle": "Kuanzia A1 hadi C2, jifunze katika madarasa ya moja kwa moja au kwa muda wako. Pata video za masomo, vitabu vya mazoezi, mazoezi kwa AI na msaada wa mwalimu mahali pamoja.",
  "start": "Anza majaribio ya siku 7",
  "placement": "Fanya mtihani wa kiwango bila malipo",
  "smallNote": "Hujui pa kuanzia? Tambua kiwango chako kwanza.",
  "heroPhoto": "Madarasa halisi ya Kijerumani. Msaada wa kweli.",
  "levels": "A1–C2",
  "flexible": "Darasani au kwa muda wako",
  "supported": "AI na msaada wa mwalimu",
  "featuresEyebrow": "KWA NINI UJIFUNZE NA FALOWEN",
  "featuresTitle": "Njia nne za kuendelea kujifunza Kijerumani.",
  "featuresIntro": "Uwe unaanza, unaimarisha ujuzi au unajiandaa kwa mtihani, Falowen inakusaidia.",
  "supportEyebrow": "JIFUNZE NA FALOWEN",
  "supportTitle": "Fuata kozi iliyopangwa kwa muda wako",
  "supportText": "Hudhuria darasa la moja kwa moja au jifunze nyumbani. Tazama masomo yaliyorekodiwa unapopata nafasi.",
  "supportPractice": "Pata mrejesho wa mwalimu kuhusu kazi zako. Fanya mazoezi kwa muziki, vitabu na Falowen Study Buddy.",
  "hybridEyebrow": "NJIA MBALIMBALI ZA KUJIFUNZA",
  "hybridTitle": "Jifunze Kijerumani kwa njia yako.",
  "hybridIntro": "Chagua namna unayotaka kujifunza kupitia Learn Language Education Academy na Falowen.",
  "hybridInPersonTitle": "Darasani",
  "hybridInPersonText": "Hudhuria madarasa yanayoongozwa na mwalimu mjini Accra.",
  "hybridOnlineTitle": "Moja kwa moja mtandaoni",
  "hybridOnlineText": "Shiriki katika masomo popote ulipo.",
  "hybridRecordedTitle": "Masomo yaliyorekodiwa",
  "hybridRecordedText": "Rudia masomo na ufanye mazoezi kwa muda wako.",
  "hybridAction": "Chunguza njia za kujifunza",
  "supportLink": "Kuhusu akademia yetu",
  "reviewsIntro": "Sikia kutoka kwa wanafunzi wetu",
  "finalEyebrow": "HATUA YAKO INAYOFUATA",
  "finalTitle": "Safari yako ya Kijerumani inaanza hapa.",
  "finalText": "Chagua darasa au jifunze kwa muda wako. Masomo na msaada vyote vipo pamoja.",
  "footerGhana": "Shule ya Kijerumani nchini Ghana",
  "footerCourses": "Kozi za Kijerumani A1–C2",
  "footerMusic": "Muziki",
  "footerBooks": "Kitabu cha Kijerumani A1",
  "footerExam": "Mazoezi ya mitihani ya Goethe bila malipo",
  "footerReviews": "Maoni ya wanafunzi",
  "footerHelp": "Kutuhusu",
  "footerChatgpt": "Falowen katika ChatGPT",
  "footerCourseLevels": "Kozi za Kijerumani kwa kila kiwango",
  "footerGoetheLevels": "Maandalizi ya Goethe kwa kila kiwango",
  "contact": "Una maswali? Wasiliana nasi kupitia WhatsApp",
  "metaTitle": "Falowen | Jifunze Kijerumani na Kiswahili Mtandaoni",
  "metaDescription": "Jifunze Kijerumani A1–C2 katika madarasa ya moja kwa moja au anza Kiswahili kwa kitabu cha A1 mtandaoni."
} };

const FOOTER_LINKS = [
  { href: "/courses/", labelKey: "footerCourses" },
  { href: "/learn-german-ghana", labelKey: "footerGhana" },
  { href: "/books", labelKey: "footerBooks" },
  { href: "https://music.falowen.app/", labelKey: "footerMusic" },
  { href: "/exam-practice", labelKey: "footerExam" },
  { href: "/reviews/", labelKey: "footerReviews" },
  { href: "/learn-german-with-chatgpt", labelKey: "footerChatgpt" },
  { href: "/partnerships", labelKey: "navPartnerships" },
  { href: "/about-us", labelKey: "footerHelp" },
];

const COURSE_LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"];

const LANGUAGE_OPTIONS = [
  { value: "en", label: "English" },
  { value: "de", label: "Deutsch" },
  { value: "fr", label: "Français" },
  { value: "sw", label: "Kiswahili" },
];


function MeetOurTeam({ team, language }) {
  const trackRef = React.useRef(null);
  const [paused, setPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [touching, setTouching] = useState(false);
  const labels = {
    en: { kicker: "THE PEOPLE BEHIND FALOWEN", heading: "Meet our German and Kiswahili team", intro: "Real educators and advisors supporting your learning journey.", about: "Read full profile", less: "Close profile", all: "Meet the whole team", previous: "Previous team members", next: "Next team members", pause: "Pause automatic rotation", play: "Resume automatic rotation" },
    de: { kicker: "DIE MENSCHEN HINTER FALOWEN", heading: "Unser Deutsch- und Kiswahili-Team", intro: "Lerne die Lehrkräfte und Berater kennen, die dich begleiten.", about: "Ganzes Profil lesen", less: "Profil schließen", all: "Das gesamte Team kennenlernen", previous: "Vorherige Teammitglieder", next: "Nächste Teammitglieder", pause: "Automatischen Wechsel pausieren", play: "Automatischen Wechsel fortsetzen" },
    fr: { kicker: "L'ÉQUIPE DERRIÈRE FALOWEN", heading: "Notre équipe d'allemand et de kiswahili", intro: "Découvrez les enseignants et conseillers qui vous accompagnent.", about: "Voir le profil", less: "Fermer le profil", all: "Découvrir toute l'équipe", previous: "Membres précédents", next: "Membres suivants", pause: "Mettre le défilement automatique en pause", play: "Reprendre le défilement automatique" },
  };
  const copy = language === "sw" ? { kicker: "WATU WA FALOWEN", heading: "Timu yetu ya Kijerumani na Kiswahili", intro: "Walimu na washauri wanaosaidia safari yako ya kujifunza.", about: "Soma wasifu", less: "Funga wasifu", all: "Kutana na timu nzima", previous: "Wengine wa timu", next: "Wengine wa timu", pause: "Sitisha mzunguko", play: "Endeleza mzunguko" } : (labels[language] || labels.en);
  const move = (direction) => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.querySelector(".falowen-team-card");
    if (!card) return;
    const gap = parseFloat(window.getComputedStyle(track).columnGap) || 0;
    const distance = card.getBoundingClientRect().width + gap;
    const visibleCards = Math.max(1, Math.round(track.clientWidth / distance));
    const positions = Math.max(1, team.length - visibleCards + 1);
    const current = Math.round(track.scrollLeft / distance);
    const next = (current + direction + positions) % positions;
    track.scrollTo({ left: next * distance, behavior: "smooth" });
  };

  useEffect(() => {
    if (paused || hovered || focused || touching || team.length < 2) return undefined;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return undefined;
    const timer = window.setInterval(() => {
      if (document.hidden || trackRef.current?.querySelector("details[open]")) return;
      move(1);
    }, 3000);
    return () => window.clearInterval(timer);
  }, [paused, hovered, focused, touching, team.length]);
  return (
    <section className="falowen-team-section" aria-labelledby="falowen-team-heading"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocusCapture={() => setFocused(true)}
      onBlurCapture={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false); }}
      onTouchStart={() => setTouching(true)}
      onTouchEnd={() => setTouching(false)}
      onTouchCancel={() => setTouching(false)}
    >
      <div className="falowen-team-top">
        <div>
          <span className="falowen-home-section-kicker">{copy.kicker}</span>
          <h2 id="falowen-team-heading">{copy.heading}</h2>
          <p>{copy.intro}</p>
        </div>
        <a className="falowen-team-about-link" href="/about-us">{copy.all} <span aria-hidden="true">→</span></a>
      </div>
      <div className="falowen-team-carousel-wrap">
        <div className="falowen-team-track" ref={trackRef} role="region" aria-label={copy.heading} tabIndex={0}>
          {team.map((person) => (
            <article className="falowen-team-card" key={person.name}>
              <div className="falowen-team-image-wrap">
                <img src={person.image} alt={person.name} loading="lazy" style={person.imagePosition ? { objectPosition: person.imagePosition } : undefined} />
              </div>
              <div className="falowen-team-card-body">
                <h3>{person.name}</h3>
                <p className="falowen-team-role">{person.role}</p>
                {Array.isArray(person.credentials) && person.credentials.length > 0 && (
                  <div className="falowen-team-credentials" aria-label="Qualifications">
                    {person.credentials.map((credential) => <span key={credential}>{credential}</span>)}
                  </div>
                )}
                <details className="falowen-team-profile">
                  <summary>{copy.about}</summary>
                  <p>{person.bio}</p>
                </details>
              </div>
            </article>
          ))}
        </div>
        <div className="falowen-team-controls" aria-label={copy.heading}>
          <button type="button" onClick={() => setPaused((value) => !value)} aria-label={paused ? copy.play : copy.pause} aria-pressed={paused}>{paused ? "▶" : "Ⅱ"}</button>
          <button type="button" onClick={() => move(-1)} aria-label={copy.previous}>‹</button>
          <button type="button" onClick={() => move(1)} aria-label={copy.next}>›</button>
        </div>
      </div>
    </section>
  );
}

export default function LandingPageSimple({ onSignUp, onLogin }) {
  const { i18n } = useTranslation();
  const detected = String(i18n.resolvedLanguage || i18n.language || "en").slice(0, 2);
  const [language, setLanguage] = useState(COPY[detected] ? detected : "en");
  const copy = COPY[language] || COPY.en;

  useEffect(() => {
    const next = String(i18n.resolvedLanguage || i18n.language || "en").slice(0, 2);
    if (COPY[next]) setLanguage(next);
  }, [i18n.language, i18n.resolvedLanguage]);

  useEffect(() => {
    updatePageMeta({
      title: copy.metaTitle, description: copy.metaDescription,
      canonicalPath: "/", lang: language, ogType: "website",
    });
    document.documentElement.lang = language;
  }, [copy.metaTitle, copy.metaDescription, language]);

  const changeLanguage = async (event) => {
    const next = event.target.value;
    if (!COPY[next]) return;
    setLanguage(next);
    document.documentElement.lang = next;
    try {
      await changeInterfaceLanguage(next);
    } catch (error) {
      console.error("Failed to change interface language", error);
    }
  };

  const signup = () => onSignUp?.();
  const login = () => onLogin?.();

  return (
    <main className="falowen-public-home">
      <div className="falowen-home-shell">
        <nav className="falowen-home-nav" aria-label="Falowen">
          <a href="/" className="falowen-home-brand" aria-label="Falowen home">
            <img src="/logo192.png" alt="" width="38" height="38" />
            <span className="falowen-home-brand-copy">
              <span className="falowen-home-brand-name">falowen<span className="falowen-home-brand-dot">.</span></span>
              <span className="falowen-home-brand-subtitle">by Learn Language Education Academy</span>
            </span>
          </a>
          <div className="falowen-home-nav-links">
            <a href="/classes">{copy.navClasses}</a>
            <a href="https://music.falowen.app/">{copy.navMusic}</a>
            <a href="https://exams.falowen.app/">{copy.navExams}</a>
            <a href="/books">{copy.navBooks}</a>
            <a href="/partnerships">{copy.navPartnerships}</a>
            <a href="/about-us">{copy.navHelp}</a>
          </div>
          <div className="falowen-home-nav-actions">
            <label className="falowen-home-language-wrap">
              <span className="falowen-home-visually-hidden">{copy.language}</span>
              <select value={language} onChange={changeLanguage} aria-label={copy.language} className="falowen-home-language">
                {LANGUAGE_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
              </select>
            </label>
            <button className="falowen-home-login" type="button" onClick={login}>{copy.login}</button>
            <button className="falowen-home-nav-signup" type="button" onClick={signup}>{copy.signup} ↗</button>
          </div>
        </nav>

        <FalowenHomepageCarousel language={language} classroomImage={academyProfile.classroomImage} onSignUp={signup} />

        <HomepageStartPaths language={language} onSignUp={signup} />

        <MeetOurTeam team={academyProfile.team} language={language} />

        <div className="falowen-home-reviews-intro"><p>{copy.reviewsIntro}</p></div>
        {/* /homepage-reviews.js injects genuine Google reviews before the final CTA. */}

        <footer className="falowen-home-footer">
          <div className="falowen-home-footer-links">
            {FOOTER_LINKS.map((item) => <a href={item.href} key={item.href}>{copy[item.labelKey]}</a>)}
          </div>
          <div className="falowen-home-level-directory">
            <nav className="falowen-home-level-group" aria-label={copy.footerCourseLevels}>
              <span className="falowen-home-level-title">{copy.footerCourseLevels}</span>
              <div className="falowen-home-level-list">
                {COURSE_LEVELS.map((level) => (
                  <a key={level} href={`/learn-german-${level.toLowerCase()}`}>{level}</a>
                ))}
              </div>
            </nav>
            <nav className="falowen-home-level-group" aria-label={copy.footerGoetheLevels}>
              <span className="falowen-home-level-title">{copy.footerGoetheLevels}</span>
              <div className="falowen-home-level-list">
                {COURSE_LEVELS.map((level) => (
                  <a key={level} href={`/goethe-${level.toLowerCase()}-preparation`}>{level}</a>
                ))}
              </div>
            </nav>
          </div>
          <a className="falowen-home-contact-link" href="https://wa.me/233205706589" target="_blank" rel="noopener noreferrer">{copy.contact} ↗</a>
        </footer>
      </div>
      <VisitorQuestionHelper />
    </main>
  );
}
