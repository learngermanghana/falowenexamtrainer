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

const AUDIO_FILE_ID = "17MdMUvq-Sigu9o92asIctEUWH0iGzAoR";

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
  lineHeight: 1.7,
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

const ideaGroups = [
  {
    title: "Warum sind Teamspiele wichtig?",
    items: [
      "Zusammenarbeit verbessern und besser im Team arbeiten lernen",
      "Kommunikation stärken und klar sprechen",
      "Problemlösungsfähigkeiten entwickeln und gemeinsam Lösungen finden",
      "Fairness, Respekt und Akzeptanz anderer Meinungen lernen",
      "Spaß, Motivation und Teamgeist fördern",
    ],
  },
  {
    title: "Beliebte Teamspiele",
    items: [
      "Mannschaftssportarten: Fußball, Basketball, Volleyball und Handball",
      "Brett- und Kartenspiele: Schach, Monopoly und Uno",
      "Improvisationsspiele: Rollenspiele und Pantomime",
      "Outdoor-Spiele: Schnitzeljagd und Seilziehen",
      "Kooperative Videospiele: Minecraft, FIFA und Among Us",
    ],
  },
  {
    title: "Kooperative Aktivitäten im Alltag",
    items: [
      "Familie: gemeinsam kochen oder Gesellschaftsspiele spielen",
      "Schule und Arbeit: Teamprojekte und Gruppenpräsentationen",
      "Freiwilligenarbeit: soziale Projekte und Umweltaktionen",
      "Freizeit: Wandern in Gruppen und Musikgruppen",
    ],
  },
  {
    title: "Herausforderungen",
    items: [
      "Kommunikationsprobleme und Missverständnisse",
      "Unterschiedliche Meinungen und notwendige Kompromisse",
      "Konkurrenzdenken und der Wunsch, immer zu gewinnen",
      "Zeitmanagement und gemeinsame Termine",
    ],
  },
  {
    title: "Strategien für erfolgreiches Teamwork",
    items: [
      "Einander aktiv zuhören und Meinungen respektieren",
      "Aufgaben fair verteilen und miteinander planen",
      "Einander ermutigen und loben",
      "Konflikte ruhig und friedlich lösen",
      "Sich aufeinander verlassen und Verantwortung übernehmen",
    ],
  },
];

const lesenQuestions = [
  {
    stem: "Welche Art von Spielen wurde früher meist gespielt?",
    options: ["A) Computerspiele", "B) Brettspiele", "C) Spiele im Freien", "D) Gesellschaftsspiele"],
  },
  {
    stem: "Was ist ein Vorteil von Computerspielen laut dem Text?",
    options: ["A) Sie fördern immer echte soziale Interaktion.", "B) Sie fördern strategisches Denken.", "C) Sie machen alle Spieler sportlich.", "D) Sie ersetzen jede Form von Bewegung."],
  },
  {
    stem: "Welche negative Auswirkung kann übermäßiges Computerspielen haben?",
    options: ["A) Es fördert automatisch Kreativität.", "B) Es führt zu mehr Bewegung.", "C) Es kann zu Sucht führen.", "D) Es löst jeden Konflikt."],
  },
  {
    stem: "Was fördern traditionelle Gruppenspiele laut dem Text?",
    options: ["A) Nur digitale Fähigkeiten", "B) Soziale Fähigkeiten", "C) Nur Reaktionsfähigkeit", "D) Nur Konzentration"],
  },
  {
    stem: "Was ist eine moderne Gefahr des Spielens?",
    options: ["A) Verlust echter sozialer Interaktion und Bewegung", "B) Zunahme von Brettspielen", "C) Zu viel gemeinsames Spielen", "D) Zu viele Outdoor-Aktivitäten"],
  },
  {
    stem: "Welche Lösung schlägt der Text vor?",
    options: ["A) Nur traditionelle Spiele spielen", "B) Spiele komplett verbieten", "C) Eine Balance zwischen digitalen und traditionellen Spielen finden", "D) Nur noch alleine spielen"],
  },
  {
    stem: "Welches Spiel fördert laut dem Text die Kreativität?",
    options: ["A) Minecraft", "B) Fußball", "C) Verstecken", "D) Handball"],
  },
];

