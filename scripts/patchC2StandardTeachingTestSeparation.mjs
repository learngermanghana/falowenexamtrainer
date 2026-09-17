import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const file = path.join(root, "web/src/components/C2StandardExamPanels.js");
let source = fs.readFileSync(file, "utf8");

const completionAnchor = 'const completion=(checked,onChange,label)=><label style={{display:"flex",gap:8,alignItems:"flex-start",fontWeight:700,lineHeight:1.5}}><input type="checkbox" checked={Boolean(checked)} onChange={e=>onChange?.(e.target.checked)} style={{marginTop:4}}/>{label}</label>;';
const families = `const REFORMULATION_FAMILIES=[
 {cue:"Zweifel",name:"skeptisch sein → Zweifel haben",before:"Viele Beteiligte waren gegenüber dem Vorschlag zunächst skeptisch.",after:"Viele Beteiligte hatten zunächst Zweifel an dem Vorschlag.",note:"Die Haltung wird nominal ausgedrückt. Bei einem Bezug steht häufig Zweifel an + Dativ oder Zweifel daran, ob ..."},
 {cue:"zur",name:"um ... zu → zur + Nominalisierung",before:"Die Einrichtung investiert, um die Qualität zu verbessern.",after:"Die Einrichtung investiert zur Verbesserung der Qualität.",note:"zur = zu der. Das Verb wird nominalisiert und großgeschrieben; notwendige Ergänzungen müssen angepasst werden."},
 {cue:"klar",name:"erkennen/merken → jemandem wird klar",before:"Die Verantwortlichen erkannten, dass weitere Schritte nötig waren.",after:"Den Verantwortlichen wurde klar, dass weitere Schritte nötig waren.",note:"Die Person steht im Dativ. Der Inhalt des dass-Satzes bleibt erhalten."},
 {cue:"trotz",name:"obwohl → trotz + Nominalgruppe",before:"Obwohl die Umsetzung teuer ist, wird sie fortgesetzt.",after:"Trotz der hohen Umsetzungskosten wird sie fortgesetzt.",note:"Der Nebensatz wird nominalisiert. Im formellen Deutsch steht trotz normalerweise mit Genitiv."},
 {cue:"durch",name:"wenn/indem → durch + Nominalgruppe",before:"Wenn Prozesse besser koordiniert werden, steigt die Qualität.",after:"Durch eine bessere Koordination der Prozesse steigt die Qualität.",note:"durch verlangt Akkusativ. Ursache, Mittel oder Bedingung wird als Nominalgruppe formuliert."}
];`;
if (!source.includes("const REFORMULATION_FAMILIES=")) {
  if (!source.includes(completionAnchor)) throw new Error("C2 standard panel completion anchor missing.");
  source = source.replace(completionAnchor, `${completionAnchor}\n${families}`);
}

const exactModels = /<h3 style=\{\{marginBottom:0\}\}>Muster, die du heute brauchst<\/h3>\n   <div style=\{\{display:"grid",gap:12\}\}>\{d\.reformulations\.map\([\s\S]*?<\/article>\)\}<\/div>/;
const familyTeaching = `<h3 style={{marginBottom:0}}>Transformation families</h3>\n   <div style={{display:"grid",gap:12}}>{REFORMULATION_FAMILIES.map((r,i)=><article key={r.cue+i} style={{border:"1px solid #e2e8f0",borderRadius:14,padding:14,display:"grid",gap:7}}><strong>{i+1}. {r.name}</strong><div><span style={{color:"#64748b"}}>Vorgabewort:</span> <strong>{r.cue}</strong></div><div><span style={{color:"#64748b"}}>Beispiel:</span> {r.before}</div><div><span style={{color:"#64748b"}}>Umformung:</span> {r.after}</div><div style={{color:"#475569",lineHeight:1.65}}><strong>Warum?</strong> {r.note}</div></article>)}</div>`;
if (exactModels.test(source)) source = source.replace(exactModels, familyTeaching);
else if (!source.includes("REFORMULATION_FAMILIES.map")) throw new Error("C2 Learn reformulation model block missing.");

const grammarStart = source.indexOf('export function C2StandardGrammarPanel');
const speakStart = source.indexOf('export function C2StandardSpeakPanel');
const writeStart = source.indexOf('function ReformulationWrite');
if (grammarStart < 0 || speakStart < 0 || writeStart < 0) throw new Error("C2 standard panel sections missing.");
const grammarBlock = source.slice(grammarStart, speakStart);
const writeBlock = source.slice(writeStart);
if (grammarBlock.includes('d.reformulations.map')) throw new Error("C2 Learn still exposes the exact Write reformulation answers.");
if (writeBlock.includes('r.model') || writeBlock.includes('Musterlösung')) throw new Error("C2 Write exposes model reformulation answers.");

fs.writeFileSync(file, source, "utf8");
console.log("C2 Learn teaches transformation families; Write keeps reformulation answers hidden.");
