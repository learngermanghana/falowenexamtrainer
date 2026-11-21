import React, { useEffect, useRef, useState } from "react";
import "./FalowenHomepageCarousel.css";
import { loadPublicClasses } from "../services/publicClassCatalogService";

const WORDING = {
  en: [
    { kicker:"LANGUAGE LEARNING ONLINE",title:"Learn German and Swahili",accent:"with Falowen.",desc:"Join a German class or start Swahili with the online A1 Course Book. Choose your language when you sign up.",action:"Sign up",support:"View German classes",href:"/signup",kind:"courses" },
    { kicker:"FALOWEN MUSIC",title:"Learn with",accent:"music.",desc:"Listen to songs in German and Swahili. Follow the lyrics and practise pronunciation as you listen.",action:"German songs",support:"Swahili songs",supportHref:"https://music.falowen.app/?language=swahili",href:"https://music.falowen.app/",kind:"music",art:"German · Swahili" },
    { kicker:"FREE PLACEMENT TEST",title:"Find your",accent:"language level.",desc:"Already know some German or Kiswahili? Choose your language and take a free A1–B1 placement test.",action:"Take free placement test",href:"/placement-test",kind:"placement" },
    { kicker:"GOETHE-STYLE EXAM PRACTICE",title:"Prepare for",accent:"your German exam.",desc:"Practise sample tests and full mocks in Lesen, Hören, Schreiben and Sprechen, with AI-supported feedback.",action:"Explore exam practice",href:"/exam-practice",kind:"exams" },
    { kicker:"FALOWEN BOOKSTORE",title:"Learn more with",accent:"German books.",desc:"Explore Falowen German workbooks. Choose an available digital edition or order a printed book.",action:"Browse German books",href:"/books",kind:"books" },
    { kicker:"FALOWEN IN CHATGPT",title:"Learn German",accent:"with ChatGPT.",desc:"Connect your Falowen account to ask about assignments, review recorded feedback and prepare for your next class. Your learning stays linked to Falowen Campus.",action:"How to use Falowen with ChatGPT",href:"/learn-german-with-chatgpt",kind:"chatgpt" },
  ],
  de: [
    { kicker:"SPRACHEN ONLINE LERNEN",title:"Lerne Deutsch und Kiswahili",accent:"mit Falowen.",desc:"Besuche einen Deutschkurs oder starte mit dem Online-Kursbuch Kiswahili A1. Wähle deine Sprache bei der Registrierung.",action:"Registrieren",support:"Deutschkurse ansehen",href:"/signup",kind:"courses" },
    { kicker:"FALOWEN MUSIK",title:"Lerne mit",accent:"Musik.",desc:"Höre Lieder auf Deutsch und Kiswahili. Lies die Liedtexte mit und übe die Aussprache.",action:"Deutsche Lieder",support:"Lieder auf Kiswahili",supportHref:"https://music.falowen.app/?language=swahili",href:"https://music.falowen.app/",kind:"music",art:"Deutsch · Kiswahili" },
    { kicker:"KOSTENLOSER EINSTUFUNGSTEST",title:"Finde dein",accent:"Sprachniveau.",desc:"Du kannst schon Deutsch oder Kiswahili? Wähle die Sprache und starte den kostenlosen A1–B1-Einstufungstest.",action:"Einstufungstest starten",href:"/placement-test",kind:"placement" },
    { kicker:"GOETHE-ORIENTIERTE PRÜFUNGSÜBUNGEN",title:"Bereite dich auf",accent:"deine Prüfung vor.",desc:"Übe Lesen, Hören, Schreiben und Sprechen mit Beispieltests, Probeprüfungen und KI-Feedback.",action:"Prüfungsübungen ansehen",href:"/exam-practice",kind:"exams" },
    { kicker:"FALOWEN BÜCHER",title:"Deutsch lernen",accent:"mit Arbeitsbüchern.",desc:"Entdecke Falowen Arbeitsbücher als verfügbare digitale oder gedruckte Ausgabe.",action:"Bücher ansehen",href:"/books",kind:"books" },
    { kicker:"FALOWEN IN CHATGPT",title:"Deutsch lernen",accent:"mit ChatGPT.",desc:"Verbinde dein Falowen-Konto, prüfe deine Aufgaben, sieh dir gespeichertes Feedback an und bereite dich auf den nächsten Unterricht vor.",action:"Falowen mit ChatGPT nutzen",href:"/learn-german-with-chatgpt",kind:"chatgpt" },
  ],
  fr: [
    { kicker:"APPRENDRE LES LANGUES EN LIGNE",title:"Apprenez l’allemand et le swahili",accent:"avec Falowen.",desc:"Suivez un cours d’allemand ou commencez le swahili avec le cahier A1 en ligne. Choisissez votre langue à l’inscription.",action:"S’inscrire",support:"Voir les cours d’allemand",href:"/signup",kind:"courses" },
    { kicker:"FALOWEN MUSIQUE",title:"Apprenez en",accent:"musique.",desc:"Écoutez des chansons en allemand et en swahili. Suivez les paroles et entraînez votre prononciation.",action:"Chansons en allemand",support:"Chansons en swahili",supportHref:"https://music.falowen.app/?language=swahili",href:"https://music.falowen.app/",kind:"music",art:"Allemand · Swahili" },
    { kicker:"TEST DE NIVEAU GRATUIT",title:"Découvrez votre",accent:"niveau de langue.",desc:"Vous connaissez l’allemand ou le kiswahili ? Choisissez votre langue et faites notre test gratuit A1–B1.",action:"Faire le test gratuit",href:"/placement-test",kind:"placement" },
    { kicker:"PRÉPARATION AUX EXAMENS TYPE GOETHE",title:"Préparez votre",accent:"examen d'allemand.",desc:"Entraînez-vous en lecture, écoute, expression écrite et orale avec des examens blancs et des retours IA.",action:"Explorer les examens",href:"/exam-practice",kind:"exams" },
    { kicker:"LIVRES FALOWEN",title:"Progressez avec",accent:"nos livres d'allemand.",desc:"Découvrez les cahiers Falowen disponibles en version numérique ou imprimée.",action:"Voir les livres",href:"/books",kind:"books" },
    { kicker:"FALOWEN DANS CHATGPT",title:"Apprenez l’allemand",accent:"avec ChatGPT.",desc:"Connectez votre compte Falowen pour consulter vos devoirs, vos résultats enregistrés et préparer votre prochain cours.",action:"Utiliser Falowen avec ChatGPT",href:"/learn-german-with-chatgpt",kind:"chatgpt" },
  ]
};

