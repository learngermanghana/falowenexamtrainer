import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { styles } from "../styles";
import SpeakingPracticeTimerCard from "./SpeakingPracticeTimerCard";

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
    stem: "Warum ging die Person in die Apotheke?",
    options: [
      "A) Um neue Medikamente zu kaufen.",
      "B) Weil sie sich krank fühlte.",
      "C) Um eine Broschüre abzuholen.",
      "D) Weil es kalt war.",
    ],
  },
  {
    stem: "Was empfahl die Apothekerin gegen Husten?",
    options: ["A) Nasenspray", "B) Hustensaft", "C) Tabletten", "D) Hausmittel"],
  },
  {
    stem: "Wie war der Service in der Apotheke?",
    options: ["A) Unfreundlich", "B) Neutral", "C) Hilfsbereit", "D) Langsam"],
  },
  {
    stem: "Was gab die Apothekerin zusätzlich zu den Medikamenten?",
    options: ["A) Ein Rezept", "B) Broschüren mit Tipps", "C) Eine Rechnung", "D) Ein neues Medikament"],
  },
  {
    stem: "Wie fühlte sich die Person auf dem Heimweg?",
    options: ["A) Schlechter", "B) Unverändert", "C) Besser", "D) Sehr krank"],
  },
  {
    stem: "Wann fühlte sich die Person besser?",
    options: ["A) Sofort nach Einnahme der Medikamente", "B) Nach einigen Stunden", "C) Am nächsten Tag", "D) Eine Woche später"],
  },
  {
    stem: "Was lernt die Person aus dem Besuch in der Apotheke?",
    options: [
      "A) Sie kann sich auf den Rat der Apotheker verlassen.",
      "B) Medikamente sind nicht hilfreich.",
      "C) Apotheker sind unfreundlich.",
      "D) Hausmittel sind die beste Lösung.",
    ],
  },
];

