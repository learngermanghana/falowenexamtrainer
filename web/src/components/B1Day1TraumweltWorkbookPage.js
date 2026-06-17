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
  { key: "references", label: "Teil 5 · Reference Answers" },
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

const audioPreviewStyle = {
  width: "100%",
  minHeight: 220,
  border: 0,
  borderRadius: 10,
};

const brainMapBranches = [
  {
    title: "Traumberuf (Dream Job)",
    items: ["Arzt", "Lehrer", "Unternehmer", "Schauspieler", "IT-Spezialist", "selbstständig arbeiten", "im Ausland arbeiten"],
  },
  {
    title: "Traumreise (Dream Trip)",
    items: ["Japan", "Australien", "Kanada", "Brasilien", "Abenteuerreise", "Luxusurlaub", "Weltreise", "Natur entdecken", "Kultur erleben", "Backpacking"],
  },
  {
    title: "Traumhaus (Dream House)",
    items: ["am Meer", "in den Bergen", "moderne Villa", "kleines gemütliches Haus", "Garten und Pool", "nachhaltiges Haus"],
  },
  {
    title: "Zukunftsträume (Future Dreams)",
    items: ["Familie gründen", "Karriere machen", "viel Geld verdienen", "in einem anderen Land leben", "ein eigenes Unternehmen gründen", "gesund bleiben"],
  },
  {
    title: "Traumhobbys und Freizeit (Dream Hobbies and Leisure Activities)",
    items: ["Extremsport", "Musikinstrumente lernen", "ein Buch schreiben", "reisen", "kochen lernen", "Kunst und Malerei"],
  },
];

const lesenQuestions = [
  {
    stem: "Was glaubten die Menschen in der Antike über Träume?",
    options: ["a) Dass sie von Göttern gesendet wurden", "b) Dass sie bedeutungslos sind", "c) Dass sie zufällige Gedankenspiele sind", "d) Dass sie immer Albträume sind"],
  },
  {
    stem: "Wer ist der Begründer der psychoanalytischen Traumdeutung?",
    options: ["a) Carl Gustav Jung", "b) Sigmund Freud", "c) Albert Einstein", "d) Charles Darwin"],
  },
  {
    stem: "Was könnte laut Freud ein Traum von fallenden Zähnen bedeuten?",
    options: ["a) Angst vor dem Älterwerden", "b) Freude am Leben", "c) Wunsch nach Reisen", "d) Hunger"],
  },
  {
    stem: "Was versteht man unter dem kollektiven Unbewussten nach Jung?",
    options: ["a) Persönliche Erinnerungen", "b) Gemeinsames psychologisches Erbe der Menschheit", "c) Wissenschaftliche Theorien", "d) Zufällige Gedanken"],
  },
  {
    stem: "Wie sehen viele moderne Wissenschaftler Träume?",
    options: ["a) Als Botschaften aus einer anderen Welt", "b) Als Gedächtnisverarbeitung", "c) Als Vorhersagen der Zukunft", "d) Als bedeutungslose Bilder"],
  },
  {
    stem: "Was könnte ein Traum laut Jung enthalten?",
    options: ["a) Persönliche Erinnerungen", "b) Universelle Symbole wie der Held oder die Mutter", "c) Wissenschaftliche Theorien", "d) Zufällige Gedanken"],
  },
  {
    stem: "Was bleibt trotz aller wissenschaftlichen Fortschritte über Träume?",
    options: ["a) Ein völlig verstandenes Gebiet", "b) Ein geheimnisvolles und faszinierendes Gebiet", "c) Ein bedeutungsloses Phänomen", "d) Eine exakt erklärte Tatsache"],
  },
];

