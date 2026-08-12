import React from "react";
import A2MiniLearningBlock from "./A2MiniLearningBlock";

const THINK_FIRST = {
  1: {
    title: "Zeit zuerst entscheiden: jetzt oder abgeschlossen?",
    question: "Sprichst du über jetzt/allgemein oder über eine abgeschlossene Erfahrung?",
    steps: [
      "Markiere zuerst die Zeitidee: jetzt, regelmäßig, Zukunft mit Zeitangabe oder abgeschlossen in der Vergangenheit.",
      "Wähle Präsens für jetzt/allgemein und Perfekt für abgeschlossene Erfahrungen.",
      "Beim Perfekt entscheidest du zuerst: haben oder sein?",
      "Setze das Partizip II ans Satzende.",
    ],
    example: "Idea: letztes Jahr + nach Berlin reisen → abgeschlossen → Letztes Jahr bin ich nach Berlin gereist.",
  },
  2: {
    title: "Eigenschaft + Grund: erst sagen, dann begründen",
    question: "Welche Eigenschaft hat die Person, und warum ist sie wichtig?",
    steps: [
      "Wähle eine konkrete Eigenschaft: ehrlich, zuverlässig, hilfsbereit, geduldig.",
      "Entscheide, ob das Adjektiv nach sein steht oder direkt vor einem Nomen.",
      "Formuliere die Hauptaussage zuerst.",
      "Füge mit weil den Grund hinzu; das konjugierte Verb steht im weil-Satz am Ende.",
    ],
    example: "Idea: zuverlässig + hilft immer → Meine Freundin ist zuverlässig, weil sie mir immer hilft.",
  },
  3: {
    title: "Kasus erkennen, dann Adjektivendung wählen",
    question: "Ist das Nomen Subjekt, direktes Objekt oder steht es nach einer Dativ-Struktur?",
    steps: [
      "Bestimme zuerst Genus und Kasus des Nomens.",
      "Achte auf den Artikel: ein/eine, kein/keine oder Possessivartikel.",
      "Im Nominativ helfen dir -er, -e, -es; im Dativ ist die Endung fast immer -en.",
      "Kontrolliere besonders den maskulinen Akkusativ: einen + -en.",
    ],
    example: "Idea: Mentor + maskulin + Akkusativ → Sie trifft einen erfahrenen Mentor.",
  },
  4: {
    title: "Beziehung zwischen zwei Ideen zuerst bestimmen",
    question: "Willst du zwei Punkte hinzufügen, eine Alternative nennen oder einen Gegensatz zeigen?",
    steps: [
      "Entscheide zuerst die Funktion: Addition, Verstärkung, Alternative oder Gegensatz.",
      "Wähle dann den passenden zweiteiligen Konnektor.",
      "Halte beide Teile grammatisch parallel.",
      "Baue danach deine Wohnungsmeinung mit einem konkreten Beispiel aus.",
    ],
    example: "Idea: Lage wichtig + Preis wichtig → Sowohl die Lage als auch der Mietpreis sind wichtig.",
  },
  5: {
    title: "Direkte Frage zuerst denken, dann höflich umformen",
    question: "Welche Information brauchst du, und wie kannst du sie höflich erfragen?",
    steps: [
      "Formuliere zuerst die einfache direkte Frage in deinem Kopf.",
      "Wähle eine höfliche Einleitung: Könnten Sie ..., Wäre ... möglich?, Ich würde gern ...",
      "Bei einer indirekten Frage mit ob/wann/wo/wie steht das konjugierte Verb am Ende.",
      "Prüfe, ob der Satz formell und passend für Vermieter oder Verwaltung klingt.",
    ],
    example: "Direkt: Ist die Wohnung noch frei? → Höflich: Ich möchte wissen, ob die Wohnung noch verfügbar ist.",
  },
};

