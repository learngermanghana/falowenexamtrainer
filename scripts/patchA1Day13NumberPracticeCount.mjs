import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const pagePath = path.join(root, "web/src/components/A1Day13RevisionNumbersTimePricesWorkbookPage.js");
let source = fs.readFileSync(pagePath, "utf8");

const before = `const numbersItems = [
  ["56", "sechsundfünfzig"],
  ["248", "zweihundertachtundvierzig"],
  ["1,234", "eintausendzweihundertvierunddreißig"],
  ["3,452", "dreitausendvierhundertzweiundfünfzig"],
  ["4,560", "viertausendfünfhundertsechzig"],
  ["5,678", "fünftausendsechshundertachtundsiebzig"],
  ["6,789", "sechstausendsiebenhundertneunundachtzig"],
  ["7,890", "siebentausendachthundertneunzig"],
  ["9,999", "neuntausendneunhundertneunundneunzig"],
];`;

const after = `const numbersItems = [
  ["56", "sechsundfünfzig"],
  ["248", "zweihundertachtundvierzig"],
  ["1,234", "eintausendzweihundertvierunddreißig"],
  ["5,678", "fünftausendsechshundertachtundsiebzig"],
  ["9,999", "neuntausendneunhundertneunundneunzig"],
];`;

if (!source.includes(after)) {
  if (!source.includes(before)) {
    throw new Error("Could not reduce A1 Day 13 number practice: expected numbersItems block was not found.");
  }
  source = source.replace(before, after);
  fs.writeFileSync(pagePath, source, "utf8");
}

const finalSource = fs.readFileSync(pagePath, "utf8");
const retainedNumbers = ["56", "248", "1,234", "5,678", "9,999"];
const removedNumbers = ["3,452", "4,560", "6,789", "7,890"];

retainedNumbers.forEach((number) => {
  if (!finalSource.includes(`["${number}",`)) {
    throw new Error(`A1 Day 13 number practice is missing retained item ${number}.`);
  }
});

removedNumbers.forEach((number) => {
  if (finalSource.includes(`["${number}",`)) {
    throw new Error(`A1 Day 13 number practice still contains removed item ${number}.`);
  }
});

console.log("A1 Day 13 number practice reduced from 9 items to 5 representative items.");
