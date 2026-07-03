import React from "react";
import AppBackButton from "./navigation/AppBackButton";
import { styles } from "../styles";

const card = { ...styles.card, display: "grid", gap: 12 };
const sectionTitle = { margin: 0, fontSize: "1.1rem" };
const listSpacing = { margin: 0, paddingLeft: 20, lineHeight: 1.7 };
const infoBox = {
  margin: 0,
  background: "#fef3c7",
  borderRadius: 8,
  padding: "10px 12px",
  fontWeight: 700,
  lineHeight: 1.6,
};
const mutedText = { margin: 0, color: "#4b5563", lineHeight: 1.6 };
const imageStyle = { width: "100%", borderRadius: 10, maxHeight: 260, objectFit: "cover" };

const priceQuestions = [
  "Wie viel kostet das Buch? – ______ kostet 20 Euro.",
  "Wie viel kostet die Lampe? – ______ kostet 15 Euro.",
  "Wie viel kostet das Auto? – ______ kostet 25.000 Euro.",
  "Wie viel kostet der Stuhl? – ______ kostet 50 Euro.",
];

const familyIdeas = [
  "Familienmitglieder: Wer gehört zu deiner Familie? (Mutter, Vater, Geschwister, etc.)",
  "Namen und Alter: Wie heißen deine Familienmitglieder und wie alt sind sie?",
  "Berufe: Was machen deine Familienmitglieder beruflich?",
  "Hobbys: Was sind die Hobbys deiner Familienmitglieder?",
  "Wohnort: Wo wohnt deine Familie?",
];

const hobbiesQuestions = [
  "Spielst du gern Fußball?",
  "Schwimmst du gern?",
  "Liest du gern?",
  "Malst du gern?",
  "Hörst du gern Musik?",
  "Kochst du gern?",
  "Reist du gern?",
  "Machst du gern Gartenarbeit?",
  "Fährst du gern Rad?",
  "Wanderst du gern?",
];

const hobbiesVocabulary = [
  "Reading – Lesen",
  "Swimming – Schwimmen",
  "Playing football – Fußballspielen",
  "Painting – Malen",
  "Listening to music – Musik hören",
  "Cooking – Kochen",
  "Traveling – Reisen",
  "Gardening – Gartenarbeit",
  "Cycling – Radfahren",
  "Hiking – Wandern",
];

const usefulVerbs = [
  "to read – lesen",
  "to swim – schwimmen",
  "to play – spielen",
  "to paint – malen",
  "to listen – hören",
  "to cook – kochen",
  "to travel – reisen",
  "to garden – gärtnern",
  "to cycle – radfahren",
  "to hike – wandern",
];

const usefulPhrases = [
  "My hobby is... – Mein Hobby ist...",
  "I like to... – Ich mag...",
  "I enjoy... – Ich genieße...",
  "In my free time, I... – In meiner Freizeit...",
  "I do this hobby... – Ich mache dieses Hobby...",
  "I often... – Ich mache oft...",
  "I sometimes... – Ich mache manchmal...",
  "My favorite moment was... – Mein Lieblingsmoment war...",
  "I do this hobby with... – Ich mache dieses Hobby mit...",
  "I do this hobby alone. – Ich mache dieses Hobby allein.",
];

const hobbyAdjectives = [
  "Relaxing – entspannend",
  "Fun – lustig",
  "Exciting – aufregend",
  "Interesting – interessant",
  "Challenging – herausfordernd",
  "Healthy – gesund",
  "Creative – kreativ",
  "Adventurous – abenteuerlich",
  "Energetic – energiegeladen",
  "Inspiring – inspirierend",
];

const exampleSentences = [
  "I like to read books. – Ich mag Bücher lesen.",
  "I swim twice a week. – Ich schwimme zweimal pro Woche.",
  "Playing football is fun. – Fußballspielen macht Spaß.",
  "She enjoys painting. – Sie genießt Malen.",
  "We listen to music every day. – Wir hören jeden Tag Musik.",
  "He likes to cook new recipes. – Er kocht gern neue Rezepte.",
  "Traveling is exciting. – Reisen ist aufregend.",
  "My mother loves gardening. – Meine Mutter liebt Gartenarbeit.",
  "Cycling keeps me healthy. – Radfahren hält mich gesund.",
  "Hiking is adventurous. – Wandern ist abenteuerlich.",
];

const SimpleList = ({ items }) => (
  <ol style={listSpacing}>{items.map((item) => <li key={item}>{item}</li>)}</ol>
);

