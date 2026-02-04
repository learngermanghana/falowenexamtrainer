import React from "react";
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

const QUESTIONS = [
  {
    id: "q1",
    prompt: "Welche Zimmer hat die Wohnung von Lena?",
  },
  {
    id: "q2",
    prompt: "Wo steht das Sofa?",
  },
  {
    id: "q3",
    prompt: "Was macht Lena gern in der Küche?",
  },
  {
    id: "q4",
    prompt: "Warum ist das Schlafzimmer ruhig?",
  },
  {
    id: "q5",
    prompt: "Welche Möbel stehen im Wohnzimmer?",
  },
  {
    id: "q6",
    prompt: "Nenne drei Gegenstände aus der Wortschatzliste.",
  },
  {
    id: "q7",
    prompt: "Hören 1: Welche Farbe hat der Teppich?",
  },
  {
    id: "q8",
    prompt: "Hören 1: Wo ist der Schreibtisch?",
  },
  {
    id: "q9",
    prompt: "Hören 2: Was hängt an der Wand?",
  },
  {
    id: "q10",
    prompt: "Hören 2: Was steht auf dem Balkon?",
  },
];

const Day10ApartmentAssignmentPage = () => {
  const navigate = useNavigate();

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
        intro="Match the German words with their English meanings. Copy the list if you want to work offline."
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

      <WorkbookSection
        title="Teil 2: Passage — Die Wohnung"
        intro="Read the passage and answer the multiple-choice questions."
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

      <Section title="Teil 3: Listening Comprehension — Die Wohnung">
        <p style={{ margin: 0 }}>
          Instructions: Listen to the following short passages about an apartment. After listening, answer the
          multiple-choice questions that follow. Each question has four options (a, b, c, and d). Select the correct
          answer for each question, then record your answers in the assignment form below.
        </p>
      </Section>

      <AssignmentForm
        title="Assignment Form"
        intro="Answer the reading and listening questions in German. Copy your answers and paste them into the assignment submission page."
        questions={QUESTIONS}
        onOpenSubmission={() => navigate("/campus/submit")}
      />
    </div>
  );
};

export default Day10ApartmentAssignmentPage;
