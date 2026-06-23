import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AppBackButton from "./navigation/AppBackButton";
import AssignmentSubmissionPage from "./AssignmentSubmissionPage";
import { getInlineCourseAssignments } from "../utils/courseLessonAssignments";
import { styles } from "../styles";

const LEVEL = "A1";
const DAY = 2;
const CHAPTER = "1.1";
const FALLBACK_ASSIGNMENT_KEY = "A1-1.1";
const HOEREN_VIDEO_URL = "https://youtu.be/nih5h7B48NY";
const HOEREN_EMBED_URL = "https://www.youtube.com/embed/nih5h7B48NY?rel=0";

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
  maxHeight: 260,
  objectFit: "cover",
};

const videoStyle = {
  width: "100%",
  minHeight: 315,
  border: 0,
  borderRadius: 10,
};

const questionBoxStyle = {
  border: "1px solid #e5e7eb",
  borderRadius: 10,
  padding: 12,
  display: "grid",
  gap: 6,
  background: "#fff",
};

const questions = [
  {
    stem: "1. Wie heißt sie?",
    translation: "What is her name?",
    options: ["A) Maria", "B) Lisa", "C) Anna", "D) Julia"],
  },
  {
    stem: "2. Woher kommt sie?",
    translation: "Where does she come from?",
    options: ["A) Berlin", "B) Hamburg", "C) München", "D) Frankfurt"],
  },
  {
    stem: "3. Welche Buchstaben sagt sie?",
    translation: "Which letters does Anna say?",
    options: [
      "A) A, B, C, D, E, F, G",
      "B) H, I, J, K, L, M, N",
      "C) O, P, Q, R, S, T, U",
      "D) V, W, X, Y, Z, Ä, Ö, Ü",
    ],
  },
  {
    stem: "4. Woher kommt Annas Freund Max?",
    translation: "Where does Anna's friend Max come from?",
    options: ["A) Berlin", "B) Hamburg", "C) München", "D) Frankfurt"],
  },
];

