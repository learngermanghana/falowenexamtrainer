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

const BulletList = ({ items }) => (
  <ul style={{ margin: 0, paddingLeft: 20, display: "grid", gap: 6 }}>
    {items.map((item) => (
      <li key={item}>{item}</li>
    ))}
  </ul>
);

const QUESTIONS = [
  {
    id: "v1",
    prompt: "Part 1: Match 1-10 with a-j for the vocabulary matching.",
  },
  {
    id: "mc1",
    prompt: "Part 2 Q1: Wie viele Zimmer hat die Wohnung?",
  },
  {
    id: "mc2",
    prompt: "Part 2 Q2: Was steht im Wohnzimmer?",
  },
  {
    id: "mc3",
    prompt: "Part 2 Q3: Was gibt es in der Küche?",
  },
  {
    id: "mc4",
    prompt: "Part 2 Q4: Welches Möbelstück steht im Schlafzimmer?",
  },
  {
    id: "mc5",
    prompt: "Part 2 Q5: Was gibt es im Badezimmer?",
  },
  {
    id: "mc6",
    prompt: "Part 2 Q6: Wie ist der Balkon beschrieben?",
  },
  {
    id: "mc7",
    prompt: "Part 2 Q7: Was gibt es auf dem Balkon?",
  },
  {
    id: "l1",
    prompt: "Listening Q1: Wie viele Zimmer hat die Wohnung?",
  },
  {
    id: "l2",
    prompt: "Listening Q2: Was steht im Wohnzimmer?",
  },
  {
    id: "l3",
    prompt: "Listening Q3: Was gibt es in der Küche?",
  },
  {
    id: "l4",
    prompt: "Listening Q4: Welches Möbelstück steht im Schlafzimmer?",
  },
  {
    id: "l5",
    prompt: "Listening Q5: Was gibt es im Badezimmer?",
  },
  {
    id: "l6",
    prompt: "Listening Q6: Wie ist der Balkon beschrieben?",
  },
  {
    id: "l7",
    prompt: "Listening Q7: Was gibt es auf dem Balkon?",
  },
];

const PART2_QUESTIONS = [
  {
    id: "part2-q1",
    question: "Wie viele Zimmer hat die Wohnung?",
    options: ["a) Drei", "b) Vier", "c) Fünf", "d) Sechs"],
  },
  {
    id: "part2-q2",
    question: "Was steht im Wohnzimmer?",
    options: [
      "a) Ein Sofa und ein Fernseher",
      "b) Ein Bett und ein Kleiderschrank",
      "c) Ein Tisch und vier Stühle",
      "d) Eine Dusche und eine Badewanne",
    ],
  },
  {
    id: "part2-q3",
    question: "Was gibt es in der Küche?",
    options: [
      "a) Ein Sofa und einen Fernseher",
      "b) Einen Herd, einen Kühlschrank und einen Tisch mit vier Stühlen",
      "c) Ein Bett und einen Kleiderschrank",
      "d) Eine Dusche und eine Badewanne",
    ],
  },
  {
    id: "part2-q4",
    question: "Welches Möbelstück steht im Schlafzimmer?",
    options: ["a) Ein Sofa", "b) Ein Herd", "c) Ein großes Bett", "d) Ein Fernseher"],
  },
  {
    id: "part2-q5",
    question: "Was gibt es im Badezimmer?",
    options: [
      "a) Ein Sofa und einen Tisch",
      "b) Einen Herd und einen Kühlschrank",
      "c) Ein Bett und einen Kleiderschrank",
      "d) Eine Dusche, eine Badewanne und ein Waschbecken",
    ],
  },
  {
    id: "part2-q6",
    question: "Wie ist der Balkon beschrieben?",
    options: ["a) Groß und leer", "b) Klein und schön", "c) Groß und schön", "d) Klein und leer"],
  },
  {
    id: "part2-q7",
    question: "Was gibt es auf dem Balkon?",
    options: [
      "a) Ein großes Bett",
      "b) Einen Herd und einen Kühlschrank",
      "c) Blumen und einen kleinen Tisch mit zwei Stühlen",
      "d) Eine Dusche und eine Badewanne",
    ],
  },
];

