import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const requiredReplace = (source, pattern, replacement, label) => {
  if (!pattern.test(source)) throw new Error(`C2 shared standard alignment anchor missing: ${label}`);
  return source.replace(pattern, replacement);
};

const dataPath = path.join(root, "web/src/data/c2ExamStandardContent.js");
let data = fs.readFileSync(dataPath, "utf8");

const replaceRow = (day, nextDay, row) => {
  const pattern = nextDay
    ? new RegExp(`\\[${day},[\\s\\S]*?\\]\\],\\n\\[${nextDay},`)
    : new RegExp(`\\[${day},[\\s\\S]*?\\]\\]\\n\\];`);
  const replacement = nextDay ? `${row},\n[${nextDay},` : `${row}\n];`;
  data = requiredReplace(data, pattern, replacement, `row ${day}`);
};

const replaceGrammar = (day, nextDay, entry) => {
  const pattern = nextDay
    ? new RegExp(`${day}:\\[[\\s\\S]*?\\],\\n${nextDay}:`)
    : new RegExp(`${day}:\\[[\\s\\S]*?\\]\\n\\};`);
  const replacement = nextDay ? `${day}:${entry},\n${nextDay}:` : `${day}:${entry}\n};`;
  data = requiredReplace(data, pattern, replacement, `grammar ${day}`);
};

// Day 1 stays a register/nuance lesson, but every example now belongs to Umwelt/Kreislaufwirtschaft.
data = data.replace('"Registerwechsel und präzise Positionierung"', '"Nuancierte Bewertung und Registersteuerung"');
replaceGrammar(1, 2, '["Bewerte Umweltmaßnahmen abgestuft statt pauschal: Haltung, Evidenz und Bedingung müssen sprachlich sichtbar werden.","Ich halte ein Recht auf Reparatur für grundsätzlich sinnvoll, sofern Ersatzteile langfristig verfügbar bleiben.","Recycling erscheint als alleinige Strategie nur bedingt ausreichend, wenn Abfallvermeidung und Wiederverwendung vernachlässigt werden."]');

// Keep Days 23–28 on the current canonical C2 course instead of the older topic sequence.
replaceRow(23, 24, '[23,"Internationale Zusammenarbeit und Diplomatie","Hedging, vorsichtige Kritik und diplomatische Formulierungen","Wie Konflikte, Interessen und Kooperation sprachlich vorsichtig verhandelt werden.",["Diplomatische Sprache sollte klare Kritik ermöglichen, ohne Konflikte unnötig zu verschärfen.","Ein tragfähiger Kompromiss ist häufig wichtiger als die vollständige Durchsetzung der eigenen Position.","Internationale Zusammenarbeit bleibt auch dann sinnvoll, wenn zentrale Interessen nicht vollständig übereinstimmen."]]');
replaceRow(24, 25, '[24,"Gesellschaftliche Kontroversen und öffentliche Debatten","Argumentationslogik: These, Begründung, Beleg, Einwand und Reaktion","Wie kontroverse Positionen logisch, fair und evidenzbasiert vertreten werden können.",["Eine überzeugende Position muss auch ein starkes Gegenargument ernst nehmen.","Öffentliche Debatten gewinnen an Qualität, wenn Behauptungen nachvollziehbar begründet und belegt werden.","Ein Kompromiss ist nicht automatisch ausgewogen, nur weil er zwischen zwei Positionen liegt."]]');
replaceRow(25, 26, '[25,"Daten, Statistik und wissenschaftliche Evidenz","Evidentialität und vorsichtige Schlussfolgerungen","Wie stark Aussagen aus Daten, Studien und Korrelationen formuliert werden dürfen.",["Eine statistische Korrelation rechtfertigt noch keine eindeutige kausale Schlussfolgerung.","Politische oder gesellschaftliche Entscheidungen sollten die Grenzen wissenschaftlicher Evidenz offen benennen.","Unsicherheit in Daten zu markieren schwächt eine Argumentation nicht, sondern kann ihre Glaubwürdigkeit erhöhen."]]');
replaceRow(26, 27, '[26,"Philosophie, Ethik und technischer Fortschritt","Satzperioden, Einbettung und hierarchische Satzstruktur","Wie abstrakte Begriffe und ethische Konflikte logisch und sprachlich präzise untersucht werden können.",["Technischer Fortschritt sollte nicht nur nach Effizienz, sondern auch nach seinen sozialen und ethischen Folgen beurteilt werden.","Eine ethische Position ist nur dann überzeugend, wenn ihre Voraussetzungen und möglichen Gegenargumente offengelegt werden.","Nicht alles, was technisch möglich ist, ist deshalb bereits gesellschaftlich wünschenswert."]]');
replaceRow(27, 28, '[27,"Akademisches Schreiben und formelle Korrespondenz","Redundanz, Präzision, Register und Kohäsion","Wie anspruchsvolle Texte präzise, kohärent und adressatengerecht überarbeitet werden.",["Ein akademischer Text wird nicht durch möglichst lange Sätze besser, sondern durch klare Bezüge und präzise Verben.","Formelle Korrespondenz sollte sachlich bleiben, ohne unnötig distanziert oder bürokratisch zu wirken.","Überarbeiten bedeutet auch, Redundanzen zu streichen und mehrdeutige Bezüge eindeutig zu machen."]]');
replaceRow(28, null, '[28,"C2 Prüfungssimulation: Stellungnahme, Umformung und Synthese","Register, Nuance, Evidenz, Kohäsion und Reformulierung","Wie C2-Kompetenzen unter Prüfungsbedingungen flexibel kombiniert und kontrolliert werden.",["Eine starke C2-Leistung verbindet sprachliche Komplexität mit klarer Argumentationslogik.","Reformulierung ist nur gelungen, wenn Bedeutung, Register und grammatische Beziehungen erhalten bleiben.","Die Endkontrolle sollte Inhalt, Kohäsion, Kasus, Wortstellung, Register und Evidenzstärke gemeinsam prüfen."]]');