const LESSONS = {
  1: {
    title: "Präsens oder Perfekt?",
    rule: "Präsens beschreibt jetzt, Allgemeines und Zukunft mit Zeitangabe. Perfekt beschreibt abgeschlossene Handlungen; es besteht aus haben/sein + Partizip II.",
    examples: ["Ich träume von einer besseren Zukunft.", "Letztes Jahr bin ich nach Deutschland gereist.", "Ich habe einen interessanten Film gesehen."],
    questions: [
      { stem: "Welche Form passt zu einer abgeschlossenen Reise?", options: ["Ich reise letztes Jahr nach Berlin.", "Ich bin letztes Jahr nach Berlin gereist.", "Ich habe letztes Jahr nach Berlin gereist."], answer: 1, explanation: "Reisen bildet das Perfekt hier mit sein: ich bin gereist." },
      { stem: "Welche Aussage steht im Präsens?", options: ["Ich habe von meinem Traumhaus geträumt.", "Ich träume oft von meinem Traumhaus.", "Ich bin geträumt."], answer: 1, explanation: "träume ist Präsens und beschreibt hier eine regelmäßige Handlung." },
      { stem: "Was steht im Perfekt normalerweise am Satzende?", options: ["das Hilfsverb", "das Partizip II", "das Subjekt"], answer: 1, explanation: "Das konjugierte Hilfsverb steht früh im Satz, das Partizip II am Ende." },
    ],
    outputPrompt: "Sprich zwei Sätze über deine Zukunft und zwei Sätze über abgeschlossene Erfahrungen.",
    starters: ["In Zukunft ...", "Nächstes Jahr ...", "Letztes Jahr habe ich ...", "Ich bin schon einmal ..."],
  },
  2: {
    title: "Adjektive + weil-Sätze",
    rule: "Mit Adjektiven beschreibst du Eigenschaften. Mit weil begründest du deine Aussage; im weil-Satz steht das konjugierte Verb am Ende.",
    examples: ["Mein Freund ist ehrlich, weil er immer die Wahrheit sagt.", "Eine zuverlässige Freundin hilft mir auch in schwierigen Situationen.", "Ich schätze geduldige Menschen, weil sie gut zuhören."],
    questions: [
      { stem: "Welcher Satz ist richtig?", options: ["Mein Freund ist zuverlässig, weil er hilft mir immer.", "Mein Freund ist zuverlässig, weil er mir immer hilft.", "Weil mein Freund zuverlässig ist, er hilft mir immer."], answer: 1, explanation: "Im weil-Satz steht das konjugierte Verb am Ende." },
      { stem: "Welche Form passt? eine ___ Freundin", options: ["zuverlässig", "zuverlässige", "zuverlässigen"], answer: 1, explanation: "Nach eine im Nominativ feminin steht hier die Endung -e." },
      { stem: "Welche Formulierung ist auf B1 stärker?", options: ["Mein Freund ist nett.", "Mein Freund ist zuverlässig, weil er mich in schwierigen Situationen unterstützt.", "Freund gut."], answer: 1, explanation: "B1 verlangt genaueres Beschreiben und Begründen." },
    ],
    outputPrompt: "Beschreibe eine wichtige Person mit drei Eigenschaften und begründe mindestens zwei davon mit weil.",
    starters: ["Für mich ist ... besonders, weil ...", "Er/Sie ist ...", "Ich finde wichtig, dass ..."],
  },
  3: {
    title: "Adjektivdeklination mit ein/eine",
    rule: "Bestimme zuerst Kasus und Genus. Nominativ: ein guter Mann, eine gute Frau, ein gutes Projekt. Maskuliner Akkusativ: einen guten Mann. Im Dativ steht meist -en.",
    examples: ["Ein erfolgreicher Unternehmer gründet eine Firma.", "Sie trifft einen erfahrenen Mentor.", "Er arbeitet mit einer erfolgreichen Unternehmerin."],
    questions: [
      { stem: "Was passt? ein ___ Projekt", options: ["großer", "große", "großes"], answer: 2, explanation: "Projekt ist Neutrum im Nominativ: ein großes Projekt." },
      { stem: "Was passt? Sie trifft einen ___ Mentor.", options: ["erfahrener", "erfahrenen", "erfahrenes"], answer: 1, explanation: "Maskuliner Akkusativ nach einen: Adjektivendung -en." },
      { stem: "Was passt? mit einer ___ Kollegin", options: ["motivierte", "motivierten", "motivierter"], answer: 1, explanation: "Im Dativ steht das Adjektiv hier mit -en." },
    ],
    outputPrompt: "Beschreibe eine erfolgreiche Person mit mindestens vier Adjektiven in verschiedenen Kasus.",
    starters: ["Ein erfolgreicher ...", "Sie hat einen ...", "Mit einem ...", "Bei einer ..."],
  },
  4: {
    title: "Zweiteilige Konnektoren",
    rule: "Zweiteilige Konnektoren verbinden parallele Ideen: sowohl ... als auch, nicht nur ... sondern auch, entweder ... oder, weder ... noch, zwar ... aber.",
    examples: ["Sowohl die Lage als auch der Mietpreis sind wichtig.", "Die Wohnung ist zwar klein, aber sehr hell.", "Ich suche entweder eine WG oder eine kleine Wohnung."],
    questions: [
      { stem: "Welche Struktur addiert zwei positive Punkte?", options: ["sowohl ... als auch", "weder ... noch", "zwar ... aber"], answer: 0, explanation: "sowohl ... als auch verbindet zwei gleichwertige positive Punkte." },
      { stem: "Was passt? Die Wohnung ist ___ günstig, ___ weit vom Zentrum entfernt.", options: ["zwar / aber", "sowohl / als auch", "weder / noch"], answer: 0, explanation: "zwar ... aber zeigt einen Gegensatz bzw. eine Einschränkung." },
      { stem: "Welche Struktur nennt eine Alternative?", options: ["entweder ... oder", "nicht nur ... sondern auch", "sowohl ... als auch"], answer: 0, explanation: "entweder ... oder stellt zwei Alternativen gegenüber." },
    ],
    outputPrompt: "Vergleiche zwei Wohnungsmöglichkeiten und benutze mindestens drei zweiteilige Konnektoren.",
    starters: ["Sowohl ... als auch ...", "Die Wohnung ist zwar ..., aber ...", "Entweder ... oder ..."],
  },
  5: {
    title: "Höfliche Fragen und indirekte Fragen",
    rule: "Konjunktiv-II-Formen wie könnten, wäre und würde machen Fragen höflicher. In indirekten Fragen mit ob/wann/wo/wie steht das konjugierte Verb am Ende.",
    examples: ["Könnten Sie mir einen Termin anbieten?", "Wäre Samstag um 14 Uhr möglich?", "Ich möchte wissen, ob die Wohnung noch verfügbar ist."],
    questions: [
      { stem: "Welche Frage klingt am höflichsten?", options: ["Wann kann ich kommen?", "Könnten Sie mir sagen, wann eine Besichtigung möglich wäre?", "Sag mir den Termin."], answer: 1, explanation: "Konjunktiv II plus indirekte Frage klingt formell und höflich." },
      { stem: "Welcher ob-Satz ist richtig?", options: ["Ich möchte wissen, ob ist die Wohnung frei.", "Ich möchte wissen, ob die Wohnung frei ist.", "Ich möchte wissen, die Wohnung ob frei ist."], answer: 1, explanation: "Im indirekten Nebensatz steht das konjugierte Verb am Ende." },
      { stem: "Was passt zu einem höflichen Wunsch?", options: ["Ich würde die Wohnung gern besichtigen.", "Ich besichtige Wohnung jetzt.", "Du gibst mir Termin."], answer: 0, explanation: "Ich würde gern ... ist eine höfliche B1-Formulierung." },
    ],
    outputPrompt: "Formuliere vier höfliche Fragen für eine Wohnungsbesichtigung.",
    starters: ["Könnten Sie mir sagen, ...", "Ich möchte wissen, ob ...", "Wäre ... möglich?", "Ich würde gern ..."],
  },
};

