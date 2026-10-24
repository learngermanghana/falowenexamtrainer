import React, { useEffect, useMemo, useState } from "react";
import { styles } from "../styles";

const panel = { border: "1px solid #c7d2fe", borderRadius: 14, padding: 14, background: "#eef2ff", display: "grid", gap: 10 };
const card = { ...styles.card, display: "grid", gap: 12, border: "1px solid #dbeafe", borderRadius: 16 };
const list = { margin: 0, paddingLeft: 22, lineHeight: 1.75 };
const optionStyle = ({ selected, correct, reveal }) => ({ width: "100%", textAlign: "left", padding: "12px 14px", borderRadius: 14, border: `1px solid ${selected ? (correct ? "#22c55e" : "#ef4444") : reveal ? "#86efac" : "#dbe3ef"}`, background: selected ? (correct ? "#dcfce7" : "#fee2e2") : reveal ? "#f0fdf4" : "#fff", color: "#0f172a", cursor: "pointer", font: "inherit", fontWeight: selected || reveal ? 800 : 650 });

const DATA = {
  6: {
    title: "Kausalität sprachlich abstufen",
    intro: "Auf C2-Niveau musst du zuerst klären, wie stark der belegte Zusammenhang wirklich ist. Erst danach wählst du das Verb. Ein Zusammenhang ist noch keine Ursache.",
    patterns: [
      ["Zusammenhang", "Hohe Wohnkosten stehen mit finanzieller Belastung in Zusammenhang.", "A + steht mit + Dat. + in Zusammenhang"],
      ["Begünstigender Faktor", "Hohe Wohnkosten können finanzielle Belastungen verstärken.", "A + kann + B + verstärken/begünstigen"],
      ["Stärkere Kausalität", "Eine dauerhafte Einkommensminderung kann Kaufkraftverluste zur Folge haben.", "A + kann + B + zur Folge haben"],
    ],
    build: ["Beobachtung von Ursache trennen.", "Stärke des Zusammenhangs bestimmen.", "Mögliche weitere Faktoren benennen.", "Passendes Kausalverb wählen.", "Absolute Aussagen vermeiden, wenn die Evidenz sie nicht trägt."],
    questions: [
      { q: "Welche Formulierung ist angemessen, wenn nur ein Zusammenhang belegt ist?", o: ["A verursacht B.", "A steht mit B in Zusammenhang.", "A beweist B."], a: 1, e: "Ein Zusammenhang rechtfertigt noch keine kausale Behauptung." },
      { q: "Welche Formulierung ist vorsichtiger?", o: ["Ungleichheit führt immer zu schlechter Bildung.", "Ungleichheit kann Bildungschancen beeinträchtigen.", "Ungleichheit beweist schlechte Bildung."], a: 1, e: "kann markiert eine mögliche Wirkung, ohne absolute Kausalität zu behaupten." },
      { q: "Was gehört zu einer sauberen Kausalanalyse?", o: ["Nur ein starkes Verb.", "Ursache, Mechanismus und mögliche weitere Faktoren.", "Möglichst viele Fachwörter."], a: 1, e: "C2 verlangt differenzierte Erklärung statt Übertreibung." },
    ],
    speakQuestion: "Ist wirtschaftliche Ungleichheit überwiegend individuell oder strukturell bedingt?",
    branches: [
      ["Strukturelle Faktoren", ["Bildungszugang", "Wohnkosten", "Arbeitsmarkt", "soziale Herkunft"], "Welche Strukturen können Ungleichheit begünstigen?", "Ungleiche Ausgangsbedingungen können langfristig dazu beitragen, dass Chancen ungleich verteilt bleiben.", "Strukturell betrachtet ist insbesondere zu berücksichtigen, dass ..."],
      ["Individuelle Entscheidungen", ["Ausbildung", "Konsum", "Berufswahl", "Risikobereitschaft"], "Welche Rolle spielen persönliche Entscheidungen?", "Individuelle Entscheidungen wirken mit, erklären soziale Unterschiede jedoch nicht vollständig.", "Auf individueller Ebene lässt sich zwar feststellen, dass ..., allerdings ..."],
      ["Wechselwirkung", ["Struktur + Handlung", "Ressourcen", "Möglichkeiten", "Grenzen"], "Wie beeinflussen sich Struktur und individuelles Handeln gegenseitig?", "Handlungsspielräume hängen häufig von Ressourcen und institutionellen Bedingungen ab.", "Von einer bloß individuellen Ursache zu sprechen, greift daher zu kurz, weil ..."],
      ["Politische Maßnahmen", ["Steuern", "Bildung", "Wohnungsbau", "Sozialpolitik"], "Welche Maßnahmen könnten strukturelle Nachteile mindern?", "Gezielte Investitionen können bestehende Nachteile abschwächen, ohne jede Ungleichheit vollständig zu beseitigen.", "Ein wirksamer Ansatz müsste dort ansetzen, wo ..."],
      ["Differenziertes Fazit", ["mehrere Ursachen", "keine Monokausalität", "Kontext", "Abwägung"], "Welche Schlussposition ist tragfähig?", "Ungleichheit entsteht meist aus dem Zusammenwirken individueller und struktureller Faktoren.", "Zusammenfassend spricht vieles dafür, Ungleichheit als Ergebnis eines komplexen Zusammenspiels zu betrachten."],
    ],
  },
  7: {
    title: "Funktionsverbgefüge idiomatisch einsetzen",
    intro: "C2 heißt nicht, einfache Verben systematisch zu ersetzen. Nutze Funktionsverbgefüge nur dort, wo die Verbindung fest, idiomatisch und stilistisch passend ist.",
    patterns: [
      ["Direktes Verb", "Die Leitung prüft eine Änderung.", "Subjekt + Verb + Objekt"],
      ["Funktionsverbgefüge", "Die Leitung zieht eine Änderung in Betracht.", "Subjekt + feste Nomen-Verb-Verbindung"],
      ["Weitere feste Verbindung", "Führungskräfte übernehmen Verantwortung für transparente Prozesse.", "Verantwortung übernehmen für + Akk."],
    ],
    build: ["Bedeutung zuerst einfach ausdrücken.", "Prüfen, ob eine feste Verbindung existiert.", "Kasus und Präposition kontrollieren.", "Register prüfen.", "Unnötig bürokratische Formulierungen wieder vereinfachen."],
    questions: [
      { q: "Welches Funktionsverbgefüge ist korrekt?", o: ["Einfluss machen auf", "Einfluss nehmen auf", "Einfluss geben zu"], a: 1, e: "Einfluss nehmen auf + Akk. ist die feste Verbindung." },
      { q: "Welche Formulierung ist idiomatisch?", o: ["Verantwortung nehmen für", "Verantwortung übernehmen für", "Verantwortung tun für"], a: 1, e: "Verantwortung übernehmen für ist die etablierte Verbindung." },
      { q: "Wann sollte man ein Funktionsverbgefüge vermeiden?", o: ["Wenn es nur komplizierter klingt, aber keinen stilistischen Nutzen hat.", "Immer in formellen Texten.", "Wenn ein Nomen vorkommt."], a: 0, e: "C2 bedeutet stilistische Kontrolle, nicht maximale Nominalität." },
    ],
    speakQuestion: "Schafft die moderne Arbeitswelt mehr Autonomie oder mehr Leistungsdruck?",
    branches: [
      ["Mehr Autonomie", ["Homeoffice", "Flexibilität", "Eigenverantwortung", "Handlungsspielraum"], "Welche Vorteile entstehen durch mehr Selbstständigkeit?", "Flexible Arbeitsmodelle können Beschäftigten größeren Handlungsspielraum eröffnen.", "Für eine Zunahme an Autonomie spricht insbesondere, dass ..."],
      ["Leistungsdruck", ["Erreichbarkeit", "Verdichtung", "Ziele", "Selbstoptimierung"], "Warum kann Autonomie gleichzeitig Druck erhöhen?", "Wenn Verantwortung wächst, ohne Ressourcen mitzuwachsen, kann die Belastung steigen.", "Demgegenüber ist zu berücksichtigen, dass ..."],
      ["Unternehmensverantwortung", ["Maßnahmen ergreifen", "Unterstützung", "Führung", "Gesundheit"], "Welche Verantwortung tragen Arbeitgeber?", "Arbeitgeber sollten Maßnahmen ergreifen, um dauerhafte Überlastung zu vermeiden.", "Unternehmen stehen daher in der Verantwortung, ..."],
      ["Neue Regeln", ["Arbeitszeit", "Weiterbildung", "Mitbestimmung", "Transparenz"], "Welche Regeln könnten helfen?", "Klare Vereinbarungen können Flexibilität sichern und zugleich Grenzen setzen.", "In Betracht zu ziehen wäre beispielsweise ..."],
      ["Abgewogene Position", ["Branche", "Person", "Aufgabe", "Rahmenbedingungen"], "Warum gibt es keine einfache Antwort?", "Ob Autonomie oder Druck überwiegt, hängt stark von den konkreten Rahmenbedingungen ab.", "Eine pauschale Bewertung greift zu kurz, da ..."],
    ],
  },
  8: {
    title: "Partizipialattribute lesbar aufbauen",
    intro: "Erweiterte Partizipialattribute verdichten Information. Sie sind nur dann sinnvoll, wenn der Kern des Nomens weiterhin schnell erkennbar bleibt.",
    patterns: [
      ["Relativsatz", "Die Systeme, die mit großen Datenmengen trainiert wurden, können Verzerrungen reproduzieren.", "Nomen + Relativsatz"],
      ["Partizipialattribut", "Die mit großen Datenmengen trainierten Systeme können Verzerrungen reproduzieren.", "Artikel + Erweiterung + Partizip II + Adjektivendung + Nomen"],
      ["Partizip I", "Die Entscheidungen treffenden Systeme benötigen transparente Regeln.", "Erweiterung + Partizip I + Adjektivendung + Nomen"],
    ],
    build: ["Kernnomen bestimmen.", "Relativsatz zunächst vollständig formulieren.", "Verb in Partizip I oder II umwandeln.", "Erweiterungen vor das Partizip setzen.", "Adjektivendung und Lesbarkeit prüfen."],
    questions: [
      { q: "Welche Formulierung ist ein korrektes Partizipialattribut?", o: ["die mit Daten trainieren Systeme", "die mit Daten trainierten Systeme", "die Systeme mit Daten trainierten"], a: 1, e: "Das Partizip II wird wie ein Adjektiv dekliniert." },
      { q: "Wann ist ein Relativsatz oft besser?", o: ["Wenn das Attribut sehr lang und schwer zu verarbeiten wird.", "Wenn der Text C2 ist.", "Wenn das Nomen kurz ist."], a: 0, e: "Lesbarkeit bleibt wichtiger als maximale Verdichtung." },
      { q: "Was sollte zuerst formuliert werden?", o: ["Die längste Nominalgruppe.", "Eine klare Relativsatz-Version.", "Ein beliebiges Partizip."], a: 1, e: "Der Relativsatz macht die Bedeutungsbeziehung zuerst transparent." },
    ],
    speakQuestion: "Sollten Entscheidungen durch künstliche Intelligenz stärker automatisiert werden?",
    branches: [
      ["Effizienz", ["Geschwindigkeit", "Skalierung", "Routineentscheidungen", "Kosten"], "Wo kann Automatisierung sinnvoll sein?", "Bei klar standardisierten Routineentscheidungen kann Automatisierung Prozesse beschleunigen.", "Für eine stärkere Automatisierung spricht vor allem, dass ..."],
      ["Verzerrungen", ["Trainingsdaten", "Diskriminierung", "Fehler", "Bias"], "Welche Risiken entstehen durch verzerrte Daten?", "Mit einseitigen Daten trainierte Systeme können bestehende Ungleichheiten reproduzieren.", "Problematisch sind insbesondere die auf verzerrten Datengrundlagen beruhenden Entscheidungen, weil ..."],
      ["Transparenz", ["Nachvollziehbarkeit", "Erklärung", "Kontrolle", "Verantwortung"], "Warum müssen Entscheidungen erklärbar sein?", "Betroffene sollten nachvollziehen können, auf welcher Grundlage eine Entscheidung zustande kam.", "Eine zentrale Voraussetzung besteht darin, dass ..."],
      ["Menschliche Kontrolle", ["Grenzfälle", "Ethik", "Verantwortung", "Überprüfung"], "Wo sollte der Mensch entscheiden?", "Bei folgenreichen Einzelfällen sollte eine menschliche Überprüfung vorgesehen sein.", "Je weitreichender die Folgen einer Entscheidung sind, desto wichtiger ist ..."],
      ["Differenzierte Lösung", ["hybrides Modell", "Risiko", "Kontext", "Kontrolle"], "Wie könnte ein ausgewogener Ansatz aussehen?", "Ein hybrides Modell verbindet automatisierte Vorprüfung mit menschlicher Letztentscheidung.", "Ein tragfähiger Mittelweg könnte darin bestehen, ..."],
    ],
  },
  9: {
    title: "Passivform nach Funktion wählen",
    intro: "Bevor du werden-Passiv, sich lassen, sein + zu oder ein -bar-Adjektiv verwendest, kläre die Funktion: Prozess, Möglichkeit, Pflicht oder Eigenschaft.",
    patterns: [
      ["Prozess", "Die Daten werden verschlüsselt.", "werden + Partizip II"],
      ["Möglichkeit", "Die Daten lassen sich verschlüsseln.", "sich lassen + Infinitiv"],
      ["Pflicht / formelle Notwendigkeit", "Die Daten sind zu verschlüsseln.", "sein + zu + Infinitiv"],
      ["Eigenschaft", "Die Daten sind verschlüsselbar.", "Adjektiv auf -bar"],
    ],
    build: ["Funktion bestimmen.", "Akteur bewusst ein- oder ausblenden.", "Passivform wählen.", "Bedeutungsunterschied prüfen.", "Nicht nur zur Variation umformulieren."],
    questions: [
      { q: "Welche Form drückt vor allem Möglichkeit aus?", o: ["Die Daten werden gelöscht.", "Die Daten lassen sich löschen.", "Die Daten sind zu löschen."], a: 1, e: "sich lassen + Infinitiv bezeichnet typischerweise eine Möglichkeit." },
      { q: "Welche Form kann eine formelle Pflicht ausdrücken?", o: ["Die Daten sind zu schützen.", "Die Daten sind schützbar.", "Die Daten lassen sich schützen."], a: 0, e: "sein + zu kann Notwendigkeit oder Verpflichtung ausdrücken." },
      { q: "Warum sind löschbar und ist zu löschen nicht identisch?", o: ["Weil -bar eher eine Eigenschaft/Möglichkeit ausdrückt, sein + zu aber auch Pflicht bedeuten kann.", "Sie sind völlig identisch.", "Weil nur -bar formell ist."], a: 0, e: "Die Formen unterscheiden sich funktional." },
    ],
    speakQuestion: "Wie viel Kontrolle sollten Nutzerinnen und Nutzer über ihre persönlichen Daten haben?",
    branches: [
      ["Rechte der Nutzenden", ["Auskunft", "Löschung", "Einwilligung", "Kontrolle"], "Welche Rechte sind zentral?", "Nutzende sollten nachvollziehen können, welche Daten gespeichert und verarbeitet werden.", "Aus Sicht der Betroffenen ist zunächst zu gewährleisten, dass ..."],
      ["Pflichten der Anbieter", ["Datenschutz", "Sicherheit", "Transparenz", "Minimierung"], "Welche Pflichten haben Unternehmen?", "Personenbezogene Daten sind angemessen zu schützen und nur zweckgebunden zu verarbeiten.", "Anbieter sind insbesondere dazu verpflichtet, ..."],
      ["Technische Möglichkeiten", ["Verschlüsselung", "Löschung", "Pseudonymisierung", "Zugriff"], "Welche technischen Lösungen helfen?", "Sensible Daten lassen sich durch Verschlüsselung und Zugriffsbeschränkungen besser schützen.", "Technisch lässt sich der Schutz unter anderem dadurch verbessern, dass ..."],
      ["Grenzen individueller Kontrolle", ["Komplexität", "Einwilligung", "Abhängigkeit", "Plattformen"], "Kann jede Person ihre Daten vollständig kontrollieren?", "Bei komplexen Plattformen reicht individuelle Einwilligung allein häufig nicht aus.", "Allerdings wäre es verkürzt anzunehmen, dass ..."],
      ["Ausgewogene Regelung", ["Standards", "Aufsicht", "Nutzerrechte", "Innovation"], "Wie könnte ein tragfähiges Modell aussehen?", "Klare gesetzliche Mindeststandards sollten individuelle Wahlmöglichkeiten ergänzen.", "Ein ausgewogener Ansatz müsste daher ..."],
    ],
  },
  10: {
    title: "Evidenz und Wahrscheinlichkeit kalibrieren",
    intro: "Medizinische Aussagen brauchen sprachliche Vorsicht. Trenne Beobachtung, plausible Folgerung, hohe Wahrscheinlichkeit und Bewertung, bevor du Modalformen wählst.",
    patterns: [
      ["Möglichkeit", "Die Behandlung könnte wirksam sein.", "könnte + Infinitiv"],
      ["Hohe Wahrscheinlichkeit", "Die Behandlung dürfte wirksam sein.", "dürfte + Infinitiv"],
      ["Starke Schlussfolgerung", "Die Ursache muss in einem anderen Faktor liegen.", "muss + Infinitiv"],
    ],
    build: ["Quelle der Evidenz bestimmen.", "Sicherheitsgrad einschätzen.", "Passende Modalform wählen.", "Eigene ethische Bewertung getrennt formulieren.", "Grenzen der Aussage ausdrücklich nennen."],
    questions: [
      { q: "Welche Formulierung drückt eine hohe Wahrscheinlichkeit aus?", o: ["Die Therapie könnte wirken.", "Die Therapie dürfte wirken.", "Die Therapie wirkt sicher."], a: 1, e: "dürfte signalisiert eine relativ hohe Wahrscheinlichkeit." },
      { q: "Wann ist muss als Schlussfolgerung angemessen?", o: ["Wenn die Evidenz eine sehr starke Schlussfolgerung nahelegt.", "Bei jeder Vermutung.", "Nur bei gesetzlichen Pflichten."], a: 0, e: "Subjektives muss kann eine stark begründete Schlussfolgerung markieren." },
      { q: "Was sollte zusätzlich genannt werden, wenn die Datenlage begrenzt ist?", o: ["Die Unsicherheit oder Grenze der Aussage.", "Nur das stärkste Modalverb.", "Keine Quelle."], a: 0, e: "C2 zeigt auch, was noch nicht gesichert ist." },
    ],
    speakQuestion: "Wie sollten medizinische Entscheidungen getroffen werden, wenn die Evidenzlage unsicher ist?",
    branches: [
      ["Evidenzlage", ["Studien", "Datenqualität", "Erfahrung", "Unsicherheit"], "Welche Evidenz liegt tatsächlich vor?", "Eine einzelne Studie kann Hinweise liefern, reicht aber nicht immer für eine eindeutige Empfehlung aus.", "Zunächst ist danach zu fragen, wie belastbar ..."],
      ["Nutzen und Risiko", ["Nebenwirkungen", "Erfolgsaussicht", "Dringlichkeit", "Alternativen"], "Wie sollten Nutzen und Risiken gewichtet werden?", "Je unsicherer die Wirksamkeit ist, desto sorgfältiger müssen mögliche Risiken berücksichtigt werden.", "Die Entscheidung sollte davon abhängen, in welchem Verhältnis ..."],
      ["Patientenautonomie", ["Einwilligung", "Aufklärung", "Werte", "Präferenzen"], "Welche Rolle spielt die betroffene Person?", "Bei unsicherer Evidenz gewinnt eine transparente Aufklärung besondere Bedeutung.", "Gerade unter Unsicherheit ist sicherzustellen, dass ..."],
      ["Ärztliche Verantwortung", ["Empfehlung", "Vorsicht", "Leitlinien", "Einzelfall"], "Wie weit darf eine ärztliche Empfehlung gehen?", "Eine Empfehlung sollte den Evidenzgrad deutlich machen und individuelle Faktoren berücksichtigen.", "Eine vertretbare Empfehlung setzt voraus, dass ..."],
      ["Abgewogene Lösung", ["gemeinsame Entscheidung", "Monitoring", "Anpassung", "Transparenz"], "Wie könnte praktisch entschieden werden?", "Eine gemeinsame Entscheidung mit regelmäßiger Überprüfung kann Unsicherheit besser auffangen.", "Unter diesen Bedingungen erscheint ein Vorgehen sinnvoll, bei dem ..."],
    ],
  },
  11: {
    title: "Einräumen und dennoch argumentieren",
    intro: "Eine starke C2-Argumentation erkennt berechtigte Gegenargumente an, ohne die eigene Position aufzugeben. Entscheidend ist, was du einräumst und was du trotzdem verteidigst.",
    patterns: [
      ["Nebensatz", "Wenngleich die Maßnahme kurzfristig teuer ist, kann sie langfristig Kosten senken.", "wenngleich + Nebensatz, Hauptsatz"],
      ["Präpositional", "Ungeachtet der kurzfristigen Kosten bleibt die Maßnahme sinnvoll.", "ungeachtet + Genitiv"],
      ["Nominales Einräumen", "Bei aller berechtigten Kritik bleibt festzuhalten, dass ...", "bei aller + Dat. + Hauptaussage"],
      ["Direkter Gegensatz", "Während Ansatz A kurzfristig günstiger ist, bietet Ansatz B langfristige Vorteile.", "während/wohingegen + Kontrast"],
    ],
    build: ["Berechtigten Einwand auswählen.", "Einräumen sprachlich markieren.", "Eigene Hauptthese deutlich anschließen.", "Kontrast oder Folge erklären.", "Prüfen, ob das Gegenargument die Hauptposition nicht versehentlich ersetzt."],
    questions: [
      { q: "Welche Formulierung räumt einen Einwand ein und hält die Hauptposition aufrecht?", o: ["Die Maßnahme ist teuer. Ende.", "Wenngleich die Maßnahme teuer ist, bleibt sie langfristig sinnvoll.", "Die Maßnahme ist teuer und deshalb immer falsch."], a: 1, e: "wenngleich markiert das Zugeständnis, der Hauptsatz enthält die verteidigte Position." },
      { q: "Welche Konstruktion ist korrekt?", o: ["ungeachtet die Kosten", "ungeachtet der Kosten", "ungeachtet den Kosten"], a: 1, e: "ungeachtet wird standardsprachlich mit Genitiv verwendet." },
      { q: "Was ist das Ziel einer Konzession?", o: ["Das Gegenargument vollständig zu übernehmen.", "Einen berechtigten Punkt anzuerkennen und die eigene These differenziert weiterzuführen.", "Mehr Konnektoren zu verwenden."], a: 1, e: "Die Konzession stärkt eine differenzierte Argumentation." },
    ],
    speakQuestion: "Wie weit darf Klimaschutz gehen, wenn Maßnahmen kurzfristig hohe wirtschaftliche oder soziale Kosten verursachen?",
    branches: [
      ["Kosten anerkennen", ["Preise", "Arbeitsplätze", "Investitionen", "Belastung"], "Welche realen Kosten müssen eingeräumt werden?", "Bestimmte Maßnahmen können Haushalte und Unternehmen kurzfristig erheblich belasten.", "Bei aller Notwendigkeit konsequenten Klimaschutzes ist einzuräumen, dass ..."],
      ["Langfristige Kosten", ["Klimaschäden", "Gesundheit", "Infrastruktur", "Anpassung"], "Welche Kosten entstehen beim Nichtstun?", "Unterlassener Klimaschutz kann langfristig deutlich höhere gesellschaftliche Kosten verursachen.", "Dem kurzfristigen Aufwand stehen langfristige Risiken gegenüber, die ..."],
      ["Soziale Fairness", ["Ausgleich", "Einkommen", "Förderung", "Verteilung"], "Wie können Belastungen fair verteilt werden?", "Klimapolitik verliert Akzeptanz, wenn einkommensschwache Haushalte überproportional belastet werden.", "Ein tragfähiger Ansatz müsste daher gewährleisten, dass ..."],
      ["Wirtschaftlicher Wandel", ["Innovation", "Arbeitsplätze", "Planungssicherheit", "Transformation"], "Sind Klimaschutz und Wirtschaft Gegensätze?", "Langfristige Planung kann Investitionen in klimafreundliche Technologien fördern.", "Wenngleich einzelne Branchen unter Anpassungsdruck geraten, ..."],
      ["Abgewogenes Fazit", ["Tempo", "Fairness", "Wirksamkeit", "Übergang"], "Wie weit sollte Klimaschutz gehen?", "Ambitionierte Maßnahmen sind vertretbar, wenn Übergänge sozial abgefedert und Wirkungen überprüft werden.", "Zusammenfassend erscheint ein ambitionierter, aber sozial ausgewogener Kurs am tragfähigsten."],
    ],
  },
};

