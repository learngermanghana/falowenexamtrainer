import React, { useMemo, useState } from "react";
import AppBackButton from "./navigation/AppBackButton";
import { styles } from "../styles";
import WorkbookReferenceAnswers from "./WorkbookReferenceAnswers";
import CourseInlinePracticePanel from "./CourseInlinePracticePanel";
import { A2B1WorkbookGuidance, WorkbookSubmissionReminder } from "./A2B1WorkbookGuidance";

const tabs = [
  { key: "sprechen", label: "Teil 1 · Sprechen (Group Practice No assignment)" },
  { key: "schreiben", label: "Teil 2 · Schreiben" },
  { key: "lesen", label: "Teil 3 · Lesen" },
  { key: "hoeren", label: "Teil 4 · Hören" },
  { key: "references", label: "5. Ref" },
];

const card = { ...styles.card, display: "grid", gap: 12 };
const sectionTitle = { margin: 0, fontSize: "1.1rem" };
const listSpacing = { margin: 0, paddingLeft: 20, lineHeight: 1.7 };
const questionCardStyle = { border: "1px solid #e5e7eb", borderRadius: 10, padding: 12, background: "#fff", display: "grid", gap: 6 };
const tabImageStyle = { width: "100%", borderRadius: 10, maxHeight: 260, objectFit: "cover" };

const speakingBranches = [
  {
    title: "Beruflicher Erfolg (Professional Success)",
    items: ["Karriereaufstieg (Career advancement)", "Unternehmensgründung (Starting a business)", "Weiterbildung (Further education)", "Traumjob finden (Finding a dream job)", "Erfolgreiche Projekte (Successful projects)", "Teamarbeit (Teamwork)"],
  },
  {
    title: "Persönlicher Erfolg (Personal Success)",
    items: ["Sportliche Erfolge (Sports achievements)", "Sprachen lernen (Learning languages)", "Gesunde Lebensweise (Healthy lifestyle)", "Familie und Beziehungen (Family and relationships)", "Kulturelle Erlebnisse (Cultural experiences)"],
  },
  {
    title: "Hindernisse und Herausforderungen (Obstacles and Challenges)",
    items: ["Misserfolge überwinden (Overcoming failures)", "Zeitmanagement (Time management)", "Motivation finden (Finding motivation)", "Finanzielle Schwierigkeiten (Financial difficulties)", "Stressbewältigung (Coping with stress)", "Work-Life-Balance (Work-life balance)"],
  },
  {
    title: "Erfolgsstrategien (Strategies for Success)",
    items: ["Ziele setzen (Setting goals)", "Selbstdisziplin entwickeln (Developing self-discipline)", "Unterstützung suchen (Seeking support)", "Weiterbildung machen (Continuing education)", "Networking betreiben (Networking)", "Positiv denken (Positive thinking)"],
  },
  {
    title: "Inspiration und Vorbilder (Inspiration and Role Models)",
    items: ["Bekannte Persönlichkeiten (Famous personalities)", "Familienmitglieder (Family members)", "Kollegen und Freunde (Colleagues and friends)", "Bücher und Filme (Books and movies)", "Motivationsreden (Motivational speeches)", "Mentoren (Mentors)"],
  },
];

const lesenQuestions = [
  { stem: "Wer wird im Text als stiller Held beschrieben?", options: ["a) Die Krankenschwester", "b) Der Arzt", "c) Der Polizist", "d) Der Lehrer"] },
  { stem: "Warum wird der alleinerziehende Vater als Held betrachtet?", options: ["a) Weil er berühmt ist", "b) Weil er für seine Kinder kämpft", "c) Weil er viel Geld verdient", "d) Weil er aufgibt"] },
  { stem: "Welche Eigenschaft wird bei den Freiwilligen besonders hervorgehoben?", options: ["a) Ihr Reichtum", "b) Ihr Mut", "c) Ihr Einsatz für andere", "d) Ihre Berühmtheit"] },
  { stem: "Wie unterscheiden sich die stillen Helden von den Helden in Filmen oder Büchern?", options: ["a) Sie sind weniger stark", "b) Sie sind nicht berühmt", "c) Sie sind egoistisch", "d) Sie sind reicher"] },
  { stem: "Was zeigen die stillen Helden jeden Tag?", options: ["a) Dass sie berühmt sind", "b) Dass Mut in kleinen Taten liegt", "c) Dass sie stark sind", "d) Dass sie großartige Taten vollbringen"] },
  { stem: "Wer wird im Text als Beispiel für einen Helden im Alltag genannt?", options: ["a) Ein Pilot", "b) Ein alleinerziehender Vater", "c) Ein Superheld", "d) Ein Schriftsteller"] },
  { stem: "Was ist die Hauptaussage des Textes?", options: ["a) Helden gibt es nur in Filmen", "b) Wahre Helden sind diejenigen, die im Alltag still wirken", "c) Nur berühmte Menschen sind Helden", "d) Helden sind immer reich und berühmt"] },
];

