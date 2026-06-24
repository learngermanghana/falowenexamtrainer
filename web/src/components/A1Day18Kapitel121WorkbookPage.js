import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AppBackButton from "./navigation/AppBackButton";
import AssignmentSubmissionPage from "./AssignmentSubmissionPage";
import { getInlineCourseAssignments } from "../utils/courseLessonAssignments";
import { styles } from "../styles";

const LEVEL = "A1";
const DAY = 18;
const CHAPTER = "12.1";
const FALLBACK_ASSIGNMENT_KEY = "A1-12.1";

const card = { ...styles.card, display: "grid", gap: 12 };
const questionCard = {
  border: "1px solid #e5e7eb",
  borderRadius: 12,
  padding: 12,
  display: "grid",
  gap: 6,
  background: "#fff",
};

const readingQuestions = [
  {
    stem: "Was ist Annas Beruf?",
    options: ["a) Lehrerin", "b) Ärztin", "c) Krankenschwester", "d) Sekretärin"],
  },
  {
    stem: "Warum kann Anna oft nicht frühstücken?",
    options: ["a) Weil sie keine Zeit hat.", "b) Weil sie keinen Hunger hat.", "c) Weil sie spät aufsteht.", "d) Weil sie keinen Kaffee mag."],
  },
  {
    stem: "Wann beginnt Bens Arbeitstag?",
    options: ["a) Um 7 Uhr", "b) Um 8 Uhr", "c) Um 9 Uhr", "d) Um 10 Uhr"],
  },
  {
    stem: "Welche Fächer darf Ben unterrichten?",
    options: ["a) Nur Mathematik", "b) Nur Deutsch", "c) Viele verschiedene Fächer", "d) Nur Sport"],
  },
  {
    stem: "Was möchte Ben nächstes Jahr machen?",
    options: ["a) Urlaub machen", "b) Ein neues Auto kaufen", "c) Einen Sprachkurs besuchen", "d) Ein Haus bauen"],
  },
];

const adverts = [
  {
    title: "Einkaufen im Supermarkt",
    text: "Unser Supermarkt hat jeden Tag von 8 Uhr bis 20 Uhr geöffnet. Sie finden frische Lebensmittel, Getränke, Haushaltswaren und vieles mehr. Kommen Sie vorbei und entdecken Sie unsere Angebote!",
    question: "Der Supermarkt ist nur am Wochenende geöffnet.",
  },
  {
    title: "Führerschein machen leicht gemacht",
    text: "Unsere Fahrschule bietet Kurse für den Führerschein an. Die Theoriestunden finden dienstags und donnerstags statt. Die Praxisstunden können flexibel vereinbart werden.",
    question: "Die Theoriestunden sind jeden Tag.",
  },
  {
    title: "Arbeiten im modernen Büro",
    text: "Unser Büro ist von Montag bis Freitag geöffnet. Die Arbeitszeiten sind von 9 Uhr bis 17 Uhr. Wir bieten eine angenehme Arbeitsumgebung und freundliche Kollegen.",
    question: "Das Büro ist auch am Wochenende geöffnet.",
  },
  {
    title: "Englisch lernen leicht gemacht",
    text: "Unser Englischkurs findet dreimal pro Woche statt: montags, mittwochs und freitags. Der Kurs beginnt immer um 18 Uhr und dauert zwei Stunden.",
    question: "Der Englischkurs ist zweimal pro Woche.",
  },
  {
    title: "Fit bleiben im Fitnessstudio",
    text: "Unser Fitnessstudio ist jeden Tag von 6 Uhr bis 22 Uhr geöffnet. Wir bieten verschiedene Kurse und moderne Geräte an, um Ihnen zu helfen, fit zu bleiben.",
    question: "Das Fitnessstudio ist nur vormittags geöffnet.",
  },
];

const listeningTasks = [
  "Der Supermarkt hat täglich geöffnet.",
  "Die Theoriestunden in der Fahrschule sind dienstags und donnerstags.",
  "Das Büro ist am Wochenende geschlossen.",
  "Der Englischkurs findet dreimal pro Woche statt.",
  "Das Fitnessstudio ist von 6 Uhr bis 22 Uhr geöffnet.",
];

