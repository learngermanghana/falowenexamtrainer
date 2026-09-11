import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

function write(relativePath, source) {
  fs.writeFileSync(path.join(root, relativePath), source);
}

function replaceOnce(source, from, to, label) {
  if (source.includes(to)) return source;
  if (!source.includes(from)) throw new Error(`Could not patch ${label}: source marker missing.`);
  return source.replace(from, to);
}

function insertBeforeOnce(source, marker, snippet, sentinel, label) {
  if (source.includes(sentinel)) return source;
  const index = source.indexOf(marker);
  if (index < 0) throw new Error(`Could not patch ${label}: insertion marker missing.`);
  return `${source.slice(0, index)}${snippet}${source.slice(index)}`;
}

function replaceSection(source, startMarker, replacement, sentinel, label) {
  if (source.includes(sentinel)) return source;
  const start = source.indexOf(startMarker);
  if (start < 0) throw new Error(`Could not patch ${label}: section start missing.`);
  const endMarker = "      </Section>";
  const end = source.indexOf(endMarker, start);
  if (end < 0) throw new Error(`Could not patch ${label}: section end missing.`);
  return `${source.slice(0, start)}${replacement}${source.slice(end + endMarker.length)}`;
}

function patchDay21() {
  const file = "web/src/components/WeatherPerfektLetterPage.js";
  let source = read(file);

  source = replaceOnce(
    source,
    "Learn to describe the weather, use <strong>im/am/um</strong>, give a simple reason with <strong>weil</strong>, and use that language in a short A1 email. Perfekt is available below only as optional review.",
    "Learn to describe the weather, use <strong>im/am/um</strong>, give a simple reason with <strong>weil</strong>, and use that language in a short A1 email. Then continue with a second grammar focus: <strong>Perfekt</strong> for completed actions.",
    "Day 21 introduction",
  );

  source = replaceOnce(
    source,
    "          <li>give a weather reason with <strong>weil</strong> and write a short informal message.</li>\n",
    "          <li>give a weather reason with <strong>weil</strong> and write a short informal message.</li>\n          <li>form common A1 Perfekt sentences with <strong>haben/sein + Partizip II</strong>.</li>\n",
    "Day 21 learning targets",
  );

  source = insertBeforeOnce(
    source,
    "];\n\nconst WeatherPerfektLetterPage = () => {",
    `  {\n    prompt: "Ich ___ gestern Deutsch gelernt.",\n    options: ["habe", "bin", "ist"],\n    answer: "habe",\n    explanation: "lernen uses haben in Perfekt: Ich habe Deutsch gelernt.",\n  },\n  {\n    prompt: "Wir ___ nach Kumasi gefahren.",\n    options: ["haben", "sind", "seid"],\n    answer: "sind",\n    explanation: "fahren commonly uses sein when it describes movement to another place: Wir sind gefahren.",\n  },\n  {\n    prompt: "Which Perfekt sentence is correct?",\n    options: ["Er ist gegessen.", "Er hat gegessen.", "Er hat geessen."],\n    answer: "Er hat gegessen.",\n    explanation: "essen uses haben: Er hat gegessen.",\n  },\n  {\n    prompt: "Which Perfekt sentence is correct?",\n    options: ["Sie hat gekommen.", "Sie ist gekommen.", "Sie ist gekommt."],\n    answer: "Sie ist gekommen.",\n    explanation: "kommen uses sein: Sie ist gekommen.",\n  },\n`,
    "Ich ___ gestern Deutsch gelernt.",
    "Day 21 Perfekt practice",
  );

  source = replaceOnce(
    source,
    "score >= 5 ? \"You are ready for the Day 21 workbook.\"",
    "score >= 8 ? \"You are ready for the Day 21 workbook.\"",
    "Day 21 readiness score",
  );

  const day21Section = `      <Section eyebrow="Second grammar focus" title="Perfekt: talking about completed actions">\n        <p style={{ margin: 0, lineHeight: 1.7 }}>\n          Use <strong>Perfekt</strong> to talk about completed actions in everyday German. The basic pattern is <strong>haben/sein + Partizip II</strong>. Most common verbs use <strong>haben</strong>; common movement or change-of-place verbs such as <strong>gehen</strong>, <strong>kommen</strong> and <strong>fahren</strong> often use <strong>sein</strong>.\n        </p>\n        <div style={{ overflowX: "auto" }}>\n          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 620 }}>\n            <thead>\n              <tr style={{ background: "#f8fafc" }}>\n                {["Infinitive", "Helping verb", "Partizip II", "Example"].map((heading) => (\n                  <th key={heading} style={{ border: "1px solid #e2e8f0", padding: 10, textAlign: "left" }}>{heading}</th>\n                ))}\n              </tr>\n            </thead>\n            <tbody>\n              {[\n                ["lernen", "haben", "gelernt", "Ich habe Deutsch gelernt."],\n                ["essen", "haben", "gegessen", "Er hat gegessen."],\n                ["spielen", "haben", "gespielt", "Wir haben Fußball gespielt."],\n                ["gehen", "sein", "gegangen", "Ich bin nach Hause gegangen."],\n                ["fahren", "sein", "gefahren", "Wir sind nach Kumasi gefahren."],\n                ["kommen", "sein", "gekommen", "Sie ist spät gekommen."],\n              ].map((row) => (\n                <tr key={row.join("-")}>{row.map((cell, index) => <td key={index} style={{ border: "1px solid #e2e8f0", padding: 10 }}>{index === 3 ? <strong>{cell}</strong> : cell}</td>)}</tr>\n              ))}\n            </tbody>\n          </table>\n        </div>\n        <div style={{ borderLeft: "4px solid #4f46e5", background: "#eef2ff", borderRadius: 10, padding: 12, lineHeight: 1.65 }}>\n          <strong>Word order:</strong> the helping verb is conjugated in position 2 and the Partizip II normally goes to the end: <strong>Ich habe gestern Deutsch gelernt.</strong>\n        </div>\n      </Section>`;

  source = replaceSection(
    source,
    "      <Section eyebrow=\"Optional review\" title=\"Perfekt: useful, but not the Day 21 core target\">",
    day21Section,
    "Second grammar focus\" title=\"Perfekt: talking about completed actions",
    "Day 21 Perfekt section",
  );

  write(file, source);
}