const LISTENING_QUESTIONS = [
  {
    id: "listening-q1",
    audio: "https://drive.google.com/file/d/1Z4ueUp1mbCFxilsra3gpievmSyGisUOk/view?usp=sharing",
    question: "Wie viele Zimmer hat die Wohnung?",
    options: ["a) Drei", "b) Vier", "c) Fünf", "d) Sechs"],
  },
  {
    id: "listening-q2",
    audio: "https://drive.google.com/file/d/1wpsf_9wk4YAyiR7F36R4oa5yM9OkdR2_/view?usp=sharing",
    question: "Was steht im Wohnzimmer?",
    options: [
      "a) Ein Bett und ein Schrank",
      "b) Ein Sofa und ein Fernseher",
      "c) Ein Tisch und vier Stühle",
      "d) Eine Dusche und eine Badewanne",
    ],
  },
  {
    id: "listening-q3",
    audio: "https://drive.google.com/file/d/106A8H3P2_mWDOdaNZ4WXWZX9jTM4yEQF/view?usp=sharing",
    question: "Was gibt es in der Küche?",
    options: [
      "a) Ein Sofa und einen Fernseher",
      "b) Einen Herd, einen Kühlschrank und einen Tisch mit vier Stühlen",
      "c) Ein Bett und einen Kleiderschrank",
      "d) Eine Dusche und eine Badewanne",
    ],
  },
  {
    id: "listening-q4",
    audio: "https://drive.google.com/file/d/1u_A6UFrWHSJ__itLh1uUzo8nswQt1rPu/view?usp=sharing",
    question: "Welches Möbelstück steht im Schlafzimmer?",
    options: ["a) Ein Sofa", "b) Ein Herd", "c) Ein großes Bett", "d) Ein Fernseher"],
  },
  {
    id: "listening-q5",
    audio: "https://drive.google.com/file/d/1T0ofiHOcO3XHmOSNB4lc6hBuAtQwDKyJ/view?usp=sharing",
    question: "Was gibt es im Badezimmer?",
    options: [
      "a) Ein Sofa und einen Tisch",
      "b) Einen Herd und einen Kühlschrank",
      "c) Ein Bett und einen Kleiderschrank",
      "d) Eine Dusche, eine Badewanne und ein Waschbecken",
    ],
  },
  {
    id: "listening-q6",
    audio: "https://drive.google.com/file/d/1JHygUNvs1UdtRSxAoLr85qHu_UqpRPoF/view?usp=sharing",
    question: "Wie ist der Balkon beschrieben?",
    options: ["a) Groß und leer", "b) Klein und schön", "c) Groß und schön", "d) Klein und leer"],
  },
  {
    id: "listening-q7",
    audio: "https://drive.google.com/file/d/1JHygUNvs1UdtRSxAoLr85qHu_UqpRPoF/view?usp=sharing",
    question: "Was gibt es auf dem Balkon?",
    options: [
      "a) Ein großes Bett",
      "b) Einen Herd und einen Kühlschrank",
      "c) Blumen und einen kleinen Tisch mit zwei Stühlen",
      "d) Eine Dusche und eine Badewanne",
    ],
  },
];

const QuestionAnswerList = ({ title, questions, showAudio }) => (
  <Section title={title}>
    <div style={{ display: "grid", gap: 12 }}>
      {questions.map((question, index) => (
        <div
          key={question.id}
          style={{
            display: "grid",
            gap: 8,
            padding: 12,
            borderRadius: 10,
            border: "1px solid #e5e7eb",
            background: "#f9fafb",
          }}
        >
          <strong>
            {index + 1}. {question.question}
          </strong>
          {showAudio && question.audio ? (
            <p style={{ margin: 0, color: "#4b5563", fontSize: 13 }}>Audio: {question.audio}</p>
          ) : null}
          <ul style={{ margin: 0, paddingLeft: 20, display: "grid", gap: 4 }}>
            {question.options.map((option) => (
              <li key={option}>{option}</li>
            ))}
          </ul>
          <input
            type="text"
            placeholder="Type your answer here (e.g., b)"
            aria-label={`Answer for ${question.question}`}
            style={styles.input}
          />
        </div>
      ))}
    </div>
  </Section>
);

