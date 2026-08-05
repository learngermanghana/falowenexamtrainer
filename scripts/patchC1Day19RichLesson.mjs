import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const guidedPath = path.join(root, "web/src/components/C1Day18To20GuidedLessonPage.js");
const grammarPath = path.join(root, "web/src/components/C1Day18To20GrammarNotes.js");

const replaceOnce = (source, pattern, replacement, label) => {
  if (source.includes(replacement)) return source;
  const next = source.replace(pattern, replacement);
  if (next === source) throw new Error(`Could not patch ${label}`);
  return next;
};

let guided = fs.readFileSync(guidedPath, "utf8");

const promptBlock = `const dayPrompts = {
  18: {
    speakingQuestion: "Was stärkt den gesellschaftlichen Zusammenhalt, und wie kann soziale Spaltung verhindert werden?",
    speakingIdeas: [
      "gerechter Zugang zu Bildung und Arbeit",
      "politische und gesellschaftliche Teilhabe",
      "Begegnung zwischen unterschiedlichen Gruppen",
      "Bekämpfung von Diskriminierung und sozialer Ausgrenzung",
      "Verantwortung von Staat, Schulen, Medien und Bürgern",
    ],
    writingQuestion: "Verfassen Sie eine C1-Stellungnahme zum Thema gesellschaftlicher Zusammenhalt mit 220–280 Wörtern.",
    writingIdeas: [
      "Erklären Sie, welche Bedeutung gesellschaftlicher Zusammenhalt für eine demokratische Gesellschaft hat.",
      "Argumentieren Sie anhand eines konkreten Beispiels für eine Maßnahme, die gesellschaftlichen Zusammenhalt stärken kann.",
      "Nennen Sie Gründe oder Einwände, die gegen stärkere staatliche Maßnahmen sprechen könnten.",
      "Erläutern Sie eine Alternative oder einen ausgewogenen Lösungsweg zur Förderung des gesellschaftlichen Zusammenhalts.",
    ],
  },
  19: {
    speakingQuestion: "Wie wird sich die Arbeitswelt durch Digitalisierung und Automatisierung verändern, und wie sollten Beschäftigte, Unternehmen und der Staat darauf reagieren?",
    speakingIdeas: [
      "Automatisierung von Routinetätigkeiten und Entstehung neuer Berufsfelder",
      "Bedeutung digitaler, sozialer und kreativer Kompetenzen",
      "Chancen und Grenzen von Homeoffice und hybriden Arbeitsmodellen",
      "Risiko von Überforderung, Arbeitsplatzverlust und sozialer Ungleichheit",
      "Weiterbildung als gemeinsame Verantwortung von Beschäftigten, Unternehmen und Staat",
      "Recht auf Nichterreichbarkeit und faire Regeln für flexible Arbeit",
    ],
    writingQuestion: "Verfassen Sie eine C1-Stellungnahme zum Thema: Sollten Unternehmen verpflichtet werden, ihre Beschäftigten regelmäßig für die Arbeit der Zukunft weiterzubilden? Schreiben Sie 220–280 Wörter.",
    writingIdeas: [
      "Erklären Sie, warum Weiterbildung in einer zunehmend digitalisierten Arbeitswelt an Bedeutung gewinnt.",
      "Argumentieren Sie anhand eines konkreten Beispiels für eine berufliche Weiterbildung oder Umschulung.",
      "Nennen Sie Gründe oder Einwände, die gegen eine Weiterbildungspflicht für Unternehmen sprechen könnten.",
      "Erläutern Sie eine Alternative oder einen ausgewogenen Lösungsweg zur Finanzierung und Organisation beruflicher Weiterbildung.",
    ],
  },
};`;

guided = replaceOnce(
  guided,
  /const day18Prompts = \{[\s\S]*?\n\};\n\nconst embedUrl/,
  `${promptBlock}\n\nconst embedUrl`,
  "C1 Day 18 and 19 prompt map",
);

guided = replaceOnce(
  guided,
  '  const speakingQuestion = day === 18 ? day18Prompts.speakingQuestion : (lesson.speakingBuilder?.question || lesson.speakingTopic || lesson.topic);',
  '  const prompts = dayPrompts[day] || null;\n  const speakingQuestion = prompts?.speakingQuestion || lesson.speakingBuilder?.question || lesson.speakingTopic || lesson.topic;',
  "C1 prompt selection",
);

guided = replaceOnce(
  guided,
  '{day === 18 ? <div><strong>Ideen für deine Antwort:</strong><ul style={listStyle}>{day18Prompts.speakingIdeas.map((idea) => <li key={idea}>{idea}</li>)}</ul></div> : null}',
  '{prompts?.speakingIdeas?.length ? <div><strong>Ideen für deine Antwort:</strong><ul style={listStyle}>{prompts.speakingIdeas.map((idea) => <li key={idea}>{idea}</li>)}</ul></div> : null}',
  "C1 Day 19 speaking ideas",
);

