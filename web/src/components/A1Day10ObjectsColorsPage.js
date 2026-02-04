import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { styles } from "../styles";

const Section = ({ title, children }) => (
  <section style={{ ...styles.card, display: "grid", gap: 12 }}>
    <h2 style={{ margin: 0 }}>{title}</h2>
    {children}
  </section>
);

const OrderedOptions = ({ items }) => (
  <ol style={{ margin: 0, paddingLeft: 20, display: "grid", gap: 10 }}>
    {items.map((item) => (
      <li key={item.question} style={{ display: "grid", gap: 6 }}>
        <span>{item.question}</span>
        <ul style={{ margin: 0, paddingLeft: 18, display: "grid", gap: 4 }}>
          {item.options.map((option) => (
            <li key={option}>{option}</li>
          ))}
        </ul>
      </li>
    ))}
  </ol>
);

const A1Day10ObjectsColorsPage = () => {
  const navigate = useNavigate();
  const [submission, setSubmission] = useState("");

  const vocabulary = useMemo(
    () => [
      { german: "das Wohnzimmer", english: "the living room" },
      { german: "die Küche", english: "the kitchen" },
      { german: "das Schlafzimmer", english: "the bedroom" },
      { german: "das Badezimmer", english: "the bathroom" },
      { german: "der Balkon", english: "the balcony" },
      { german: "der Flur", english: "the hallway" },
      { german: "das Bett", english: "the bed" },
      { german: "der Tisch", english: "the table" },
      { german: "der Stuhl", english: "the chair" },
      { german: "der Schrank", english: "the wardrobe" },
    ],
    []
  );

  const passageQuestions = useMemo(
    () => [
      {
        question: "1. Wie viele Zimmer hat die Wohnung?",
        options: ["a) Drei", "b) Vier", "c) Fünf", "d) Sechs"],
      },
      {
        question: "2. Was steht im Wohnzimmer?",
        options: [
          "a) Ein Sofa und ein Fernseher",
          "b) Ein Bett und ein Kleiderschrank",
          "c) Ein Tisch und vier Stühle",
          "d) Eine Dusche und eine Badewanne",
        ],
      },
      {
        question: "3. Was gibt es in der Küche?",
        options: [
          "a) Ein Sofa und einen Fernseher",
          "b) Einen Herd, einen Kühlschrank und einen Tisch mit vier Stühlen",
          "c) Ein Bett und einen Kleiderschrank",
          "d) Eine Dusche und eine Badewanne",
        ],
      },
      {
        question: "4. Welches Möbelstück steht im Schlafzimmer?",
        options: ["a) Ein Sofa", "b) Ein Herd", "c) Ein großes Bett", "d) Ein Fernseher"],
      },
      {
        question: "5. Was gibt es im Badezimmer?",
        options: [
          "a) Ein Sofa und einen Tisch",
          "b) Einen Herd und einen Kühlschrank",
          "c) Ein Bett und einen Kleiderschrank",
          "d) Eine Dusche, eine Badewanne und ein Waschbecken",
        ],
      },
      {
        question: "6. Wie ist der Balkon beschrieben?",
        options: ["a) Groß und leer", "b) Klein und schön", "c) Groß und schön", "d) Klein und leer"],
      },
      {
        question: "7. Was gibt es auf dem Balkon?",
        options: [
          "a) Ein großes Bett",
          "b) Einen Herd und einen Kühlschrank",
          "c) Blumen und einen kleinen Tisch mit zwei Stühlen",
          "d) Eine Dusche und eine Badewanne",
        ],
      },
    ],
    []
  );

  const listeningQuestions = useMemo(
    () => [
      {
        title: "Passage 1: Die Wohnung",
        link: "https://drive.google.com/file/d/1Z4ueUp1mbCFxilsra3gpievmSyGisUOk/view?usp=sharing",
        question: "1. Wie viele Zimmer hat die Wohnung?",
        options: ["a) Drei", "b) Vier", "c) Fünf", "d) Sechs"],
      },
      {
        title: "Passage 2: Das Wohnzimmer",
        link: "https://drive.google.com/file/d/1wpsf_9wk4YAyiR7F36R4oa5yM9OkdR2_/view?usp=sharing",
        question: "2. Was steht im Wohnzimmer?",
        options: [
          "a) Ein Bett und ein Schrank",
          "b) Ein Sofa und ein Fernseher",
          "c) Ein Tisch und vier Stühle",
          "d) Eine Dusche und eine Badewanne",
        ],
      },
      {
        title: "Passage 3: Die Küche",
        link: "https://drive.google.com/file/d/106A8H3P2_mWDOdaNZ4WXWZX9jTM4yEQF/view?usp=sharing",
        question: "3. Was gibt es in der Küche?",
        options: [
          "a) Ein Sofa und einen Fernseher",
          "b) Einen Herd, einen Kühlschrank und einen Tisch mit vier Stühlen",
          "c) Ein Bett und einen Kleiderschrank",
          "d) Eine Dusche und eine Badewanne",
        ],
      },
      {
        title: "Passage 4: Das Schlafzimmer",
        link: "https://drive.google.com/file/d/1u_A6UFrWHSJ__itLh1uUzo8nswQt1rPu/view?usp=sharing",
        question: "4. Welches Möbelstück steht im Schlafzimmer?",
        options: ["a) Ein Sofa", "b) Ein Herd", "c) Ein großes Bett", "d) Ein Fernseher"],
      },
      {
        title: "Passage 5: Das Badezimmer",
        link: "https://drive.google.com/file/d/1T0ofiHOcO3XHmOSNB4lc6hBuAtQwDKyJ/view?usp=sharing",
        question: "5. Was gibt es im Badezimmer?",
        options: [
          "a) Ein Sofa und einen Tisch",
          "b) Einen Herd und einen Kühlschrank",
          "c) Ein Bett und einen Kleiderschrank",
          "d) Eine Dusche, eine Badewanne und ein Waschbecken",
        ],
      },
      {
        title: "Passage 6: Der Balkon",
        link: "https://drive.google.com/file/d/1JHygUNvs1UdtRSxAoLr85qHu_UqpRPoF/view?usp=sharing",
        question: "6. Wie ist der Balkon beschrieben?",
        options: ["a) Groß und leer", "b) Klein und schön", "c) Groß und schön", "d) Klein und leer"],
      },
      {
        title: "Passage 6: Der Balkon (continued)",
        link: "https://drive.google.com/file/d/1JHygUNvs1UdtRSxAoLr85qHu_UqpRPoF/view?usp=sharing",
        question: "7. Was gibt es auf dem Balkon?",
        options: [
          "a) Ein großes Bett",
          "b) Einen Herd und einen Kühlschrank",
          "c) Blumen und einen kleinen Tisch mit zwei Stühlen",
          "d) Eine Dusche und eine Badewanne",
        ],
      },
    ],
    []
  );

  const vocabularyList = useMemo(
    () => ({
      rooms: [
        "das Wohnzimmer - the living room",
        "die Küche - the kitchen",
        "das Schlafzimmer - the bedroom",
        "das Badezimmer - the bathroom",
        "der Balkon - the balcony",
        "der Flur - the hallway",
      ],
      furniture: [
        "das Sofa - the sofa",
        "der Fernseher - the television",
        "das Bücherregal - the bookshelf",
        "der Couchtisch - the coffee table",
        "der Herd - the stove",
        "der Kühlschrank - the refrigerator",
        "der Tisch - the table",
        "der Stuhl - the chair",
        "das Bett - the bed",
        "der Kleiderschrank - the wardrobe",
        "der Nachttisch - the nightstand",
        "die Dusche - the shower",
        "die Badewanne - the bathtub",
        "das Waschbecken - the sink",
      ],
      adjectives: [
        "groß - big",
        "klein - small",
        "gemütlich - cozy",
        "hell - bright",
        "dunkel - dark",
        "modern - modern",
        "alt - old",
        "praktisch - practical",
        "schön - beautiful",
      ],
      misc: ["die Pflanze - the plant", "die Blume - the flower", "der Teppich - the carpet", "der Schreibtisch - the desk"],
    }),
    []
  );

  return (
    <div style={{ ...styles.container, display: "grid", gap: 16 }}>
      <div style={{ ...styles.card, display: "grid", gap: 8 }}>
        <button style={{ ...styles.secondaryButton, width: "fit-content" }} onClick={() => navigate("/campus/course")}>
          Back to Course
        </button>
        <h1 style={{ ...styles.title, marginBottom: 0 }}>A1 Day 10 — Objects and Colors</h1>
        <p style={{ ...styles.subtitle, margin: 0 }}>Chapter 6 • Possessive determiners + assignment: Die Wohnung</p>
      </div>

      <Section title="Assignment Overview">
        <p style={{ margin: 0 }}>
          <strong>Topic:</strong> Objects and Colors
        </p>
        <p style={{ margin: 0 }}>
          <strong>Goal:</strong> Understand possessive determiners and use them with nouns.
        </p>
        <p style={{ margin: 0 }}>
          <strong>Assignment:</strong> Teil 1 (Vocabulary Matching), Teil 2 (Passage + MCQ), Teil 3 (Listening
          Comprehension).
        </p>
      </Section>

      <Section title="Teil 1 — Vocabulary Matching">
        <p style={{ margin: 0 }}>
          Match the German words with their English meanings. Write the correct letter for each word.
        </p>
        <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
          <ol style={{ margin: 0, paddingLeft: 20, display: "grid", gap: 6 }}>
            {vocabulary.map((item) => (
              <li key={item.german}>{item.german}</li>
            ))}
          </ol>
          <ol style={{ margin: 0, paddingLeft: 20, display: "grid", gap: 6 }} type="a">
            {[
              "the hallway",
              "the bedroom",
              "the balcony",
              "the living room",
              "the wardrobe",
              "the kitchen",
              "the chair",
              "the bathroom",
              "the table",
              "the bed",
            ].map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ol>
        </div>
      </Section>

      <Section title="Teil 2 — Passage: Die Wohnung">
        <p style={{ margin: 0 }}>
          Meine Wohnung ist sehr gemütlich. Sie hat vier Zimmer: ein Wohnzimmer, eine Küche, ein Schlafzimmer und ein
          Badezimmer. Im Wohnzimmer steht ein großes Sofa und ein Fernseher. In der Küche gibt es einen Herd, einen
          Kühlschrank und einen Tisch mit vier Stühlen. Das Schlafzimmer hat ein großes Bett und einen Kleiderschrank.
          Im Badezimmer gibt es eine Dusche, eine Badewanne und ein Waschbecken. Der Balkon ist klein, aber schön. Ich
          habe dort Blumen und einen kleinen Tisch mit zwei Stühlen.
        </p>
        <h3 style={{ margin: "8px 0 0" }}>Multiple-Choice Questions</h3>
        <OrderedOptions items={passageQuestions} />
      </Section>

      <Section title="Teil 3 — Listening Comprehension: Die Wohnung">
        <p style={{ margin: 0 }}>
          Listen to the passages and answer the questions. Each question has four options: a, b, c, d.
        </p>
        <div style={{ display: "grid", gap: 12 }}>
          {listeningQuestions.map((item) => (
            <div key={item.question} style={{ display: "grid", gap: 6, padding: 10, borderRadius: 10, background: "#f8fafc" }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 8, flexWrap: "wrap" }}>
                <strong>{item.title}</strong>
                <a href={item.link} target="_blank" rel="noreferrer" style={{ color: "#2563eb", fontWeight: 600 }}>
                  Open audio
                </a>
              </div>
              <div>{item.question}</div>
              <ul style={{ margin: 0, paddingLeft: 18, display: "grid", gap: 4 }}>
                {item.options.map((option) => (
                  <li key={option}>{option}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Vocabulary List: Die Wohnung (The Apartment)">
        <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
          <div style={{ display: "grid", gap: 6 }}>
            <strong>Rooms and Areas</strong>
            <ul style={{ margin: 0, paddingLeft: 18, display: "grid", gap: 4 }}>
              {vocabularyList.rooms.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div style={{ display: "grid", gap: 6 }}>
            <strong>Furniture and Objects</strong>
            <ul style={{ margin: 0, paddingLeft: 18, display: "grid", gap: 4 }}>
              {vocabularyList.furniture.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div style={{ display: "grid", gap: 6 }}>
            <strong>Adjectives and Descriptions</strong>
            <ul style={{ margin: 0, paddingLeft: 18, display: "grid", gap: 4 }}>
              {vocabularyList.adjectives.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div style={{ display: "grid", gap: 6 }}>
            <strong>Miscellaneous</strong>
            <ul style={{ margin: 0, paddingLeft: 18, display: "grid", gap: 4 }}>
              {vocabularyList.misc.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      <Section title="Submit your assignment">
        <p style={{ margin: 0 }}>
          Paste or type your answers below. When you are done, click <strong>Submit assignment</strong>.
        </p>
        <form
          action="https://www.falowen.app/campus/submit"
          method="GET"
          style={{ display: "grid", gap: 12 }}
        >
          <textarea
            style={{ ...styles.input, minHeight: 160, resize: "vertical", paddingTop: 12 }}
            placeholder="Type your answers here..."
            value={submission}
            name="assignment"
            onChange={(event) => setSubmission(event.target.value)}
          />
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center" }}>
            <button style={styles.primaryButton} type="submit" disabled={!submission.trim()}>
              Submit assignment
            </button>
          </div>
        </form>
      </Section>
    </div>
  );
};

export default A1Day10ObjectsColorsPage;
