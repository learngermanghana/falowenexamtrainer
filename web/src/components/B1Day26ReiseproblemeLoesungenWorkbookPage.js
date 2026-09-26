import React from "react";
import B1StandardWorkbookPage from "./B1StandardWorkbookPage";
import { getB1WritingTask } from "../data/b1WritingTasks";

export const B1_DAY26_REISEPROBLEME_LOESUNGEN_WORKBOOK_CONFIG = {
  day: 26,
  chapter: "9.26",
  assignmentKey: "B1-9.26",
  workbookId: "B1Day26ReiseproblemeLoesungen",
  title: "Reiseprobleme und Lösungen",
  heroImage: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=80",
  heroAlt: "Travel planning with suitcase and documents",
  speaking: {
    question:
      "Plant gemeinsam eine Reise und besprecht mögliche Probleme, die unterwegs passieren können, und wie ihr darauf reagieren würdet.",
    instructions:
      "Sprechen Sie darüber, wohin Sie reisen möchten, wie Sie reisen möchten, was schiefgehen könnte und welche Lösungen möglich sind.",
    image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=80",
    imageAlt: "Travel problems and solutions",
    ideaTitle: "Zentrales Thema: Reiseprobleme und Lösungen",
    ideaIntro:
      "In this chapter, we'll engage in group exercises discussing typical travel problems, possible reactions, important phrases and preparation tips.",
    ideaGroups: [
      {
        title: "1. Typische Reiseprobleme",
        items: [
          "Verspätung: Flug, Zug oder Bus kommt zu spät",
          "Gepäck verloren: Der Koffer kommt nicht an",
          "Reservierung vergessen: Kein Hotelzimmer verfügbar",
          "Dokumente fehlen: Reisepass, Ticket oder Visum vergessen",
          "Krankheit auf Reisen: Fieber, Unfall oder Durchfall",
          "Sprache: Verständigungsprobleme im Ausland",
          "Streik: Flughafen- oder Bahnpersonal streikt",
        ],
      },
      {
        title: "2. Lösungen und Reaktionen",
        items: [
          "Umbuchung vornehmen: einen anderen Flug oder Zug buchen",
          "Reklamation machen: sich beschweren und Ersatz verlangen",
          "Versicherung kontaktieren und Reiseversicherung nutzen",
          "Hotel wechseln oder neu buchen",
          "Apotheke oder Arzt aufsuchen",
          "Online-Übersetzer nutzen",
          "Hotline oder Reiseleitung anrufen",
        ],
      },
      {
        title: "3. Wichtige Redemittel",
        items: [
          "Mein Flug hat Verspätung.",
          "Mein Gepäck ist nicht angekommen.",
          "Ich habe eine Reservierung auf den Namen ...",
          "Ich brauche Hilfe. Ich bin krank.",
          "Können Sie mir bitte weiterhelfen?",
          "Wo ist das nächste Krankenhaus?",
          "Ich möchte mein Geld zurück.",
        ],
      },
      {
        title: "4. Tipps zur Vorbereitung",
        items: [
          "Reiseunterlagen vorher kontrollieren",
          "Notrufnummern speichern",
          "Medikamente mitnehmen",
          "Reiseversicherung abschließen",
          "Übersetzungs-App herunterladen",
          "Wichtige Adressen und Kontakte notieren",
          "Pufferzeit einplanen",
        ],
      },
    ],
    activityTitle: "Gemeinsam etwas planen: Reiseprobleme und Lösungen",
    activityIntro:
      "Plant gemeinsam eine Reise und besprecht mögliche Probleme, die unterwegs passieren können, und wie ihr darauf reagieren würdet.",
    activityPoints: [
      "Wohin wollt ihr reisen, zum Beispiel Stadt, Land oder Region?",
      "Wie wollt ihr reisen, zum Beispiel mit dem Flugzeug, Bus, Auto oder Zug?",
      "Was könnte schiefgehen, zum Beispiel Verspätung, verlorenes Gepäck oder falsches Hotel?",
      "Was macht ihr dann, zum Beispiel umbuchen, reklamieren oder Hilfe holen?",
    ],
    answerStructure: [
      "Reiseziel und Verkehrsmittel vorstellen.",
      "Mögliche Probleme nennen und erklären.",
      "Passende Lösungen und Reaktionen beschreiben.",
      "Vorbereitungstipps geben.",
      "Die beste Lösung gemeinsam begründen.",
    ],
    usefulPhrases: [
      "Wenn unser Flug Verspätung hat, würden wir ...",
      "Falls unser Gepäck verloren geht, sollten wir ...",
      "Wir könnten den Kundenservice kontaktieren.",
      "Am wichtigsten ist, dass man ruhig bleibt.",
      "Ich würde eine Reiseversicherung abschließen, weil ...",
    ],
  },
  writing: getB1WritingTask(26),
  reading: getB1ReadingTask(26),
  listening: {
    title: "Bearbeiten Sie den Goethe-Standard-Hörverstehenstest und kontrollieren Sie Ihre Antworten selbst.",
    instructions: "Bearbeiten Sie den vollständigen Hörtest zuerst ohne die Lösungen anzusehen. Kontrollieren und markieren Sie Ihre Antworten anschließend selbst.",
    image: "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?auto=format&fit=crop&w=1600&q=80",
    imageAlt: "Headphones for travel listening comprehension",
    videoId: "0sZVT9XAEBc",
    externalUrl: "https://youtu.be/0sZVT9XAEBc",
    selfCheckText:
      "Please note that this is a Goethe-standard Hörverstehen (listening comprehension) test, and the answers are provided in the YouTube video. You are responsible for checking your own answers. The only parts that will be officially evaluated by the school are Lesen (reading) and Schreiben (writing). You must mark your own Hörverstehen results. This process will require a lot of motivation and self-discipline on your part to be effective. Thank you, and good luck!",
  },
  submitWritingDescription: "Paste your final informal letter to Max or Lisa.",
  submitReadingDescription: "Paste your seven reading answer letters.",
};

export default function B1Day26ReiseproblemeLoesungenWorkbookPage() {
  return <B1StandardWorkbookPage config={B1_DAY26_REISEPROBLEME_LOESUNGEN_WORKBOOK_CONFIG} />;
}