const hoerenQuestions = [
  {
    stem: "Was hat Friedrich August Kekulé in einem Traum erkannt?",
    options: ["a) Die Struktur des Benzolmoleküls", "b) Die Lösung für ein mathematisches Problem", "c) Eine neue Art von Medikament", "d) Die Idee für einen Roman"],
  },
  {
    stem: "Was soll Mary Shelley in einem Traum gehabt haben?",
    options: ["a) Die Idee für \"Frankenstein\"", "b) Die Lösung für ein chemisches Problem", "c) Eine neue Erfindung", "d) Die Idee für ein Gemälde"],
  },
  {
    stem: "Was können Albträume verursachen?",
    options: ["a) Angst und Unwohlsein", "b) Freude und Motivation", "c) Kreative Ideen", "d) Neue Erfindungen"],
  },
  {
    stem: "Was ist luzides Träumen?",
    options: ["a) Wenn man im Traum bewusst ist, dass man träumt", "b) Wenn man nie träumt", "c) Wenn man in Träumen nur Schwarz-Weiß sieht", "d) Wenn man sich an keinen Traum erinnern kann"],
  },
  {
    stem: "In welcher Schlafphase sind die Träume am intensivsten?",
    options: ["a) In der REM-Phase", "b) In der Tiefschlafphase", "c) In der Leichtschlafphase", "d) In der Einschlafphase"],
  },
];

