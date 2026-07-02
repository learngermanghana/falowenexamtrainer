import React, { useState } from "react";
import AppBackButton from "./navigation/AppBackButton";
import AssignmentSubmissionPage from "./AssignmentSubmissionPage";
import CourseInlinePracticePanel from "./CourseInlinePracticePanel";
import WorkbookReferenceAnswers from "./WorkbookReferenceAnswers";
import RadioFirstWorkbookGate from "./RadioFirstWorkbookGate";
import { A2B1WorkbookGuidance, WorkbookSubmissionReminder } from "./A2B1WorkbookGuidance";
import {
  STANDARD_WORKBOOK_TABS,
  WorkbookTabNav,
  WorkbookTaskCard,
} from "./StandardWorkbookComponents";
import { styles } from "../styles";

const card = { ...styles.card, display: "grid", gap: 14 };
const title = { margin: 0, fontSize: "1.15rem" };
const list = { margin: 0, paddingLeft: 22, lineHeight: 1.75 };
const box = {
  border: "1px solid #e5e7eb",
  borderRadius: 12,
  padding: 13,
  background: "#fff",
  display: "grid",
  gap: 8,
  lineHeight: 1.7,
};
const highlight = { ...box, background: "#eff6ff", borderColor: "#bfdbfe" };
const imageStyle = { width: "100%", borderRadius: 12, maxHeight: 290, objectFit: "cover" };
const videoStyle = { width: "100%", minHeight: 315, border: 0, borderRadius: 12 };

const Prepared = ({ checked, onChange }) => (
  <label style={{ display: "inline-flex", gap: 8, alignItems: "center", fontWeight: 700 }}>
    <input type="checkbox" checked={checked} onChange={onChange} /> I prepared this part.
  </label>
);

const QuestionList = ({ items }) => (
  <div style={{ display: "grid", gap: 10 }}>
    {items.map((item, index) => (
      <article key={`${item.stem}-${index}`} style={box}>
        <strong>{index + 1}. {item.stem}</strong>
        {item.options.map((option) => <span key={option}>{option}</span>)}
      </article>
    ))}
  </div>
);

const readingQuestions = [
  { stem: "Erst durch den Anruf bemerkte Susanne das Fehlen ihrer Brieftasche.", options: ["A) Richtig", "B) Falsch"] },
  { stem: "Susanne glaubte, die Brieftasche beim Bezahlen vergessen zu haben.", options: ["A) Richtig", "B) Falsch"] },
  { stem: "Der Finder hatte die Brieftasche ins Fundbüro gebracht.", options: ["A) Richtig", "B) Falsch"] },
  { stem: "Die Telefonnummer der Bank war in der Brieftasche.", options: ["A) Richtig", "B) Falsch"] },
  { stem: "In Susannes Brieftasche fehlte nichts.", options: ["A) Richtig", "B) Falsch"] },
  { stem: "Susanne konnte dem Finder persönlich für seine Ehrlichkeit danken.", options: ["A) Richtig", "B) Falsch"] },
];