guided = replaceOnce(
  guided,
  '{day === 18 ? <><NoteBox tone="amber"><strong>Schreibaufgabe:</strong> {day18Prompts.writingQuestion}</NoteBox><div><strong>Bearbeiten Sie diese Punkte:</strong><ol style={listStyle}>{day18Prompts.writingIdeas.map((idea) => <li key={idea}>{idea}</li>)}</ol></div></> : <WritingTaskPrompt lesson={lesson} />}',
  '{prompts?.writingQuestion ? <><NoteBox tone="amber"><strong>Schreibaufgabe:</strong> {prompts.writingQuestion}</NoteBox><div><strong>Bearbeiten Sie diese Punkte:</strong><ol style={listStyle}>{prompts.writingIdeas.map((idea) => <li key={idea}>{idea}</li>)}</ol></div></> : <WritingTaskPrompt lesson={lesson} />}',
  "C1 Day 19 writing question",
);

fs.writeFileSync(guidedPath, guided, "utf8");

let grammar = fs.readFileSync(grammarPath, "utf8");
const richDay19 = `  19: {
    title: "Zukunftsprognosen, Modalpassiv und differenzierte Abwägung bei Arbeit der Zukunft",
    subtitle: "Digitalisierung, Automatisierung, Weiterbildung und flexible Arbeitsmodelle präzise bewerten",
    why: "Beim Thema Arbeit der Zukunft musst du Entwicklungen prognostizieren, Unsicherheit sprachlich markieren und politische oder betriebliche Maßnahmen abwägen. C1 verlangt deshalb mehr als einfache Futursätze: Du brauchst vorsichtige Prognosen, Modalpassiv, konzessive Strukturen und klare Bedingungen.",
    goals: [
      "sichere und unsichere Prognosen mit werden, dürfte, könnte und voraussichtlich unterscheiden",
      "Notwendigkeit und Verantwortung mit Modalpassiv ausdrücken",
      "Chancen und Risiken mit während, wohingegen, allerdings und sofern abwägen",
      "Bedingungen für faire Weiterbildung und flexible Arbeit präzise formulieren",
      "allgemeine Behauptungen durch konkrete Beispiele einschränken und belegen",
    ],
    rows: [
      ["werden + Infinitiv", "Hybride Arbeitsmodelle werden in vielen Branchen weiter an Bedeutung gewinnen."],
      ["dürfte / könnte", "Vor allem standardisierte Tätigkeiten dürften künftig stärker automatisiert werden."],
      ["Modalpassiv", "Beschäftigte müssen frühzeitig weitergebildet und bei beruflichen Übergängen unterstützt werden."],
      ["während / wohingegen", "Während digitale Werkzeuge Prozesse beschleunigen, können sie zugleich den Leistungsdruck erhöhen."],
      ["sofern / vorausgesetzt, dass", "Flexible Arbeit ist sinnvoll, sofern Arbeitszeiten und Erreichbarkeit transparent geregelt sind."],
      ["zwar … jedoch", "Automatisierung kann zwar die Produktivität steigern, jedoch ersetzt sie nicht jede menschliche Kompetenz."],
      ["Nominalisierung", "die kontinuierliche Weiterbildung der Beschäftigten; die zunehmende Automatisierung von Routinetätigkeiten"],
    ],
    model: "Die Arbeitswelt dürfte sich in den kommenden Jahren tiefgreifend verändern. Während standardisierte Tätigkeiten zunehmend automatisiert werden, gewinnen kreative, soziale und digitale Kompetenzen an Bedeutung. Beschäftigte müssen daher nicht nur fachlich weitergebildet, sondern auch bei beruflichen Übergängen unterstützt werden. Eine Weiterbildungspflicht für Unternehmen kann zwar Kosten verursachen, jedoch trägt sie dazu bei, Fachkräfte zu sichern und soziale Ungleichheit zu begrenzen. Flexible Arbeitsmodelle sind ebenfalls sinnvoll, sofern Arbeitszeiten, Datenschutz und das Recht auf Nichterreichbarkeit verbindlich geregelt werden. Entscheidend ist somit nicht, technischen Wandel aufzuhalten, sondern ihn sozial ausgewogen zu gestalten.",
    checks: [
      ["Formuliere eine vorsichtige Prognose: Viele Routinetätigkeiten werden automatisiert.", "Viele Routinetätigkeiten dürften künftig automatisiert werden."],
      ["Aktiv zu Modalpassiv: Unternehmen müssen Beschäftigte weiterbilden.", "Beschäftigte müssen von Unternehmen weitergebildet werden."],
      ["Verbinde mit während: Technik steigert Effizienz. Technik erhöht den Leistungsdruck.", "Während Technik die Effizienz steigert, kann sie zugleich den Leistungsdruck erhöhen."],
      ["Formuliere eine Bedingung mit sofern.", "Homeoffice ist sinnvoll, sofern Arbeitszeiten und Erreichbarkeit klar geregelt sind."],
      ["Nominalisiere: Beschäftigte werden kontinuierlich weitergebildet.", "die kontinuierliche Weiterbildung der Beschäftigten"],
    ],
  },`;

grammar = replaceOnce(
  grammar,
  /  19: \{[\s\S]*?\n  \},\n  20:/,
  `${richDay19}\n  20:`,
  "rich C1 Day 19 grammar",
);
fs.writeFileSync(grammarPath, grammar, "utf8");

console.log("Upgraded C1 Day 19 writing, speaking ideas, and grammar notes.");
