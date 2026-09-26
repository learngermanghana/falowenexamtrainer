import React from "react";
import B1StandardWorkbookPage from "./B1StandardWorkbookPage";
import { getB1WritingTask } from "../data/b1WritingTasks";
import {
  getWritingVideoResource,
  getYouTubeEmbedUrl,
} from "../data/writingVideoResources";

export const B1_DAY21_HAS_TEIL4 = false;

const day21WritingVideoResource = getWritingVideoResource("B1", 21);
const day21WritingVideo = day21WritingVideoResource
  ? { ...day21WritingVideoResource, embedUrl: getYouTubeEmbedUrl(day21WritingVideoResource.url) }
  : null;

const config = {
  day: 21,
  chapter: "7.21",
  assignmentKey: "B1-7.21",
  workbookId: "B1Day21LebensformenHeute",
  title: "Lebensformen heute",
  subtitle: "This workbook contains Teil 1, Teil 2 and Teil 3 only. There is no Teil 4 for this lesson.",
  heroImage: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1600&q=80",
  heroAlt: "People discussing modern living arrangements",
  speaking: {
    question: "Welche Lebensform findest du am besten – Familie, Wohngemeinschaft oder Singleleben? Warum?",
    instructions: "Beschreibe mehrere Lebensformen, nenne Vor- und Nachteile und erkläre, welche Lebensform gut oder nicht gut zu dir passt.",
    image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1600&q=80",
    imageAlt: "Friends discussing family, shared flats and single life",
    ideaTitle: "Brain Map: Lebensformen heute",
    ideaIntro: "Use these notes as an idea bank. You do not need to answer every point separately.",
    ideaGroups: [
      { title: "Familie", items: ["Traditionelle Familie", "Alleinerziehende Eltern", "Patchworkfamilien", "Rollenverteilung", "Nähe und Unterstützung"] },
      { title: "Wohngemeinschaft (WG)", items: ["Studenten-WG", "Kosten teilen", "Gemeinschaft", "Privatsphäre", "Konflikte und Organisation"] },
      { title: "Singleleben", items: ["Unabhängigkeit", "Selbstverwirklichung", "Flexible Lebensgestaltung", "Allein entscheiden", "Mögliche Einsamkeit"] },
      { title: "Neue Lebensformen", items: ["Fernbeziehungen", "Wohnen auf Zeit", "Co-Parenting", "Gleichgeschlechtliche Partnerschaften", "Mehrgenerationenwohnen"] },
    ],
    discussionQuestions: [
      "Was ist dir wichtiger: Freiheit, Nähe, Sicherheit oder niedrige Kosten?",
      "Welche Lebensform ist in deinem Heimatland besonders verbreitet?",
      "Welche Probleme können beim Zusammenleben entstehen?",
      "Kann sich die passende Lebensform im Laufe des Lebens verändern?",
    ],
    answerStructure: [
      "Einleitung: Heute gibt es viele verschiedene Lebensformen.",
      "Familie, WG und Singleleben kurz beschreiben.",
      "Vor- und Nachteile miteinander vergleichen.",
      "Die Situation im Heimatland oder ein persönliches Beispiel nennen.",
      "Die eigene Entscheidung begründen und zusammenfassen.",
    ],
    usefulPhrases: [
      "Meiner Meinung nach …",
      "Einerseits …, andererseits …",
      "Ein Vorteil/Nachteil ist, dass …",
      "Für mich passt … am besten, weil …",
      "Obwohl …, finde ich …",
    ],
  },
  writing: getB1WritingTask(21),
  reading: getB1ReadingTask(21),
  writingVideo: day21WritingVideo,
  submitListening: false,
  submitTitle: "Submit Teil 2 and Teil 3.",
  submitNote: "Teil 1 is group practice. There is no Teil 4 in this workbook.",
  submitInstructions: "Paste your final 80–100 word opinion text and your five reading answer letters into the form below.",
  submitWritingDescription: "Paste your final 80–100 word opinion text.",
  submitReadingDescription: "Paste your five reading answer letters.",
};

export default function B1Day21LebensformenHeuteWorkbookPage() {
  return <B1StandardWorkbookPage config={config} />;
}