function Day20WorkbookContent() {
  const [activeTab, setActiveTab] = useState("sprechen");
  const [prepared, setPrepared] = useState({ sprechen: false, schreiben: false, lesen: false, hoeren: false });
  const mark = (key) => (event) => setPrepared((old) => ({ ...old, [key]: event.target.checked }));

  return (
    <div style={{ ...styles.container, display: "grid", gap: 16 }}>
      <header style={card}>
        <AppBackButton label="Back to Course Book" fallbackPath="/campus/course" />
        <span style={{ ...styles.badge, width: "fit-content" }}>B1 · Day 20 · Kapitel 6.20</span>
        <h1 style={{ ...styles.title, margin: 0 }}>B1 Workbook · Wie wird man …?</h1>
        <p style={{ ...styles.subtitle, margin: 0 }}>
          Select Teil 1–4, Ref or Submit. Teil 1 is group practice, Teil 4 is self-check, and only Schreiben and Lesen are submitted.
        </p>

        <div
          style={{
            position: "sticky",
            top: 0,
            zIndex: 20,
            padding: 10,
            margin: "0 -4px",
            border: "1px solid #bfdbfe",
            borderRadius: 14,
            background: "rgba(255,255,255,0.98)",
            boxShadow: "0 8px 20px rgba(15, 23, 42, 0.08)",
          }}
        >
          <WorkbookTabNav
            activeTab={activeTab}
            onChange={setActiveTab}
            tabs={STANDARD_WORKBOOK_TABS}
            ariaLabel="B1 Day 20 workbook sections"
          />
        </div>

        <img
          src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1600&q=80"
          alt="Learners discussing education, qualifications and careers"
          loading="lazy"
          style={imageStyle}
        />
      </header>

      <A2B1WorkbookGuidance level="B1" />

      {activeTab === "sprechen" && (
        <section style={card}>
          <h2 style={title}>Teil 1 · Sprechen (Group Practice)</h2>
          <WorkbookTaskCard
            eyebrow="Question of the Day · Speaking"
            title="Welche Ausbildung und Qualifikationen sind für deinen Beruf wichtig?"
            practiceOnly
            submissionNote="Prepare a 90–120 second answer for class. Teil 1 is not submitted."
          >
            <p style={{ margin: 0 }}>
              Wähle deinen Wunschberuf oder einen Beruf, den du gut kennst. Erkläre den Ausbildungsweg, wichtige Qualifikationen, die Situation in deinem Heimatland sowie Vor- und Nachteile.
            </p>
          </WorkbookTaskCard>

          <img
            src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1600&q=80"
            alt="A group discussing professions and career paths"
            loading="lazy"
            style={imageStyle}
          />

          <div style={highlight}>
            <strong>Beispiel: Wie wird man Arzt oder Ärztin?</strong>
            <ol style={list}>
              <li>Abitur machen</li>
              <li>Medizinstudium absolvieren</li>
              <li>Staatsexamen bestehen</li>
              <li>Facharztausbildung machen</li>
              <li>Berufserfahrung sammeln</li>
            </ol>
          </div>

          <div style={box}>
            <strong>Beruf kennen: Themen und Leitfragen</strong>
            <ol style={list}>
              <li><strong>Beliebte Berufe:</strong> Arzt/Ärztin, Ingenieur/in, Lehrer/in, Kaufmann/Kauffrau, Handwerker/in, Künstler/in, IT-Spezialist/in</li>
              <li><strong>Ausbildung und Studium:</strong> Schulabschluss, Universität, Fachhochschule, Berufsausbildung, Lehre oder Praktikum</li>
              <li><strong>Wichtige Qualifikationen:</strong> Teamarbeit, Kommunikation, Kreativität, technische Kenntnisse, Sprachen und IT</li>
              <li><strong>Karriereweg:</strong> Schulabschluss, Ausbildung oder Studium, Berufseinstieg, Weiterbildung und Karriereaufstieg</li>
              <li><strong>Herausforderungen und Chancen:</strong> Ausbildungsdauer, Kosten, Arbeitsmarkt und Aufstiegsmöglichkeiten</li>
            </ol>
          </div>

          <div style={box}>
            <strong>Fragen zum Nachdenken</strong>
            <ul style={list}>
              <li>Welcher Beruf interessiert dich und warum?</li>
              <li>Welche Ausbildung oder Qualifikationen brauchst du für deinen Traumberuf?</li>
              <li>Was ist wichtiger: Erfahrung oder Ausbildung?</li>
              <li>Glaubst du, dass lebenslanges Lernen wichtig ist?</li>
            </ul>
          </div>

          <div style={highlight}>
            <strong>Suggested answer structure</strong>
            <ol style={list}>
              <li>Begrüßung und Thema vorstellen.</li>
              <li>Den Beruf und den Ausbildungsweg erklären.</li>
              <li>Wichtige Qualifikationen und Fähigkeiten nennen.</li>
              <li>Die Situation im Heimatland beschreiben.</li>
              <li>Vor- und Nachteile oder Herausforderungen erklären.</li>
              <li>Die eigene Meinung zusammenfassen.</li>
            </ol>
          </div>

          <div style={box}>
            <strong>Useful phrases</strong>
            <ul style={list}>
              <li>Für diesen Beruf braucht man …</li>
              <li>Man muss zuerst … machen und danach … absolvieren.</li>
              <li>Praktische Erfahrung ist wichtig, weil …</li>
              <li>In meinem Heimatland ist der Karriereweg ähnlich/anders.</li>
              <li>Einerseits dauert die Ausbildung lange, andererseits hat man gute Chancen.</li>
            </ul>
          </div>

          <CourseInlinePracticePanel type="speaking" />
          <Prepared checked={prepared.sprechen} onChange={mark("sprechen")} />
        </section>
      )}

      {activeTab === "schreiben" && (
        <section style={card}>
          <h2 style={title}>Teil 2 · Schreiben (Assignment)</h2>
          <WorkbookTaskCard
            eyebrow="Your assignment · Writing"
            title="Sind Ausbildung und Qualifikationen wichtig für den Beruf?"
            submissionNote="Write approximately 80–100 words and submit your final text in the Submit tab."
          >
            <p style={{ margin: 0 }}>
              Reagieren Sie auf Felix' Meinung. Sagen Sie, ob Sie zustimmen, vergleichen Sie Ausbildung mit Erfahrung und nennen Sie ein Beispiel.
            </p>
          </WorkbookTaskCard>

          <img
            src="https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1600&q=80"
            alt="Student writing about education and qualifications"
            loading="lazy"
            style={imageStyle}
          />

          <div style={highlight}>
            <strong>Beitrag von Felix</strong>
            <p style={{ margin: 0 }}>
              Eine gute Ausbildung hilft, einen guten Job zu finden. Ich stimme dem zu, denn mit Qualifikationen hat man bessere Chancen auf dem Arbeitsmarkt. Dennoch sind auch Erfahrung und persönliche Fähigkeiten wichtig. Ich finde, dass man immer weiterlernen sollte, um erfolgreich zu sein. Was denken Sie darüber?
            </p>
          </div>

          <div style={box}>
            <strong>Beantworten Sie diese Inhaltspunkte</strong>
            <ul style={list}>
              <li>Stimmen Sie Felix zu oder nicht?</li>
              <li>Warum sind Ausbildung und Qualifikationen wichtig oder nicht wichtig?</li>
              <li>Was ist wichtiger: Ausbildung oder praktische Erfahrung?</li>
              <li>Nennen Sie ein Beispiel aus Ihrem Leben oder Heimatland.</li>
              <li>Formulieren Sie einen klaren Schluss.</li>
            </ul>
          </div>

          <div style={box}>
            <strong>Writing support</strong>
            <ol style={list}>
              <li>Einleitung</li>
              <li>Reaktion auf Felix</li>
              <li>Ausbildung und Erfahrung vergleichen</li>
              <li>Beispiel</li>
              <li>Eigene Meinung</li>
              <li>Schluss</li>
            </ol>
          </div>

          <div style={box}>
            <strong>Writing support template</strong>
            <p style={{ margin: 0, whiteSpace: "pre-line" }}>{`Liebe Forum-Mitglieder,

ich möchte meine Meinung zum Thema Ausbildung und Qualifikationen äußern.

Ich stimme Felix zu / nicht ganz zu, weil …

Einerseits … Andererseits …

In meinem Leben / In meinem Heimatland …

Zusammenfassend finde ich, dass …

Mit freundlichen Grüßen
[Ihr Name]`}</p>
          </div>

          <CourseInlinePracticePanel type="writing" />
          <WorkbookSubmissionReminder />
          <Prepared checked={prepared.schreiben} onChange={mark("schreiben")} />
        </section>
      )}

      {activeTab === "lesen" && (
        <section style={card}>
          <h2 style={title}>Teil 3 · Lesen (Assignment)</h2>
          <WorkbookTaskCard
            eyebrow="Your assignment · Reading"
            title="Lesen Sie den Blogeintrag und beantworten Sie alle sechs Richtig/Falsch-Fragen."
            submissionNote="Submit only the answer letters in this format: 1A, 2B, 3A …"
          >
            <p style={{ margin: 0 }}>
              Lesen Sie zuerst den vollständigen Text. Entscheiden Sie danach bei jeder Aussage: A) Richtig oder B) Falsch.
            </p>
          </WorkbookTaskCard>

          <img
            src="https://images.unsplash.com/photo-1456324504439-367cee3b3c32?auto=format&fit=crop&w=1600&q=80"
            alt="Reading a blog entry for B1 comprehension"
            loading="lazy"
            style={imageStyle}
          />

          <article style={box}>
            <h3 style={{ margin: 0 }}>SusannesAlltagsBlog.at</h3>
            <p style={{ margin: 0, color: "#475569" }}>Mein Alltag, meine Gedanken, mein Leben ... · Donnerstag, den 23. Juni</p>
            <p>Was mir heute passiert ist, das glaubt mir keiner: Als ich zu Mittag nichts ahnend in der Küche beim Kochen stand, läutete mein Handy. Eine Frauenstimme erklärte mir, dass meine Brieftasche in der Bankfiliale abgegeben worden war und ich sie dort abholen könnte. Mir war noch gar nicht aufgefallen, dass sie fehlte, und ich hatte relativ viel Bargeld eingesteckt.</p>
            <p>Schnell holte ich meine Handtasche hervor und suchte nach der Brieftasche. Auch nach längerem Kramen konnte ich sie nicht finden. Ich machte mich auf den Weg zur Bank und überlegte, wo ich sie liegen gelassen hatte: wahrscheinlich im Supermarkt an der Kasse. In der Bank erfuhr ich, dass ein junger Mann die Brieftasche abgegeben hatte.</p>
            <p>Er hatte sie auf dem Parkplatz vor dem Supermarkt gefunden und wollte sie zuerst ins Fundbüro bringen. Weil der Weg dorthin zu weit war, suchte er nach einer anderen Möglichkeit. Auf meiner Bankomatkarte fand er meinen Namen und den Namen meiner Bank. Er brachte die Brieftasche in die nächste Filiale, und dank der Computervernetzung konnte die Bank meine Telefonnummer schnell herausfinden.</p>
            <p style={{ marginBottom: 0 }}>Die Brieftasche muss mir beim Verlassen des Supermarktes aus der Handtasche gerutscht sein. Zum Glück war alles noch da. Leider weiß ich nicht, wie ich dem ehrlichen Finder persönlich danken kann. Vielleicht liest er diesen Blogeintrag: Vielen, vielen Dank, lieber Finder! Bis bald, eure Susanne.</p>
          </article>

          <QuestionList items={readingQuestions} />
          <WorkbookSubmissionReminder />
          <Prepared checked={prepared.lesen} onChange={mark("lesen")} />
        </section>
      )}

      {activeTab === "hoeren" && (
        <section style={card}>
          <h2 style={title}>Teil 4 · Hören (Self-check)</h2>
          <WorkbookTaskCard
            eyebrow="Independent practice · Listening"
            title="Bearbeiten Sie den Goethe-standard Hören-Test und kontrollieren Sie Ihre Antworten selbst."
            practiceOnly
            submissionNote="Teil 4 is self-check practice. Do not submit your Hören answers."
          >
            <p style={{ margin: 0 }}>
              Lesen Sie zuerst die Aufgaben im Video, hören Sie aufmerksam zu und vergleichen Sie Ihre Lösungen danach mit den Antworten im Video.
            </p>
          </WorkbookTaskCard>

          <img
            src="https://images.unsplash.com/photo-1478737270239-2f02b77fc618?auto=format&fit=crop&w=1600&q=80"
            alt="Headphones for German listening practice"
            loading="lazy"
            style={imageStyle}
          />

          <iframe
            style={videoStyle}
            src="https://www.youtube-nocookie.com/embed/fMCYUVNYc9U?rel=0&playsinline=1"
            title="B1 Day 20 Hören"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />

          <div style={highlight}>
            <strong>Important self-check instructions</strong>
            <p style={{ margin: 0 }}>
              The answers are provided in the video. Mark your own result. Only Lesen and Schreiben are submitted for tutor evaluation.
            </p>
          </div>

          <Prepared checked={prepared.hoeren} onChange={mark("hoeren")} />
        </section>
      )}

      {activeTab === "references" && (
        <WorkbookReferenceAnswers
          level="B1"
          lesson={{ title: "B1Day20WieWirdMan", level: "B1", day: 20, workbookId: "B1Day20WieWirdMan" }}
          workbookId="B1Day20WieWirdMan"
        />
      )}

      {activeTab === "submit" && (
        <section style={card}>
          <h2 style={title}>Submit Workbook · Day 20 · Kapitel 6.20</h2>
          <WorkbookTaskCard
            eyebrow="Final step"
            title="Submit Teil 2 and Teil 3 only."
            submissionNote="Do not submit Teil 1 or Teil 4."
          >
            <ul style={list}>
              <li><strong>Teil 2 · Schreiben:</strong> Paste your final 80–100 word opinion text.</li>
              <li><strong>Teil 3 · Lesen:</strong> Paste your six Richtig/Falsch answer letters.</li>
              <li><strong>Teil 1 · Sprechen:</strong> Group practice only; do not submit it.</li>
              <li><strong>Teil 4 · Hören:</strong> Self-check only; do not submit it.</li>
            </ul>
          </WorkbookTaskCard>

          <div
            className="b1-day20-submission-page"
            style={{ border: "1px solid #bfdbfe", borderRadius: 14, padding: 8, background: "#fff" }}
          >
            <style>{`.b1-day20-submission-page > div > section:first-child { display: none !important; }
            .b1-day20-submission-page select { display: none !important; }`}</style>
            <AssignmentSubmissionPage
              submissionContext={{
                level: "B1",
                day: 20,
                assignmentKey: "B1-6.20",
                canonicalAssignmentKey: "B1-6.20",
              }}
            />
          </div>
        </section>
      )}
    </div>
  );
}

export default function B1Day20WieWirdManWorkbookPage() {
  return (
    <RadioFirstWorkbookGate level="B1" day={20}>
      <Day20WorkbookContent />
    </RadioFirstWorkbookGate>
  );
}
