import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const replaceRequired = (source, pattern, replacement, label) => {
  if (!pattern.test(source)) throw new Error(`C2 Day 1 Umwelt patch anchor missing: ${label}`);
  return source.replace(pattern, replacement);
};

// Canonical Day 1 mastery: remove the old Sprache/Kultur lesson completely.
const masteryPath = path.join(root, "web/src/data/c2Day1To7Mastery.js");
let mastery = fs.readFileSync(masteryPath, "utf8");
const day1 = `1:{chapter:"1.1",title:"Kreislaufwirtschaft und Wegwerfgesellschaft",topic:"Nachhaltiger Konsum, Reparatur, Wiederverwendung und Ressourcenschonung",grammarFocus:"Nuancierte Bewertung und Registersteuerung in Umweltargumentationen",objectives:["Umweltmaßnahmen präzise statt pauschal bewerten","Bewertungsstärke mit passenden Strukturen abstufen","Umweltargumente adressatengerecht und formal formulieren"],vocabulary:[["die Kreislaufwirtschaft","circular economy"],["die Ressourcenschonung","resource conservation"],["die Reparierbarkeit","repairability"],["die Wiederverwendung","reuse"],["die Wegwerfmentalität","throwaway mentality"],["der Rohstoffverbrauch","raw-material consumption"]],collocations:[["Ressourcen schonen","conserve resources","Langlebige und reparierbare Produkte können natürliche Ressourcen schonen."],["Abfall vermeiden","avoid waste","Mehrweg- und Reparatursysteme helfen dabei, unnötigen Abfall zu vermeiden."],["Produkte länger nutzen","use products for longer","Ein Recht auf Reparatur kann dazu beitragen, Produkte deutlich länger zu nutzen."],["Reparaturen fördern","promote repairs","Steuerliche Anreize könnten Reparaturen wirtschaftlich attraktiver machen und stärker fördern."],["Rohstoffe zurückgewinnen","recover raw materials","Aus Altgeräten lassen sich wertvolle Rohstoffe zurückgewinnen."],["eine Wegwerfmentalität überwinden","overcome a throwaway mentality","Verbraucherbildung und reparierbare Produkte können helfen, eine Wegwerfmentalität zu überwinden."]],contrast:["Reparieren ist besser.","Ich halte ein Recht auf Reparatur für grundsätzlich sinnvoll.","Ein verpflichtendes Recht auf Reparatur erscheint insbesondere dort überzeugend, wo dadurch Produktlebenszyklen verlängert und Ressourcen geschont werden können."],nuance:{q:"Welche Formulierung passt am besten zu einer differenzierten C2-Bewertung einer Umweltmaßnahme?",o:["Das Verbot ist super und löst das Problem.","Ich finde das Verbot gut.","Die Maßnahme erscheint ökologisch sinnvoll, ihre Wirksamkeit hängt jedoch von Umsetzung und Kontrolle ab."],a:2,e:"Die Aussage bewertet die Maßnahme klar, begrenzt die Behauptung aber durch eine nachvollziehbare Bedingung."},reformulation:["Wir sollten weniger Dinge wegwerfen und mehr reparieren.","Eine stärkere Förderung von Reparatur und Wiederverwendung könnte dazu beitragen, Ressourcen zu schonen und Abfall zu vermeiden."],production:"Formuliere dieselbe Position zu einem Recht auf Reparatur informell, neutral-professionell und formal-akademisch.",challenge:"Diskutiere, wie Politik, Unternehmen und Verbraucher die Wegwerfgesellschaft begrenzen können. Nutze mindestens vier Umweltkollokationen."},`;
mastery = replaceRequired(mastery, /1:\{chapter:"1\.1"[\s\S]*?\},\n2:\{chapter:"1\.2"/, `${day1}\n2:{chapter:"1.2"`, "mastery");
fs.writeFileSync(masteryPath, mastery, "utf8");

// Course alignment: remove old Zugehörigkeit/Register collocations from Day 1.
const alignmentPath = path.join(root, "web/src/data/c2LessonContentAlignment.js");
let alignment = fs.readFileSync(alignmentPath, "utf8");
alignment = replaceRequired(alignment, /  1: \[\[[\s\S]*?\]\],\n  2:/, `  1: [["Reparierbarkeit verbessern","improve repairability","Hersteller können durch modulare Bauweisen die Reparierbarkeit ihrer Produkte verbessern."],["Materialkreisläufe schließen","close material loops","Eine funktionierende Kreislaufwirtschaft versucht, Materialkreisläufe möglichst weit zu schließen."],["Mehrwegsysteme ausbauen","expand reusable systems","Kommunen und Unternehmen können Mehrwegsysteme ausbauen und dadurch Verpackungsabfälle reduzieren."]],\n  2:`, "collocation supplements");
alignment = replaceRequired(alignment, /  1:\[[^\n]*\],\n  2:/, `  1:["Use evaluative structures to judge environmental measures precisely rather than absolutely: halten + Akk. + für + Adjektiv, erscheinen + Graduierung + Adjektiv, and sein + zu + Infinitiv for formal assessment.","Keep the environmental claim stable while changing register and strength: sinnvoll → grundsätzlich sinnvoll → nur bedingt wirksam → kritisch zu beurteilen.","Frame evaluations with concrete conditions, for example angesichts begrenzter Ressourcen, unter der Voraussetzung, dass, or sofern die Maßnahme wirksam kontrolliert wird."],\n  2:`, "grammar guidance");
fs.writeFileSync(alignmentPath, alignment, "utf8");

// Learn/Speak coach: keep the C2 skill but make every example and collocation environmental.
const coachPath = path.join(root, "web/src/components/C2Day1LearnSpeakCoach.js");
let coach = fs.readFileSync(coachPath, "utf8");
coach = coach
  .replace("Register nicht auswendig lernen – bewusst aufbauen", "Umweltmaßnahmen präzise bewerten")
  .replace("Auf C2-Niveau reicht es nicht, formelle Beispielsätze zu erkennen. Du solltest entscheiden können, <strong>wie stark</strong> du bewertest, <strong>wie viel Distanz</strong> du brauchst und <strong>welche Struktur</strong> diese Wirkung erzeugt.", "Bei Kreislaufwirtschaft und Wegwerfgesellschaft reicht es nicht, eine Maßnahme nur als gut oder schlecht zu bezeichnen. Du solltest zeigen, <strong>wie stark</strong> eine Wirkung ist, <strong>unter welchen Bedingungen</strong> sie gilt und <strong>wie sicher</strong> deine Bewertung formuliert werden kann.")
  .replace("Aussagekern → Haltung → Stärke der Bewertung → Adressat/Kontext → passende Struktur.", "Umweltmaßnahme → erwartete Wirkung → Grenze/Bedingung → Bewertungsstärke → passende Struktur.")
  .replaceAll("Ich finde diese Entscheidung problematisch.", "Ich finde Einwegprodukte problematisch.")
  .replaceAll("Ich finde den Vorschlag sinnvoll.", "Ich finde ein Recht auf Reparatur sinnvoll.")
  .replaceAll("Ich halte diese Entwicklung für problematisch.", "Ich halte hohen Rohstoffverbrauch für problematisch.")
  .replaceAll("Ich halte den Einwand für durchaus berechtigt.", "Ich halte den Einwand gegen Wegwerfprodukte für durchaus berechtigt.")
  .replaceAll("Diese Position erscheint nur bedingt überzeugend.", "Recycling als alleinige Strategie erscheint nur bedingt überzeugend.")
  .replaceAll("Der vorgeschlagene Ansatz erscheint grundsätzlich nachvollziehbar.", "Ein Recht auf Reparatur erscheint grundsätzlich nachvollziehbar.")
  .replaceAll("Diese Entwicklung ist kritisch zu beurteilen.", "Der hohe Ressourcenverbrauch ist kritisch zu beurteilen.")
  .replaceAll("Der Vorschlag ist differenziert zu betrachten.", "Ein generelles Verbot ist differenziert zu betrachten.");

const newKnowledge = `const knowledgeItems = [
  {question:"Welche Formulierung bewertet ein Recht auf Reparatur kontrolliert und klar?",options:["Reparieren ist einfach besser.","Ich halte ein Recht auf Reparatur für grundsätzlich sinnvoll.","Reparieren ist total super."],answer:"Ich halte ein Recht auf Reparatur für grundsätzlich sinnvoll.",explanation:"halten + Akkusativ + für + Adjektiv eignet sich für eine klare, sachliche Bewertung."},
  {question:"Welche Formulierung schafft die größte argumentative Distanz?",options:["Ich mag Einwegprodukte nicht.","Einwegprodukte sind blöd.","Ein weitreichendes Verbot von Einwegprodukten erscheint nur unter bestimmten Voraussetzungen wirksam."],answer:"Ein weitreichendes Verbot von Einwegprodukten erscheint nur unter bestimmten Voraussetzungen wirksam.",explanation:"erscheinen + Graduierung markiert eine distanzierte und begrenzte Bewertung."},
  {question:"Welche Kollokation passt zur Kreislaufwirtschaft?",options:["Rohstoffe zurückgewinnen","Rohstoffe zurückreden","Rohstoffe zurückstellen"],answer:"Rohstoffe zurückgewinnen",explanation:"Rohstoffe zurückgewinnen ist eine zentrale Verbindung beim Recycling und in der Kreislaufwirtschaft."},
  {question:"Welche Aussage ist am differenziertesten?",options:["Recycling löst das Müllproblem.","Recycling ist gut.","Recycling kann Ressourcen zurückgewinnen, reicht ohne Abfallvermeidung und Wiederverwendung jedoch nicht aus."],answer:"Recycling kann Ressourcen zurückgewinnen, reicht ohne Abfallvermeidung und Wiederverwendung jedoch nicht aus.",explanation:"Die Formulierung erkennt einen Nutzen an und begrenzt ihn gleichzeitig."},
];`;
coach = replaceRequired(coach, /const knowledgeItems = \[[\s\S]*?\n\];/, newKnowledge, "knowledge items");

const newCollocationSection = `<section style={panel}>\n      <h2 style={{ margin: 0 }}>Kollokationen · Kreislaufwirtschaft</h2>\n      <p style={{ margin: 0, color: "#475569" }}>Diese Verbindungen sollen in Sprechen und Schreiben aktiv wiederkehren.</p>\n      <div style={{ display: "grid", gap: 9 }}>\n        <div><strong>Ressourcen schonen</strong> → „Langlebige Produkte können natürliche Ressourcen schonen.“</div>\n        <div><strong>Abfall vermeiden</strong> → „Mehrwegsysteme helfen, unnötigen Abfall zu vermeiden.“</div>\n        <div><strong>Produkte länger nutzen</strong> → „Ein Recht auf Reparatur kann dazu beitragen, Produkte länger zu nutzen.“</div>\n        <div><strong>Reparaturen fördern</strong> → „Steuerliche Anreize könnten Reparaturen gezielt fördern.“</div>\n        <div><strong>Rohstoffe zurückgewinnen</strong> → „Aus Altgeräten lassen sich wertvolle Rohstoffe zurückgewinnen.“</div>\n        <div><strong>eine Wegwerfmentalität überwinden</strong> → „Bessere Produktstandards können helfen, eine Wegwerfmentalität zu überwinden.“</div>\n      </div>\n    </section>`;
coach = replaceRequired(coach, /<section style=\{panel\}>\n      <h2 style=\{\{ margin: 0 \}\}>Kollokationen funktional einsetzen<\/h2>[\s\S]*?<\/section>/, newCollocationSection, "collocation section");
coach = coach.replace("Passt du deine Sprache an unterschiedliche Menschen oder Situationen an? Ist das soziale Kompetenz, Konformität oder beides?", "Wie können Politik, Unternehmen und Verbraucher gemeinsam die Wegwerfgesellschaft begrenzen?");

const newBranches = `const speakingBranches = [
  {title:"Politische Regeln",ideas:["Recht auf Reparatur","Ökodesign","Mehrweg","Anreize"],prompt:"Welche Regeln können langlebigen Konsum fördern?",example:"Politische Vorgaben können Reparaturen fördern, wenn Ersatzteile verfügbar und Produkte tatsächlich reparierbar sind.",starter:"Auf politischer Ebene halte ich insbesondere ... für sinnvoll, weil ..."},
  {title:"Unternehmen",ideas:["Produktlebensdauer","Ersatzteile","modulare Bauweise","Transparenz"],prompt:"Wie können Hersteller Ressourcenverbrauch verringern?",example:"Unternehmen können Materialkreisläufe besser schließen, indem sie Produkte langlebiger und leichter reparierbar gestalten.",starter:"Von den Herstellern wäre vor allem zu verlangen, dass ..."},
  {title:"Verbraucher",ideas:["Kaufverhalten","Reparatur","Secondhand","Mehrweg"],prompt:"Wie viel Verantwortung liegt bei Konsumenten?",example:"Verbraucher können Produkte länger nutzen und Abfall vermeiden; ihre Möglichkeiten hängen jedoch auch vom Angebot ab.",starter:"Verbraucher tragen durchaus Verantwortung, allerdings ..."},
  {title:"Recycling oder Vermeidung",ideas:["Wiederverwendung","Reparatur","Rohstoffe","Abfallhierarchie"],prompt:"Warum reicht Recycling allein nicht?",example:"Recycling kann Rohstoffe zurückgewinnen, verhindert aber nicht automatisch hohen Material- und Energieverbrauch.",starter:"Recycling ist zwar unverzichtbar, greift jedoch zu kurz, wenn ..."},
  {title:"Fazit",ideas:["geteilte Verantwortung","Regeln","Anreize","Alltagstauglichkeit"],prompt:"Wie lässt sich die Wegwerfgesellschaft realistisch begrenzen?",example:"Eine Kreislaufwirtschaft funktioniert am ehesten, wenn politische Regeln, verantwortungsvolle Produktion und alltagstaugliche Konsumentscheidungen ineinandergreifen.",starter:"Zusammenfassend erscheint mir ein Ansatz überzeugend, der ..."},
];`;
coach = replaceRequired(coach, /const speakingBranches = \[[\s\S]*?\n\];/, newBranches, "speaking branches");

if (/Zugehörigkeit vermitteln|soziale Identität|Dialekt|Gruppensprache/.test(coach)) throw new Error("C2 Day 1 still contains old Kultur/Zugehörigkeit content.");
fs.writeFileSync(coachPath, coach, "utf8");

console.log("C2 Day 1 aligned with Umwelt/Kreislaufwirtschaft across grammar, collocations, Learn and Speak.");
await import("./patchC2Day1C1LearningMechanics.mjs");
