import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { styles } from "../styles";

const tabs = [
  { key: "sprechen", label: "Teil 1 · Sprechen (Group Practice No assignment)" },
  { key: "schreiben", label: "Teil 2 · Schreiben" },
  { key: "lesen", label: "Teil 3 · Lesen" },
  { key: "hoeren", label: "Teil 4 · Hören" },
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

const questionCardStyle = {
  border: "1px solid #e5e7eb",
  borderRadius: 10,
  padding: 12,
  background: "#fff",
  display: "grid",
  gap: 6,
};

const videoPreviewStyle = {
  width: "100%",
  minHeight: 315,
  border: 0,
  borderRadius: 10,
};

const lesenQuestions = [
  {
    stem: "Wo liegt der Teppich?",
    options: ["A) Auf dem Tisch", "B) Unter dem Tisch", "C) Neben dem Sofa", "D) Hinter der Lampe"],
  },
  {
    stem: "Wohin stellt Anna den Stuhl?",
    options: ["A) In die Küche", "B) Auf den Balkon", "C) Neben den Tisch", "D) Hinter das Regal"],
  },
  {
    stem: "Wo steht der Schrank?",
    options: ["A) An der Wand", "B) In den Flur", "C) Unter den Teppich", "D) Auf das Sofa"],
  },
  {
    stem: "Wohin hängt Paul das Bild?",
    options: ["A) An die Wand", "B) Auf dem Bett", "C) Unter dem Fenster", "D) In dem Bad"],
  },
  {
    stem: "Warum benutzt der Text die Präpositionen in / auf / an?",
    options: [
      "A) Nur für Zeitangaben",
      "B) Um Möbel und Orte genau zu beschreiben",
      "C) Nur mit Dativ",
      "D) Nur mit Akkusativ",
    ],
  },
];

const hoerenQuestions = [
  {
    stem: "Wohin trägt Mia den kleinen Tisch?",
    options: ["A) Ins Schlafzimmer", "B) In die Küche", "C) Ins Wohnzimmer", "D) In den Flur"],
  },
  {
    stem: "Wo stehen die Stühle am Ende?",
    options: ["A) Hinter dem Sofa", "B) Am Fenster", "C) Im Bad", "D) Unter dem Bett"],
  },
  {
    stem: "Welche Aussage ist richtig?",
    options: ["A) Bewegung = Dativ", "B) Position = Akkusativ", "C) Wohin? = Akkusativ", "D) Wo? = Nominativ"],
  },
  {
    stem: "Was hängt Mia an die Wand?",
    options: ["A) Eine Uhr", "B) Ein Regal", "C) Eine Lampe", "D) Einen Teppich"],
  },
  {
    stem: "Was sagt Mia zum Schluss?",
    options: ["A) Das Zimmer ist zu klein", "B) Jetzt ist das Zimmer gemütlich", "C) Wir kaufen neue Möbel", "D) Alles bleibt draußen"],
  },
];

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

const PreparedCheckbox = ({ checked, onChange }) => (
  <label style={{ display: "inline-flex", alignItems: "center", gap: 8, fontWeight: 600 }}>
    <input type="checkbox" checked={checked} onChange={onChange} />
    I prepared this part.
  </label>
);

const A2Day6MoebelRaeumeWorkbookPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("sprechen");
  const [teacherMode, setTeacherMode] = useState(false);
  const [prepared, setPrepared] = useState({
    sprechen: false,
    schreiben: false,
    lesen: false,
    hoeren: false,
  });

  const activeIndex = useMemo(() => tabs.findIndex((tab) => tab.key === activeTab), [activeTab]);

  const setPreparedFor = (tabKey) => (event) => setPrepared((prev) => ({ ...prev, [tabKey]: event.target.checked }));

  return (
    <div style={{ ...styles.container, display: "grid", gap: 16 }}>
      <div style={card}>
        <button style={{ ...styles.secondaryButton, width: "fit-content" }} onClick={() => navigate("/campus/course")}>
          Back to Course
        </button>

        <h1 style={{ ...styles.title, marginBottom: 0 }}>A2 · Day 6 Workbook · Möbel und Räume kennenlernen (3.6)</h1>
        <p style={{ ...styles.subtitle, margin: 0 }}>
          4-part workbook: group speaking, writing, reading and listening practice.
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

      {activeTab === "sprechen" && (
        <div style={card}>
          <img
            src="https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1600&q=80"
            alt="Modern living room with sofa and furniture"
            loading="lazy"
            style={{ width: "100%", borderRadius: 10, maxHeight: 260, objectFit: "cover" }}
          />

          <h2 style={sectionTitle}>Teil 1 (Group Practice)</h2>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            In this chapter, we'll engage in group exercises discussing these topics. Following this, I'll revise the
            questions and invite you to record an audio about yourself.
          </p>

          <h3 style={sectionTitle}>1. Zentrales Thema (Central Topic)</h3>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            <strong>Möbel und Räume</strong> (Furniture and rooms)
          </p>

          <h3 style={sectionTitle}>2. Hauptäste (Main Branches)</h3>
          <ul style={listSpacing}>
            <li>Zimmer (Rooms)</li>
            <li>Möbel (Furniture)</li>
            <li>Position (Wo?)</li>
            <li>Bewegung / Veränderung (Wohin?)</li>
            <li>Meinung und Beschreibung (Opinion and description)</li>
          </ul>

          <h3 style={sectionTitle}>3. Unteräste (Sub-Branches)</h3>

          <div style={{ display: "grid", gap: 12 }}>
            <div style={questionCardStyle}>
              <strong>Zimmer (Rooms)</strong>
              <ul style={listSpacing}>
                <li>Wohnzimmer (Living room)</li>
                <li>Schlafzimmer (Bedroom)</li>
                <li>Küche (Kitchen)</li>
                <li>Bad (Bathroom)</li>
                <li>Esszimmer (Dining room)</li>
                <li>Flur (Hallway)</li>
                <li>Balkon (Balcony)</li>
                <li>Arbeitszimmer (Study / office)</li>
              </ul>
            </div>

            <div style={questionCardStyle}>
              <strong>Möbel (Furniture)</strong>
              <ul style={listSpacing}>
                <li>Sofa (Sofa)</li>
                <li>Tisch (Table)</li>
                <li>Stuhl (Chair)</li>
                <li>Bett (Bed)</li>
                <li>Schrank (Wardrobe / cupboard)</li>
                <li>Regal (Shelf)</li>
                <li>Lampe (Lamp)</li>
                <li>Teppich (Carpet)</li>
              </ul>
            </div>

            <div style={questionCardStyle}>
              <strong>Position (Wo?)</strong>
              <ul style={listSpacing}>
                <li>an der Wand (on the wall / against the wall)</li>
                <li>neben dem Sofa (next to the sofa)</li>
                <li>unter dem Tisch (under the table)</li>
                <li>vor dem Fenster (in front of the window)</li>
                <li>hinter der Tür (behind the door)</li>
                <li>in der Ecke (in the corner)</li>
              </ul>
            </div>

            <div style={questionCardStyle}>
              <strong>Bewegung / Veränderung (Wohin?)</strong>
              <ul style={listSpacing}>
                <li>an die Wand (onto the wall)</li>
                <li>neben das Sofa (next to the sofa)</li>
                <li>unter den Tisch (under the table)</li>
                <li>vor das Fenster (in front of the window)</li>
                <li>hinter die Tür (behind the door)</li>
                <li>in die Ecke (into the corner)</li>
              </ul>
            </div>

            <div style={questionCardStyle}>
              <strong>Meinung und Beschreibung (Opinion and description)</strong>
              <ul style={listSpacing}>
                <li>gemütlich (comfortable / cozy)</li>
                <li>modern (modern)</li>
                <li>hell (bright)</li>
                <li>groß (big)</li>
                <li>klein (small)</li>
                <li>praktisch (practical)</li>
                <li>Ich mag ... (I like ...)</li>
                <li>Mein Lieblingszimmer ist ... (My favorite room is ...)</li>
              </ul>
            </div>
          </div>

          <h3 style={sectionTitle}>Questions</h3>
          <div style={{ ...questionCardStyle, background: "#f8fafc" }}>
            <p style={{ margin: 0, lineHeight: 1.7 }}>
              Talk for two minutes about a room in your home. Describe the room, mention the furniture inside it, and
              explain where the furniture is. Also say what you would like to change in the room and why. After your
              talk, your classmates will ask you questions.
            </p>
          </div>

          <div style={{ ...questionCardStyle, background: "#f9fafb" }}>
            <strong>Zimmer · Möbel · Wo? · Wohin?</strong>
            <p style={{ margin: 0, lineHeight: 1.7 }}>
              <strong>Wie sieht dein Zimmer aus und was möchtest du darin verändern?</strong>
            </p>
          </div>

          <div style={{ ...questionCardStyle, background: "#f8fafc" }}>
            <strong>Speaking self-practice confidence check</strong>
            <p style={{ margin: 0 }}>Use this speaking self-practice tool to build confidence before class:</p>
            <a href="https://www.falowen.app/campus/speech" target="_blank" rel="noreferrer">
              Open speaking self-practice
            </a>
          </div>

          <p style={{ margin: 0, color: "#4b5563" }}>
            Teil 1 is only for group discussion and has no assignment submission. Assignments start from Teil 2, Teil 3,
            and Teil 4.
          </p>

          <PreparedCheckbox checked={prepared.sprechen} onChange={setPreparedFor("sprechen")} />
        </div>
      )}

      {activeTab === "schreiben" && (
        <div style={card}>
          <img
            src="https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1600&q=80"
            alt="Notebook and pen for writing practice"
            loading="lazy"
            style={{ width: "100%", borderRadius: 10, maxHeight: 260, objectFit: "cover" }}
          />
          <h2 style={sectionTitle}>Teil 2 (Schreiben) · Exercise</h2>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            <strong>Anleitung:</strong> Schreibe eine Nachricht an deine Freundin oder deinen Freund über dein Zimmer.
          </p>
          <p style={{ margin: 0 }}>Dein Text soll folgende Punkte enthalten:</p>
          <ol style={listSpacing}>
            <li>Beschreibe mindestens zwei Räume in deiner Wohnung.</li>
            <li>Nenne mindestens fünf Möbel und sage, wo sie stehen (Wo? + Dativ).</li>
            <li>Beschreibe zwei Veränderungen (Wohin? + Akkusativ), z. B. du stellst einen Stuhl neben den Tisch.</li>
          </ol>
          <p style={{ margin: 0, color: "#4b5563" }}>
            Submit your final writing in the assignment submission area (same workflow as usual), not directly on this page.
          </p>
          <p style={{ margin: 0 }}>
            Practice your draft before submission on the writing page:{" "}
            <a href="https://www.falowen.app/campus/writing" target="_blank" rel="noreferrer">
              Open Writing Practice
            </a>{" "}
            (you can use the Ideas Generator there for support).
          </p>
          <PreparedCheckbox checked={prepared.schreiben} onChange={setPreparedFor("schreiben")} />
        </div>
      )}

      {activeTab === "lesen" && (
        <div style={card}>
          <img
            src="https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1600&q=80"
            alt="Bedroom interior with furniture"
            loading="lazy"
            style={{ width: "100%", borderRadius: 10, maxHeight: 260, objectFit: "cover" }}
          />
          <h2 style={sectionTitle}>Teil 3 (Lesen)</h2>
          <p style={{ margin: 0 }}>
            Read the text and review the questions. <strong>Do not answer directly on this page.</strong> Use the submit section at
            the bottom of the lesson to send your answers.
          </p>

          <h3 style={sectionTitle}>Unser neues Wohnzimmer</h3>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            Heute räumen wir unser Wohnzimmer um. Der Teppich liegt unter dem Tisch. Das Sofa steht an der Wand. Eine Lampe
            steht neben dem Sofa. Am Nachmittag stellt Anna einen Stuhl neben den Tisch und hängt ein neues Bild an die Wand.
            Später trägt Paul ein kleines Regal in die Ecke. Jetzt ist das Wohnzimmer hell, ordentlich und gemütlich.
          </p>

          <h3 style={sectionTitle}>Fragen und mögliche Antworten</h3>
          {lesenQuestions.map((question, index) => (
            <div key={question.stem} style={questionCardStyle}>
              <strong>{index + 1}. {question.stem}</strong>
              {question.options.map((option) => (
                <span key={option}>{option}</span>
              ))}
            </div>
          ))}

          <PreparedCheckbox checked={prepared.lesen} onChange={setPreparedFor("lesen")} />
        </div>
      )}

      {activeTab === "hoeren" && (
        <div style={card}>
          <img
            src="https://images.unsplash.com/photo-1486946255434-2466348c2166?auto=format&fit=crop&w=1600&q=80"
            alt="Headphones and laptop for listening practice"
            loading="lazy"
            style={{ width: "100%", borderRadius: 10, maxHeight: 260, objectFit: "cover" }}
          />
          <h2 style={sectionTitle}>Teil 4 (Hören)</h2>
          <p style={{ margin: 0 }}>
            Listen to the audio, then submit your answers in the assignment area (do not answer directly on this page).
          </p>
          <p style={{ margin: 0 }}>
            Audio link:{" "}
            <a href="https://youtu.be/am3WqQaCibE" target="_blank" rel="noreferrer">
              Open Teil 4 audio
            </a>
          </p>

          <label style={{ display: "inline-flex", alignItems: "center", gap: 8, fontWeight: 600 }}>
            <input type="checkbox" checked={teacherMode} onChange={(event) => setTeacherMode(event.target.checked)} />
            Teacher mode (show transcript)
          </label>

          {teacherMode && (
            <div style={{ ...questionCardStyle, background: "#fefce8" }}>
              <strong>Transcript (teacher support)</strong>
              <p style={{ margin: 0, lineHeight: 1.6 }}>
                Mia und Leon räumen das Wohnzimmer um. Zuerst stellen sie den Tisch in die Mitte. Dann stellen sie zwei Stühle
                an das Fenster. Mia hängt eine Uhr an die Wand und legt den Teppich unter den Tisch. Am Ende sagt sie: Jetzt
                ist das Zimmer gemütlich und praktisch.
              </p>
            </div>
          )}

          <h3 style={sectionTitle}>Fragen und mögliche Antworten</h3>
          {hoerenQuestions.map((question, index) => (
            <div key={question.stem} style={questionCardStyle}>
              <strong>{index + 1}. {question.stem}</strong>
              {question.options.map((option) => (
                <span key={option}>{option}</span>
              ))}
            </div>
          ))}

          <p style={{ margin: 0 }}>
            Recommended video:{" "}
            <a href="https://youtu.be/am3WqQaCibE" target="_blank" rel="noreferrer">
              Möbel und Räume kennenlernen · A2
            </a>
          </p>
          <iframe
            style={videoPreviewStyle}
            src="https://www.youtube.com/embed/am3WqQaCibE"
            title="Möbel und Räume kennenlernen · A2"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />

          <PreparedCheckbox checked={prepared.hoeren} onChange={setPreparedFor("hoeren")} />
        </div>
      )}
    </div>
  );
};

export default A2Day6MoebelRaeumeWorkbookPage;
