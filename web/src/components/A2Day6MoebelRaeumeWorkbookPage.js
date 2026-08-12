import React from "react";
import A2StandardTabbedWorkbookPage from "./A2StandardTabbedWorkbookPage";
import SpeakingMindMap from "./SpeakingMindMap";
import { WorkbookTaskCard } from "./StandardWorkbookComponents";
import { getA2Days2To6SpeakingConfig } from "./A2Days2To6ThinkingSupport";

const paragraph = { margin: 0, lineHeight: 1.7 };
const list = { margin: 0, paddingLeft: 22, lineHeight: 1.75 };

const speakingContent = <>
  <SpeakingMindMap config={getA2Days2To6SpeakingConfig(6)} />
  <WorkbookTaskCard eyebrow="Now speak · Jetzt sprechen" title="Beschreibe einen Raum so, dass man ihn sich vorstellen kann" practiceOnly>
    <p style={paragraph}>Create a picture in your head first. Then turn the picture into connected German sentences.</p>
    <ol style={list}>
      <li>Name the room and say how it is: groß, klein, hell, gemütlich.</li>
      <li>Name 3–5 pieces of furniture.</li>
      <li>Say where important objects are with <strong>Wo? + Dativ</strong>.</li>
      <li>If you change something, say where you move it with <strong>Wohin? + Akkusativ</strong>.</li>
      <li>Finish with your favourite place and one reason.</li>
    </ol>
    <p style={paragraph}><strong>Thinking route:</strong> Raum → Möbel → Wo? → Veränderung/Wohin? → Lieblingsplatz + weil.</p>
  </WorkbookTaskCard>
</>;

const schreibenContent = (
  <WorkbookTaskCard eyebrow="Teil 2 · Schreiben" title="Nachricht an einen Freund: Meine Wohnung / mein Zimmer">
    <p style={paragraph}><strong>Aufgabe:</strong> Schreibe einer Freundin oder einem Freund eine kurze Nachricht über deine Wohnung und dein Zimmer.</p>
    <p style={paragraph}>Bearbeite diese Punkte:</p>
    <ul style={list}>
      <li>Beschreibe mindestens zwei Räume in deiner Wohnung.</li>
      <li>Nenne mindestens fünf Möbel.</li>
      <li>Sage, wo die Möbel stehen oder liegen: <strong>Wo? + Dativ</strong>.</li>
      <li>Beschreibe zwei Veränderungen: Wohin stellst oder legst du etwas? <strong>Wohin? + Akkusativ</strong>.</li>
      <li>Sage, welcher Platz dir am besten gefällt und warum.</li>
    </ul>
    <p style={paragraph}><strong>Useful structure:</strong> Hallo/Liebe(r) ..., → Wohnung/Räume → Möbel + Position → Veränderungen → Lieblingsplatz → Viele Grüße.</p>
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
      schreibenTask="Schreibe einer Freundin oder einem Freund eine kurze Nachricht über deine Wohnung und dein Zimmer."
      schreibenContent={schreibenContent}
      schreibenPlaceholder={"Hallo ... ,\n\nich möchte dir meine Wohnung beschreiben. Sie hat ...\n\nIn meinem ... gibt es ... Der/Die/Das ... steht/liegt ...\n\nIch möchte ... neben/auf/in ... stellen/legen.\n\nAm liebsten mag ich ..., weil ...\n\nViele Grüße\n[Dein Name]"}
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
