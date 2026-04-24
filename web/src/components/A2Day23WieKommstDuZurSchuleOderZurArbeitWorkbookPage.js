import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { styles } from "../styles";

const tabs = [
  { key: "teil1", label: "Teil 1 · Group Practice" },
  { key: "teil2", label: "Teil 2 · Schreiben" },
  { key: "teil3", label: "Teil 3 · Lesen" },
  { key: "teil4", label: "Teil 4 · Hören" },
];

const cardStyle = {
  ...styles.card,
  display: "grid",
  gap: 12,
};

const sectionTitle = {
  margin: 0,
  fontSize: "1.1rem",
};

const listStyle = {
  margin: 0,
  paddingLeft: 20,
  lineHeight: 1.7,
};

const questionCardStyle = {
  border: "1px solid #e5e7eb",
  borderRadius: 10,
  padding: 12,
  background: "#fff",
  display: "grid",
  gap: 6,
};

const tabButtonStyle = (active) => ({
  ...styles.secondaryButton,
  borderColor: active ? "#2563eb" : "#d1d5db",
  background: active ? "#eff6ff" : "#fff",
  color: active ? "#1d4ed8" : "#111827",
});

const lesenQuestions = [
  {
    question: "Wohin fuhr Matthias?",
    options: ["a) in die Südsee", "b) ans Mittelmeer", "c) an die Nordsee", "d) an die Ostsee"],
  },
  {
    question: "Wo leben die Eltern von Matthias?",
    options: ["a) in einer Großstadt", "b) auf einer Insel", "c) im Hotel", "d) in den Bergen"],
  },
  {
    question: "Aus welchem Land stammt der Student Bernd?",
    options: ["a) aus der Schweiz", "b) aus Deutschland", "c) aus Frankreich", "d) aus Österreich"],
  },
  {
    question: "Mit welchem Fahrzeug besichtigte Bernd die Stadt Paris?",
    options: ["a) mit der U-Bahn", "b) mit dem Auto", "c) mit dem Fahrrad", "d) mit dem Bus"],
  },
  {
    question: "Was mag der Österreicher Thomas?",
    options: ["a) den Wind und das Meer", "b) überfüllte Autobahnen", "c) große Städte", "d) die Berge und die Natur"],
  },
];

