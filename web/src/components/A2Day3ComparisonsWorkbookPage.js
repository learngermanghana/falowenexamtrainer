import React from "react";
import A2StandardTabbedWorkbookPage from "./A2StandardTabbedWorkbookPage";

export default function A2Day3ComparisonsWorkbookPage() {
  return (
    <A2StandardTabbedWorkbookPage
      day={3}
      title="Dinge und Personen vergleichen"
      chapter="1.3"
      workbookId="A2Day3DingeUndPersonenVergleichen"
      topicPrompt="Vergleiche zwei Personen, Dinge oder Orte mit Komparativ und Superlativ."
      schreibenTask={`Schreibe einen Brief an deinen Freund Felix. Beschreibe und vergleiche deine Mutter und deinen Vater.

Bearbeite diese drei Punkte:
1. Erkläre, warum du Felix schreibst, und stelle deine Mutter und deinen Vater kurz vor.
2. Beschreibe ihr Aussehen und ihren Charakter. Vergleiche beide mit so ... wie und dem Komparativ, zum Beispiel größer als, ruhiger als oder genauso freundlich wie.
3. Sage, was an deiner Mutter oder deinem Vater am besten oder am wichtigsten ist. Frage Felix am Ende nach seinen Eltern.`}
      schreibenPlaceholder={"Lieber Felix,\n\nwie geht es dir? Ich schreibe dir, weil ...\n\nMeine Mutter ist ... Mein Vater ist ...\n\nMeine Mutter ist ... als mein Vater, aber mein Vater ist genauso ... wie ...\n\nAm ... ist ...\n\nWie sind deine Eltern?\n\nViele Grüße\n[Dein Name]"}
      lesenText="Mein altes Handy ist kleiner als mein neues Handy. Das neue Handy ist schneller und moderner. Aber das alte Handy war billiger. Für Fotos ist das neue Handy am besten."
      lesenQuestions={[
        { stem: "Welches Handy ist kleiner?", options: ["a) Das alte Handy", "b) Das neue Handy", "c) Beide sind gleich", "d) Kein Handy"] },
        { stem: "Wie ist das neue Handy?", options: ["a) Schneller und moderner", "b) Langsamer", "c) Kaputt", "d) Sehr alt"] },
        { stem: "Wofür ist das neue Handy am besten?", options: ["a) Für Fotos", "b) Für Möbel", "c) Für Medikamente", "d) Für Urlaub allein"] },
      ]}
      hoerenTask="Höre einen Vergleich. Notiere, was größer, kleiner, schneller, billiger, besser oder am besten ist."
      hoerenQuestions={[
        { stem: "Welche Struktur passt zum Vergleichen?", options: ["a) größer als", "b) gestern", "c) im Park", "d) Guten Appetit"] },
        { stem: "Was bedeutet 'so groß wie'?", options: ["a) gleich groß", "b) größer", "c) kleiner", "d) am größten"] },
        { stem: "Welche Form ist Superlativ?", options: ["a) am besten", "b) besser", "c) gut", "d) wie"] },
      ]}
    />
  );
}
