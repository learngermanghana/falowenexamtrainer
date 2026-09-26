const OPINION_NOTE = "Denken Sie an eine Einleitung und einen Schluss. Bei der Bewertung wird darauf geachtet, wie genau die Inhaltspunkte bearbeitet sind, wie korrekt der Text ist und wie gut die Sätze und Abschnitte sprachlich miteinander verknüpft sind. Schreiben Sie mindestens 150 Wörter.";
const FORMAL_NOTE = "Achten Sie auf eine passende Anrede und einen passenden Schluss. Bearbeiten Sie alle vier Inhaltspunkte klar und höflich. Schreiben Sie mindestens 100 Wörter.";

const opinionTemplate = `In der heutigen Zeit wird oft über ... diskutiert.

Meiner Meinung nach ...

Ein wichtiger Grund dafür ist, dass ...
Ein weiterer Grund ist, dass ...

Eine andere Möglichkeit wäre, ...

Ein Vorteil davon ist, dass ...

Zusammenfassend lässt sich sagen, dass ...`;

const formalTemplate = `Betreff: ...

Sehr geehrte Frau ... / Sehr geehrter Herr ...,

ich bitte um Verständnis, weil ...

Zurzeit ...

Für die kommenden Tage schlage ich vor, dass ...

Mir ist bewusst, dass ...

Mit freundlichen Grüßen
...`;

export const B2_WRITE_DAYS = Object.freeze([4, 8, 12, 16, 20, 24, 28]);

