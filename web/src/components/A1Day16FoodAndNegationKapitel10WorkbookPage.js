import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AppBackButton from "./navigation/AppBackButton";
import AssignmentSubmissionPage from "./AssignmentSubmissionPage";
import { getInlineCourseAssignments } from "../utils/courseLessonAssignments";
import { styles } from "../styles";

const LEVEL = "A1";
const DAY = 16;
const CHAPTER = "10";
const FALLBACK_ASSIGNMENT_KEY = "A1-10";
const HOREN_VIDEO_URL = "https://youtu.be/Q5oOWNvZ8X4";
const HOREN_EMBED_URL = "https://www.youtube.com/embed/Q5oOWNvZ8X4";

const cardStyle = {
  ...styles.card,
  display: "grid",
  gap: 12,
};

const sectionStyle = {
  ...styles.card,
  display: "grid",
  gap: 10,
};

const imageStyle = {
  width: "100%",
  borderRadius: 10,
  maxHeight: 320,
  objectFit: "cover",
};

const questionBoxStyle = {
  border: "1px solid #e5e7eb",
  borderRadius: 10,
  padding: 12,
  display: "grid",
  gap: 6,
  background: "#fff",
};

const listeningQuestions = [
  {
    stem: "1. Wie oft geht der Sprecher einkaufen?",
    options: ["A) Jeden Tag", "B) Jede Woche", "C) Jeden Monat"],
  },
  {
    stem: "2. Was hat der Sprecher zuerst gekauft?",
    options: ["A) Brot", "B) Tomaten", "C) Äpfel und Bananen"],
  },
  {
    stem: "3. Wie viele Tomaten hat der Sprecher gekauft?",
    options: ["A) Ein halbes Kilo", "B) Ein Kilo", "C) Zwei Kilo"],
  },
  {
    stem: "4. Was hat der gesamte Einkauf gekostet?",
    options: ["A) 5 Euro", "B) 10 Euro", "C) 15 Euro"],
  },
  {
    stem: "5. Was hat die Kassiererin dem Sprecher gewünscht?",
    options: ["A) Einen schönen Abend", "B) Einen schönen Tag", "C) Guten Appetit"],
  },
];

const vocabList = {
  nomen: [
    "der Supermarkt – supermarket",
    "das Obst – fruit",
    "das Gemüse – vegetable",
    "das Brot – bread",
    "die Milch – milk",
    "der Apfel (die Äpfel) – apple",
    "die Banane (die Bananen) – banana",
    "die Tomate (die Tomaten) – tomato",
    "der Einkauf – purchase/shopping",
    "die Kassiererin – cashier (female)",
    "der Kassierer – cashier (male)",
    "der Preis – price",
    "das Kilo – kilogram",
    "das Geld – money",
    "der Euro – euro",
  ],
  verben: [
    "einkaufen – to shop",
    "kaufen – to buy",
    "kosten – to cost",
    "gehen – to go",
    "wünschen – to wish",
    "sein – to be",
    "haben – to have",
  ],
  adjektive: ["frisch – fresh", "freundlich – friendly", "gut – good"],
  phrasen: [
    "Jede Woche – every week",
    "ein Kilo – one kilogram",
    "ein halbes Kilo – half a kilogram",
    "Schönen Tag – Have a nice day",
    "Es war ein guter Einkauf – It was a good shopping trip",
  ],
};