const hoerenQuestions = [
  {
    stem: "Warum spielen viele Menschen?",
    options: ["A) Um Stress abzubauen", "B) Um Probleme zu vergrößern", "C) Um Geld zu verdienen", "D) Um sich zu isolieren"],
  },
  {
    stem: "Welche Art von Spielen spielen Erwachsene laut dem Hörtext gern?",
    options: ["A) Computerspiele", "B) Brettspiele", "C) Nur Videospiele", "D) Nur Bewegungsspiele"],
  },
  {
    stem: "Was ist ein Vorteil traditioneller Spiele?",
    options: ["A) Sie bieten keine Lernmöglichkeiten.", "B) Sie fördern soziale und körperliche Fähigkeiten.", "C) Sie sind immer aufregender als digitale Spiele.", "D) Sie brauchen keine anderen Menschen."],
  },
  {
    stem: "Welche Art von Spielen hat in den letzten Jahren an Bedeutung gewonnen?",
    options: ["A) Brettspiele", "B) Digitale Spiele", "C) Bewegungsspiele", "D) Kartenspiele"],
  },
  {
    stem: "Was sollte man laut dem Hörtext nicht vergessen?",
    options: ["A) Traditionelle Spiele haben soziale und körperliche Vorteile.", "B) Digitale Spiele sind immer besser.", "C) Man sollte nur Computerspiele spielen.", "D) Traditionelle Spiele sind völlig veraltet."],
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
        {question.options.map((option) => <span key={option}>{option}</span>)}
      </div>
    ))}
  </div>
);