export const B2_WRITING_TASKS = Object.freeze({
  4: Object.freeze({
    day: 4,
    type: "opinion",
    taskType: "B2 opinion essay / Forumsbeitrag",
    lead: "Sie schreiben einen Forumsbeitrag für junge Leute zur Verschmutzung der Umwelt.",
    bullets: Object.freeze([
      "Äußern Sie Ihre Meinung zu Plastikverpackungen im Alltag.",
      "Nennen Sie Gründe, warum Plastikverpackungen so verbreitet sind.",
      "Nennen Sie andere Möglichkeiten, Dinge im Alltag zu verpacken.",
      "Nennen Sie Vorteile der anderen Verpackungen.",
    ]),
    minimumWords: 150,
    note: OPINION_NOTE,
    starterTemplate: opinionTemplate,
  }),
  8: Object.freeze({
    day: 8,
    type: "opinion",
    taskType: "B2 opinion essay / Forumsbeitrag",
    lead: "Sie schreiben einen Forumsbeitrag für junge Leute zum Thema Bildungsgerechtigkeit.",
    bullets: Object.freeze([
      "Äußern Sie Ihre Meinung dazu, ob alle Jugendlichen die gleichen Bildungschancen haben.",
      "Nennen Sie Gründe, warum der Zugang zu Bildung unterschiedlich sein kann.",
      "Nennen Sie Möglichkeiten, benachteiligte Lernende besser zu unterstützen.",
      "Nennen Sie Vorteile dieser Maßnahmen.",
    ]),
    minimumWords: 150,
    note: OPINION_NOTE,
    starterTemplate: opinionTemplate,
  }),
  12: Object.freeze({
    day: 12,
    type: "opinion",
    taskType: "B2 opinion essay / Forumsbeitrag",
    lead: "Sie schreiben einen Forumsbeitrag für Studierende zum Thema Studiengebühren und Weiterbildung.",
    bullets: Object.freeze([
      "Äußern Sie Ihre Meinung zu Studiengebühren.",
      "Nennen Sie Gründe, warum die Finanzierung eines Studiums schwierig sein kann.",
      "Nennen Sie andere Möglichkeiten, Studium oder Weiterbildung zu finanzieren.",
      "Nennen Sie Vorteile dieser Möglichkeiten.",
    ]),
    minimumWords: 150,
    note: OPINION_NOTE,
    starterTemplate: opinionTemplate,
  }),
  16: Object.freeze({
    day: 16,
    type: "formal",
    taskType: "B2 formal message / Formelle Nachricht",
    lead: "Sie wohnen in einer kleineren Stadt und fahren regelmäßig mit dem Bus zur Arbeit. In letzter Zeit fallen Verbindungen häufig aus. Schreiben Sie an das örtliche Verkehrsunternehmen.",
    bullets: Object.freeze([
      "Beschreiben Sie die Probleme mit den Busverbindungen.",
      "Erklären Sie, welche Folgen die Ausfälle für Sie haben.",
      "Machen Sie einen Vorschlag zur Verbesserung.",
      "Bitten Sie um eine Rückmeldung.",
    ]),
    minimumWords: 100,
    note: FORMAL_NOTE,
    starterTemplate: formalTemplate,
  }),
  20: Object.freeze({
    day: 20,
    type: "opinion",
    taskType: "B2 opinion essay / Forumsbeitrag",
    lead: "Sie schreiben einen Forumsbeitrag für junge Leute zum Thema soziale Medien und Privatsphäre.",
    bullets: Object.freeze([
      "Äußern Sie Ihre Meinung zum Teilen persönlicher Informationen in sozialen Medien.",
      "Nennen Sie Gründe, warum viele Menschen so viele persönliche Inhalte veröffentlichen.",
      "Nennen Sie Möglichkeiten, die eigene Privatsphäre besser zu schützen.",
      "Nennen Sie Vorteile dieser Maßnahmen.",
    ]),
    minimumWords: 150,
    note: OPINION_NOTE,
    starterTemplate: opinionTemplate,
  }),
  24: Object.freeze({
    day: 24,
    type: "formal",
    taskType: "B2 formal message / Formelle Nachricht",
    lead: "Sie hatten einen Termin für eine Videosprechstunde bei einer Arztpraxis. Die Verbindung hat nicht funktioniert. Schreiben Sie an die Praxis.",
    bullets: Object.freeze([
      "Beschreiben Sie das Problem mit der Videosprechstunde.",
      "Erklären Sie, was Sie bereits versucht haben.",
      "Bitten Sie um einen neuen Termin oder eine andere Möglichkeit für das Gespräch.",
      "Zeigen Sie Verständnis dafür, dass technische Probleme vorkommen können.",
    ]),
    minimumWords: 100,
    note: FORMAL_NOTE,
    starterTemplate: formalTemplate,
  }),
  28: Object.freeze({
    day: 28,
    type: "formal",
    taskType: "B2 formal message / Formelle Nachricht",
    lead: "Sie machen gerade ein Praktikum bei einer deutschen Firma. Sie haben derzeit so viel zu tun, dass Sie Ihre Arbeit nicht mehr schaffen. Schreiben Sie eine Nachricht an Ihren Vorgesetzten, Herrn Ebert.",
    bullets: Object.freeze([
      "Bitten Sie um Verständnis für Ihre Situation.",
      "Beschreiben Sie, womit Sie beschäftigt sind.",
      "Machen Sie einen Vorschlag für die kommenden Tage.",
      "Zeigen Sie Verständnis für die Arbeitssituation in der Firma.",
    ]),
    minimumWords: 100,
    note: FORMAL_NOTE,
    starterTemplate: formalTemplate,
  }),
});

export const getB2WritingTask = (day) => B2_WRITING_TASKS[Number(day)] || null;

export const applyB2WritingTaskToLesson = (lesson = {}) => {
  const task = getB2WritingTask(lesson.day);
  if (!task) return lesson;

  return {
    ...lesson,
    writingTaskType: task.taskType,
    writingTopic: task.lead,
    writingPromptBullets: [...task.bullets],
    writingTaskNote: task.note,
    writingMinimumWords: task.minimumWords,
    writingBuilder: {
      ...(lesson.writingBuilder || {}),
      structure: [...task.bullets],
    },
    starterTemplate: task.starterTemplate,
  };
};

export default B2_WRITING_TASKS;
