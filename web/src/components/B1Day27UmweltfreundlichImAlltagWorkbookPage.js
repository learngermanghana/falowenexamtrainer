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

const tabImageStyle = {
  width: "100%",
  borderRadius: 10,
  maxHeight: 260,
  objectFit: "cover",
};

const videoPreviewStyle = {
  width: "100%",
  minHeight: 315,
  border: 0,
  borderRadius: 10,
};

const lesenQuestions = [
  {
    stem: "Welche Materialien können recycelt werden?",
    options: ["A) Nur Plastik", "B) Nur Glas", "C) Papier, Glas und Plastik", "D) Nur Papier"],
  },
  {
    stem: "Wie können wir unseren CO2-Fußabdruck verringern?",
    options: [
      "A) Durch den Einsatz energieeffizienter Geräte",
      "B) Durch den Verzicht auf Recycling",
      "C) Durch häufigeres Autofahren",
      "D) Durch den Einsatz von Kohleenergie",
    ],
  },
  {
    stem: "Welche Energiequellen sind erneuerbar?",
    options: ["A) Kohle und Öl", "B) Solar- und Windkraft", "C) Gas und Atomenergie", "D) Holz und Torf"],
  },
  {
    stem: "Welche Verkehrsmittel helfen, Emissionen zu reduzieren?",
    options: [
      "A) Fahrräder und öffentliche Verkehrsmittel",
      "B) Autos und Motorräder",
      "C) Flugzeuge und Schiffe",
      "D) Lastwagen und Busse",
    ],
  },
  {
    stem: "Warum sollten wir weniger Fleisch konsumieren?",
    options: [
      "A) Weil es gesund ist",
      "B) Weil die Fleischproduktion ressourcenintensiv ist",
      "C) Weil es teuer ist",
      "D) Weil es schwer zu kochen ist",
    ],
  },
  {
    stem: "Was können wir tun, um die Umwelt zu schützen?",
    options: ["A) Recycling vernachlässigen", "B) Energie verschwenden", "C) Umweltfreundlich einkaufen", "D) Fleischproduktion fördern"],
  },
  {
    stem: "Wo beginnt der Schutz der Umwelt?",
    options: ["A) Bei den Politikern", "B) Bei jedem Einzelnen", "C) In den Fabriken", "D) Bei den Tieren"],
  },
];

