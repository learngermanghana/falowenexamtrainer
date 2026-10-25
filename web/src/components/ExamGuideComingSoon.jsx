import React, { useEffect } from "react";
import "./BookStoreCheckout.css";

const EXAM_GUIDES = Object.freeze({
  "goethe-a1-writing-model-exams": {
    level: "A1", pages: 30,
    title: "Goethe-Zertifikat A1: Writing Model Exams & Practice Workbook",
    subtitle: "Schreiben · Forms, Emails and Model Answers",
    description: "Six writing practice exams with form-filling, short informal and formal messages, learner worksheets, grammar tips and annotated solutions.",
    highlights: [
      "Six Schreiben model exams (not four-skill full mocks)",
      "Forms, letter structure and language formulas",
      "Writing spaces, sample answers and self-correction tips",
    ],
  },
  "goethe-b1-four-skills-exam-guide": {
    level: "B1", pages: 50,
    title: "Goethe-Zertifikat B1: Four-Skills Exam Preparation Guide",
    subtitle: "Lesen · Hören · Schreiben · Sprechen",
    description: "Independent 50-page B1 exam preparation with reading strategies, listening scripts, writing models, joint-planning speaking practice and worked examples.",
    highlights: [
      "Five-part Lesen strategy and sample task analysis",
      "Listening-script drills and signal-word guidance (audio not included)",
      "Three writing tasks, presentation planning and speaking expressions",
    ],
  },
  "goethe-a2-four-skills-exam-guide": {
    level: "A2", pages: 50,
    title: "Goethe-Zertifikat A2: Four-Skills Exam Preparation Guide",
    subtitle: "Lesen · Hören · Schreiben · Sprechen",
    description: "Exam preparation in reading, listening-script practice, short-message writing and speaking, with strategies, model answers and self-checks.",
    highlights: [
      "Reading comprehension tasks and question strategies",
      "Listening transcript exercises (audio recordings not included)",
      "Writing models, speaking cards and joint planning dialogues",
    ],
  },
});

export default function ExamGuideComingSoon({ slug }) {
  const guide = EXAM_GUIDES[slug];
  useEffect(() => {
    if (!guide) return undefined;
    const previous = document.title;
    document.title = guide.title + " | Falowen Books";
    const meta = document.querySelector('meta[name="description"]');
    const oldDescription = meta?.getAttribute("content");
    if (meta) meta.setAttribute("content", guide.description + " Coming soon from Falowen.");
    const canonical = document.createElement("link");
    canonical.rel = "canonical";
    canonical.href = "https://www.falowen.app/books/" + slug;
    document.head.appendChild(canonical);
    return () => {
      document.title = previous;
      if (meta && oldDescription !== null) meta.setAttribute("content", oldDescription);
      canonical.remove();
    };
  }, [slug, guide]);
  if (!guide) return null;
  return <main className="fb-page">
    <div className="fb-topbar"><div className="fb-shell fb-topbar-inner">
      <a href="/" className="fb-brand" aria-label="Falowen homepage">
        <span className="fb-brand-symbol">F</span><strong>FALOWEN</strong>
        <span className="fb-brand-divider"/><span>BOOKS</span>
      </a>
      <a className="fb-top-back" href="/books">← All Falowen Books</a>
    </div></div>
    <div className="fb-shell" style={{paddingBottom:72}}>
      <nav className="fb-breadcrumb" aria-label="Breadcrumb">
        <a href="/">Falowen</a><span>/</span><a href="/books">Books</a>
        <span>/</span><strong>{guide.level} exam guide</strong>
      </nav>
      <section className="fb-hero" style={{marginTop:25}}>
        <div className="fb-visual-col">
          <div style={{background:"linear-gradient(155deg,#162b52,#2367a4)",color:"white",borderRadius:18,
            padding:"44px 25px",minHeight:410,display:"flex",flexDirection:"column",justifyContent:"space-between",
            boxShadow:"0 15px 44px #142e4c2b"}}>
            <div style={{fontSize:14,letterSpacing:2,fontWeight:700}}>FALOWEN · EXAM PREPARATION</div>
            <div><div style={{fontSize:35,fontWeight:750}}>Deutsch {guide.level}</div>
              <div style={{fontSize:19,lineHeight:1.35,marginTop:12}}>{guide.subtitle}</div>
            </div>
            <div style={{borderTop:"1px solid #ffffff55",paddingTop:14,fontSize:14}}>
              {guide.pages} pages · Independent academy publication</div>
          </div>
        </div>
        <div className="fb-book-intro">
          <p className="fb-eyebrow">FALOWEN EXAM PREPARATION SERIES</p>
          <h1 style={{fontSize:"clamp(30px,4vw,48px)"}}>{guide.title}</h1>
          <p className="fb-lede">{guide.description}</p>
          <div className="fb-book-stats">
            <div><strong>{guide.pages}</strong><small>pages</small></div>
            <div><strong>{guide.level}</strong><small>CEFR level</small></div>
            <div><strong>PDF</strong><small>edition planned</small></div>
          </div>
          <ul className="fb-feature-list">{guide.highlights.map(item => <li key={item}>{item}</li>)}</ul>
          <p className="fb-description">An independent Falowen / Learn Language Education Academy
            learning resource, not an official Goethe-Institut publication or endorsed exam paper.</p>
          <a className="fb-btn fb-btn-soft" href="/books">Explore other books</a>
        </div>
        <aside className="fb-purchase-card" id="fb-purchase">
          <span className="fb-eyebrow">PUBLICATION STATUS</span>
          <h2>Coming soon</h2>
          <p>Digital and printed editions are being prepared. Prices and fulfilment options
            will be announced after editorial review and approval.</p>
          <p><strong>Checkout is not available for this title yet.</strong></p>
          <a className="fb-btn fb-btn-soft" href="/books">Browse available books</a>
        </aside>
      </section>
    </div>
  </main>;
}
