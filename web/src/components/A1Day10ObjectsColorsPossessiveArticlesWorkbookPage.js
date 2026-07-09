import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AppBackButton from "./navigation/AppBackButton";
import AssignmentSubmissionPage from "./AssignmentSubmissionPage";
import { getInlineCourseAssignments } from "../utils/courseLessonAssignments";

import { styles } from "../styles";

const LEVEL = "A1";
const DAY = 10;
const CHAPTER = "6";
const FALLBACK_ASSIGNMENT_KEY = "A1-6";

const card = {
  ...styles.card,
  display: "grid",
  gap: 12,
};

const sectionTitle = {
  margin: 0,
  fontSize: "1.1rem",
};

const questionBlock = {
  display: "grid",
  gap: 6,
  padding: "10px 12px",
  border: "1px solid #e5e7eb",
  borderRadius: 10,
  background: "#fff",
};

const optionLine = {
  margin: 0,
  paddingLeft: 12,
  lineHeight: 1.7,
};

const teil2Questions = [
  {
    stem: "1. Wie viele Zimmer hat die Wohnung?",
    options: ["a) Drei", "b) Vier", "c) Fünf", "d) Sechs"],
  },
  {
    stem: "2. Was steht im Wohnzimmer?",
    options: [
      "a) Ein Sofa und ein Fernseher",
      "b) Ein Bett und ein Kleiderschrank",
      "c) Ein Tisch und vier Stühle",
      "d) Eine Dusche und eine Badewanne",
    ],
  },
  {
    stem: "3. Was gibt es in der Küche?",
    options: [
      "a) Ein Sofa und einen Fernseher",
      "b) Einen Herd, einen Kühlschrank und einen Tisch mit vier Stühlen",
      "c) Ein Bett und einen Kleiderschrank",
      "d) Eine Dusche und eine Badewanne",
    ],
  },
  {
    stem: "4. Welches Möbelstück steht im Schlafzimmer?",
    options: ["a) Ein Sofa", "b) Ein Herd", "c) Ein großes Bett", "d) Ein Fernseher"],
  },
  {
    stem: "5. Was gibt es im Badezimmer?",
    options: [
      "a) Ein Sofa und einen Tisch",
      "b) Einen Herd und einen Kühlschrank",
      "c) Ein Bett und einen Kleiderschrank",
      "d) Eine Dusche, eine Badewanne und ein Waschbecken",
    ],
  },
  {
    stem: "6. Wie ist der Balkon beschrieben?",
    options: ["a) Groß und leer", "b) Klein und schön", "c) Groß und schön", "d) Klein und leer"],
  },
  {
    stem: "7. Was gibt es auf dem Balkon?",
    options: [
      "a) Ein großes Bett",
      "b) Einen Herd und einen Kühlschrank",
      "c) Blumen und einen kleinen Tisch mit zwei Stühlen",
      "d) Eine Dusche und eine Badewanne",
    ],
  },
];

const horenVideoUrl = "https://youtu.be/WiPw0t8Geh4";
const horenVideoEmbedUrl = "https://www.youtube.com/embed/WiPw0t8Geh4";

const horenAssignments = [
  {
    number: 1,
    title: "Passage 1: Die Wohnung",
    question: "Wie viele Zimmer hat die Wohnung?",
    options: ["a) Drei", "b) Vier", "c) Fünf", "d) Sechs"],
  },
  {
    number: 2,
    title: "Passage 2: Das Wohnzimmer",
    question: "Was steht im Wohnzimmer?",
    options: [
      "a) Ein Bett und ein Schrank",
      "b) Ein Sofa und ein Fernseher",
      "c) Ein Tisch und vier Stühle",
      "d) Eine Dusche und eine Badewanne",
    ],
  },
  {
    number: 3,
    title: "Passage 3: Die Küche",
    question: "Was gibt es in der Küche?",
    options: [
      "a) Ein Sofa und einen Fernseher",
      "b) Einen Herd, einen Kühlschrank und einen Tisch mit vier Stühlen",
      "c) Ein Bett und einen Kleiderschrank",
      "d) Eine Dusche und eine Badewanne",
    ],
  },
  {
    number: 4,
    title: "Passage 4: Das Schlafzimmer",
    question: "Welches Möbelstück steht im Schlafzimmer?",
    options: ["a) Ein Sofa", "b) Ein Herd", "c) Ein großes Bett", "d) Ein Fernseher"],
  },
  {
    number: 5,
    title: "Passage 5: Das Badezimmer",
    question: "Was gibt es im Badezimmer?",
    options: [
      "a) Ein Sofa und einen Tisch",
      "b) Einen Herd und einen Kühlschrank",
      "c) Ein Bett und einen Kleiderschrank",
      "d) Eine Dusche, eine Badewanne und ein Waschbecken",
    ],
  },
  {
    number: 6,
    title: "Passage 6: Der Balkon",
    question: "Wie ist der Balkon beschrieben?",
    options: ["a) Groß und leer", "b) Klein und schön", "c) Groß und schön", "d) Klein und leer"],
    extraQuestion: {
      stem: "7. Was gibt es auf dem Balkon?",
      options: [
        "a) Ein großes Bett",
        "b) Einen Herd und einen Kühlschrank",
        "c) Blumen und einen kleinen Tisch mit zwei Stühlen",
        "d) Eine Dusche und eine Badewanne",
      ],
    },
  },
];

