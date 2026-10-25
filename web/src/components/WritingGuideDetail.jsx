import React, { useState } from "react";
import { indicativeUsd } from "./BooksCatalog";
import "./WritingGuideDetail.css";

const ghs = value => "GH₵" + Number(value || 0).toFixed(2);

const PREVIEW = [
  {
    title: "A clear five-step writing method",
    text: "Understand the rule, notice the finite verb and connector, imitate the structure, write independently, then revise for content and clarity.",
  },
  {
    title: "The golden V2 rule",
    text: "In German statements, the conjugated verb is the second constituent—not always the second word. Heute lerne ich Deutsch. In der Akademie lerne ich jeden Tag.",
  },
  {
    title: "When a reason comes first",
    text: "Weil es regnet, bleibe ich zu Hause. The complete introductory subordinate clause occupies the first position; the conjugated verb of the main clause follows.",
  },
];

const CHAPTERS = [
  "Sentence architecture — V2, verb bracket and clause types",
  "Connector toolkit — meaning and word order",
  "A1 — Short notes, emails and simple messages",
  "A2 — Everyday correspondence, Perfekt and reasons",
  "B1 — Requests, complaints and organised opinions",
  "B2 — Balanced arguments and formal writing",
  "C1 — Professional and academic precision",
  "C2 — Register, rhetoric and advanced editing",
  "Editing checklist, practice solutions and answer key",
];

export default function WritingGuideDetail({ book, fxQuote, onAddToCart, onBuyNow, enabled, added }) {
  const [tab, setTab] = useState("sample");
  const usd = indicativeUsd(book?.priceGhs, fxQuote);
  return <section className="fb-wg" aria-label="How to Unlock Your German Writing Skills">
    <div className="fb-wg-header">
      <div className="fb-wg-cover-wrap">
        <img src="/books/writing-skills-a1-c2-cover.svg" className="fb-wg-cover"
          alt="How to Unlock Your German Writing Skills, Falowen 2026 edition cover" />
        <p>Falowen Books · Original independent study handbook</p>
      </div>
      <div className="fb-wg-intro">
        <p className="fb-eyebrow">FALOWEN WRITING COLLECTION · 2026 EDITION</p>
        <h2>How to Unlock Your German Writing Skills <span>(A1–C2)</span></h2>
        <p className="fb-wg-lede">From your first German email to more precise academic and professional writing.</p>
        <p>Learn German sentence structure, practical connectors, model writing formats and a reliable editing method. Designed as a standalone writing guide—not a replacement for a full language course.</p>
        <div className="fb-wg-facts">
          <div><strong>32</strong><small>pages</small></div>
          <div><strong>6</strong><small>CEFR levels</small></div>
          <div><strong>PDF</strong><small>digital edition</small></div>
        </div>
        <ul className="fb-wg-benefits">
          <li>Clear explanations in English with original German examples</li>
          <li>Writing models from A1 to C2, with guided practice</li>
          <li>Exercises, checklists and model answers</li>
          <li>Works for self-study, including learners outside Falowen</li>
        </ul>
        <button type="button" className="fb-btn fb-btn-soft"
          onClick={() => { setTab("sample"); document.getElementById("fb-wg-preview")?.scrollIntoView({ behavior: "smooth", block: "start" }); }}>
          Read a free preview
        </button>
      </div>
      <aside className="fb-wg-checkout" id="fb-writing-purchase">
        <p className="fb-eyebrow">DIGITAL EDITION</p><h3>Your writing guide</h3>
        <p className="fb-wg-format">A1–C2 · 32-page PDF</p>
        <div className="fb-wg-price"><strong>{ghs(book?.priceGhs)}</strong>
          {usd && <small>{usd} · indicative only</small>}</div>
        <p className="fb-wg-fxnote">Checkout is in Ghana cedis. USD is only for international price comparison.</p>
        <div style={{ display: "grid", gap: 10, marginTop: 18 }}>
          <button type="button" className="fb-btn fb-btn-primary fb-pay"
            onClick={() => onAddToCart(book, 1)} disabled={!book || !enabled}>
            {!enabled ? "Checkout temporarily unavailable" : "Add digital guide to cart"}
          </button>
          <button type="button" className="fb-btn fb-btn-soft" onClick={() => onBuyNow(book, 1)}
            disabled={!book || !enabled}>Buy now · {ghs(book?.priceGhs)}</button>
          {added && <p className="fb-add-feedback" role="status">{added}</p>}
        </div>
        <p className="fb-wg-delivery">Payment is verified through Paystack. Your PDF is arranged manually after confirmation; there is no immediate automatic download. Keep your receipt.</p>
      </aside>
    </div>

    <div className="fb-wg-tabs" id="fb-wg-preview">
      <div className="fb-wg-tabbar" role="tablist" aria-label="Writing guide details">
        {[["sample", "Free preview"], ["contents", "What's inside"], ["faq", "Questions"]].map(([id, label]) =>
          <button key={id} type="button" role="tab" aria-selected={tab === id}
            className={tab === id ? "active" : ""} onClick={() => setTab(id)}>{label}</button>)}
      </div>
      {tab === "sample" && <div className="fb-wg-content">
        <p className="fb-eyebrow">SELECTED EXCERPTS · READ BEFORE YOU BUY</p>
        <h3>Build a dependable German writing method</h3>
        <p>This preview uses short excerpts from the writing handbook; it is not the complete paid book or its answer key.</p>
        <div className="fb-wg-preview-grid">{PREVIEW.map(item => <article key={item.title}>
          <h4>{item.title}</h4><p>{item.text}</p>
        </article>)}</div>
        <p className="fb-wg-small">The handbook is an independent Falowen publication, not an official Goethe, telc or TestDaF examination paper. Exam formats and requirements can differ.</p>
      </div>}
      {tab === "contents" && <div className="fb-wg-content">
        <h3>Inside the 32-page handbook</h3>
        <ol className="fb-wg-toc">{CHAPTERS.map(chapter => <li key={chapter}>{chapter}</li>)}</ol>
      </div>}
      {tab === "faq" && <div className="fb-wg-content">
        <h3>Questions before purchase</h3>
        <p><strong>Do I need to be a Falowen student?</strong> No. Anyone can purchase the guide.</p>
        <p><strong>Does this include online classes or AI marking?</strong> No. This is a standalone downloadable PDF, supplied manually after verified payment.</p>
        <p><strong>Do I pay in dollars?</strong> No. Your Paystack transaction is in GHS; USD amounts are estimates only.</p>
      </div>}
    </div>
  </section>;
}