function B1Day11TeamspieleWorkbookContent() {
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
        <span style={{ ...styles.badge, width: "fit-content" }}>B1 · Day 11 · Kapitel 4.11</span>
        <h1 style={{ ...styles.title, marginBottom: 0 }}>B1 Workbook · Teamspiele und kooperative Aktivitäten</h1>
        <p style={{ ...styles.subtitle, margin: 0 }}>
          Select Teil 1–4 below. The highlighted card at the top of each section tells you exactly what to answer.
        </p>
        <img
          src="https://images.unsplash.com/photo-1526232761682-d26e03ac148e?auto=format&fit=crop&w=1600&q=80"
          alt="Team members cooperating during a group activity"
          loading="lazy"
          style={tabImageStyle}
        />
        <WorkbookTabNav
          activeTab={activeTab}
          onChange={setActiveTab}
          tabs={STANDARD_WORKBOOK_TABS}
          ariaLabel="B1 Day 11 Teamspiele workbook sections"
        />
      </div>

      <A2B1WorkbookGuidance level="B1" />

      {activeTab === "sprechen" && (
        <section style={card}>
          <h2 style={sectionTitle}>Teil 1 · Sprechen (Group Practice)</h2>
          <WorkbookTaskCard
            eyebrow="Question of the Day · Speaking"
            title="Sind Teamspiele und kooperative Aktivitäten für das Lernen und die persönliche Entwicklung wichtig?"
            practiceOnly
            submissionNote="Prepare a 90–120 second answer for class. Teil 1 is not submitted."
          >
            <p style={{ margin: 0 }}>
              Nennen Sie Vorteile und Nachteile, sprechen Sie über Herausforderungen und erklären Sie anhand eines Beispiels, wie gutes Teamwork gelingen kann.
            </p>
          </WorkbookTaskCard>

          <h3 style={sectionTitle}>Brain Map: Teamspiele und kooperative Aktivitäten</h3>
          <p style={{ margin: 0, color: "#475569" }}>
            Use these notes as an idea bank. You do not need to answer every point separately.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 10 }}>
            {ideaGroups.map((group) => (
              <div key={group.title} style={questionCardStyle}>
                <strong>{group.title}</strong>
                <ul style={listSpacing}>{group.items.map((item) => <li key={item}>{item}</li>)}</ul>
              </div>
            ))}
          </div>

          <div style={questionCardStyle}>
            <strong>Persönliche Erfahrungen und Meinung</strong>
            <ul style={listSpacing}>
              <li>Was ist dein Lieblings-Teamspiel?</li>
              <li>Hast du schon einmal bei einem Teamspiel einen Konflikt erlebt?</li>
              <li>Warum sind kooperative Aktivitäten im Alltag wichtig?</li>
              <li>Welche Teamspiele sind in deinem Land besonders beliebt?</li>
            </ul>
          </div>

          <h3 style={sectionTitle}>Suggested answer structure</h3>
          <ol style={listSpacing}>
            <li><strong>Einleitung:</strong> Thema und Fragestellung vorstellen.</li>
            <li><strong>Argumente dafür:</strong> positive Aspekte nennen und begründen.</li>
            <li><strong>Argumente dagegen:</strong> Schwierigkeiten oder Nachteile erklären.</li>
            <li><strong>Beispiel:</strong> eine persönliche Erfahrung oder die Situation im Heimatland beschreiben.</li>
            <li><strong>Meinung:</strong> die eigene Position deutlich machen.</li>
            <li><strong>Schluss:</strong> die wichtigsten Punkte kurz zusammenfassen.</li>
          </ol>

          <div style={questionCardStyle}>
            <strong>Useful phrases</strong>
            <ul style={listSpacing}>
              <li>Bei Teamspielen lernen die Teilnehmer, miteinander zu arbeiten.</li>
              <li>Die Teammitglieder sollten einander aktiv zuhören.</li>
              <li>Einerseits fördert Teamarbeit den Zusammenhalt, andererseits können Konflikte entstehen.</li>
              <li>Wenn man sich aufeinander verlassen kann, arbeitet das Team erfolgreicher.</li>
              <li>Zusammenfassend bin ich der Meinung, dass …</li>
            </ul>
          </div>

          <CourseInlinePracticePanel type="speaking" />
          <PreparedCheckbox checked={prepared.sprechen} onChange={setPreparedFor("sprechen")} />
        </section>
      )}

      {activeTab === "schreiben" && (
        <section style={card}>
          <h2 style={sectionTitle}>Teil 2 · Schreiben (Assignment)</h2>
          <WorkbookTaskCard
            eyebrow="Your assignment · Writing"
            title="Ist Teamkooperation in der heutigen Arbeitswelt wichtig? Schreiben Sie Ihre Meinung."
            submissionNote="Write approximately 80–100 words and submit the finished text through the Submit tab."
          >
            <p style={{ margin: 0 }}>
              Reagieren Sie auf Markus. Nennen Sie Vorteile der Zusammenarbeit, erklären Sie mindestens eine Herausforderung und formulieren Sie Ihre eigene Meinung mit einem Beispiel.
            </p>
          </WorkbookTaskCard>

          <img
            src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1600&q=80"
            alt="Colleagues cooperating at work"
            loading="lazy"
            style={tabImageStyle}
          />

          <div style={questionCardStyle}>
            <strong>Markus</strong>
            <p style={{ margin: 0 }}>
              In der modernen Arbeitswelt ist Teamkooperation entscheidend für den Erfolg. Ich stimme dem zu, denn durch Zusammenarbeit können Ideen ausgetauscht und Lösungen schneller gefunden werden. Außerdem stärkt Teamarbeit den Zusammenhalt und verbessert die Arbeitsatmosphäre. Dennoch kann es Herausforderungen geben, zum Beispiel Kommunikationsprobleme oder unterschiedliche Arbeitsweisen. Ich finde, dass gute Kommunikation, eine klare Aufgabenverteilung und gegenseitiger Respekt besonders wichtig sind. Was denken Sie darüber?
            </p>
          </div>

          <div style={questionCardStyle}>
            <strong>Writing content points</strong>
            <ul style={listSpacing}>
              <li>Fassen Sie Markus' Meinung kurz zusammen.</li>
              <li>Nennen Sie zwei Vorteile der Teamkooperation.</li>
              <li>Erklären Sie eine Herausforderung und eine mögliche Lösung.</li>
              <li>Geben Sie ein Beispiel aus Arbeit, Schule oder Alltag.</li>
              <li>Formulieren Sie Ihre eigene Meinung und einen klaren Schluss.</li>
            </ul>
          </div>

          <div style={questionCardStyle}>
            <strong>Writing support template</strong>
            <p style={{ margin: 0, lineHeight: 1.7, whiteSpace: "pre-line" }}>{`Liebe Forum-Mitglieder,

ich möchte meine Meinung zum Thema Teamkooperation äußern.

Markus meint, dass …

Ich stimme ihm zu / nicht ganz zu, weil …

Ein großer Vorteil ist, dass … Außerdem …

Eine Schwierigkeit ist … Dieses Problem kann man lösen, indem …

In meinem Alltag / In meinem Heimatland …

Zusammenfassend finde ich, dass …

Mit freundlichen Grüßen
[Ihr Name]`}</p>
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
            title="Lesen Sie den Text und beantworten Sie alle sieben Fragen."
            submissionNote="Submit only the answer letters in this format: 1C, 2B, 3C …"
          >
            <p style={{ margin: 0 }}>Read the complete text first. Then choose one answer, A–D, for every question.</p>
          </WorkbookTaskCard>

          <img
            src="https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1600&q=80"
            alt="Traditional and digital games"
            loading="lazy"
            style={tabImageStyle}
          />

          <h3 style={sectionTitle}>Spielen: Eine verlorene Kunst oder wichtiger denn je?</h3>
          <p style={{ margin: 0, lineHeight: 1.75 }}>
            Das Spielen ist eine Aktivität, die sowohl Kinder als auch Erwachsene auf unterschiedliche Weise genießen können. Früher wurden Spiele meist im Freien gespielt, oft mit einfachen Materialien oder durch kreative Fantasie. In der modernen Welt haben sich die Spielgewohnheiten jedoch stark verändert. Viele Menschen, vor allem Jugendliche, verbringen ihre Freizeit vor Bildschirmen – mit Computerspielen, Konsolenspielen oder Handyspielen.
          </p>
          <p style={{ margin: 0, lineHeight: 1.75 }}>
            Früher waren Spiele ein wichtiges Mittel zur Förderung der sozialen Interaktion. Kinder spielten draußen in Gruppen und lernten, Konflikte zu lösen, zusammenzuarbeiten und Rücksicht auf andere zu nehmen. Heute spielen viele Kinder und Jugendliche allein oder online mit Menschen, die sie nie persönlich treffen. Dadurch können zwar Freundschaften über große Distanzen entstehen, aber echte soziale Interaktion und Bewegung kommen manchmal zu kurz.
          </p>
          <p style={{ margin: 0, lineHeight: 1.75 }}>
            Moderne Computerspiele haben ebenfalls Vorteile. Sie können strategisches Denken, Konzentration und Lernen fördern. Spiele wie Minecraft unterstützen die Kreativität, während andere Spiele historische Ereignisse darstellen oder logisches Denken erfordern. Ein übermäßiger Konsum kann jedoch zu Problemen wie Spielsucht und Bewegungsmangel führen.
          </p>
          <p style={{ margin: 0, lineHeight: 1.75 }}>
            Gleichzeitig gibt es einen Trend zurück zu traditionellen Spielen. Brettspiele und Gruppenspiele wie Fußball oder Verstecken haben weiterhin ihren Platz. Viele Menschen suchen deshalb nach einer Balance zwischen digitalen Spielen und Aktivitäten, die Bewegung und persönliche soziale Kontakte fördern. Insgesamt hat das Spielen nicht an Bedeutung verloren; es sieht heute nur anders aus.
          </p>

          <h3 style={sectionTitle}>Questions</h3>
          <QuestionList questions={lesenQuestions} />
          <WorkbookSubmissionReminder />
          <PreparedCheckbox checked={prepared.lesen} onChange={setPreparedFor("lesen")} />
        </section>
      )}

      {activeTab === "hoeren" && (
        <section style={card}>
          <h2 style={sectionTitle}>Teil 4 · Hören (Assignment)</h2>
          <WorkbookTaskCard
            eyebrow="Your assignment · Listening"
            title="Hören Sie den Beitrag zweimal und beantworten Sie alle fünf Fragen."
            submissionNote="Submit only the answer letters in this format: 1A, 2B, 3B …"
          >
            <p style={{ margin: 0 }}>
              Read the questions first. Listen for reasons people play, adult preferences, traditional games and the growth of digital games.
            </p>
          </WorkbookTaskCard>

          <img
            src="https://images.unsplash.com/photo-1478737270239-2f02b77fc618?auto=format&fit=crop&w=1600&q=80"
            alt="Headphones for a German listening exercise"
            loading="lazy"
            style={tabImageStyle}
          />

          <p style={{ margin: 0 }}>
            Hören audio – <a href={`https://drive.google.com/file/d/${AUDIO_FILE_ID}/view?usp=sharing`} target="_blank" rel="noreferrer">Open listening audio</a>
          </p>
          <iframe
            title="B1 Day 11 Teamspiele listening exercise"
            src={`https://drive.google.com/file/d/${AUDIO_FILE_ID}/preview`}
            allow="autoplay"
            style={audioPreviewStyle}
          />

          <h3 style={sectionTitle}>Questions</h3>
          <QuestionList questions={hoerenQuestions} />
          <WorkbookSubmissionReminder />
          <PreparedCheckbox checked={prepared.hoeren} onChange={setPreparedFor("hoeren")} />
        </section>
      )}

      {activeTab === "references" && (
        <WorkbookReferenceAnswers
          level="B1"
          lesson={{ title: "B1Day11Teamspiele", level: "B1", day: 11, workbookId: "B1Day11Teamspiele" }}
          workbookId="B1Day11Teamspiele"
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
              Paste your final opinion text, seven reading answer letters and five listening answer letters into the form below.
            </p>
          </WorkbookTaskCard>
          <div className="b1-day11-submission-page" style={{ border: "1px solid #bfdbfe", borderRadius: 14, padding: 8, background: "#fff" }}>
            <style>{`.b1-day11-submission-page > div > section:first-child { display: none !important; }
            .b1-day11-submission-page select { display: none !important; }`}</style>
            <AssignmentSubmissionPage
              submissionContext={{
                level: "B1",
                day: 11,
                assignmentKey: "B1-4.11",
                canonicalAssignmentKey: "B1-4.11",
              }}
            />
          </div>
        </section>
      )}
    </div>
  );
}

export default function B1Day11TeamspieleWorkbookPage() {
  return (
    <RadioFirstWorkbookGate level="B1" day={11}>
      <B1Day11TeamspieleWorkbookContent />
    </RadioFirstWorkbookGate>
  );
}