const readAnswers = (key) => { if (typeof window === "undefined") return {}; try { return JSON.parse(window.localStorage.getItem(key) || "{}"); } catch { return {}; } };

export function C2Days6To11LearnCoach({ day, mastery, completed = false, onCompleteChange }) {
  const data = DATA[Number(day)];
  const storageKey = `falowen:c2:learn-choice:${day}`;
  const [answers, setAnswers] = useState(() => readAnswers(storageKey));
  const [current, setCurrent] = useState(0);
  const questions = data?.questions || [];
  useEffect(() => { if (typeof window !== "undefined") window.localStorage.setItem(storageKey, JSON.stringify(answers)); }, [answers, storageKey]);
  const correct = useMemo(() => questions.filter((q, i) => answers[i] === q.o[q.a]).length, [answers, questions]);
  const allCorrect = questions.length > 0 && correct === questions.length;
  useEffect(() => { if (allCorrect && !completed) onCompleteChange?.(true); }, [allCorrect, completed, onCompleteChange]);
  if (!data) return null;
  const item = questions[Math.min(current, questions.length - 1)];
  const selected = answers[current] || "";
  return <div style={{ display: "grid", gap: 14 }}>
    <section style={card}><h2 style={{ margin: 0 }}>{data.title}</h2><p style={{ margin: 0, lineHeight: 1.75 }}>{data.intro}</p><div><strong>So baust du die Struktur:</strong><ol style={list}>{data.build.map((x) => <li key={x}>{x}</li>)}</ol></div></section>
    <section style={card}><h2 style={{ margin: 0 }}>Vom Muster zur eigenen Formulierung</h2>{data.patterns.map(([label, sentence, formula]) => <div key={label} style={{ border: "1px solid #e2e8f0", borderRadius: 12, padding: 12, display: "grid", gap: 5 }}><strong>{label}</strong><span>{sentence}</span><code>{formula}</code></div>)}</section>
    <section style={card}><h2 style={{ margin: 0 }}>Wortschatz und Kollokationen</h2><div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(230px,1fr))", gap: 10 }}>{(mastery?.vocabulary || []).map(([word, meaning]) => <div key={word} style={{ border: "1px solid #e2e8f0", borderRadius: 12, padding: 12 }}><strong>{word}</strong><div style={{ color: "#64748b" }}>{meaning}</div></div>)}</div>{(mastery?.collocations || []).map(([phrase, meaning, example]) => <div key={phrase} style={{ border: "1px solid #dbeafe", borderRadius: 12, padding: 12, background: "#eff6ff" }}><strong>{phrase}</strong>{meaning ? <span style={{ color: "#64748b" }}> · {meaning}</span> : null}<p style={{ margin: "6px 0 0" }}>{example}</p></div>)}</section>
    <section style={card}><div><span style={{ ...styles.badge, background: "#eef2ff", color: "#3730a3" }}>Lernen durch Entscheiden</span><h2>Wissens-Check</h2><strong>{correct}/{questions.length} richtig</strong></div><div style={{ display: "flex", gap: 8 }}>{questions.map((q, i) => <button key={q.q} type="button" onClick={() => setCurrent(i)} style={i === current ? styles.primaryButton : styles.secondaryButton}>{answers[i] === q.o[q.a] ? "✓ " : ""}{i + 1}</button>)}</div><h3>{item.q}</h3>{item.o.map((o) => { const isSelected = selected === o; const isCorrect = o === item.o[item.a]; return <button key={o} type="button" onClick={() => setAnswers((a) => ({ ...a, [current]: o }))} style={optionStyle({ selected: isSelected, correct: isCorrect, reveal: Boolean(selected) && isCorrect && !isSelected })}>{o}</button>; })}{selected ? <div><strong>{selected === item.o[item.a] ? "Richtig." : "Noch nicht."}</strong> {item.e}</div> : null}{allCorrect || completed ? <div style={{ border: "1px solid #86efac", borderRadius: 12, padding: 12, background: "#f0fdf4" }}><strong>Learn abgeschlossen.</strong> Du hast alle Wissensfragen richtig beantwortet.</div> : null}</section>
  </div>;
}

