import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { styles } from "../styles";

const tabs = [
  { key: "sprechen", label: "Teil 1 · Sprechen (Group Practice No assignment)" },
  { key: "schreiben", label: "Teil 2 · Schreiben" },
  { key: "lesen", label: "Teil 3 · Lesen" },
];

const speakingBranches = [
  "Vorbereitung",
  "Ort des Treffens",
  "Gesprächsthemen",
  "Gefühle und Eindrücke",
  "Verhalten und Höflichkeit",
  "Möglicher Verlauf",
];

const speakingSubBranches = [
  {
    title: "Vorbereitung",
    items: ["Kleidung auswählen", "Pünktlich sein", "Nervosität oder Vorfreude", "Blumen oder kleines Geschenk mitbringen"],
  },
  {
    title: "Ort des Treffens",
    items: ["Café oder Restaurant", "Spaziergang im Park", "Kino oder Museum", "Öffentliche Orte (für Sicherheit)"],
  },
  {
    title: "Gesprächsthemen",
    items: ["Hobbys und Interessen", "Familie und Freunde", "Beruf / Studium", "Reisen und Zukunftspläne", "Was man mag / nicht mag"],
  },
  {
    title: "Gefühle und Eindrücke",
    items: ["Aufregung", "Neugier", "Unsicherheit", "Sympathie oder Desinteresse", "Überraschung (positiv oder negativ)"],
  },
  {
    title: "Verhalten und Höflichkeit",
    items: ["Zuhören", "Fragen stellen", "Freundlich und respektvoll sein", "Nicht zu privat werden", "Handy weglegen"],
  },
  {
    title: "Möglicher Verlauf",
    items: [
      "Date war schön → Wiedersehen verabreden",
      "Kein Interesse → Höflich bleiben",
      "Gemeinsame Interessen → Längeres Gespräch",
      "Missverständnisse oder unangenehme Momente",
    ],
  },
];

