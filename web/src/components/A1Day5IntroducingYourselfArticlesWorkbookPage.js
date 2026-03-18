import React from "react";
import { useNavigate } from "react-router-dom";
import { styles } from "../styles";

const cardStyle = {
  ...styles.card,
  display: "grid",
  gap: 12,
};

const questionBoxStyle = {
  border: "1px solid #e5e7eb",
  borderRadius: 10,
  padding: 12,
  display: "grid",
  gap: 8,
  background: "#fff",
};

const articleRows = [
  ["Der Tisch (table)", "Das Auto (car)", "Die Lampe (lamp)", "Der Apfel (apple)", "Das Buch (book)"],
  ["Die Katze (cat)", "Der Stuhl (chair)", "Das Haus (house)", "Die Blume (flower)", "Der Hund (dog)"],
];

const adjectivePairs = [
  "groß (big) – klein (small)",
  "alt (old) – neu (new)",
  "lang (long) – kurz (short)",
  "schön (beautiful) – hässlich (ugly)",
  "heiß (hot) – kalt (cold)",
  "schnell (fast) – langsam (slow)",
  "laut (loud) – leise (quiet)",
  "teuer (expensive) – billig (cheap)",
  "glücklich (happy) – traurig (sad)",
  "sauber (clean) – schmutzig (dirty)",
];

const personalInfoPrompts = [
  {
    label: "Familienname (Surname)",
    response: "Mein Familienname ist ...",
    help: "Write your surname (last name).",
  },
  {
    label: "Vorname (First Name)",
    response: "Mein Vorname ist ...",
    help: "Write your first name.",
  },
  {
    label: "Herkunft (Origin / Nationality)",
    response: "Ich komme aus ...",
    help: "Write your country (for example: Ghana or Nigeria).",
  },
  {
    label: "Geburtsort (Place of Birth)",
    response: "Ich bin in ... geboren.",
    help: "Write the city where you were born.",
  },
  {
    label: "Adresse (Address)",
    response: "Meine Adresse ist ...",
    help: "Write your street and house number.",
  },
  {
    label: "Postleitzahl (Postal Code)",
    response: "Meine Postleitzahl ist ...",
    help: "Write your postal or ZIP code.",
  },
  {
    label: "Familienstand (Marital Status)",
    response: "Ich bin ...",
    help: "Choose one: ledig, verheiratet, geschieden, or verwitwet.",
  },
  {
    label: "Kinder (Children)",
    response: "Ich habe ... Kinder. / Ich habe keine Kinder.",
    help: "Write the number of children you have, or use keine if you have none.",
  },
  {
    label: "Alter (Age)",
    response: "Ich bin ... Jahre alt.",
    help: "Write your age in a full sentence.",
  },
];

const wWordQuestions = [
  {
    stem: "1. ___ heißt du?",
    options: ["a) Wer", "b) Wie", "c) Was", "d) Wo", "e) Woher"],
    answer: "Wie heißt du?",
  },
  {
    stem: "2. ___ ist das Buch?",
    options: ["a) Wer", "b) Wie", "c) Was", "d) Wo", "e) Woher"],
    answer: "Wo ist das Buch?",
  },
  {
    stem: "3. ___ wohnt er?",
    options: ["a) Wer", "b) Wie", "c) Was", "d) Wo", "e) Woher"],
    answer: "Wo wohnt er?",
  },
  {
    stem: "4. ___ kommst du?",
    options: ["a) Wer", "b) Wie", "c) Was", "d) Wo", "e) Woher"],
    answer: "Woher kommst du?",
  },
  {
    stem: "5. ___ ist dein Lehrer?",
    options: ["a) Wer", "b) Wie", "c) Was", "d) Wo", "e) Woher"],
    answer: "Wer ist dein Lehrer?",
  },
  {
    stem: "6. ___ geht es dir?",
    options: ["a) Wer", "b) Wie", "c) Was", "d) Wo", "e) Woher"],
    answer: "Wie geht es dir?",
  },
  {
    stem: "7. ___ machst du am Wochenende?",
    options: ["a) Wer", "b) Wie", "c) Was", "d) Wo", "e) Woher"],
    answer: "Was machst du am Wochenende?",
  },
  {
    stem: "8. ___ ist das Auto?",
    options: ["a) Wer", "b) Wie", "c) Was", "d) Wo", "e) Woher"],
    answer: "Wo ist das Auto?",
  },
  {
    stem: "9. ___ bist du?",
    options: ["a) Wer", "b) Wie", "c) Was", "d) Wo", "e) Woher"],
    answer: "Wer bist du?",
  },
  {
    stem: "10. ___ kommt sie?",
    options: ["a) Wer", "b) Wie", "c) Was", "d) Wo", "e) Woher"],
    answer: "Woher kommt sie?",
  },
];

