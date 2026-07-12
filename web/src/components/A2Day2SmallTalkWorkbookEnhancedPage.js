import React from "react";
import A2StandardTabbedWorkbookPage from "./A2StandardTabbedWorkbookPage";
import { WorkbookTaskCard } from "./StandardWorkbookComponents";

const paragraph = {
  margin: 0,
  lineHeight: 1.7,
};

const list = {
  margin: 0,
  paddingLeft: 22,
  lineHeight: 1.75,
};

const topicGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
  gap: 12,
};

const topicCard = {
  border: "1px solid #bfdbfe",
  borderRadius: 12,
  padding: 14,
  background: "#f8fbff",
  display: "grid",
  gap: 8,
};

const topicTitle = {
  margin: 0,
  color: "#1e3a8a",
  fontSize: "1rem",
};

const chipRow = {
  display: "flex",
  flexWrap: "wrap",
  gap: 8,
};

const chip = {
  border: "1px solid #93c5fd",
  borderRadius: 999,
  padding: "7px 11px",
  background: "#eff6ff",
  color: "#1e3a8a",
  fontWeight: 800,
};

const smallTalkTopics = [
  {
    title: "Begrüßung und Einstieg",
    items: [
      "Hallo, wie geht es dir? (Hello, how are you?)",
      "Woher kommst du? (Where are you from?)",
      "Schön, dich kennenzulernen. (Nice to meet you.)",
    ],
  },
  {
    title: "Arbeit",
    items: [
      "Wo arbeitest du? (Where do you work?)",
      "Ich arbeite in einem Büro. (I work in an office.)",
      "Was machst du beruflich? (What do you do for a living?)",
      "Ich bin Lehrer. (I’m a teacher.)",
    ],
  },
  {
    title: "Sport und Hobbys",
    items: [
      "Machst du gerne Sport? (Do you like sports?)",
      "Ja, ich spiele gern Fußball. (Yes, I like playing soccer.)",
      "Hast du ein Hobby? (Do you have a hobby?)",
      "Ich lese gern Bücher. (I like reading books.)",
    ],
  },
  {
    title: "Familie",
    items: [
      "Hast du Geschwister? (Do you have siblings?)",
      "Ja, ich habe eine Schwester. (Yes, I have a sister.)",
      "Wie heißt dein Bruder? (What’s your brother’s name?)",
      "Er heißt Max. (His name is Max.)",
    ],
  },
  {
    title: "Wetter",
    items: [
      "Wie ist das Wetter heute? (What’s the weather like today?)",
      "Es ist sonnig und warm. (It’s sunny and warm.)",
      "Magst du den Sommer? (Do you like summer?)",
      "Ja, ich liebe den Sommer. (Yes, I love summer.)",
    ],
  },
  {
    title: "Reisen",
    items: [
      "Warst du schon mal im Ausland? (Have you ever been abroad?)",
      "Ja, ich war in Italien. (Yes, I’ve been to Italy.)",
      "Wohin möchtest du reisen? (Where would you like to travel?)",
      "Ich möchte nach Spanien reisen. (I’d like to travel to Spain.)",
    ],
  },
];

const politeExpressions = [
  "Könntest du das bitte wiederholen? (Could you repeat that, please?)",
  "Das klingt interessant! (That sounds interesting!)",
  "Entschuldigung, ich habe dich nicht verstanden. (Sorry, I didn’t understand you.)",
];

const endingExpressions = [
  "Es war schön, mit dir zu sprechen. (It was nice talking to you.)",
  "Ich wünsche dir einen schönen Tag! (I wish you a nice day!)",
  "Bis bald! (See you soon!)",
];

