import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const filePath = path.join(root, "web/src/data/speakingMindMaps/a2/index.js");
let source = fs.readFileSync(filePath, "utf8");

const before = '[2, "a2-day-2-personen-beschreiben", "Personen beschreiben", "Wie beschreibst du eine Person einfach und klar?", ["Aussehen", "Charakter", "Kleidung", "Beziehung", "Meinung"], personenBeschreibenBranches],';
const after = '[2, "a2-day-2-personen-beschreiben", "Deine Beschreibung", "Kannst du eine Person beschreiben? Wie sieht sie aus und was für ein Mensch ist sie?", ["Aussehen", "Charakter", "Kleidung", "Besondere Merkmale"], personenBeschreibenBranches],';

if (!source.includes(after)) {
  if (!source.includes(before)) {
    throw new Error("Could not find the A2 Day 2 speaking mind-map entry.");
  }
  source = source.replace(before, after);
  fs.writeFileSync(filePath, source, "utf8");
}

console.log("Aligned A2 Day 2 person-description question and mind-map labels.");