function patchDay23() {
  const file = "web/src/components/DativeAdjectiveDeclensionPage.js";
  let source = read(file);

  source = replaceOnce(
    source,
    "Today’s main goal is to choose the correct object case from the verb. Learn common dative verbs, compare them with accusative verbs and use the right pronoun. Adjective declension is kept below as an optional extra so the case choice stays clear.",
    "Today’s main goal is to choose the correct object case from the verb. Learn common dative verbs, compare them with accusative verbs and use the right pronoun. Then build on that case knowledge with a second grammar focus: common adjective endings with ein/eine.",
    "Day 23 introduction",
  );

  source = replaceOnce(
    source,
    "          <li>choose the correct object pronoun, for example <strong>mich</strong> vs <strong>mir</strong>.</li>\n",
    "          <li>choose the correct object pronoun, for example <strong>mich</strong> vs <strong>mir</strong>.</li>\n          <li>use common adjective endings with <strong>ein/eine</strong> in Nominativ, Akkusativ and Dativ.</li>\n",
    "Day 23 learning targets",
  );

  source = insertBeforeOnce(
    source,
    "];\n\nconst DativeAdjectiveDeclensionPage = () => {",
    `  {\n    prompt: "Das ist ein ___ Hund.",\n    options: ["großer", "großen", "großes"],\n    answer: "großer",\n    explanation: "Masculine nominative after ein takes -er: ein großer Hund.",\n  },\n  {\n    prompt: "Ich sehe einen ___ Hund.",\n    options: ["großer", "großen", "großem"],\n    answer: "großen",\n    explanation: "Masculine accusative after einen takes -en: einen großen Hund.",\n  },\n  {\n    prompt: "Ich spreche mit einem ___ Lehrer.",\n    options: ["netter", "netten", "nettes"],\n    answer: "netten",\n    explanation: "Dative after einem takes -en here: mit einem netten Lehrer.",\n  },\n  {\n    prompt: "Sie kauft ein ___ Buch.",\n    options: ["guter", "gutes", "guten"],\n    answer: "gutes",\n    explanation: "Neuter accusative after ein takes -es: ein gutes Buch.",\n  },\n`,
    "Das ist ein ___ Hund.",
    "Day 23 adjective practice",
  );

  source = replaceOnce(
    source,
    "score >= 7 ? \"Strong work. You can move to the final A1.2 revision.\"",
    "score >= 10 ? \"Strong work. You can move to the final A1.2 revision.\"",
    "Day 23 readiness score",
  );

  const day23Section = `      <Section eyebrow="Second grammar focus" title="Adjective endings with ein/eine">\n        <p style={{ margin: 0, lineHeight: 1.7 }}>\n          Once you know the case, add the adjective ending. At A1, focus on a small set of useful patterns rather than trying to memorise every possible adjective table at once.\n        </p>\n        <div style={{ overflowX: "auto" }}>\n          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 700 }}>\n            <thead>\n              <tr style={{ background: "#f8fafc" }}>\n                {["Case", "Masculine", "Feminine", "Neuter"].map((heading) => (\n                  <th key={heading} style={{ border: "1px solid #e2e8f0", padding: 10, textAlign: "left" }}>{heading}</th>\n                ))}\n              </tr>\n            </thead>\n            <tbody>\n              {[\n                ["Nominativ", "ein großer Mann", "eine nette Frau", "ein gutes Buch"],\n                ["Akkusativ", "einen großen Mann", "eine nette Frau", "ein gutes Buch"],\n                ["Dativ", "mit einem großen Mann", "mit einer netten Frau", "mit einem guten Buch"],\n              ].map((row) => (\n                <tr key={row.join("-")}>{row.map((cell, index) => <td key={index} style={{ border: "1px solid #e2e8f0", padding: 10 }}>{index === 0 ? <strong>{cell}</strong> : cell}</td>)}</tr>\n              ))}\n            </tbody>\n          </table>\n        </div>\n        <div style={{ borderLeft: "4px solid #4f46e5", background: "#eef2ff", borderRadius: 10, padding: 12, lineHeight: 1.65 }}>\n          <strong>Useful shortcut:</strong> masculine changes are easiest to notice: <strong>ein großer Mann → einen großen Mann → mit einem großen Mann</strong>. In Dativ, the adjective normally ends in <strong>-en</strong>.\n        </div>\n      </Section>`;

  source = replaceSection(
    source,
    "      <Section eyebrow=\"Optional extra\" title=\"Adjective endings are not the main goal today\">",
    day23Section,
    "Second grammar focus\" title=\"Adjective endings with ein/eine",
    "Day 23 adjective section",
  );

  write(file, source);
}

