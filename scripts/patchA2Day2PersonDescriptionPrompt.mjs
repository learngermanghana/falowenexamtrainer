import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const indexPath = path.join(root, "web/src/data/speakingMindMaps/a2/index.js");
const branchesPath = path.join(root, "web/src/data/speakingMindMaps/a2/personenBeschreiben.js");

let indexSource = fs.readFileSync(indexPath, "utf8");
const oldEntry = '[2, "a2-day-2-personen-beschreiben", "Personen beschreiben", "Wie beschreibst du eine Person einfach und klar?", ["Aussehen", "Charakter", "Kleidung", "Beziehung", "Meinung"], personenBeschreibenBranches],';
const newEntry = '[2, "a2-day-2-personen-beschreiben", "Deine Beschreibung", "Kannst du eine Person beschreiben? Wie sieht sie aus und was für ein Mensch ist sie?", ["Aussehen", "Charakter", "Kleidung", "Besondere Merkmale"], personenBeschreibenBranches],';

if (!indexSource.includes(newEntry)) {
  if (!indexSource.includes(oldEntry)) {
    throw new Error("Could not find the A2 Day 2 speaking mind-map entry.");
  }
  indexSource = indexSource.replace(oldEntry, newEntry);
  fs.writeFileSync(indexPath, indexSource, "utf8");
}

const branchesSource = `export const personenBeschreibenBranches = [
  {
    id: "aussehen",
    label: "Aussehen",
    keywords: ["groß oder klein", "Haare", "Augenfarbe"],
    guidingQuestion: "Wie sieht die Person aus?",
    sentenceStarter: "Die Person ist ... und hat ...",
    modelSentence: "Die Person ist groß. Sie hat kurze schwarze Haare und braune Augen.",
  },
  {
    id: "charakter",
    label: "Charakter",
    keywords: ["freundlich", "lustig", "ruhig"],
    guidingQuestion: "Was für ein Mensch ist die Person?",
    sentenceStarter: "Die Person ist ...",
    modelSentence: "Sie ist freundlich, lustig und meistens ruhig.",
  },
  {
    id: "kleidung",
    label: "Kleidung",
    keywords: ["trägt", "Farben", "Schuhe"],
    guidingQuestion: "Was trägt die Person?",
    sentenceStarter: "Die Person trägt ...",
    modelSentence: "Sie trägt ein weißes Hemd, eine blaue Hose und schwarze Schuhe.",
  },
  {
    id: "besondere-merkmale",
    label: "Besondere Merkmale",
    keywords: ["Brille", "Bart", "Schmuck"],
    guidingQuestion: "Welche besonderen Merkmale hat die Person?",
    sentenceStarter: "Ein besonderes Merkmal ist ...",
    modelSentence: "Sie trägt eine Brille und eine goldene Kette.",
  },
];
`;

if (fs.readFileSync(branchesPath, "utf8") !== branchesSource) {
  fs.writeFileSync(branchesPath, branchesSource, "utf8");
}

console.log("Aligned A2 Day 2 question and four person-description branches.");