const Day10ApartmentAssignmentPage = () => {
  const navigate = useNavigate();

  return (
    <div style={{ ...styles.container, display: "grid", gap: 16 }}>
      <div style={{ ...styles.card, display: "grid", gap: 8 }}>
        <button style={{ ...styles.secondaryButton, width: "fit-content" }} onClick={() => navigate("/campus/course")}>
          Back to Course
        </button>
        <h1 style={{ ...styles.title, marginBottom: 0 }}>Teil 1 - Assignment: Die Wohnung (The Apartment)</h1>
        <p style={{ ...styles.subtitle, margin: 0 }}>
          Complete the exercises about an apartment to practice German vocabulary and sentence structures.
        </p>
      </div>

      <WorkbookSection
        title="Teil 1: Vocabulary Matching"
        intro="Instructions: Match the German words with their English meanings."
        entries={[
          {
            id: "day10-vocab-matching",
            text:
              "1. das Wohnzimmer\n2. die Küche\n3. das Schlafzimmer\n4. das Badezimmer\n5. der Balkon\n6. der Flur\n7. das Bett\n8. der Tisch\n9. der Stuhl\n10. der Schrank\n\n" +
              "a. the kitchen\nb. the bedroom\nc. the balcony\nd. the bathroom\ne. the hallway\nf. the living room\ng. the chair\nh. the table\ni. the bed\nj. the wardrobe",
            rows: 12,
          },
        ]}
      />

      <WorkbookSection
        title="Teil 2 : Passage: Die Wohnung"
        intro="Read the passage and answer the multiple-choice questions."
        entries={[
          {
            id: "day10-passage",
            label: "Passage",
            text:
              "Meine Wohnung ist sehr gemütlich. Sie hat vier Zimmer: ein Wohnzimmer, eine Küche, ein Schlafzimmer und ein Badezimmer. " +
              "Im Wohnzimmer steht ein großes Sofa und ein Fernseher. In der Küche gibt es einen Herd, einen Kühlschrank und einen Tisch mit vier Stühlen. " +
              "Das Schlafzimmer hat ein großes Bett und einen Kleiderschrank. Im Badezimmer gibt es eine Dusche, eine Badewanne und ein Waschbecken. " +
              "Der Balkon ist klein, aber schön. Ich habe dort Blumen und einen kleinen Tisch mit zwei Stühlen.",
            rows: 8,
          },
          {
            id: "day10-questions",
            label: "Multiple-Choice Questions",
            text:
              "1. Wie viele Zimmer hat die Wohnung?\n" +
              "a) Drei\nb) Vier\nc) Fünf\nd) Sechs\n\n" +
              "2. Was steht im Wohnzimmer?\n" +
              "a) Ein Sofa und ein Fernseher\nb) Ein Bett und ein Kleiderschrank\nc) Ein Tisch und vier Stühle\nd) Eine Dusche und eine Badewanne\n\n" +
              "3. Was gibt es in der Küche?\n" +
              "a) Ein Sofa und einen Fernseher\nb) Einen Herd, einen Kühlschrank und einen Tisch mit vier Stühlen\nc) Ein Bett und einen Kleiderschrank\nd) Eine Dusche und eine Badewanne\n\n" +
              "4. Welches Möbelstück steht im Schlafzimmer?\n" +
              "a) Ein Sofa\nb) Ein Herd\nc) Ein großes Bett\nd) Ein Fernseher\n\n" +
              "5. Was gibt es im Badezimmer?\n" +
              "a) Ein Sofa und einen Tisch\nb) Einen Herd und einen Kühlschrank\nc) Ein Bett und einen Kleiderschrank\nd) Eine Dusche, eine Badewanne und ein Waschbecken\n\n" +
              "6. Wie ist der Balkon beschrieben?\n" +
              "a) Groß und leer\nb) Klein und schön\nc) Groß und schön\nd) Klein und leer\n\n" +
              "7. Was gibt es auf dem Balkon?\n" +
              "a) Ein großes Bett\nb) Einen Herd und einen Kühlschrank\nc) Blumen und einen kleinen Tisch mit zwei Stühlen\nd) Eine Dusche und eine Badewanne",
            rows: 18,
          },
        ]}
      />

      <QuestionAnswerList title="Teil 2: Answer Sheet" questions={PART2_QUESTIONS} />

      <Section title="Teil 3 - Listening Comprehension Exercise: Die Wohnung">
        <p style={{ margin: 0 }}>
          Instructions: Listen to the following short passages about an apartment. After listening, answer the
          multiple-choice questions that follow.
        </p>
        <p style={{ margin: 0 }}>
          Each question has four options: a, b, c, and d. Select the correct answer for each question.
        </p>
        <BulletList
          items={[
            "Passage 1: Die Wohnung — https://drive.google.com/file/d/1Z4ueUp1mbCFxilsra3gpievmSyGisUOk/view?usp=sharing",
            "Question 1: Wie viele Zimmer hat die Wohnung? (a) Drei (b) Vier (c) Fünf (d) Sechs",
            "Passage 2: Das Wohnzimmer — https://drive.google.com/file/d/1wpsf_9wk4YAyiR7F36R4oa5yM9OkdR2_/view?usp=sharing",
            "Question 2: Was steht im Wohnzimmer? (a) Ein Bett und ein Schrank (b) Ein Sofa und ein Fernseher (c) Ein Tisch und vier Stühle (d) Eine Dusche und eine Badewanne",
            "Passage 3: Die Küche — https://drive.google.com/file/d/106A8H3P2_mWDOdaNZ4WXWZX9jTM4yEQF/view?usp=sharing",
            "Question 3: Was gibt es in der Küche? (a) Ein Sofa und einen Fernseher (b) Einen Herd, einen Kühlschrank und einen Tisch mit vier Stühlen (c) Ein Bett und einen Kleiderschrank (d) Eine Dusche und eine Badewanne",
            "Passage 4: Das Schlafzimmer — https://drive.google.com/file/d/1u_A6UFrWHSJ__itLh1uUzo8nswQt1rPu/view?usp=sharing",
            "Question 4: Welches Möbelstück steht im Schlafzimmer? (a) Ein Sofa (b) Ein Herd (c) Ein großes Bett (d) Ein Fernseher",
            "Passage 5: Das Badezimmer — https://drive.google.com/file/d/1T0ofiHOcO3XHmOSNB4lc6hBuAtQwDKyJ/view?usp=sharing",
            "Question 5: Was gibt es im Badezimmer? (a) Ein Sofa und einen Tisch (b) Einen Herd und einen Kühlschrank (c) Ein Bett und einen Kleiderschrank (d) Eine Dusche, eine Badewanne und ein Waschbecken",
            "Passage 6: Der Balkon — https://drive.google.com/file/d/1JHygUNvs1UdtRSxAoLr85qHu_UqpRPoF/view?usp=sharing",
            "Question 6: Wie ist der Balkon beschrieben? (a) Groß und leer (b) Klein und schön (c) Groß und schön (d) Klein und leer",
            "Question 7: Was gibt es auf dem Balkon? (a) Ein großes Bett (b) Einen Herd und einen Kühlschrank (c) Blumen und einen kleinen Tisch mit zwei Stühlen (d) Eine Dusche und eine Badewanne",
          ]}
        />
      </Section>

      <QuestionAnswerList
        title="Teil 3: Listening Answer Sheet"
        questions={LISTENING_QUESTIONS}
        showAudio
      />

      <AssignmentForm
        title="Assignment Form"
        intro="Complete the vocabulary matching, reading, and listening questions. Copy your answers and submit them."
        questions={QUESTIONS}
        onOpenSubmission={() => navigate("/campus/submit")}
      />

      <Section title="Vocabulary list: Die Wohnung (The Apartment)">
        <h3 style={{ margin: "6px 0 0" }}>Rooms and Areas</h3>
        <BulletList
          items={[
            "das Wohnzimmer — the living room",
            "die Küche — the kitchen",
            "das Schlafzimmer — the bedroom",
            "das Badezimmer — the bathroom",
            "der Balkon — the balcony",
            "der Flur — the hallway",
          ]}
        />
        <h3 style={{ margin: "12px 0 0" }}>Furniture and Objects</h3>
        <BulletList
          items={[
            "das Sofa — the sofa",
            "der Fernseher — the television",
            "das Bücherregal — the bookshelf",
            "der Couchtisch — the coffee table",
            "der Herd — the stove",
            "der Kühlschrank — the refrigerator",
            "der Tisch — the table",
            "der Stuhl — the chair",
            "das Bett — the bed",
            "der Kleiderschrank — the wardrobe",
            "der Nachttisch — the nightstand",
            "die Dusche — the shower",
            "die Badewanne — the bathtub",
            "das Waschbecken — the sink",
          ]}
        />
        <h3 style={{ margin: "12px 0 0" }}>Adjectives and Descriptions</h3>
        <BulletList
          items={[
            "groß — big",
            "klein — small",
            "gemütlich — cozy",
            "hell — bright",
            "dunkel — dark",
            "modern — modern",
            "alt — old",
            "praktisch — practical",
            "schön — beautiful",
          ]}
        />
        <h3 style={{ margin: "12px 0 0" }}>Miscellaneous</h3>
        <BulletList items={["die Pflanze — the plant", "die Blume — the flower", "der Teppich — the carpet", "der Schreibtisch — the desk"]} />
      </Section>
    </div>
  );
};

export default Day10ApartmentAssignmentPage;
