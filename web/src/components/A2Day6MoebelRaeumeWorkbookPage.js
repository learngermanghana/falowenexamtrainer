import React from "react";
import A2StandardTabbedWorkbookPage from "./A2StandardTabbedWorkbookPage";
import SpeakingMindMap from "./SpeakingMindMap";
import { WorkbookTaskCard } from "./StandardWorkbookComponents";
import { getA2Days2To6SpeakingConfig } from "./A2Days2To6ThinkingSupport";

const paragraph = { margin: 0, lineHeight: 1.7 };
const list = { margin: 0, paddingLeft: 22, lineHeight: 1.75 };

const speakingContent = <>
  <WorkbookTaskCard eyebrow="Group practice" title="Teil 1 · Sprechen" practiceOnly>
    <p style={paragraph}>
      Open each mind-map branch, practise the sentence, and connect the parts into one clear room description.
    </p>
  </WorkbookTaskCard>
  <SpeakingMindMap config={getA2Days2To6SpeakingConfig(6)} />
</>;

const schreibenContent = (
  <WorkbookTaskCard eyebrow="Teil 2 · Schreiben" title="E-Mail an eine Freundin / einen Freund: Mein Zimmer">
    <p style={paragraph}>
      <strong>Aufgabe:</strong> Sie sind vor Kurzem umgezogen und möchten einer Freundin oder einem Freund von Ihrem neuen Zimmer erzählen.
      Schreiben Sie eine E-Mail.
    </p>
    <p style={paragraph}>Schreiben Sie etwas zu allen drei Punkten:</p>
    <ul style={list}>
      <li><strong>Warum schreiben Sie?</strong></li>
      <li><strong>Beschreiben Sie Ihr Zimmer und die wichtigsten Möbel.</strong></li>
      <li><strong>Was gefällt Ihnen an Ihrem Zimmer besonders und warum?</strong></li>
    </ul>
    <p style={paragraph}>
      Vergessen Sie nicht die Anrede und den Gruß am Schluss. Schreiben Sie einen zusammenhängenden Text.
    </p>
  </WorkbookTaskCard>
);

const newInTownReadingText = `Neu in der Stadt

Ich bin vor einem Monat in diese Stadt gezogen, um zu studieren.
Ich wohne zusammen mit drei anderen Mädchen in einer Wohngemeinschaft. Unsere Wohnung ist nicht weit von der Universität entfernt, ich muss nur drei Stationen mit der U-Bahn fahren.
Wenn das Wetter schön ist, gehe ich manchmal zu Fuß. Die Professoren an der Universität sind sehr nett, manche sind aber auch streng. Die Vorlesungen, die schon früh beginnen, mag ich nicht so gerne. Ich schlafe lieber lange.
Mittags esse ich mit meinen Freundinnen in der Mensa. Das Essen ist nicht sehr gut, aber es kostet nicht viel.
In meiner Freizeit lese ich gerne, in meinem Zimmer stehen viele Bücher. Manchmal gehe ich in den Zoo und beobachte die Tiere. Früher hatte ich zwei Katzen, aber in der WG sind keine Haustiere erlaubt.
Wenn ich das Studium abgeschlossen habe, möchte ich als Tierärztin im Zoo arbeiten.`;

export default function A2Day6MoebelRaeumeWorkbookPage() {
  return (
    <A2StandardTabbedWorkbookPage
      day={6}
      title="Möbel und Räume kennenlernen"
      chapter="3.6"
      workbookId="A2Day6MoebelRaeume"
      topicPrompt="Beschreibe deine Wohnung, die Zimmer und wichtige Möbel."
      sprechenContent={speakingContent}
      schreibenTask="Sie sind vor Kurzem umgezogen. Schreiben Sie einer Freundin oder einem Freund eine E-Mail über Ihr neues Zimmer und bearbeiten Sie alle drei Punkte."
      schreibenContent={schreibenContent}
      schreibenPlaceholder={"Hallo ... ,\n\nich schreibe dir, weil ...\n\nMein neues Zimmer ...\n\nBesonders gefällt mir ..., weil ...\n\nViele Grüße\n[Dein Name]"}
      lesenText={newInTownReadingText}
      lesenQuestions={[
        { stem: "Warum bin ich in die Stadt gezogen?", options: ["a) Weil ich in einer Wohngemeinschaft wohne", "b) Weil ich studiere", "c) Weil ich gerne lese", "d) Weil ich manchmal in den Zoo gehe"] },
        { stem: "Wann gehe ich zu Fuß zur Universität?", options: ["a) Wenn ich Hunger habe", "b) Wenn es nicht regnet, stürmt oder schneit", "c) Wenn die Vorlesungen früh beginnen", "d) Wenn die Professoren streng sind"] },
        { stem: "Wie ist das Essen in der Mensa?", options: ["a) Es ist gesund", "b) Es ist sehr gut", "c) Es ist vegetarisch", "d) Es ist billig"] },
        { stem: "Was ist in der WG verboten?", options: ["a) Schuhe", "b) Fahrräder", "c) Bücher", "d) Haustiere"] },
        { stem: "Wo möchte ich später arbeiten?", options: ["a) In der U-Bahn", "b) An der Universität", "c) Im Zoo", "d) In der Mensa"] },
      ]}
      hoerenTask="Sieh dir das eingebettete Video über die Wohnungsanzeigen an. Vergleiche die 2-Zimmer-Wohnung und die 3-Zimmer-Wohnung und submitte deine Antwortbuchstaben im Submit-Tab."
      hoerenAudioUrl="https://youtu.be/WuA8Xabn-Uw"
      hoerenQuestions={[
        { stem: "Welche Wohnung ist 70 Quadratmeter groß?", options: ["a) Die 2-Zimmer-Wohnung", "b) Die 3-Zimmer-Wohnung"] },
        { stem: "Welche Wohnung hat einen Balkon?", options: ["a) Die 2-Zimmer-Wohnung", "b) Die 3-Zimmer-Wohnung"] },
        { stem: "Wie hoch sind die Nebenkosten für die 3-Zimmer-Wohnung?", options: ["a) 150 Euro pro Monat", "b) 200 Euro pro Monat"] },
        { stem: "Welche Wohnung erlaubt Haustiere?", options: ["a) Die 2-Zimmer-Wohnung", "b) Die 3-Zimmer-Wohnung"] },
        { stem: "Welche Wohnung ist ab dem 1. August verfügbar?", options: ["a) Die 2-Zimmer-Wohnung", "b) Die 3-Zimmer-Wohnung"] },
      ]}
    />
  );
}
