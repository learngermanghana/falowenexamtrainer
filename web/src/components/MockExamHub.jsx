import React from "react";
import { Link } from "react-router-dom";
import AppBackButton from "./navigation/AppBackButton";
import "./MockExamHub.css";

export default function MockExamHub({
  exam,
  backLabel = "Back",
  backPath = "/exams/overview",
}) {
  if (!exam) return null;

  const sectionCards = Array.isArray(exam.sectionCards) ? exam.sectionCards : [];

  return (
    <main className="mock-exam-hub-shell" data-mock-exam-id={exam.id}>
      <div className="mock-exam-hub-topbar">
        <AppBackButton label={backLabel} fallbackPath={backPath} />
        <span>{exam.badge || exam.level}</span>
      </div>

      <header className="mock-exam-hub-hero">
        <p>{exam.kicker || `${exam.level} Mock Exam`}</p>
        <h1>{exam.title}</h1>
        <p>{exam.intro || exam.description}</p>
      </header>

      {exam.notice ? (
        <section className="mock-exam-hub-rules">
          <strong>{exam.status === "preview" ? "Before you start" : "Exam instructions"}</strong>
          <p>
            {exam.status === "preview" ? <strong>This is a preview. </strong> : null}
            {exam.notice}
          </p>
        </section>
      ) : null}

      <section className="mock-exam-hub-grid">
        {sectionCards.map((section) => (
          <article className="mock-exam-hub-card" key={section.key || section.title}>
            <div className="mock-exam-hub-card-head">
              <h2>{section.title}</h2>
              <span>{section.meta}</span>
            </div>
            <p>{section.description}</p>
            <div className="mock-exam-hub-actions">
              {(section.actions || []).map((action) => (
                <Link key={action.to} to={action.to}>{action.label}</Link>
              ))}
            </div>
          </article>
        ))}
      </section>

      <section className="mock-exam-hub-after">
        <h2>After practice</h2>
        <p>
          Continue in the Exams Room for section practice, mock history and future question sets.
        </p>
        <div>
          <Link to="/exams/overview">Open Exams Room</Link>
          {exam.officialPracticeUrl ? (
            <a href={exam.officialPracticeUrl} target="_blank" rel="noreferrer">
              Official Goethe {exam.level} practice
            </a>
          ) : null}
        </div>
      </section>
    </main>
  );
}
