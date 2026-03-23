import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { styles } from "../styles";
import CoursebookAudioPlayer from "./CoursebookAudioPlayer";

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
    stem: "1. Was steht im Grundgesetz?",
    options: [
      "a) Die Namen aller Politiker in Deutschland",
      "b) Die wichtigsten rechtlichen und politischen Regeln",
      "c) Die Schulnoten der Schüler in Deutschland",
    ],
  },
  {
    stem: "2. Was ist ein Beispiel für eine Pflicht laut Grundgesetz?",
    options: ["a) Man muss einen Führerschein haben", "b) Man muss eine Partei gründen", "c) Man muss Steuern zahlen"],
  },
  {
    stem: "3. Welche Aussage über das Wahlrecht ist richtig?",
    options: ["a) Nur Männer dürfen in Deutschland wählen", "b) EU-Bürger dürfen bei Kommunalwahlen wählen", "c) Wählen darf man nur ab 21 Jahren"],
  },
  {
    stem: "4. Was macht ein Integrationsbeirat?",
    options: ["a) Er kontrolliert den Unterricht in Schulen", "b) Er vertritt die Interessen von Migranten", "c) Er plant neue Autobahnen"],
  },
  {
    stem: "5. Welche Religionen haben in deutschen Schulen meist eigenen Unterricht?",
    options: [
      "a) Christlich-orthodox, jüdisch, islamisch, evangelisch, katholisch",
      "b) Nur buddhistisch",
      "c) Nur atheistisch",
    ],
  },
  {
    stem: "6. Seit wann dürfen gleichgeschlechtliche Paare in Deutschland heiraten?",
    options: ["a) Seit 2005", "b) Seit 1. Oktober 2017", "c) Seit 1990"],
  },
  {
    stem: "7. Was bedeutet Religionsfreiheit in Deutschland?",
    options: ["a) Man darf keine Religion öffentlich zeigen", "b) Der Staat bestimmt die Religion", "c) Jeder darf seine Religion frei wählen und ausüben"],
  },
];

