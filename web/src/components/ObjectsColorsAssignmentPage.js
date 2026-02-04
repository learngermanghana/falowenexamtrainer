import React from "react";
import { useNavigate } from "react-router-dom";
import { styles } from "../styles";
import AssignmentForm from "./AssignmentForm";

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

const LinkList = ({ items }) => (
  <ul style={{ margin: 0, paddingLeft: 20, display: "grid", gap: 8 }}>
    {items.map((item) => (
      <li key={item.label}>
        <a href={item.href} target="_blank" rel="noreferrer">
          {item.label}
        </a>
      </li>
    ))}
  </ul>
);

const QUESTIONS = [
  {
    id: "match-1",
    prompt: "Teil 1: Ordne zu. 1) das Wohnzimmer = ?",
  },
  {
    id: "match-2",
    prompt: "Teil 1: Ordne zu. 2) die Küche = ?",
  },
  {
    id: "match-3",
    prompt: "Teil 1: Ordne zu. 3) das Schlafzimmer = ?",
  },
  {
    id: "match-4",
    prompt: "Teil 1: Ordne zu. 4) das Badezimmer = ?",
  },
  {
    id: "match-5",
    prompt: "Teil 1: Ordne zu. 5) der Balkon = ?",
  },
  {
    id: "match-6",
    prompt: "Teil 1: Ordne zu. 6) der Flur = ?",
  },
  {
    id: "match-7",
    prompt: "Teil 1: Ordne zu. 7) das Bett = ?",
  },
  {
    id: "match-8",
    prompt: "Teil 1: Ordne zu. 8) der Tisch = ?",
  },
  {
    id: "match-9",
    prompt: "Teil 1: Ordne zu. 9) der Stuhl = ?",
  },
  {
    id: "match-10",
    prompt: "Teil 1: Ordne zu. 10) der Schrank = ?",
  },
  {
    id: "mcq-1",
    prompt: "Teil 2: Wie viele Zimmer hat die Wohnung? (a/b/c/d)",
  },
  {
    id: "mcq-2",
    prompt: "Teil 2: Was steht im Wohnzimmer? (a/b/c/d)",
  },
  {
    id: "mcq-3",
    prompt: "Teil 2: Was gibt es in der Küche? (a/b/c/d)",
  },
  {
    id: "mcq-4",
    prompt: "Teil 2: Welches Möbelstück steht im Schlafzimmer? (a/b/c/d)",
  },
  {
    id: "mcq-5",
    prompt: "Teil 2: Was gibt es im Badezimmer? (a/b/c/d)",
  },
  {
    id: "mcq-6",
    prompt: "Teil 2: Wie ist der Balkon beschrieben? (a/b/c/d)",
  },
  {
    id: "mcq-7",
    prompt: "Teil 2: Was gibt es auf dem Balkon? (a/b/c/d)",
  },
  {
    id: "listen-1",
    prompt: "Teil 3 (Audio 1): Wie viele Zimmer hat die Wohnung? (a/b/c/d)",
  },
  {
    id: "listen-2",
    prompt: "Teil 3 (Audio 2): Was steht im Wohnzimmer? (a/b/c/d)",
  },
  {
    id: "listen-3",
    prompt: "Teil 3 (Audio 3): Was gibt es in der Küche? (a/b/c/d)",
  },
  {
    id: "listen-4",
    prompt: "Teil 3 (Audio 4): Welches Möbelstück steht im Schlafzimmer? (a/b/c/d)",
  },
  {
    id: "listen-5",
    prompt: "Teil 3 (Audio 5): Was gibt es im Badezimmer? (a/b/c/d)",
  },
  {
    id: "listen-6",
    prompt: "Teil 3 (Audio 6): Wie ist der Balkon beschrieben? (a/b/c/d)",
  },
  {
    id: "listen-7",
    prompt: "Teil 3 (Audio 6): Was gibt es auf dem Balkon? (a/b/c/d)",
  },
];