const hoerenQuestions = [
  {
    stem: "Warum ging Anna in die Apotheke?",
    options: ["A) Um Medikamente gegen Husten zu kaufen", "B) Wegen Kopfschmerzen", "C) Um eine Creme zu kaufen", "D) Um Proben zu holen"],
  },
  {
    stem: "Was empfahl die Apothekerin gegen Kopfschmerzen?",
    options: ["A) Aspirin", "B) Paracetamol", "C) Ibuprofen", "D) Nasenspray"],
  },
  {
    stem: "Welches Problem hatte Anna noch?",
    options: ["A) Halsschmerzen", "B) Trockene Haut", "C) Schnupfen", "D) Fieber"],
  },
  {
    stem: "Wie reagierte Anna auf die Empfehlungen der Apothekerin?",
    options: ["A) Sie war skeptisch", "B) Sie war erleichtert", "C) Sie war verwirrt", "D) Sie war unzufrieden"],
  },
  {
    stem: "Was bekam Anna zusätzlich zu den Medikamenten?",
    options: ["A) Ein Rezept", "B) Proben von Produkten", "C) Eine Broschüre", "D) Ein neues Medikament"],
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

const A2Day17InDieApothekeGehenWorkbookPage = () => {
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

        <h1 style={{ ...styles.title, marginBottom: 0 }}>A2 · Day 17 Workbook · In die Apotheke gehen</h1>
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
            src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1600&q=80"
            alt="Pharmacist advising a customer in a pharmacy"
            loading="lazy"
            style={{ width: "100%", borderRadius: 10, maxHeight: 260, objectFit: "cover" }}
          />
          <h2 style={sectionTitle}>Teil 1 · Sprechen (Group Practice)</h2>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            In this chapter, we&apos;ll engage in group exercises discussing pharmacy communication at A2 level.
          </p>

          <h3 style={sectionTitle}>Ziel (Objective)</h3>
          <p style={{ margin: 0 }}>Erstelle eine Brain Map mit dem zentralen Thema: „Beruf: Apotheke“ oder „In die Apotheke gehen“.</p>
          <ol style={listSpacing}>
            <li>Berufe in der Apotheke</li>
            <li>Wortschatz (Symptome &amp; Medikamente)</li>
            <li>Dialog in der Apotheke</li>
            <li>Rezepte und Regeln</li>
            <li>Tipps &amp; Kultur (z. B. Unterschiede zwischen Deutschland und anderen Ländern)</li>
          </ol>

          <h3 style={sectionTitle}>Unterzweige und Beispiele</h3>
          <ul style={listSpacing}>
            <li>
              <strong>Berufe:</strong> Apotheker/in, PTA, PKA (Beratung, Rezeptprüfung, Lager, Bestellungen).
            </li>
            <li>
              <strong>Wortschatz:</strong> Kopfschmerzen, Fieber, Husten, Tabletten, Salbe, Sirup, Dosierung, rezeptpflichtig.
            </li>
            <li>
              <strong>Dialog:</strong> „Guten Tag, ich habe Kopfschmerzen.“ · „Haben Sie ein Rezept?“ · „Gute Besserung!“
            </li>
            <li>
              <strong>Regeln:</strong> Kassenrezept vs. Privatrezept, Öffnungszeiten, Altersbeschränkungen.
            </li>
            <li>
              <strong>Kultur:</strong> Höflichkeitsform „Sie“, ausführliche Beratung, Apotheken-Notdienst.
            </li>
          </ul>

          <div style={{ ...questionCardStyle, background: "#f8fafc" }}>
            <strong>💬 Frage des Tages</strong>
            <p style={{ margin: 0, lineHeight: 1.6 }}>
              Was kaufst du in der Apotheke und wann gehst du dorthin?
            </p>
            <p style={{ margin: 0 }}>
              <strong>Schlüsselwörter:</strong> Medikamente · Beratung · Rezept · Gesundheit
            </p>
          </div>

          <div style={{ ...questionCardStyle, background: "#f8fafc" }}>
            <strong>Speaking self-practice confidence check</strong>
            <p style={{ margin: 0 }}>Watch the timer guidance, then practice your own speaking output before class.</p>
            <a href="https://www.falowen.app/campus/speech" target="_blank" rel="noreferrer">
              Open speaking self-practice
            </a>
          </div>
          <SpeakingPracticeTimerCard />

          <p style={{ margin: 0, color: "#4b5563" }}>Teil 1 is for group practice only and has no assignment submission.</p>

          <PreparedCheckbox checked={prepared.sprechen} onChange={setPreparedFor("sprechen")} />
        </div>
      )}

      {activeTab === "schreiben" && (
        <div style={card}>
          <img
            src="https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1600&q=80"
            alt="Learner writing an email for pharmacy communication"
            loading="lazy"
            style={{ width: "100%", borderRadius: 10, maxHeight: 260, objectFit: "cover" }}
          />
          <h2 style={sectionTitle}>Teil 2 · Schreiben (Assignment)</h2>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            <strong>Neue Aufgabenstellung (A2-Niveau):</strong> Sie möchten ein bestimmtes Medikament kaufen und schreiben
            deswegen einen Brief oder eine E-Mail an eine Apotheke (nicht an den Arzt).
          </p>
          <ol style={listSpacing}>
            <li>Beschreiben Sie kurz, warum Sie das Medikament benötigen.</li>
            <li>Fragen Sie nach den Kosten und ob die Versicherung das Medikament übernimmt.</li>
            <li>Fragen Sie nach der richtigen Dosierung oder möglichen Nebenwirkungen.</li>
          </ol>

          <div style={{ ...questionCardStyle, background: "#f9fafb" }}>
            <strong>Writing guidance before submission</strong>
            <ul style={listSpacing}>
              <li>Starten Sie mit einer höflichen Anrede und nennen Sie den Grund Ihrer Nachricht klar.</li>
              <li>Nutzen Sie kurze, präzise A2-Sätze und beantworten Sie alle drei Aufgabenpunkte.</li>
              <li>Schließen Sie höflich ab und bitten Sie um eine kurze Rückmeldung der Apotheke.</li>
            </ul>
            <p style={{ margin: 0 }}>
              Practice your draft here:{" "}
              <a href="https://www.falowen.app/campus/writing" target="_blank" rel="noreferrer">
                Open Writing Practice
              </a>
              . You can use the Ideas Generator before final submission.
            </p>
          </div>

          <p style={{ margin: 0, color: "#4b5563" }}>
            Submit your final writing in the assignment submission area (not on this workbook page).
          </p>

          <PreparedCheckbox checked={prepared.schreiben} onChange={setPreparedFor("schreiben")} />
        </div>
      )}

      {activeTab === "lesen" && (
        <div style={card}>
          <img
            src="https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=1600&q=80"
            alt="Workbook reading exercise for pharmacy topic"
            loading="lazy"
            style={{ width: "100%", borderRadius: 10, maxHeight: 260, objectFit: "cover" }}
          />
          <h2 style={sectionTitle}>Teil 3 · Lesen (Exercise)</h2>
          <p style={{ margin: 0 }}>
            Lesen Sie den Text und wählen Sie die richtige Antwort aus. <strong>Do not answer directly on this page.</strong>
          </p>

          <h3 style={sectionTitle}>Essay</h3>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            Es war ein kalter Wintermorgen, als ich entschied, in die Apotheke zu gehen. Ich fühlte mich seit Tagen krank und
            wusste, dass ich etwas gegen meine Erkältung tun musste. Als ich in die Apotheke kam, begrüßte mich die
            Apothekerin freundlich. Ich erklärte ihr meine Symptome: Husten, Halsschmerzen und eine laufende Nase. Sie
            empfahl mir sofort einen Hustensaft und Tabletten gegen die Halsschmerzen. Außerdem gab sie mir noch
            Nasenspray, das meine verstopfte Nase befreien sollte. Während sie die Medikamente holte, erzählte sie mir von
            verschiedenen Hausmitteln, die ebenfalls helfen könnten. Ich war beeindruckt von ihrem Wissen und ihrer
            Freundlichkeit. Nachdem ich bezahlt hatte, gab sie mir noch einige Broschüren mit Tipps zur Gesundheit im Winter.
            Auf dem Heimweg fühlte ich mich schon ein bisschen besser, allein durch das Wissen, gut versorgt zu sein. Zu Hause
            angekommen, nahm ich sofort die empfohlenen Medikamente ein. Innerhalb weniger Stunden spürte ich eine deutliche
            Verbesserung. Der Hustensaft beruhigte meinen Husten und die Tabletten linderten die Halsschmerzen. Auch das
            Nasenspray war sehr wirksam. Ich war sehr dankbar für die schnelle Hilfe und den guten Rat der Apothekerin. In den
            folgenden Tagen setzte ich die Behandlung fort und konnte bald wieder gesund zur Arbeit gehen. Der Besuch in der
            Apotheke hatte sich wirklich gelohnt und ich wusste, dass ich mich in Zukunft immer auf den Rat der Apotheker
            verlassen konnte.
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

          <p style={{ margin: 0, color: "#4b5563" }}>
            Submit your answers in the assignment submission area (not on this workbook page).
          </p>

          <PreparedCheckbox checked={prepared.lesen} onChange={setPreparedFor("lesen")} />
        </div>
      )}

      {activeTab === "hoeren" && (
        <div style={card}>
          <img
            src="https://images.unsplash.com/photo-1590608897129-79da98d15969?auto=format&fit=crop&w=1600&q=80"
            alt="Listening practice in pharmacy communication lesson"
            loading="lazy"
            style={{ width: "100%", borderRadius: 10, maxHeight: 260, objectFit: "cover" }}
          />
          <h2 style={sectionTitle}>Teil 4 · Hören (Exercise)</h2>
          <p style={{ margin: 0 }}>
            Audio:{" "}
            <a href="https://drive.google.com/file/d/1glr45HegifSYLrz0XpKCFFiAPfUW8RsB/view?usp=sharing" target="_blank" rel="noreferrer">
              Open Teil 4 audio
            </a>
          </p>
          <p style={{ margin: 0 }}>Listen carefully, then submit your final answers in the assignment submission area.</p>

          <label style={{ display: "inline-flex", alignItems: "center", gap: 8, fontWeight: 600 }}>
            <input type="checkbox" checked={teacherMode} onChange={(event) => setTeacherMode(event.target.checked)} />
            Teacher mode (show transcript)
          </label>

          {teacherMode && (
            <div style={{ ...questionCardStyle, background: "#fefce8" }}>
              <strong>Transcript (teacher support)</strong>
              <p style={{ margin: 0, lineHeight: 1.6 }}>
                Anna geht in die Apotheke, weil sie Kopfschmerzen hat. Die Apothekerin empfiehlt ihr Ibuprofen. Außerdem hat
                Anna noch trockene Haut, deshalb empfiehlt die Apothekerin eine passende Creme. Anna ist nach der Beratung
                erleichtert. Zusätzlich bekommt sie Proben von Produkten.
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
            <a href="https://youtu.be/PtrlVtdhPVw" target="_blank" rel="noreferrer">
              In die Apotheke gehen 6.17
            </a>
          </p>
          <iframe
            style={videoPreviewStyle}
            src="https://www.youtube.com/embed/PtrlVtdhPVw"
            title="In die Apotheke gehen 6.17"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />

          <p style={{ margin: 0, color: "#4b5563" }}>
            Submit your answers in the assignment submission area (not on this workbook page).
          </p>

          <PreparedCheckbox checked={prepared.hoeren} onChange={setPreparedFor("hoeren")} />
        </div>
      )}
    </div>
  );
};

export default A2Day17InDieApothekeGehenWorkbookPage;