const hoerenQuestions = [
  {
    stem: "1. Wo findet das Oktoberfest statt?",
    options: ["a) Berlin", "b) Hamburg", "c) München", "d) Frankfurt"],
  },
  {
    stem: "2. Wie lange dauert das Oktoberfest?",
    options: ["a) Eine Woche", "b) Zwei Wochen", "c) Drei Wochen", "d) Vier Wochen"],
  },
  {
    stem: "3. Welche traditionellen Gerichte werden auf dem Oktoberfest serviert?",
    options: [
      "a) Pizza und Pasta",
      "b) Brezeln, Bratwurst und Schweinebraten",
      "c) Sushi und Ramen",
      "d) Tacos und Burritos",
    ],
  },
  {
    stem: "4. Welche Kleidung tragen viele Menschen auf dem Oktoberfest?",
    options: ["a) Anzüge und Kleider", "b) Lederhosen und Dirndl", "c) Jeans und T-Shirts", "d) Bademode"],
  },
  {
    stem: "5. Was gibt es neben Essen und Trinken noch auf dem Oktoberfest?",
    options: ["a) Konzerte und Opern", "b) Fahrgeschäfte und Spiele", "c) Sportveranstaltungen", "d) Filmvorführungen"],
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

const A2Day10TourismusTraditionelleFesteWorkbookPage = () => {
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

        <h1 style={{ ...styles.title, marginBottom: 0 }}>A2 · Day 10 Workbook · Tourismus und Traditionelle Feste 4.10</h1>
        <p style={{ ...styles.subtitle, margin: 0 }}>
          4-part workbook: group speaking, writing, reading, and listening practice focused on tourism and traditional festivals.
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
            src="https://images.unsplash.com/photo-1539650116574-75c0c6d73b49?auto=format&fit=crop&w=1600&q=80"
            alt="Festive city square with visitors and traditional decorations"
            loading="lazy"
            style={{ width: "100%", borderRadius: 10, maxHeight: 260, objectFit: "cover" }}
          />
          <h2 style={sectionTitle}>Teil 1 (Sprechen) · Group Practice</h2>
          <p style={{ margin: 0, lineHeight: 1.7 }}>In this chapter, we&apos;ll engage in group exercises discussing these topics.</p>

          <h3 style={sectionTitle}>🟠 Zentrales Thema: „Tourismus und Traditionelle Feste“</h3>
          <h3 style={sectionTitle}>1. Tourismus (Vorteile &amp; Nachteile)</h3>
          <p style={{ margin: 0 }}><strong>Vorteile:</strong></p>
          <ul style={listSpacing}>
            <li>Neue Kulturen entdecken (Andere Länder und Menschen kennenlernen)</li>
            <li>Entspannung und Erholung (Urlaub, Freizeit, Strand, Natur)</li>
            <li>Wirtschaftlicher Nutzen (Hotels, Restaurants, Arbeitsplätze)</li>
            <li>Kulturelle Sehenswürdigkeiten besuchen (Museen, Kirchen, Burgen)</li>
            <li>Sprache üben (Mit Einheimischen sprechen, neue Wörter lernen)</li>
          </ul>
          <p style={{ margin: 0 }}><strong>Nachteile:</strong></p>
          <ul style={listSpacing}>
            <li>Hohe Kosten (Flüge, Hotels, Restaurants teuer)</li>
            <li>Umweltverschmutzung (Viele Touristen → mehr Müll und Lärm)</li>
            <li>Zu viele Touristen (Überfüllte Strände, lange Wartezeiten)</li>
            <li>Kulturelle Missverständnisse (Andere Sitten und Gewohnheiten)</li>
            <li>Stressige Reiseplanung (Flüge, Hotels, Koffer packen)</li>
          </ul>

          <h3 style={sectionTitle}>2. Arten von Tourismus</h3>
          <p style={{ margin: 0 }}><strong>Beliebte Reisearten:</strong></p>
          <ul style={listSpacing}>
            <li>Städtetourismus (Berlin, München, Hamburg)</li>
            <li>Naturtourismus (Berge, Seen, Wanderungen)</li>
            <li>Strandurlaub (Meer, Sonne, Entspannung)</li>
            <li>Kulturtourismus (Museen, Musik, Theater)</li>
            <li>Abenteuertourismus (Ski, Tauchen, Extremsport)</li>
          </ul>

          <h3 style={sectionTitle}>3. Traditionelle Feste in Deutschland</h3>
          <p style={{ margin: 0 }}><strong>Wichtige Feste:</strong></p>
          <ul style={listSpacing}>
            <li>Oktoberfest (Bier, Trachten, Volksmusik, München)</li>
            <li>Weihnachten (Weihnachtsmärkte, Geschenke, Familie)</li>
            <li>Karneval (Kostüme, Umzüge, Musik, Köln)</li>
            <li>Ostern (Ostereier, Schokolade, Frühling)</li>
            <li>Silvester (Feuerwerk, Sekt, Neujahr)</li>
          </ul>

          <h3 style={sectionTitle}>4. Warum sind Feste wichtig?</h3>
          <p style={{ margin: 0 }}><strong>Bedeutung von Festen:</strong></p>
          <ul style={listSpacing}>
            <li>Kultur und Traditionen bewahren</li>
            <li>Gemeinschaft und Zusammenhalt stärken</li>
            <li>Freude und Spaß für Familien und Freunde</li>
            <li>Tourismus fördern (Mehr Besucher in Städten)</li>
            <li>Besondere Erlebnisse für Kinder und Erwachsene</li>
          </ul>

          <h3 style={sectionTitle}>5. Meine Erfahrungen mit Tourismus und Festen</h3>
          <p style={{ margin: 0 }}><strong>Fragen zur Diskussion:</strong></p>
          <ul style={listSpacing}>
            <li>War ich schon einmal Tourist in einem anderen Land?</li>
            <li>Welches traditionelle Fest gefällt mir am besten? Warum?</li>
            <li>Möchte ich einmal am Oktoberfest oder Karneval teilnehmen?</li>
            <li>Welche Feste gibt es in meinem Heimatland?</li>
            <li>Reist man lieber in Gruppen oder allein?</li>
          </ul>

          <h3 style={sectionTitle}>Group Discussion</h3>
          <p style={{ margin: 0 }}>Welche Feste gibt es in deinem Land und welche Orte besuchen Touristen gern?</p>
          <ul style={listSpacing}>
            <li>Fest</li>
            <li>Tradition</li>
            <li>Touristen</li>
            <li>Sehenswürdigkeiten</li>
          </ul>

          <div style={{ ...questionCardStyle, background: "#f8fafc" }}>
            <strong>Speaking self-practice confidence check</strong>
            <p style={{ margin: 0 }}>Use this speaking self-practice tool to build confidence before class:</p>
            <a href="https://www.falowen.app/campus/speech" target="_blank" rel="noreferrer">
              Open speaking self-practice
            </a>
          </div>

          <p style={{ margin: 0, color: "#4b5563" }}>Teil 1 is for group practice only and has no assignment submission.</p>

          <PreparedCheckbox checked={prepared.sprechen} onChange={setPreparedFor("sprechen")} />
        </div>
      )}

      {activeTab === "schreiben" && (
        <div style={card}>
          <img
            src="https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1600&q=80"
            alt="Learner writing an invitation letter for a festival"
            loading="lazy"
            style={{ width: "100%", borderRadius: 10, maxHeight: 260, objectFit: "cover" }}
          />
          <h2 style={sectionTitle}>Teil 2 (Schreiben) · Assignment</h2>
          <p style={{ margin: 0, lineHeight: 1.7 }}><strong>Informelle Brief Aufgabe:</strong></p>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            Schreiben Sie einen Brief an einen Freund oder eine Freundin, in dem Sie ihn oder sie zu einem Fest einladen.
          </p>
          <p style={{ margin: 0 }}>In Ihrem Brief sollten Sie folgende Punkte ansprechen:</p>
          <ol style={listSpacing}>
            <li>Erzählen Sie von dem Fest und warum es besonders ist.</li>
            <li>Laden Sie die Person ein, mit Ihnen zu kommen und geben Sie Details (Datum, Ort).</li>
            <li>Erklären Sie, was die Person mitbringen sollte oder was sie erwarten kann.</li>
          </ol>

          <div style={{ ...questionCardStyle, background: "#f8fafc" }}>
            <strong>Writing practice guidance</strong>
            <p style={{ margin: 0, lineHeight: 1.7 }}>
              Draft your letter first and submit your final answer in the assignment submission area below the lesson,
              not directly on this page.
            </p>
            <p style={{ margin: 0 }}>
              Practice before submitting on the writing page:{" "}
              <a href="https://www.falowen.app/campus/writing" target="_blank" rel="noreferrer">
                Open Writing Practice
              </a>{" "}
              (learners can use the Ideas Generator there for support).
            </p>
          </div>

          <PreparedCheckbox checked={prepared.schreiben} onChange={setPreparedFor("schreiben")} />
        </div>
      )}

      {activeTab === "lesen" && (
        <div style={card}>
          <img
            src="https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?auto=format&fit=crop&w=1600&q=80"
            alt="Open constitution book and notes for reading comprehension"
            loading="lazy"
            style={{ width: "100%", borderRadius: 10, maxHeight: 260, objectFit: "cover" }}
          />
          <h2 style={sectionTitle}>Teil 3 (Lesen)</h2>
          <p style={{ margin: 0 }}>
            Read the text carefully and complete your answers in the submission area, <strong>not directly on this page.</strong>
          </p>

          <h3 style={sectionTitle}>Grundrechte und gesellschaftliches Leben in Deutschland</h3>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            Die deutsche Verfassung heißt Grundgesetz. Im Grundgesetz stehen die wichtigsten rechtlichen und politischen Regeln der
            Bundesrepublik Deutschland. Im Grundgesetz steht zum Beispiel, dass Deutschland ein demokratischer Staat ist.
          </p>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            Das heißt: Jeder kann beim politischen Leben mitmachen, zum Beispiel in Verbänden, Initiativen, Gewerkschaften oder
            Parteien. Die politischen Parteien haben verschiedene Programme und Ziele. Die größten Parteien heißen SPD
            (Sozialdemokratische Partei Deutschland), CDU (Christlich Demokratische Union), Bündnis 90/Die Grünen, FDP (Freie
            Demokratische Partei), AfD (Alternative für Deutschland) und Die Linke. Es gibt noch viele andere kleinere Parteien.
          </p>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            Im Grundgesetz stehen auch die Rechte und Pflichten von Menschen in Deutschland. Wichtige Pflichten sind die Schulpflicht,
            die Steuerpflicht und die Pflicht zur Einhaltung der Gesetze.
          </p>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            Und das sind wichtige Rechte: die Menschenwürde, die Gleichberechtigung, die Gleichheit vor dem Gesetz, das Recht auf freie
            Meinungsäußerung, die Versammlungsfreiheit, die Freizügigkeit und die Berufsfreiheit. Weitere Rechte sind der Schutz von Ehe
            und Familie, das Wahlrecht und die Religionsfreiheit.
          </p>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            Das Wahlrecht sagt: Die Menschen in Deutschland dürfen wählen und sie dürfen auch gewählt werden. Die Wahlen müssen geheim,
            allgemein und frei sein. Es gibt die Europawahl, die Bundestagswahl, die Landtagswahl und die Kommunalwahl. Bei den
            Europawahlen und Kommunalwahlen dürfen auch alle EU-Bürger wählen, die in Deutschland wohnen.
          </p>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            Normalerweise ist das ab 18 Jahren. In einigen Bundesländern kann man bei Kommunalwahlen auch schon ab 16 Jahren wählen.
            Bei den Landtagswahlen und den Bundestagswahlen dürfen nur deutsche Bürger wählen, die mindestens 18 Jahre alt sind.
          </p>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            An vielen Orten gibt es Integrationsräte oder Integrationsbeiräte. Sie werden normalerweise von Migranten gewählt.
            Die Integrationsbeiräte arbeiten für die politischen Interessen von Migranten, helfen auch bei Fragen und Problemen und
            wollen das Zusammenleben von Migranten und Deutschen verbessern.
          </p>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            Die Religionsfreiheit sagt: Jeder darf seine Religion frei wählen und darf sie ausüben. Ungefähr ein Drittel der Menschen
            in Deutschland hat offiziell keine Religion. Die meisten Deutschen gehören der christlichen Religion an – sie sind
            römisch-katholisch oder evangelisch. Viele christliche Feiertage wie Weihnachten oder Ostern sind gesetzliche Feiertage.
          </p>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            In den Schulen gibt es evangelischen und katholischen Religionsunterricht und in manchen Schulen auch christlich-orthodoxen,
            jüdischen und islamischen Religionsunterricht. Die Eltern entscheiden, ob ihr Kind zum Religionsunterricht gehen soll –
            und zu welchem.
          </p>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            In Deutschland kann die sexuelle Orientierung offen ausgelebt werden. Das bedeutet: gleichgeschlechtliche Liebe, Bi-,
            Trans- und Intersexualität gehören genauso zum Alltag wie Heterosexualität. Auch in Deutschland spielt die LGBTQ-Bewegung
            eine wichtige Rolle. Seit dem 1. Oktober 2017 dürfen auch gleichgeschlechtliche Paare in Deutschland mit allen Rechten
            und Pflichten heiraten.
          </p>

          <h3 style={sectionTitle}>Fragen und mögliche Antworten</h3>
          {lesenQuestions.map((question) => (
            <div key={question.stem} style={questionCardStyle}>
              <strong>{question.stem}</strong>
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
            src="https://images.unsplash.com/photo-1485579149621-3123dd979885?auto=format&fit=crop&w=1600&q=80"
            alt="Traditional Oktoberfest scene for listening exercise"
            loading="lazy"
            style={{ width: "100%", borderRadius: 10, maxHeight: 260, objectFit: "cover" }}
          />
          <h2 style={sectionTitle}>Teil 4 (Hören) · Exercise</h2>
          <p style={{ margin: 0 }}>
            Listen carefully and answer the questions in your assignment submission area, not directly on this page.
          </p>

          <CoursebookAudioPlayer
            url="https://drive.google.com/file/d/1P2gWG8eZ12BuqDRi0VL8VwVnhJvP-l2Y/view?usp=sharing"
            linkLabel="Open listening audio"
          />

          <h3 style={sectionTitle}>Fragen und mögliche Antworten</h3>
          {hoerenQuestions.map((question) => (
            <div key={question.stem} style={questionCardStyle}>
              <strong>{question.stem}</strong>
              {question.options.map((option) => (
                <span key={option}>{option}</span>
              ))}
            </div>
          ))}

          <label style={{ display: "inline-flex", alignItems: "center", gap: 8, fontWeight: 600 }}>
            <input type="checkbox" checked={teacherMode} onChange={(event) => setTeacherMode(event.target.checked)} />
            Teacher mode (show transcript)
          </label>

          {teacherMode && (
            <div style={{ ...questionCardStyle, background: "#f8fafc" }}>
              <strong>Transcript (Teacher Mode)</strong>
              <p style={{ margin: 0, lineHeight: 1.7 }}>
                Das Oktoberfest findet in München statt und dauert ungefähr zwei Wochen. Viele Besucher genießen traditionelle
                Speisen wie Brezeln, Bratwurst und Schweinebraten. Typische Kleidung sind Lederhosen und Dirndl. Neben Essen und
                Trinken gibt es auf dem Fest auch Fahrgeschäfte und Spiele für Familien und Freunde.
              </p>
            </div>
          )}

          <h3 style={sectionTitle}>Recommended Video</h3>
          <p style={{ margin: 0 }}>
            Deutsche Welle — Oktoberfest: {" "}
            <a href="https://youtu.be/XFxV3GSSm8E" target="_blank" rel="noreferrer">
              https://youtu.be/XFxV3GSSm8E
            </a>
          </p>
          <iframe
            title="Recommended video for Tourismus und Traditionelle Feste"
            src="https://www.youtube.com/embed/XFxV3GSSm8E"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={videoPreviewStyle}
          />

          <PreparedCheckbox checked={prepared.hoeren} onChange={setPreparedFor("hoeren")} />
        </div>
      )}
    </div>
  );
};

export default A2Day10TourismusTraditionelleFesteWorkbookPage;