const ObjectsColorsAssignmentPage = () => {
  const navigate = useNavigate();

  return (
    <div style={{ ...styles.container, display: "grid", gap: 16 }}>
      <div style={{ ...styles.card, display: "grid", gap: 8 }}>
        <button style={{ ...styles.secondaryButton, width: "fit-content" }} onClick={() => navigate("/campus/course")}>
          Back to Course
        </button>
        <h1 style={{ ...styles.title, marginBottom: 0 }}>Day 10 Assignment: Objects and Colors</h1>
        <p style={{ ...styles.subtitle, margin: 0 }}>Chapter 6 — Die Wohnung (The Apartment)</p>
      </div>

      <Section title="Teil 1: Vocabulary matching">
        <p style={{ margin: 0 }}>Match the German words with their English meanings.</p>
        <div style={{ display: "grid", gap: 6 }}>
          <strong>German</strong>
          <BulletList
            items={[
              "1. das Wohnzimmer",
              "2. die Küche",
              "3. das Schlafzimmer",
              "4. das Badezimmer",
              "5. der Balkon",
              "6. der Flur",
              "7. das Bett",
              "8. der Tisch",
              "9. der Stuhl",
              "10. der Schrank",
            ]}
          />
          <strong>English</strong>
          <BulletList
            items={[
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
            ]}
          />
        </div>
      </Section>

      <Section title="Teil 2: Passage — Die Wohnung">
        <p style={{ margin: 0 }}>
          Meine Wohnung ist sehr gemütlich. Sie hat vier Zimmer: ein Wohnzimmer, eine Küche, ein Schlafzimmer und ein
          Badezimmer. Im Wohnzimmer steht ein großes Sofa und ein Fernseher. In der Küche gibt es einen Herd, einen
          Kühlschrank und einen Tisch mit vier Stühlen. Das Schlafzimmer hat ein großes Bett und einen Kleiderschrank. Im
          Badezimmer gibt es eine Dusche, eine Badewanne und ein Waschbecken. Der Balkon ist klein, aber schön. Ich habe
          dort Blumen und einen kleinen Tisch mit zwei Stühlen.
        </p>
        <div style={{ marginTop: 12 }}>
          <strong>Multiple-choice questions</strong>
          <BulletList
            items={[
              "1. Wie viele Zimmer hat die Wohnung? (a) Drei (b) Vier (c) Fünf (d) Sechs",
              "2. Was steht im Wohnzimmer? (a) Ein Sofa und ein Fernseher (b) Ein Bett und ein Kleiderschrank (c) Ein Tisch und vier Stühle (d) Eine Dusche und eine Badewanne",
              "3. Was gibt es in der Küche? (a) Ein Sofa und einen Fernseher (b) Einen Herd, einen Kühlschrank und einen Tisch mit vier Stühlen (c) Ein Bett und einen Kleiderschrank (d) Eine Dusche und eine Badewanne",
              "4. Welches Möbelstück steht im Schlafzimmer? (a) Ein Sofa (b) Ein Herd (c) Ein großes Bett (d) Ein Fernseher",
              "5. Was gibt es im Badezimmer? (a) Ein Sofa und einen Tisch (b) Einen Herd und einen Kühlschrank (c) Ein Bett und einen Kleiderschrank (d) Eine Dusche, eine Badewanne und ein Waschbecken",
              "6. Wie ist der Balkon beschrieben? (a) Groß und leer (b) Klein und schön (c) Groß und schön (d) Klein und leer",
              "7. Was gibt es auf dem Balkon? (a) Ein großes Bett (b) Einen Herd und einen Kühlschrank (c) Blumen und einen kleinen Tisch mit zwei Stühlen (d) Eine Dusche und eine Badewanne",
            ]}
          />
        </div>
      </Section>

      <Section title="Teil 3: Listening comprehension">
        <p style={{ margin: 0 }}>
          Listen to the short passages, then answer the multiple-choice questions (a/b/c/d) in the form below.
        </p>
        <LinkList
          items={[
            {
              label: "Audio 1: Die Wohnung",
              href: "https://drive.google.com/file/d/1Z4ueUp1mbCFxilsra3gpievmSyGisUOk/view?usp=sharing",
            },
            {
              label: "Audio 2: Das Wohnzimmer",
              href: "https://drive.google.com/file/d/1wpsf_9wk4YAyiR7F36R4oa5yM9OkdR2_/view?usp=sharing",
            },
            {
              label: "Audio 3: Die Küche",
              href: "https://drive.google.com/file/d/106A8H3P2_mWDOdaNZ4WXWZX9jTM4yEQF/view?usp=sharing",
            },
            {
              label: "Audio 4: Das Schlafzimmer",
              href: "https://drive.google.com/file/d/1u_A6UFrWHSJ__itLh1uUzo8nswQt1rPu/view?usp=sharing",
            },
            {
              label: "Audio 5: Das Badezimmer",
              href: "https://drive.google.com/file/d/1T0ofiHOcO3XHmOSNB4lc6hBuAtQwDKyJ/view?usp=sharing",
            },
            {
              label: "Audio 6: Der Balkon",
              href: "https://drive.google.com/file/d/1JHygUNvs1UdtRSxAoLr85qHu_UqpRPoF/view?usp=sharing",
            },
          ]}
        />
      </Section>

      <AssignmentForm
        title="Assignment Form"
        intro="Answer the questions above in German. Copy your answers and paste them into the assignment submission page."
        questions={QUESTIONS}
        onOpenSubmission={() => navigate("/campus/submit")}
      />

      <Section title="Vocabulary list: Die Wohnung">
        <BulletList
          items={[
            "das Wohnzimmer — the living room",
            "die Küche — the kitchen",
            "das Schlafzimmer — the bedroom",
            "das Badezimmer — the bathroom",
            "der Balkon — the balcony",
            "der Flur — the hallway",
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
            "groß — big",
            "klein — small",
            "gemütlich — cozy",
            "hell — bright",
            "dunkel — dark",
            "modern — modern",
            "alt — old",
            "praktisch — practical",
            "schön — beautiful",
            "die Pflanze — the plant",
            "die Blume — the flower",
            "der Teppich — the carpet",
            "der Schreibtisch — the desk",
          ]}
        />
      </Section>

      <Section title="Schreiben & Sprechen: Farben + Lieblingsfarbe">
        <BulletList
          items={[
            "Rot — red",
            "Blau — blue",
            "Gelb — yellow",
            "Grün — green",
            "Schwarz — black",
            "Weiß — white",
            "Grau — gray",
            "Braun — brown",
            "Orange — orange",
            "Lila — purple",
            "Rosa — pink",
          ]}
        />
        <div style={{ display: "grid", gap: 6 }}>
          <strong>Key phrase</strong>
          <p style={{ margin: 0 }}>Meine Lieblingsfarbe ist ...</p>
          <BulletList
            items={[
              "Meine Lieblingsfarbe ist rot.",
              "Meine Lieblingsfarbe ist blau.",
              "Was ist deine Lieblingsfarbe?",
              "Schreibe zwei Sätze: Meine Lieblingsfarbe ist ____.",
            ]}
          />
        </div>
      </Section>

      <Section title="Objects in the house and room">
        <BulletList
          items={[
            "das Haus — house",
            "die Wohnung — apartment",
            "das Zimmer — room",
            "die Küche — kitchen",
            "das Wohnzimmer — living room",
            "das Schlafzimmer — bedroom",
            "das Badezimmer — bathroom",
            "der Flur — hallway",
            "der Keller — basement",
            "der Garten — garden",
            "das Bett — bed",
            "der Tisch — table",
            "der Stuhl — chair",
            "die Lampe — lamp",
            "der Schrank — cupboard/closet",
            "die Tür — door",
            "das Fenster — window",
            "der Teppich — carpet/rug",
            "das Sofa — sofa",
            "der Fernseher — television",
            "das Bild — picture",
            "die Uhr — clock",
            "das Regal — shelf",
            "die Kommode — dresser",
            "der Spiegel — mirror",
          ]}
        />
        <div style={{ display: "grid", gap: 6 }}>
          <strong>Speaking structure</strong>
          <p style={{ margin: 0 }}>In meinem Zimmer habe ich ...</p>
          <BulletList
            items={[
              "In meinem Zimmer habe ich ein Bett.",
              "In meinem Zimmer habe ich einen Tisch.",
              "In meinem Zimmer habe ich einen Stuhl.",
            ]}
          />
        </div>
      </Section>
    </div>
  );
};

export default ObjectsColorsAssignmentPage;
