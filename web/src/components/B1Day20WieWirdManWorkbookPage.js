import React, { useState } from "react";
import AppBackButton from "./navigation/AppBackButton";
import AssignmentSubmissionPage from "./AssignmentSubmissionPage";
import CourseInlinePracticePanel from "./CourseInlinePracticePanel";
import WorkbookReferenceAnswers from "./WorkbookReferenceAnswers";
import RadioFirstWorkbookGate from "./RadioFirstWorkbookGate";
import { A2B1WorkbookGuidance, WorkbookSubmissionReminder } from "./A2B1WorkbookGuidance";
import { styles } from "../styles";

const TABS = [
  { key: "sprechen", label: "Teil 1" },
  { key: "schreiben", label: "Teil 2" },
  { key: "lesen", label: "Teil 3" },
  { key: "hoeren", label: "Teil 4" },
  { key: "references", label: "Ref" },
  { key: "submit", label: "Submit" },
];

const card = {
  ...styles.card,
  display: "grid",
  gap: 14,
};

const box = {
  border: "1px solid #e5e7eb",
  borderRadius: 12,
  padding: 14,
  background: "#fff",
  display: "grid",
  gap: 8,
  lineHeight: 1.7,
};

const blueBox = {
  ...box,
  borderColor: "#93c5fd",
  background: "#eff6ff",
};

const listStyle = {
  margin: 0,
  paddingLeft: 22,
  lineHeight: 1.75,
};

const imageStyle = {
  width: "100%",
  maxHeight: 300,
  objectFit: "cover",
  borderRadius: 14,
};

const videoStyle = {
  width: "100%",
  minHeight: 315,
  border: 0,
  borderRadius: 12,
};