replaceGrammar(23, 24, '["Diplomatische Sprache kombiniert klare Positionen mit kontrollierter Abschwächung: nur bedingt, insofern, unter Vorbehalt, grundsätzlich.","Dieser Einschätzung lässt sich grundsätzlich zustimmen, allerdings bleibt offen, ob ...","Ein möglicher Kompromiss bestünde darin, ...; zugleich wäre zu berücksichtigen, dass ..."]');
replaceGrammar(24, 25, '["C2-Argumentation folgt einer erkennbaren Logik: These → Begründung → Beleg → Einwand → Reaktion → Schluss.","Für diese Position spricht ..., allerdings ist der Einwand ernst zu nehmen, dass ...","Der Einwand greift insofern zu kurz, als ...; daraus lässt sich jedoch nicht ableiten, dass ..."]');
replaceGrammar(25, 26, '["Evidentialität markiert, wie stark Daten eine Aussage tragen: belegen, nahelegen, darauf hindeuten, vermuten lassen, nicht ausschließen.","Die Daten legen einen Zusammenhang nahe, belegen jedoch keinen eindeutigen Kausalmechanismus.","Aus den vorliegenden Befunden lässt sich nicht ohne Weiteres schließen, dass ..."]');
replaceGrammar(26, 27, '["Komplexe Satzperioden brauchen eine klare Hierarchie aus Hauptaussage, Einbettung, Bedingung und Folgerung.","Die Frage, inwieweit technischer Fortschritt ethisch vertretbar ist, lässt sich nur beantworten, wenn Nutzen, Risiken und Verteilungseffekte getrennt betrachtet werden.","Verdichte nur dort, wo der logische Bezug auch beim ersten Lesen eindeutig bleibt."]');
replaceGrammar(27, 28, '["C2-Redaktion prüft Präzision, Redundanz, Bezüge, Register und Kohäsion systematisch.","schwaches Verb: eine Analyse machen → präziser: analysieren / auswerten / untersuchen","Ein präziser Fachtext streicht Wiederholungen, klärt Pronomenbezüge und wählt Verben nach ihrer tatsächlichen Bedeutung."]');
replaceGrammar(28, null, '["Die Prüfungssimulation verlangt flexible Auswahl: Struktur nach Funktion wählen, nicht nach Schwierigkeit.","Vor dem Abgeben: Bedeutung → Argumentationslogik → Register → Evidenz → Kasus/Rektion → Wortstellung → Kohäsion.","Eine gelungene Synthese verbindet Perspektiven, ohne Unterschiede einzuebnen oder Unsicherheit als Gewissheit darzustellen."]');

