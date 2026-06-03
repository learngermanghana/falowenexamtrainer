import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { styles } from "../styles";
import SpeakingPracticeTimerCard from "./SpeakingPracticeTimerCard";
import CoursebookAudioPlayer from "./CoursebookAudioPlayer";
import CourseInlinePracticePanel from "./CourseInlinePracticePanel";
import { A2B1WorkbookGuidance, WorkbookSubmissionReminder } from "./A2B1WorkbookGuidance";

const tabs = [
  { key: "sprechen", label: "Teil 1 · Sprechen" },
  { key: "schreiben", label: "Teil 2 · Schreiben" },
  { key: "lesen", label: "Teil 3 · Lesen" },
  { key: "hoeren", label: "Teil 4 · Hören" },
];

const card = {
  ...styles.card,
  display: "grid",
  gap: 12,
};

const sectionTitle = { margin: 0, fontSize: "1.1rem" };
const listSpacing = { margin: 0, paddingLeft: 20, lineHeight: 1.7 };
const questionCardStyle = {
  border: "1px solid #e5e7eb",
  borderRadius: 10,
  padding: 12,
  background: "#fff",
  display: "grid",
  gap: 6,
};
const phraseGridStyle = { display: "grid", gap: 10, gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" };

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
  const splashImageUrl =
    "https://images.unsplash.com/photo-1511988617509-a57c8a288659?auto=format&fit=crop&w=1800&q=80";
  const [activeTab, setActiveTab] = useState("sprechen");
  const [prepared, setPrepared] = useState({ sprechen: false, schreiben: false, lesen: false, hoeren: false });

  const activeIndex = useMemo(() => tabs.findIndex((tab) => tab.key === activeTab), [activeTab]);
  const setPreparedFor = (tabKey) => (event) => setPrepared((prev) => ({ ...prev, [tabKey]: event.target.checked }));

  return (
    <div style={{ ...styles.container, display: "grid", gap: 16 }}>
      <div style={card}>
        <button style={{ ...styles.secondaryButton, width: "fit-content" }} onClick={() => navigate("/campus/course")}>
          Back to Course
        </button>

        <h1 style={{ ...styles.title, marginBottom: 0 }}>A2 · Day 5 Workbook · Was machst du in deiner Freizeit?</h1>
        <p style={{ ...styles.subtitle, margin: 0 }}>Chapter 2.5 · Dative Preposition · Talk about free time activities.</p>

        <div
          style={{
            borderRadius: 14,
            overflow: "hidden",
            border: "1px solid rgba(0,0,0,0.08)",
          }}
        >
          <img
            src={splashImageUrl}
            alt="Freizeitaktivitäten im Park"
            loading="lazy"
            style={{
              width: "100%",
              height: 220,
              objectFit: "cover",
              display: "block",
            }}
          />
        </div>

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

      <A2B1WorkbookGuidance />

      {activeTab === "sprechen" && (
        <div style={card}>
          <h2 style={sectionTitle}>Teil 1 (Group Practice)</h2>
          <p style={{ margin: 0 }}>
            For this assignment, you will talk about your leisure time activities. This exercise will help you practice your
            German speaking skills and prepare for the Goethe A2 exam.
          </p>
          <h3 style={sectionTitle}>Zentrales Thema</h3>
          <p style={{ margin: 0 }}>
            <strong>Freizeitaktivitäten</strong> (Free time activities)
          </p>
          <h3 style={sectionTitle}>Hauptäste</h3>
          <ol style={listSpacing}>
            <li>Sport und Bewegung (Sports and movement)</li>
            <li>Kreative Hobbys (Creative hobbies)</li>
            <li>Digitale Freizeit (Digital free time)</li>
            <li>Gesellschaft und Freunde (Social life and friends)</li>
            <li>Entspannung und Ruhe (Relaxation and quiet time)</li>
          </ol>
          <h3 style={sectionTitle}>Unteräste</h3>
          <ul style={listSpacing}>
            <li><strong>Sport und Bewegung (Sports and movement):</strong> Joggen (jogging), Schwimmen (swimming), Fahrrad fahren (cycling), Fußball spielen (playing football/soccer), Tanzen (dancing), Wandern (hiking)</li>
            <li><strong>Kreative Hobbys (Creative hobbies):</strong> Malen (painting), Musik machen (making music), Fotografieren (photography), Basteln (crafting), Schreiben (writing)</li>
            <li><strong>Digitale Freizeit (Digital free time):</strong> Filme/Serien schauen (watching films/series), Videospiele spielen (playing video games), Soziale Medien nutzen (using social media), Online lernen (learning online)</li>
            <li><strong>Gesellschaft und Freunde (Social life and friends):</strong> Freunde treffen (meeting friends), mit der Familie Zeit verbringen (spending time with family), Grillen (barbecuing), Ausgehen (going out)</li>
            <li><strong>Entspannung und Ruhe (Relaxation and quiet time):</strong> Lesen (reading), Musik hören (listening to music), Spazieren gehen (going for a walk), Schlafen/Nickerchen (sleeping/napping), Yoga/Meditation (yoga/meditation)</li>
          </ul>
          <h3 style={sectionTitle}>Sprechen wie bei einer Mini-Präsentation</h3>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            Nutze diese klare Struktur: <strong>Einleitung → Hauptteil mit Verbindungswörtern → Beispiel → Schluss</strong>.
          </p>
          <div style={phraseGridStyle}>
            <div style={{ ...questionCardStyle, background: "#f8fafc" }}>
              <strong>1) Gute Einleitungen</strong>
              <ul style={listSpacing}>
                <li>„Heute spreche ich über meine Freizeit.“</li>
                <li>„Ich möchte kurz erzählen, was ich am Wochenende mache.“</li>
                <li>„In meinem Beitrag geht es um meine Hobbys.“</li>
              </ul>
            </div>
            <div style={{ ...questionCardStyle, background: "#f8fafc" }}>
              <strong>2) Verbindungswörter / Connectors</strong>
              <ul style={listSpacing}>
                <li><strong>und</strong>, <strong>oder</strong></li>
                <li><strong>weil</strong>, <strong>deshalb</strong></li>
                <li><strong>zuerst</strong>, <strong>dann</strong>, <strong>am Ende</strong></li>
              </ul>
            </div>
            <div style={{ ...questionCardStyle, background: "#f8fafc" }}>
              <strong>3) Eigene Meinung ausdrücken</strong>
              <ul style={listSpacing}>
                <li>„Ich finde, ...“</li>
                <li>„Meiner Meinung nach ist ...“</li>
                <li>„Für mich ist ... wichtig, weil ...“</li>
              </ul>
            </div>
            <div style={{ ...questionCardStyle, background: "#f8fafc" }}>
              <strong>4) Gute Schlüsse</strong>
              <ul style={listSpacing}>
                <li>„Zum Schluss kann ich sagen, dass ...“</li>
                <li>„Zusammenfassend ist Freizeit für mich wichtig.“</li>
                <li>„Danke fürs Zuhören.“</li>
              </ul>
            </div>
          </div>
          <div style={{ ...questionCardStyle, background: "#ecfeff" }}>
            <strong>Beispiel (30–45 Sekunden)</strong>
            <p style={{ margin: 0, lineHeight: 1.7 }}>
              „Heute spreche ich über meine Freizeit am Wochenende. <strong>Zuerst</strong> mache ich Sport, <strong>weil</strong>{" "}
              ich fit bleiben möchte. <strong>Dann</strong> treffe ich Freunde im Park, <strong>und</strong> wir spielen oft
              Fußball <strong>oder</strong> gehen spazieren. Am Abend höre ich Musik, <strong>deshalb</strong> bin ich entspannt.
              <strong> Zum Schluss</strong> kann ich sagen: Freizeit mit Bewegung und Freunden ist für mich perfekt.“
            </p>
          </div>
          <p style={{ margin: 0 }}><strong>Frage:</strong> Was machst du gern in deiner Freizeit?</p>
          <p style={{ margin: 0 }}><strong>Stichwörter:</strong> Freunde · Hobby · Wochenende · Sport</p>
          <CourseInlinePracticePanel
            type="speaking"
          />
          <SpeakingPracticeTimerCard />

          <p style={{ margin: 0, color: "#4b5563" }}>Teil 1 is for group practice only and has no assignment submission.</p>
          <PreparedCheckbox checked={prepared.sprechen} onChange={setPreparedFor("sprechen")} />
        </div>
      )}

      {activeTab === "schreiben" && (
        <div style={card}>
          <h2 style={sectionTitle}>Teil 2: Schreiben (Assignment)</h2>
          <p style={{ margin: 0 }}>Sie möchten mit Ihrem Freund Alex in Ihrer Freizeit etwas unternehmen. Schreiben Sie Alex eine E-Mail:</p>
          <ol style={listSpacing}>
            <li>Sagen Sie, dass Sie Zeit haben und etwas zusammen machen möchten.</li>
            <li>Fragen Sie, ob er am Wochenende frei ist.</li>
            <li>Fragen Sie, ob er einen Vorschlag für eine Aktivität hat.</li>
          </ol>
          <p style={{ margin: 0 }}>Optional: Schreiben Sie 5 Sätze über Ihre Freizeit mit Ideen aus Ihrer Brain Map.</p>
          <CourseInlinePracticePanel
            type="writing"
          />
          <WorkbookSubmissionReminder />
          <PreparedCheckbox checked={prepared.schreiben} onChange={setPreparedFor("schreiben")} />
        </div>
      )}

      {activeTab === "lesen" && (
        <div style={card}>
          <h2 style={sectionTitle}>Teil 3 - Lesen in der Zeitung</h2>
          <h3 style={sectionTitle}>Im Restaurant</h3>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            Kellner: Guten Abend, haben Sie reserviert? Gast: Ja, einen Tisch für zwei auf den Namen Müller. Kellner: Bitte
            folgen Sie mir, ich bringe Sie zu Ihrem Tisch. Gast: Vielen Dank. Kellner: Darf ich Ihnen schon Getränke bringen?
            Gast: Die Speisekarte bitte zuerst. Kellner: Sehr gern. Gast: Wir bestellen eine Flasche Weißwein und einen Liter
            Wasser bitte. Kellner: Zum Essen haben Sie schon gewählt? Gast: Ja, wir bekommen als Vorspeise zwei Mal die Suppe.
            Ist das Gemüsesuppe? Kellner: Ja, Gemüsesuppe mit Karotten. Gast: Sehr gut. Und anschließend als Hauptspeise nehmen
            wir ein Mal die Nudeln, ein Mal eine Pizza und einen Salat. Kellner: Sehr gern. Möchten Sie Kartoffelsalat oder
            grünen Salat? Gast: Gern grünen Salat. Kellner: Ist alles in Ordnung? Gast: Die Suppe ist köstlich, aber leider kalt.
            Kellner: Entschuldigen Sie vielmals, ich bringe Ihnen sofort eine neue. Gast: Ja bitte. Kellner: Sind Sie zufrieden?
            Wie sind die Nudeln? Schmeckt die Pizza? Gast: Ja, wunderbar. Allerdings haben Sie den grünen Salat vergessen.
            Kellner: Das tut mir furchtbar leid. Kommt sofort. Gast: Wir hätten gern Nachtisch. Bringen Sie uns nochmals die
            Speisekarte bitte? Kellner: Sehr gern, als Entschuldigung für die kalte Suppe und den vergessenen Salat laden wir Sie
            dazu gern ein. Gast: Ja, wunderbar. Wir hätten gern ein Tiramisu und einen Schokoladenkuchen. Kellner: Sehr gern.
            Gast: Wir möchten gern bezahlen. Kellner: Gern, bar oder mit Karte? Gast: Bar. Und bitte eine Rechnung. Kellner:
            Selbstverständlich. Kommt sofort.
          </p>
          {lesenQuestions.map((question, index) => (
            <div key={question.stem} style={questionCardStyle}>
              <strong>{index + 1}. {question.stem}</strong>
              {question.options.map((option) => <span key={option}>{option}</span>)}
            </div>
          ))}
          <WorkbookSubmissionReminder />
          <PreparedCheckbox checked={prepared.lesen} onChange={setPreparedFor("lesen")} />
        </div>
      )}

      {activeTab === "hoeren" && (
        <div style={card}>
          <h2 style={sectionTitle}>Teil 4 - Hören: Listening Comprehension</h2>
          <CoursebookAudioPlayer
            url="https://drive.google.com/file/d/1TTqHwLUdG8yIZGkegj_UEAamiFpr1DMh/view?usp=sharing"
            linkLabel="Open Teil 4 audio"
          />
          {hoerenQuestions.map((question, index) => (
            <div key={question.stem} style={questionCardStyle}>
              <strong>{index + 1}. {question.stem}</strong>
              {question.options.map((option) => <span key={option}>{option}</span>)}
            </div>
          ))}
          <WorkbookSubmissionReminder />
          <PreparedCheckbox checked={prepared.hoeren} onChange={setPreparedFor("hoeren")} />
        </div>
      )}
    </div>
  );
};

export default A2Day5FreizeitWorkbookPage;
