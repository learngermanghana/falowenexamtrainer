import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import "./patchStudyBuddyGlobalOverlay.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const pagePath = path.join(root, "web/src/components/LetterWritingIntroPage.js");

let source = fs.readFileSync(pagePath, "utf8");

const directWorkbookImport = 'import A1Day20LetterWritingWorkbookPage from "./A1Day20LetterWritingWorkbookPage";';
if (!source.includes(directWorkbookImport)) {
  const importAnchor = 'import A1TutorMarkedWorkbookShell from "./A1TutorMarkedWorkbookShell";';
  if (!source.includes(importAnchor)) throw new Error("Could not find Day 20 workbook import anchor.");
  source = source.replace(importAnchor, `${importAnchor}\n${directWorkbookImport}`);
}

const bodyRulesComponent = String.raw`const A1BodyRules = () => (
  <div style={{ display: "grid", gap: 10 }}>
    <p style={{ margin: 0, lineHeight: 1.75 }}>
      Answer every task point with one short sentence. Use about four words when possible.
      Write no more than five sentences in the main body.
    </p>
    <InfoBox title="Use these A1 sentence rules">
      <BulletList
        items={[
          <span key="a1-statement">
            <strong>Statement:</strong> Subject + verb + rest. <em>Ich brauche einen Termin.</em>
          </span>,
          <span key="a1-modal">
            <strong>Modal verb:</strong> Subject + modal verb + rest + infinitive. <em>Ich möchte Deutsch lernen.</em>
          </span>,
          <span key="a1-yes-no">
            <strong>Yes/no question:</strong> Verb + subject + rest? <em>Kostet der Kurs viel?</em>
          </span>,
          <span key="a1-w-question">
            <strong>W-question:</strong> W-word + verb + subject/rest? <em>Wann beginnt der Kurs?</em>
          </span>,
          <span key="a1-separable">
            <strong>Separable verb:</strong> Subject + verb + rest + prefix. <em>Ich rufe morgen an.</em>
          </span>,
        ]}
      />
    </InfoBox>
    <p style={{ margin: 0, lineHeight: 1.75 }}>
      Use <strong>weil</strong> only when you give a reason. Put the verb at the end:
      <strong> weil ich arbeiten muss</strong>.
    </p>
  </div>
);`;

if (!source.includes("const A1BodyRules = () => (")) {
  const anchor = "export const resolveLetterWritingPageMode = (pathname = \"\") => {";
  if (!source.includes(anchor)) throw new Error("Could not find A1 body-rules insertion anchor.");
  source = source.replace(anchor, `${bodyRulesComponent}\n\n${anchor}`);
}

const simplifiedMainBody = String.raw`        <div style={{ display: "grid", gap: 8 }}>
          <p style={labelStyle}>3. Main body</p>
          <A1BodyRules />
        </div>

`;

const simplifySectionMainBody = (input, sectionLabel) => {
  const sectionMarker = `aria-label="${sectionLabel}"`;
  const sectionIndex = input.indexOf(sectionMarker);
  if (sectionIndex < 0) throw new Error(`Could not find ${sectionLabel}.`);

  const mainMarker = "          <p style={labelStyle}>3. Main body</p>";
  const mainIndex = input.indexOf(mainMarker, sectionIndex);
  if (mainIndex < 0) throw new Error(`Could not find ${sectionLabel} main body.`);

  const conclusionMarker = String.raw`        <div style={{ display: "grid", gap: 8 }}>
          <p style={labelStyle}>4. Conclusion</p>`;
  const conclusionIndex = input.indexOf(conclusionMarker, mainIndex);
  if (conclusionIndex < 0) throw new Error(`Could not find ${sectionLabel} conclusion.`);

  const currentBlock = input.slice(mainIndex, conclusionIndex);
  if (currentBlock.includes("<A1BodyRules />")) return input;

  const blockStartMarker = '        <div style={{ display: "grid", gap: 8 }}>';
  const blockStart = input.lastIndexOf(blockStartMarker, mainIndex);
  if (blockStart < sectionIndex) throw new Error(`Could not find ${sectionLabel} main-body container.`);

  return `${input.slice(0, blockStart)}${simplifiedMainBody}${input.slice(conclusionIndex)}`;
};

source = simplifySectionMainBody(source, "Formal Letter Structure");
source = simplifySectionMainBody(source, "Informal Letter Structure");

