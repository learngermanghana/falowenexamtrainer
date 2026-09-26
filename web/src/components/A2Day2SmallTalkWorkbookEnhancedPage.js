import React from "react";
import A2StandardTabbedWorkbookPage from "./A2StandardTabbedWorkbookPage";
import SpeakingMindMap from "./SpeakingMindMap";
import { WorkbookTaskCard } from "./StandardWorkbookComponents";

const paragraph = { margin: 0, lineHeight: 1.7 };
const list = { margin: 0, paddingLeft: 22, lineHeight: 1.75 };

const smallTalkIntroductionMap = {
  level: "A2",
  day: 1,
  lessonId: "a2-day-1-small-talk-1-1",
  title: "Small Talk 1.1",
  centralQuestion: "Kannst du ein kurzes Small-Talk-Gespräch beginnen, weiterführen und freundlich beenden?",
  targetDurationSeconds: 60,
  branches: [
    {
      id: "einstieg",
      label: "1. Einstieg",
      type: "topic",
      keywords: ["Hallo", "Guten Morgen", "wie geht's", "Wochenende", "Wetter"],
      guidingQuestion: "How can you open a short friendly conversation? Wie kannst du ein kurzes Gespräch beginnen?",
      sentenceStarter: "Hallo! Wie geht es dir? / Guten Morgen! Wie geht es Ihnen?",
      modelSentence: "Guten Morgen! Wie geht es Ihnen? War Ihr Wochenende schön?",
    },
    {
      id: "thema",
      label: "2. Thema finden",
      type: "detail",
      keywords: ["Arbeit", "Studium", "Hobby", "Wetter", "Reisen", "Wochenende"],
      guidingQuestion: "Which safe everyday topic can you use? Welches Alltagsthema passt?",
      sentenceStarter: "Wie ist ...? / Was machst du ...? / Arbeitest du ...?",
      modelSentence: "Was machst du gern am Wochenende? Ich spiele gern Fußball.",
    },
    {
      id: "reagieren",
      label: "3. Reagieren",
      type: "example",
      keywords: ["Ach wirklich?", "interessant", "schön", "spannend", "verstehe"],
      guidingQuestion: "How do you show that you are listening? Wie reagierst du natürlich?",
      sentenceStarter: "Ach wirklich? / Das klingt ... / Das ist ja ...",
      modelSentence: "Ach wirklich? Das klingt interessant!",
    },
    {
      id: "nachfragen",
      label: "4. Nachfragen",
      type: "detail",
      keywords: ["Und du?", "Und Sie?", "Warum", "Wo", "Wie oft", "seit wann"],
      guidingQuestion: "Which follow-up question keeps the conversation going? Welche Rückfrage passt?",
      sentenceStarter: "Und du? / Und Sie? / Warum ...? / Wie oft ...?",
      modelSentence: "Ich lerne seit einem Jahr Deutsch. Und du? Wie lange lernst du schon Deutsch?",
    },
    {
      id: "beenden",
      label: "5. Beenden",
      type: "closing",
      keywords: ["schön gesprochen", "schönen Tag", "bis bald", "bis später"],
      guidingQuestion: "How can you end politely? Wie beendest du das Gespräch freundlich?",
      sentenceStarter: "Es war schön, ... / Ich wünsche dir/Ihnen ... / Bis ...",
      modelSentence: "Es war schön, mit Ihnen zu sprechen. Ich wünsche Ihnen einen schönen Tag!",
    },
  ],
  speakingRoute: ["einstieg", "thema", "reagieren", "nachfragen", "beenden"],
  extraHelp: {
    title: "Was du aus Small Talk lernen sollst",
    instructions: [
      "Small Talk ist kein langer Vortrag. Ein guter Beitrag besteht oft nur aus 1–2 Sätzen und einer Rückfrage.",
      "Beginne freundlich, wähle ein einfaches Alltagsthema und reagiere auf die Antwort deines Gesprächspartners.",
      "Vermeide nur Ja/Nein-Antworten. Gib eine kleine Information und frage zurück.",
      "Benutze du bei Freunden und bekannten Personen; benutzen Sie in formellen oder unbekannten Situationen.",
      "Beende das Gespräch mit einer kurzen freundlichen Formel, statt plötzlich aufzuhören.",
    ],
    phraseGroups: [
      {
        title: "Gespräch beginnen",
        items: [
          "Hallo! Wie geht es dir?",
          "Guten Morgen! Wie geht es Ihnen?",
          "Wie war dein Wochenende?",
          "Schönes Wetter heute, oder?",
        ],
      },
      {
        title: "Natürlich reagieren",
        items: [
          "Ach wirklich?",
          "Das klingt interessant!",
          "Das ist ja schön!",
          "Oh, das verstehe ich.",
        ],
      },
      {
        title: "Nachfragen",
        items: [
          "Und du? / Und Sie?",
          "Was machst du beruflich? / Was machen Sie beruflich?",
          "Wie oft machst du das?",
          "Warum lernst du Deutsch?",
        ],
      },
      {
        title: "Gründe und Verbindungen",
        items: [
          "weil = because; verb at the end",
          "denn = because; normal word order",
          "deshalb = therefore; verb directly after deshalb",
          "außerdem = in addition",
        ],
      },
      {
        title: "Gespräch beenden",
        items: [
          "Es war schön, mit dir zu sprechen.",
          "Es war schön, mit Ihnen zu sprechen.",
          "Ich wünsche dir/Ihnen einen schönen Tag.",
          "Bis bald! / Bis später!",
        ],
      },
    ],
    vocabulary: [
      "der Small Talk",
      "das Wochenende",
      "die Freizeit",
      "beruflich",
      "interessant",
      "spannend",
      "sich unterhalten",
      "nachfragen",
      "reagieren",
      "weil",
      "denn",
      "deshalb",
      "außerdem",
    ],
    modelAnswer: "A: Guten Morgen! Wie geht es Ihnen? B: Danke, gut. Ich hatte ein ruhiges Wochenende. A: Ach wirklich? Das klingt schön. Was haben Sie gemacht? B: Ich war mit meiner Familie zu Hause, weil es geregnet hat. Und Sie? A: Ich habe Freunde besucht. Es war schön, mit Ihnen zu sprechen. Bis später!",
  },
};

