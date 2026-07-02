import React, { useState } from "react";
import AppBackButton from "./navigation/AppBackButton";

import { styles } from "../styles";
import AssignmentSubmissionPage from "./AssignmentSubmissionPage";
import WorkbookReferenceAnswers from "./WorkbookReferenceAnswers";
import CourseInlinePracticePanel from "./CourseInlinePracticePanel";
import { A2B1WorkbookGuidance, WorkbookSubmissionReminder } from "./A2B1WorkbookGuidance";
import {
  STANDARD_WORKBOOK_TABS,
  WorkbookTabNav,
  WorkbookTaskCard,
} from "./StandardWorkbookComponents";

const DAY = 20;
const CHAPTER = "6.20";
const ASSIGNMENT_KEY = "B1-6.20";
const WORKBOOK_ID = "B1Day20WieWirdMan";

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

const careerBranches = [
  {
    title: "Beliebte Berufe (Popular Professions)",
    items: [
      "Arzt/Ärztin",
      "Ingenieur/in",
      "Lehrer/in",
      "Kaufmann/Kauffrau",
      "Handwerker/in",
      "Künstler/in",
      "IT-Spezialist/in",
    ],
  },
  {
    title: "Ausbildung & Studium (Education & Studies)",
    items: [
      "Schule und Abschluss: Welche Schulbildung braucht man?",
      "Universität oder Fachhochschule: Muss man studieren?",
      "Berufsausbildung oder Lehre: Gibt es einen praktischen Ausbildungsweg?",
      "Praktische Erfahrung: Muss man ein Praktikum machen?",
    ],
  },
  {
    title: "Wichtige Qualifikationen (Important Qualifications)",
    items: [
      "Soft Skills: Teamarbeit, Kommunikation und Kreativität",
      "Hard Skills: technische Kenntnisse, Sprachkenntnisse und IT-Kenntnisse",
      "Zertifikate und Diplome: Welche Nachweise braucht man?",
    ],
  },
  {
    title: "Karriereweg (Career Path)",
    items: [
      "Schulabschluss",
      "Ausbildung oder Studium",
      "Berufseinstieg",
      "Weiterbildung",
      "Karriereaufstieg",
    ],
  },
  {
    title: "Herausforderungen und Chancen (Challenges & Opportunities)",
    items: [
      "Lange Ausbildungszeiten: Manche Berufe erfordern viele Jahre Studium.",
      "Kosten: Gibt es finanzielle Unterstützung für das Studium oder die Ausbildung?",
      "Arbeitsmarkt: Gibt es viele offene Stellen in diesem Bereich?",
      "Aufstiegsmöglichkeiten: Kann man in diesem Beruf Karriere machen?",
    ],
  },
];

const discussionQuestions = [
  "Welcher Beruf interessiert dich und warum?",
  "Welche Ausbildung oder Qualifikationen brauchst du für deinen Traumberuf?",
  "Was ist wichtiger: Erfahrung oder Ausbildung?",
  "Glaubst du, dass lebenslanges Lernen wichtig ist?",
];

const doctorCareerPath = [
  "Abitur machen",
  "Medizinstudium absolvieren",
  "Staatsexamen bestehen",
  "Facharztausbildung machen",
  "Berufserfahrung sammeln",
];

const lesenQuestions = [
  {
    stem: "Erst durch den Anruf bemerkte Susanne das Fehlen ihrer Brieftasche.",
    options: ["a) Richtig", "b) Falsch"],
  },
  {
    stem: "Susanne glaubte, die Brieftasche beim Bezahlen vergessen zu haben.",
    options: ["a) Richtig", "b) Falsch"],
  },
  {
    stem: "Der Finder hatte die Brieftasche ins Fundbüro gebracht.",
    options: ["a) Richtig", "b) Falsch"],
  },
  {
    stem: "Die Telefonnummer der Bank war in der Brieftasche.",
    options: ["a) Richtig", "b) Falsch"],
  },
  {
    stem: "In Susannes Brieftasche fehlte nichts.",
    options: ["a) Richtig", "b) Falsch"],
  },
  {
    stem: "Susanne konnte dem Finder persönlich für seine Ehrlichkeit danken.",
    options: ["a) Richtig", "b) Falsch"],
  },
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
      <div key={question.stem} style={questionCardStyle}>
        <strong>{index + 1}. {question.stem}</strong>
        {question.options.map((option) => (
          <span key={option}>{option}</span>
        ))}
      </div>
    ))}
  </div>
);

