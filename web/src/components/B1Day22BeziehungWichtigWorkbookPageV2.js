import React, { useState } from "react";
import AppBackButton from "./navigation/AppBackButton";
import AssignmentSubmissionPage from "./AssignmentSubmissionPage";
import WorkbookReferenceAnswers from "./WorkbookReferenceAnswers";
import CourseInlinePracticePanel from "./CourseInlinePracticePanel";
import { A2B1WorkbookGuidance, WorkbookSubmissionReminder } from "./A2B1WorkbookGuidance";
import {
  STANDARD_WORKBOOK_TABS,
  WorkbookTabNav,
  WorkbookTaskCard,
} from "./StandardWorkbookComponents";
import { styles } from "../styles";

const card = { ...styles.card, display: "grid", gap: 12 };
const sectionTitle = { margin: 0, fontSize: "1.1rem" };
const listSpacing = { margin: 0, paddingLeft: 20, lineHeight: 1.7 };
const contentCard = {
  border: "1px solid #e5e7eb",
  borderRadius: 10,
  padding: 12,
  background: "#fff",
  display: "grid",
  gap: 7,
  lineHeight: 1.7,
};
const tabImageStyle = {
  width: "100%",
  borderRadius: 10,
  maxHeight: 260,
  objectFit: "cover",
};

const ideaGroups = [
  { title: "1. Kommunikation", items: ["Offen reden können", "Zuhören", "Probleme gemeinsam lösen", "Regelmäßiger Austausch"] },
  { title: "2. Vertrauen und Ehrlichkeit", items: ["Treue", "Keine Geheimnisse", "Ehrliche Meinungen teilen", "Verlässlichkeit"] },
  { title: "3. Gemeinsame Interessen", items: ["Hobbys teilen", "Gemeinsame Unternehmungen", "Gemeinsamer Humor", "Musik, Filme oder Sport"] },
  { title: "4. Respekt und Unterstützung", items: ["Den anderen akzeptieren", "Unterstützung im Alltag", "Verständnis zeigen", "Keine Kontrolle oder Eifersucht"] },
  { title: "5. Zukunftspläne", items: ["Zusammenleben", "Familie planen", "Gemeinsame Ziele", "Vertrauen in die gemeinsame Zukunft"] },
];

const profileQuestions = [
  "Wie heißen Sie? Geben Sie einen fiktiven Namen für Ihr Profil an.",
  "Wie alt sind Sie? Wählen Sie ein Alter für Ihr Profil.",
  "Wo wohnen Sie? Nennen Sie eine Stadt oder Region.",
  "Welche Hobbys und Interessen haben Sie? Nennen Sie mindestens drei.",
  "Was suchen Sie in einer Beziehung?",
  "Welche Eigenschaften schätzen Sie an einem Partner? Nennen Sie mindestens drei.",
  "Was möchten Sie über sich selbst mitteilen? Schreiben Sie einen kurzen Absatz.",
  "Gibt es etwas, das Ihr idealer Partner unbedingt haben sollte?",
  "Wie würden Sie Ihre Persönlichkeit in drei Worten beschreiben?",
  "Was sind Ihre Lieblingsaktivitäten am Wochenende? Nennen Sie mindestens zwei.",
  "Wie wichtig ist Ihnen die Kommunikation in einer Beziehung? Warum?",
  "Haben Sie Haustiere? Möchten Sie, dass Ihr Partner auch Haustiere hat?",
  "Welche Musik hören Sie gerne?",
  "Wie stehen Sie zu Reisen? Welche Orte möchten Sie besuchen?",
  "Was sind Ihre Lebensziele oder Träume für die Zukunft?",
];

const berlinQuestions = [
  { stem: "Wie alt ist der Große Tiergarten?", options: ["A) wenige Minuten", "B) wenige Jahre", "C) Das steht nicht im Text.", "D) 500 Jahre"] },
  { stem: "In der Nähe welches Platzes befinden sich Weltzeituhr und Fernsehturm?", options: ["A) Siegessäule", "B) Alexanderplatz", "C) Brandenburger Tor", "D) Kurfürstendamm"] },
  { stem: "Was ist der Kurfürstendamm?", options: ["A) Ein Restaurant", "B) Ein Hotel", "C) Eine Hauptstadt", "D) Eine Einkaufsstraße"] },
  { stem: "Wo arbeitet die Erzählerin?", options: ["A) in einem Geschäft", "B) in einem Restaurant", "C) am Alexanderplatz", "D) in einem Hotel"] },
  { stem: "Was bietet das Hotel als besonderen Service für seine Gäste?", options: ["A) Fahrkarten für die U-Bahn", "B) eine Weltzeituhr", "C) Stadtrundfahrten", "D) kostenloses Frühstück"] },
];

