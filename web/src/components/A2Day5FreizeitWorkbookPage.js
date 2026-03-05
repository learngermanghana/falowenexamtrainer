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
    stem: "Welche Speisen bestellen die Gäste?",
    options: [
      "a) Gemüseauflauf mit Salat",
      "b) Rindfleisch mit Leberknödeln",
      "c) Nudeln, Pizza und Salat",
      "d) Schnitzel mit Salat und Kotelett mit Gemüse",
    ],
  },
  {
    stem: "Was hat der Kellner vergessen?",
    options: ["a) Den Weißwein", "b) Den Nachtisch", "c) Den grünen Salat", "d) Die Speisekarte"],
  },
  {
    stem: "Welche Nachspeisen bestellen die Gäste?",
    options: [
      "a) Schokoladencreme und Tiramisu",
      "b) Schokoladeneis und Kuchen",
      "c) Schokoladenkuchen und Tiramisu",
      "d) Eis und Schokoladenkuchen",
    ],
  },
  {
    stem: "Was ist nicht in Ordnung bei den Speisen?",
    options: [
      "a) Der bestellte Salat ist der falsche.",
      "b) Die Suppe ist kalt.",
      "c) Das Kotelett ist zäh.",
      "d) Das Schnitzel ist kalt.",
    ],
  },
  {
    stem: "Wie bezahlt der Gast?",
    options: ["a) Mit einem Scheck.", "b) Gegen Rechnung.", "c) In bar.", "d) Mit Kreditkarte."],
  },
];

