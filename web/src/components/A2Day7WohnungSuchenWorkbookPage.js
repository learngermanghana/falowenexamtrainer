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

const lesenQuestions = [
  {
    stem: "1. Wo findet man Wohnungsanzeigen?",
    options: ["a) Nur in Supermärkten", "b) In Zeitungen und im Internet", "c) Nur beim Arbeitsamt", "d) Nur in Broschüren"],
  },
  {
    stem: "2. Was ist ein Immobilienmakler?",
    options: [
      "a) Eine Person, die Möbel verkauft",
      "b) Eine Person, die Stromanbieter vergleicht",
      "c) Eine Person, die bei der Wohnungssuche hilft",
      "d) Ein Handwerker für Wohnungen",
    ],
  },
  {
    stem: "3. Was gehört zur Warmmiete?",
    options: ["a) Nur die Kaltmiete", "b) Nur die Stromkosten", "c) Kaltmiete und Nebenkosten", "d) Nur das Internet"],
  },
  {
    stem: "4. Was ist eine Kaution?",
    options: [
      "a) Eine monatliche Rechnung",
      "b) Ein Betrag, den man beim Auszug zurückbekommt",
      "c) Eine Versicherung",
      "d) Ein Möbelstück vom Vormieter",
    ],
  },
  {
    stem: "5. Was ist ein Übergabeprotokoll?",
    options: [
      "a) Ein Vertrag für den Stromanbieter",
      "b) Eine Liste von Nachbarn",
      "c) Ein Formular, das Schäden in der Wohnung zeigt",
      "d) Eine Quittung für die Kaution",
    ],
  },
  {
    stem: "6. Wann ist in Deutschland Ruhezeit?",
    options: ["a) Nur zwischen 8–10 Uhr", "b) Von 12 bis 14 Uhr", "c) Von 22–7 Uhr und 13–15 Uhr", "d) Es gibt keine Ruhezeit"],
  },
  {
    stem: "7. Was macht man mit Glas und Dosen?",
    options: ["a) In die schwarze Mülltonne werfen", "b) Im Garten vergraben", "c) Zum Wertstoffcontainer bringen", "d) Im Hausflur lagern"],
  },
];

