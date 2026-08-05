import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const filePath = path.join(root, "web/src/components/C1Day8To10GrammarNotes.js");
let source = fs.readFileSync(filePath, "utf8");

const replacements = [
  [
    'title: "Passiv, Modalpassiv und differenzierte Bewertung bei Integration und Gesellschaft",',
    'title: "Adversative und konzessive Strukturen bei Gesellschaft und Zusammenhalt",'
  ],
  [
    'subtitle: "Teilhabe, Verantwortung und gesellschaftlichen Zusammenhalt sachlich analysieren",',
    'subtitle: "Soziale Gegensätze, Solidarität und gemeinsame Verantwortung differenziert bewerten",'
  ],
  [
    '"Vorgangspassiv und Modalpassiv sicher nutzen",',
    '"Gegensätze mit während, wohingegen, dagegen und demgegenüber präzise formulieren",'
  ],
  [
    '"gesellschaftliche Prozesse sachlich und nicht nur emotional beschreiben",',
    '"Einwände mit obwohl, obgleich, wenngleich und selbst wenn angemessen einbauen",'
  ],
  [
    '"Verantwortung zwischen Individuen, Staat, Institutionen, Medien und Zivilgesellschaft differenziert zuordnen",',
    '"Argumente mit zwar … jedoch sowie einerseits … andererseits ausgewogen abwägen",'
  ],
  [
    '"Integration mit Chancen, Grenzen und konkreten Bedingungen bewerten",',
    '"soziale Konflikte anhand konkreter Beispiele erklären und bewerten",'
  ],
  [
    '"Maßnahmen nennen, die Sprache, Bildung, Arbeit, Begegnung und Anerkennung verbinden",',
    '"Maßnahmen für mehr Solidarität, Teilhabe und gesellschaftlichen Zusammenhalt formulieren",'
  ],
  [
    '["Vorgangspassiv", "Integrationsangebote werden in vielen Kommunen ausgebaut."],',
    '["während / wohingegen", "Während einige Bevölkerungsgruppen vom wirtschaftlichen Fortschritt profitieren, fühlen sich andere zunehmend ausgeschlossen."],'
  ],
  [
    '["Modalpassiv", "Sprachbarrieren müssen systematisch abgebaut werden."],',
    '["obwohl / obgleich", "Obgleich kulturelle Vielfalt eine Gesellschaft bereichern kann, entstehen ohne Dialog leicht Missverständnisse."],'
  ],
  [
    '["von / durch", "Teilhabe wird durch Bildung, Arbeit und Sprache erleichtert."],',
    '["zwar … jedoch", "Soziale Medien verbinden Menschen zwar miteinander, jedoch können sie gesellschaftliche Konflikte auch verschärfen."],'
  ],
  [
    '["Verantwortung", "Diskriminierung muss von Institutionen erkannt und durch klare Verfahren reduziert werden."],',
    '["selbst wenn", "Selbst wenn Solidarität öffentlich gefordert wird, müssen konkrete Möglichkeiten zur Beteiligung geschaffen werden."],'
  ],
  [
    '["abwägend", "Integration kann nur gelingen, wenn individuelle Anstrengung und institutionelle Unterstützung zusammengedacht werden."],',
    '["einerseits … andererseits", "Einerseits stärkt Vielfalt die Gesellschaft; andererseits braucht sie gemeinsame Regeln und gegenseitigen Respekt."],'
  ],
  [
    'model:\n      "Integration darf nicht allein als individuelle Anpassungsleistung verstanden werden. Sprachbarrieren müssen abgebaut, Bildungswege geöffnet und Diskriminierung ernst genommen werden. Gleichzeitig kann Teilhabe nur entstehen, wenn Zugewanderte aktiv Möglichkeiten nutzen und gesellschaftliche Institutionen verlässliche Strukturen bereitstellen. Entscheidend ist daher ein Verständnis von Integration, das Rechte, Pflichten und soziale Anerkennung miteinander verbindet. Besonders wichtig erscheint dabei, dass Maßnahmen nicht nur kurzfristig angeboten, sondern langfristig finanziert, erklärt und regelmäßig überprüft werden.",',
    'model:\n      "Gesellschaftlicher Zusammenhalt entsteht nicht automatisch. Während einige Menschen von wirtschaftlichen und digitalen Entwicklungen profitieren, fühlen sich andere zunehmend ausgeschlossen. Vielfalt kann zwar neue Perspektiven eröffnen, jedoch entstehen ohne Dialog und faire Teilhabe schnell Spannungen. Obgleich staatliche Programme wichtig sind, reicht politische Verantwortung allein nicht aus. Auch Schulen, Unternehmen, Vereine und Bürgerinnen und Bürger müssen zum sozialen Miteinander beitragen. Einerseits braucht eine offene Gesellschaft individuelle Freiheit, andererseits benötigt sie gemeinsame Regeln, gegenseitigen Respekt und verlässliche Möglichkeiten zur Beteiligung.",'
  ],
  [
    '["Aktiv: Kommunen bauen Angebote aus. → Passiv", "Angebote werden von Kommunen ausgebaut."],',
    '["Verbinde mit während: Einige profitieren. Andere fühlen sich ausgeschlossen.", "Während einige profitieren, fühlen sich andere ausgeschlossen."],'
  ],
  [
    '["Modalpassiv: Man muss Barrieren abbauen.", "Barrieren müssen abgebaut werden."],',
    '["Formuliere mit zwar … jedoch: Vielfalt bereichert. Sie kann Konflikte verursachen.", "Vielfalt kann zwar bereichern, jedoch kann sie ohne Dialog auch Konflikte verursachen."],'
  ],
  [
    '["Teilhabe wird ___ Bildung erleichtert.", "durch"],',
    '["Nenne ein gehobenes Synonym für obwohl.", "obgleich / wenngleich"],'
  ],
  [
    '["Nenne eine differenzierte C1-Bewertung.", "Integration braucht sowohl Eigeninitiative als auch faire institutionelle Unterstützung."],',
    '["Formuliere eine ausgewogene Bewertung.", "Einerseits braucht die Gesellschaft Vielfalt und individuelle Freiheit, andererseits sind gemeinsame Regeln und soziale Verantwortung unverzichtbar."],'
  ]
];

for (const [before, after] of replacements) {
  if (!source.includes(before)) throw new Error(`Anchor not found: ${before.slice(0, 80)}`);
  source = source.replace(before, after);
}

fs.writeFileSync(filePath, source, "utf8");
console.log("Improved C1 Day 18 grammar notes with relevant examples.");