const TabBar = ({ activeTab, onChange }) => (
  <div
    data-b1-day20-tabs
    style={{
      position: "sticky",
      top: 92,
      zIndex: 100,
      display: "grid",
      gap: 8,
      padding: 10,
      border: "2px solid #2563eb",
      borderRadius: 16,
      background: "rgba(255,255,255,0.98)",
      boxShadow: "0 10px 26px rgba(15,23,42,0.14)",
    }}
  >
    <div
      role="tablist"
      aria-label="B1 Day 20 workbook sections"
      style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 2 }}
    >
      {TABS.map((tab) => {
        const active = tab.key === activeTab;
        return (
          <button
            key={tab.key}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(tab.key)}
            style={{
              ...styles.secondaryButton,
              flex: "0 0 auto",
              minWidth: 76,
              border: active ? "2px solid #1d4ed8" : "1px solid #cbd5e1",
              background: active ? "#2563eb" : "#fff",
              color: active ? "#fff" : "#1d4ed8",
              fontWeight: 800,
            }}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
    <strong style={{ color: "#334155", fontSize: 13 }}>
      Select Teil 1, Teil 2, Teil 3, Teil 4, Ref or Submit.
    </strong>
  </div>
);

const Prepared = ({ checked, onChange }) => (
  <label style={{ display: "inline-flex", alignItems: "center", gap: 8, fontWeight: 700 }}>
    <input type="checkbox" checked={checked} onChange={onChange} />
    I prepared this part.
  </label>
);

const QuestionList = ({ questions }) => (
  <div style={{ display: "grid", gap: 10 }}>
    {questions.map((question, index) => (
      <div key={question.stem} style={box}>
        <strong>{index + 1}. {question.stem}</strong>
        {question.options.map((option) => <span key={option}>{option}</span>)}
      </div>
    ))}
  </div>
);

const readingQuestions = [
  { stem: "Erst durch den Anruf bemerkte Susanne das Fehlen ihrer Brieftasche.", options: ["A) Richtig", "B) Falsch"] },
  { stem: "Susanne glaubte, die Brieftasche beim Bezahlen vergessen zu haben.", options: ["A) Richtig", "B) Falsch"] },
  { stem: "Der Finder hatte die Brieftasche ins Fundbüro gebracht.", options: ["A) Richtig", "B) Falsch"] },
  { stem: "Die Telefonnummer der Bank war in der Brieftasche.", options: ["A) Richtig", "B) Falsch"] },
  { stem: "In Susannes Brieftasche fehlte nichts.", options: ["A) Richtig", "B) Falsch"] },
  { stem: "Susanne konnte dem Finder persönlich für seine Ehrlichkeit danken.", options: ["A) Richtig", "B) Falsch"] },
];

function B1Day20WorkbookContent() {
  const [activeTab, setActiveTab] = useState("sprechen");
  const [prepared, setPrepared] = useState({
    sprechen: false,
    schreiben: false,
    lesen: false,
    hoeren: false,
  });

  const changeTab = (tabKey) => {
    setActiveTab(tabKey);
    if (typeof window !== "undefined") {
      window.requestAnimationFrame(() => {
        const nav = document.querySelector("[data-b1-day20-tabs]");
        nav?.scrollIntoView({ block: "start", behavior: "smooth" });
      });
    }
  };

  const markPrepared = (key) => (event) =>
    setPrepared((previous) => ({ ...previous, [key]: event.target.checked }));

  return (
    <div style={{ ...styles.container, display: "grid", gap: 16 }}>
      <header style={card}>
        <AppBackButton label="Back to Course Book" fallbackPath="/campus/course" />
        <span style={{ ...styles.badge, width: "fit-content" }}>B1 · Day 20 · Kapitel 6.20</span>
        <h1 style={{ ...styles.title, margin: 0 }}>B1 Workbook · Wie wird man …?</h1>
        <p style={{ ...styles.subtitle, margin: 0 }}>
          Learn how to describe education, qualifications and career paths. Teil 1 is group practice, Teil 4 is self-check, and only Schreiben and Lesen are submitted.
        </p>
      </header>

      <TabBar activeTab={activeTab} onChange={changeTab} />

      <section style={card}>
        <img
          src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1600&q=80"
          alt="Learners discussing education, qualifications and careers"
          loading="lazy"
          style={imageStyle}
        />
      </section>

      <A2B1WorkbookGuidance level="B1" />

      {activeTab === "sprechen" && (
        <section style={card}>
          <h2 style={{ margin: 0 }}>Teil 1 · Sprechen (Group Practice)</h2>
          <div style={blueBox}>
            <strong>Question of the Day</strong>
            <h3 style={{ margin: 0 }}>Welche Ausbildung und Qualifikationen sind für deinen Beruf wichtig?</h3>
            <p style={{ margin: 0 }}>
              Wähle deinen Wunschberuf oder einen Beruf, den du gut kennst. Erkläre den Ausbildungsweg, wichtige Qualifikationen, die Situation in deinem Heimatland sowie Vor- und Nachteile.
            </p>
            <strong>Prepare a 90–120 second answer. Teil 1 is not submitted.</strong>
          </div>

          <img
            src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1600&q=80"
            alt="A group discussing professions and career paths"
            loading="lazy"
            style={imageStyle}
          />

          <div style={box}>
            <strong>Beruf kennen: Themen und Leitfragen</strong>
            <ol style={listStyle}>
              <li><strong>Beliebte Berufe:</strong> Arzt/Ärztin, Ingenieur/in, Lehrer/in, Kaufmann/Kauffrau, Handwerker/in, Künstler/in und IT-Spezialist/in.</li>
              <li><strong>Ausbildung und Studium:</strong> Schulabschluss, Universität, Fachhochschule, Berufsausbildung, Lehre und Praktikum.</li>
              <li><strong>Wichtige Qualifikationen:</strong> Teamarbeit, Kommunikation, Kreativität, technische Kenntnisse, Sprachen und IT.</li>
              <li><strong>Karriereweg:</strong> Schulabschluss, Ausbildung oder Studium, Berufseinstieg, Weiterbildung und Karriereaufstieg.</li>
              <li><strong>Herausforderungen:</strong> Ausbildungsdauer, Kosten, Arbeitsmarkt und Aufstiegsmöglichkeiten.</li>
            </ol>
          </div>

          <div style={blueBox}>
            <strong>Beispiel: Wie wird man Arzt oder Ärztin?</strong>
            <ol style={listStyle}>
              <li>Abitur machen</li>
              <li>Medizinstudium absolvieren</li>
              <li>Staatsexamen bestehen</li>
              <li>Facharztausbildung machen</li>
              <li>Berufserfahrung sammeln</li>
            </ol>
          </div>

          <div style={box}>
            <strong>Suggested answer structure</strong>
            <ol style={listStyle}>
              <li>Begrüßung und Thema vorstellen.</li>
              <li>Den Beruf und den Ausbildungsweg erklären.</li>
              <li>Wichtige Qualifikationen und Fähigkeiten nennen.</li>
              <li>Die Situation im Heimatland beschreiben.</li>
              <li>Vor- und Nachteile oder Herausforderungen erklären.</li>
              <li>Die eigene Meinung zusammenfassen.</li>
            </ol>
          </div>

          <CourseInlinePracticePanel type="speaking" />
          <Prepared checked={prepared.sprechen} onChange={markPrepared("sprechen")} />
        </section>
      )}

      {activeTab === "schreiben" && (
        <section style={card}>
          <h2 style={{ margin: 0 }}>Teil 2 · Schreiben (Assignment)</h2>
          <div style={blueBox}>
            <strong>Your assignment</strong>
            <h3 style={{ margin: 0 }}>Sind Ausbildung und Qualifikationen wichtig für den Beruf?</h3>
            <p style={{ margin: 0 }}>
              Reagieren Sie auf Felix' Meinung. Sagen Sie, ob Sie zustimmen, vergleichen Sie Ausbildung mit Erfahrung und nennen Sie ein Beispiel.
            </p>
            <strong>Write approximately 80–100 words and submit the final text in the Submit tab.</strong>
          </div>

          <div style={box}>
            <strong>Beitrag von Felix</strong>
            <p style={{ margin: 0 }}>
              Eine gute Ausbildung hilft, einen guten Job zu finden. Mit Qualifikationen hat man bessere Chancen auf dem Arbeitsmarkt. Dennoch sind auch Erfahrung und persönliche Fähigkeiten wichtig. Ich finde, dass man immer weiterlernen sollte, um erfolgreich zu sein. Was denken Sie darüber?
            </p>
          </div>

          <div style={box}>
            <strong>Beantworten Sie diese Inhaltspunkte</strong>
            <ul style={listStyle}>
              <li>Stimmen Sie Felix zu oder nicht?</li>
              <li>Warum sind Ausbildung und Qualifikationen wichtig oder nicht wichtig?</li>
              <li>Was ist wichtiger: Ausbildung oder praktische Erfahrung?</li>
              <li>Nennen Sie ein Beispiel aus Ihrem Leben oder Heimatland.</li>
              <li>Formulieren Sie einen klaren Schluss.</li>
            </ul>
          </div>

          <div style={box}>
            <strong>Writing support template</strong>
            <p style={{ margin: 0, whiteSpace: "pre-line" }}>{`Liebe Forum-Mitglieder,

ich möchte meine Meinung zum Thema Ausbildung und Qualifikationen äußern.

Ich stimme Felix zu / nicht ganz zu, weil …

Einerseits … Andererseits …

In meinem Leben / In meinem Heimatland …

Zusammenfassend finde ich, dass …

Mit freundlichen Grüßen
[Ihr Name]`}</p>
          </div>

          <CourseInlinePracticePanel type="writing" />
          <WorkbookSubmissionReminder />
          <Prepared checked={prepared.schreiben} onChange={markPrepared("schreiben")} />
        </section>
      )}

      {activeTab === "lesen" && (
        <section style={card}>
          <h2 style={{ margin: 0 }}>Teil 3 · Lesen (Assignment)</h2>
          <div style={blueBox}>
            <strong>Your assignment</strong>
            <h3 style={{ margin: 0 }}>Lesen Sie den Blogeintrag und beantworten Sie alle sechs Richtig/Falsch-Fragen.</h3>
            <p style={{ margin: 0 }}>Submit only the answer letters in this format: 1A, 2B, 3A …</p>
          </div>

          <article style={box}>
            <h3 style={{ margin: 0 }}>SusannesAlltagsBlog.at</h3>
            <p style={{ margin: 0, color: "#475569" }}>Mein Alltag, meine Gedanken, mein Leben ... · Donnerstag, den 23. Juni</p>
            <p>Als Susanne beim Kochen war, rief eine Mitarbeiterin ihrer Bank an. Eine Brieftasche war in der Bankfiliale abgegeben worden. Susanne hatte noch gar nicht bemerkt, dass sie fehlte.</p>
            <p>Ein junger Mann hatte die Brieftasche auf dem Parkplatz vor dem Supermarkt gefunden. Er wollte sie zuerst ins Fundbüro bringen, aber der Weg war zu weit. Auf der Bankomatkarte fand er Susannes Namen und ihre Bank.</p>
            <p>Die Bank konnte Susannes Telefonnummer herausfinden. Zum Glück war alles noch in der Brieftasche. Susanne kennt den Finder nicht und kann ihm deshalb nicht persönlich danken.</p>
          </article>

          <QuestionList questions={readingQuestions} />
          <WorkbookSubmissionReminder />
          <Prepared checked={prepared.lesen} onChange={markPrepared("lesen")} />
        </section>
      )}

      {activeTab === "hoeren" && (
        <section style={card}>
          <h2 style={{ margin: 0 }}>Teil 4 · Hören (Self-check)</h2>
          <div style={blueBox}>
            <strong>Independent practice</strong>
            <h3 style={{ margin: 0 }}>Bearbeiten Sie den Goethe-standard Hören-Test und kontrollieren Sie Ihre Antworten selbst.</h3>
            <p style={{ margin: 0 }}>Teil 4 is self-check. Do not submit your Hören answers.</p>
          </div>

          <iframe
            style={videoStyle}
            src="https://www.youtube-nocookie.com/embed/fMCYUVNYc9U?rel=0&playsinline=1"
            title="B1 Day 20 Hören"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />

          <div style={box}>
            <strong>Self-check instructions</strong>
            <ol style={listStyle}>
              <li>Lesen Sie zuerst alle Aufgaben.</li>
              <li>Hören Sie aufmerksam zu.</li>
              <li>Bearbeiten Sie schwierige Teile ein zweites Mal.</li>
              <li>Vergleichen Sie Ihre Antworten mit den Lösungen im Video.</li>
            </ol>
          </div>

          <Prepared checked={prepared.hoeren} onChange={markPrepared("hoeren")} />
        </section>
      )}

      {activeTab === "references" && (
        <WorkbookReferenceAnswers
          level="B1"
          lesson={{
            title: "B1Day20WieWirdMan",
            level: "B1",
            day: 20,
            workbookId: "B1Day20WieWirdMan",
          }}
          workbookId="B1Day20WieWirdMan"
        />
      )}

      {activeTab === "submit" && (
        <section style={card}>
          <h2 style={{ margin: 0 }}>Submit Workbook · Day 20 · Kapitel 6.20</h2>
          <div style={blueBox}>
            <strong>Submit Teil 2 and Teil 3 only.</strong>
            <ul style={listStyle}>
              <li><strong>Teil 2 · Schreiben:</strong> Paste your final 80–100 word opinion text.</li>
              <li><strong>Teil 3 · Lesen:</strong> Paste your six Richtig/Falsch answer letters.</li>
              <li><strong>Teil 1 · Sprechen:</strong> Group practice only.</li>
              <li><strong>Teil 4 · Hören:</strong> Self-check only.</li>
            </ul>
          </div>

          <div
            className="b1-day20-submit"
            style={{ border: "1px solid #bfdbfe", borderRadius: 14, padding: 8, background: "#fff" }}
          >
            <style>{`.b1-day20-submit > div > section:first-child { display: none !important; }
            .b1-day20-submit select { display: none !important; }`}</style>
            <AssignmentSubmissionPage
              submissionContext={{
                level: "B1",
                day: 20,
                assignmentKey: "B1-6.20",
                canonicalAssignmentKey: "B1-6.20",
              }}
            />
          </div>
        </section>
      )}
    </div>
  );
}

export default function B1Day20WieWirdManWorkbookPage() {
  return (
    <RadioFirstWorkbookGate level="B1" day={20}>
      <B1Day20WorkbookContent />
    </RadioFirstWorkbookGate>
  );
}