const hoerenQuestions = [
  { stem: "Was macht Herr Müller jeden Morgen um fünf Uhr?", options: ["a) Er geht zur Schule", "b) Er beginnt seine Arbeit als Hausmeister", "c) Er bringt die Schüler zur Schule", "d) Er repariert die Heizung"] },
  { stem: "Warum ist Herr Müllers Arbeit wichtig?", options: ["a) Weil sie im Vordergrund steht", "b) Weil sie den Schultag reibungslos macht", "c) Weil er dafür viel Lob bekommt", "d) Weil er berühmt ist"] },
  { stem: "Was passiert an einem kalten Wintermorgen?", options: ["a) Die Schule ist geschlossen", "b) Herr Müller bleibt zu Hause", "c) Die Heizung fällt aus", "d) Die Schüler kommen zu spät"] },
  { stem: "Wie reagiert Herr Müller, als er die defekte Heizung entdeckt?", options: ["a) Er geht nach Hause", "b) Er ignoriert das Problem", "c) Er behebt das Problem sofort", "d) Er ruft die Polizei"] },
  { stem: "Wie fühlt sich Herr Müller am Ende des Tages?", options: ["a) Erschöpft aber zufrieden", "b) Frustriert und müde", "c) Glücklich und ausgeruht", "d) Ärgerlich und enttäuscht"] },
];