const readingQuestions = [
  {
    stem: "Wo arbeitet Lisa?",
    options: ["A. In einem Büro", "B. In einem Café", "C. In einer Schule", "D. In einem Krankenhaus"],
  },
  {
    stem: "Warum liebt Lisa ihren Beruf?",
    options: [
      "A. Weil sie gerne reist",
      "B. Weil sie gerne mit Kindern arbeitet",
      "C. Weil sie Tennis mag",
      "D. Weil sie gerne im Büro arbeitet",
    ],
  },
  {
    stem: "Wo arbeitet die erzählende Person?",
    options: ["A. In einem Büro", "B. In einer Schule", "C. In einem Café", "D. In einem Krankenhaus"],
  },
  {
    stem: "Welchen Sport mag Lisa?",
    options: ["A. Fußball", "B. Tennis", "C. Schwimmen", "D. Volleyball"],
  },
  {
    stem: "Wie war das Wetter gestern?",
    options: ["A. Es war regnerisch", "B. Es war sonnig und warm", "C. Es war kalt", "D. Es war windig"],
  },
  {
    stem: "In welchen Ländern war Lisa schon?",
    options: [
      "A. Frankreich und Deutschland",
      "B. Italien und Spanien",
      "C. Österreich und Schweiz",
      "D. Griechenland und Kroatien",
    ],
  },
  {
    stem: "Warum mag die erzählende Person den Herbst?",
    options: [
      "A. Weil es sonnig ist",
      "B. Weil es warm ist",
      "C. Weil die Bäume so schön bunt sind",
      "D. Weil sie gerne Tennis spielt",
    ],
  },
];