const bewerbungQuestions = [
  { stem: "Wo findet man Stellenanzeigen nicht?", options: ["A) auf Webseiten", "B) in Zeitungen", "C) im Internet", "D) im Supermarkt"] },
  { stem: "Was steht zu Beginn einer Bewerbung?", options: ["A) Schule, Ausbildung, Kurse", "B) Name, Alter, Wohnort", "C) Berufserfahrung", "D) Interessen"] },
  { stem: "Was gehört noch zu einer Bewerbung?", options: ["A) Kopie des Reisepasses", "B) Brief der Eltern", "C) Absage der letzten Bewerbung", "D) Zeugnisse und Anschreiben"] },
  { stem: "Was passiert bei einem Bewerbungsgespräch?", options: ["A) Man lernt den Arbeitgeber kennen.", "B) Man muss eine Zeit lang zur Probe arbeiten.", "C) Man lernt die Kollegen kennen.", "D) Man bekommt Hilfe bei der Arbeitssuche."] },
  { stem: "Was passiert, wenn man eine Absage bekommt?", options: ["A) Man muss eine Stellenanzeige schreiben.", "B) Man muss eine neue Ausbildung machen.", "C) Man kann sich bei der nächsten offenen Stelle bewerben.", "D) Man bekommt ein Zeugnis."] },
];

const PreparedCheckbox = ({ checked, onChange }) => (
  <label style={{ display: "inline-flex", alignItems: "center", gap: 8, fontWeight: 600 }}>
    <input type="checkbox" checked={checked} onChange={onChange} />
    I prepared this part.
  </label>
);

const QuestionList = ({ questions }) => (
  <div style={{ display: "grid", gap: 10 }}>
    {questions.map((question, index) => (
      <div key={question.stem} style={contentCard}>
        <strong>{index + 1}. {question.stem}</strong>
        {question.options.map((option) => <span key={option}>{option}</span>)}
      </div>
    ))}
  </div>
);