source = source.replace(
  "Sehr geehrte Damen und Herren,\\n\\nich hoffe, es geht Ihnen gut. Ich schreibe Ihnen, weil ich mich für Ihren Deutschkurs anmelden möchte. Ich möchte wissen, ob der Kurs im August beginnt. Der Kurs ist wichtig für meine Arbeit, deshalb möchte ich bald anfangen. Wie viel kostet der Kurs und wie kann ich bezahlen?\\n\\nIch freue mich im Voraus auf Ihre Antwort.\\n\\nMit freundlichen Grüßen\\nMax Mustermann",
  "Sehr geehrte Damen und Herren,\\n\\nich hoffe, es geht Ihnen gut. Ich schreibe Ihnen, weil ich Deutsch lernen möchte. Wann beginnt der Kurs? Wie viel kostet der Kurs? Kann ich online bezahlen?\\n\\nIch freue mich im Voraus auf Ihre Antwort.\\n\\nMit freundlichen Grüßen\\nMax Mustermann",
);
source = source.replace(
  "Hallo Anna,\\n\\nwie geht es dir? Ich hoffe, es geht dir gut. Ich schreibe dir, weil ich dir zum Geburtstag gratulieren möchte. Herzlichen Glückwunsch! Ich möchte wissen, ob du eine Feier planst. Ich bin am Samstag frei, deshalb kann ich kommen.\\n\\nIch freue mich im Voraus auf deine Antwort.\\n\\nLiebe Grüße\\nMia",
  "Hallo Anna,\\n\\nwie geht es dir? Ich schreibe dir, weil ich dich besuchen möchte. Wann bist du zu Hause? Kann ich Samstag kommen? Ich bringe Kuchen mit.\\n\\nIch freue mich im Voraus auf deine Antwort.\\n\\nLiebe Grüße\\nMia",
);

source = source.replace(
  '            "Did I answer every task point in the main body?",\n            "Is the verb at the end after weil?",',
  '            "Did I answer every task point in the main body?",\n            "Did I write no more than five short body sentences?",\n            "Did I use the correct statement, modal verb, question, or separable-verb rule?",\n            "Is the verb at the end after weil?",',
);

source = source.replace(
  '            "Fragen Sie, ob es eine Feier gibt und ob Sie mit Ihrer Familie kommen können.",',
  '            "Fragen Sie: Gibt es eine Feier?",\n            "Fragen Sie: Kann Ihre Familie mitkommen?",',
);
source = source.replace(
  "          Schreiben Sie ungefähr 35–50 Wörter. Schreiben Sie eine passende Anrede, einen Gruß und\n          Ihren Namen.",
  "          Schreiben Sie höchstens fünf kurze Sätze im Hauptteil. Schreiben Sie außerdem eine\n          passende Anrede, einen Gruß und Ihren Namen.",
);
source = source.replace(
  '            "Bitten Sie um Informationen über die Deutschkurse.",\n            "Fragen Sie nach Kursterminen, Preisen und Zahlungsmöglichkeiten.",',
  '            "Fragen Sie: Wann beginnt der Kurs?",\n            "Fragen Sie: Wie viel kostet der Kurs?",\n            "Fragen Sie: Kann ich online bezahlen?",',
);
source = source.replace(
  "          Schreiben Sie ungefähr 35–50 Wörter. Schreiben Sie eine passende Anrede, einen formellen\n          Gruß und Ihren vollständigen Namen.",
  "          Schreiben Sie höchstens fünf kurze Sätze im Hauptteil. Schreiben Sie außerdem eine\n          passende Anrede, einen formellen Gruß und Ihren vollständigen Namen.",
);

const legacyWorkbookReturn = '  return mode === "grammar" ? <LetterWritingGrammarNotesPage /> : <WorkbookPage />;';
const canonicalWorkbookReturn = '  return mode === "grammar" ? <LetterWritingGrammarNotesPage /> : <A1Day20LetterWritingWorkbookPage />;';
if (source.includes(legacyWorkbookReturn)) {
  source = source.replace(legacyWorkbookReturn, canonicalWorkbookReturn);
} else if (!source.includes(canonicalWorkbookReturn)) {
  throw new Error("Could not find Day 20 workbook render anchor.");
}

fs.writeFileSync(pagePath, source);
console.log("A1 Day 20 letter guidance is aligned with the learners' current grammar and canonical workbook.");