const A1Day5IntroducingYourselfArticlesWorkbookPage = () => {
  const navigate = useNavigate();

  return (
    <div style={{ ...styles.container, display: "grid", gap: 16 }}>
      <div style={cardStyle}>
        <button
          type="button"
          style={{ ...styles.secondaryButton, width: "fit-content" }}
          onClick={() => navigate("/campus/course")}
        >
          Back to Course
        </button>
        <h1 style={{ ...styles.title, marginBottom: 0 }}>
          A1 · Day 5 Workbook · Articles, Adjectives and Personal Information
        </h1>
        <p style={{ ...styles.subtitle, margin: 0 }}>Chapter 1.2 · Self-practice workbook</p>
        <p style={{ margin: 0, lineHeight: 1.7 }}>
          Use this in-app workbook to review German articles, adjective opposites, personal information, and
          W-questions.
        </p>
      </div>

      <section style={cardStyle}>
        <h2 style={{ margin: 0 }}>Teil 1 · Introduction to Articles</h2>
        <p style={{ margin: 0, lineHeight: 1.7 }}>
          In German, all nouns have a gender: masculine, feminine, or neuter. Each gender has its own definite article:
          <strong> der</strong>, <strong>die</strong>, or <strong>das</strong>.
        </p>
        <ol style={{ margin: 0, paddingLeft: 20, lineHeight: 1.7 }}>
          <li>Masculine (maskulin): der</li>
          <li>Feminine (feminin): die</li>
          <li>Neuter (neutral): das</li>
        </ol>
        <div style={questionBoxStyle}>
          <strong>Tip</strong>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            Many nouns that end with <em>-e</em> are feminine, for example <em>die Blume</em> and <em>die Lampe</em>.
            But the rule does not always work: <em>der Käse</em> and <em>der Kaffee</em> are masculine.
          </p>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            Best practice: always learn the noun together with its article, for example <em>der Tisch</em>,
            <em> die Lampe</em>, and <em>das Haus</em>.
          </p>
        </div>
        <p style={{ margin: 0, lineHeight: 1.7 }}>The article must match the gender of the noun.</p>
        {articleRows.map((row, index) => (
          <div key={`row-${index + 1}`} style={questionBoxStyle}>
            <strong>Row {index + 1}</strong>
            <ol style={{ margin: 0, paddingLeft: 20, lineHeight: 1.7 }}>
              {row.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ol>
          </div>
        ))}
      </section>

      <section style={cardStyle}>
        <h2 style={{ margin: 0 }}>Teil 2 · Adjectives and Their Opposites</h2>
        <p style={{ margin: 0, lineHeight: 1.7 }}>
          Adjectives are words that describe nouns. They give more information about a person, place, or thing.
        </p>
        <div style={questionBoxStyle}>
          <strong>Common adjectives</strong>
          <ol style={{ margin: 0, paddingLeft: 20, lineHeight: 1.7 }}>
            {adjectivePairs.map((pair) => (
              <li key={pair}>{pair}</li>
            ))}
          </ol>
        </div>
        <div style={questionBoxStyle}>
          <strong>Instructions</strong>
          <ol style={{ margin: 0, paddingLeft: 20, lineHeight: 1.7 }}>
            <li>Learn the adjectives and their opposites.</li>
            <li>Form a sentence using an article (der, die, das) with the adjective.</li>
          </ol>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            <em>Examples:</em> Der Baum ist groß. Das Haus ist klein.
          </p>
        </div>
      </section>

      <section style={cardStyle}>
        <h2 style={{ margin: 0 }}>Teil 3 · Personal Information Form</h2>
        <p style={{ margin: 0, lineHeight: 1.7 }}>
          Fill in the form using full sentences in German. Use the sentence starter, then complete it with your own
          information.
        </p>
        {personalInfoPrompts.map((item, index) => (
          <div key={item.label} style={questionBoxStyle}>
            <strong>
              {index + 1}. {item.label}
            </strong>
            <span>{item.response}</span>
            <span style={{ color: "#4b5563" }}>→ {item.help}</span>
          </div>
        ))}
      </section>

      <section style={cardStyle}>
        <h2 style={{ margin: 0 }}>Teil 4 · Introducing W-Words</h2>
        <div style={questionBoxStyle}>
          <strong>W-Words and their meanings</strong>
          <ol style={{ margin: 0, paddingLeft: 20, lineHeight: 1.7 }}>
            <li>Wer – Who (a person)</li>
            <li>Wie – How (manner or condition)</li>
            <li>Was – What (a thing)</li>
            <li>Wo – Where (a place)</li>
            <li>Woher – From where (origin)</li>
          </ol>
        </div>
        <h3 style={{ margin: 0 }}>Practice Exercise: Choose the correct W-word</h3>
        {wWordQuestions.map((question) => (
          <div key={question.stem} style={questionBoxStyle}>
            <strong>{question.stem}</strong>
            {question.options.map((option) => (
              <span key={option}>{option}</span>
            ))}
            <span style={{ color: "#166534", fontWeight: 600 }}>Answer: {question.answer}</span>
          </div>
        ))}
      </section>

      <div style={{ ...cardStyle, background: "#eff6ff", border: "1px solid #bfdbfe" }}>
        <h2 style={{ margin: 0 }}>Self-check</h2>
        <p style={{ margin: 0, lineHeight: 1.7 }}>
          This is a self-practice workbook for Day 5. Review your answers carefully after completing each part.
        </p>
      </div>
    </div>
  );
};

export default A1Day5IntroducingYourselfArticlesWorkbookPage;
