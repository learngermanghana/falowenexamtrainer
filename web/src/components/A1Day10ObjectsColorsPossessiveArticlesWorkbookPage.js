import React, { useState } from "react";
import AppBackButton from "./navigation/AppBackButton";
import { STANDARD_WORKBOOK_TABS, WorkbookTabNav } from "./StandardWorkbookComponents";

import { styles } from "../styles";

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

const vocabularyPairs = [
  "das Wohnzimmer",
  "die Küche",
  "das Schlafzimmer",
  "das Badezimmer",
  "der Balkon",
  "der Flur",
  "das Bett",
  "der Tisch",
  "der Stuhl",
  "der Schrank",
];

const englishMeanings = [
  "a. the kitchen",
  "b. the bedroom",
  "c. the balcony",
  "d. the bathroom",
  "e. the hallway",
  "f. the living room",
  "g. the chair",
  "h. the table",
  "i. the bed",
  "j. the wardrobe",
];

const SubmitPanel = () => (
  <div
    style={{
      ...card,
      border: "2px solid #2563eb",
      background: "linear-gradient(135deg, #eff6ff 0%, #ffffff 75%)",
      boxShadow: "0 16px 30px rgba(37, 99, 235, 0.14)",
    }}
  >
    <span style={{ ...styles.badge, width: "fit-content", background: "#dbeafe", color: "#1e3a8a" }}>
      Submit tab
    </span>
    <h2 style={{ ...sectionTitle, fontSize: "1.35rem" }}>Submit your A1 Day 10 workbook</h2>
    <p style={{ margin: 0, lineHeight: 1.7 }}>
      After completing Teil 1, Teil 2, Teil 3 and Teil 4, send your final answers through the campus submission area.
      Do not submit inside the lesson text.
    </p>
    <a
      href="/campus/course?submitWork=1"
      target="_blank"
      rel="noreferrer"
      style={{ ...styles.button, textDecoration: "none", width: "fit-content" }}
    >
      Open Submit Tab
    </a>
    <p style={{ margin: 0, lineHeight: 1.7, color: "#1e40af", fontWeight: 700 }}>
      Choose A1 Day 10 / Objects, Colors and Possessive Articles, then paste your final answers clearly by Teil.
    </p>
  </div>
);

