import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { styles } from "../styles";
import AssignmentForm from "./AssignmentForm";
import WorkbookSection from "./WorkbookSection";

const Section = ({ title, children }) => (
  <section style={{ ...styles.card, display: "grid", gap: 12 }}>
    <h2 style={{ margin: 0 }}>{title}</h2>
    {children}
  </section>
);

const AUDIO_TRACKS = [
  {
    id: "horen-1",
    title: "Hören 1 — Apartment description",
    url: "https://drive.google.com/file/d/COMING_SOON_AUDIO_1/view?usp=sharing",
    status: "coming soon",
  },
  {
    id: "horen-2",
    title: "Hören 2 — Apartment details",
    url: "https://drive.google.com/file/d/COMING_SOON_AUDIO_2/view?usp=sharing",
    status: "coming soon",
  },
];

const VOCABULARY = [
  { german: "das Wohnzimmer", english: "living room" },
  { german: "das Schlafzimmer", english: "bedroom" },
  { german: "die Küche", english: "kitchen" },
  { german: "das Badezimmer", english: "bathroom" },
  { german: "der Balkon", english: "balcony" },
  { german: "der Flur", english: "hallway" },
  { german: "der Tisch", english: "table" },
  { german: "der Stuhl", english: "chair" },
  { german: "das Sofa", english: "sofa" },
  { german: "das Bett", english: "bed" },
  { german: "der Schrank", english: "wardrobe" },
  { german: "das Regal", english: "shelf" },
  { german: "der Teppich", english: "carpet" },
  { german: "die Lampe", english: "lamp" },
  { german: "der Spiegel", english: "mirror" },
];

const READING_CHECKS = [
  {
    id: "reading-1",
    prompt: "Wie viele Zimmer hat die Wohnung?",
    options: [
      { value: "a", label: "Ein Wohnzimmer, eine Küche, ein Schlafzimmer und ein Badezimmer" },
      { value: "b", label: "Nur Wohnzimmer und Schlafzimmer" },
      { value: "c", label: "Drei Schlafzimmer und zwei Badezimmer" },
      { value: "d", label: "Ein Studio ohne Küche" },
    ],
    answer: "a",
  },
  {
    id: "reading-2",
    prompt: "Was steht im Wohnzimmer?",
    options: [
      { value: "a", label: "Ein Bett und ein Kleiderschrank" },
      { value: "b", label: "Ein Sofa, ein Tisch und zwei Stühle" },
      { value: "c", label: "Nur ein großer Teppich" },
      { value: "d", label: "Ein Kühlschrank und Regale" },
    ],
    answer: "b",
  },
  {
    id: "reading-3",
    prompt: "Warum ist das Schlafzimmer ruhig?",
    options: [
      { value: "a", label: "Es hat keine Fenster" },
      { value: "b", label: "Es liegt weit weg vom Flur" },
      { value: "c", label: "Es wird im Text als ruhig beschrieben" },
      { value: "d", label: "Weil dort keine Möbel stehen" },
    ],
    answer: "c",
  },
];

const QUESTIONS = [
  {
    id: "q1",
    prompt: "Welche Zimmer hat die Wohnung von Lena?",
    type: "short",
  },
  {
    id: "q2",
    prompt: "Wo steht das Sofa?",
    type: "short",
  },
  {
    id: "q3",
    prompt: "Was macht Lena gern in der Küche?",
    type: "short",
  },
  {
    id: "q4",
    prompt: "Warum ist das Schlafzimmer ruhig?",
    type: "short",
  },
  {
    id: "q5",
    prompt: "Welche Möbel stehen im Wohnzimmer?",
    type: "short",
  },
  {
    id: "q6",
    prompt: "Nenne drei Gegenstände aus der Wortschatzliste.",
    type: "short",
  },
  {
    id: "q7",
    prompt: "Hören 1: Welche Farbe hat der Teppich?",
    type: "mcq",
    options: [
      { value: "a", label: "Rot" },
      { value: "b", label: "Blau" },
      { value: "c", label: "Grün" },
      { value: "d", label: "Grau" },
    ],
  },
  {
    id: "q8",
    prompt: "Hören 1: Wo ist der Schreibtisch?",
    type: "mcq",
    options: [
      { value: "a", label: "Neben dem Fenster" },
      { value: "b", label: "Im Schlafzimmer" },
      { value: "c", label: "Im Wohnzimmer" },
      { value: "d", label: "Auf dem Balkon" },
    ],
  },
  {
    id: "q9",
    prompt: "Hören 2: Was hängt an der Wand?",
    type: "mcq",
    options: [
      { value: "a", label: "Ein Spiegel" },
      { value: "b", label: "Ein Regal" },
      { value: "c", label: "Ein Bild" },
      { value: "d", label: "Eine Uhr" },
    ],
  },
  {
    id: "q10",
    prompt: "Hören 2: Was steht auf dem Balkon?",
    type: "mcq",
    options: [
      { value: "a", label: "Zwei Pflanzen" },
      { value: "b", label: "Ein Sofa" },
      { value: "c", label: "Ein Tisch" },
      { value: "d", label: "Ein Bett" },
    ],
  },
];

