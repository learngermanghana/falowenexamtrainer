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

const phraseGridStyle = { display: "grid", gap: 10, gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" };

const videoPreviewStyle = {
  width: "100%",
  minHeight: 315,
  border: 0,
  borderRadius: 10,
};

const lesenQuestions = [
  {
    stem: "Was ist besonders beliebt im Fitnessstudio \"Fit & Fun\"?",
    options: ["A) Yoga und Zumba", "B) Fußball und Handball", "C) Schwimmkurse", "D) Klettertraining"],
  },
  {
    stem: "Welche Mannschaftssportarten bietet der Sportverein \"Grün-Weiß\" an?",
    options: ["A) Yoga und Pilates", "B) Fußball, Handball und Volleyball", "C) Klettern und Schwimmen", "D) Tennis und Joggen"],
  },
  {
    stem: "Was ist das Highlight des jährlichen Stadtlaufs?",
    options: ["A) Die Zuschauerzahl", "B) Die Teilnahmegebühren", "C) Die Spenden an lokale Wohltätigkeitsorganisationen", "D) Die Strecke am Fluss"],
  },
  {
    stem: "Wo befindet sich die Schwimmhalle?",
    options: ["A) Im Stadtzentrum", "B) Im Stadtpark", "C) Im Seniorenclub", "D) Im Rathaus"],
  },
  {
    stem: "Was bietet der Seniorenclub \"Aktiv im Alter\" an?",
    options: ["A) Schwimmkurse", "B) Fitnessprogramme", "C) Kletterkurse", "D) Tanzshows"],
  },
  {
    stem: "Was plant die Stadtverwaltung in den nächsten Monaten?",
    options: ["A) Die Eröffnung eines neuen Fitnessstudios", "B) Die Eröffnung eines neuen Kletterparks", "C) Die Eröffnung einer neuen Schwimmhalle", "D) Die Eröffnung eines Stadions"],
  },
  {
    stem: "Welche Rolle spielt Sport in der Stadt?",
    options: ["A) Eine unwichtige Rolle", "B) Eine wichtige Rolle zur Förderung der Lebensqualität", "C) Eine Rolle nur für junge Menschen", "D) Eine Rolle nur für Profisportler"],
  },
];

const hoerenQuestions = [
  {
    stem: "Was ist besonders beliebt im neuen Fitnessstudio \"Vital Plus\"?",
    options: ["A) Yoga-Kurse", "B) Pilates- und Aerobic-Kurse", "C) Schwimmkurse", "D) Kletterkurse"],
  },
  {
    stem: "Was bietet der Stadtpark im Sommer an?",
    options: ["A) Kostenlose Yoga-Kurse", "B) Pilates- und Aerobic-Kurse", "C) Schwimmkurse", "D) Fußballturniere"],
  },
  {
    stem: "Was bietet das Schwimmbad \"Aqua Fun\" an?",
    options: ["A) Wassergymnastik und Aqua-Zumba", "B) Kletterkurse", "C) Fußballkurse", "D) Boxtraining"],
  },
  {
    stem: "Für wen ist der neue Kletterpark geeignet?",
    options: ["A) Nur für Anfänger", "B) Nur für Fortgeschrittene", "C) Für Anfänger und Fortgeschrittene", "D) Nur für Kinder"],
  },
  {
    stem: "Was bietet der Sportverein \"Fitness für alle\" an?",
    options: ["A) Yoga-Kurse", "B) Volleyball und Basketball", "C) Schwimmkurse", "D) Tennis und Golf"],
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

const A2Day15MeinLieblingssportWorkbookPage = () => {
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

        <h1 style={{ ...styles.title, marginBottom: 0 }}>A2 · Day 15 Workbook · Mein Lieblingssport</h1>
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
            src="https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=1600&q=80"
            alt="People playing basketball during sports practice"
            loading="lazy"
            style={{ width: "100%", borderRadius: 10, maxHeight: 260, objectFit: "cover" }}
          />
          <h2 style={sectionTitle}>Teil 1 · Sprechen (Group Practice)</h2>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            In this chapter, we&apos;ll engage in group exercises discussing these topics. Following this, your tutor will revise
            the questions and invite you to write a brief essay about yourself.
          </p>

          <h3 style={sectionTitle}>Zentrales Thema: „Mein Lieblingssport“</h3>
          <div style={{ ...questionCardStyle, background: "#f8fafc" }}>
            <strong>💬 Frage zur Diskussion</strong>
            <p style={{ margin: 0, lineHeight: 1.6 }}>Was ist Ihr Lieblingssport und warum?</p>
            <p style={{ margin: 0 }}>
              <strong>Vier Schlüsselwörter:</strong> Fußball · Fitness · gesund · Freunde
            </p>
          </div>
          <ol style={listSpacing}>
            <li>
              <strong>Sportart (Type of Sport) 🏅</strong>
              <ul style={listSpacing}>
                <li>Welche Sportart treibst du? – Fußball, Basketball, Schwimmen, Tennis, Laufen, Radfahren</li>
                <li>Einzelsport oder Mannschaftssport? – „Ich spiele in einer Mannschaft." / „Ich mache den Sport allein."</li>
                <li>Wo machst du den Sport? – Sportplatz, Stadion, Turnhalle, zu Hause, in der Natur</li>
              </ul>
            </li>
            <li>
              <strong>Training (Training) 🏋️‍♂️</strong>
              <ul style={listSpacing}>
                <li>Wie oft trainierst du? – „Ich trainiere dreimal pro Woche."</li>
                <li>Wie lange dauert das Training? – 30 Minuten, 1 Stunde, 2 Stunden</li>
                <li>Hast du einen Trainer? – Ja / Nein</li>
                <li>Trainierst du mit Freunden oder allein?</li>
              </ul>
            </li>
            <li>
              <strong>Bewegung (Exercise &amp; Activity) 🏃‍♀️</strong>
              <ul style={listSpacing}>
                <li>Welche Bewegungen machst du? – Rennen, springen, schwimmen, kicken, werfen</li>
                <li>Ist der Sport anstrengend? – Ja, ein bisschen, sehr</li>
                <li>Gibt es Wettbewerbe? – Ja, Turniere, Meisterschaften</li>
              </ul>
            </li>
            <li>
              <strong>Gesundheit (Health Benefits) ❤️</strong>
              <ul style={listSpacing}>
                <li>Warum ist der Sport gut für dich?</li>
                <li>„Der Sport ist gut für meine Gesundheit."</li>
                <li>Hilft der Sport beim Stressabbau? – Ja / Nein</li>
                <li>Ist Ernährung wichtig für den Sport? – Ja, gesundes Essen ist wichtig.</li>
              </ul>
            </li>
          </ol>

          <div style={questionCardStyle}>
            <strong>📝 Beispielantwort</strong>
            <p style={{ margin: 0, lineHeight: 1.6 }}>
              „Mein Lieblingssport ist Basketball. Ich spiele Basketball, weil es ein spannender Mannschaftssport ist. Ich
              trainiere zweimal pro Woche in einer Sporthalle mit meinen Freunden. Das Training dauert 1,5 Stunden. Beim
              Basketball muss man schnell laufen und hoch springen. Das ist gut für meine Fitness. Ich mag diesen Sport, weil
              er Spaß macht und mich fit hält!"
            </p>
          </div>

          <h3 style={sectionTitle}>Sprechen wie bei einer Mini-Präsentation</h3>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            Nutze diese einfache Struktur: <strong>Einleitung → Hauptteil mit Verbindungswörtern → Beispiel → Schluss</strong>.
            So wird aus kurzen Wörtern eine klare Antwort mit guten Sätzen.
          </p>
          <div style={{ ...questionCardStyle, background: "#ecfeff" }}>
            <strong>Schnelle Struktur für 30–45 Sekunden</strong>
            <ol style={listSpacing}>
              <li><strong>Einleitung:</strong> Thema nennen und einen ersten Satz sagen.</li>
              <li><strong>Hauptteil:</strong> zwei oder drei Punkte mit einfachen Connectors verbinden.</li>
              <li><strong>Beispiel:</strong> ein kurzes Beispiel aus deinem Leben geben.</li>
              <li><strong>Schluss:</strong> deine Meinung kurz zusammenfassen.</li>
            </ol>
          </div>
          <div style={phraseGridStyle}>
            <div style={{ ...questionCardStyle, background: "#f8fafc" }}>
              <strong>Gute Einleitungen</strong>
              <ul style={listSpacing}>
                <li>„Heute spreche ich über …“</li>
                <li>„Ich möchte kurz etwas über … sagen.“</li>
                <li>„Mein Thema ist …“</li>
              </ul>
            </div>
            <div style={{ ...questionCardStyle, background: "#f8fafc" }}>
              <strong>Verbindungswörter / Connectors</strong>
              <ul style={listSpacing}>
                <li><strong>und</strong> · „Ich fahre Bus und ich gehe zu Fuß.“</li>
                <li><strong>oder</strong> · „Ich nehme den Zug oder den Bus.“</li>
                <li><strong>weil</strong> · „Das ist gut, weil es einfach ist.“</li>
                <li><strong>deshalb</strong> · „Ich habe wenig Zeit, deshalb plane ich gut.“</li>
              </ul>
            </div>
            <div style={{ ...questionCardStyle, background: "#f8fafc" }}>
              <strong>Eigene Meinung ausdrücken</strong>
              <ul style={listSpacing}>
                <li>„Ich finde … gut, weil …“</li>
                <li>„Für mich ist … wichtig.“</li>
                <li>„Meiner Meinung nach ist … praktisch.“</li>
              </ul>
            </div>
            <div style={{ ...questionCardStyle, background: "#f8fafc" }}>
              <strong>Gute Schlüsse</strong>
              <ul style={listSpacing}>
                <li>„Zum Schluss kann ich sagen: …“</li>
                <li>„Deshalb finde ich … gut.“</li>
                <li>„Das ist meine Meinung. Danke fürs Zuhören.“</li>
              </ul>
            </div>
          </div>
          <div style={{ ...questionCardStyle, background: "#ecfeff" }}>
            <strong>Modellantwort (ca. 30–45 Sekunden)</strong>
            <p style={{ margin: 0, lineHeight: 1.7 }}>
              „Heute spreche ich über meinen Lieblingssport. Mein Lieblingssport ist Fußball, weil ich gern im Team spiele. Fußball macht Spaß und ist gut für die Gesundheit. Außerdem treffe ich Freunde, deshalb bin ich motiviert. Zum Beispiel spiele ich am Samstag im Park oder schaue ein Spiel im Fernsehen. Zum Schluss finde ich: Sport ist wichtig, weil man fit bleibt und weniger Stress hat.“
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
            src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=1600&q=80"
            alt="Learner writing an email assignment in a notebook"
            loading="lazy"
            style={{ width: "100%", borderRadius: 10, maxHeight: 260, objectFit: "cover" }}
          />
          <h2 style={sectionTitle}>Teil 2 · Schreiben</h2>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            <strong>Aufgabenstellung:</strong> Sie sind jetzt in Deutschland und möchten sich für einen Sportkurs anmelden.
            Schreiben Sie eine E-Mail an einen Sportverein oder ein Fitnessstudio.
          </p>
          <p style={{ margin: 0 }}>Ihre E-Mail soll folgende Punkte enthalten:</p>
          <ol style={listSpacing}>
            <li>Fragen, ob es noch freie Plätze im Sportkurs gibt.</li>
            <li>Ihre bisherigen Erfahrungen oder Ihre Motivation beschreiben.</li>
            <li>Nach Trainingszeiten und Kosten fragen.</li>
          </ol>
          <div style={{ ...questionCardStyle, background: "#f9fafb" }}>
            <strong>Writing guidance before submission</strong>
            <ul style={listSpacing}>
              <li>Start with a polite greeting and clear purpose.</li>
              <li>Use short A2-level sentences and connect ideas with weil, und, aber.</li>
              <li>End with a polite closing sentence and your name.</li>
            </ul>
          </div>
          <p style={{ margin: 0, color: "#4b5563" }}>
            Submit your final writing in the assignment submission area (not on this workbook page).
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
            src="https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=1600&q=80"
            alt="Reading text and questions for German class practice"
            loading="lazy"
            style={{ width: "100%", borderRadius: 10, maxHeight: 260, objectFit: "cover" }}
          />
          <h2 style={sectionTitle}>Teil 3 · Lesen</h2>
          <p style={{ margin: 0 }}>
            Read the article and review the multiple-choice questions. <strong>Do not answer directly on this page.</strong> Submit
            answers in the assignment area.
          </p>

          <h3 style={sectionTitle}>Sportangebote in unserer Stadt</h3>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            In unserer Stadt gibt es ein breites Angebot an Sportmöglichkeiten für Jung und Alt. Besonders beliebt sind die
            Kurse im Fitnessstudio "Fit &amp; Fun", wo man alles von Yoga bis hin zu Zumba ausprobieren kann. Für diejenigen, die
            lieber draußen aktiv sind, bietet der Sportverein "Grün-Weiß" verschiedene Mannschaftssportarten wie Fußball,
            Handball und Volleyball an.
          </p>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            Ein Highlight ist der jährliche Stadtlauf, bei dem Läufer jeden Alters teilnehmen können. Dieses Event zieht immer
            viele Zuschauer an und fördert das Gemeinschaftsgefühl. Die Teilnahmegebühren für den Stadtlauf sind moderat und
            ein Teil der Einnahmen wird an lokale Wohltätigkeitsorganisationen gespendet.
          </p>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            Auch die Schwimmhalle im Stadtpark ist ein beliebter Ort. Hier können Kinder und Erwachsene Schwimmkurse besuchen
            oder einfach nur zum Spaß schwimmen gehen. Besonders im Sommer ist die Schwimmhalle ein Ort, an dem man sich
            erfrischen und gleichzeitig fit bleiben kann.
          </p>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            Für die Älteren bietet der Seniorenclub "Aktiv im Alter" spezielle Fitnessprogramme an. Diese Kurse sind darauf
            ausgerichtet, die Beweglichkeit und Gesundheit der Senioren zu fördern. Die Teilnehmer schätzen besonders die
            Gemeinschaft und die Unterstützung, die sie in den Kursen erfahren.
          </p>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            Die Stadtverwaltung arbeitet ständig daran, das Sportangebot zu erweitern und zu verbessern. In den nächsten
            Monaten ist die Eröffnung eines neuen Kletterparks geplant, der sowohl für Anfänger als auch für erfahrene
            Kletterer geeignet sein wird. Dieser Park wird ein weiteres Highlight in unserer Stadt sein und die Möglichkeiten
            für sportliche Aktivitäten noch vielfältiger machen.
          </p>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            Sport spielt eine wichtige Rolle in unserer Stadt und trägt wesentlich zur Lebensqualität bei. Egal, ob jung oder
            alt, für jeden gibt es das passende Angebot, um aktiv und gesund zu bleiben.
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

          <WorkbookSubmissionReminder />
          <PreparedCheckbox checked={prepared.lesen} onChange={setPreparedFor("lesen")} />
        </div>
      )}

      {activeTab === "hoeren" && (
        <div style={card}>
          <img
            src="https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=1600&q=80"
            alt="Student using headphones for German listening exercise"
            loading="lazy"
            style={{ width: "100%", borderRadius: 10, maxHeight: 260, objectFit: "cover" }}
          />
          <h2 style={sectionTitle}>Teil 4 · Hören</h2>
          <p style={{ margin: 0 }}>
            Listen to the recording, then submit your answers in the assignment area (not on this page).
          </p>
          <p style={{ margin: 0 }}>
            Audio link: {" "}
            <a
              href="https://drive.google.com/file/d/14LiB4PoqdHlzzmJyJQHJ7n--v6iVddVh/view?usp=sharing"
              target="_blank"
              rel="noreferrer"
            >
              Open Teil 4 audio
            </a>
          </p>

          <h3 style={sectionTitle}>Fragen und mögliche Antworten</h3>
          {hoerenQuestions.map((question, index) => (
            <div key={question.stem} style={questionCardStyle}>
              <strong>{index + 1}. {question.stem}</strong>
              {question.options.map((option) => (
                <span key={option}>{option}</span>
              ))}
            </div>
          ))}

          <p style={{ margin: 0 }}>Embedded preview:</p>
          <iframe
            style={videoPreviewStyle}
            src="https://drive.google.com/file/d/14LiB4PoqdHlzzmJyJQHJ7n--v6iVddVh/preview"
            title="A2 Day 15 listening audio preview"
            allow="autoplay"
            allowFullScreen
          />

          <WorkbookSubmissionReminder />
          <PreparedCheckbox checked={prepared.hoeren} onChange={setPreparedFor("hoeren")} />
        </div>
      )}
    </div>
  );
};

export default A2Day15MeinLieblingssportWorkbookPage;