const speakingContent = (
  <>
    <WorkbookTaskCard eyebrow="Group practice" title="Zentrales Thema: Small Talk" practiceOnly>
      <p style={paragraph}>
        In this chapter, we’ll engage in group exercises discussing these topics. Following this, your tutor will revise the questions and invite you to write a brief essay about yourself.
      </p>
    </WorkbookTaskCard>

    <div style={topicGrid}>
      {smallTalkTopics.map((topic) => (
        <section key={topic.title} style={topicCard}>
          <h3 style={topicTitle}>{topic.title}</h3>
          <ul style={list}>
            {topic.items.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </section>
      ))}
    </div>

    <div style={topicGrid}>
      <section style={topicCard}>
        <h3 style={topicTitle}>Höfliche Ausdrücke</h3>
        <ul style={list}>
          {politeExpressions.map((item) => <li key={item}>{item}</li>)}
        </ul>
      </section>
      <section style={topicCard}>
        <h3 style={topicTitle}>Gespräch beenden</h3>
        <ul style={list}>
          {endingExpressions.map((item) => <li key={item}>{item}</li>)}
        </ul>
      </section>
    </div>

    <WorkbookTaskCard eyebrow="Sprachliche Hilfen" title="So kannst du deinen Beitrag strukturieren" practiceOnly>
      <div style={topicGrid}>
        <section style={topicCard}>
          <h3 style={topicTitle}>Einleitung</h3>
          <p style={paragraph}>„Small Talk ist eine gute Möglichkeit, um neue Leute kennenzulernen.“</p>
          <p style={paragraph}>„Ich finde, dass Small Talk wichtig im Alltag ist.“</p>
        </section>
        <section style={topicCard}>
          <h3 style={topicTitle}>Hauptteil</h3>
          <p style={paragraph}>„Ein gutes Thema für Small Talk ist die Arbeit, weil ...“</p>
          <p style={paragraph}>„Man kann auch über das Wetter oder Hobbys sprechen, zum Beispiel ...“</p>
          <p style={paragraph}>„Ein Vorteil von Small Talk ist, dass ...“</p>
        </section>
        <section style={topicCard}>
          <h3 style={topicTitle}>Schluss</h3>
          <p style={paragraph}>„Zusammenfassend kann man sagen, dass Small Talk einfach und nützlich ist.“</p>
        </section>
      </div>
    </WorkbookTaskCard>

    <WorkbookTaskCard eyebrow="Deine Vorstellung" title="Kannst du dich vorstellen? Erzähl uns etwas über dich!" practiceOnly>
      <div style={chipRow}>
        {["Familie", "Sprachen", "Beruf/Studium", "Hobbys"].map((item) => (
          <span key={item} style={chip}>{item}</span>
        ))}
      </div>
    </WorkbookTaskCard>
  </>
);

const writingContent = (
  <WorkbookTaskCard eyebrow="Schreibaufgabe" title="Schreibe einen Brief an deinen Freund Felix">
    <p style={paragraph}>In deinem Brief möchtest du über deine Arbeit und Familie sprechen.</p>

    <section style={topicCard}>
      <h3 style={topicTitle}>Dein Brief soll folgende Punkte enthalten:</h3>
      <ol style={list}>
        <li>Warum schreibst du?</li>
        <li>Erzähle Felix etwas über deine Arbeit und deine Familie.</li>
        <li>Frage Felix, wie es ihm geht und was bei ihm neu ist.</li>
      </ol>
    </section>

    <section style={topicCard}>
      <h3 style={topicTitle}>Einleitung</h3>
      <ul style={list}>
        <li>Beginne mit: „Lieber Felix,“</li>
        <li>Schreibe dann: „Wie geht es dir? Ich hoffe, es geht dir gut.“</li>
      </ul>
    </section>

    <section style={topicCard}>
      <h3 style={topicTitle}>Hauptteil</h3>
      <ul style={list}>
        <li>Schreibe, warum du Felix schreibst, zum Beispiel: „Ich schreibe dir, weil ich dir von meiner Arbeit und Familie erzählen möchte.“</li>
        <li>Erzähle über deine Arbeit: Was machst du? Ist deine Arbeit interessant?</li>
        <li>Erzähle etwas Neues über deine Familie.</li>
        <li>Verwende Konjunktionen wie <strong>weil</strong>, <strong>denn</strong> und <strong>deshalb</strong>.</li>
      </ul>
    </section>

    <section style={topicCard}>
      <h3 style={topicTitle}>Schluss</h3>
      <ul style={list}>
        <li>Frage Felix, was bei ihm neu ist, zum Beispiel: „Wie geht es dir? Was hast du zuletzt gemacht?“</li>
        <li>Schreibe: „Ich freue mich auf deine Antwort.“</li>
        <li>Verabschiede dich mit: „Viele Grüße, Dein Vorname“</li>
      </ul>
    </section>
  </WorkbookTaskCard>
);

const readingText = `Mein Gespräch mit Lisa

Gestern habe ich Lisa im Café getroffen. Sie arbeitet in einer Schule und unterrichtet Kinder. Wir haben über unsere Arbeit gesprochen. Lisa sagt, dass sie ihren Beruf liebt, weil sie gerne mit Kindern arbeitet. Ich habe ihr erzählt, dass ich in einem Büro arbeite.

Dann haben wir über Sport gesprochen. Lisa spielt gern Tennis, aber ich mag Fußball mehr. Wir haben auch über das Wetter geredet. Es war gestern sonnig und warm, und Lisa liebt den Sommer. Ich habe ihr erzählt, dass ich lieber den Herbst mag, weil die Bäume so schön bunt sind.

Zum Schluss haben wir über Reisen gesprochen. Lisa war schon in Italien und Spanien. Sie möchte nächstes Jahr nach Frankreich reisen. Ich war noch nie in Spanien, aber ich würde gerne dorthin reisen.

Es war ein sehr nettes Gespräch, und wir haben viel gelacht!`;

export default function A2Day2SmallTalkWorkbookEnhancedPage() {
  return (
    <A2StandardTabbedWorkbookPage
      day={1}
      title="Small Talk"
      chapter="1.1"
      workbookId="A2Day1SmallTalk"
      topicPrompt="Small Talk"
      sprechenContent={speakingContent}
      schreibenContent={writingContent}
      schreibenPlaceholder={"Lieber Felix,\n\nwie geht es dir? Ich hoffe, es geht dir gut.\n\nIch schreibe dir, weil ..."}
      lesenText={readingText}
      lesenQuestions={readingQuestions}
      hoerenTask="Höre den Text „Mein Gespräch mit Lisa“. Beantworte danach dieselben sieben Verständnisfragen."
      hoerenAudioUrl="https://drive.google.com/file/d/1UXO1nHeBxOt8TS8dpp68xXr4Txjzu-NZ/view?usp=sharing"
      hoerenQuestions={readingQuestions}
    />
  );
}
