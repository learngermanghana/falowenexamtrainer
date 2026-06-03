import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { styles } from "../styles";
import SpeakingPracticeTimerCard from "./SpeakingPracticeTimerCard";
import CoursebookAudioPlayer from "./CoursebookAudioPlayer";
import CourseInlinePracticePanel from "./CourseInlinePracticePanel";
import { A2B1WorkbookGuidance, WorkbookSubmissionReminder } from "./A2B1WorkbookGuidance";

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

const phraseGridStyle = {
  display: "grid",
  gap: 10,
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
};

const lesenQuestions = [
  {
    stem: "Warum bin ich in die Stadt gezogen?",
    options: [
      "a) Weil ich in einer Wohngemeinschaft wohne",
      "b) Weil ich studiere",
      "c) Weil ich gerne lese",
      "d) Weil ich manchmal in den Zoo gehe",
    ],
  },
  {
    stem: "Wann gehe ich zu Fuß zur Universität?",
    options: [
      "a) Wenn ich Hunger habe",
      "b) Wenn es nicht regnet, stürmt oder schneit",
      "c) Wenn die Vorlesungen früh beginnen",
      "d) Wenn die Professoren streng sind",
    ],
  },
  {
    stem: "Wie ist das Essen in der Mensa?",
    options: [
      "a) Es ist gesund",
      "b) Es ist sehr gut",
      "c) Es ist vegetarisch",
      "d) Es ist billig",
    ],
  },
  {
    stem: "Was ist in der WG verboten?",
    options: [
      "a) Schuhe",
      "b) Fahrräder",
      "c) Bücher",
      "d) Haustiere",
    ],
  },
  {
    stem: "Wo möchte ich später arbeiten?",
    options: [
      "a) In der U-Bahn",
      "b) An der Universität",
      "c) Im Zoo",
      "d) In der Mensa",
    ],
  },
];

const hoerenQuestions = [
  {
    stem: "Welche Wohnung ist 70 Quadratmeter groß?",
    options: ["a) Die 2-Zimmer-Wohnung", "b) Die 3-Zimmer-Wohnung"],
  },
  {
    stem: "Welche Wohnung hat einen Balkon?",
    options: ["a) Die 2-Zimmer-Wohnung", "b) Die 3-Zimmer-Wohnung"],
  },
  {
    stem: "Wie hoch sind die Nebenkosten für die 3-Zimmer-Wohnung?",
    options: ["a) 150 Euro pro Monat", "b) 200 Euro pro Monat"],
  },
  {
    stem: "Welche Wohnung erlaubt Haustiere?",
    options: ["a) Die 2-Zimmer-Wohnung", "b) Die 3-Zimmer-Wohnung"],
  },
  {
    stem: "Welche Wohnung ist ab dem 1. August verfügbar?",
    options: ["a) Die 2-Zimmer-Wohnung", "b) Die 3-Zimmer-Wohnung"],
  },
];

const HOEREN_GOOGLE_DRIVE_LINK =
  "https://drive.google.com/file/d/13oaVnn-WTSJnIeKBFC0Zhlz7cfBtpKFx/view?usp=sharing";

function getGoogleDrivePreviewLink(link) {
  const match = link.match(/\/d\/([a-zA-Z0-9_-]+)/);
  if (!match) return link;
  const fileId = match[1];
  return `https://drive.google.com/file/d/${fileId}/preview`;
}

