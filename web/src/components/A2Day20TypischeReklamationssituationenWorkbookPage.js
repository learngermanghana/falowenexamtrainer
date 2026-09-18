import React from "react";
import A2StandardTabbedWorkbookPage from "./A2StandardTabbedWorkbookPage";
import RadioFirstWorkbookGate from "./RadioFirstWorkbookGate";

const lesenText = `Teil 3 prüft fünf Themen aus Beruf und Arbeitswelt: Bewerbung, Vorstellungsgespräch, Berufswahl, Frauen im Berufsleben und das Leben vor 50 Jahren. Lesen Sie jede Aufgabe genau und wählen Sie die geforderten Antworten.`;

const lesenQuestions = [
  {
    stem: "Was sind wichtige Punkte, die man in einem Bewerbungsschreiben erwähnen sollte? Warum sind sie wichtig? (Eine Antwort ist richtig.)",
    options: [
      "A) Man sollte seine Hobbys erwähnen, weil sie zeigen, dass man vielseitig interessiert ist.",
      "B) Man sollte seine Gehaltsvorstellungen erwähnen, weil das zeigt, dass man weiß, was man wert ist.",
      "C) Man sollte seine Qualifikationen und Erfahrungen erwähnen, weil sie die Eignung für die Stelle zeigen.",
      "D) Man sollte seinen Familienstand erwähnen, weil das zeigt, dass man Verantwortung übernehmen kann.",
    ],
  },
  {
    stem: "Wie bereitet man sich auf ein Vorstellungsgespräch vor? Welche Tipps sind besonders nützlich? (Zwei Antworten sind richtig.)",
    options: [
      "A) Man sollte die Firma recherchieren, um gut informiert zu sein.",
      "B) Man sollte den Arbeitsweg üben, um pünktlich zu sein.",
      "C) Man sollte ein schickes Outfit kaufen, um gut auszusehen.",
      "D) Man sollte seine Freunde nach Tipps fragen, weil sie gute Ratschläge geben können.",
    ],
  },
  {
    stem: "Welche Faktoren sollte man bei der Wahl eines Berufs berücksichtigen? (Zwei Antworten sind richtig.)",
    options: [
      "A) Die Bezahlung, weil man finanziell abgesichert sein möchte.",
      "B) Die Arbeitszeiten, weil man eine gute Work-Life-Balance haben möchte.",
      "C) Die Berufserfahrung der Eltern, weil sie gute Vorbilder sein können.",
      "D) Die Entfernung zur Arbeit, weil ein kurzer Arbeitsweg angenehmer ist.",
    ],
  },
  {
    stem: "Welche Herausforderungen haben Frauen heute im Berufsleben? (Drei Antworten sind richtig.)",
    options: [
      "A) Frauen haben oft geringere Aufstiegschancen. Eine Lösung wäre eine Frauenquote.",
      "B) Frauen verdienen häufig weniger als Männer. Transparente Gehaltsstrukturen könnten helfen.",
      "C) Frauen müssen oft Beruf und Familie vereinbaren. Flexible Arbeitszeiten könnten eine Lösung sein.",
      "D) Frauen werden oft bevorzugt eingestellt. Ein faires Auswahlverfahren könnte das ändern.",
    ],
  },
  {
    stem: "Wie war das Leben vor 50 Jahren im Vergleich zu heute? (Drei Antworten sind richtig.)",
    options: [
      "A) Es gab weniger technische Geräte im Haushalt.",
      "B) Die Menschen waren weniger mobil und reisten seltener.",
      "C) Es gab mehr Freizeitangebote und Unterhaltungsmöglichkeiten.",
      "D) Die Arbeitszeiten waren länger und härter.",
    ],
  },
];