const CLASS_COPY = {
  en: { title:"Find your next class", label:"NEXT INTAKE", generic:"Start your German journey", desc:"A clear foundation. A tutor to guide you.", date:"Next intake", schedule:"Class schedule", format:"Learning format", online:"Live online classes", zone:"Time zone", pending:"See available classes", times:"View meeting times", cta:"View class details & register", other:"Already learning German?", explore:"Explore classes", loading:"Loading upcoming classes…", benefits:["Live online lessons","Lesson recordings","Structured workbooks"] },
  de: { title:"Finde deinen nächsten Kurs", label:"NÄCHSTER KURSSTART", generic:"Starte deine Deutschreise", desc:"Eine klare Grundlage. Begleitung durch eine Lehrkraft.", date:"Kursstart", schedule:"Unterrichtszeiten", format:"Unterrichtsform", online:"Live-Online-Unterricht", zone:"Zeitzone", pending:"Verfügbare Kurse ansehen", times:"Unterrichtszeiten ansehen", cta:"Kursdetails & Anmeldung", other:"Du lernst bereits Deutsch?", explore:"Kurse entdecken", loading:"Kurse werden geladen…", benefits:["Live-Online-Unterricht","Aufzeichnungen","Arbeitsbücher"] },
  fr: { title:"Trouvez votre prochain cours", label:"PROCHAINE RENTRÉE", generic:"Commencez votre parcours en allemand", desc:"Des bases solides. Un enseignant pour vous guider.", date:"Début du cours", schedule:"Horaires", format:"Format", online:"Cours en direct en ligne", zone:"Fuseau horaire", pending:"Voir les cours disponibles", times:"Voir les horaires", cta:"Détails du cours et inscription", other:"Vous apprenez déjà l’allemand ?", explore:"Explorer les cours", loading:"Chargement des cours…", benefits:["Cours en direct","Enregistrements","Cahiers structurés"] },
};