function getGoogleDriveDirectAudioLink(link) {
  const match = link.match(/\/d\/([a-zA-Z0-9_-]+)/);
  if (!match) return link;
  const fileId = match[1];
  return `https://drive.google.com/uc?export=download&id=${fileId}`;
}

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
  const [prepared, setPrepared] = useState({
    sprechen: false,
    schreiben: false,
    lesen: false,
    hoeren: false,
  });

  const activeIndex = useMemo(() => tabs.findIndex((tab) => tab.key === activeTab), [activeTab]);

  const setPreparedFor =
    (tabKey) => (event) =>
      setPrepared((prev) => ({ ...prev, [tabKey]: event.target.checked }));

  return (
    <div style={{ ...styles.container, display: "grid", gap: 16 }}>
      <div style={card}>
        <button style={{ ...styles.secondaryButton, width: "fit-content" }} onClick={() => navigate("/campus/course")}>
          Back to Course
        </button>

        <h1 style={{ ...styles.title, marginBottom: 0 }}>
          A2 · Day 6 Workbook · Möbel und Räume kennenlernen (3.6)
        </h1>
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

      <A2B1WorkbookGuidance />

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

          <h3 style={sectionTitle}>Sprechen wie bei einer Mini-Präsentation</h3>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            Nutze diese einfache Struktur: <strong>Einleitung → Hauptteil mit Verbindungswörtern → Beispiel → Schluss</strong>.
          </p>

          <div style={phraseGridStyle}>
            <div style={{ ...questionCardStyle, background: "#f8fafc" }}>
              <strong>1) Gute Einleitungen</strong>
              <ul style={listSpacing}>
                <li>„Heute spreche ich über mein Zimmer.“</li>
                <li>„Ich möchte meine Wohnung kurz vorstellen.“</li>
                <li>„In meiner Präsentation geht es um Möbel und Räume.“</li>
              </ul>
            </div>

            <div style={{ ...questionCardStyle, background: "#f8fafc" }}>
              <strong>2) Verbindungswörter / Connectors</strong>
              <ul style={listSpacing}>
                <li>
                  <strong>und</strong>, <strong>oder</strong>
                </li>
                <li>
                  <strong>weil</strong>, <strong>deshalb</strong>
                </li>
                <li>
                  <strong>dann</strong>, <strong>danach</strong>, <strong>zum Schluss</strong>
                </li>
              </ul>
            </div>

            <div style={{ ...questionCardStyle, background: "#f8fafc" }}>
              <strong>3) Eigene Meinung ausdrücken</strong>
              <ul style={listSpacing}>
                <li>„Ich finde mein Wohnzimmer sehr gemütlich.“</li>
                <li>„Meiner Meinung nach ist ein großer Tisch wichtig.“</li>
                <li>„Ich mag mein Zimmer, weil es hell ist.“</li>
              </ul>
            </div>

            <div style={{ ...questionCardStyle, background: "#f8fafc" }}>
              <strong>4) Gute Schlüsse</strong>
              <ul style={listSpacing}>
                <li>„Zusammenfassend ist mein Zimmer klein, aber praktisch.“</li>
                <li>„Zum Schluss möchte ich sagen: Ich fühle mich zu Hause sehr wohl.“</li>
                <li>„Danke fürs Zuhören.“</li>
              </ul>
            </div>
          </div>

          <div style={{ ...questionCardStyle, background: "#ecfeff" }}>
            <strong>Kurzes Modell (ca. 30–45 Sekunden)</strong>
            <p style={{ margin: 0, lineHeight: 1.7 }}>
              „Heute spreche ich über mein Wohnzimmer. Das Wohnzimmer ist nicht groß, aber sehr gemütlich. Es gibt ein
              Sofa und einen Tisch, und die Lampe steht neben dem Sofa. Ich mag den Raum, <strong>weil</strong> er hell ist.
              Ich möchte noch ein Regal kaufen, <strong>deshalb</strong> habe ich mehr Platz für Bücher. <strong>Zum Schluss</strong>{" "}
              kann ich sagen: Mein Wohnzimmer ist praktisch und modern.“
            </p>
          </div>
          <SpeakingPracticeTimerCard />

          <p style={{ margin: 0, color: "#4b5563" }}>Teil 1 is for group practice only and has no assignment submission.</p>

          <CourseInlinePracticePanel
            type="speaking"
          />
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
          <CourseInlinePracticePanel
            type="writing"
          />
          <WorkbookSubmissionReminder />
          <PreparedCheckbox checked={prepared.schreiben} onChange={setPreparedFor("schreiben")} />
        </div>
      )}

      {activeTab === "lesen" && (
        <div style={card}>
          <img
            src="https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=1600&q=80"
            alt="Student reading books"
            loading="lazy"
            style={{ width: "100%", borderRadius: 10, maxHeight: 260, objectFit: "cover" }}
          />
          <h2 style={sectionTitle}>Teil 3 – Lesen - Anzeige</h2>
          <p style={{ margin: 0 }}>
            Read the text and review the questions. <strong>Do not answer directly on this page.</strong> Use the submit section at
            the bottom of the lesson to send your answers.
          </p>

          <h3 style={sectionTitle}>Neu in der Stadt</h3>
          <p style={{ margin: 0, lineHeight: 1.8 }}>
            Ich bin vor einem Monat in diese Stadt gezogen, um zu studieren.
            <br />
            Ich wohne zusammen mit drei anderen Mädchen in einer Wohngemeinschaft. Unsere Wohnung ist nicht weit von der
            Universität entfernt, ich muss nur drei Stationen mit der U-Bahn fahren.
            <br />
            Wenn das Wetter schön ist, gehe ich manchmal zu Fuß. Die Professoren an der Universität sind sehr nett,
            manche sind aber auch streng. Die Vorlesungen, die schon früh beginnen, mag ich nicht so gerne. Ich schlafe
            lieber lange.
            <br />
            Mittags esse ich mit meinen Freundinnen in der Mensa. Das Essen ist nicht sehr gut, aber es kostet nicht
            viel.
            <br />
            In meiner Freizeit lese ich gerne, in meinem Zimmer stehen viele Bücher. Manchmal gehe ich in den Zoo und
            beobachte die Tiere. Früher hatte ich zwei Katzen, aber in der WG sind keine Haustiere erlaubt.
            <br />
            Wenn ich das Studium abgeschlossen habe, möchte ich als Tierärztin im Zoo arbeiten.
          </p>

          <h3 style={sectionTitle}>Fragen zum Text</h3>
          {lesenQuestions.map((question, index) => (
            <div key={question.stem} style={questionCardStyle}>
              <strong>
                Frage {index + 1}: {question.stem}
              </strong>
              {question.options.map((option) => (
                <span key={option}>• {option}</span>
              ))}
            </div>
          ))}

          <WorkbookSubmissionReminder />
          <PreparedCheckbox checked={prepared.lesen} onChange={setPreparedFor("lesen")} />
        </div>
      )}

      {activeTab === "hoeren" && (
        <div style={card}>
          <img
            src="https://images.unsplash.com/photo-1478737270239-2f02b77fc618?auto=format&fit=crop&w=1600&q=80"
            alt="Headphones for listening practice"
            loading="lazy"
            style={{ width: "100%", borderRadius: 10, maxHeight: 260, objectFit: "cover" }}
          />
          <h2 style={sectionTitle}>Teil 4 (Hören) · Exercise</h2>
          <p style={{ margin: 0 }}>
            Listen to the audio, then submit your answers in the assignment area. <strong>Do not answer directly on this page.</strong>
          </p>

          <CoursebookAudioPlayer
            url={getGoogleDriveDirectAudioLink(HOEREN_GOOGLE_DRIVE_LINK)}
            linkLabel="Open Teil 4 audio"
          />

          <p style={{ margin: 0 }}>
            Audio link:{" "}
            <a href={HOEREN_GOOGLE_DRIVE_LINK} target="_blank" rel="noreferrer">
              Open Google Drive audio
            </a>
          </p>

          <iframe
            style={videoPreviewStyle}
            src={getGoogleDrivePreviewLink(HOEREN_GOOGLE_DRIVE_LINK)}
            title="Teil 4 Audio Preview"
            allow="autoplay"
          />

          <h3 style={sectionTitle}>Fragen zum Hörtext</h3>
          {hoerenQuestions.map((question, index) => (
            <div key={question.stem} style={questionCardStyle}>
              <strong>{index + 1}. {question.stem}</strong>
              {question.options.map((option) => (
                <span key={option}>o {option}</span>
              ))}
            </div>
          ))}

          <WorkbookSubmissionReminder />
          <PreparedCheckbox checked={prepared.hoeren} onChange={setPreparedFor("hoeren")} />
        </div>
      )}
    </div>
  );
};

export default A2Day6MoebelRaeumeWorkbookPage;