data = data
  .replace('24:["Renten- und Pflegepolitik","langfristige Reformen","Generationengerechtigkeit"]', '24:["gesellschaftliche Kontroversen","eine strukturierte Gegenargumentation","Qualität der Argumentation"]')
  .replace('26:["Organisationsentwicklung","klare Zuständigkeiten","Qualität von Entscheidungen"]', '26:["ethische Bewertung technischen Fortschritts","klare Prüfkriterien","Nachvollziehbarkeit ethischer Entscheidungen"]')
  .replace('28:["gesellschaftliche Zukunftspolitik","transparente Abwägungsverfahren","Vertrauen in langfristige Entscheidungen"]', '28:["C2-Prüfungsvorbereitung","gezielte Prüfungsstrategien","sprachliche Präzision und Kohäsion"]');

fs.writeFileSync(dataPath, data, "utf8");

// The shared Grammar page must keep each day's canonical vocabulary and collocations visible.
const panelPath = path.join(root, "web/src/components/C2StandardExamPanels.js");
let panel = fs.readFileSync(panelPath, "utf8");
const standardImport = 'import{getC2ExamStandard}from"../data/c2ExamStandardContent";';
const masteryImports = `${standardImport}\nimport{C2_DAY_1_TO_7_MASTERY}from"../data/c2Day1To7Mastery";\nimport{C2_DAY_8_TO_14_MASTERY}from"../data/c2Day8To14Mastery";\nimport{C2_DAY_15_TO_21_MASTERY}from"../data/c2Day15To21Mastery";\nimport{C2_DAY_22_TO_28_MASTERY}from"../data/c2Day22To28Mastery";\nconst C2_CANONICAL_MASTERY={...C2_DAY_1_TO_7_MASTERY,...C2_DAY_8_TO_14_MASTERY,...C2_DAY_15_TO_21_MASTERY,...C2_DAY_22_TO_28_MASTERY};\nconst getC2CanonicalMastery=(day)=>C2_CANONICAL_MASTERY[Number(day)]||null;`;
if (!panel.includes("C2_CANONICAL_MASTERY")) {
  if (!panel.includes(standardImport)) throw new Error("C2 standard panel data import missing.");
  panel = panel.replace(standardImport, masteryImports);
}
panel = panel.replace(
  ' const d=getC2ExamStandard(day);if(!d)return null;\n const [principle,...examples]=d.grammar||[];',
  ' const d=getC2ExamStandard(day);const mastery=getC2CanonicalMastery(day);if(!d)return null;\n const [principle,...examples]=d.grammar||[];',
);
const grammarCheckAnchor = '  <Section title="Grammar check">{completion(completed,onCompleteChange,"Ich kann die heutige Struktur erklären und sie bewusst in Sprechen oder Schreiben einsetzen.")}</Section>';
if (!panel.includes("Kollokationen · {d.title}")) {
  if (!panel.includes(grammarCheckAnchor)) throw new Error("C2 standard Grammar check anchor missing.");
  panel = panel.replace(grammarCheckAnchor, `  {mastery?.vocabulary?.length?<Section title="Wortschatz · Thema"><div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",gap:10}}>{mastery.vocabulary.map(([word,meaning])=><div key={word} style={sub}><strong>{word}</strong><span style={{color:"#64748b"}}>{meaning}</span></div>)}</div></Section>:null}\n  {mastery?.collocations?.length?<Section title={\`Kollokationen · \${d.title}\`}><div style={{display:"grid",gap:10}}>{mastery.collocations.map(([phrase,meaning,example])=><div key={phrase} style={sub}><strong>{phrase}</strong><span style={{color:"#64748b"}}>{meaning}</span><span style={{lineHeight:1.7}}>{example}</span></div>)}</div></Section>:null}\n${grammarCheckAnchor}`);
}
if (!panel.includes("getC2CanonicalMastery")) throw new Error("C2 standard panel canonical mastery lookup missing.");
fs.writeFileSync(panelPath, panel, "utf8");

console.log("C2 shared standard panels aligned with current Days 1–28 topics and canonical collocations.");
