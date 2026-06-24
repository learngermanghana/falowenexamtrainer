import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AppBackButton from "./navigation/AppBackButton";
import AssignmentSubmissionPage from "./AssignmentSubmissionPage";
import { getInlineCourseAssignments } from "../utils/courseLessonAssignments";
import { styles } from "../styles";

const LEVEL = "A1";
const DAY = 18;
const CHAPTER = "12.2";
const FALLBACK_ASSIGNMENT_KEY = "A1-12.2";
const AUDIO_FILE_ID = "1CSYpnavow0VlBx607bhHeB0LE_NsIYLk";

const card = { ...styles.card, display: "grid", gap: 12 };
const questionCard = {
  border: "1px solid #e5e7eb",
  borderRadius: 12,
  padding: 12,
  display: "grid",
  gap: 7,
  background: "#fff",
};

const trainQuestions = [
  {
    stem: "Wann fährt der Zug von Hamburg nach Berlin ab?",
    options: ["a) Um 8:00 Uhr", "b) Um 9:00 Uhr", "c) Um 10:00 Uhr", "d) Um 11:00 Uhr"],
  },
  {
    stem: "Wann kommt der Zug von Hamburg nach Berlin an?",
    options: ["a) Um 11:00 Uhr", "b) Um 12:00 Uhr", "c) Um 13:00 Uhr", "d) Um 14:00 Uhr"],
  },
  {
    stem: "Wann fährt der Rückzug von Berlin nach Hamburg ab?",
    options: ["a) Um 17:00 Uhr", "b) Um 18:00 Uhr", "c) Um 19:00 Uhr", "d) Um 20:00 Uhr"],
  },
  {
    stem: "Wann kommt der Rückzug von Berlin nach Hamburg an?",
    options: ["a) Um 20:00 Uhr", "b) Um 21:00 Uhr", "c) Um 22:00 Uhr", "d) Um 23:00 Uhr"],
  },
  {
    stem: "Was kann man in dem Bürogeschäft kaufen?",
    options: [
      "a) Schreibtische und Stühle",
      "b) Computer und Drucker",
      "c) Bürobedarf für eine produktive Arbeitsumgebung",
      "d) Alles Genannte",
    ],
  },
];

