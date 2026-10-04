import React from "react";
import { Link } from "react-router-dom";
import AppBackButton from "./navigation/AppBackButton";
import "./A2FinalMockExamPage.css";

const SECTION_CARDS = [
  {
    title: "Lesen",
    meta: "30 min",
    description: "Complete Teil 1–4 in the A2 reading mock.",
    actions: [{ label: "Start Lesen", to: "/campus/course/a2-mock-lesen-preview" }],
  },
  {
    title: "Hören",
    meta: "30 min",
    description: "Complete all four listening parts in order.",
    actions: [
      { label: "Teil 1", to: "/campus/course/a2-mock-hoeren-teil-1-preview" },
      { label: "Teil 2", to: "/campus/course/a2-mock-hoeren-teil-2-preview" },
      { label: "Teil 3", to: "/campus/course/a2-mock-hoeren-teil-3-preview" },
      { label: "Teil 4", to: "/campus/course/a2-mock-hoeren-teil-4-preview" },
    ],
  },
  {
    title: "Schreiben",
    meta: "30 min",
    description: "Complete the SMS task and the formal email task.",
    actions: [{ label: "Start Schreiben", to: "/campus/course/a2-mock-schreiben-preview" }],
  },
  {
    title: "Sprechen",
    meta: "ca. 15 min",
    description: "Complete all three speaking parts. Record your answers in German.",
    actions: [
      { label: "Teil 1", to: "/campus/course/a2-mock-sprechen-teil-1-preview" },
      { label: "Teil 2", to: "/campus/course/a2-mock-sprechen-teil-2-preview" },
      { label: "Teil 3", to: "/campus/course/a2-mock-sprechen-teil-3-preview" },
    ],
  },
];

export default function A2FinalMockExamPage() {
  return (
    <main className="a2-final-mock-shell">
      <div className="a2-final-mock-topbar">
        <AppBackButton label="Back to Course Book" fallbackPath="/campus/course" />
        <span>A2 · Day 29</span>
      </div>

      <header className="a2-final-mock-hero">
        <p>A2 Mock Practice · Preview</p>
        <h1>A2 exam-format practice</h1>
        <p>
          Work through Lesen, Hören, Schreiben and Sprechen under exam-style conditions.
          This mock is practice and does not increase the 28 required course assignments.
        </p>
      </header>

      <section className="a2-final-mock-rules">
        <strong>Before you start</strong>
        <p>Use each section as focused exam practice. Do not rely on this preview as a completed final mock until Falowen adds persistent answers, scoring and one unified result.</p>
      </section>

      <section className="a2-final-mock-grid">
        {SECTION_CARDS.map((section) => (
          <article className="a2-final-mock-card" key={section.title}>
            <div className="a2-final-mock-card-head">
              <h2>{section.title}</h2>
              <span>{section.meta}</span>
            </div>
            <p>{section.description}</p>
            <div className="a2-final-mock-actions">
              {section.actions.map((action) => (
                <Link key={action.to} to={action.to}>{action.label}</Link>
              ))}
            </div>
          </article>
        ))}
      </section>

      <section className="a2-final-mock-after">
        <h2>After practice</h2>
        <p>
          Continue practising in the Exams Room. You can also compare the format with the official Goethe A2 practice material.
        </p>
        <div>
          <Link to="/exams/question">Practice more in Exams Room</Link>
          <a href="https://www.goethe.de/ins/gh/en/spr/prf/gzsd2/ueb.html" target="_blank" rel="noreferrer">
            Official Goethe A2 practice
          </a>
        </div>
      </section>
    </main>
  );
}