const B1Day20WieWirdManWorkbookPage = () => {
  const [activeTab, setActiveTab] = useState("sprechen");
  const [prepared, setPrepared] = useState({
    sprechen: false,
    schreiben: false,
    lesen: false,
    hoeren: false,
  });

  const setPreparedFor = (tabKey) => (event) =>
    setPrepared((previous) => ({ ...previous, [tabKey]: event.target.checked }));

  return (
    <div style={{ ...styles.container, display: "grid", gap: 16 }}>
      <div style={card}>
        <AppBackButton label="Back to Course Book" fallbackPath="/campus/course" />

        <span style={{ ...styles.badge, width: "fit-content" }}>
          B1 · Day {DAY} · Kapitel {CHAPTER}
        </span>
        <h1 style={{ ...styles.title, marginBottom: 0 }}>
          B1 Workbook · Wie wird man …?
        </h1>
        <p style={{ ...styles.subtitle, margin: 0 }}>
          Select Teil 1–4 below. The highlighted card at the top of each section tells you exactly what to prepare, submit or check yourself.
        </p>
        <img
          src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1600&q=80"
          alt="Learners discussing career paths, education and qualifications"
          loading="lazy"
          style={tabImageStyle}
        />

        <WorkbookTabNav
          activeTab={activeTab}
          onChange={setActiveTab}
          tabs={STANDARD_WORKBOOK_TABS}
          ariaLabel="B1 Day 20 Wie wird man workbook sections"
        />
      </div>

      <A2B1WorkbookGuidance level="B1" />

      {activeTab === "sprechen" && (
        <section style={card}>
          <h2 style={sectionTitle}>Teil 1 · Sprechen (Group Practice)</h2>
          <WorkbookTaskCard
            eyebrow="Question of the Day · Speaking"
            title="Welche Ausbildung und Qualifikationen sind für deinen Beruf wichtig?"
            practiceOnly
            submissionNote="Prepare a 90–120 second answer for class. Teil 1 is not submitted."
          >
            <p style={{ margin: 0 }}>
              Wähle deinen Wunschberuf oder einen Beruf, den du gut kennst. Erkläre den Ausbildungsweg, wichtige Qualifikationen, deine persönliche Erfahrung, die Situation in deinem Heimatland sowie Vor- und Nachteile.
            </p>
          </WorkbookTaskCard>

          <img
            src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1600&q=80"
            alt="A group discussing professions, qualifications and career plans"
            loading="lazy"
            style={tabImageStyle}
          />

          <h3 style={sectionTitle}>Brain Map: Wie wird man …?</h3>
          <p style={{ margin: 0, color: "#475569" }}>
            Use the supporting material below to collect ideas before answering the Question of the Day. You do not need to answer every point separately.
          </p>
          <ol style={listSpacing}>
            <li><strong>Zentrales Thema:</strong> Schreibe „Wie wird man …?“ in die Mitte deiner Brain Map.</li>
            <li><strong>Beruf wählen:</strong> Ergänze den Beruf, über den du sprechen möchtest.</li>
            <li><strong>Hauptäste:</strong> Nutze Ausbildung, Qualifikationen, Karriereweg, Herausforderungen und Chancen.</li>
            <li><strong>Beispiele:</strong> Notiere konkrete Schritte, Fähigkeiten und Erfahrungen.</li>
          </ol>

          <h3 style={sectionTitle}>Idea bank</h3>
          <div style={{ display: "grid", gap: 10 }}>
            {careerBranches.map((branch) => (
              <div key={branch.title} style={questionCardStyle}>
                <strong>{branch.title}</strong>
                <ul style={listSpacing}>
                  {branch.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div style={questionCardStyle}>
            <strong>Beispiel: Wie wird man Arzt oder Ärztin?</strong>
            <ol style={listSpacing}>
              {doctorCareerPath.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </div>

          <h3 style={sectionTitle}>Fragen zum Nachdenken</h3>
          <ul style={listSpacing}>
            {discussionQuestions.map((question) => (
              <li key={question}>{question}</li>
            ))}
          </ul>

          <h3 style={sectionTitle}>Suggested answer structure</h3>
          <ol style={listSpacing}>
            <li><strong>Begrüßung und Thema:</strong> „Guten Tag. Heute spreche ich über den Beruf …“</li>
            <li><strong>Inhalt und Struktur:</strong> Nenne kurz die Punkte, über die du sprechen wirst.</li>
            <li><strong>Persönliche Erfahrung:</strong> Erkläre, warum dich dieser Beruf interessiert oder was du darüber weißt.</li>
            <li><strong>Situation im Heimatland:</strong> Beschreibe Ausbildung, Arbeitsmarkt und typische Karrierewege.</li>
            <li><strong>Vor- und Nachteile:</strong> Bewerte Zeit, Kosten, Chancen und Schwierigkeiten.</li>
            <li><strong>Schluss:</strong> Fasse deine Meinung kurz zusammen.</li>
          </ol>

          <h3 style={sectionTitle}>Useful phrases</h3>
          <ul style={listSpacing}>
            <li>Für diesen Beruf braucht man …</li>
            <li>Man muss zuerst … machen und danach … absolvieren.</li>
            <li>Praktische Erfahrung ist wichtig, weil …</li>
            <li>In meinem Heimatland ist der Karriereweg ähnlich/anders.</li>
            <li>Einerseits dauert die Ausbildung lange, andererseits hat man gute Chancen.</li>
            <li>Meiner Meinung nach sind Ausbildung und Erfahrung gleich wichtig.</li>
          </ul>

          <CourseInlinePracticePanel type="speaking" />
          <PreparedCheckbox
            checked={prepared.sprechen}
            onChange={setPreparedFor("sprechen")}
          />
        </section>
      )}

      {activeTab === "schreiben" && (
        <section style={card}>
          <h2 style={sectionTitle}>Teil 2 · Schreiben (Assignment)</h2>
          <WorkbookTaskCard
            eyebrow="Your assignment · Writing"
            title="Sind Ausbildung und Qualifikationen wichtig für den Beruf?"
            submissionNote="Write approximately 80–100 words and submit the finished text through the Submit tab."
          >
            <p style={{ margin: 0 }}>
              Reagieren Sie auf Felix' Meinung. Sagen Sie klar, ob Sie zustimmen, begründen Sie Ihre Meinung, vergleichen Sie Ausbildung mit Erfahrung und nennen Sie ein Beispiel.
            </p>
          </WorkbookTaskCard>

          <img
            src="https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1600&q=80"
            alt="Student writing a B1 opinion text about education and qualifications"
            loading="lazy"
            style={tabImageStyle}
          />

          <div style={questionCardStyle}>
            <strong>Beitrag von Felix</strong>
            <p style={{ margin: 0, lineHeight: 1.7 }}>
              „Eine gute Ausbildung hilft, einen guten Job zu finden. Ich stimme dem zu, denn mit Qualifikationen hat man bessere Chancen auf dem Arbeitsmarkt. Dennoch sind auch Erfahrung und persönliche Fähigkeiten wichtig. Ich finde, dass man immer weiterlernen sollte, um erfolgreich zu sein. Was denken Sie darüber?“
            </p>
          </div>

          <div style={questionCardStyle}>
            <strong>Beantworten Sie diese Inhaltspunkte</strong>
            <ul style={listSpacing}>
              <li>Stimmen Sie Felix zu oder nicht?</li>
              <li>Warum sind Ausbildung und Qualifikationen wichtig oder nicht wichtig?</li>
              <li>Was ist wichtiger: Ausbildung oder praktische Erfahrung?</li>
              <li>Nennen Sie ein Beispiel aus Ihrem Leben oder aus Ihrem Heimatland.</li>
              <li>Formulieren Sie einen klaren Schluss.</li>
            </ul>
          </div>

          <div style={questionCardStyle}>
            <strong>Writing support template</strong>
            <p style={{ margin: 0, lineHeight: 1.7, whiteSpace: "pre-line" }}>{`Liebe Forum-Mitglieder,

ich möchte meine Meinung zum Thema Ausbildung und Qualifikationen äußern.

Ich stimme Felix zu / nicht ganz zu, weil [Begründung].

Einerseits ist eine gute Ausbildung wichtig, denn [Vorteil]. Andererseits spielt praktische Erfahrung ebenfalls eine große Rolle, weil [Begründung].

In meinem Leben / In meinem Heimatland [Beispiel].

Zusammenfassend finde ich, dass [abschließende Meinung].

Mit freundlichen Grüßen
[Ihr Name]`}</p>
          </div>

          <h3 style={sectionTitle}>Useful vocabulary</h3>
          <ul style={listSpacing}>
            <li>eine Ausbildung machen / ein Studium absolvieren / ein Praktikum machen</li>
            <li>Berufserfahrung sammeln / sich weiterbilden / Karriere machen</li>
            <li>bessere Chancen haben / auf dem Arbeitsmarkt erfolgreich sein</li>
            <li>Soft Skills entwickeln / Qualifikationen nachweisen / lebenslang lernen</li>
          </ul>

          <CourseInlinePracticePanel type="writing" />
          <WorkbookSubmissionReminder />
          <PreparedCheckbox
            checked={prepared.schreiben}
            onChange={setPreparedFor("schreiben")}
          />
        </section>
      )}

      {activeTab === "lesen" && (
        <section style={card}>
          <h2 style={sectionTitle}>Teil 3 · Lesen (Assignment)</h2>
          <WorkbookTaskCard
            eyebrow="Your assignment · Reading"
            title="Lesen Sie den Blogeintrag und beantworten Sie alle sechs Richtig/Falsch-Fragen."
            submissionNote="Submit only the answer letters in this format: 1A, 2B, 3A ..."
          >
            <p style={{ margin: 0 }}>
              Lesen Sie zuerst den vollständigen Text. Entscheiden Sie danach bei jeder Aussage: A) Richtig oder B) Falsch.
            </p>
          </WorkbookTaskCard>

          <img
            src="https://images.unsplash.com/photo-1456324504439-367cee3b3c32?auto=format&fit=crop&w=1600&q=80"
            alt="Reading a blog entry for a B1 comprehension exercise"
            loading="lazy"
            style={tabImageStyle}
          />

          <h3 style={sectionTitle}>SusannesAlltagsBlog.at</h3>
          <p style={{ margin: 0, color: "#475569" }}>Mein Alltag, meine Gedanken, mein Leben ...</p>
          <p style={{ margin: 0, lineHeight: 1.7 }}><strong>Donnerstag, den 23. Juni</strong></p>

          <p style={{ margin: 0, lineHeight: 1.7 }}>
            Was mir heute passiert ist, das glaubt mir keiner: Als ich zu Mittag nichts ahnend in der Küche beim Kochen stand, läutete mein Handy. Eine Frauenstimme erklärte mir, dass meine Brieftasche in der Bankfiliale abgegeben worden war und ich sie dort abholen könnte. Mir wurde ganz heiß – mir war noch gar nicht aufgefallen, dass sie fehlte. Und ich hatte ja auch noch relativ viel Bargeld eingesteckt!
          </p>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            Schnell holte ich meine Handtasche hervor und suchte nach der Brieftasche. Es stimmte! Auch nach längerem Kramen in der Tasche konnte ich sie nicht finden. Mein Geld war tatsächlich verschwunden! Ich machte mich also auf den Weg zur Bank und überlegte, wo ich meine Brieftasche liegen gelassen hatte: Sicherlich im Supermarkt an der Kasse. Jedenfalls kam ich bei der Bank an und war schon gespannt darauf zu erfahren, wo meine Brieftasche gefunden worden war und natürlich, ob etwas fehlte. Die Bankangestellte teilte mir mit, dass ein junger Mann die Brieftasche abgegeben hatte.
          </p>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            Er hatte sie auf dem Parkplatz vor dem Supermarkt gefunden und wollte sie eigentlich ins Fundbüro bringen – wie man es in so einem Fall eben macht. Der Weg dorthin war für ihn zu weit und so suchte er nach einer anderen Möglichkeit, mir die Brieftasche zurückzugeben. Das muss man sich einmal vorstellen: Er war so clever, dass er auf der Bankomatkarte nach meinem und dem Namen meiner Bank suchte ... Die Bank würde ja die Kontaktdaten zu meinem Namen haben und könnte mich so anrufen. Er fuhr in die nächste Filiale meiner Bank und dank der Computervernetzung der Filialen konnte meine Telefonnummer schnell herausgefunden werden.
          </p>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            Da stand ich nun mit meiner Brieftasche, die mir beim Verlassen des Supermarktes aus der Handtasche gerutscht sein muss. Zum Glück war alles noch da! Ich bin sooo froh, dass diese Episode so gut ausgegangen ist.
          </p>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            Nun weiß ich leider gar nicht, wie ich dem ehrlichen Finder danken kann. Vielleicht liest er ja diesen Blogeintrag oder es liest ihn jemand, dem er die Geschichte erzählt hat: „Vielen, vielen Dank, lieber Finder!“
          </p>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            Bis bald,<br />eure Susanne
          </p>

          <h3 style={sectionTitle}>Aufgaben · Richtig oder Falsch</h3>
          <QuestionList questions={lesenQuestions} />
          <WorkbookSubmissionReminder />
          <PreparedCheckbox
            checked={prepared.lesen}
            onChange={setPreparedFor("lesen")}
          />
        </section>
      )}

      {activeTab === "hoeren" && (
        <section style={card}>
          <h2 style={sectionTitle}>Teil 4 · Hören (Self-check)</h2>
          <WorkbookTaskCard
            eyebrow="Independent practice · Listening"
            title="Bearbeiten Sie den Goethe-standard Hören-Test und kontrollieren Sie Ihre Antworten selbst."
            practiceOnly
            submissionNote="Teil 4 is self-check practice. Do not submit your Hören answers."
          >
            <p style={{ margin: 0 }}>
              Lesen Sie zuerst die Aufgaben im Video, hören Sie aufmerksam zu und notieren Sie Ihre Antworten. Vergleichen Sie Ihre Lösungen danach mit den Antworten im Video.
            </p>
          </WorkbookTaskCard>

          <img
            src="https://images.unsplash.com/photo-1478737270239-2f02b77fc618?auto=format&fit=crop&w=1600&q=80"
            alt="Headphones and microphone for a German listening exercise"
            loading="lazy"
            style={tabImageStyle}
          />

          <iframe
            style={videoPreviewStyle}
            src="https://www.youtube-nocookie.com/embed/fMCYUVNYc9U?rel=0&playsinline=1"
            title="B1 Day 20 Hören Goethe-standard test"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />

          <div style={questionCardStyle}>
            <strong>Important self-check instructions</strong>
            <p style={{ margin: 0, lineHeight: 1.7 }}>
              This is a Goethe-standard Hören test, and the answers are provided in the YouTube video. You are responsible for checking and marking your own answers. Only Lesen and Schreiben are officially evaluated by the school for this workbook. This activity requires motivation and self-discipline.
            </p>
          </div>

          <ol style={listSpacing}>
            <li>Bearbeiten Sie den Hörtest ohne die Lösungen anzusehen.</li>
            <li>Hören Sie schwierige Teile ein zweites Mal.</li>
            <li>Vergleichen Sie Ihre Antworten mit den Lösungen im Video.</li>
            <li>Notieren Sie Ihr Ergebnis für Ihre eigene Lernkontrolle.</li>
          </ol>

          <PreparedCheckbox
            checked={prepared.hoeren}
            onChange={setPreparedFor("hoeren")}
          />
        </section>
      )}

      {activeTab === "references" && (
        <WorkbookReferenceAnswers
          level="B1"
          lesson={{
            title: WORKBOOK_ID,
            level: "B1",
            day: DAY,
            workbookId: WORKBOOK_ID,
          }}
          workbookId={WORKBOOK_ID}
        />
      )}

      {activeTab === "submit" && (
        <section style={card}>
          <h2 style={sectionTitle}>Submit Workbook · Day {DAY} · Kapitel {CHAPTER}</h2>
          <WorkbookTaskCard
            eyebrow="Final step"
            title="Submit Teil 2 and Teil 3 only."
            submissionNote="Do not submit Teil 1 or Teil 4."
          >
            <ul style={listSpacing}>
              <li><strong>Teil 2 · Schreiben:</strong> Paste your final 80–100 word opinion text.</li>
              <li><strong>Teil 3 · Lesen:</strong> Paste your six answer letters.</li>
              <li><strong>Teil 1 · Sprechen:</strong> Group practice only; do not submit it.</li>
              <li><strong>Teil 4 · Hören:</strong> Self-check only; do not submit it.</li>
            </ul>
          </WorkbookTaskCard>

          <div
            className="b1-day20-submission-page"
            style={{
              border: "1px solid #bfdbfe",
              borderRadius: 14,
              padding: 8,
              background: "#fff",
            }}
          >
            <style>{`.b1-day20-submission-page > div > section:first-child { display: none !important; }
            .b1-day20-submission-page select { display: none !important; }`}</style>
            <AssignmentSubmissionPage
              submissionContext={{
                level: "B1",
                day: DAY,
                assignmentKey: ASSIGNMENT_KEY,
                canonicalAssignmentKey: ASSIGNMENT_KEY,
              }}
            />
          </div>
        </section>
      )}
    </div>
  );
};

export default B1Day20WieWirdManWorkbookPage;
