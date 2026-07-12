import React from "react";
import A2StandardTabbedWorkbookPage from "./A2StandardTabbedWorkbookPage";
import { WorkbookTaskCard } from "./StandardWorkbookComponents";

const paragraph = {
  margin: 0,
  lineHeight: 1.75,
};

const list = {
  margin: 0,
  paddingLeft: 22,
  lineHeight: 1.75,
};

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
  gap: 12,
};

const practiceCard = {
  border: "1px solid #bfdbfe",
  borderRadius: 12,
  padding: 14,
  background: "#f8fbff",
  display: "grid",
  gap: 8,
};

const heading = {
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

const speakingContent = (
  <>
    <WorkbookTaskCard eyebrow="Group practice" title="Wo möchten wir uns treffen?" practiceOnly>
      <p style={paragraph}>
        In this chapter, we’ll engage in group exercises discussing these topics. Following this, your tutor will revise the questions and invite you to record an audio about yourself.
      </p>
    </WorkbookTaskCard>

    <WorkbookTaskCard eyebrow="Zentrales Thema" title="Wo möchten wir uns treffen?" practiceOnly>
      <div style={chipRow}>
        {["Ort", "Aktivitäten", "Wetter und Jahreszeit", "Anreise", "Mit einer Gruppe oder allein"].map((item) => (
          <span key={item} style={chip}>{item}</span>
        ))}
      </div>
    </WorkbookTaskCard>

    <div style={grid}>
      <section style={practiceCard}>
        <h3 style={heading}>1. Ort</h3>
        <ul style={list}>
          <li>Café</li>
          <li>Restaurant</li>
          <li>Park</li>
          <li>Kino</li>
          <li>Einkaufszentrum</li>
          <li>Zuhause</li>
          <li>Museum</li>
          <li>Sportplatz</li>
        </ul>
      </section>

      <section style={practiceCard}>
        <h3 style={heading}>2. Aktivitäten</h3>
        <ul style={list}>
          <li>Kaffee trinken</li>
          <li>Einen Spaziergang machen</li>
          <li>Einen Film schauen</li>
          <li>Essen gehen</li>
          <li>Sport treiben</li>
          <li>Spiele spielen</li>
        </ul>
      </section>

      <section style={practiceCard}>
        <h3 style={heading}>3. Wetter und Jahreszeit</h3>
        <ul style={list}>
          <li>Im Sommer</li>
          <li>Im Winter</li>
          <li>Bei sonnigem Wetter</li>
          <li>Bei Regen</li>
          <li>Im Frühling oder Herbst</li>
        </ul>
      </section>

      <section style={practiceCard}>
        <h3 style={heading}>4. Anreise</h3>
        <ul style={list}>
          <li>Zu Fuß</li>
          <li>Mit dem Fahrrad</li>
          <li>Mit dem Auto</li>
          <li>Mit öffentlichen Verkehrsmitteln</li>
          <li>Mit dem Taxi</li>
        </ul>
      </section>

      <section style={practiceCard}>
        <h3 style={heading}>5. Mit einer Gruppe oder allein</h3>
        <ul style={list}>
          <li>Mit Freunden</li>
          <li>Mit der Familie</li>
          <li>Nur zu zweit</li>
          <li>Allein</li>
        </ul>
      </section>
    </div>

    <WorkbookTaskCard eyebrow="Deine Audioantwort" title="Wo und wie verbringst du am liebsten Zeit mit deinen Freunden?" practiceOnly>
      <div style={chipRow}>
        {["Treffpunkt", "Freizeit", "Freundschaft", "Aktivitäten"].map((item) => (
          <span key={item} style={chip}>{item}</span>
        ))}
      </div>
      <p style={paragraph}>
        Sprich über den Treffpunkt, eure Aktivitäten, das Wetter oder die Jahreszeit, die Anreise und darüber, mit wem du deine Freizeit verbringst.
      </p>
    </WorkbookTaskCard>
  </>
);

const readingText = `Pläne für die Freizeit

Für das Wochenende und die Ferien mache ich gern Pläne. An den freien Samstagen und Sonntagen werde ich lange schlafen. Dann klingelt der Wecker nicht. Aber ich werde für die Wochenenden nicht zu viel planen, weil ich gern faul bin und nichts tue. Aber ich werde vielleicht zum Sport gehen. Manchmal habe ich am Wochenende ein Turnier. Diesen Sonntag zum Beispiel werde ich mit meinem Team in eine andere Stadt fahren. Wir werden dort ein Match gegen einen anderen Hockeyverein spielen. Das wird bestimmt ein Spaß.

Wenn das Wetter schön ist, werde ich anschließend mit meinen Freunden schwimmen gehen. In der Nähe gibt es einen See, der wird schon warm genug sein.

Wenn ich länger frei habe, mache ich gerne größere Pläne. In den Sommerferien werde ich sehr oft mit meinen Freunden unterwegs sein. Wir werden zum See fahren. Dort werden wir im Zelt übernachten und beim Lagerfeuer sitzen. Eine oder zwei Wochen möchte ich gerne reisen. Ein Freund wird mich auf der Reise begleiten, wir werden mit dem Zug losfahren. Wir planen eine Route durch das ganze Land, von West bis Ost und von Süd bis Nord. Mit Rucksäcken und Wanderschuhen werden wir auch in die Berge fahren. Am liebsten würde ich dort in einer Hütte übernachten. Wir werden sehen, ob wir das auch schaffen werden. Ein Abenteuer wird es aber ganz bestimmt.`;

const readingQuestions = [
  {
    stem: "Was macht der Erzähler am liebsten am Wochenende?",
    options: ["a) In die Berge fahren", "b) Faul sein", "c) Viel essen", "d) Lernen"],
  },
  {
    stem: "Welchen Sport macht er manchmal am Wochenende?",
    options: ["a) Tennis spielen", "b) Laufen", "c) Wandern", "d) Hockey spielen"],
  },
  {
    stem: "Was macht er gern mit Freunden am Wochenende?",
    options: ["a) Schwimmen gehen", "b) Faul sein", "c) Shoppen", "d) Wandern"],
  },
  {
    stem: "Was plant der Erzähler mit den Freunden im Sommer?",
    options: [
      "a) Eine Radtour",
      "b) In einen Vergnügungspark fahren",
      "c) Schach spielen",
      "d) Zum See fahren und dort im Zelt übernachten",
    ],
  },
  {
    stem: "Welche größeren Pläne hat er in den Sommerferien?",
    options: [
      "a) Einen Urlaub am Meer",
      "b) Eine Route mit dem Zug durch das ganze Land",
      "c) Eine Reise in die nächste Stadt",
      "d) Campen mit dem Zelt in den Bergen",
    ],
  },
];

const listeningQuestions = [
  {
    stem: "Wann treffen sich Anna, Ben und Claudia am Samstag?",
    options: ["a) Um 9 Uhr", "b) Um 10 Uhr", "c) Um 11 Uhr"],
  },
  {
    stem: "Was bringt Claudia zum Ausflug mit?",
    options: ["a) Ein Zelt", "b) Einen Rucksack mit Snacks und Getränken", "c) Einen Reiseführer"],
  },
  {
    stem: "Was möchten Ben und Anna im Wald machen?",
    options: ["a) Einen Film schauen", "b) Ein Picknick machen", "c) Eine Wanderung machen"],
  },
  {
    stem: "Was planen sie am Samstagabend?",
    options: [
      "a) Ein Konzert zu besuchen",
      "b) Ein Picknick im Park",
      "c) In einem Restaurant essen und einen Film schauen",
    ],
  },
  {
    stem: "Was wollen sie am Sonntag im Park machen?",
    options: ["a) Spielen und spazieren gehen", "b) Fußball spielen", "c) Fotos machen"],
  },
];

export default function A2Day4WoMoechtenWirUnsTreffenWorkbookPage() {
  return (
    <A2StandardTabbedWorkbookPage
      day={4}
      title="Wo möchten wir uns treffen?"
      chapter="2.4"
      workbookId="A2Day4WoMoechtenWirUnsTreffen"
      topicPrompt="Wo und wie verbringst du am liebsten Zeit mit deinen Freunden?"
      sprechenContent={speakingContent}
      schreibenTask={`Schreiben Sie einen Brief an Herrn Felix Asadu und laden Sie ihn zu einem gemeinsamen Wochenende ein.

Bearbeiten Sie diese drei Punkte:
1. Erklären Sie, warum Sie ihn einladen, zum Beispiel für ein Treffen oder eine besondere Veranstaltung.
2. Fragen Sie, wann er Zeit hat und wo das Treffen stattfinden soll.
3. Fragen Sie, ob er etwas Bestimmtes für ein gemeinsames Abendessen oder eine Aktivität mitbringen kann.`}
      schreibenPlaceholder={"Sehr geehrter Herr Asadu,\n\nich schreibe Ihnen, weil ...\n\nHaben Sie am ... Zeit? Wir könnten uns ... treffen.\n\nKönnten Sie bitte ... mitbringen?\n\nIch freue mich auf Ihre Antwort.\n\nMit freundlichen Grüßen\n[Ihr Name]"}
      lesenText={readingText}
      lesenQuestions={readingQuestions}
      hoerenTask="Hören: Ein Wochenende mit Freunden planen. Sieh dir das eingebettete Video an und beantworte danach die fünf Fragen."
      hoerenAudioUrl="https://youtu.be/tHAo8hxjKmw"
      hoerenQuestions={listeningQuestions}
    />
  );
}