function TabButton({ active, onClick, children }) {
  return (
    <button type="button" onClick={onClick} style={{ ...styles.secondaryButton, borderColor: active ? "#2563eb" : "#d1d5db", background: active ? "#eff6ff" : "#fff", color: active ? "#1d4ed8" : "#111827" }}>
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

const QuestionList = ({ questions }) => (
  <div style={{ display: "grid", gap: 10 }}>
    {questions.map((question, index) => (
      <div key={question.stem} style={questionCardStyle}>
        <strong>{index + 1}. {question.stem}</strong>
        {question.options.map((option) => <span key={option}>{option}</span>)}
      </div>
    ))}
  </div>
);

const B1Day3ErfolgsgeschichtenWorkbookPage = () => {
  const [activeTab, setActiveTab] = useState("sprechen");
  const [prepared, setPrepared] = useState({ sprechen: false, schreiben: false, lesen: false, hoeren: false });
  const activeIndex = useMemo(() => tabs.findIndex((tab) => tab.key === activeTab), [activeTab]);
  const setPreparedFor = (tabKey) => (event) => setPrepared((prev) => ({ ...prev, [tabKey]: event.target.checked }));

  return (
    <div style={{ ...styles.container, display: "grid", gap: 16 }}>
      <div style={card}>
        <AppBackButton label="Back to Course Book" fallbackPath="/campus/course" />
        <h1 style={{ ...styles.title, marginBottom: 0 }}>B1 · Day 3 Workbook · Erfolgsgeschichten</h1>
        <p style={{ ...styles.subtitle, margin: 0 }}>Kapitel 1.3 · Group speaking, writing, reading and listening practice.</p>
        <img src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1600&q=80" alt="People discussing goals and success stories" loading="lazy" style={tabImageStyle} />
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {tabs.map((tab) => <TabButton key={tab.key} active={tab.key === activeTab} onClick={() => setActiveTab(tab.key)}>{tab.label}</TabButton>)}
        </div>
        <p style={{ margin: 0, color: "#4b5563" }}>Tab {activeIndex + 1} of {tabs.length}</p>
      </div>

      <A2B1WorkbookGuidance />

      {activeTab === "sprechen" && (
        <div style={card}>
          <h2 style={sectionTitle}>Teil 1 (Group Practice) · Erfolgsgeschichten</h2>
          <p style={{ margin: 0, lineHeight: 1.7 }}>In this chapter, we&apos;ll engage in group exercises discussing these topics.</p>
          <h3 style={sectionTitle}>Instructions</h3>
          <ol style={listSpacing}>
            <li><strong>Central Topic:</strong> Write <strong>„Erfolgsgeschichten“</strong> in the center of your brain map.</li>
            <li><strong>Main Branches:</strong> Create five main branches from the central topic.</li>
            <li><strong>Sub-Branches:</strong> Expand each branch with examples and phrases.</li>
          </ol>
          <h3 style={sectionTitle}>Example Brain Map</h3>
          <div style={{ display: "grid", gap: 10 }}>
            {speakingBranches.map((branch) => (
              <div key={branch.title} style={questionCardStyle}>
                <strong>{branch.title}</strong>
                <ul style={listSpacing}>{branch.items.map((item) => <li key={item}>{item}</li>)}</ul>
              </div>
            ))}
          </div>
          <h3 style={sectionTitle}>Frage des Tages</h3>
          <p style={{ margin: 0 }}><strong>Was ist für dich eine Erfolgsgeschichte?</strong></p>
          <p style={{ margin: 0 }}>Schreibe einen kurzen Text oder bereite eine mündliche Antwort vor. Nutze diese Struktur:</p>
          <ol style={listSpacing}>
            <li><strong>Einleitung:</strong> Stelle das Thema „Erfolg“ oder „Erfolgsgeschichten“ vor.</li>
            <li><strong>Vorteile:</strong> Welche Vorteile oder positiven Seiten haben Erfolgsgeschichten?</li>
            <li><strong>Nachteile:</strong> Gibt es auch Nachteile oder negative Aspekte? Fühlt man manchmal Druck durch Erfolgsgeschichten?</li>
            <li><strong>Deine Meinung:</strong> Was denkst du persönlich? Hast du ein Beispiel für eine Erfolgsgeschichte?</li>
          </ol>
          <p style={{ margin: 0, color: "#4b5563" }}>Teil 1 is for group practice only and has no assignment submission.</p>
          <CourseInlinePracticePanel type="speaking" />
          <PreparedCheckbox checked={prepared.sprechen} onChange={setPreparedFor("sprechen")} />
        </div>
      )}

      {activeTab === "schreiben" && (
        <div style={card}>
          <h2 style={sectionTitle}>Teil 2 (Schreiben) (Assignment)</h2>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            Deine Sprachkursleiterin, Frau Wolmer, hat die Gruppe gebeten, eine Präsentation über Erfolgsgeschichten vorzubereiten. Du kannst aber leider nicht teilnehmen.
          </p>
          <p style={{ margin: 0 }}><strong>Schreibe an Frau Wolmer.</strong></p>
          <ul style={listSpacing}>
            <li>Entschuldige dich höflich.</li>
            <li>Erkläre, warum du nicht teilnehmen kannst.</li>
          </ul>
          <p style={{ margin: 0 }}>Schreibe eine E-Mail (circa <strong>40 Wörter</strong>). Vergiss nicht die Anrede und den Gruß am Schluss.</p>
          <CourseInlinePracticePanel type="writing" />
          <WorkbookSubmissionReminder />
          <PreparedCheckbox checked={prepared.schreiben} onChange={setPreparedFor("schreiben")} />
        </div>
      )}

      {activeTab === "lesen" && (
        <div style={card}>
          <h2 style={sectionTitle}>Teil 3 (Lesen) (Exercise)</h2>
          <p style={{ margin: 0 }}><strong>Essay Title: Helden des Alltags: Wer sind sie wirklich?</strong></p>
          {[
            "Im Alltag begegnen uns viele Menschen, die auf den ersten Blick gewöhnlich erscheinen. Doch wenn wir genauer hinsehen, erkennen wir, dass viele von ihnen wahre Helden sind. Diese Helden sind nicht unbedingt die Menschen, die in den Medien gefeiert werden oder große Taten vollbringen, sondern oft diejenigen, die im Stillen wirken und unser Leben bereichern.",
            "Nehmen wir zum Beispiel die Krankenschwester, die Tag und Nacht für ihre Patienten da ist. Ihre Arbeit mag oft undankbar und anstrengend sein, aber sie erfüllt ihre Aufgaben mit Hingabe und Mitgefühl. In den Augen derer, die ihre Hilfe erhalten, ist sie eine Heldin.",
            "Oder denken wir an den alleinerziehenden Vater, der trotz aller Schwierigkeiten jeden Tag hart arbeitet, um seinen Kindern eine gute Zukunft zu ermöglichen. Er könnte leicht aufgeben, aber er kämpft weiter und zeigt damit eine unglaubliche Stärke.",
            "Auch die Freiwilligen, die ihre Zeit opfern, um anderen zu helfen, verdienen unseren Respekt. Sei es durch die Unterstützung von Obdachlosen, die Betreuung von Senioren oder die Rettung von Tieren – sie sind die stillen Helden, die unsere Gesellschaft zusammenhalten.",
            "Es ist leicht, in den Heldengeschichten aus Filmen oder Büchern zu träumen, aber die wahren Helden sind oft viel näher, als wir denken. Sie sind die Menschen, die uns jeden Tag zeigen, dass wahre Stärke und Mut in den kleinen, alltäglichen Taten liegen.",
          ].map((paragraph) => <p key={paragraph} style={{ margin: 0, lineHeight: 1.7 }}>{paragraph}</p>)}
          <h3 style={sectionTitle}>Multiple-Choice Questions</h3>
          <QuestionList questions={lesenQuestions} />
          <WorkbookSubmissionReminder />
          <PreparedCheckbox checked={prepared.lesen} onChange={setPreparedFor("lesen")} />
        </div>
      )}

      {activeTab === "hoeren" && (
        <div style={card}>
          <h2 style={sectionTitle}>Teil 4 (Hören) (Exercise)</h2>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            Listen to the Hören text provided during class, then answer the questions below. The old Google Drive link has been removed.
          </p>
          <h3 style={sectionTitle}>Multiple-Choice Questions</h3>
          <QuestionList questions={hoerenQuestions} />
          <WorkbookSubmissionReminder />
          <PreparedCheckbox checked={prepared.hoeren} onChange={setPreparedFor("hoeren")} />
        </div>
      )}

      {activeTab === "references" && (
        <WorkbookReferenceAnswers level="B1" lesson={{ title: "B1Day3Erfolgsgeschichten", level: "B1", workbookId: "B1Day3Erfolgsgeschichten" }} workbookId="B1Day3Erfolgsgeschichten" />
      )}
    </div>
  );
};

export default B1Day3ErfolgsgeschichtenWorkbookPage;