function UpcomingClassCard({ language }) {
  const [classes, setClasses] = useState(null);
  const copy = CLASS_COPY[language] || CLASS_COPY.en;
  useEffect(() => {
    let cancelled = false;
    loadPublicClasses().then(items => { if (!cancelled) setClasses(items); })
      .catch(() => { if (!cancelled) setClasses([]); });
    return () => { cancelled = true; };
  }, []);
  const today = new Date().toLocaleDateString("en-CA", { timeZone:"Africa/Accra", year:"numeric", month:"2-digit", day:"2-digit" });
  const course = (classes || []).filter(item => item.availability !== "always" && !item.isSelfLearning && item.publicVisible !== false && item.registrationOpen !== false && item.startDate >= today)
    .sort((a,b) => a.startDate.localeCompare(b.startDate))[0];
  const href = course?.classUrl || "/classes";
  const start = course ? new Date(`${course.startDate}T12:00:00Z`).toLocaleDateString(language === "de" ? "de-DE" : language === "fr" ? "fr-FR" : "en-GB", { day:"numeric", month:"short", year:"numeric", timeZone:"Africa/Accra" }) : copy.pending;
  const times = (course?.meetingDays || []).map(slot => `${slot.day} ${slot.startTime || ""}${slot.endTime ? `–${slot.endTime}` : ""}`).join(" · ");
  return <div className="falowen-class-board" aria-label={copy.title}>
    <div className="falowen-class-board-head"><div><small>LEARN LANGUAGE EDUCATION ACADEMY</small><h2>{copy.title}</h2></div><span aria-hidden="true">▦</span></div>
    <div className="falowen-class-board-body" aria-busy={classes === null}>
      <div className="falowen-class-board-label"><strong>{course?.level || "DE"}</strong><span>{copy.label}</span></div>
      <h3>{course?.title || copy.generic}</h3><p>{classes === null ? copy.loading : copy.desc}</p>
      <dl><div><dt>{copy.date}</dt><dd>{start}</dd></div><div><dt>{copy.schedule}</dt><dd>{times || copy.times}</dd></div><div><dt>{copy.format}</dt><dd>{copy.online}</dd></div><div><dt>{copy.zone}</dt><dd>{course?.timeZone || course?.timezone || "Africa/Accra (GMT)"}</dd></div></dl>
      <a className="falowen-class-board-cta" href={href}>{copy.cta} <span aria-hidden="true">→</span></a>
      <div className="falowen-class-board-footer"><span>{copy.other}</span><a href="/classes">{copy.explore} →</a></div>
    </div>
  </div>;
}

function SlideIllustration({kind,language,art}) {
  if (kind === "courses") return <UpcomingClassCard language={language} />;
  if(kind==="music") return (
    <div className="falowen-slide-illustration falowen-slide-music" aria-hidden="true">
      <div className="falowen-slide-music-player">
        <div className="falowen-slide-music-top"><span className="falowen-slide-music-mark">♫</span> FALOWEN MUSIC</div>
        <div className="falowen-slide-music-art"><img src="/music/covers/photos/friendship.jpg" alt="" loading="lazy" decoding="async" /></div>
        <strong>{art}</strong>
        <div className="falowen-slide-music-wave">
          {[12, 22, 35, 25, 43, 29, 18, 36, 45, 30, 16, 32, 40, 25, 14, 27, 36, 19].map((height, index) => <span key={index} style={{ height }} />)}
        </div>
        <div className="falowen-slide-music-caption"><span>Follow the lyrics</span><span>Listen & learn</span></div>
      </div>
    </div>
  );
  if(kind==="chatgpt") return (
    <div className="falowen-slide-illustration" aria-hidden="true">
      <div className="falowen-slide-paper falowen-slide-chatgpt">
        <div className="falowen-slide-paper-label">FALOWEN · CHATGPT</div>
        <strong>Your study companion</strong>
        <small>Connected to your own Falowen learning record</small>
        <div className="falowen-slide-answer">What is my next assignment?</div>
        <div className="falowen-slide-answer selected">Review my latest feedback</div>
        <div className="falowen-slide-answer">Prepare me for my next class</div>
      </div>
    </div>
  );
  if(kind==="placement") return (
    <div className="falowen-slide-illustration" aria-hidden="true">
      <div className="falowen-slide-paper">
        <div className="falowen-slide-paper-label">FALOWEN · LEVEL CHECK</div>
        <strong>What is your level?</strong>
        <small>German placement test · A1–B1</small>
        <div className="falowen-slide-answer">○ &nbsp; A1 — Beginner</div>
        <div className="falowen-slide-answer selected">● &nbsp; A2 — Elementary</div>
        <div className="falowen-slide-answer">○ &nbsp; B1 — Intermediate</div>
        <div className="falowen-slide-progress"><span /></div>
      </div>
    </div>
  );
  if(kind==="exams") return (
    <div className="falowen-slide-illustration" aria-hidden="true">
      <div className="falowen-slide-paper">
        <div className="falowen-slide-paper-label">FALOWEN · EXAM PRACTICE</div>
        <strong>Goethe-style mock</strong>
        <small>Train all four exam skills</small>
        <div className="falowen-slide-skills">
          {["Lesen","Hören","Schreiben","Sprechen"].map(name=><span key={name}>{name} ✓</span>)}
        </div>
        <div className="falowen-slide-ready">Practice with AI feedback</div>
      </div>
    </div>
  );
  return (
    <div className="falowen-slide-illustration" aria-hidden="true">
      <div className="falowen-slide-book">
        <span>FALOWEN</span>
        <strong>Deutsch<br/>A1</strong>
        <small>COURSE & WORKBOOK</small>
      </div>
      <div className="falowen-slide-book-back" />
    </div>
  );
}