const hoerenQuestions = [
  {
    stem: "Was sind wichtige Informationen, die in einem Lebenslauf enthalten sein sollten?",
    options: ["A) Die Hobbys des Bewerbers", "B) Die beruflichen Qualifikationen und Erfahrungen", "C) Die Gehaltsvorstellungen", "D) Der Familienstand"],
  },
  {
    stem: "Wie bereitet man sich auf ein Vorstellungsgespräch vor?",
    options: ["A) Man übt das Vorstellungsgespräch mit Freunden", "B) Man informiert sich über die Firma", "C) Man kauft neue Kleidung", "D) Man lernt den Arbeitsweg"],
  },
  {
    stem: "Welche Faktoren sind bei der Wahl eines Berufs wichtig?",
    options: ["A) Die Bezahlung", "B) Die Arbeitszeiten", "C) Die Entfernung zur Arbeit", "D) Die Berufserfahrung der Eltern"],
  },
  {
    stem: "Was sind die Vorteile eines Praktikums?",
    options: ["A) Man sammelt praktische Erfahrungen", "B) Man knüpft Kontakte", "C) Man verdient viel Geld", "D) Man lernt verschiedene Berufe kennen"],
  },
  {
    stem: "Welche Herausforderungen haben Frauen heute im Berufsleben?",
    options: ["A) Geringere Aufstiegschancen", "B) Höhere Gehälter als Männer", "C) Schwierigkeit, Beruf und Familie zu vereinbaren", "D) Bevorzugte Einstellungen"],
  },
  {
    stem: "Welche Maßnahmen könnten Frauen im Beruf unterstützen?",
    options: ["A) Flexible Arbeitszeiten", "B) Frauenquote", "C) Transparente Gehaltsstrukturen", "D) Strengere Auswahlverfahren"],
  },
  {
    stem: "Wie war das Leben vor 50 Jahren im Vergleich zu heute?",
    options: ["A) Es gab weniger technische Geräte im Haushalt", "B) Die Menschen reisten häufiger", "C) Es gab weniger Freizeitangebote", "D) Die Arbeitszeiten waren kürzer"],
  },
  {
    stem: "Welche waren einige der früheren Herausforderungen in Verbindung mit Technologie?",
    options: ["A) Sie hatten viele Computer.", "B) Sie arbeiteten mehr und hatten weniger Freizeit.", "C) Es gab so viele Autos.", "D) Sie hatten nicht genug Hausaufgaben zu erledigen."],
  },
];

const hoerenGroups = [
  { title: "Hören 1 · Bewerbung", url: "https://drive.google.com/file/d/1BWtDeohvS8Qekv0ZLsexBxqNqFhlwtf3/view?usp=sharing", start: 0, end: 2 },
  { title: "Hören 2 · Berufswahl", url: "https://drive.google.com/file/d/1j7PWbKGDh27l0F0A68DNu6swUJYAPRJR/view?usp=sharing", start: 2, end: 4 },
  { title: "Hören 3 · Frauensachen", url: "https://drive.google.com/file/d/1EZh08j4vFH4VPfcNPDSv4pWruD9ISg56/view?usp=sharing", start: 4, end: 6 },
  { title: "Hören 4 · Damals", url: "https://drive.google.com/file/d/1OfbZTKr9ePe5OqV9GNgE7D3tfoMAPOAD/view?usp=sharing", start: 6, end: 8 },
];

const hoerenContent = (
  <div style={{ display: "grid", gap: 14 }}>
    <p style={{ margin: 0, lineHeight: 1.7 }}>
      Hören Sie die vier Originalaufnahmen und beantworten Sie insgesamt acht Fragen.
    </p>
    {hoerenGroups.map((group) => (
      <section key={group.title} style={{ border: "1px solid #dbeafe", borderRadius: 12, padding: 14, display: "grid", gap: 10 }}>
        <strong>{group.title}</strong>
        <a href={group.url} target="_blank" rel="noreferrer">Audio öffnen</a>
        {hoerenQuestions.slice(group.start, group.end).map((question, offset) => (
          <div key={question.stem} style={{ display: "grid", gap: 6 }}>
            <strong>{group.start + offset + 1}. {question.stem}</strong>
            {question.options.map((option) => <span key={option}>{option}</span>)}
          </div>
        ))}
      </section>
    ))}
  </div>
);

export default function A2Day20TypischeReklamationssituationenWorkbookPage() {
  return (
    <RadioFirstWorkbookGate level="A2" day={20}>
      <A2StandardTabbedWorkbookPage
        day={20}
        title="Typische Reklamationssituationen üben"
        chapter="7.20"
        workbookId="A2Day20TypischeReklamationssituationen"
        topicPrompt="Du möchtest ein defektes oder falsches Produkt reklamieren. Erkläre das Problem höflich und sage, welche Lösung du möchtest."
        schreibenTask="Sie haben ein Produkt gekauft, aber es ist defekt oder nicht wie bestellt. Schreiben Sie eine formelle Reklamation. Erklären Sie, was Sie gekauft haben, beschreiben Sie das Problem und bitten Sie höflich um Umtausch, Reparatur oder Rückerstattung."
        schreibenPlaceholder="Sehr geehrte Damen und Herren,\n\nich wende mich an Sie, weil ..."
        lesenText={lesenText}
        lesenQuestions={lesenQuestions}
        hoerenContent={hoerenContent}
        hoerenQuestions={hoerenQuestions}
        showWorkbookGuidance={false}
      />
    </RadioFirstWorkbookGate>
  );
}