const lesenQuestions = [
  {
    stem: "Wer hat das Spiel Monopoly ursprünglich erfunden?",
    options: ["a) Charles Darrow", "b) Mary Pilon", "c) Elizabeth Magie Phillips", "d) Parker Brothers"],
  },
  {
    stem: "Wie hieß das Spiel zuerst?",
    options: ["a) Monopoly", "b) The Landlord’s Game", "c) Real Estate Race", "d) Monopoly Classic"],
  },
  {
    stem: "Was wollte Elizabeth Magie Phillips mit dem Spiel zeigen?",
    options: ["a) Wie man Hotels kauft", "b) Wie unfair Monopole sind", "c) Wie man Geld verdient", "d) Wie man mit Freunden spielt"],
  },
  {
    stem: "Was tat Charles Darrow mit dem Spiel?",
    options: ["a) Er spielte es nur mit Freunden", "b) Er veröffentlichte es gemeinsam mit Phillips", "c) Er gab es als seine eigene Idee aus", "d) Er verschenkte es an Studenten"],
  },
  {
    stem: "Was bekam Elizabeth Magie Phillips für ihre Idee?",
    options: ["a) Einen großen Geldpreis", "b) Ruhm und Erfolg", "c) Eine Auszeichnung vom Präsidenten", "d) So gut wie nichts"],
  },
  {
    stem: "Wie wurde das Spiel bekannt?",
    options: ["a) Durch Werbung in Zeitungen", "b) Weil Parker Brothers es verkaufte", "c) Weil Phillips es im Fernsehen präsentierte", "d) Durch ein berühmtes Turnier"],
  },
  {
    stem: "Wer schrieb ein Buch über die wahre Geschichte von Monopoly?",
    options: ["a) Charles Darrow", "b) Mary Pilon", "c) Parker Brothers", "d) Elizabeth Magie Phillips"],
  },
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

const tabImageStyle = {
  width: "100%",
  borderRadius: 10,
  maxHeight: 260,
  objectFit: "cover",
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

const PreparedCheckbox = ({ checked, onChange }) => (
  <label style={{ display: "inline-flex", alignItems: "center", gap: 8, fontWeight: 600 }}>
    <input type="checkbox" checked={checked} onChange={onChange} />
    I prepared this part.
  </label>
);

const B1Day23ErstesDateWorkbookPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("sprechen");
  const [prepared, setPrepared] = useState({
    sprechen: false,
    schreiben: false,
    lesen: false,
  });

  const activeIndex = useMemo(() => tabs.findIndex((tab) => tab.key === activeTab), [activeTab]);
  const setPreparedFor = (tabKey) => (event) => setPrepared((prev) => ({ ...prev, [tabKey]: event.target.checked }));

  return (
    <div style={{ ...styles.container, display: "grid", gap: 16 }}>
      <div style={card}>
        <button style={{ ...styles.secondaryButton, width: "fit-content" }} onClick={() => navigate("/campus/course")}>
          Back to Course
        </button>

        <h1 style={{ ...styles.title, marginBottom: 0 }}>B1 · Day 23 Workbook · Erstes Date – Typische Situationen</h1>
        <p style={{ ...styles.subtitle, margin: 0 }}>Chapter 7.23 · Erstes Date, Kommunikation und situatives Verhalten.</p>

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
            alt="Two people meeting for a first date in a cafe"
            loading="lazy"
            style={tabImageStyle}
          />
          <h2 style={sectionTitle}>Teil 1 (Sprechen) (Group Practice)</h2>
          <p style={{ margin: 0, lineHeight: 1.7 }}>In this chapter, we&apos;ll engage in group exercises discussing these topics.</p>

          <h3 style={sectionTitle}>Zentrales Thema</h3>
          <p style={{ margin: 0 }}>
            <strong>Erstes Date – Typische Situationen</strong>
          </p>

          <h3 style={sectionTitle}>🌿 Hauptäste (Main Branches)</h3>
          <ol style={listSpacing}>
            {speakingBranches.map((branch) => (
              <li key={branch}>{branch}</li>
            ))}
          </ol>

          <h3 style={sectionTitle}>🌱 Unteräste (Sub-Branches)</h3>
          <ol style={listSpacing}>
            {speakingSubBranches.map((branch) => (
              <li key={branch.title}>
                <strong>{branch.title}</strong>
                <ul style={listSpacing}>
                  {branch.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>

          <h3 style={sectionTitle}>Hauptfrage</h3>
          <p style={{ margin: 0 }}>Was sind typische Situationen bei einem ersten Date, und wie verhält man sich am besten?</p>

          <h3 style={sectionTitle}>Anweisung</h3>
          <ul style={listSpacing}>
            <li>Beschreiben Sie verschiedene Möglichkeiten für ein erstes Treffen.</li>
            <li>Nennen Sie Vor- und Nachteile (z. B. Restaurant vs. Spaziergang).</li>
            <li>Bewerten Sie, was für ein gutes erstes Date wichtig ist.</li>
            <li>Beschreiben Sie eine Möglichkeit genauer und sagen Sie, warum Sie sie wählen würden.</li>
          </ul>

          <div style={{ ...questionCardStyle, background: "#f8fafc" }}>
            <strong>Speaking self-practice confidence check</strong>
            <p style={{ margin: 0 }}>Use this speaking self-practice tool to build confidence before class:</p>
            <a href="https://www.falowen.app/campus/speech" target="_blank" rel="noreferrer">
              Open speaking self-practice
            </a>
          </div>

          <p style={{ margin: 0, color: "#4b5563" }}>
            Teil 1 is only for group discussion and has no assignment submission. Assignments start from Teil 2 and Teil 3.
          </p>

          <PreparedCheckbox checked={prepared.sprechen} onChange={setPreparedFor("sprechen")} />
        </div>
      )}

      {activeTab === "schreiben" && (
        <div style={card}>
          <img
            src="https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1600&q=80"
            alt="Writing an opinion text about first dates and relationships"
            loading="lazy"
            style={tabImageStyle}
          />
          <h2 style={sectionTitle}>Teil 2 (Schreiben)</h2>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            <strong>„Ist das erste Date wirklich wichtig für eine Beziehung? Schreiben Sie Ihre Meinung.“</strong>
          </p>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            <strong>Sophie:</strong> Viele Menschen glauben, dass das erste Date entscheidet, ob man zusammenpasst. Ich stimme
            dem teilweise zu, denn der erste Eindruck kann viel bedeuten. Man merkt oft schnell, ob man sich sympathisch
            ist. Trotzdem finde ich, dass man nicht zu viel erwarten sollte. Manche Menschen sind beim ersten Treffen
            nervös und zeigen sich nicht so, wie sie wirklich sind. Ich denke, wichtiger ist, wie sich die Beziehung danach
            entwickelt. Was denken Sie darüber?
          </p>
          <div style={{ ...questionCardStyle, background: "#f8fafc" }}>
            <strong>Writing guidance before submission</strong>
            <p style={{ margin: 0 }}>
              Draft your opinion first, organize your arguments clearly, and use examples. You can use the Ideas Generator
              for support before you submit.
            </p>
            <p style={{ margin: 0 }}>
              Practice on the writing page:{" "}
              <a href="https://www.falowen.app/campus/writing" target="_blank" rel="noreferrer">
                Open Writing Practice
              </a>
            </p>
          </div>
          <p style={{ margin: 0 }}>Submit your final writing in the assignment submission area, not directly on this page.</p>

          <PreparedCheckbox checked={prepared.schreiben} onChange={setPreparedFor("schreiben")} />
        </div>
      )}

      {activeTab === "lesen" && (
        <div style={card}>
          <img
            src="https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=1600&q=80"
            alt="Reading practice with books and notes"
            loading="lazy"
            style={tabImageStyle}
          />
          <h2 style={sectionTitle}>Teil 3 (Lesen)</h2>
          <p style={{ margin: 0 }}>
            Read the text carefully, then complete the multiple-choice task in the assignment submission area. <strong>Do
            not answer directly on this page.</strong>
          </p>

          <h3 style={sectionTitle}>Die Frau, die Monopoly erfand</h3>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            Elizabeth Magie Phillips ist nicht sehr bekannt – ihre Erfindung aber schon: das Brettspiel Monopoly. Doch
            diese Idee wurde ihr gestohlen. Und das Spiel, das sie eigentlich im Sinn hatte, wurde vergessen.
          </p>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            Straßen kaufen, Mieten einnehmen, Hotels bauen – und mit etwas Würfelglück gehört einem am Ende das ganze
            Geld – und die Mitspieler sind bankrott. Millionen Menschen haben in ihrer Kindheit das Brettspiel Monopoly
            gespielt. Bis vor Kurzem wusste allerdings kaum jemand, wer die Idee zu dem Spieleklassiker hatte – und dass
            das Spiel eigentlich ganz anders konzipiert war. Denn die Erfinderin wurde um ihre Idee betrogen. Die
            US-amerikanische Autorin und Journalistin Mary Pilon hat die Geschichte in einem Buch aufgeschrieben.
          </p>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            Monopoly stammt von der US-Amerikanerin Elizabeth Magie Phillips, und sie nannte es zuerst „The Landlord’s
            Game“. Phillips wurde 1866 geboren und lebte in der Zeit der Industrialisierung. Täglich sah sie Ungleichheit,
            Armut und Elend. Ihr Spiel sollte diese Zustände kritisieren. Phillips entwickelte deshalb zwei Regelwerke für
            ihr Spiel: „Eins, in dem es darum ging, Monopole aufzubrechen“, so Pilon. „Und eins, in dem es darum ging, zu
            zeigen, wie schädlich Monopole sind.“
          </p>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            1903 meldete Phillips ein Patent auf ihr Spiel an. Es war zunächst unter Studenten beliebt und bekam schließlich
            den Namen Monopoly. Doch in den 1930er-Jahren kopierte der Verkäufer Charles Darrow ihr Spiel, übernahm aber
            nur das heute noch bekannte zweite Regelwerk. Er gab das Spiel als sein eigenes aus, verkaufte die Rechte an
            den Parker-Brothers-Spieleverlag – und wurde Millionär. Über 275 Millionen Spiele hat Parker Brothers laut
            eigenen Angaben bis 2010 weltweit verkauft. Der schnelle Reichtum, den Phillips eigentlich kritisieren wollte
            – bei ihrem eigenen Spiel wurde er Wirklichkeit.
          </p>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            Phillips selbst sah nichts von dem vielen Geld. Als sie von Charles Darrows Erfolg erfuhr, machte sie die
            Presse auf ihre Geschichte aufmerksam. Daraufhin bot der Spieleverlag ihr an, zwei andere Spiele von ihr zu
            veröffentlichen. Doch daraus wurde anscheinend nichts. Laut Pilon erkennt Parker Brothers bis heute nicht an,
            dass Elizabeth Magie Phillips die Erfinderin von Monopoly ist. Auch Phillips selbst wurde nach ihrem Tod 1948
            vergessen. Ihren späten Ruhm verdankt sie Mary Pilon, die fünf Jahre lang für ihr Buch recherchiert hat.
          </p>

          <h3 style={sectionTitle}>Fragen zum Text</h3>
          {lesenQuestions.map((question, index) => (
            <div key={question.stem} style={questionCardStyle}>
              <strong>
                Frage {index + 1}: {question.stem}
              </strong>
              {question.options.map((option) => (
                <span key={option}>{option}</span>
              ))}
            </div>
          ))}

          <PreparedCheckbox checked={prepared.lesen} onChange={setPreparedFor("lesen")} />
        </div>
      )}

    </div>
  );
};

export default B1Day23ErstesDateWorkbookPage;
