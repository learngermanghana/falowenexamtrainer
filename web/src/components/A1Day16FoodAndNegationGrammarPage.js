import React from "react";
import { useNavigate } from "react-router-dom";
import { styles } from "../styles";

const cardStyle = { ...styles.card, display: "grid", gap: 10 };

const negationRows = [
  {
    type: 'Verb',
    placement: 'After the verb or at the end',
    example: 'Er arbeitet heute nicht.',
  },
  {
    type: 'Adjective',
    placement: 'Directly before the adjective',
    example: 'Die Aufgabe ist nicht schwer.',
  },
  {
    type: 'Prepositional phrase',
    placement: 'Before the prepositional phrase',
    example: 'Wir fahren nicht nach Hause.',
  },
  {
    type: 'Adverb',
    placement: 'Directly before the adverb',
    example: 'Sie lernt nicht oft.',
  },
  {
    type: 'Noun with article',
    placement: 'Before the article and noun phrase',
    example: 'Das ist nicht der Lehrer.',
  },
];

const adjectiveComparisonRows = [
  ["schnell", "schneller", "am schnellsten"],
  ["groß", "größer", "am größten"],
  ["klein", "kleiner", "am kleinsten"],
  ["jung", "jünger", "am jüngsten"],
  ["alt", "älter", "am ältesten"],
  ["teuer", "teurer", "am teuersten"],
  ["schön", "schöner", "am schönsten"],
  ["stark", "stärker", "am stärksten"],
  ["warm", "wärmer", "am wärmsten"],
  ["klug", "klüger", "am klügsten"],
];

const answerKey = [
  "Nein, ich habe keinen Hund.",
  "Nein, ich esse heute keine Pizza.",
  "Nein, ich möchte keinen Kaffee oder Tee.",
  "Nein, ich gehe nicht oft ins Kino.",
  "Nein, das ist nicht mein neues Auto.",
  "Nein, ich habe kein Fahrrad.",
  "Nein, ich mag diesen Film nicht.",
  "Nein, ich lese das Buch von gestern nicht.",
  "Nein, ich habe kein Geld für die Reise.",
  "Nein, das Wetter ist heute nicht schön.",
];

const A1Day16FoodAndNegationGrammarPage = () => {
  const navigate = useNavigate();

  return (
    <main style={{ ...styles.container, display: "grid", gap: 16 }}>
      <header style={{ ...styles.card, display: "grid", gap: 12 }}>
        <button style={{ ...styles.secondaryButton, width: "fit-content" }} onClick={() => navigate("/campus/course")}>
          Back to Course
        </button>
        <h1 style={{ ...styles.title, marginBottom: 0 }}>Day 16: Food and Negation</h1>
        <p style={{ ...styles.subtitle, margin: 0 }}>Kapitel: 9_10 • German negation with <strong>nicht</strong>, <strong>kein</strong>, and <strong>nein</strong>.</p>
      </header>

      <section style={cardStyle}>
        <h2 style={{ margin: 0 }}>1) "Nicht" in German</h2>
        <p style={{ margin: 0 }}>
          Use <strong>nicht</strong> to negate verbs, adjectives, adverbs, prepositional phrases, and nouns with an article.
        </p>
        <ul style={{ margin: 0, paddingLeft: 20 }}>
          <li><strong>Verb:</strong> Ich esse nicht. • Ich rufe dich heute nicht an.</li>
          <li><strong>Adjective:</strong> Das Wetter ist nicht schön.</li>
          <li><strong>Prepositional phrase:</strong> Ich gehe nicht in die Stadt.</li>
          <li><strong>Adverb:</strong> Ich fahre nicht oft nach München.</li>
          <li><strong>Noun with article:</strong> Das ist nicht mein Buch.</li>
        </ul>

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={{ textAlign: "left", padding: 8, borderBottom: "1px solid #ddd" }}>Negated element</th>
                <th style={{ textAlign: "left", padding: 8, borderBottom: "1px solid #ddd" }}>Placement of nicht</th>
                <th style={{ textAlign: "left", padding: 8, borderBottom: "1px solid #ddd" }}>Example</th>
              </tr>
            </thead>
            <tbody>
              {negationRows.map((row) => (
                <tr key={row.type}>
                  <td style={{ padding: 8, borderBottom: "1px solid #eee" }}>{row.type}</td>
                  <td style={{ padding: 8, borderBottom: "1px solid #eee" }}>{row.placement}</td>
                  <td style={{ padding: 8, borderBottom: "1px solid #eee" }}>{row.example}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section style={cardStyle}>
        <h2 style={{ margin: 0 }}>2) "Kein" (no / none)</h2>
        <p style={{ margin: 0 }}>
          Use <strong>kein</strong> for nouns without an article or with an indefinite meaning.
        </p>
        <ul style={{ margin: 0, paddingLeft: 20 }}>
          <li>Nominative singular: Das ist kein Hund / keine Katze / kein Auto.</li>
          <li>Accusative singular: Ich habe keinen Hund. • Ich sehe keine Katze. • Ich habe kein Auto.</li>
          <li>Plural: Das sind keine Bücher. • Ich habe keine Freunde.</li>
        </ul>
      </section>

      <section style={cardStyle}>
        <h2 style={{ margin: 0 }}>3) "Nein" (standalone no)</h2>
        <p style={{ margin: 0 }}>
          Use <strong>nein</strong> as a direct answer: <strong>Kommt er heute? – Nein.</strong>
        </p>
        <p style={{ margin: 0 }}>
          You can also expand it: <strong>Nein, ich habe keine Zeit.</strong>
        </p>
      </section>

      <section style={cardStyle}>
        <h2 style={{ margin: 0 }}>4) Adjectives: Positive, Comparative, Superlative</h2>
        <p style={{ margin: 0 }}>
          Positive = base form, Comparative = usually <strong>-er</strong> + <strong>als</strong>, Superlative = <strong>am ... -sten</strong>.
        </p>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={{ textAlign: "left", padding: 8, borderBottom: "1px solid #ddd" }}>Positive</th>
                <th style={{ textAlign: "left", padding: 8, borderBottom: "1px solid #ddd" }}>Comparative</th>
                <th style={{ textAlign: "left", padding: 8, borderBottom: "1px solid #ddd" }}>Superlative</th>
              </tr>
            </thead>
            <tbody>
              {adjectiveComparisonRows.map(([positive, comparative, superlative]) => (
                <tr key={positive}>
                  <td style={{ padding: 8, borderBottom: "1px solid #eee" }}>{positive}</td>
                  <td style={{ padding: 8, borderBottom: "1px solid #eee" }}>{comparative}</td>
                  <td style={{ padding: 8, borderBottom: "1px solid #eee" }}>{superlative}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section style={cardStyle}>
        <h2 style={{ margin: 0 }}>5) Practice Answer Key</h2>
        <ol style={{ margin: 0, paddingLeft: 20, display: "grid", gap: 6 }}>
          {answerKey.map((answer) => (
            <li key={answer}>{answer}</li>
          ))}
        </ol>
      </section>
    </main>
  );
};

export default A1Day16FoodAndNegationGrammarPage;