export function C2Days6To11SpeakCoach({ day }) {
  const data = DATA[Number(day)];
  const [support, setSupport] = useState("full");
  if (!data) return null;
  return <div style={{ display: "grid", gap: 12 }}>
    <div style={{ ...panel, background: "#fffbeb", borderColor: "#fde68a" }}><strong>Sprechfrage:</strong> {data.speakQuestion}</div>
    <div style={{ ...panel, background: "#fff" }}><strong>Trainiere bis du ohne Hilfe sprechen kannst</strong><div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>{[["full", "1. Mit Hilfe"], ["keywords", "2. Weniger Hilfe"], ["exam", "3. Prüfungsmodus"]].map(([v, label]) => <button key={v} type="button" onClick={() => setSupport(v)} style={support === v ? styles.primaryButton : styles.secondaryButton}>{label}</button>)}</div></div>
    {support !== "exam" ? <div style={panel}><h3 style={{ margin: 0 }}>Fragen und echte Punkte für deine Antwort</h3><p style={{ margin: 0 }}>Wähle 2–4 Bereiche. Entwickle jeden Punkt als Aussage → Grund → Beispiel → Folge.</p>{data.branches.map(([title, ideas, prompt, example, starter]) => <div key={title} style={{ border: "1px solid #c7d2fe", borderRadius: 12, padding: 12, background: "#fff", display: "grid", gap: 5 }}><strong>{title}</strong><div><strong>Ideen:</strong> {ideas.join(" · ")}</div><div><strong>Leitfrage:</strong> {prompt}</div>{support === "full" ? <><div><strong>So kannst du den Punkt entwickeln:</strong> {example}</div><div style={{ color: "#1e3a8a" }}><strong>C2-Satzanfang:</strong> {starter}</div></> : null}</div>)}</div> : <div style={{ ...panel, background: "#f0fdf4", borderColor: "#86efac" }}><strong>Prüfungsmodus:</strong> Bereite deine Antwort ohne Ideenbank vor. Formuliere eine klare Position, entwickle mindestens zwei Argumente, ein konkretes Beispiel und eine Einschränkung oder Gegenposition.</div>}
  </div>;
}

export default DATA;