const A1Day10ObjectsColorsPossessiveArticlesWorkbookPage = () => {
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
      <div style={card}>
        <AppBackButton label="Back to Course Book" fallbackPath="/campus/course" />

        <h1 style={{ ...styles.title, marginBottom: 0 }}>
          A1 · Day 10 Workbook · Objects, Colors and Possessive Articles
        </h1>
        <p style={{ ...styles.subtitle, margin: 0 }}>Chapter 6 · Tutor-marked assignment</p>
        <p style={{ margin: 0, lineHeight: 1.7 }}>
          Complete the assignment, then open Submit to send your final answers for {assignmentKey}.
        </p>

        <div
          role="tablist"
          aria-label="A1 Day 10 workbook tabs"
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
          <div style={card}>
            <img
              src="https://images.unsplash.com/photo-1493666438817-866a91353ca9?auto=format&fit=crop&w=1600&q=80"
              alt="Cozy apartment living room with furniture and decor"
              loading="lazy"
              style={{
                width: "100%",
                borderRadius: 10,
                maxHeight: 280,
                objectFit: "cover",
              }}
            />

            <h2 style={sectionTitle}>Teil 1: Reading / Writing</h2>
            <p style={{ margin: 0, lineHeight: 1.7 }}>
              <strong>Assignment: Die Wohnung (The Apartment)</strong>
            </p>
            <p style={{ margin: 0, lineHeight: 1.7 }}>
              Instructions: Complete the following exercises about an apartment. This assignment will help you practice
              your vocabulary and sentence structures in German, focusing on rooms and furniture in an apartment.
            </p>
            <p style={{ margin: 0, lineHeight: 1.7 }}>
              <strong>Part 1: Vocabulary Matching</strong>
            </p>
            <p style={{ margin: 0, lineHeight: 1.7 }}>
              Match the German words with their English meanings. Write the words and not just a, b, c, d. Also include
              both the German word and the English meaning when submitting.
            </p>

            <ol style={{ margin: 0, paddingLeft: 20, lineHeight: 1.7 }}>
              <li>das Wohnzimmer</li>
              <li>die Küche</li>
              <li>das Schlafzimmer</li>
              <li>das Badezimmer</li>
              <li>der Balkon</li>
              <li>der Flur</li>
              <li>das Bett</li>
              <li>der Tisch</li>
              <li>der Stuhl</li>
              <li>der Schrank</li>
            </ol>

            <ul style={{ margin: 0, paddingLeft: 20, lineHeight: 1.7 }}>
              <li>a. the kitchen</li>
              <li>b. the bedroom</li>
              <li>c. the balcony</li>
              <li>d. the bathroom</li>
              <li>e. the hallway</li>
              <li>f. the living room</li>
              <li>g. the chair</li>
              <li>h. the table</li>
              <li>i. the bed</li>
              <li>j. the wardrobe</li>
            </ul>
          </div>

          <div style={card}>
            <h2 style={sectionTitle}>Teil 2: Questions</h2>
            <p style={{ margin: 0, lineHeight: 1.7 }}>
              <strong>Passage: Die Wohnung</strong>
            </p>
            <p style={{ margin: 0, lineHeight: 1.7 }}>
              Meine Wohnung ist sehr gemütlich. Sie hat vier Zimmer: ein Wohnzimmer, eine Küche, ein Schlafzimmer und
              ein Badezimmer. Im Wohnzimmer steht ein großes Sofa und ein Fernseher. In der Küche gibt es einen Herd,
              einen Kühlschrank und einen Tisch mit vier Stühlen. Das Schlafzimmer hat ein großes Bett und einen
              Kleiderschrank. Im Badezimmer gibt es eine Dusche, eine Badewanne und ein Waschbecken. Der Balkon ist klein,
              aber schön. Ich habe dort Blumen und einen kleinen Tisch mit zwei Stühlen.
            </p>
            <p style={{ margin: 0, lineHeight: 1.7 }}>
              <strong>Multiple-Choice Questions</strong>
            </p>

            {teil2Questions.map((question) => (
              <div key={question.stem} style={questionBlock}>
                <p style={{ margin: 0, fontWeight: 700 }}>{question.stem}</p>
                {question.options.map((option) => (
                  <p key={option} style={optionLine}>
                    {option}
                  </p>
                ))}
              </div>
            ))}
          </div>

          <div style={card}>
            <h2 style={sectionTitle}>Teil 3: Hören</h2>
            <p style={{ margin: 0, lineHeight: 1.7 }}>
              Listen to the following short passages about an apartment. After listening, answer the multiple-choice
              questions that follow.
            </p>
            <div style={{ display: "grid", gap: 8 }}>
              <div
                style={{
                  position: "relative",
                  width: "100%",
                  paddingTop: "56.25%",
                  borderRadius: 12,
                  overflow: "hidden",
                  background: "#111827",
                }}
              >
                <iframe
                  src={horenVideoEmbedUrl}
                  title="Teil 3 Hören: Die Wohnung"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  style={{
                    position: "absolute",
                    inset: 0,
                    width: "100%",
                    height: "100%",
                    border: 0,
                  }}
                />
              </div>
              <a
                href={horenVideoUrl}
                target="_blank"
                rel="noreferrer"
                style={{ ...styles.secondaryButton, textDecoration: "none", width: "fit-content" }}
              >
                Open Hören video on YouTube
              </a>
            </div>

            {horenAssignments.map((assignment) => (
              <div key={assignment.number} style={questionBlock}>
                <p style={{ margin: 0, fontWeight: 700 }}>{assignment.title}</p>
                <p style={{ margin: 0, fontWeight: 700 }}>
                  {assignment.number}. {assignment.question}
                </p>
                {assignment.options.map((option) => (
                  <p key={option} style={optionLine}>
                    {option}
                  </p>
                ))}
                {assignment.extraQuestion && (
                  <>
                    <p style={{ margin: 0, fontWeight: 700 }}>{assignment.extraQuestion.stem}</p>
                    {assignment.extraQuestion.options.map((option) => (
                      <p key={option} style={optionLine}>
                        {option}
                      </p>
                    ))}
                  </>
                )}
              </div>
            ))}
          </div>

          <div
            style={{
              ...card,
              border: "1px solid #c7d2fe",
              background: "#eef2ff",
            }}
          >
            <h2 style={sectionTitle}>Final Submission</h2>
            <p style={{ margin: 0, lineHeight: 1.7 }}>
              Submit all your answers after you complete the workbook tasks.
            </p>
            <button type="button" style={{ ...styles.button, width: "fit-content" }} onClick={() => openTab("submit")}>
              Open Submit Tab
            </button>
          </div>
        </>
      ) : (
        <section style={{ ...card, border: "1px solid #bfdbfe" }} aria-label="Submit A1 Day 10 workbook answers">
          <div>
            <p
              style={{
                color: "#1d4ed8",
                fontSize: 13,
                fontWeight: 900,
                letterSpacing: ".04em",
                margin: 0,
                textTransform: "uppercase",
              }}
            >
              Tutor-marked assignment
            </p>
            <h2 style={{ margin: "4px 0" }}>Submit A1 · Day 10 · Chapter 6</h2>
            <p style={{ color: "#475569", margin: 0 }}>
              This submission box is locked to {assignmentKey}, so your work is saved under the correct assignment.
            </p>
          </div>
          <div className="a1-day10-objects-colors-workbook-submit-tab">
            <style>{`.a1-day10-objects-colors-workbook-submit-tab > div > section:first-child { display: none !important; }
              .a1-day10-objects-colors-workbook-submit-tab select { display: none !important; }`}</style>
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

export default A1Day10ObjectsColorsPossessiveArticlesWorkbookPage;
