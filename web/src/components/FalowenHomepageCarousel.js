import React, { useEffect, useRef, useState } from "react";
import "./FalowenHomepageCarousel.css";

const WORDING = {
  en: [
    { kicker:"GERMAN LANGUAGE COURSES",title:"Learn German.",accent:"Build your future.",desc:"Join live German classes online from anywhere. Learn with tutors, recorded lessons, structured workbooks and AI practice.",action:"Register for German",support:"View upcoming classes",href:"/classes",kind:"courses" },
    { kicker:"FREE PLACEMENT TEST",title:"Find your",accent:"German level.",desc:"New to German, or unsure where to begin? Take a free A1–B1 placement test to discover your starting point.",action:"Take free placement test",href:"/placement-test",kind:"placement" },
    { kicker:"GOETHE-STYLE EXAM PRACTICE",title:"Prepare for",accent:"your German exam.",desc:"Practise sample tests and full mocks in Lesen, Hören, Schreiben and Sprechen, with AI-supported feedback.",action:"Explore exam practice",href:"/exam-practice",kind:"exams" },
    { kicker:"FALOWEN BOOKSTORE",title:"Learn more with",accent:"German books.",desc:"Explore Falowen German workbooks. Choose an available digital edition or order a printed book.",action:"Browse German books",href:"/books",kind:"books" },
  ],
  de: [
    { kicker:"DEUTSCHKURSE",title:"Deutsch lernen.",accent:"Zukunft gestalten.",desc:"Lerne online von überall mit Live-Unterricht, Lehrkräften, Aufzeichnungen, Arbeitsbüchern und KI-Übungen.",action:"Für Deutsch registrieren",support:"Kurse ansehen",href:"/classes",kind:"courses" },
    { kicker:"KOSTENLOSER EINSTUFUNGSTEST",title:"Finde dein",accent:"Deutschniveau.",desc:"Du weißt nicht, wo du anfangen sollst? Mit dem kostenlosen A1–B1-Test findest du deinen Einstieg.",action:"Einstufungstest starten",href:"/placement-test",kind:"placement" },
    { kicker:"GOETHE-ORIENTIERTE PRÜFUNGSÜBUNGEN",title:"Bereite dich auf",accent:"deine Prüfung vor.",desc:"Übe Lesen, Hören, Schreiben und Sprechen mit Beispieltests, Probeprüfungen und KI-Feedback.",action:"Prüfungsübungen ansehen",href:"/exam-practice",kind:"exams" },
    { kicker:"FALOWEN BÜCHER",title:"Deutsch lernen",accent:"mit Arbeitsbüchern.",desc:"Entdecke Falowen Arbeitsbücher als verfügbare digitale oder gedruckte Ausgabe.",action:"Bücher ansehen",href:"/books",kind:"books" },
  ],
  fr: [
    { kicker:"COURS D'ALLEMAND",title:"Apprenez l'allemand.",accent:"Préparez votre avenir.",desc:"Suivez des cours en ligne depuis n'importe où, avec enseignants, vidéos, cahiers et exercices IA.",action:"S'inscrire au cours",support:"Voir les cours",href:"/classes",kind:"courses" },
    { kicker:"TEST DE NIVEAU GRATUIT",title:"Découvrez votre",accent:"niveau d'allemand.",desc:"Vous hésitez sur votre niveau? Faites notre test gratuit A1–B1 et trouvez où commencer.",action:"Faire le test gratuit",href:"/placement-test",kind:"placement" },
    { kicker:"PRÉPARATION AUX EXAMENS TYPE GOETHE",title:"Préparez votre",accent:"examen d'allemand.",desc:"Entraînez-vous en lecture, écoute, expression écrite et orale avec des examens blancs et des retours IA.",action:"Explorer les examens",href:"/exam-practice",kind:"exams" },
    { kicker:"LIVRES FALOWEN",title:"Progressez avec",accent:"nos livres d'allemand.",desc:"Découvrez les cahiers Falowen disponibles en version numérique ou imprimée.",action:"Voir les livres",href:"/books",kind:"books" },
  ],
};

function SlideIllustration({kind,classroomImage}) {
  if (kind==="courses") return (
    <div className="falowen-slide-photo">
      <img src={classroomImage} alt="A real German class at Learn Language Education Academy" width="600" height="480" loading="eager" />
      <span>Based in Ghana · Online classes open worldwide</span>
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
              {item.kind==="courses" ? <button type="button" className="falowen-carousel-button" onClick={onSignUp}>{item.action} <span aria-hidden="true">→</span></button> :
                <a className="falowen-carousel-button" href={item.href}>{item.action} <span aria-hidden="true">→</span></a>}
              {item.support ? <a className="falowen-carousel-secondary" href={item.href}>{item.support} →</a> : null}
            </div>
          </div>
          <SlideIllustration kind={item.kind} classroomImage={classroomImage} />
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