export default function B1Day22BeziehungWichtigWorkbookPageV2() {
  const [activeTab, setActiveTab] = useState("sprechen");
  const [prepared, setPrepared] = useState({ sprechen: false, schreiben: false, lesen: false, hoeren: false });
  const setPreparedFor = (key) => (event) => setPrepared((value) => ({ ...value, [key]: event.target.checked }));

  return (
    <div style={{ ...styles.container, display: "grid", gap: 16 }}>
      <div style={card}>
        <AppBackButton label="Back to Course Book" fallbackPath="/campus/course" />
        <span style={{ ...styles.badge, width: "fit-content" }}>B1 · Day 22 · Kapitel 7.22</span>
        <h1 style={{ ...styles.title, marginBottom: 0 }}>B1 Workbook · Was ist dir in einer Beziehung wichtig?</h1>
        <p style={{ ...styles.subtitle, margin: 0 }}>
          Select Teil 1–4 below. The highlighted card at the top of each section tells you exactly what to answer.
        </p>
        <img
          src="https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=1600&q=80"
          alt="People discussing relationships and shared values"
          loading="lazy"
          style={tabImageStyle}
        />
        <WorkbookTabNav
          activeTab={activeTab}
          onChange={setActiveTab}
          tabs={STANDARD_WORKBOOK_TABS}
          ariaLabel="B1 Day 22 relationship workbook sections"
        />
      </div>

      <A2B1WorkbookGuidance level="B1" />

      {activeTab === "sprechen" && (
        <section style={card}>
          <h2 style={sectionTitle}>Teil 1 · Sprechen (Group Practice)</h2>
          <WorkbookTaskCard
            eyebrow="Question of the Day · Speaking"
            title="Was ist dir in einer Beziehung besonders wichtig und warum?"
            practiceOnly
            submissionNote="Prepare a 90–120 second answer for class. Teil 1 is not submitted."
          >
            <p style={{ margin: 0 }}>
              Sprich über Kommunikation, Vertrauen, gemeinsame Interessen, Respekt, Unterstützung und Zukunftspläne. Begründe deine Prioritäten mit Beispielen.
            </p>
          </WorkbookTaskCard>

          <h3 style={sectionTitle}>Zentrales Thema: Beziehung und Werte</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 10 }}>
            {ideaGroups.map((group) => (
              <div key={group.title} style={contentCard}>
                <strong>{group.title}</strong>
                <ul style={listSpacing}>{group.items.map((item) => <li key={item}>{item}</li>)}</ul>
              </div>
            ))}
          </div>

          <h3 style={sectionTitle}>Sprechthemen zur Partnersuche und Beziehung</h3>
          <p style={{ margin: 0 }}>Create a fictional profile and answer all questions for pair or group practice.</p>
          <ol style={listSpacing}>{profileQuestions.map((question) => <li key={question}>{question}</li>)}</ol>

          <h3 style={sectionTitle}>Suggested answer structure</h3>
          <ol style={listSpacing}>
            <li>Das Thema Beziehung und Werte kurz vorstellen.</li>
            <li>Zwei oder drei besonders wichtige Werte nennen.</li>
            <li>Erklären, warum diese Werte wichtig sind.</li>
            <li>Ein Beispiel aus dem Alltag oder aus einer Beobachtung geben.</li>
            <li>Die eigene Meinung zusammenfassen.</li>
          </ol>

          <CourseInlinePracticePanel type="speaking" />
          <PreparedCheckbox checked={prepared.sprechen} onChange={setPreparedFor("sprechen")} />
        </section>
      )}

      {activeTab === "schreiben" && (
        <section style={card}>
          <h2 style={sectionTitle}>Teil 2 · Schreiben (Assignment)</h2>
          <WorkbookTaskCard
            eyebrow="Your assignment · Writing"
            title="Was denken Sie über Partnersuche im Internet?"
            submissionNote="Write approximately 80–100 words and submit the finished text through the Submit tab."
          >
            <p style={{ margin: 0 }}>
              Teilen Sie Marias Ansicht oder haben Sie eine andere Meinung? Begründen Sie Ihre Antwort.
            </p>
          </WorkbookTaskCard>

          <div style={contentCard}>
            <strong>Meinung von Maria</strong>
            <p style={{ margin: 0 }}>
              Ich finde, dass die Partnersuche heutzutage durch das Internet viel einfacher geworden ist. Man hat die Möglichkeit, viele verschiedene Menschen kennenzulernen und schnell herauszufinden, ob man gemeinsame Interessen hat. Allerdings denke ich, dass es auch schwierig sein kann, weil viele Leute sich online anders präsentieren, als sie wirklich sind. Manchmal vermisse ich die Zeiten, als man sich noch persönlich kennenlernen musste, um eine Beziehung aufzubauen.
            </p>
          </div>

          <div style={contentCard}>
            <strong>Writing points</strong>
            <ul style={listSpacing}>
              <li>Sagen Sie, ob Sie Maria zustimmen.</li>
              <li>Nennen Sie Vorteile der Partnersuche im Internet.</li>
              <li>Nennen Sie mögliche Risiken oder Nachteile.</li>
              <li>Vergleichen Sie Online-Kontakt und persönliches Kennenlernen.</li>
              <li>Geben Sie ein Beispiel und formulieren Sie einen Schluss.</li>
            </ul>
          </div>

          <CourseInlinePracticePanel type="writing" />
          <WorkbookSubmissionReminder />
          <PreparedCheckbox checked={prepared.schreiben} onChange={setPreparedFor("schreiben")} />
        </section>
      )}

      {activeTab === "lesen" && (
        <section style={card}>
          <h2 style={sectionTitle}>Teil 3 · Lesen (Assignment)</h2>
          <WorkbookTaskCard
            eyebrow="Your assignment · Reading"
            title="Lesen Sie den Text Berlin und beantworten Sie alle fünf Fragen."
            submissionNote="Submit only the answer letters in this format: 1D, 2B, 3D …"
          >
            <p style={{ margin: 0 }}>Read the complete text first. Then choose one answer, A–D, for every question.</p>
          </WorkbookTaskCard>

          <article style={contentCard}>
            <h3 style={{ margin: 0 }}>Berlin</h3>
            <p style={{ margin: 0 }}>Berlin ist nicht nur Weltmetropole und die Hauptstadt Deutschlands, sondern auch meine Heimatstadt. Jeden Morgen auf dem Weg zur Arbeit komme ich an vielen berühmten Sehenswürdigkeiten vorbei. Da ist zunächst der Große Tiergarten, welcher schon über 500 Jahre alt ist. Von hier ist es nicht weit bis zum Brandenburger Tor und der Siegessäule. Hier steige ich in die U-Bahn und fahre einige Stationen bis zum Alexanderplatz, wo sich die Weltzeituhr und das Wahrzeichen der Stadt, der Fernsehturm, befinden.</p>
            <p style={{ margin: 0 }}>Von dort sind es nur wenige Minuten Fußweg bis zum Kurfürstendamm, der riesigen Einkaufsstraße mit zahlreichen Restaurants, Geschäften und Hotels.</p>
            <p style={{ margin: 0 }}>Hier arbeite ich als Hotelfachfrau und betreue die zahlreichen Gäste des Hotels, welche als Touristen Berlin besichtigen. Als echte Berlinerin kann ich ihnen gute Tipps geben. Als besonderen Service bietet unser Hotel auch eigene Stadtrundfahrten an, die immer sehr gern gebucht werden.</p>
          </article>

          <QuestionList questions={berlinQuestions} />
          <WorkbookSubmissionReminder />
          <PreparedCheckbox checked={prepared.lesen} onChange={setPreparedFor("lesen")} />
        </section>
      )}

      {activeTab === "hoeren" && (
        <section style={card}>
          <h2 style={sectionTitle}>Teil 4 · Lesen (Assignment)</h2>
          <WorkbookTaskCard
            eyebrow="Your assignment · Reading"
            title="Lesen Sie den Text Bewerbung und beantworten Sie alle fünf Fragen."
            submissionNote="Submit only the answer letters in this format: 1D, 2B, 3D …"
          >
            <p style={{ margin: 0 }}>Read the complete text first. Then choose one answer, A–D, for every question.</p>
          </WorkbookTaskCard>

          <article style={contentCard}>
            <h3 style={{ margin: 0 }}>Bewerbung</h3>
            <p style={{ margin: 0 }}>Der erste Schritt bei der Jobsuche ist, eine passende Stellenanzeige zu finden. Sehr viele offene Stellen kann man im Internet finden. Es gibt viele Webseiten, die diese Stellen sammeln. Dort kann man sich meistens direkt bewerben. Viele dieser Seiten sind auch für bestimmte Gruppen, zum Beispiel Studierende, Journalisten oder Handwerker. Stellenanzeigen findet man aber auch in Zeitungen.</p>
            <p style={{ margin: 0 }}>Bei der Bewerbung gibt es einiges zu beachten. Zu Beginn stehen die wichtigsten Daten: Name, Alter, Wohnort, Nationalität und oft auch ein Bewerbungsfoto. Darunter schreibt man die Ausbildung. Sehr wichtig sind auch Berufserfahrung, Interessen und besondere Fähigkeiten wie Sprachen, Kurse oder Computerkenntnisse. Zu einer Bewerbung gehören neben dem Lebenslauf auch ein Anschreiben und Zeugnisse.</p>
            <p style={{ margin: 0 }}>Wer Glück hat, bekommt eine Einladung zu einem Vorstellungsgespräch. Dort lernt man den Arbeitgeber kennen, erfährt mehr über die Arbeit und kann sich selbst präsentieren. Wer eine Absage bekommt, versucht es mit der nächsten offenen Stelle.</p>
          </article>

          <QuestionList questions={bewerbungQuestions} />
          <WorkbookSubmissionReminder />
          <PreparedCheckbox checked={prepared.hoeren} onChange={setPreparedFor("hoeren")} />
        </section>
      )}

      {activeTab === "references" && (
        <WorkbookReferenceAnswers
          level="B1"
          lesson={{ title: "B1Day22BeziehungWichtig", level: "B1", day: 22, workbookId: "B1Day22BeziehungWichtig" }}
          workbookId="B1Day22BeziehungWichtig"
        />
      )}

      {activeTab === "submit" && (
        <section style={card}>
          <h2 style={sectionTitle}>Submit workbook answers</h2>
          <WorkbookTaskCard
            eyebrow="Final step"
            title="Submit Teil 2, Teil 3 and Teil 4."
            submissionNote="Do not submit Teil 1."
          >
            <p style={{ margin: 0 }}>
              Paste your opinion text, five Berlin answer letters and five Bewerbung answer letters into the form below.
            </p>
          </WorkbookTaskCard>
          <div className="b1-day22-submission-page" style={{ border: "1px solid #bfdbfe", borderRadius: 14, padding: 8, background: "#fff" }}>
            <style>{`.b1-day22-submission-page > div > section:first-child { display: none !important; }
            .b1-day22-submission-page select { display: none !important; }`}</style>
            <AssignmentSubmissionPage
              submissionContext={{
                level: "B1",
                day: 22,
                assignmentKey: "B1-7.22",
                canonicalAssignmentKey: "B1-7.22",
              }}
            />
          </div>
        </section>
      )}
    </div>
  );
}
