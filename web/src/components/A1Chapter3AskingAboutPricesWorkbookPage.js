import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { styles } from "../styles";

const tabs = [
  { key: "preise", label: "Teil 1 · Preise und Kosten" },
  { key: "familie", label: "Teil 2 · Writing About Family" },
  { key: "hobbys", label: "Teil 3 · Hobbys" },
];

const card = {
  ...styles.card,
  display: "grid",
  gap: 12,
};

const sectionTitle = {
  margin: 0,
  fontSize: "1.1rem",
};

const listSpacing = {
  margin: 0,
  paddingLeft: 20,
  lineHeight: 1.7,
};

function TabButton({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      style={{
        ...styles.secondaryButton,
        borderColor: active ? "#2563eb" : "#d1d5db",
        background: active ? "#eff6ff" : "#fff",
        color: active ? "#1d4ed8" : "#111827",
      }}
    >
      {children}
    </button>
  );
}

const pronounPrompts = [
  { question: "Wie viel kostet das Buch?", answer: "Es kostet 20 Euro." },
  { question: "Wie viel kostet die Lampe?", answer: "Sie kostet 15 Euro." },
  { question: "Wie viel kostet das Auto?", answer: "Es kostet 25.000 Euro." },
  { question: "Wie viel kostet der Stuhl?", answer: "Er kostet 50 Euro." },
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

const A1Chapter3AskingAboutPricesWorkbookPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("preise");

  const activeIndex = useMemo(() => tabs.findIndex((tab) => tab.key === activeTab), [activeTab]);

  return (
    <div style={{ ...styles.container, display: "grid", gap: 16 }}>
      <div style={card}>
        <button style={{ ...styles.secondaryButton, width: "fit-content" }} onClick={() => navigate("/campus/course")}>
          Back to Course
        </button>

        <h1 style={{ ...styles.title, marginBottom: 0 }}>A1 · Chapter 3 Workbook · Asking About Prices</h1>
        <p style={{ ...styles.subtitle, margin: 0 }}>
          Complete the guided exercises for prices, family writing, and hobbies. Submit your final work in the assignment tab.
        </p>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {tabs.map((tab) => (
            <TabButton key={tab.key} active={tab.key === activeTab} onClick={() => setActiveTab(tab.key)}>
              {tab.label}
            </TabButton>
          ))}
        </div>

        <p style={{ margin: 0, color: "#4b5563" }}>
          Tab {activeIndex + 1} of {tabs.length}
        </p>
      </div>

      {activeTab === "preise" && (
        <div style={card}>
          <img
            src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1600&q=80"
            alt="Shopping and prices in a store"
            loading="lazy"
            style={{ width: "100%", borderRadius: 10, maxHeight: 260, objectFit: "cover" }}
          />
          <h2 style={sectionTitle}>Teil 1: Preise und Kosten (Exercise 1)</h2>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            <strong>Übung 3: Frage nach dem Preis.</strong> Übe Fragen nach dem Preis und antworte darauf.
          </p>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            Practice asking for the price and answering the questions by using the correct pronouns.
          </p>
          <p style={{ margin: 0, background: "#fef3c7", borderRadius: 8, padding: "10px 12px", fontWeight: 700 }}>
            Use the pronouns to answer.
          </p>
          <ol style={listSpacing}>
            {pronounPrompts.map((item) => (
              <li key={item.question}>
                {item.question} — <strong>{item.answer}</strong>
              </li>
            ))}
          </ol>
          <p style={{ margin: 0, color: "#4b5563" }}>
            No typing is required on this page. Prepare your answers and submit through the assignment submission tab.
          </p>
        </div>
      )}

      {activeTab === "familie" && (
        <div style={card}>
          <img
            src="https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=1600&q=80"
            alt="Family together at home"
            loading="lazy"
            style={{ width: "100%", borderRadius: 10, maxHeight: 260, objectFit: "cover" }}
          />
          <h2 style={sectionTitle}>Teil 2: Writing About Family (Exercise 2)</h2>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            <strong>Schreibe über deine Familie.</strong> Write a short text about your family using the ideas below.
          </p>
          <ol style={listSpacing}>
            <li>Familienmitglieder: Wer gehört zu deiner Familie? (Mutter, Vater, Geschwister, etc.)</li>
            <li>Namen und Alter: Wie heißen deine Familienmitglieder und wie alt sind sie?</li>
            <li>Berufe: Was machen deine Familienmitglieder beruflich?</li>
            <li>Hobbys: Was sind die Hobbys deiner Familienmitglieder?</li>
            <li>Wohnort: Wo wohnt deine Familie?</li>
          </ol>

          <div style={{ border: "1px solid #e5e7eb", borderRadius: 10, padding: 12, background: "#fff" }}>
            <h3 style={{ ...sectionTitle, marginBottom: 8 }}>Example / Beispiel</h3>
            <p style={{ marginTop: 0, lineHeight: 1.7 }}>
              My family is small. My mother's name is Anna and she is 45 years old. She is a teacher. My father's name is
              Peter and he is 50 years old. He is an engineer. I have a sister. Her name is Lisa and she is 20 years old.
              She studies at the university. We live in a house in Berlin. My mother likes to read books, my father likes to
              play football, and my sister likes music.
            </p>
            <p style={{ margin: 0, lineHeight: 1.7 }}>
              Meine Familie ist klein. Meine Mutter heißt Anna und sie ist 45 Jahre alt. Sie ist Lehrerin. Mein Vater heißt
              Peter und er ist 50 Jahre alt. Er ist Ingenieur. Ich habe eine Schwester. Sie heißt Lisa und sie ist 20 Jahre
              alt. Sie studiert an der Universität. Wir wohnen in einem Haus in Berlin. Meine Mutter liest gern Bücher, mein
              Vater spielt gern Fußball und meine Schwester mag Musik.
            </p>
          </div>
          <p style={{ margin: 0, color: "#4b5563" }}>
            Write your own version in your notebook and submit in the assignment area.
          </p>
        </div>
      )}

      {activeTab === "hobbys" && (
        <div style={card}>
          <img
            src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1600&q=80"
            alt="People enjoying hobbies together"
            loading="lazy"
            style={{ width: "100%", borderRadius: 10, maxHeight: 260, objectFit: "cover" }}
          />
          <h2 style={sectionTitle}>Teil 3: Hobbies (Exercise 3)</h2>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            Answer the following questions about your hobbies using <strong>gern</strong> or <strong>mögen</strong>.
          </p>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            <strong>How to answer example:</strong> Spielst du gern Fußball? → Ja, ich spiele gern Fußball.
          </p>
          <ol style={listSpacing}>
            {hobbiesQuestions.map((question) => (
              <li key={question}>{question}</li>
            ))}
          </ol>

          <h3 style={sectionTitle}>Vocabulary List: Hobbies (Hobbys)</h3>
          <ul style={listSpacing}>
            <li>Reading – Lesen</li>
            <li>Swimming – Schwimmen</li>
            <li>Playing football – Fußballspielen</li>
            <li>Painting – Malen</li>
            <li>Listening to music – Musik hören</li>
            <li>Cooking – Kochen</li>
            <li>Traveling – Reisen</li>
            <li>Gardening – Gartenarbeit</li>
            <li>Cycling – Radfahren</li>
            <li>Hiking – Wandern</li>
          </ul>

          <h3 style={sectionTitle}>Useful Phrases</h3>
          <ul style={listSpacing}>
            <li>My hobby is... – Mein Hobby ist...</li>
            <li>I like to... – Ich mag...</li>
            <li>I enjoy... – Ich genieße...</li>
            <li>In my free time, I... – In meiner Freizeit...</li>
            <li>I do this hobby with... – Ich mache dieses Hobby mit...</li>
            <li>I do this hobby alone. – Ich mache dieses Hobby allein.</li>
          </ul>

          <h3 style={sectionTitle}>Example Sentences</h3>
          <ul style={listSpacing}>
            <li>I like to read books. – Ich mag Bücher lesen.</li>
            <li>I swim twice a week. – Ich schwimme zweimal pro Woche.</li>
            <li>Playing football is fun. – Fußballspielen macht Spaß.</li>
            <li>She enjoys painting. – Sie genießt Malen.</li>
            <li>We listen to music every day. – Wir hören jeden Tag Musik.</li>
            <li>He likes to cook new recipes. – Er kocht gern neue Rezepte.</li>
            <li>Traveling is exciting. – Reisen ist aufregend.</li>
            <li>My mother loves gardening. – Meine Mutter liebt Gartenarbeit.</li>
            <li>Cycling keeps me healthy. – Radfahren hält mich gesund.</li>
            <li>Hiking is adventurous. – Wandern ist abenteuerlich.</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default A1Chapter3AskingAboutPricesWorkbookPage;