const A1Chapter3AskingAboutPricesWorkbookPage = () => (
  <div style={{ ...styles.container, display: "grid", gap: 16 }}>
    <div style={card}>
      <AppBackButton label="Back to Course Book" fallbackPath="/campus/course" />
      <h1 style={{ ...styles.title, marginBottom: 0 }}>A1 · Chapter 3 Workbook · Asking About Prices</h1>
      <p style={{ ...styles.subtitle, margin: 0 }}>
        Complete the exercises in your notebook first, then submit your final work in the assignment submission tab.
      </p>
    </div>

    <div style={card}>
      <img src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1600&q=80" alt="Shopping and prices in a store" loading="lazy" style={imageStyle} />
      <h2 style={sectionTitle}>Teil 1: Preise und Kosten (Exercise 1)</h2>
      <p style={{ margin: 0, lineHeight: 1.7 }}><strong>Übung 3: Frage nach dem Preis.</strong> Übe Fragen nach dem Preis und antworte darauf.</p>
      <p style={{ margin: 0, lineHeight: 1.7 }}>Practice asking for the price and answering the questions by using the pronouns.</p>
      <p style={infoBox}>Use the pronouns to answer.</p>
      <SimpleList items={priceQuestions} />
      <p style={mutedText}>Write your answers in your notebook and submit them through the assignment submission tab.</p>
    </div>

    <div style={card}>
      <img src="https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=1600&q=80" alt="Family together at home" loading="lazy" style={imageStyle} />
      <h2 style={sectionTitle}>Teil 2: Writing About Family (Exercise 2)</h2>
      <p style={{ margin: 0, lineHeight: 1.7 }}><strong>Schreibe über deine Familie.</strong></p>
      <p style={{ margin: 0, lineHeight: 1.7 }}>Write a short text about your family. Use the following ideas:</p>
      <SimpleList items={familyIdeas} />
      <div style={{ border: "1px solid #e5e7eb", borderRadius: 10, padding: 12, background: "#fff" }}>
        <h3 style={{ ...sectionTitle, marginBottom: 8 }}>Example / Beispiel</h3>
        <p style={{ marginTop: 0, lineHeight: 1.7 }}>
          My family is small. My mother&apos;s name is Anna and she is 45 years old. She is a teacher. My father&apos;s name is Peter and he is 50 years old. He is an engineer. I have a sister. Her name is Lisa and she is 20 years old. She studies at the university. We live in a house in Berlin. My mother likes to read books, my father likes to play football, and my sister likes music.
        </p>
        <p style={{ margin: 0, lineHeight: 1.7 }}>
          Meine Familie ist klein. Meine Mutter heißt Anna und sie ist 45 Jahre alt. Sie ist Lehrerin. Mein Vater heißt Peter und er ist 50 Jahre alt. Er ist Ingenieur. Ich habe eine Schwester. Sie heißt Lisa und sie ist 20 Jahre alt. Sie studiert an der Universität. Wir wohnen in einem Haus in Berlin. Meine Mutter liest gern Bücher, mein Vater spielt gern Fußball und meine Schwester mag Musik.
        </p>
      </div>
      <p style={mutedText}>Write your own family text in your notebook and submit it in the assignment area.</p>
    </div>

    <div style={card}>
      <img src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1600&q=80" alt="People enjoying hobbies together" loading="lazy" style={imageStyle} />
      <h2 style={sectionTitle}>Teil 3: Hobbys (Exercise 3)</h2>
      <p style={{ margin: 0, lineHeight: 1.7 }}>
        Read each question carefully. For every question, write only <strong>one short answer</strong> using <strong>gern</strong> or <strong>mögen</strong>. Your answer must reflect what is true for you.
      </p>
      <p style={infoBox}>
        Important: The three sentences below are only sample alternatives. Choose one answer style. Do not write all three answers.
      </p>
      <div style={{ border: "1px solid #e5e7eb", borderRadius: 10, padding: 12, background: "#fff" }}>
        <h3 style={{ ...sectionTitle, marginBottom: 8 }}>How to answer / Beispiel</h3>
        <p style={{ marginTop: 0, lineHeight: 1.7 }}><strong>Question:</strong> Spielst du gern Fußball?</p>
        <p style={{ margin: 0, lineHeight: 1.7 }}><strong>Possible answer A:</strong> Ja, ich spiele gern Fußball.</p>
        <p style={{ margin: 0, lineHeight: 1.7 }}><strong>Possible answer B:</strong> Ja, ich mag Fußball.</p>
        <p style={{ margin: 0, lineHeight: 1.7 }}><strong>Possible answer C:</strong> Nein, ich spiele nicht gern Fußball.</p>
      </div>
      <SimpleList items={hobbiesQuestions} />
      <h3 style={sectionTitle}>Vocabulary List: Hobbies (Hobbys)</h3>
      <SimpleList items={hobbiesVocabulary} />
      <h3 style={sectionTitle}>Useful Verbs</h3>
      <SimpleList items={usefulVerbs} />
      <h3 style={sectionTitle}>Phrases</h3>
      <SimpleList items={usefulPhrases} />
      <h3 style={sectionTitle}>Adjectives</h3>
      <SimpleList items={hobbyAdjectives} />
      <h3 style={sectionTitle}>Example Sentences</h3>
      <SimpleList items={exampleSentences} />
      <p style={mutedText}>
        Answer every hobby question with one phrase only. Read the question, decide whether the activity reflects you, and write your personal answer before submitting it.
      </p>
    </div>
  </div>
);

export default A1Chapter3AskingAboutPricesWorkbookPage;
