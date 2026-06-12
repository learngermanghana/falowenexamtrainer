import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { styles } from "../styles";
import SpeakingPracticeTimerCard from "./SpeakingPracticeTimerCard";
import CourseInlinePracticePanel from "./CourseInlinePracticePanel";
import { A2B1WorkbookGuidance, WorkbookSubmissionReminder } from "./A2B1WorkbookGuidance";

const tabs = [
  { key: "sprechen", label: "Teil 1 · Sprechen" },
  { key: "schreiben", label: "Teil 2 · Schreiben" },
  { key: "lesen", label: "Teil 3 · Lesen" },
  { key: "hoeren", label: "Teil 4 · Hören" },
];

const card = { ...styles.card, display: "grid", gap: 12 };
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
const phraseGridStyle = {
  display: "grid",
  gap: 10,
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
};

const lesenQuestions = [
  {
    stem: "Was braucht man zur Einreise nach Deutschland?",
    options: [
      "A) Einen Mietvertrag",
      "B) Einen deutschen Führerschein",
      "C) Einen gültigen Reisepass",
      "D) Ein Bankkonto",
    ],
  },
  {
    stem: "Wo bekommt man ein Visum für Deutschland?",
    options: [
      "A) Beim Einwohnermeldeamt",
      "B) Bei der Deutschen Botschaft im Heimatland",
      "C) Beim Jugendamt",
      "D) Bei der Arbeitsagentur",
    ],
  },
  {
    stem: "Was bekommt man bei der Ausländerbehörde?",
    options: [
      "A) Ein Bankkonto",
      "B) Einen Aufenthaltstitel",
      "C) Einen Führerschein",
      "D) Einen Arbeitsvertrag",
    ],
  },
  {
    stem: "Was ist ein Integrationskurs?",
    options: [
      "A) Ein Kurs zum Autofahren",
      "B) Ein Kurs für Deutsch und Leben in Deutschland",
      "C) Ein Kurs über Finanzen",
      "D) Ein Sportkurs",
    ],
  },
  {
    stem: "Was macht man mit Dokumenten aus dem Heimatland, wenn man arbeiten möchte?",
    options: [
      "A) Man wirft sie weg",
      "B) Man muss sie verstecken",
      "C) Man muss sie übersetzen und anerkennen lassen",
      "D) Man schickt sie an das Jugendamt",
    ],
  },
  {
    stem: "Wer hilft bei der Arbeitssuche?",
    options: ["A) Das Kino", "B) Das Rathaus", "C) Die Arbeitsagentur", "D) Die Polizei"],
  },
  {
    stem: "Welche Versicherungen sind besonders wichtig?",
    options: [
      "A) Auto- und Handyversicherung",
      "B) Reise- und Hausratversicherung",
      "C) Kranken-, Renten- und Pflegeversicherung",
      "D) Lebensversicherung und Haftpflichtversicherung",
    ],
  },
];

const hoerenQuestions = [
  {
    stem: "Worum geht es im Video / Audio?",
    options: [
      "A) Nur um Hobbys",
      "B) Um Zukunftspläne und Ziele",
      "C) Nur um Essen",
      "D) Um Beschwerden im Geschäft",
    ],
  },
  {
    stem: "Welche Zeitform passt oft zu Zukunftsplänen?",
    options: ["A) Futur I", "B) Perfekt", "C) Genitiv", "D) Imperativ"],
  },
  {
    stem: "Was sollst du nach dem Hören machen?",
    options: [
      "A) Deine Antworten selbstständig prüfen",
      "B) Nichts machen",
      "C) Nur die Bilder anschauen",
      "D) Die Aufgaben löschen",
    ],
  },
];

const PreparedCheckbox = ({ checked, onChange }) => (
  <label style={{ display: "inline-flex", alignItems: "center", gap: 8, fontWeight: 600 }}>
    <input type="checkbox" checked={checked} onChange={onChange} />I prepared this part.
  </label>
);

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