function patchDay24() {
  const file = "web/src/components/ConjunctionNotesPage.js";
  let source = read(file);

  source = insertBeforeOnce(
    source,
    "];\n\nconst examGuidance = [",
    `  {\n    title: "7) Task",\n    prompt: "Write in Perfekt: Ich lerne Deutsch.",\n    hint: "Use haben + gelernt.",\n    answer: "Ich habe Deutsch gelernt.",\n  },\n  {\n    title: "8) Task",\n    prompt: "Write in Perfekt: Wir fahren nach Accra.",\n    hint: "fahren uses sein for movement to another place.",\n    answer: "Wir sind nach Accra gefahren.",\n  },\n  {\n    title: "9) Task",\n    prompt: "Complete the phrase: Das ist ein ___ Kurs. (gut)",\n    hint: "Masculine nominative after ein.",\n    answer: "Das ist ein guter Kurs.",\n  },\n  {\n    title: "10) Task",\n    prompt: "Complete the phrase: Ich spreche mit einem ___ Lehrer. (nett)",\n    hint: "Dative after einem.",\n    answer: "Ich spreche mit einem netten Lehrer.",\n  },\n`,
    "title: \"7) Task\"",
    "Day 24 grammar revision challenges",
  );

  const day24Section = `      <Section title="Final Grammar Check: Perfekt and Adjective Endings">\n        <p style={{ margin: 0, lineHeight: 1.7 }}>\n          Before you finish A1, bring back two grammar topics from the previous lessons. You do not need a huge new rule set here; the goal is to recognise the pattern and produce a few correct sentences yourself.\n        </p>\n        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 12 }}>\n          <div style={{ border: "1px solid #c7d2fe", background: "#eef2ff", borderRadius: 14, padding: 14, display: "grid", gap: 7 }}>\n            <h3 style={{ margin: 0 }}>Perfekt</h3>\n            <div><strong>haben/sein + Partizip II</strong></div>\n            <div>Ich <strong>habe</strong> Deutsch <strong>gelernt</strong>.</div>\n            <div>Wir <strong>sind</strong> nach Accra <strong>gefahren</strong>.</div>\n          </div>\n          <div style={{ border: "1px solid #bbf7d0", background: "#f0fdf4", borderRadius: 14, padding: 14, display: "grid", gap: 7 }}>\n            <h3 style={{ margin: 0 }}>Adjective endings</h3>\n            <div><strong>ein guter Kurs</strong> — Nominativ</div>\n            <div><strong>einen guten Kurs</strong> — Akkusativ</div>\n            <div><strong>mit einem guten Kurs</strong> — Dativ</div>\n          </div>\n        </div>\n        <Callout>\n          <strong>Final check:</strong> Make one Perfekt sentence with <strong>haben</strong>, one with <strong>sein</strong>, and one noun phrase with an adjective in each of Nominativ, Akkusativ and Dativ.\n        </Callout>\n      </Section>\n\n`;

  source = insertBeforeOnce(
    source,
    "      <Section title=\"Final Revision: Sentence Formulation Check\">",
    day24Section,
    "Final Grammar Check: Perfekt and Adjective Endings",
    "Day 24 final grammar check",
  );

  write(file, source);
}

patchDay21();
patchDay23();
patchDay24();
console.log("A1 Days 21, 23 and 24 now teach and reinforce Perfekt and adjective endings as deliberate secondary grammar focuses.");
