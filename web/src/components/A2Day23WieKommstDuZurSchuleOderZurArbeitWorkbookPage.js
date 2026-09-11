import React from "react";
import A2StandardTabbedWorkbookPage from "./A2StandardTabbedWorkbookPage";

const lesenText = `Mein Arbeitsweg

Jonas wohnt am Stadtrand und arbeitet im Zentrum. Jeden Morgen geht er zuerst fünf Minuten zu Fuß zur Bushaltestelle. Dann fährt er mit dem Bus bis zum Hauptbahnhof. Dort steigt er in die U-Bahn um. Insgesamt braucht er ungefähr 40 Minuten bis zur Arbeit.

Früher fuhr Jonas oft mit dem Auto. Das war zwar bequem, aber morgens gab es viel Stau und die Parkplätze im Zentrum waren teuer. Jetzt benutzt er lieber öffentliche Verkehrsmittel. Wenn das Wetter gut ist und er später anfangen kann, fährt er manchmal mit dem Fahrrad zur Arbeit. Dafür braucht er ungefähr 50 Minuten, aber er findet die Bewegung angenehm.`;

const lesenQuestions = [
  {
    stem: "Wo wohnt Jonas?",
    options: ["A) Im Stadtzentrum", "B) Am Stadtrand", "C) Neben seinem Büro", "D) Am Hauptbahnhof"],
  },
  {
    stem: "Wie kommt Jonas zuerst zur Bushaltestelle?",
    options: ["A) Zu Fuß", "B) Mit dem Auto", "C) Mit der U-Bahn", "D) Mit dem Fahrrad"],
  },
  {
    stem: "Wo steigt Jonas in die U-Bahn um?",
    options: ["A) Vor seinem Haus", "B) Im Büro", "C) Am Hauptbahnhof", "D) Am Stadtrand"],
  },
  {
    stem: "Warum fährt Jonas nicht mehr so oft mit dem Auto?",
    options: ["A) Er hat keinen Führerschein.", "B) Es gibt viel Stau und Parken ist teuer.", "C) Sein Auto ist zu klein.", "D) Die Arbeit verbietet Autos."],
  },
  {
    stem: "Wann fährt Jonas manchmal mit dem Fahrrad?",
    options: ["A) Wenn das Wetter gut ist und er später anfangen kann.", "B) Nur im Winter.", "C) Wenn der Bus schneller ist.", "D) Jeden Morgen."],
  },
];

export default function A2Day23WieKommstDuZurSchuleOderZurArbeitWorkbookPage() {
  return (
    <A2StandardTabbedWorkbookPage
      day={23}
      title="Wie kommst du zur Schule / zur Arbeit?"
      chapter="9.23"
      workbookId="A2Day23WieKommstDuZurSchuleOderZurArbeit"
      topicPrompt="Beschreibe deinen Weg zur Schule oder zur Arbeit. Sage, welche Verkehrsmittel du benutzt, wie lange der Weg dauert und warum du diese Möglichkeit wählst."
      schreibenTask="Schreiben Sie einem Freund oder einer Freundin über Ihren Weg zur Schule oder zur Arbeit. Beschreiben Sie Ihre Verkehrsmittel, die Dauer des Weges und einen Vor- oder Nachteil. Fragen Sie auch, wie die andere Person zur Schule oder zur Arbeit kommt."
      schreibenPlaceholder="Liebe/r ...,\n\nich möchte dir von meinem Arbeitsweg erzählen. Normalerweise ..."
      lesenText={lesenText}
      lesenQuestions={lesenQuestions}
      hoerenTask="Hören Sie Falowen Radio noch einmal und achten Sie auf Verkehrsmittel, Wege, Dauer und Gründe für die Wahl des Verkehrsmittels."
      hoerenAudioUrl="https://youtu.be/LtARwiCljLY"
      hoerenQuestions={[]}
      showWorkbookGuidance={false}
    />
  );
}
