// Print-only additions to canonical B1 writing prompts. These do not change
// the graded learner app, marking rubrics or student submissions.
// Only restore content already evidenced by the existing tasks/source workbooks;
// Day 28 is a newly authored climate-specific writing prompt.
const supplements = Object.freeze({
  1: {
    taskPoints: [
      "Nennen Sie einen Vorteil persönlicher Kontakte im Traumberuf.",
      "Beschreiben Sie einen Vorteil flexibler Arbeit im Homeoffice.",
      "Begründen Sie mit einem Beispiel, welche Arbeitsform Sie bevorzugen.",
    ],
  },
  3: {
    taskPoints: [
      "Entschuldigen Sie sich bei Frau Wolmer für Ihre Abwesenheit.",
      "Erklären Sie kurz, warum Sie an der Präsentation nicht teilnehmen können.",
      "Schlagen Sie einen neuen Termin oder eine andere Lösung vor.",
    ],
  },
  6: {
    sourceTitle: "Meinung von Tanja (aus der Falowen-Lektion)",
    sourceText: "Tanja sagt, dass das Leben in der Stadt für sie besser ist, weil dort immer etwas los ist und sie alles schnell erreichen kann. Ich denke anders. Für mich ist das Leben auf dem Land besser, weil es ruhiger ist und ich mehr Kontakt zur Natur habe.",
    taskPoints: [
      "Gehen Sie auf die Meinung über das Leben in der Stadt ein.",
      "Vergleichen Sie jeweils einen Vorteil von Stadt und Land.",
      "Begründen Sie Ihren bevorzugten Wohnort mit einem Beispiel.",
    ],
  },
  13: {
    sourceTitle: "Schreibaufgabe",
    sourceText: "Sind spannende Filme besser als ruhige Filme? Nehmen Sie Stellung. Begründen Sie Ihre Meinung und vergleichen Sie beide Filmarten mit einem Beispiel.",
  },
  20: {
    sourceTitle: "Beitrag von Felix (aus der Falowen-Lektion)",
    sourceText: "Eine gute Ausbildung hilft, einen guten Job zu finden. Mit Qualifikationen hat man bessere Chancen auf dem Arbeitsmarkt. Dennoch sind auch Erfahrung und persönliche Fähigkeiten wichtig. Ich finde, dass man immer weiterlernen sollte, um erfolgreich zu sein. Was denken Sie darüber?",
    taskPoints: [
      "Stimmen Sie Felix zu oder nicht? Begründen Sie Ihre Antwort.",
      "Vergleichen Sie Ausbildung und praktische Berufserfahrung.",
      "Nennen Sie ein Beispiel aus Ihrem Leben oder Ihrem Heimatland.",
    ],
  },
  24: { title: "Goethe B1 Schreiben Aufgabe 2 · Konsum und Nachhaltigkeit" },
  25: { title: "Goethe B1 Schreiben Aufgabe 3 · Formelle E-Mail: Reklamation (ca. 40–50 Wörter)" },
  26: { title: "Goethe B1 Schreiben Aufgabe 3 · Formelle E-Mail: Städtereise nach Wien" },
  27: { title: "Goethe B1 Schreiben Aufgabe 2 · Umweltfreundlich im Alltag" },
  28: {
    title: "Goethe B1 Schreiben Aufgabe 2 · Klimafreundlich leben",
    instructions: "Sie haben im Online-Forum einen Beitrag über klimafreundliche Mobilität und Energiesparen gelesen. Lesen Sie Lukas' Meinung. Schreiben Sie einen Forenbeitrag von etwa 80 Wörtern und bearbeiten Sie alle vier Punkte.",
    sourceTitle: "Lukas (28 Jahre) · Forum: Klimafreundlicher Alltag",
    sourceText: "Seit einigen Monaten fahre ich mit dem Bus statt mit dem Auto zur Arbeit. Außerdem versuche ich, zu Hause weniger Strom zu verbrauchen. Am Anfang war die Umstellung nicht leicht. Aber ich glaube, dass auch kleinere Entscheidungen helfen können, den CO₂-Ausstoß zu reduzieren. Was denkt ihr?",
    taskPoints: [
      "Reagieren Sie auf Lukas' Meinung über Busfahren und Energiesparen.",
      "Beschreiben Sie eine klimafreundliche Möglichkeit, sich fortzubewegen.",
      "Nennen Sie eine konkrete Möglichkeit, zu Hause Energie zu sparen.",
      "Erklären Sie einen Vorteil und eine Schwierigkeit klimafreundlichen Handelns.",
    ],
  },
});

export const getB1RetailWritingTask = (day, task) => {
  if (!task || !Number.isInteger(Number(day))) return task;
  const extra = supplements[Number(day)];
  return extra ? { ...task, ...extra } : task;
};