const hoerenQuestions = [
  {
    stem: "Worum geht es im Hörtext hauptsächlich?",
    options: [
      "A) Tipps für umweltfreundliches Verhalten im Alltag",
      "B) Eine Reiseplanung durch Europa",
      "C) Einen Einkaufsführer für Technik",
      "D) Ein Gespräch über Sportvereine",
    ],
  },
  {
    stem: "Welche Maßnahme wird für den Alltag empfohlen?",
    options: ["A) Mehr Einwegprodukte nutzen", "B) LED-Lampen verwenden", "C) Längere Duschen", "D) Mehr Verpackung kaufen"],
  },
  {
    stem: "Was ist eine umweltfreundliche Option für unterwegs?",
    options: ["A) Allein mit dem Auto fahren", "B) Taxi statt Bus", "C) Öffentliche Verkehrsmittel", "D) Kürzere Wege vermeiden"],
  },
  {
    stem: "Welche Einkaufsgewohnheit ist nachhaltig?",
    options: ["A) Plastiktüten sammeln", "B) Saisonale Produkte kaufen", "C) Einwegbecher bevorzugen", "D) Mehr verpackte Ware kaufen"],
  },
  {
    stem: "Was wird als wichtiger Schlussgedanke betont?",
    options: [
      "A) Nur große Maßnahmen helfen",
      "B) Umweltschutz ist nur Aufgabe von Unternehmen",
      "C) Kleine Veränderungen vieler Menschen machen einen Unterschied",
      "D) Umweltschutz ist im Alltag nicht möglich",
    ],
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

const B1Day27UmweltfreundlichImAlltagWorkbookPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("sprechen");
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

        <h1 style={{ ...styles.title, marginBottom: 0 }}>B1 · Day 27 Workbook · Umweltfreundlich im Alltag</h1>
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
            src="https://images.unsplash.com/photo-1492496913980-501348b61469?auto=format&fit=crop&w=1600&q=80"
            alt="People discussing sustainable habits at home"
            loading="lazy"
            style={tabImageStyle}
          />
          <h2 style={sectionTitle}>Teil 1 (Sprechen) · Group Practice</h2>
          <p style={{ margin: 0, lineHeight: 1.7 }}>In this chapter, we&apos;ll engage in group exercises discussing these topics.</p>

          <h3 style={sectionTitle}>Umweltfreundlich im Alltag</h3>
          <p style={{ margin: 0 }}><strong>🏠 Zuhause</strong></p>
          <ul style={listSpacing}>
            <li>
              <strong>Energie sparen</strong>
              <ul style={listSpacing}>
                <li>LED-Lampen</li>
                <li>Geräte ausschalten (nicht auf Standby)</li>
                <li>Heizung richtig einstellen</li>
              </ul>
            </li>
            <li>
              <strong>Wasser sparen</strong>
              <ul style={listSpacing}>
                <li>Kurz duschen</li>
                <li>Wasserhahn zudrehen beim Zähneputzen</li>
              </ul>
            </li>
            <li>
              <strong>Müll trennen</strong>
              <ul style={listSpacing}>
                <li>Papier, Plastik, Biomüll, Restmüll</li>
                <li>Glascontainer nutzen</li>
              </ul>
            </li>
            <li>
              <strong>Umweltfreundliche Produkte kaufen</strong>
              <ul style={listSpacing}>
                <li>Bio-Produkte</li>
                <li>Recyclingpapier</li>
                <li>Nachfüllpackungen</li>
              </ul>
            </li>
          </ul>
          <p style={{ margin: 0 }}><strong>🚗 Unterwegs</strong></p>
          <ul style={listSpacing}>
            <li>Zu Fuß gehen / Fahrrad fahren</li>
            <li>Öffentliche Verkehrsmittel benutzen</li>
            <li>Fahrgemeinschaften bilden</li>
            <li>Weniger Auto fahren</li>
          </ul>
          <p style={{ margin: 0 }}><strong>🛍️ Einkaufen</strong></p>
          <ul style={listSpacing}>
            <li>Stofftaschen statt Plastiktüten</li>
            <li>Regionale &amp; saisonale Produkte</li>
            <li>Weniger Verpackung</li>
            <li>Keine Einwegprodukte</li>
          </ul>
          <p style={{ margin: 0 }}><strong>📚 Arbeit / Schule</strong></p>
          <ul style={listSpacing}>
            <li>Weniger Papier drucken</li>
            <li>Digital arbeiten</li>
            <li>Papier beidseitig nutzen</li>
            <li>Wiederverwendbare Flaschen &amp; Becher</li>
          </ul>
          <p style={{ margin: 0 }}><strong>💬 Bewusstsein &amp; Information</strong></p>
          <ul style={listSpacing}>
            <li>Umweltbildung (Dokumentationen, Bücher)</li>
            <li>Mit anderen über Umweltschutz sprechen</li>
            <li>Kindern Vorbild sein</li>
          </ul>

          <h3 style={sectionTitle}>Thema: Umweltfreundlich im Alltag – Gemeinsam planen</h3>
          <p style={{ margin: 0 }}>Plant zusammen, wie ihr euren Alltag umweltfreundlicher gestalten könnt. Nutzt dabei die folgende Struktur:</p>
          <ol style={listSpacing}>
            <li>Was kann man zu Hause tun? (z. B. Energie sparen, Wasser sparen, Müll trennen)</li>
            <li>
              Wie kann man umweltfreundlich einkaufen? (z. B. regionale Produkte kaufen, Stofftaschen benutzen,
              Verpackungen vermeiden)
            </li>
            <li>Wie kann man umweltfreundlich unterwegs sein? (z. B. Fahrrad oder Bus fahren, zu Fuß gehen, Fahrgemeinschaften bilden)</li>
            <li>Was fällt euch schwer? Was klappt gut?</li>
          </ol>

          <div style={{ ...questionCardStyle, background: "#f8fafc" }}>
            <strong>Speaking self-practice confidence check</strong>
            <p style={{ margin: 0 }}>Use this speaking self-practice tool to build confidence before class:</p>
            <a
              href="https://www.falowen.app/campus/speech"
              target="_blank"
              rel="noreferrer"
            >
              Open speaking self-practice
            </a>
          </div>

          <p style={{ margin: 0, color: "#4b5563" }}>
            Teil 1 is only for group discussion and has no assignment submission. Assignments start from Teil 2, Teil 3, and Teil 4.
          </p>

          <PreparedCheckbox checked={prepared.sprechen} onChange={setPreparedFor("sprechen")} />
        </div>
      )}

      {activeTab === "schreiben" && (
        <div style={card}>
          <img
            src="https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1600&q=80"
            alt="Learner writing an opinion text"
            loading="lazy"
            style={tabImageStyle}
          />
          <h2 style={sectionTitle}>Teil 2 (Schreiben) (Assignment)</h2>
          <p style={{ margin: 0 }}>
            Aufgabe: <strong>„Kann jeder Mensch umweltfreundlich leben? Schreiben Sie Ihre Meinung.“</strong>
          </p>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            Ahmed: Ich denke, dass jeder Mensch umweltfreundlich leben kann, aber es ist manchmal nicht so einfach. Manche Menschen leben in Städten,
            wo sie kein Auto brauchen, andere auf dem Land, wo es keine Busse gibt. Ich finde, man kann auch kleine Dinge tun: zum Beispiel
            Stofftaschen benutzen oder das Licht ausschalten, wenn man den Raum verlässt. Das kostet nichts und hilft trotzdem der Umwelt. Außerdem
            ist es wichtig, dass man in der Schule oder in den Medien über Umweltschutz spricht. So lernen mehr Menschen, warum es wichtig ist.
            Was meinen Sie dazu?
          </p>
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
            src="https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=1600&q=80"
            alt="Open book for reading comprehension practice"
            loading="lazy"
            style={tabImageStyle}
          />
          <h2 style={sectionTitle}>Teil 3 (Lesen) (Exercise)</h2>
          <p style={{ margin: 0 }}>
            Read the text and review the questions. <strong>Do not answer directly on this page.</strong> Use the submit section at the bottom of
            the lesson to send your answers.
          </p>

          <h3 style={sectionTitle}>Essay: „Die Umwelt schützen: Was können wir tun?“</h3>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            Die Umwelt zu schützen ist eine der größten Herausforderungen unserer Zeit. Es gibt viele Maßnahmen, die wir ergreifen können, um unseren
            Planeten zu schützen. Eine der effektivsten Methoden ist das Recycling. Durch das Wiederverwerten von Materialien wie Papier, Glas und
            Plastik können wir die Menge an Abfall reduzieren, der auf Deponien landet. Das spart nicht nur Platz, sondern auch Ressourcen. Ein
            weiterer wichtiger Aspekt ist der Energieverbrauch. Indem wir energieeffiziente Geräte nutzen und bewusster mit Energie umgehen, können
            wir unseren CO2-Fußabdruck verringern. Dies schließt auch den Einsatz erneuerbarer Energien wie Solar- oder Windkraft ein. Der
            Transport ist ein weiterer Bereich, in dem wir viel bewirken können. Wenn wir öfter das Fahrrad nutzen oder öffentliche Verkehrsmittel
            nehmen, reduzieren wir die Emissionen, die durch Autos verursacht werden. Auch das Carsharing kann eine umweltfreundliche Alternative
            sein. Nicht zuletzt spielt der Konsum eine große Rolle. Wir sollten bewusster einkaufen und Produkte bevorzugen, die umweltfreundlich
            hergestellt wurden. Dazu gehört auch, weniger Fleisch zu konsumieren, da die Fleischproduktion sehr ressourcenintensiv ist. Jeder
            Einzelne kann seinen Beitrag leisten. Wenn wir alle kleine Änderungen in unserem Alltag vornehmen, können wir gemeinsam große Erfolge
            erzielen. Der Schutz der Umwelt beginnt bei jedem von uns.
          </p>

          <h3 style={sectionTitle}>Questions</h3>
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
            alt="Headphones and laptop for listening exercise"
            loading="lazy"
            style={tabImageStyle}
          />
          <h2 style={sectionTitle}>Teil 4 (Hören) (Exercise)</h2>
          <p style={{ margin: 0 }}>
            Recommended audio/video: {" "}
            <a href="https://youtu.be/jzm-MnWC7I0" target="_blank" rel="noreferrer">
              https://youtu.be/jzm-MnWC7I0
            </a>
          </p>

          <iframe
            title="Umweltfreundlich im Alltag listening exercise"
            src="https://www.youtube.com/embed/jzm-MnWC7I0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            style={videoPreviewStyle}
          />

          <p style={{ margin: 0 }}>
            Listen carefully and answer the multiple-choice questions in the submission area. <strong>Do not answer directly on this page.</strong>
          </p>

          <h3 style={sectionTitle}>Hörverstehen: Fragen und Antwortoptionen</h3>
          {hoerenQuestions.map((question, index) => (
            <div key={question.stem} style={questionCardStyle}>
              <strong>{index + 1}. {question.stem}</strong>
              {question.options.map((option) => (
                <span key={option}>{option}</span>
              ))}
            </div>
          ))}

          <PreparedCheckbox checked={prepared.hoeren} onChange={setPreparedFor("hoeren")} />
        </div>
      )}
    </div>
  );
};

export default B1Day27UmweltfreundlichImAlltagWorkbookPage;