function ThinkingFirstCard({ day }) {
  const guide = THINK_FIRST[Number(day)];
  if (!guide) return null;
  return (
    <section style={{ border: "1px solid #bfdbfe", borderRadius: 16, padding: 16, background: "#eff6ff", display: "grid", gap: 10 }}>
      <div style={{ fontWeight: 900, color: "#1e3a8a" }}>Think first · Erst verstehen, dann anwenden</div>
      <h3 style={{ margin: 0 }}>{guide.title}</h3>
      <p style={{ margin: 0, lineHeight: 1.7 }}><strong>Ask yourself:</strong> {guide.question}</p>
      <ol style={{ margin: 0, paddingLeft: 22, lineHeight: 1.75 }}>{guide.steps.map((step) => <li key={step}>{step}</li>)}</ol>
      <div style={{ border: "1px solid #dbeafe", borderRadius: 12, padding: 12, background: "#fff", lineHeight: 1.7 }}><strong>Idea → decision → German sentence</strong><br />{guide.example}</div>
    </section>
  );
}

export default function B1Days1To5LearningUpgrade({ day }) {
  const lesson = LESSONS[Number(day)];
  if (!lesson) return null;
  return (
    <div data-b1-days1-5-learning-upgrade={`day-${day}`} style={{ display: "grid", gap: 14 }}>
      <ThinkingFirstCard day={day} />
      <A2MiniLearningBlock {...lesson} />
    </div>
  );
}