const A1Day10ObjectsColorsPossessiveArticlesWorkbookPage = () => {
  const [activeTab, setActiveTab] = useState("sprechen");

  const renderQuestions = (questions) =>
    questions.map((question) => (
      <div key={question.stem} style={questionBlock}>
        <p style={{ margin: 0, fontWeight: 700 }}>{question.stem}</p>
        {question.options.map((option) => (
          <p key={option} style={optionLine}>
            {option}
          </p>
        ))}
      </div>
    ));

  const renderActiveTab = () => {
    switch (activeTab) {
      case "sprechen":
        return (
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

            <h2 style={sectionTitle}>Teil 1: Objects, Rooms and Vocabulary</h2>
            <p style={{ margin: 0, lineHeight: 1.7 }}>
              <strong>Assignment: Die Wohnung (The Apartment)</strong>
            </p>
            <p style={{ margin: 0, lineHeight: 1.7 }}>
              Complete the vocabulary matching exercise. Write the German word and the English meaning when you submit.
            </p>

            <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
              <div style={questionBlock}>
                <p style={{ margin: 0, fontWeight: 700 }}>German words</p>
                <ol style={{ margin: 0, paddingLeft: 20, lineHeight: 1.7 }}>
                  {vocabularyPairs.map((word) => (
                    <li key={word}>{word}</li>
                  ))}
                </ol>
              </div>

              <div style={questionBlock}>
                <p style={{ margin: 0, fontWeight: 700 }}>English meanings</p>
                <ul style={{ margin: 0, paddingLeft: 20, lineHeight: 1.7 }}>
                  {englishMeanings.map((meaning) => (
                    <li key={meaning}>{meaning}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        );

      case "schreiben":
        return (
          <div style={card}>
            <h2 style={sectionTitle}>Teil 2: Schreiben mit mein / meine / dein / deine</h2>
            <p style={{ margin: 0, lineHeight: 1.7 }}>
              Write five short German sentences about things in an apartment. Use possessive articles and colours where possible.
            </p>
            <div style={questionBlock}>
              <p style={{ margin: 0, fontWeight: 700 }}>Example</p>
              <p style={{ margin: 0, lineHeight: 1.7 }}>Das ist mein Tisch. Mein Tisch ist braun.</p>
              <p style={{ margin: 0, lineHeight: 1.7 }}>Das ist meine Tasche. Meine Tasche ist rot.</p>
            </div>
            <div style={questionBlock}>
              <p style={{ margin: 0, fontWeight: 700 }}>Your task</p>
              <p style={{ margin: 0, lineHeight: 1.7 }}>
                Write sentences for: das Bett, der Tisch, der Stuhl, die Tasche, die Küche.
              </p>
            </div>
          </div>
        );

      case "lesen":
        return (
          <div style={card}>
            <h2 style={sectionTitle}>Teil 3: Lesen / Questions</h2>
            <p style={{ margin: 0, lineHeight: 1.7 }}>
              <strong>Passage: Die Wohnung</strong>
            </p>
            <p style={{ margin: 0, lineHeight: 1.7 }}>
              Meine Wohnung ist sehr gemütlich. Sie hat vier Zimmer: ein Wohnzimmer, eine Küche, ein Schlafzimmer und
              ein Badezimmer. Im Wohnzimmer steht ein großes Sofa und ein Fernseher. In der Küche gibt es einen Herd,
              einen Kühlschrank und einen Tisch mit vier Stühlen. Das Schlafzimmer hat ein großes Bett und einen
              Kleiderschrank. Im Badezimmer gibt es eine Dusche, eine Badewanne und ein Waschbecken. Der Balkon ist
              klein, aber schön. Ich habe dort Blumen und einen kleinen Tisch mit zwei Stühlen.
            </p>
            <p style={{ margin: 0, lineHeight: 1.7 }}>
              <strong>Multiple-choice questions</strong>
            </p>
            {renderQuestions(teil2Questions)}
          </div>
        );

      case "hoeren":
        return (
          <div style={card}>
            <h2 style={sectionTitle}>Teil 4: Hören</h2>
            <p style={{ margin: 0, lineHeight: 1.7 }}>
              Listen to the short passages about an apartment. After listening, answer the multiple-choice questions.
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
                  title="Teil 4 Hören: Die Wohnung"
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
        );

      case "references":
        return (
          <div style={card}>
            <h2 style={sectionTitle}>Reference: possessive articles</h2>
            <div style={questionBlock}>
              <p style={{ margin: 0, fontWeight: 700 }}>Simple A1 rule</p>
              <p style={{ margin: 0, lineHeight: 1.7 }}>
                Use <strong>mein / dein</strong> before der and das words. Use <strong>meine / deine</strong> before die
                words and plural words.
              </p>
            </div>
            <div style={questionBlock}>
              <p style={{ margin: 0, fontWeight: 700 }}>Examples</p>
              <p style={{ margin: 0, lineHeight: 1.7 }}>der Tisch → mein Tisch / dein Tisch</p>
              <p style={{ margin: 0, lineHeight: 1.7 }}>das Buch → mein Buch / dein Buch</p>
              <p style={{ margin: 0, lineHeight: 1.7 }}>die Tasche → meine Tasche / deine Tasche</p>
              <p style={{ margin: 0, lineHeight: 1.7 }}>die Bücher → meine Bücher / deine Bücher</p>
            </div>
          </div>
        );

      case "submit":
        return <SubmitPanel />;

      default:
        return null;
    }
  };

  return (
    <div style={{ ...styles.container, display: "grid", gap: 16 }}>
      <div style={card}>
        <AppBackButton label="Back to Course Book" fallbackPath="/campus/course" />

        <h1 style={{ ...styles.title, marginBottom: 0 }}>
          A1 · Day 10 Workbook · Objects, Colors and Possessive Articles
        </h1>
        <p style={{ ...styles.subtitle, margin: 0 }}>Chapter 6</p>
        <p style={{ margin: 0, lineHeight: 1.7 }}>
          Work through each tab, then use the <strong>Submit</strong> tab to send your final answers.
        </p>
      </div>

      <WorkbookTabNav
        activeTab={activeTab}
        onChange={setActiveTab}
        tabs={STANDARD_WORKBOOK_TABS}
        ariaLabel="A1 Day 10 workbook sections"
      />

      {renderActiveTab()}
    </div>
  );
};

export default A1Day10ObjectsColorsPossessiveArticlesWorkbookPage;