const hoerenQuestions = [
  {
    stem: "1. In welchem Stockwerk befindet sich die Wohnung?",
    options: ["a) Im ersten Stock", "b) Im zweiten Stock", "c) Im dritten Stock", "d) Im Erdgeschoss"],
  },
  {
    stem: "2. Wie groß ist die Wohnung?",
    options: ["a) 70 Quadratmeter", "b) 75 Quadratmeter", "c) 80 Quadratmeter", "d) 65 Quadratmeter"],
  },
  {
    stem: "3. Wie viele Zimmer hat die Wohnung?",
    options: ["a) Zwei", "b) Drei", "c) Vier", "d) Fünf"],
  },
  {
    stem: "4. Was gehört zur Wohnung?",
    options: ["a) Ein Balkon", "b) Ein Garten", "c) Eine Garage", "d) Ein Kellerraum"],
  },
  {
    stem: "5. Wie hoch sind die Nebenkosten?",
    options: ["a) 100 Euro", "b) 150 Euro", "c) 200 Euro", "d) 250 Euro"],
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

const A2Day7WohnungSuchenWorkbookPage = () => {
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

        <h1 style={{ ...styles.title, marginBottom: 0 }}>A2 · Day 7 Workbook · Eine Wohnung suchen (Übung) 3.7</h1>
        <p style={{ ...styles.subtitle, margin: 0 }}>
          4-part workbook: group speaking, writing, reading, and listening practice focused on apartment search.
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
            alt="Students discussing apartment search ideas in class"
            loading="lazy"
            style={{ width: "100%", borderRadius: 10, maxHeight: 260, objectFit: "cover" }}
          />
          <h2 style={sectionTitle}>Teil 1 (Sprechen) · Group Practice</h2>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            In this chapter, we&apos;ll engage in group exercises discussing apartment search in German.
          </p>

          <h3 style={sectionTitle}>Instructions</h3>
          <ol style={listSpacing}>
            <li>
              <strong>Central Topic:</strong> Write <strong>„Eine Wohnung suchen“</strong> in the center of your brain map.
            </li>
            <li>
              <strong>Main Branches:</strong> Create five main branches from the central topic.
            </li>
            <li>
              <strong>Sub-Branches:</strong> Expand each branch with examples and phrases.
            </li>
          </ol>

          <h3 style={sectionTitle}>Main Branches and Ideas</h3>
          <ol style={listSpacing}>
            <li>
              <strong>Wichtige Fragen beim Wohnungssuchen</strong>
              <ul style={listSpacing}>
                <li>Wie viele Zimmer hat die Wohnung?</li>
                <li>Ist die Wohnung möbliert oder unmöbliert?</li>
                <li>Wann kann ich die Wohnung besichtigen?</li>
                <li>Ist die Wohnung in einem ruhigen oder lauten Gebiet?</li>
                <li>Wie hoch ist die Miete?</li>
              </ul>
            </li>
            <li>
              <strong>Wohnungstypen und Merkmale</strong>
              <ul style={listSpacing}>
                <li>Einzimmerwohnung, Zweizimmerwohnung, Dachgeschosswohnung, Erdgeschosswohnung</li>
                <li>Altbau, Neubau</li>
                <li>Balkon/Terrasse, Küche, Bad mit Dusche oder Badewanne</li>
              </ul>
            </li>
            <li>
              <strong>Preise und Budget</strong>
              <ul style={listSpacing}>
                <li>Wie hoch ist die Kaltmiete?</li>
                <li>Nebenkosten, Gesamtmiete, Kaution</li>
                <li>Ich habe ein Budget von ... Euro.</li>
              </ul>
            </li>
            <li>
              <strong>Standort und Umgebung</strong>
              <ul style={listSpacing}>
                <li>Wie weit ist es von der Arbeit entfernt?</li>
                <li>Gibt es öffentliche Verkehrsmittel in der Nähe?</li>
                <li>Ist die Nachbarschaft sicher?</li>
                <li>Gibt es Geschäfte, Schulen oder Freizeitmöglichkeiten in der Nähe?</li>
                <li>Lärmbelästigung in der Umgebung?</li>
              </ul>
            </li>
            <li>
              <strong>Mietvertrag und Bedingungen</strong>
              <ul style={listSpacing}>
                <li>Dauer des Mietvertrags, Kündigungsfrist, Hausordnung</li>
                <li>Erlaubnis für Haustiere</li>
                <li>Möbel/Renovierung</li>
              </ul>
            </li>
          </ol>

          <h3 style={sectionTitle}>Nützliche Ausdrücke</h3>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            sich eine Wohnung ansehen · einen Mietvertrag unterschreiben · eine Wohnung mieten · eine Wohnung vermieten ·
            umziehen · die Miete überweisen · den Mietvertrag kündigen · die Wohnung renovieren · die Wohnung einrichten ·
            die Nachbarn kennenlernen
          </p>

          <h3 style={sectionTitle}>Group Discussion Questions</h3>
          <ul style={listSpacing}>
            <li>Was ist dir wichtig bei der Wohnungssuche?</li>
            <li>Miete</li>
            <li>Lage</li>
            <li>Haus oder Wohnung</li>
            <li>Nachbarn</li>
          </ul>

          <div style={{ ...questionCardStyle, background: "#f8fafc" }}>
            <strong>Speaking self-practice confidence check</strong>
            <p style={{ margin: 0 }}>Use this speaking self-practice tool to build confidence before class:</p>
            <a href="https://www.falowen.app/campus/speech" target="_blank" rel="noreferrer">
              Open speaking self-practice
            </a>
          </div>

          <p style={{ margin: 0, color: "#4b5563" }}>
            Teil 1 is for group practice only and has no assignment submission.
          </p>

          <PreparedCheckbox checked={prepared.sprechen} onChange={setPreparedFor("sprechen")} />
        </div>
      )}

      {activeTab === "schreiben" && (
        <div style={card}>
          <img
            src="https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1600&q=80"
            alt="Student writing a formal email assignment"
            loading="lazy"
            style={{ width: "100%", borderRadius: 10, maxHeight: 260, objectFit: "cover" }}
          />
          <h2 style={sectionTitle}>Teil 2 (Schreiben) · Assignment</h2>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            <strong>Formal Letter Writing Assignment: „Eine Wohnung suchen“</strong>
          </p>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            Sie möchten eine Wohnung in einer bestimmten Stadt mieten. Schreiben Sie eine E-Mail an den Vermieter:
          </p>
          <ol style={listSpacing}>
            <li>Fragen Sie nach einer verfügbaren Wohnung.</li>
            <li>Geben Sie an, welche Kriterien für Sie wichtig sind (z.B. Größe, Lage, Preis).</li>
            <li>Fragen Sie nach den Mietbedingungen und der Möglichkeit, die Wohnung zu besichtigen.</li>
          </ol>

          <div style={{ ...questionCardStyle, background: "#f8fafc" }}>
            <strong>Writing practice before submission</strong>
            <p style={{ margin: 0 }}>
              Before submitting your final answer, practise your ideas and structure in the writing lab. You can use the
              Ideas Generator for support.
            </p>
            <a href="https://www.falowen.app/campus/writing" target="_blank" rel="noreferrer">
              Open writing practice
            </a>
          </div>

          <p style={{ margin: 0, color: "#4b5563" }}>
            Submit your final writing in the assignment submission area, not directly on this page.
          </p>

          <PreparedCheckbox checked={prepared.schreiben} onChange={setPreparedFor("schreiben")} />
        </div>
      )}

      {activeTab === "lesen" && (
        <div style={card}>
          <img
            src="https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1600&q=80"
            alt="Apartment interior for reading comprehension topic"
            loading="lazy"
            style={{ width: "100%", borderRadius: 10, maxHeight: 260, objectFit: "cover" }}
          />
          <h2 style={sectionTitle}>Teil 3 (Lesen) · Assignment</h2>

          <p style={{ margin: 0, lineHeight: 1.7 }}>
            <strong>Wohnungssuche – Lesetext und Aufgaben (A2-Niveau)</strong>
          </p>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            Sie suchen eine Wohnung? In vielen Zeitungen sind Wohnungsanzeigen, meistens am Freitag oder Samstag.
            Wohnungsanzeigen findet man auch auf den Internetseiten der Zeitung. Es gibt auch eigene Immobilienseiten im
            Internet. Auch das Wohnungsamt Ihrer Stadt oder Gemeinde hilft oft bei der Suche. In manchen Regionen findet
            man leicht eine Wohnung. In anderen Regionen ist es sehr schwer, eine Wohnung zu bekommen. Dann kann ein
            Immobilienmakler bei der Suche helfen. Wenn er eine Wohnung für Sie findet, müssen Sie ihn bezahlen.
            Normalerweise bekommt ein Makler die Summe von 2 bis 3 Monatsmieten als Provision.
          </p>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            In den Anzeigen steht meist, wie viel Miete Sie für die Wohnung bezahlen müssen. Das ist aber oft nur die
            Kaltmiete. Sie müssen dazu noch die Nebenkosten zahlen. Die Kaltmiete und die Nebenkosten zusammen heißen
            Warmmiete. Die komplette Warmmiete überweisen Sie jeden Monat an Ihren Vermieter. Oft wollen die Vermieter
            von ihren Mietern eine Kaution. Sie darf maximal 3 Kaltmieten betragen. Beim Auszug bekommt der Mieter die
            Kaution zurück.
          </p>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            Alle Informationen zu Miete und Kaution stehen im Mietvertrag. Dort steht auch, ob Sie die Wohnung beim
            Auszug renovieren müssen, und wie lang die Kündigungsfrist ist. Oft müssen Sie ein Übergabeprotokoll
            unterschreiben, wenn Sie in eine Wohnung einziehen. Im Übergabeprotokoll steht zum Beispiel, ob etwas in der
            Wohnung kaputt ist.
          </p>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            In Deutschland gibt es Ruhezeiten, normalerweise von 22–7 Uhr sowie von 13–15 Uhr. An Sonntagen und
            Feiertagen ist den ganzen Tag Ruhezeit. Es gibt außerdem unterschiedliche Mülltonnen. Glas, Dosen oder
            elektrische Geräte bringt man zu speziellen Sammelstellen oder Containern.
          </p>

          <h3 style={sectionTitle}>Verstehen Sie den Text? – Beantworten Sie die Fragen</h3>
          <div style={{ display: "grid", gap: 10 }}>
            {lesenQuestions.map((question) => (
              <div key={question.stem} style={questionCardStyle}>
                <strong>{question.stem}</strong>
                {question.options.map((option) => (
                  <span key={option}>{option}</span>
                ))}
              </div>
            ))}
          </div>

          <p style={{ margin: 0, color: "#4b5563" }}>
            Submit your final answers in the assignment submission area, not directly on this page.
          </p>

          <PreparedCheckbox checked={prepared.lesen} onChange={setPreparedFor("lesen")} />
        </div>
      )}

      {activeTab === "hoeren" && (
        <div style={card}>
          <img
            src="https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1600&q=80"
            alt="Person listening and reviewing apartment information"
            loading="lazy"
            style={{ width: "100%", borderRadius: 10, maxHeight: 260, objectFit: "cover" }}
          />
          <h2 style={sectionTitle}>Teil 4 (Hören) · Exercise</h2>

          <p style={{ margin: 0, lineHeight: 1.7 }}>
            Audio link: <a href="https://drive.google.com/file/d/1ULPeE_f3e12R4TXJaB2LE5qO7sa6vY0t/view?usp=sharing" target="_blank" rel="noreferrer">Open listening audio</a>
          </p>

          <h3 style={sectionTitle}>Multiple-Choice-Fragen</h3>
          <div style={{ display: "grid", gap: 10 }}>
            {hoerenQuestions.map((question) => (
              <div key={question.stem} style={questionCardStyle}>
                <strong>{question.stem}</strong>
                {question.options.map((option) => (
                  <span key={option}>{option}</span>
                ))}
              </div>
            ))}
          </div>

          <label style={{ display: "inline-flex", alignItems: "center", gap: 8, fontWeight: 600 }}>
            <input type="checkbox" checked={teacherMode} onChange={(event) => setTeacherMode(event.target.checked)} />
            Teacher mode (show transcript)
          </label>

          {teacherMode && (
            <div style={{ ...questionCardStyle, background: "#f8fafc" }}>
              <strong>Transcript (Teacher support)</strong>
              <p style={{ margin: 0, lineHeight: 1.7 }}>
                Die Wohnung liegt im zweiten Stock und ist 75 Quadratmeter groß. Sie hat drei Zimmer und einen Balkon.
                Die Nebenkosten betragen 150 Euro pro Monat.
              </p>
            </div>
          )}

          <div style={questionCardStyle}>
            <strong>Vocabulary List: Wohnung suchen</strong>
            <p style={{ margin: 0, lineHeight: 1.7 }}>
              die Wohnung, die Wohnungssuche, die Wohnungsanzeige, die Zeitung, das Internet, das Wohnungsamt, die
              Region, der Immobilienmakler, die Provision, die Miete, die Kaltmiete, die Nebenkosten, die Warmmiete,
              der Vermieter, der Mieter, der Herd, der Kühlschrank, die Ablöse, die Kaution, der Mietvertrag, das
              Übergabeprotokoll, die Hausordnung, die Ruhezeit, die Mülltonne, der Flur, der Gehweg.
            </p>
          </div>

          <p style={{ margin: 0, color: "#4b5563" }}>
            Submit your final listening answers in the assignment submission area, not directly on this page.
          </p>

          <PreparedCheckbox checked={prepared.hoeren} onChange={setPreparedFor("hoeren")} />
        </div>
      )}
    </div>
  );
};

export default A2Day7WohnungSuchenWorkbookPage;