const A2Day28UeberDieZukunftSprechenWorkbookPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("sprechen");
  const [prepared, setPrepared] = useState({
    sprechen: false,
    schreiben: false,
    lesen: false,
    hoeren: false,
  });

  const activeIndex = useMemo(
    () => tabs.findIndex((tab) => tab.key === activeTab),
    [activeTab],
  );
  const setPreparedFor = (tabKey) => (event) =>
    setPrepared((prev) => ({ ...prev, [tabKey]: event.target.checked }));

  return (
    <div style={{ ...styles.container, display: "grid", gap: 16 }}>
      <div style={card}>
        <button
          style={{ ...styles.secondaryButton, width: "fit-content" }}
          onClick={() => navigate("/campus/course")}
        >
          Back to Course
        </button>
        <h1 style={{ ...styles.title, marginBottom: 0 }}>
          A2 · Day 28 Workbook · Über die Zukunft sprechen
        </h1>
        <p style={{ ...styles.subtitle, margin: 0 }}>
          4-part workbook: group speaking, writing, reading and listening practice.
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {tabs.map((tab) => (
            <TabButton
              key={tab.key}
              active={tab.key === activeTab}
              onClick={() => setActiveTab(tab.key)}
            >
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
            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1600&q=80"
            alt="Learners discussing future plans in a group"
            loading="lazy"
            style={tabImageStyle}
          />
          <h2 style={sectionTitle}>Teil 1 (Sprechen) · Group Practice</h2>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            In this chapter, we&apos;ll engage in group exercises discussing your wishes,
            dreams and future plans.
          </p>

          <h3 style={sectionTitle}>Ziel (Objective)</h3>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            Erstelle eine Brain Map, um folgende Themen zu behandeln: berufliche Ziele,
            Deutschlernen, Ausbildung oder Studium, Reisen und Ausland, Familie und Wohnen,
            Gesundheit, Freizeit und persönliche Träume.
          </p>

          <h3 style={sectionTitle}>Anleitung (Instructions)</h3>
          <ol style={listSpacing}>
            <li>
              <strong>Zentrales Thema:</strong> Schreibe in die Mitte deiner Brain Map:
              „Zukunftspläne“ oder „Meine Zukunft“.
            </li>
            <li>
              <strong>Hauptzweige (Main Branches):</strong> Zeichne sechs Hauptzweige:
              (1) Arbeit &amp; Beruf, (2) Bildung &amp; Deutsch, (3) Familie &amp; Wohnen,
              (4) Reisen &amp; Ausland, (5) Gesundheit &amp; Freizeit, (6) Persönliche Ziele.
            </li>
            <li>
              <strong>Unterzweige (Sub-Branches):</strong> Ergänze jeden Hauptzweig mit
              passenden Wörtern, Gründen und Beispielsätzen.
            </li>
          </ol>

          <h3 style={sectionTitle}>Beispiel für die Brain Map-Struktur</h3>
          <ul style={listSpacing}>
            <li>
              <strong>A. Arbeit &amp; Beruf:</strong> einen guten Job finden, Berufserfahrung sammeln,
              eine Ausbildung machen, selbstständig werden, in einem internationalen Team arbeiten.
            </li>
            <li>
              <strong>B. Bildung &amp; Deutsch:</strong> B1/B2 lernen, Prüfung bestehen, studieren,
              Weiterbildung machen, jeden Tag Vokabeln lernen.
            </li>
            <li>
              <strong>C. Familie &amp; Wohnen:</strong> eine Familie gründen, eine Wohnung suchen,
              in einer ruhigen Stadt wohnen, die Familie unterstützen.
            </li>
            <li>
              <strong>D. Reisen &amp; Ausland:</strong> nach Deutschland reisen, Europa besuchen,
              neue Kulturen kennenlernen, ein Praktikum im Ausland machen.
            </li>
            <li>
              <strong>E. Gesundheit &amp; Freizeit:</strong> gesund bleiben, regelmäßig Sport machen,
              mehr lesen, weniger Stress haben, Zeit für Hobbys finden.
            </li>
            <li>
              <strong>F. Persönliche Ziele:</strong> selbstbewusster sprechen, Geld sparen,
              Verantwortung übernehmen, anderen Menschen helfen.
            </li>
          </ul>

          <p style={{ margin: 0, lineHeight: 1.7 }}>
            Sprecht außerdem über diese Leitfrage: <strong>Was planst du für deine Zukunft und warum?</strong>
          </p>

          <h3 style={sectionTitle}>Sprechen wie bei einer Mini-Präsentation</h3>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            Heute ist euer letzter A2-Tag. Zeigt schon B1-Denken: Sprecht klar, logisch
            und mit Beispiel. Nutzt diese Struktur:
            <strong> Einleitung → Hauptteil mit Verbindungswörtern → Beispiel → Schluss</strong>.
          </p>
          <div style={{ ...questionCardStyle, background: "#ecfeff" }}>
            <strong>Schnelle Struktur für 30–45 Sekunden</strong>
            <ol style={listSpacing}>
              <li><strong>Einleitung:</strong> Thema nennen und deine Zukunftsidee sagen.</li>
              <li><strong>Hauptteil:</strong> zwei oder drei Pläne mit Connectors verbinden.</li>
              <li><strong>Beispiel:</strong> eine konkrete Zukunftssituation aus deinem Leben geben.</li>
              <li><strong>Schluss:</strong> deine Meinung kurz zusammenfassen.</li>
            </ol>
          </div>

          <div style={phraseGridStyle}>
            <div style={{ ...questionCardStyle, background: "#f8fafc" }}>
              <strong>Gute Einleitungen</strong>
              <ul style={listSpacing}>
                <li>„Heute spreche ich über meine Zukunftspläne.“</li>
                <li>„In meiner Mini-Präsentation geht es um meine Ziele für die nächsten Jahre.“</li>
                <li>„Ich möchte kurz erzählen, wie ich meine Zukunft sehe.“</li>
              </ul>
            </div>
            <div style={{ ...questionCardStyle, background: "#f8fafc" }}>
              <strong>Verbindungswörter / Connectors</strong>
              <ul style={listSpacing}>
                <li><strong>Zuerst</strong>, <strong>dann</strong>, <strong>danach</strong>, <strong>am Ende</strong></li>
                <li><strong>Außerdem</strong>, <strong>auch</strong>, <strong>zusätzlich</strong></li>
                <li><strong>aber</strong>, <strong>trotzdem</strong>, <strong>deshalb</strong></li>
                <li><strong>zum Beispiel</strong>, <strong>deswegen</strong>, <strong>zum Schluss</strong></li>
              </ul>
            </div>
            <div style={{ ...questionCardStyle, background: "#f8fafc" }}>
              <strong>Zukunft ausdrücken</strong>
              <ul style={listSpacing}>
                <li>„Ich möchte …“</li>
                <li>„Ich will später …“</li>
                <li>„In fünf Jahren werde ich …“</li>
                <li>„Ich habe vor, … zu …“</li>
              </ul>
            </div>
            <div style={{ ...questionCardStyle, background: "#f8fafc" }}>
              <strong>Gute Schlüsse</strong>
              <ul style={listSpacing}>
                <li>„Zusammenfassend kann ich sagen, dass …“</li>
                <li>„Zum Schluss denke ich, dass …“</li>
                <li>„Das sind meine Pläne für die Zukunft. Danke fürs Zuhören.“</li>
              </ul>
            </div>
          </div>

          <h3 style={sectionTitle}>Leitfragen für die Gruppenübung</h3>
          <ol style={listSpacing}>
            <li>Wie heißen Sie?</li>
            <li>Woher kommen Sie?</li>
            <li>Was machen Sie zurzeit beruflich oder schulisch?</li>
            <li>Was sind Ihre wichtigsten Ziele für die Zukunft?</li>
            <li>Was möchten Sie in einem Jahr machen?</li>
            <li>Was möchten Sie in fünf Jahren machen?</li>
            <li>Möchten Sie weiter Deutsch lernen? Warum?</li>
            <li>Möchten Sie studieren oder eine Ausbildung machen?</li>
            <li>Haben Sie vor, ins Ausland zu gehen? Wohin?</li>
            <li>Welche beruflichen Ziele haben Sie?</li>
            <li>Welche Länder möchten Sie in der Zukunft besuchen?</li>
            <li>Wollen Sie eine Familie gründen oder Ihre Familie unterstützen?</li>
            <li>Wie stellen Sie sich Ihre Zukunft bei der Arbeit vor?</li>
            <li>Welche persönlichen Wünsche haben Sie für die Zukunft?</li>
            <li>Was möchten Sie in Ihrer Freizeit in der Zukunft machen?</li>
          </ol>

          <SpeakingPracticeTimerCard />
          <div style={{ ...questionCardStyle, background: "#ecfeff" }}>
            <strong>Modellantwort (ca. 30–45 Sekunden)</strong>
            <p style={{ margin: 0, lineHeight: 1.7 }}>
              „Heute spreche ich über meine Zukunftspläne. <strong>Zuerst</strong> möchte ich
              mein Deutsch auf B1-Niveau verbessern, weil ich sicher sprechen will.
              <strong> Dann</strong> plane ich, eine Weiterbildung im Bereich IT zu machen.
              <strong> Außerdem</strong> möchte ich Berufserfahrung sammeln und in einem
              internationalen Team arbeiten. <strong>Zum Beispiel</strong> kann ich mir vorstellen,
              ein Praktikum in Deutschland zu machen. <strong>Zum Schluss</strong> denke ich,
              dass gute Sprache und klare Ziele sehr wichtig für meine Zukunft sind.“
            </p>
          </div>
          <p style={{ margin: 0, color: "#4b5563" }}>
            Teil 1 is for group practice only and has no assignment submission.
          </p>
          <CourseInlinePracticePanel type="speaking" />
          <PreparedCheckbox checked={prepared.sprechen} onChange={setPreparedFor("sprechen")} />
        </div>
      )}

      {activeTab === "schreiben" && (
        <div style={card}>
          <img
            src="https://images.unsplash.com/photo-1456324504439-367cee3b3c32?auto=format&fit=crop&w=1600&q=80"
            alt="Notebook and pen for writing future plans"
            loading="lazy"
            style={tabImageStyle}
          />
          <h2 style={sectionTitle}>Teil 2 (Schreiben) · Assignment</h2>
          <p style={{ margin: 0 }}>
            <strong>Situation:</strong> Sie haben viele Pläne für Ihre Zukunft und möchten
            Ihrem Freund/Ihrer Freundin davon erzählen. Schreiben Sie eine E-Mail.
          </p>
          <ol style={listSpacing}>
            <li>Schreiben Sie über Ihre beruflichen Pläne: neuer Job, Studium oder Weiterbildung.</li>
            <li>Erzählen Sie, was für Sie wichtig ist: Familie, Reisen, Gesundheit oder Sprache.</li>
            <li>Fragen Sie, was Ihr Freund/Ihre Freundin für die Zukunft plant.</li>
          </ol>
          <p style={{ margin: 0, color: "#4b5563" }}>
            Submit your final writing in the assignment submission area, not directly on this page.
          </p>
          <CourseInlinePracticePanel type="writing" />
          <WorkbookSubmissionReminder />
          <PreparedCheckbox checked={prepared.schreiben} onChange={setPreparedFor("schreiben")} />
        </div>
      )}

      {activeTab === "lesen" && (
        <div style={card}>
          <img
            src="https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=1600&q=80"
            alt="Reading assignment about visa and residence topics"
            loading="lazy"
            style={tabImageStyle}
          />
          <h2 style={sectionTitle}>Teil 3 (Lesen) · Assignment</h2>
          <p style={{ margin: 0 }}>
            <strong>Students must submit answers in the submission area (NOT on page).</strong>
          </p>
          <h3 style={sectionTitle}>Pass und Visum, Einwohnermeldeamt und Aufenthaltstitel</h3>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            Für die Einreise nach Deutschland brauchen Sie einen gültigen Reisepass oder ein
            anderes Dokument, das Ihre Identität bestätigt. Bürger, die nicht aus der EU kommen,
            brauchen zusätzlich ein Visum. Das Visum bekommen Sie bei der Deutschen Botschaft
            oder beim Konsulat in Ihrem Land.
          </p>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            Nach der Ankunft müssen Sie sich beim Einwohnermeldeamt anmelden und danach zur
            Ausländerbehörde gehen. Dort bekommen Sie einen Aufenthaltstitel. Wenn Ihre
            Deutschkenntnisse noch nicht ausreichen, können oder müssen Sie einen Integrationskurs machen.
          </p>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            Für die Arbeitssuche hilft die Arbeitsagentur. Dokumente aus dem Heimatland müssen
            oft übersetzt und anerkannt werden. Wichtig sind auch Kranken-, Renten- und Pflegeversicherung.
          </p>
          <h3 style={sectionTitle}>Fragen zum Text</h3>
          {lesenQuestions.map((question, index) => (
            <div key={question.stem} style={questionCardStyle}>
              <strong>{index + 1}. {question.stem}</strong>
              {question.options.map((option) => (
                <span key={option}>{option}</span>
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
            src="https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=1600&q=80"
            alt="Student using headphones for German listening practice"
            loading="lazy"
            style={tabImageStyle}
          />
          <h2 style={sectionTitle}>Teil 4 (Hören)</h2>
          <p style={{ margin: 0 }}>
            Goethe-standard listening practice: check your own answers with the video. Only Lesen
            and Schreiben are officially evaluated by the tutor.
          </p>
          <iframe
            title="A2 Zukunftspläne listening practice"
            src="https://www.youtube.com/embed/Teuu287XY_M"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={videoPreviewStyle}
          />
          <h3 style={sectionTitle}>Fragen zum Hören</h3>
          {hoerenQuestions.map((question, index) => (
            <div key={question.stem} style={questionCardStyle}>
              <strong>{index + 1}. {question.stem}</strong>
              {question.options.map((option) => (
                <span key={option}>{option}</span>
              ))}
            </div>
          ))}
          <p style={{ margin: 0, color: "#4b5563" }}>
            Teil 4 is for self-check listening practice. Correct it with the video.
          </p>
          <PreparedCheckbox checked={prepared.hoeren} onChange={setPreparedFor("hoeren")} />
        </div>
      )}
    </div>
  );
};

export default A2Day28UeberDieZukunftSprechenWorkbookPage;