export default function FalowenHomepageCarousel({ language="en", classroomImage, onSignUp }) {
  const slides=WORDING[language] || WORDING.en;
  const [active,setActive]=useState(0);
  const [paused,setPaused]=useState(false);
  const [restart,setRestart]=useState(0);
  const touchX=useRef(null);
  useEffect(()=>{
    if(paused || (typeof window!=="undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches)) return undefined;
    const handle=window.setInterval(()=>{if(!document.hidden)setActive(value=>(value+1)%slides.length);},5000);
    return ()=>window.clearInterval(handle);
  },[paused,restart,slides.length]);
  const go=(next)=>{
    setActive((next+slides.length)%slides.length);
    setRestart(value=>value+1);
  };
  const item=slides[active] || slides[0];
  return (
    <section className={"falowen-carousel falowen-carousel-"+item.kind} aria-label="Explore Falowen learning options">
      <div className="falowen-carousel-stage" aria-roledescription="carousel"
        onMouseEnter={()=>setPaused(true)} onMouseLeave={()=>setPaused(false)}
        onFocusCapture={()=>setPaused(true)}
        onBlurCapture={e=>{if(!e.currentTarget.contains(e.relatedTarget))setPaused(false);}}
        onTouchStart={e=>{touchX.current=e.changedTouches[0]?.clientX ?? null;}}
        onTouchEnd={e=>{
          if(touchX.current==null)return;
          const diff=(e.changedTouches[0]?.clientX ?? touchX.current)-touchX.current;
          touchX.current=null;
          if(Math.abs(diff)>45)go(active+(diff<0?1:-1));
        }}
      >
        <div className="falowen-carousel-content" key={item.kind} aria-roledescription="slide" aria-label={"Slide "+(active+1)+" of "+slides.length}>
          <div className="falowen-carousel-copy">
            <div className="falowen-carousel-kicker">{item.kicker}</div>
            {active===0 ? <h1>{item.title} <span>{item.accent}</span></h1> : <h2>{item.title} <span>{item.accent}</span></h2>}
            <p>{item.desc}</p>
            <div className="falowen-carousel-cta">
              <a className="falowen-carousel-button" href={item.href} onClick={item.kind === "courses" && onSignUp ? (event) => {
                if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
                event.preventDefault();
                onSignUp();
              } : undefined}>{item.action} <span aria-hidden="true">→</span></a>
              {item.support ? <a className="falowen-carousel-secondary" href={item.supportHref || "/classes"}>{item.support} <span aria-hidden="true">→</span></a> : null}
            </div>
            {item.kind === "courses" && <div className="falowen-class-benefits">{(CLASS_COPY[language] || CLASS_COPY.en).benefits.map(text => <span key={text}>✓ {text}</span>)}</div>}
          </div>
          <SlideIllustration kind={item.kind} language={language} art={item.art} />
        </div>
        <div className="falowen-carousel-controls">
          <button type="button" onClick={()=>go(active-1)} aria-label="Previous slide">‹</button>
          <div className="falowen-carousel-dots" role="group" aria-label="Select carousel slide">
            {slides.map((s,index)=><button key={s.kind} type="button" onClick={()=>go(index)} aria-label={"Show slide "+(index+1)} aria-pressed={index===active} className={index===active?"is-active":""}/>)}
          </div>
          <button type="button" onClick={()=>go(active+1)} aria-label="Next slide">›</button>
        </div>
      </div>
    </section>
  );
}
