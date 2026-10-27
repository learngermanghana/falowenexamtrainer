import React from "react";
import B1StandardWorkbookPage from "./B1StandardWorkbookPage";
import { getB1WritingTask } from "../data/b1WritingTasks";
import { getB1ReadingTask } from "../data/b1ReadingTasks";
import { getB1ListeningTask } from "../data/b1ListeningTasks";

const config = {
  day: 26,
  chapter: "9.26",
  assignmentKey: "B1-9.26",
  workbookId: "B1Day26ReiseproblemeUndLoesungen",
  title: "Reiseprobleme und Lösungen",
  heroImage: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1600&q=80",
  heroAlt: "Airport departures board and travel planning",
  speaking: {
    question: "Welche Reiseprobleme können passieren, und wie kann man sie lösen?",
    instructions: "Beschreibe typische Probleme auf Reisen, erkläre passende Lösungen und plane mit deiner Gruppe, wie ihr in einer schwierigen Situation reagieren würdet.",
    image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1600&q=80",
    imageAlt: "Airport scene representing travel problems",
    ideaTitle: "Brain Map: Reiseprobleme und Lösungen",
    ideaGroups: [
      { title: "Typische Reiseprobleme", items: ["Flug, Zug oder Bus hat Verspätung", "Gepäck geht verloren", "Kein Hotelzimmer verfügbar", "Reisepass, Ticket oder Visum fehlt", "Krankheit oder Unfall", "Verständigungsprobleme", "Streik"] },
      { title: "Lösungen und Reaktionen", items: ["Umbuchung vornehmen", "Reklamation machen", "Reiseversicherung kontaktieren", "Neues Hotel buchen", "Arzt oder Apotheke aufsuchen", "Übersetzungs-App nutzen", "Hotline oder Reiseleitung anrufen"] },
      { title: "Wichtige Vorbereitung", items: ["Reiseunterlagen kontrollieren", "Notrufnummern speichern", "Medikamente mitnehmen", "Versicherung abschließen", "Wichtige Kontakte notieren", "Pufferzeit einplanen"] },
      { title: "Höfliche Redemittel", items: ["Können Sie mir bitte weiterhelfen?", "Mein Gepäck ist nicht angekommen.", "Ich habe eine Reservierung auf den Namen …", "Wo ist das nächste Krankenhaus?", "Ich möchte eine Umbuchung.", "Ich möchte mein Geld zurück."] },
    ],
    activityTitle: "Gemeinsam eine Reise mit Notfallplan planen",
    activityIntro: "Plant eine Reise und besprecht mögliche Probleme:",
    activityPoints: [
      "Wohin möchtet ihr reisen?",
      "Welches Verkehrsmittel benutzt ihr?",
      "Welche Probleme könnten auftreten?",
      "Welche Dokumente und Kontakte braucht ihr?",
      "Wie reagiert ihr bei Verspätung, verlorenem Gepäck oder Krankheit?",
    ],
    answerStructure: [
      "Reiseziel und Verkehrsmittel vorstellen.",
      "Ein oder zwei mögliche Reiseprobleme beschreiben.",
      "Die Folgen des Problems erklären.",
      "Konkrete Lösungen und hilfreiche Kontakte nennen.",
      "Sagen, wie man sich besser vorbereiten kann.",
    ],
    usefulPhrases: ["Mein Flug hat Verspätung.", "Mein Gepäck ist nicht angekommen.", "Können Sie mir bitte weiterhelfen?", "Ich würde zuerst …", "Falls das passiert, kann man …"],
  },
  writing: getB1WritingTask(26),
  reading: getB1ReadingTask(26),
  listening: getB1ListeningTask(26),
  submitWritingDescription: "Submit your formal 40–50-word Vienna travel inquiry.",
  submitReadingDescription: "Submit all seven reading answers as A–H or X.",
};

export default function B1Day26ReiseproblemeUndLoesungenWorkbookPage() {
  return <B1StandardWorkbookPage config={config} />;
}