const A1Day16FoodAndNegationKapitel10WorkbookPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = useMemo(() => new URLSearchParams(location.search || ""), [location.search]);
  const requestedTab = searchParams.get("workbookTab");
  const [activeTab, setActiveTab] = useState(requestedTab === "submit" ? "submit" : "assignment");
  const assignmentKey = useMemo(() => {
    const foodAssignment = getInlineCourseAssignments(LEVEL, DAY).find(
      (assignment) => String(assignment.chapter) === CHAPTER
    );
    return foodAssignment?.assignmentKey || FALLBACK_ASSIGNMENT_KEY;
  }, []);

  useEffect(() => {
    setActiveTab(requestedTab === "submit" ? "submit" : "assignment");
  }, [requestedTab]);

  useEffect(() => {
    if (requestedTab !== "submit") return;
    if (searchParams.get("assignmentKey") === assignmentKey && searchParams.get("level") === LEVEL) return;

    const nextSearch = new URLSearchParams(location.search || "");
    nextSearch.set("workbookTab", "submit");
    nextSearch.set("assignmentKey", assignmentKey);
    nextSearch.set("level", LEVEL);
    navigate(
      {
        pathname: location.pathname,
        search: `?${nextSearch.toString()}`,
      },
      { replace: true, state: { ...(location.state || {}), level: LEVEL, assignmentKey, canonicalAssignmentKey: assignmentKey } }
    );
  }, [assignmentKey, location.pathname, location.search, location.state, navigate, requestedTab, searchParams]);

  const openTab = (tabKey) => {
    setActiveTab(tabKey);
    const search = new URLSearchParams(location.search || "");
    search.set("workbookTab", tabKey);
    search.set("assignmentKey", assignmentKey);
    search.set("level", LEVEL);
    navigate(
      {
        pathname: location.pathname,
        search: `?${search.toString()}`,
      },
      {
        replace: true,
        state: {
          ...(location.state || {}),
          level: LEVEL,
          assignmentKey,
          canonicalAssignmentKey: assignmentKey,
        },
      }
    );
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div style={{ ...styles.container, display: "grid", gap: 16 }}>
      <div style={cardStyle}>
        <AppBackButton label="Back to Course Book" fallbackPath="/campus/course" />
        <h1 style={{ ...styles.title, marginBottom: 0 }}>A1 · Day 16 Workbook · Food and Negation</h1>
        <p style={{ ...styles.subtitle, margin: 0 }}>Chapter 10 · Tutor-marked assignment</p>
        <p style={{ ...styles.subtitle, margin: 0 }}>
          Complete all sections in Assignment, then open Submit to send your final answers for {assignmentKey}.
        </p>

        <div
          role="tablist"
          aria-label="A1 Day 16 Food workbook tabs"
          style={{ display: "flex", gap: 8, flexWrap: "wrap", borderTop: "1px solid #dbeafe", paddingTop: 12 }}
        >
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
                  background: selected ? "#2563eb" : "#ffffff",
                  borderColor: selected ? "#2563eb" : "#93c5fd",
                  color: selected ? "#ffffff" : "#1d4ed8",
                  fontWeight: 800,
                  minWidth: 120,
                }}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {activeTab === "assignment" ? (
        <>
          <section style={sectionStyle}>
            <img
              src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1600&q=80"
              alt="Fresh groceries including vegetables and fruit on display in a market"
              loading="lazy"
              style={imageStyle}
            />
            <h2 style={{ margin: 0 }}>Teil 1 · Lesen / Schreiben</h2>
            <p style={{ margin: 0, lineHeight: 1.7 }}>
              <strong>📝 Workbook Teil 1 (Lesen):</strong> Einkaufen und Kochen
            </p>
            <p style={{ margin: 0, lineHeight: 1.7 }}>
              <strong>Instructions:</strong> Read the text below.
            </p>
            <p style={{ margin: 0, lineHeight: 1.7 }}>
              Einkaufen ist wichtig. Ich mache oft eine Einkaufsliste und kaufe Obst, Gemüse, Brot, Milch und Eier im
              Supermarkt. Ich gehe zweimal pro Woche einkaufen. Auf dem Wochenmarkt kaufe ich frisches Obst und Gemüse, die
              oft frischer sind als im Supermarkt. Letzten Samstag habe ich Tomaten, Gurken, Salat und Kartoffeln gekauft.
              Die Preise sind manchmal höher, aber die Qualität ist besser. Nach dem Einkaufen koche ich gerne. Ein
              einfaches Rezept ist Tomatensalat: Tomaten und Zwiebeln schneiden, mit Salz, Pfeffer und Olivenöl mischen.
              Dieser Salat ist schnell gemacht und sehr lecker.
            </p>
          </section>

          <section style={sectionStyle}>
            <h2 style={{ margin: 0 }}>Teil 2 · Hören</h2>
            <p style={{ margin: 0, lineHeight: 1.7 }}>
              Watch and listen to the embedded YouTube Hören video, then answer the questions below.
            </p>
            <div style={{ position: "relative", width: "100%", paddingTop: "56.25%", borderRadius: 12, overflow: "hidden" }}>
              <iframe
                src={HOREN_EMBED_URL}
                title="A1 Day 16 Hören: Einkaufen im Supermarkt"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: 0 }}
              />
            </div>
            <a
              href={HOREN_VIDEO_URL}
              target="_blank"
              rel="noreferrer"
              style={{ ...styles.secondaryButton, textDecoration: "none", width: "fit-content" }}
            >
              Open Hören video on YouTube
            </a>
            <p style={{ margin: "8px 0 0", fontWeight: 600 }}>Hören Fragen (Multiple Choice)</p>
            {listeningQuestions.map((question) => (
              <div key={question.stem} style={questionBoxStyle}>
                <strong>{question.stem}</strong>
                {question.options.map((option) => (
                  <span key={option}>{option}</span>
                ))}
              </div>
            ))}

            <div style={{ ...questionBoxStyle, background: "#f9fafb" }}>
              <strong>Vokabelliste: Einkaufen im Supermarkt</strong>
              <span><strong>Nomen:</strong> {vocabList.nomen.join(" · ")}</span>
              <span><strong>Verben:</strong> {vocabList.verben.join(" · ")}</span>
              <span><strong>Adjektive:</strong> {vocabList.adjektive.join(" · ")}</span>
              <span><strong>Phrasen:</strong> {vocabList.phrasen.join(" · ")}</span>
            </div>
          </section>

          <div style={{ ...cardStyle, background: "#eff6ff", border: "1px solid #bfdbfe" }}>
            <p style={{ margin: 0, fontWeight: 600 }}>
              Finished all parts? Open the Submit tab and paste your final answers there.
            </p>
            <button type="button" style={{ ...styles.button, width: "fit-content" }} onClick={() => openTab("submit")}>
              Open Submit Tab
            </button>
          </div>
        </>
      ) : (
        <section style={{ ...sectionStyle, border: "1px solid #bfdbfe" }} aria-label="Submit A1 Day 16 Food workbook answers">
          <div>
            <p style={{ color: "#1d4ed8", fontSize: 13, fontWeight: 900, letterSpacing: ".04em", margin: 0, textTransform: "uppercase" }}>
              Tutor-marked assignment
            </p>
            <h2 style={{ margin: "4px 0" }}>Submit A1 · Day 16 · Chapter 10 Food</h2>
            <p style={{ color: "#475569", margin: 0 }}>
              This submission box is locked to {assignmentKey}, so your work is saved under the correct assignment.
            </p>
          </div>
          <div className="a1-day16-food-workbook-submit-tab">
            <style>{`.a1-day16-food-workbook-submit-tab > div > section:first-child { display: none !important; }
              .a1-day16-food-workbook-submit-tab select { display: none !important; }`}</style>
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

export default A1Day16FoodAndNegationKapitel10WorkbookPage;