const Day10ApartmentAssignmentPage = () => {
  const navigate = useNavigate();
  const [vocabSelections, setVocabSelections] = useState(() => VOCABULARY.map(() => ""));
  const [showVocabResults, setShowVocabResults] = useState(false);
  const [showReadingAnswers, setShowReadingAnswers] = useState(false);

  const vocabOptions = useMemo(
    () => Array.from(new Set(VOCABULARY.map((item) => item.english))).sort(),
    []
  );

  const handleVocabChange = (index) => (event) => {
    const value = event.target.value;
    setVocabSelections((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  };

  const resetVocab = () => {
    setVocabSelections(VOCABULARY.map(() => ""));
    setShowVocabResults(false);
  };

  return (
    <div style={{ ...styles.container, display: "grid", gap: 16 }}>
      <div style={{ ...styles.card, display: "grid", gap: 8 }}>
        <button style={{ ...styles.secondaryButton, width: "fit-content" }} onClick={() => navigate("/campus/course")}>
          Back to Course
        </button>
        <h1 style={{ ...styles.title, marginBottom: 0 }}>Day 10 – Die Wohnung (The Apartment) Assignment</h1>
        <p style={{ ...styles.subtitle, margin: 0 }}>Teil 1–3 — Vocabulary, reading comprehension, and listening practice.</p>
        <p style={{ margin: 0 }}>
          Complete the following exercises about an apartment. This assignment will help you practice your vocabulary and
          sentence structures in German, focusing on rooms and furniture in an apartment.
        </p>
      </div>

      <WorkbookSection
        title="Teil 1: Vocabulary Matching"
        intro="Match the German words with their English meanings using the dropdowns. Click “Check answers” for quick feedback."
        entries={[
          {
            id: "day10-vocab-list",
            label: "Wortschatz: Zimmer und Möbel",
            text:
              "das Wohnzimmer — living room\n" +
              "das Schlafzimmer — bedroom\n" +
              "die Küche — kitchen\n" +
              "das Badezimmer — bathroom\n" +
              "der Balkon — balcony\n" +
              "der Flur — hallway\n" +
              "der Tisch — table\n" +
              "der Stuhl — chair\n" +
              "das Sofa — sofa\n" +
              "das Bett — bed\n" +
              "der Schrank — wardrobe\n" +
              "das Regal — shelf\n" +
              "der Teppich — carpet\n" +
              "die Lampe — lamp\n" +
              "der Spiegel — mirror",
            rows: 10,
          },
        ]}
      />
      <Section title="Interactive vocabulary matching">
        <div style={{ display: "grid", gap: 10 }}>
          {VOCABULARY.map((item, index) => {
            const isCorrect = vocabSelections[index] === item.english;
            return (
              <div
                key={item.german}
                style={{
                  display: "grid",
                  gap: 8,
                  gridTemplateColumns: "minmax(140px, 1fr) minmax(200px, 2fr) minmax(160px, 1fr)",
                  alignItems: "center",
                }}
              >
                <strong>{item.german}</strong>
                <select
                  value={vocabSelections[index]}
                  onChange={handleVocabChange(index)}
                  style={{ ...styles.input, padding: "8px 10px" }}
                >
                  <option value="">Select English meaning</option>
                  {vocabOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                {showVocabResults ? (
                  <span style={{ fontSize: 13, color: isCorrect ? "#059669" : "#dc2626" }}>
                    {isCorrect ? "Correct ✅" : `Correct answer: ${item.english}`}
                  </span>
                ) : (
                  <span style={{ fontSize: 13, color: "#6b7280" }}>Pick an answer</span>
                )}
              </div>
            );
          })}
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button
            type="button"
            style={styles.primaryButton}
            onClick={() => setShowVocabResults(true)}
          >
            Check answers
          </button>
          <button type="button" style={styles.secondaryButton} onClick={resetVocab}>
            Clear matches
          </button>
        </div>
      </Section>

      <WorkbookSection
        title="Teil 2: Passage — Die Wohnung"
        intro="Read the passage and answer the multiple-choice comprehension checks below."
        entries={[
          {
            id: "day10-reading",
            label: "Text",
            text:
              "Lena wohnt in einer kleinen Wohnung in der Stadt. Die Wohnung hat ein Wohnzimmer, eine Küche, ein Schlafzimmer und ein Badezimmer. " +
              "Im Wohnzimmer stehen ein Sofa, ein Tisch und zwei Stühle. Neben dem Sofa steht eine Lampe und vor dem Fenster liegt ein großer Teppich. " +
              "In der Küche kocht Lena gern. Dort gibt es einen Kühlschrank und viele Regale. Das Schlafzimmer ist ruhig und hat ein großes Bett und einen Schrank. " +
              "Auf dem Balkon stehen zwei Pflanzen und ein kleiner Stuhl. Lena mag ihre Wohnung sehr.",
            rows: 8,
          },
        ]}
      />
      <Section title="Reading comprehension checks">
        <div style={{ display: "grid", gap: 12 }}>
          {READING_CHECKS.map((question) => (
            <div key={question.id} style={{ display: "grid", gap: 6 }}>
              <p style={{ margin: 0, fontWeight: 600 }}>{question.prompt}</p>
              <div style={{ display: "grid", gap: 6 }}>
                {question.options.map((option) => (
                  <div key={option.value} style={{ fontSize: 14 }}>
                    {option.value}. {option.label}
                  </div>
                ))}
              </div>
              {showReadingAnswers ? (
                <span style={{ fontSize: 13, color: "#059669" }}>
                  Answer: {question.answer}
                </span>
              ) : null}
            </div>
          ))}
        </div>
        <button
          type="button"
          style={styles.secondaryButton}
          onClick={() => setShowReadingAnswers((prev) => !prev)}
        >
          {showReadingAnswers ? "Hide answers" : "Reveal answers"}
        </button>
      </Section>

      <Section title="Teil 3: Listening Comprehension — Die Wohnung">
        <p style={{ margin: 0 }}>
          Instructions: Listen to the following short passages about an apartment. After listening, answer the
          multiple-choice questions that follow. Each question has four options (a, b, c, and d). Select the correct
          answer for each question, then record your answers in the assignment form below.
        </p>
        <div style={{ display: "grid", gap: 10 }}>
          {AUDIO_TRACKS.map((track) => (
            <div
              key={track.id}
              style={{ padding: 12, borderRadius: 12, border: "1px solid #e2e8f0", background: "#f8fafc" }}
            >
              <p style={{ margin: "0 0 6px", fontWeight: 600 }}>{track.title}</p>
              <p style={{ margin: "0 0 6px", fontSize: 13, color: "#6b7280" }}>
                {track.status === "coming soon"
                  ? "Audio coming soon. The Drive link will open once the file is available."
                  : "Use the embedded player or the Drive link below."}
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center" }}>
                {track.status !== "coming soon" ? (
                  <audio controls style={{ width: "100%" }}>
                    <source src={track.url} />
                    Your browser does not support the audio element.
                  </audio>
                ) : (
                  <div style={{ fontSize: 13, color: "#6b7280" }}>Audio player coming soon.</div>
                )}
                <a
                  href={track.url}
                  target="_blank"
                  rel="noreferrer"
                  style={{ ...styles.secondaryButton, width: "fit-content", textDecoration: "none" }}
                >
                  Open {track.title} (Drive)
                </a>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <AssignmentForm
        title="Assignment Form"
        intro="Answer questions 1–6 in short-answer format. For questions 7–10, select the multiple-choice option."
        tips="Tip: Write full German sentences for the short-answer section (e.g., “Das Sofa steht neben dem Fenster.”)."
        questions={QUESTIONS}
        storageKey="day10-apartment-assignment-answers"
        checklist={[
          "Answer questions 1–6 in German sentences.",
          "Choose A–D for questions 7–10.",
          "Copy your responses before opening the submission page.",
        ]}
        onOpenSubmission={() => navigate("/campus/submit")}
      />
    </div>
  );
};

export default Day10ApartmentAssignmentPage;