const listeningQuestions = [
  {
    stem: "Wann fährt Felix' Zug von Hamburg nach Berlin ab?",
    options: ["a) Um 8:00 Uhr", "b) Um 9:00 Uhr", "c) Um 10:00 Uhr", "d) Um 11:00 Uhr"],
  },
  {
    stem: "Wann kommt Felix' Zug in Berlin an?",
    options: ["a) Um 11:00 Uhr", "b) Um 12:00 Uhr", "c) Um 13:00 Uhr", "d) Um 14:00 Uhr"],
  },
  {
    stem: "Welche Objekte stehen auf Felix' Schreibtisch im Büro?",
    options: [
      "a) Ein Computer und ein Drucker",
      "b) Ein Telefon und ein Drucker",
      "c) Ein Computer und ein Telefon",
      "d) Ein Drucker und ein Scanner",
    ],
  },
  {
    stem: "Wo bewahrt Felix wichtige Dokumente auf?",
    options: ["a) In einem Regal", "b) In einer Schublade", "c) In einem Aktenschrank", "d) In einer Tasche"],
  },
  {
    stem: "Wie bezahlt Felix gerne, wenn er Büroartikel kauft?",
    options: ["a) Mit Kreditkarte", "b) Mit Scheck", "c) Bar", "d) Per Überweisung"],
  },
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

const A1Day18Kapitel122WorkbookPage = () => {
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

  const audioViewUrl = `https://drive.google.com/file/d/${AUDIO_FILE_ID}/view?usp=sharing`;
  const audioPreviewUrl = `https://drive.google.com/file/d/${AUDIO_FILE_ID}/preview`;

  return (
    <div style={{ ...styles.container, display: "grid", gap: 16 }}>
      <header style={card}>
        <AppBackButton label="Back to Course Book" fallbackPath="/campus/course" />
        <h1 style={{ ...styles.title, margin: 0 }}>A1 · Day 18 Workbook · Kapitel 12.2</h1>
        <p style={{ ...styles.subtitle, margin: 0 }}>Lesen und Hören · Tutor-marked assignment</p>
        <p style={{ margin: 0, color: "#475569" }}>
          Complete all three parts, then use Submit to send your final answers for {assignmentKey}.
        </p>
        <div role="tablist" aria-label="Kapitel 12.2 workbook tabs" style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
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
            <h2 style={{ margin: 0 }}>Teil 1 · Lesen Sie den Aufsatz und schreiben Sie die richtige Antwort</h2>
            <p style={{ margin: 0, color: "#475569" }}>Read the essay and write the correct response.</p>
            <h3 style={{ margin: 0 }}>Ein Tag im Leben eines Arztes</h3>
            <p style={{ margin: 0, lineHeight: 1.75 }}>
              Felix Meier ist Arzt und wohnt in Berlin mit seiner Frau und seinen drei Kindern. Jeden Morgen fährt er mit seinem Auto zur Arbeit ins Krankenhaus. Er arbeitet dort von 7:30 Uhr bis 17:00 Uhr und hilft gerne Menschen. Felix bezahlt gerne bar, wenn er einkaufen geht.
            </p>
            <div style={{ display: "grid", gap: 10 }}>
              {[
                "Wo wohnt Felix?",
                "Mit wem wohnt Felix?",
                "Wie fährt Felix zur Arbeit?",
                "Wann beginnt Felix' Arbeitstag?",
              ].map((question, index) => (
                <div key={question} style={questionCard}>
                  <strong>{index + 1}. {question}</strong>
                  <span>Schreiben Sie Ihre Antwort in die Abgabe.</span>
                </div>
              ))}
              <div style={questionCard}>
                <strong>5. Wie bezahlt Felix gerne beim Einkaufen?</strong>
                <span>a) Barzahlung (cash)</span>
                <span>b) Kreditkarte (credit card)</span>
              </div>
            </div>
          </section>

          <section style={card}>
            <h2 style={{ margin: 0 }}>Teil 2 · Lesen Sie die Anzeigen und beantworten Sie die Fragen</h2>
            <article style={questionCard}>
              <strong>Anzeige 1: Reisen mit der Bahn</strong>
              <h3 style={{ margin: 0 }}>Schnell und bequem mit der Bahn reisen</h3>
              <p style={{ margin: 0, lineHeight: 1.7 }}>
                Der Zug von Hamburg nach Berlin fährt täglich um 9:00 Uhr ab und kommt um 12:00 Uhr in Berlin an. Der Rückzug von Berlin nach Hamburg fährt um 18:00 Uhr ab und kommt um 21:00 Uhr in Hamburg an.
              </p>
            </article>
            <article style={questionCard}>
              <strong>Anzeige 2: Büroartikel für den Arbeitsplatz</strong>
              <h3 style={{ margin: 0 }}>Alles für Ihr Büro</h3>
              <p style={{ margin: 0, lineHeight: 1.7 }}>
                In unserem Bürogeschäft finden Sie Schreibtische, Stühle, Computer, Drucker und vieles mehr. Wir haben alles, was Sie für eine produktive Arbeitsumgebung benötigen.
              </p>
            </article>
            <QuestionList questions={trainQuestions} />
          </section>

          <section style={card}>
            <h2 style={{ margin: 0 }}>Teil 3 · Hören</h2>
            <p style={{ margin: 0, lineHeight: 1.7 }}>
              Hören Sie den Text und wählen Sie die richtige Antwort.
            </p>
            <a
              href={audioViewUrl}
              target="_blank"
              rel="noreferrer"
              style={{ ...styles.button, width: "fit-content", textDecoration: "none" }}
            >
              Open audio
            </a>
            <iframe
              title="Kapitel 12.2 Hören audio"
              src={audioPreviewUrl}
              allow="autoplay"
              style={{ width: "100%", minHeight: 100, border: 0, borderRadius: 10 }}
            />
            <QuestionList questions={listeningQuestions} />
          </section>

          <div style={{ ...card, background: "#eff6ff", border: "1px solid #bfdbfe" }}>
            <strong>Finished Kapitel 12.2?</strong>
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
            <h2 style={{ margin: "4px 0" }}>Submit A1 · Day 18 · Kapitel 12.2</h2>
            <p style={{ color: "#475569", margin: 0 }}>
              This submission is locked to {assignmentKey}, so your work is saved under the correct assignment.
            </p>
          </div>
          <div className="a1-day18-kapitel122-submit-tab">
            <style>{`.a1-day18-kapitel122-submit-tab > div > section:first-child { display: none !important; }
              .a1-day18-kapitel122-submit-tab select { display: none !important; }`}</style>
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

export default A1Day18Kapitel122WorkbookPage;
