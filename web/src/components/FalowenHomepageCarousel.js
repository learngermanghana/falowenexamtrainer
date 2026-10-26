import React, { useEffect, useRef, useState } from "react";
import "./FalowenHomepageCarousel.css";
import { loadPublicClasses } from "../services/publicClassCatalogService";

const WORDING = {
  en: [
    { kicker:"UPCOMING GERMAN CLASSES",title:"Your next chapter",accent:"starts with German.",desc:"Find your next class and take the first step. Learn live with a tutor, practise with AI, and keep building your confidence between lessons.",action:"View upcoming classes",support:"Find my level",href:"/classes",kind:"courses" },
    { kicker:"FREE PLACEMENT TEST",title:"Find your",accent:"German level.",desc:"New to German, or unsure where to begin? Take a free A1–B1 placement test to discover your starting point.",action:"Take free placement test",href:"/placement-test",kind:"placement" },
    { kicker:"GOETHE-STYLE EXAM PRACTICE",title:"Prepare for",accent:"your German exam.",desc:"Practise sample tests and full mocks in Lesen, Hören, Schreiben and Sprechen, with AI-supported feedback.",action:"Explore exam practice",href:"/exam-practice",kind:"exams" },
    { kicker:"FALOWEN BOOKSTORE",title:"Learn more with",accent:"German books.",desc:"Explore Falowen German workbooks. Choose an available digital edition or order a printed book.",action:"Browse German books",href:"/books",kind:"books" },
  ],
  de: [
    { kicker:"KOMMENDE DEUTSCHKURSE",title:"Dein nächstes Kapitel",accent:"beginnt mit Deutsch.",desc:"Lerne online von überall mit Live-Unterricht, Lehrkräften, Aufzeichnungen, Arbeitsbüchern und KI-Übungen.",action:"Kommende Kurse ansehen",support:"Mein Niveau finden",href:"/classes",kind:"courses" },
    { kicker:"KOSTENLOSER EINSTUFUNGSTEST",title:"Finde dein",accent:"Deutschniveau.",desc:"Du weißt nicht, wo du anfangen sollst? Mit dem kostenlosen A1–B1-Test findest du deinen Einstieg.",action:"Einstufungstest starten",href:"/placement-test",kind:"placement" },
    { kicker:"GOETHE-ORIENTIERTE PRÜFUNGSÜBUNGEN",title:"Bereite dich auf",accent:"deine Prüfung vor.",desc:"Übe Lesen, Hören, Schreiben und Sprechen mit Beispieltests, Probeprüfungen und KI-Feedback.",action:"Prüfungsübungen ansehen",href:"/exam-practice",kind:"exams" },
    { kicker:"FALOWEN BÜCHER",title:"Deutsch lernen",accent:"mit Arbeitsbüchern.",desc:"Entdecke Falowen Arbeitsbücher als verfügbare digitale oder gedruckte Ausgabe.",action:"Bücher ansehen",href:"/books",kind:"books" },
  ],
  fr: [
    { kicker:"PROCHAINS COURS D'ALLEMAND",title:"Votre prochain chapitre",accent:"commence en allemand.",desc:"Suivez des cours en ligne depuis n'importe où, avec enseignants, vidéos, cahiers et exercices IA.",action:"Voir les prochains cours",support:"Trouver mon niveau",href:"/classes",kind:"courses" },
    { kicker:"TEST DE NIVEAU GRATUIT",title:"Découvrez votre",accent:"niveau d'allemand.",desc:"Vous hésitez sur votre niveau? Faites notre test gratuit A1–B1 et trouvez où commencer.",action:"Faire le test gratuit",href:"/placement-test",kind:"placement" },
    { kicker:"PRÉPARATION AUX EXAMENS TYPE GOETHE",title:"Préparez votre",accent:"examen d'allemand.",desc:"Entraînez-vous en lecture, écoute, expression écrite et orale avec des examens blancs et des retours IA.",action:"Explorer les examens",href:"/exam-practice",kind:"exams" },
    { kicker:"LIVRES FALOWEN",title:"Progressez avec",accent:"nos livres d'allemand.",desc:"Découvrez les cahiers Falowen disponibles en version numérique ou imprimée.",action:"Voir les livres",href:"/books",kind:"books" },
  ],
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

function SlideIllustration({kind,language}) {
  if (kind === "courses") return <UpcomingClassCard language={language} />;
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
    const handle=window.setInterval(()=>{if(!document.hidden)setActive(value=>(value+1)%slides.length);},6000);
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
              <a className="falowen-carousel-button" href={item.href}>{item.action} <span aria-hidden="true">→</span></a>
              {item.support ? <a className="falowen-carousel-secondary" href="/placement-test">{item.support} →</a> : null}
            </div>
            {item.kind === "courses" && <div className="falowen-class-benefits">{(CLASS_COPY[language] || CLASS_COPY.en).benefits.map(text => <span key={text}>✓ {text}</span>)}</div>}
          </div>
          <SlideIllustration kind={item.kind} language={language} />
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
