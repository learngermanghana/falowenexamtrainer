import React, { useEffect, useMemo, useState } from "react";
import { getBackendUrl } from "../services/backendUrl";
import { indicativeUsd } from "./BooksCatalog";
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

const PRODUCT_IDS = Object.freeze({
  "goethe-a1-writing-model-exams": "a1-writing-model-exams",
  "goethe-a2-four-skills-exam-guide": "a2-four-skills-exam-guide",
  "goethe-b1-four-skills-exam-guide": "b1-four-skills-exam-guide",
});
const money = value => "GH₵" + Number(value).toFixed(2);
const API = getBackendUrl();

export default function ExamGuideComingSoon({ slug }) {
  const guide = EXAM_GUIDES[slug];
  const productId = PRODUCT_IDS[slug];
  const [catalog, setCatalog] = useState(null);
  const [fxQuote, setFxQuote] = useState(null);
  const [edition, setEdition] = useState("digital");
  const [buyer, setBuyer] = useState({name:"",email:"",phone:""});
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!guide) return undefined;
    const previous = document.title;
    document.title = guide.title + " | Falowen Books";
    const meta = document.querySelector('meta[name="description"]');
    const oldDescription = meta?.getAttribute("content");
    if (meta) meta.setAttribute("content", guide.description + " Digital and printed editions at Falowen.");
    // The SPA HTML already contains a homepage canonical. Reuse it rather
    // than appending a conflicting second canonical for the book detail route.
    const existingCanonical = document.head.querySelector('link[rel="canonical"]');
    const canonical = existingCanonical || document.createElement("link");
    const previousCanonicalHref = existingCanonical?.getAttribute("href");
    if (!existingCanonical) {
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = "https://www.falowen.app/books/" + slug;
    return () => {
      document.title = previous;
      if (meta && oldDescription !== null) meta.setAttribute("content", oldDescription);
      if (existingCanonical) {
        if (previousCanonicalHref === null) canonical.removeAttribute("href");
        else canonical.setAttribute("href", previousCanonicalHref);
      } else {
        canonical.remove();
      }
    };
  }, [slug, guide]);

  useEffect(() => {
    let active = true;
    const controller = new AbortController();
    fetch(API + "/books/catalog", {signal:controller.signal})
      .then(async response => {
        if (!response.ok) throw Error("The book catalogue is temporarily unavailable.");
        return response.json();
      })
      .then(payload => { if (active) setCatalog(payload); })
      .catch(() => { if (active) setCatalog({books:[],catalogTitles:[],paymentsEnabled:false}); });
    fetch(API + "/fx/usd-ghs", {signal:controller.signal})
      .then(response => response.ok ? response.json() : null)
      .then(data => {
        if (active && Number(data?.usdToGhs)>0) setFxQuote({usdToGhs:Number(data.usdToGhs)});
      }).catch(() => {});
    return () => { active=false; controller.abort(); };
  }, []);

  const listing = useMemo(() => catalog?.catalogTitles?.find(item => item.id === productId), [catalog, productId]);
  const editions = useMemo(() => (listing?.bookIds || [])
    .map(id => catalog?.books?.find(item => item.id===id))
    .filter(Boolean), [catalog,listing]);
  const offer = editions.find(item => item.format===edition) || editions[0];
  const available = listing?.status === "available" && Boolean(offer);
  const checkoutAvailable = available && catalog?.paymentsEnabled === true;

  const buy = async event => {
    event.preventDefault();
    if (!checkoutAvailable || !offer) return;
    setBusy(true); setError("");
    try {
      const response = await fetch(API + "/books/checkout",{
        method:"POST", headers:{"Content-Type":"application/json"},
        body:JSON.stringify({bookId:offer.id,...buyer}),
      });
      const data = await response.json().catch(()=>({}));
      if (!response.ok) throw Error(data.error || "Unable to start secure payment.");
      const url = new URL(data.authorization_url);
      if(url.protocol!=="https:" || !["checkout.paystack.com","paystack.com"].includes(url.hostname))
        throw Error("Unexpected payment destination.");
      window.location.assign(url.toString());
    } catch(e) { setError(e.message); setBusy(false); }
  };

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
            <div><strong>PDF</strong><small>digital edition</small></div>
          </div>
          <ul className="fb-feature-list">{guide.highlights.map(item => <li key={item}>{item}</li>)}</ul>
          <p className="fb-description">An independent Falowen / Learn Language Education Academy
            learning resource, not an official Goethe-Institut publication or endorsed exam paper.
            {guide.level !== "A1" ? " Hören exercises use scripts; audio recordings are not included." : ""}</p>
          <a className="fb-btn fb-btn-soft" href="/books">Explore other books</a>
        </div>
        <aside className="fb-purchase-card" id="fb-purchase">
          <span className="fb-eyebrow">CHOOSE YOUR EDITION</span>
          <h2>{available ? "Get your " + guide.level + " guide" : "Check book availability"}</h2>
          {available ? <>
            <div className="fb-guide-editions" role="radiogroup" aria-label="Choose book format">
              {editions.map(item=><label key={item.id} className="fb-guide-option">
                <input type="radio" name="edition" value={item.format}
                  checked={offer?.id===item.id} onChange={()=>setEdition(item.format)} />
                <span>{item.format==="digital"?"Digital PDF":"Printed on demand"}</span>
                <strong>{money(item.priceGhs)}</strong>
                {indicativeUsd(item.priceGhs,fxQuote) ? <small>{indicativeUsd(item.priceGhs,fxQuote)} · estimate</small>:null}
              </label>)}
            </div>
            <p style={{fontSize:12,color:"#587089"}}>
              {offer?.format==="printed"
                ? "Printing starts after verified payment. Collection or delivery is arranged separately; delivery is not included."
                : "After verified Paystack payment, your PDF is provided by a secure download when available, or arranged by Falowen."}
            </p>
            <form onSubmit={buy} className="fb-guide-checkout-form">
              <label>Full name<input aria-label="Full name" required minLength={3} maxLength={120}
                autoComplete="name" value={buyer.name} onChange={e=>setBuyer({...buyer,name:e.target.value})} /></label>
              <label>Email<input aria-label="Email" type="email" required autoComplete="email"
                value={buyer.email} onChange={e=>setBuyer({...buyer,email:e.target.value})} /></label>
              <label>Phone number<input aria-label="Phone number" type="tel" required
                autoComplete="tel" value={buyer.phone} onChange={e=>setBuyer({...buyer,phone:e.target.value})} /></label>
              {error ? <p role="alert" className="fb-error">{error}</p>:null}
              <button type="submit" className="fb-btn fb-btn-primary" disabled={!checkoutAvailable||busy}>
                {busy?"Opening Paystack…":checkoutAvailable?"Continue to Paystack · "+money(offer.priceGhs):"Checkout temporarily unavailable"}
              </button>
            </form>
            <p style={{fontSize:12,color:"#64748b"}}>Paystack charges in Ghana cedis (GHS). USD prices are indicative only. Keep your verified receipt.</p>
          </> : <p>{catalog===null
            ? "Checking available editions and secure payment…"
            : "Secure checkout is currently unavailable for this title. Please check the bookstore."}</p>}
          <a className="fb-btn fb-btn-soft" href="/books">Browse all books</a>
        </aside>
      </section>
    </div>
  </main>;
}
