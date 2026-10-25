import React, { useEffect, useRef, useState } from "react";
import { getBackendUrl } from "../services/backendUrl";
import "./HomepageBooksCarousel.css";

const SLIDES = Object.freeze([
  Object.freeze({
    id: "a1-course-workbook",
    title: "Deutsch A1",
    subtitle: "Course & Workbook",
    summary: "Learn step by step with beginner grammar, vocabulary and guided workbook practice.",
    cover: "/books/a1-cover.svg",
    label: "A1 coursebook",
    href: "/books",
  }),
  Object.freeze({
    id: "writing-skills-a1-c2",
    title: "German Writing Skills",
    subtitle: "A1–C2 Writing Guide",
    summary: "Build better sentences, letters and essays with practical examples and exercises.",
    cover: "/books/writing-skills-a1-c2-cover.svg",
    label: "German writing handbook",
    href: "/books",
  }),
  Object.freeze({
    id: "a1-writing-model-exams",
    title: "A1 Writing Model Exams",
    subtitle: "Forms, emails & model answers",
    summary: "Six writing practice exams with guided tasks and annotated answers.",
    level: "A1", kind: "writing", label: "A1 exam guide",
    href: "/books/goethe-a1-writing-model-exams",
  }),
  Object.freeze({
    id: "a2-four-skills-exam-guide",
    title: "A2 Exam Preparation",
    subtitle: "Lesen · Hören · Schreiben · Sprechen",
    summary: "Four-skills practice with listening scripts, writing guidance and speaking tasks.",
    level: "A2", kind: "four-skills", label: "A2 exam guide",
    href: "/books/goethe-a2-four-skills-exam-guide",
  }),
  Object.freeze({
    id: "b1-four-skills-exam-guide",
    title: "B1 Exam Preparation",
    subtitle: "Four-Skills Preparation Guide",
    summary: "Reading strategies, listening scripts, writing models and speaking practice.",
    level: "B1", kind: "four-skills", label: "B1 exam guide",
    href: "/books/goethe-b1-four-skills-exam-guide",
  }),
]);

function Cover({ slide }) {
  if (slide.cover) {
    return <img className="home-books-cover-image" src={slide.cover}
      alt={slide.title + " book cover"} loading="lazy" />;
  }
  return (
    <div className={"home-books-illustrated-cover home-books-cover-" + slide.level.toLowerCase()}
      aria-label={slide.title + " illustrated book cover"} role="img">
      <div className="home-books-cover-brand">FALOWEN · BOOKS</div>
      <div className="home-books-cover-rule" />
      <div className="home-books-cover-level">{slide.level}</div>
      <div className="home-books-cover-title">Goethe-style<br />exam preparation</div>
      <div className="home-books-cover-tag">{slide.kind === "writing" ? "WRITING MODEL EXAMS" : "FOUR-SKILLS GUIDE"}</div>
      <div className="home-books-cover-footer">Learn Language Education Academy</div>
    </div>
  );
}

export default function HomepageBooksCarousel() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [offers, setOffers] = useState([]);
  const [titles, setTitles] = useState([]);
  const touchStart = useRef(null);

  useEffect(() => {
    let cancelled = false;
    const abort = new AbortController();
    fetch(getBackendUrl() + "/books/catalog", { signal: abort.signal })
      .then(response => response.ok ? response.json() : Promise.reject(new Error("catalog unavailable")))
      .then(data => {
        if (!cancelled) {
          setOffers(Array.isArray(data.books) ? data.books : []);
          setTitles(Array.isArray(data.catalogTitles) ? data.catalogTitles : []);
        }
      })
      .catch(() => {}); // All book details still have working links if the catalogue is offline.
    return () => { cancelled = true; abort.abort(); };
  }, []);

  useEffect(() => {
    if (paused || (typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches)) return undefined;
    const timer = window.setInterval(() => {
      if (!document.hidden) setActive(current => (current + 1) % SLIDES.length);
    }, 6500);
    return () => window.clearInterval(timer);
  }, [paused]);

  const change = next => setActive((next + SLIDES.length) % SLIDES.length);
  const slide = SLIDES[active];
  const liveTitle = titles.find(book => book.id === slide.id);
  const purchasable = liveTitle?.status === "available" &&
    liveTitle.bookIds?.some(id => offers.some(offer => offer.id === id));
  const primaryLabel = purchasable ? "View book editions" : "View book details";

  return (
    <section className="home-books-carousel" aria-label="Explore Falowen German books">
      <div className="home-books-heading">
        <div>
          <span className="home-books-eyebrow">THE FALOWEN BOOK LIBRARY</span>
          <h3>Keep learning with German books</h3>
        </div>
        <a href="/books" className="home-books-all-link">Browse all books <span aria-hidden="true">→</span></a>
      </div>
      <div className="home-books-stage" onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocusCapture={() => setPaused(true)}
        onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget)) setPaused(false); }}
        onTouchStart={event => { touchStart.current = event.changedTouches[0]?.clientX ?? null; }}
        onTouchEnd={event => {
          if (touchStart.current == null) return;
          const moved = (event.changedTouches[0]?.clientX ?? touchStart.current) - touchStart.current;
          touchStart.current = null;
          if (Math.abs(moved) > 45) change(active + (moved < 0 ? 1 : -1));
        }}>
        <div className="home-books-cover-frame"><Cover slide={slide} /></div>
        <div className="home-books-copy">
          <span className="home-books-slide-label">{slide.label}</span>
          <h4>{slide.title}</h4>
          <p className="home-books-subtitle">{slide.subtitle}</p>
          <p className="home-books-summary">{slide.summary}</p>
          <a className="home-books-primary" href={slide.href}>{primaryLabel} <span aria-hidden="true">→</span></a>
          <span className="home-books-counter">{active + 1} / {SLIDES.length} books</span>
        </div>
      </div>
      <div className="home-books-controls" role="group" aria-label="Choose featured book">
        <button type="button" className="home-books-arrow" onClick={() => change(active - 1)}
          aria-label="Previous book">‹</button>
        <div className="home-books-dots">
          {SLIDES.map((book, index) => (
            <button key={book.id} type="button" className={active === index ? "is-current" : ""}
              onClick={() => change(index)} aria-label={"Show " + book.title}
              aria-pressed={active === index} />
          ))}
        </div>
        <button type="button" className="home-books-arrow" onClick={() => change(active + 1)}
          aria-label="Next book">›</button>
      </div>
    </section>
  );
}