const QuestionList = ({ questions }) => (
  <div style={{ display: "grid", gap: 10 }}>
    {questions.map((question, index) => (
      <div key={question.stem} style={questionCard}>
        <strong>{index + 1}. {question.stem}</strong>
        {question.options.map((option) => <span key={option}>{option}</span>)}
      </div>
    ))}
  </div>
);

const A1Day18Kapitel121WorkbookPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const params = useMemo(() => new URLSearchParams(location.search || ""), [location.search]);
  const requestedTab = params.get("workbookTab");
  const [activeTab, setActiveTab] = useState(requestedTab === "submit" ? "submit" : "assignment");

  const assignmentKey = useMemo(() => {
    const assignment = getInlineCourseAssignments(LEVEL, DAY).find(
      (item) => String(item.chapter || "").trim() === CHAPTER
    );
    return assignment?.assignmentKey || FALLBACK_ASSIGNMENT_KEY;
  }, []);

  useEffect(() => {
    setActiveTab(requestedTab === "submit" ? "submit" : "assignment");
  }, [requestedTab]);

  const openTab = (tab) => {
    const next = new URLSearchParams(location.search || "");
    next.set("workbookTab", tab);
    next.set("assignmentKey", assignmentKey);
    next.set("assignmentId", assignmentKey);
    next.set("level", LEVEL);
    setActiveTab(tab);
    navigate(
      { pathname: location.pathname, search: `?${next.toString()}` },
      {
        replace: true,
        state: {
          ...(location.state || {}),
          level: LEVEL,
          day: DAY,
          assignmentKey,
          assignmentId: assignmentKey,
          canonicalAssignmentKey: assignmentKey,
          inlineCourseSubmission: true,
        },
      }
    );
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div style={{ ...styles.container, display: "grid", gap: 16 }}>
      <header style={card}>
        <AppBackButton label="Back to Course Book" fallbackPath="/campus/course" />
        <h1 style={{ ...styles.title, margin: 0 }}>A1 · Day 18 Workbook · Kapitel 12.1</h1>
        <p style={{ ...styles.subtitle, margin: 0 }}>Lesen und Hören · Tutor-marked assignment</p>
        <p style={{ margin: 0, color: "#475569" }}>
          Complete all three parts, then use Submit to send your final answers for {assignmentKey}.
        </p>
        <div role="tablist" aria-label="Kapitel 12.1 workbook tabs" style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {[
            { key: "assignment", label: "Assignment" },
            { key: "submit", label: "Submit" },
          ].map((tab) => {
            const selected = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                role="tab"
                aria-selected={selected}
                onClick={() => openTab(tab.key)}
                style={{
                  ...styles.secondaryButton,
                  background: selected ? "#2563eb" : "#fff",
                  borderColor: selected ? "#2563eb" : "#93c5fd",
                  color: selected ? "#fff" : "#1d4ed8",
                  fontWeight: 800,
                  minWidth: 120,
                }}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </header>

      {activeTab === "assignment" ? (
        <>
          <section style={card}>
            <h2 style={{ margin: 0 }}>Teil 1 · Lesen Sie den Aufsatz und wählen Sie die richtige Antwort</h2>
            <h3 style={{ margin: 0 }}>Ein Tag im Leben von Anna und Ben</h3>
            <p style={{ margin: 0, lineHeight: 1.75 }}>
              Anna und Ben sind gute Freunde, und beide haben interessante Berufe. Anna ist Ärztin und arbeitet in einem großen Krankenhaus. Ben ist Lehrer und unterrichtet an einer Grundschule.
            </p>
            <p style={{ margin: 0, lineHeight: 1.75 }}>
              Jeden Morgen muss Anna früh aufstehen, weil sie um 7 Uhr im Krankenhaus sein muss. Sie kann oft nicht frühstücken, weil sie so früh losfahren muss. Anna liebt ihren Beruf, weil sie Menschen helfen kann. Manchmal muss sie auch am Wochenende arbeiten, aber das stört sie nicht.
            </p>
            <p style={{ margin: 0, lineHeight: 1.75 }}>
              Ben kann jeden Morgen etwas länger schlafen, weil die Schule erst um 8 Uhr beginnt. Er mag seinen Beruf, weil er gerne mit Kindern arbeitet. In der Schule darf Ben viele verschiedene Fächer unterrichten. Nach der Arbeit kann er oft Sport machen oder sich mit Freunden treffen.
            </p>
            <p style={{ margin: 0, lineHeight: 1.75 }}>
              Beide, Anna und Ben, müssen sich gut organisieren, um ihre Arbeit und Freizeit in Einklang zu bringen. Anna möchte nächstes Jahr einen Urlaub machen, aber sie weiß noch nicht, wohin. Ben will vielleicht einen Sprachkurs besuchen, weil er seine Englischkenntnisse verbessern möchte.
            </p>
            <QuestionList questions={readingQuestions} />
          </section>

          <section style={card}>
            <h2 style={{ margin: 0 }}>Teil 2 · Lesen Sie die Anzeigen und beantworten Sie die Fragen</h2>
            {adverts.map((advert, index) => (
              <article key={advert.title} style={questionCard}>
                <strong>Anzeige {index + 1}: {advert.title}</strong>
                <p style={{ margin: 0, lineHeight: 1.7 }}>{advert.text}</p>
                <strong>{index + 1}. {advert.question}</strong>
                <span>a) Richtig</span>
                <span>b) Falsch</span>
              </article>
            ))}
          </section>

          <section style={card}>
            <h2 style={{ margin: 0 }}>Teil 3 · Hören</h2>
            <p style={{ margin: 0, lineHeight: 1.7 }}>
              Watch the video, then decide whether each statement is Richtig or Falsch.
            </p>
            <iframe
              title="Kapitel 12.1 Hören"
              src="https://www.youtube.com/embed/m07lKGJAoF8"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              style={{ width: "100%", minHeight: 315, border: 0, borderRadius: 10 }}
            />
            {listeningTasks.map((question, index) => (
              <article key={question} style={questionCard}>
                <strong>{index + 1}. {question}</strong>
                <span>a) Richtig</span>
                <span>b) Falsch</span>
              </article>
            ))}
          </section>

          <div style={{ ...card, background: "#eff6ff", border: "1px solid #bfdbfe" }}>
            <strong>Finished Kapitel 12.1?</strong>
            <p style={{ margin: 0 }}>Open Submit and send all final answers for tutor marking.</p>
            <button type="button" style={{ ...styles.primaryButton, width: "fit-content" }} onClick={() => openTab("submit")}>
              Open Submit Tab
            </button>
          </div>
        </>
      ) : (
        <section style={{ ...card, border: "1px solid #bfdbfe" }}>
          <div>
            <p style={{ color: "#1d4ed8", fontSize: 13, fontWeight: 900, letterSpacing: ".04em", margin: 0, textTransform: "uppercase" }}>
              Tutor-marked assignment
            </p>
            <h2 style={{ margin: "4px 0" }}>Submit A1 · Day 18 · Kapitel 12.1</h2>
            <p style={{ color: "#475569", margin: 0 }}>
              This submission is locked to {assignmentKey}, so your work is saved under the correct assignment.
            </p>
          </div>
          <div className="a1-day18-kapitel121-submit-tab">
            <style>{`.a1-day18-kapitel121-submit-tab > div > section:first-child { display: none !important; }
              .a1-day18-kapitel121-submit-tab select { display: none !important; }`}</style>
            <AssignmentSubmissionPage
              submissionContext={{
                level: LEVEL,
                day: DAY,
                assignmentKey,
                canonicalAssignmentKey: assignmentKey,
              }}
            />
          </div>
        </section>
      )}
    </div>
  );
};

export default A1Day18Kapitel121WorkbookPage;