function TabButton({ active, onClick, children }) {
  return (
    <button
      type="button"
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

const QuestionList = ({ questions }) => (
  <div style={{ display: "grid", gap: 10 }}>
    {questions.map((question, index) => (
      <div key={question.stem} style={questionCardStyle}>
        <strong>{index + 1}. {question.stem}</strong>
        {question.options.map((option) => (
          <span key={option}>{option}</span>
        ))}
      </div>
    ))}
  </div>
);

const B1Day1TraumweltWorkbookPage = () => {
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
        <AppBackButton label="Back to Course Book" fallbackPath="/campus/course" />

        <h1 style={{ ...styles.title, marginBottom: 0 }}>B1 · Day 1 Workbook · Traumwelt</h1>
        <p style={{ ...styles.subtitle, margin: 0 }}>4-part workbook: group speaking, writing, reading and listening practice.</p>
        <img
          src="https://images.unsplash.com/photo-1490730141103-6cac27aaab94?auto=format&fit=crop&w=1600&q=80"
          alt="Dream landscape for a B1 workbook about dreams and future wishes"
          loading="lazy"
          style={tabImageStyle}
        />

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
            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1600&q=80"
            alt="Students discussing dream jobs and future plans"
            loading="lazy"
            style={tabImageStyle}
          />
          <h2 style={sectionTitle}>Teil 1 (Sprechen) · Group Practice</h2>
          <p style={{ margin: 0, lineHeight: 1.7 }}>In this chapter, we&apos;ll engage in group exercises discussing these topics.</p>

          <h3 style={sectionTitle}>Brain Map: Traumwelt</h3>
          <ol style={listSpacing}>
            <li><strong>Central Topic:</strong> Write <strong>„Traumwelt“</strong> in the center of your brain map.</li>
            <li><strong>Main Branches:</strong> Create five main branches from the central topic.</li>
            <li><strong>Sub-Branches:</strong> Expand each branch with examples and ideas.</li>
          </ol>

          <h3 style={sectionTitle}>Example Brain Map</h3>
          <div style={{ display: "grid", gap: 10 }}>
            {brainMapBranches.map((branch) => (
              <div key={branch.title} style={questionCardStyle}>
                <strong>{branch.title}</strong>
                <ul style={listSpacing}>
                  {branch.items.map((item) => <li key={item}>{item}</li>)}
                </ul>
              </div>
            ))}
          </div>

          <h3 style={sectionTitle}>Group Sprechen</h3>
          <p style={{ margin: 0 }}><strong>Frage:</strong> Was ist dein Traumberuf und warum?</p>
          <h3 style={sectionTitle}>Schlüsselwörter / Stichpunkte für deine Antwort</h3>
          <ol style={listSpacing}>
            <li><strong>Begrüßung:</strong> „Hallo, ich heiße ...“ / „Guten Tag!“</li>
            <li><strong>Thema vorstellen:</strong> „Heute spreche ich über meinen Traumberuf.“</li>
            <li><strong>Dein Traumberuf:</strong> „Mein Traumberuf ist ...“ / „Ich möchte ... werden.“</li>
            <li><strong>Begründung:</strong> „Ich finde diesen Beruf interessant, weil ...“ / „Ich möchte diesen Beruf machen, weil ...“</li>
            <li><strong>Abschluss/Dank:</strong> „Danke fürs Zuhören!“ / „Das war meine Vorstellung.“</li>
          </ol>

          <p style={{ margin: 0, color: "#4b5563" }}>
            Teil 1 is only for group discussion and has no assignment submission. Assignments start from Teil 2, Teil 3 and Teil 4.
          </p>

          <CourseInlinePracticePanel type="speaking" />
          <PreparedCheckbox checked={prepared.sprechen} onChange={setPreparedFor("sprechen")} />
        </div>
      )}

      {activeTab === "schreiben" && (
        <div style={card}>
          <img
            src="https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1600&q=80"
            alt="Student writing a B1 opinion text"
            loading="lazy"
            style={tabImageStyle}
          />
          <h2 style={sectionTitle}>Teil 2 (Schreiben) (Assignment)</h2>
          <p style={{ margin: 0 }}><strong>Thema:</strong> Traumberuf und persönliche Kontakte</p>

          <div style={questionCardStyle}>
            <strong>Meinung aus dem Online-Gästebuch</strong>
            <p style={{ margin: 0, lineHeight: 1.7 }}>
              Tanja: „Ich finde es wichtig, dass man im Traumberuf mit anderen Menschen in Kontakt steht. Aber heute arbeiten viele im Homeoffice,
              und oft haben sie wenig persönlichen Kontakt mit Kollegen. Meiner Meinung nach kann das den Beruf nicht so erfüllend machen wie bei
              direkter Zusammenarbeit im Büro.“
            </p>
          </div>

          <p style={{ margin: 0, lineHeight: 1.7 }}>
            Sie haben im Fernsehen eine Diskussionssendung zum Thema <strong>„Traumberuf und persönliche Kontakte“</strong> gesehen. Im Online-Gästebuch
            der Sendung finden Sie die Meinung von Tanja. Schreiben Sie nun Ihre Meinung zum Thema. Schreiben Sie circa <strong>80 Wörter</strong>.
          </p>

          <div style={questionCardStyle}>
            <strong>Template for Writing</strong>
            <p style={{ margin: 0, lineHeight: 1.7, whiteSpace: "pre-line" }}>{`Liebe Forum-Mitglieder,

heutzutage ist das Thema [Thema] ein sehr wichtiges Thema in unserem Leben. Ich bin der Meinung, dass [Ihre Meinung], weil [Begründung].

Einerseits gibt es viele Vorteile. Zum Beispiel [Modalverb/Verb] [weitere Information].

Andererseits gibt es auch Nachteile. Ein Beispiel dafür sind [Nomen], wie [weitere Information].

Ich glaube, dass [Ihre abschließende Meinung].

Zusammenfassend lässt sich sagen, dass [Thema] unser Leben positiv/negativ beeinflussen kann.
Ich hoffe, dass meine Meinung hilft, das Thema zu verstehen.

Mit freundlichen Grüßen
[Ihr Name]`}</p>
          </div>

          <p style={{ margin: 0, color: "#4b5563" }}>
            Submit your final writing in the assignment submission area after practising here.
          </p>

          <CourseInlinePracticePanel type="writing" />
          <WorkbookSubmissionReminder />
          <PreparedCheckbox checked={prepared.schreiben} onChange={setPreparedFor("schreiben")} />
        </div>
      )}

      {activeTab === "lesen" && (
        <div style={card}>
          <img
            src="https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1600&q=80"
            alt="Night sky and book for a reading exercise about dreams"
            loading="lazy"
            style={tabImageStyle}
          />
          <h2 style={sectionTitle}>Teil 3 (Lesen) (Exercise)</h2>
          <p style={{ margin: 0 }}>
            Read the text and review the questions. <strong>Do not answer directly on this page.</strong> Use the submit section to send your answers.
          </p>

          <h3 style={sectionTitle}>Traumdeutung und ihre Bedeutung</h3>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            Träume faszinieren die Menschheit seit Jahrtausenden. In vielen Kulturen werden Träume als Botschaften aus einer anderen Welt betrachtet.
            In der Antike glaubte man, dass Träume von den Göttern gesendet wurden und wichtige Hinweise auf das Schicksal geben konnten. Auch heute
            noch versuchen viele Menschen, die Bedeutung ihrer Träume zu entschlüsseln.
          </p>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            Es gibt verschiedene Ansätze zur Traumdeutung. Der bekannteste ist wahrscheinlich die psychoanalytische Traumdeutung nach Sigmund Freud.
            Freud glaubte, dass Träume eine Art Ventil für unterdrückte Wünsche und Ängste sind. Seiner Meinung nach sind viele Traumbilder symbolisch
            und müssen interpretiert werden, um ihre wahre Bedeutung zu verstehen. Zum Beispiel könnte ein Traum von fallenden Zähnen auf Angst vor dem
            Älterwerden oder Machtverlust hinweisen.
          </p>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            Ein weiterer Ansatz ist die analytische Traumdeutung nach Carl Gustav Jung. Jung sah Träume als Ausdruck des kollektiven Unbewussten, einer
            Art gemeinsamen psychologischen Erbes der Menschheit. Für ihn waren Träume voller Archetypen, universeller Symbole wie der Held oder die
            Mutter, die tief in der menschlichen Psyche verwurzelt sind. Jung glaubte, dass Träume uns helfen können, unser wahres Selbst zu erkennen und
            persönliche Probleme zu lösen.
          </p>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            In der modernen Traumforschung gibt es auch wissenschaftliche Erklärungen für Träume. Viele Wissenschaftler sehen Träume als eine Art
            Gedächtnisverarbeitung. Während wir schlafen, sortiert unser Gehirn die Erlebnisse des Tages, speichert wichtige Informationen und verwirft
            Unnötiges. Träume könnten also eine Nebenwirkung dieses Prozesses sein.
          </p>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            Unabhängig davon, welchem Ansatz man folgt, bleibt die Frage, ob Träume wirklich eine tiefere Bedeutung haben. Manche Menschen sind fest davon
            überzeugt, dass ihre Träume ihnen wichtige Hinweise auf ihr Leben geben. Andere sehen Träume eher als zufällige Gedankenspiele ohne besonderen
            Sinn. Trotz aller wissenschaftlichen Fortschritte bleibt die Welt der Träume ein geheimnisvolles und faszinierendes Gebiet. Vielleicht werden
            wir eines Tages genau verstehen, warum wir träumen und was unsere Träume bedeuten. Bis dahin können wir uns weiterhin von unseren Träumen
            inspirieren lassen und versuchen, ihre Rätsel zu lösen.
          </p>

          <h3 style={sectionTitle}>Multiple Choice Questions (7 Fragen)</h3>
          <QuestionList questions={lesenQuestions} />

          <WorkbookSubmissionReminder />
          <PreparedCheckbox checked={prepared.lesen} onChange={setPreparedFor("lesen")} />
        </div>
      )}

      {activeTab === "hoeren" && (
        <div style={card}>
          <img
            src="https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=1600&q=80"
            alt="Headphones and laptop for listening comprehension"
            loading="lazy"
            style={tabImageStyle}
          />
          <h2 style={sectionTitle}>Teil 4 (Hören) (Exercise)</h2>
          <p style={{ margin: 0 }}>
            Audio Link – {" "}
            <a href="https://drive.google.com/file/d/1c62CXG6BHBtiGA9FGWLY5Ijj9J59Pa8d/view?usp=sharing" target="_blank" rel="noreferrer">
              Open listening audio
            </a>
          </p>

          <iframe
            title="Traumwelt listening exercise"
            src="https://drive.google.com/file/d/1c62CXG6BHBtiGA9FGWLY5Ijj9J59Pa8d/preview"
            allow="autoplay"
            style={audioPreviewStyle}
          />

          <h3 style={sectionTitle}>Multiple Choice Questions (5 Fragen)</h3>
          <QuestionList questions={hoerenQuestions} />

          <WorkbookSubmissionReminder />
          <PreparedCheckbox checked={prepared.hoeren} onChange={setPreparedFor("hoeren")} />
        </div>
      )}

      {activeTab === "references" && (
        <WorkbookReferenceAnswers level="B1" lesson={{ title: "B1Day1Traumwelt", level: "B1", workbookId: "B1Day1Traumwelt" }} workbookId="B1Day1Traumwelt" />
      )}

    </div>
  );
};

export default B1Day1TraumweltWorkbookPage;