const A2Day23WieKommstDuZurSchuleOderZurArbeitWorkbookPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("teil1");

  return (
    <div style={{ ...styles.container, display: "grid", gap: 16 }}>
      <div style={cardStyle}>
        <button style={{ ...styles.secondaryButton, width: "fit-content" }} onClick={() => navigate("/campus/course")}>
          Back to Course
        </button>

        <h1 style={{ ...styles.title, marginBottom: 0 }}>A2 · Day 23 Workbook · Wie kommst du zur Schule / zur Arbeit?</h1>
        <p style={{ ...styles.subtitle, margin: 0 }}>Chapter 9.23</p>
        <p style={{ margin: 0, color: "#4b5563" }}>
          Complete each Teil and submit your final answers in the submission area (not on this page).
        </p>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {tabs.map((tab) => (
            <button key={tab.key} style={tabButtonStyle(tab.key === activeTab)} onClick={() => setActiveTab(tab.key)}>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {activeTab === "teil1" && (
        <div style={cardStyle}>
          <img
            src="https://images.unsplash.com/photo-1519583272095-6433daf26b6e?auto=format&fit=crop&w=1600&q=80"
            alt="Cars and public transport on a busy city street"
            loading="lazy"
            style={{ width: "100%", borderRadius: 10, maxHeight: 280, objectFit: "cover" }}
          />

          <h2 style={sectionTitle}>Teil 1 (Group Practice)</h2>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            In this chapter, we will engage in group discussions about <strong>Autos und Transportmittel</strong>. Following
            the discussions, the questions will be rephrased for an assignment.
          </p>

          <h3 style={sectionTitle}>Instructions</h3>
          <ol style={listStyle}>
            <li>
              <strong>Central Topic:</strong> Write "Autos und Transportmittel" in the center of your brain map.
            </li>
            <li>
              <strong>Main Branches:</strong> Create five main branches.
            </li>
            <li>
              <strong>Sub-Branches:</strong> Expand each branch with examples, relevant vocabulary, and phrases.
            </li>
          </ol>

          <h3 style={sectionTitle}>Example Brain Map</h3>
          <ol style={listStyle}>
            <li>
              <strong>Verschiedene Transportmittel</strong>: Auto, Fahrrad, Bus, Zug, Motorrad, Flugzeug, Schiff
            </li>
            <li>
              <strong>Autotypen und Marken</strong>: Kleinwagen, Limousine, Kombi, SUV, Elektroauto; Marken: VW, BMW,
              Mercedes, Toyota, Ford
            </li>
            <li>
              <strong>Wichtige Autoteile und Zubehör</strong>: Reifen, Motor, Lenkrad, Bremse, Scheinwerfer,
              Sicherheitsgurt, Navigationssystem
            </li>
            <li>
              <strong>Verkehrsregeln und Sicherheit</strong>: Geschwindigkeitsbegrenzung, Führerschein, Anschnallen,
              Rote Ampel, Fahrradhelm tragen, Rechts vor links
            </li>
            <li>
              <strong>Alltag und Reisen</strong>: Zur Arbeit fahren, Einkaufen, Urlaubsreise mit dem Auto,
              Öffentliche Verkehrsmittel benutzen, Carsharing oder Mitfahrgelegenheit
            </li>
          </ol>

          <div style={{ ...questionCardStyle, background: "#f8fafc" }}>
            <strong>Sprechen prompt</strong>
            <p style={{ margin: 0 }}>
              Wie kommst du zur Schule oder zur Arbeit? (z. B. zu Fuß, mit dem Bus, mit dem Auto, mit dem Fahrrad)
            </p>
          </div>
        </div>
      )}

      {activeTab === "teil2" && (
        <div style={cardStyle}>
          <h2 style={sectionTitle}>Teil 2 (Schreiben) · Assignment</h2>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            Sie möchten zusammen mit einem Freund oder einer Freundin ein neues Auto. Schreiben Sie Ihrem Freund bzw.
            Ihrer Freundin eine E-Mail:
          </p>
          <ol style={listStyle}>
            <li>
              Laden Sie ihn/sie ein, mit Ihnen zum Autohändler oder in ein Autohaus zu gehen, und erklären Sie den
              Grund (z. B. „Ich brauche ein Auto für den Arbeitsweg“).
            </li>
            <li>Schlagen Sie vor, wann und wo Sie sich treffen können.</li>
            <li>
              Bitten Sie um seine/ihre Meinung zu Ihrer Idee (z. B. welches Modell er/sie empfehlen würde).
            </li>
          </ol>
        </div>
      )}

      {activeTab === "teil3" && (
        <div style={cardStyle}>
          <h2 style={sectionTitle}>Teil 3 (Lesen) · Exercise</h2>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            <strong>Verkehrsmittel:</strong> In München treffen sich drei Studenten. Matthias erzählt von seinem Urlaub in
            Norddeutschland und der Insel seiner Eltern. Bernd berichtet über Reisen nach Barcelona und Paris mit Tram,
            Taxi und U-Bahn. Thomas aus Österreich erzählt von Motorradtouren in den Bergen und viel Verkehr auf den
            Autobahnen.
          </p>

          <div style={{ display: "grid", gap: 10 }}>
            {lesenQuestions.map((item, index) => (
              <div key={item.question} style={questionCardStyle}>
                <strong>
                  Frage {index + 1}: {item.question}
                </strong>
                <ul style={listStyle}>
                  {item.options.map((option) => (
                    <li key={option}>{option}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "teil4" && (
        <div style={cardStyle}>
          <h2 style={sectionTitle}>Teil 4 (Hören)</h2>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            This is a Goethe-standard Hören test, and the answers are already provided in the YouTube video. You are
            responsible for checking your own answers.
          </p>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            ✅ The only parts that will be officially evaluated by the school are Lesen and Schreiben. You must mark your
            own Hören results.
          </p>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            This process requires motivation and self-discipline to be effective. Thank you, and good luck!
          </p>
          <a href="https://youtu.be/6DA1dYfqEZo?list=PLg78ckjpHfZzy9rvr_CmY73BLJiPTiaXL" target="_blank" rel="noreferrer">
            Open Teil 4 Hören video
          </a>
        </div>
      )}

      <div style={{ ...cardStyle, border: "1px solid #bfdbfe", background: "#eff6ff" }}>
        <h2 style={{ ...sectionTitle, color: "#1e3a8a" }}>Final submission</h2>
        <p style={{ margin: 0, lineHeight: 1.7, color: "#1e3a8a" }}>
          Submit your final answers in the submission area. Do not submit answers directly on this workbook page.
        </p>
        <a href="https://www.falowen.app/campus/submit" target="_blank" rel="noreferrer">
          Go to submission area
        </a>
      </div>
    </div>
  );
};

export default A2Day23WieKommstDuZurSchuleOderZurArbeitWorkbookPage;