const hoerenQuestions = [
  {
    stem: "Was macht Anna abends gerne, wenn sie zu Hause ist?",
    options: [
      "a) Sie trinkt Tee und liest ein Buch.",
      "b) Sie schaut Fernsehen.",
      "c) Sie telefoniert mit ihren Freunden.",
    ],
  },
  {
    stem: "Welches Brettspiel spielt Anna oft mit ihrer Familie?",
    options: ["a) Schach", "b) Mensch ärgere dich nicht", "c) Uno"],
  },
  {
    stem: "Was macht Anna jeden Morgen, um fit zu bleiben?",
    options: ["a) Sie geht joggen.", "b) Sie macht Yoga.", "c) Sie geht schwimmen."],
  },
  {
    stem: "Wo hat Anna am letzten Wochenende Zeit mit ihren Freunden verbracht?",
    options: ["a) Am Strand", "b) In den Bergen", "c) Im Park"],
  },
  {
    stem: "Welche Musik hört Anna, wenn sie sich konzentrieren möchte?",
    options: ["a) Popmusik", "b) Klassische Musik", "c) Jazzmusik"],
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

const A2Day5FreizeitWorkbookPage = () => {
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

        <h1 style={{ ...styles.title, marginBottom: 0 }}>A2 · Day 5 Workbook · Was machst du in deiner Freizeit?</h1>
        <p style={{ ...styles.subtitle, margin: 0 }}>
          4-part workbook: speaking, writing, reading, and listening practice for chapter 2.5.
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
            src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1600&q=80"
            alt="Friends spending free time together outdoors"
            loading="lazy"
            style={{ width: "100%", borderRadius: 10, maxHeight: 260, objectFit: "cover" }}
          />
          <h2 style={sectionTitle}>Teil 1 (Group Practice)</h2>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            For this assignment, you will talk about your leisure time activities. This exercise will help you practice your
            German speaking skills and prepare you for the Goethe A2 exam.
          </p>

          <h3 style={sectionTitle}>Zentrales Thema (Central Topic)</h3>
          <p style={{ margin: 0 }}>
            <strong>Freizeitaktivitäten</strong> (Free time activities)
          </p>

          <h3 style={sectionTitle}>🌿 Hauptäste (Main Branches)</h3>
          <ol style={listSpacing}>
            <li>Sport und Bewegung (Sports and exercise)</li>
            <li>Kreative Hobbys (Creative hobbies)</li>
            <li>Digitale Freizeit (Digital free time)</li>
            <li>Gesellschaft und Freunde (Social activities)</li>
            <li>Entspannung und Ruhe (Relaxation and rest)</li>
          </ol>

          <h3 style={sectionTitle}>🌟 Unteräste (Sub-Branches)</h3>
          <ul style={listSpacing}>
            <li>
              <strong>Sport und Bewegung:</strong> Joggen, Schwimmen, Fahrrad fahren, Fußball spielen, Tanzen, Wandern
            </li>
            <li>
              <strong>Kreative Hobbys:</strong> Malen, Musik machen, Fotografieren, Basteln, Schreiben
            </li>
            <li>
              <strong>Digitale Freizeit:</strong> Filme oder Serien schauen, Videospiele spielen, Soziale Medien nutzen, Online lernen
            </li>
            <li>
              <strong>Gesellschaft und Freunde:</strong> Freunde treffen, mit der Familie Zeit verbringen, Grillen, Ausgehen
            </li>
            <li>
              <strong>Entspannung und Ruhe:</strong> Lesen, Musik hören, Spazieren gehen, Schlafen oder Nickerchen machen, Yoga oder Meditation
            </li>
          </ul>

          <p style={{ margin: 0 }}>
            <strong>Frage:</strong> Was machst du gern in deiner Freizeit?
          </p>
          <p style={{ margin: 0 }}>
            <strong>Stichwörter:</strong> Freunde · Hobby · Wochenende · Sport
          </p>

          <div style={{ ...questionCardStyle, background: "#f8fafc" }}>
            <strong>Speaking self-practice confidence check</strong>
            <p style={{ margin: 0 }}>Use this speaking self-practice tool to build confidence before class:</p>
            <a
              href="https://script.google.com/macros/s/AKfycbzMIhHuWKqM2ODaOCgtS7uZCikiZJRBhpqv2p6OyBmK1yAVba8HlmVC1zgTcGWSTfrsHA/exec"
              target="_blank"
              rel="noreferrer"
            >
              Open speaking self-practice
            </a>
          </div>

          <p style={{ margin: 0, color: "#4b5563" }}>
            Teil 1 is only for group discussion and has no assignment submission. Assignments start from Teil 2, Teil 3, and
            Teil 4.
          </p>

          <PreparedCheckbox checked={prepared.sprechen} onChange={setPreparedFor("sprechen")} />
        </div>
      )}

      {activeTab === "schreiben" && (
        <div style={card}>
          <img
            src="https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1600&q=80"
            alt="Learner writing an email assignment in a notebook"
            loading="lazy"
            style={{ width: "100%", borderRadius: 10, maxHeight: 260, objectFit: "cover" }}
          />
          <h2 style={sectionTitle}>Teil 2: Schreiben (Assignment)</h2>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            Angepasste Aufgabe: Freizeit. Sie möchten mit Ihrem Freund Alex in Ihrer Freizeit etwas unternehmen. Schreiben Sie
            Alex eine E-Mail:
          </p>
          <ol style={listSpacing}>
            <li>Sagen Sie, dass Sie Zeit haben und etwas zusammen machen möchten.</li>
            <li>Fragen Sie, ob er am Wochenende frei ist.</li>
            <li>Fragen Sie, ob er einen Vorschlag für eine Aktivität hat.</li>
          </ol>
          <p style={{ margin: 0 }}>Zusatzaufgabe (optional): Schreiben Sie 5 Sätze über Ihre Freizeit mit Ideen aus Ihrer Brain Map.</p>
          <p style={{ margin: 0, color: "#4b5563" }}>
            Submit your final writing in the assignment submission area, not directly on this page.
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
            src="https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=1600&q=80"
            alt="Reading comprehension practice with newspaper and notebook"
            loading="lazy"
            style={{ width: "100%", borderRadius: 10, maxHeight: 260, objectFit: "cover" }}
          />
          <h2 style={sectionTitle}>Teil 3 - Lesen in der Zeitung: Essay and Questions</h2>
          <p style={{ margin: 0 }}>
            Read the text carefully and submit your answers in the assignment area. <strong>Do not answer directly on this page.</strong>
          </p>

          <h3 style={sectionTitle}>Im Restaurant</h3>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            Kellner: Guten Abend, haben Sie reserviert? Gast: Ja, einen Tisch für zwei auf den Namen Müller. Kellner: Bitte
            folgen Sie mir, ich bringe Sie zu Ihrem Tisch. Gast: Vielen Dank. Kellner: Darf ich Ihnen schon Getränke bringen?
            Gast: Die Speisekarte bitte zuerst. Kellner: Sehr gern. Gast: Wir bestellen eine Flasche Weißwein und einen Liter
            Wasser bitte. Kellner: Zum Essen haben Sie schon gewählt? Gast: Ja, wir bekommen als Vorspeise zwei Mal die Suppe.
            Ist das Gemüsesuppe? Kellner: Ja, Gemüsesuppe mit Karotten. Gast: Sehr gut. Und anschließend als Hauptspeise nehmen
            wir ein Mal die Nudeln, ein Mal eine Pizza und einen Salat. Kellner: Sehr gern. Möchten Sie Kartoffelsalat oder
            grünen Salat? Gast: Gern grünen Salat. Kellner: Ist alles in Ordnung? Gast: Die Suppe ist köstlich, aber leider kalt.
            Kellner: Entschuldigen Sie vielmals, ich bringe Ihnen sofort eine neue. Gast: Ja bitte.
            <br />
            <br />
            Kellner: Sind Sie zufrieden? Wie sind die Nudeln? Schmeckt die Pizza? Gast: Ja, wunderbar. Allerdings haben Sie den
            grünen Salat vergessen. Kellner: Das tut mir furchtbar leid. Kommt sofort. Gast: Wir hätten gern Nachtisch. Bringen
            Sie uns nochmals die Speisekarte bitte? Kellner: Sehr gern, als Entschuldigung für die kalte Suppe und den
            vergessenen Salat laden wir Sie dazu gern ein. Gast: Ja, wunderbar. Wir hätten gern ein Tiramisu und einen
            Schokoladenkuchen. Kellner: Sehr gern. Gast: Wir möchten gern bezahlen. Kellner: Gern, bar oder mit Karte? Gast:
            Bar. Und bitte eine Rechnung. Kellner: Selbstverständlich. Kommt sofort.
          </p>

          <h3 style={sectionTitle}>Fragen und Antwortmöglichkeiten</h3>
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
            src="https://images.unsplash.com/photo-1478737270239-2f02b77fc618?auto=format&fit=crop&w=1600&q=80"
            alt="Headphones ready for listening comprehension exercise"
            loading="lazy"
            style={{ width: "100%", borderRadius: 10, maxHeight: 260, objectFit: "cover" }}
          />
          <h2 style={sectionTitle}>Teil 4 - Hören: Listening Comprehension</h2>
          <p style={{ margin: 0 }}>
            Listen to the audio, then submit your answers in the assignment area (do not answer directly on this page).
          </p>
          <p style={{ margin: 0 }}>
            Audio link:{" "}
            <a
              href="https://drive.google.com/file/d/1TTqHwLUdG8yIZGkegj_UEAamiFpr1DMh/view?usp=sharing"
              target="_blank"
              rel="noreferrer"
            >
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
                Anna erzählt, was sie in ihrer Freizeit macht. Abends, wenn sie zu Hause ist, trinkt sie gern Tee und liest ein
                Buch. Mit ihrer Familie spielt sie oft „Mensch ärgere dich nicht“. Jeden Morgen macht sie Yoga, um fit zu
                bleiben. Letztes Wochenende war sie mit ihren Freunden im Park. Wenn sie sich konzentrieren möchte, hört sie
                klassische Musik.
              </p>
            </div>
          )}

          <h3 style={sectionTitle}>Questions with Multiple Choice Answers</h3>
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
            <a href="https://youtu.be/8dX40NXG_gI" target="_blank" rel="noreferrer">
              Freizeit in Deutschland: Aktivitäten und Wochenendpläne (A2)
            </a>
          </p>
          <iframe
            style={videoPreviewStyle}
            src="https://www.youtube.com/embed/8dX40NXG_gI"
            title="Freizeit in Deutschland: Aktivitäten und Wochenendpläne (A2)"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />

          <PreparedCheckbox checked={prepared.hoeren} onChange={setPreparedFor("hoeren")} />
        </div>
      )}
    </div>
  );
};

export default A2Day5FreizeitWorkbookPage;