const speakingContent = <>
  <WorkbookTaskCard eyebrow="Group practice" title="Teil 1 · Sprechen" practiceOnly>
    <p style={paragraph}>
      Open each mind-map branch, practise the useful phrases, and connect the five steps into one short natural conversation.
    </p>
  </WorkbookTaskCard>
  <SpeakingMindMap config={smallTalkIntroductionMap} />
</>;

const writingContent = <WorkbookTaskCard eyebrow="Teil 2 · Schreiben" title="Brief an Felix: Arbeit und Familie">
  <p style={paragraph}><strong>Aufgabe:</strong> Schreibe Felix einen kurzen Brief über deine Arbeit und deine Familie.</p>
  <p style={paragraph}>Bearbeite diese Punkte:</p>
  <ul style={list}>
    <li>Schreibe, warum du Felix schreibst.</li>
    <li>Erzähle etwas über deine Arbeit oder dein Studium.</li>
    <li>Erzähle etwas Neues über deine Familie.</li>
    <li>Verwende mindestens einen Grund mit <strong>weil</strong> oder <strong>denn</strong>.</li>
    <li>Frage Felix am Ende, wie es ihm geht und was bei ihm neu ist.</li>
  </ul>
  <p style={paragraph}><strong>Useful structure:</strong> Lieber Felix, → Grund → Arbeit/Studium → Familie → Frage → Viele Grüße.</p>
</WorkbookTaskCard>;




export default function A2Day1SmallTalkWorkbookPage() {
  return <A2StandardTabbedWorkbookPage
    day={1}
    title="Small Talk"
    chapter="1.1"
    workbookId="A2Day1SmallTalk"
    topicPrompt="Small Talk"
    sprechenContent={speakingContent}
    schreibenContent={writingContent}
    schreibenPlaceholder={"Lieber Felix,\n\nwie geht es dir? Ich hoffe, es geht dir gut.\n\nIch schreibe dir, weil ...\n\nIch arbeite / studiere ...\nMeine Familie ...\n\nWie geht es dir? Was ist bei dir neu?\n\nViele Grüße\n[Dein Name]"}
  />;
}