const A1Day2Kapitel11WorkbookPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = useMemo(() => new URLSearchParams(location.search || ""), [location.search]);
  const requestedTab = searchParams.get("workbookTab");
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

  useEffect(() => {
    if (requestedTab !== "submit") return;
    if (
      searchParams.get("assignmentKey") === assignmentKey &&
      searchParams.get("assignmentId") === assignmentKey &&
      searchParams.get("level") === LEVEL
    ) {
      return;
    }

    const nextSearch = new URLSearchParams(location.search || "");
    nextSearch.set("workbookTab", "submit");
    nextSearch.set("assignmentKey", assignmentKey);
    nextSearch.set("assignmentId", assignmentKey);
    nextSearch.set("level", LEVEL);

    navigate(
      {
        pathname: location.pathname,
        search: `?${nextSearch.toString()}`,
      },
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
  }, [assignmentKey, location.pathname, location.search, location.state, navigate, requestedTab, searchParams]);

  const openTab = (tabKey) => {
    setActiveTab(tabKey);
    const nextSearch = new URLSearchParams(location.search || "");
    nextSearch.set("workbookTab", tabKey);
    nextSearch.set("assignmentKey", assignmentKey);
    nextSearch.set("assignmentId", assignmentKey);
    nextSearch.set("level", LEVEL);

    navigate(
      {
        pathname: location.pathname,
        search: `?${nextSearch.toString()}`,
      },
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
      <div style={cardStyle}>
        <AppBackButton label="Back to Course Book" fallbackPath="/campus/course" />
        <h1 style={{ ...styles.title, marginBottom: 0 }}>A1 · Day 2 Workbook · Kapitel 1.1</h1>
        <p style={{ ...styles.subtitle, margin: 0 }}>Chapter 1.1 · Tutor-marked assignment</p>
        <p style={{ ...styles.subtitle, margin: 0 }}>
          Complete the assignment, then open Submit to send your final answers for {assignmentKey}.
        </p>

        <div
          role="tablist"
          aria-label="A1 Day 2 Kapitel 1.1 workbook tabs"
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
              src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=1600&q=80"
              alt="Student writing a German self-introduction in a workbook"
              loading="lazy"
              style={imageStyle}
            />
            <h2 style={{ margin: 0 }}>Teil 1 · Reading and Writing</h2>
            <p style={{ margin: 0, lineHeight: 1.7 }}>
              <strong>Schreiben Assignment: Introducing Yourself in German</strong>
            </p>
            <p style={{ margin: 0, lineHeight: 1.7 }}>
              <strong>Instructions:</strong> Write a short text introducing yourself. Use the sentences and vocabulary you have
              learned. Include your name, where you come from, and where you live. Also, use at least one greeting and one
              farewell phrase.
            </p>
            <p style={{ margin: 0, lineHeight: 1.7 }}>
              <strong>Assignment:</strong>
              <br />1. Begin your introduction with a greeting (e.g., "Hallo!" or "Guten Morgen!").
              <br />2. Introduce yourself using "Ich heiße [Name]."
              <br />3. Say where you come from using "Ich komme aus [Stadt/Land]."
              <br />4. Say where you live using "Ich wohne in [Stadt]."
              <br />5. End your introduction with a farewell (e.g., "Tschüss!" or "Gute Nacht!").
            </p>
          </section>

          <section style={sectionStyle}>
            <h2 style={{ margin: 0 }}>Teil 2 · Hören</h2>
            <p style={{ margin: 0, lineHeight: 1.7 }}>
              <strong>Hörverstehen (Listening Comprehension) Exercise:</strong> Introducing Yourself, Alphabet, and Introducing a
              Friend.
              <br />Watch and listen to the video, then answer the questions below.
            </p>
            <a
              href={HOEREN_VIDEO_URL}
              target="_blank"
              rel="noreferrer"
              style={{ ...styles.button, width: "fit-content", textDecoration: "none" }}
            >
              Open Hören video on YouTube
            </a>
            <iframe
              title="A1 Day 2 Kapitel 1.1 Hören video"
              src={HOEREN_EMBED_URL}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              style={videoStyle}
            />
            {questions.map((question) => (
              <div key={question.stem} style={questionBoxStyle}>
                <strong>{question.stem}</strong>
                <span style={{ color: "#4b5563" }}>Translation: {question.translation}</span>
                {question.options.map((option) => (
                  <span key={option}>{option}</span>
                ))}
              </div>
            ))}
          </section>

          <div style={{ ...cardStyle, background: "#eff6ff", border: "1px solid #bfdbfe" }}>
            <p style={{ margin: 0, fontWeight: 600 }}>
              Finished the assignment? Open Submit and send all final answers for tutor marking.
            </p>
            <button type="button" style={{ ...styles.button, width: "fit-content" }} onClick={() => openTab("submit")}>
              Open Submit Tab
            </button>
          </div>
        </>
      ) : (
        <section style={{ ...sectionStyle, border: "1px solid #bfdbfe" }} aria-label="Submit A1 Day 2 Kapitel 1.1 workbook answers">
          <div>
            <p style={{ color: "#1d4ed8", fontSize: 13, fontWeight: 900, letterSpacing: ".04em", margin: 0, textTransform: "uppercase" }}>
              Tutor-marked assignment
            </p>
            <h2 style={{ margin: "4px 0" }}>Submit A1 · Day 2 · Kapitel 1.1</h2>
            <p style={{ color: "#475569", margin: 0 }}>
              This submission box is locked to {assignmentKey}, so your work is saved under the correct assignment.
            </p>
          </div>
          <div className="a1-day2-kapitel11-workbook-submit-tab">
            <style>{`.a1-day2-kapitel11-workbook-submit-tab > div > section:first-child { display: none !important; }
              .a1-day2-kapitel11-workbook-submit-tab select { display: none !important; }`}</style>
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

export default A1Day2Kapitel11WorkbookPage;
