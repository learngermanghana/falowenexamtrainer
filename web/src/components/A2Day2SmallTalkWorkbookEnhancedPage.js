import React from "react";
import A2StandardTabbedWorkbookPage from "./A2StandardTabbedWorkbookPage";
import RadioFirstWorkbookGate from "./RadioFirstWorkbookGate";
import SpeakingMindMap from "./SpeakingMindMap";
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

const smallTalkIntroductionMap = {
  level: "A2",
  day: 1,
  lessonId: "a2-day-1-small-talk-introduction",
  title: "Deine Vorstellung",
  centralQuestion: "Kannst du dich vorstellen? Erzähl uns etwas über dich!",
  targetDurationSeconds: 60,
  branches: [
    {
      id: "familie",
      label: "Familie",
      type: "topic",
      keywords: ["Eltern", "Geschwister", "Kinder", "wohnen", "Familie"],
      guidingQuestion: "Who is in your family? Wer gehört zu deiner Familie?",
      sentenceStarter: "Ich habe ... / Meine Familie ...",
      modelSentence: "Ich habe zwei Brüder und eine Schwester. Meine Familie wohnt in Accra.",
    },
    {
      id: "sprachen",
      label: "Sprachen",
      type: "detail",
      keywords: ["Deutsch", "Englisch", "Twi", "sprechen", "lernen"],
      guidingQuestion: "Which languages do you speak or learn? Welche Sprachen sprichst oder lernst du?",
      sentenceStarter: "Ich spreche ... / Ich lerne ...",
      modelSentence: "Ich spreche Englisch und Twi. Außerdem lerne ich Deutsch.",
    },
    {
      id: "beruf-studium",
      label: "Beruf / Studium",
      type: "example",
      keywords: ["arbeiten", "studieren", "Beruf", "Universität", "Firma"],
      guidingQuestion: "What do you do and where? Was machst du und wo?",
      sentenceStarter: "Ich arbeite als ... / Ich studiere ...",
      modelSentence: "Ich arbeite als Verkäufer und arbeite in Accra. / Ich studiere Informatik an der Universität.",
    },
    {
      id: "hobbys",
      label: "Hobbys",
      type: "closing",
      keywords: ["Fußball", "Musik", "lesen", "Freunde", "Wochenende", "gern"],
      guidingQuestion: "What do you enjoy doing in your free time? Was machst du gern in deiner Freizeit?",
      sentenceStarter: "In meiner Freizeit ... / Ich ... gern, weil ...",
      modelSentence: "In meiner Freizeit spiele ich gern Fußball, weil es Spaß macht.",
    },
  ],
  speakingRoute: ["familie", "sprachen", "beruf-studium", "hobbys"],
  extraHelp: {
    title: "Build your answer step by step",
    instructions: [
      "Start with one keyword. Do not try to create a long answer immediately.",
      "Turn the keyword into one simple German sentence.",
      "Add one extra detail: where, when, who or how often.",
      "If possible, add a reason or example with weil, zum Beispiel or außerdem.",
      "Connect the four branches into one short introduction.",
    ],
    phraseGroups: [
      {
        title: "The thinking pattern",
        items: [
          "Keyword → simple sentence → extra detail → reason/example",
          "Fußball → Ich spiele gern Fußball. → Ich spiele am Wochenende Fußball. → Ich spiele am Wochenende Fußball, weil es Spaß macht.",
        ],
      },
      {
        title: "Useful connectors",
        items: [
          "und = and",
          "aber = but",
          "außerdem = in addition",
          "weil = because",
          "zum Beispiel = for example",
        ],
      },
    ],
    vocabulary: [
      "die Familie",
      "die Geschwister",
      "sprechen",
      "lernen",
      "arbeiten als",
      "studieren",
      "in meiner Freizeit",
      "gern",
      "am Wochenende",
      "weil",
      "außerdem",
    ],
    modelAnswer: "Ich heiße Ama und komme aus Ghana. Ich habe zwei Brüder und eine Schwester. Meine Familie wohnt in Accra. Ich spreche Englisch und Twi, und ich lerne Deutsch. Ich arbeite als Verkäuferin. In meiner Freizeit höre ich gern Musik und spiele am Wochenende Fußball, weil es Spaß macht.",
  },
};

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

const listeningQuestions = [
  {
    stem: "Was hat Lena am Samstag vor?",
    options: ["A. Spazieren mit Freundin", "B. Ins Kino gehen", "C. Tennis spielen", "D. Spaziergang im Park"],
  },
  {
    stem: "Warum freut sich Lena auf den Actionfilm?",
    options: ["A. Sie liebt spannende Geschichten", "B. Sie mag Comedy", "C. Sie hat ihn schon gesehen", "D. Sie liebt Horror"],
  },
  {
    stem: "Welche Sportart betreibt Lena regelmäßig?",
    options: ["A. Tennis", "B. Schwimmen", "C. Laufen", "D. Yoga"],
  },
  {
    stem: "Wie war das Wetter am letzten Wochenende?",
    options: ["A. Regnerisch und kühl", "B. Sonnig und warm", "C. Bewölkt und windig", "D. Kalt und frostig"],
  },
  {
    stem: "Was schlägt Lena für das nächste Treffen vor?",
    options: ["A. Ins Kino", "B. Tennis", "C. Spaziergang", "D. Kaffee trinken"],
  },
];

const speakingContent = (
  <>
    <WorkbookTaskCard eyebrow="Group practice" title="Small Talk: learn how to build your own answer" practiceOnly>
      <p style={paragraph}>
        Don’t memorize one long text. Start with a topic, choose useful words, build one simple sentence and then add a detail. The brain map below shows you how to think before you speak.
      </p>
    </WorkbookTaskCard>

    <SpeakingMindMap config={smallTalkIntroductionMap} />

    <WorkbookTaskCard eyebrow="Useful Small Talk" title="Questions and phrases you can use after your introduction" practiceOnly>
      <p style={paragraph}>
        After you introduce yourself, use these short questions and answers to continue the conversation. German comes first, with English support in brackets.
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
        <h3 style={topicTitle}>Höfliche Ausdrücke · Polite expressions</h3>
        <ul style={list}>
          {politeExpressions.map((item) => <li key={item}>{item}</li>)}
        </ul>
      </section>
      <section style={topicCard}>
        <h3 style={topicTitle}>Gespräch beenden · End the conversation</h3>
        <ul style={list}>
          {endingExpressions.map((item) => <li key={item}>{item}</li>)}
        </ul>
      </section>
    </div>
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

const SmallTalkWorkbook = () => (
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
    hoerenTask="Höre den Text zweimal und beantworte alle fünf Fragen. Achte auf Lenas Pläne, den Film, Sport, das Wetter und das nächste Treffen."
    hoerenAudioUrl="https://youtu.be/z5yj1HQZbQo"
    hoerenQuestions={listeningQuestions}
  />
);

export default function A2Day2SmallTalkWorkbookEnhancedPage() {
  return (
    <RadioFirstWorkbookGate level="A2" day={1}>
      <SmallTalkWorkbook />
    </RadioFirstWorkbookGate>
  );
}
