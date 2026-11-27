import { C1_DAY1_WRITING_TITLE, C1_DAY1_WRITING_POINTS } from "../c1Day1WritingTask.js";

const c1Day1ZieleUndLernweg = {
  level: "C1",
  day: 1,
  title: C1_DAY1_WRITING_TITLE,
  taskType: "C1 Stellungnahme",
  targetWords: 220,
  questions: [
    { id: "introduction", section: "Einleitung", question: "Warum sind wissenschaftliches Lernen und wirksame Lernstrategien heute wichtig?", help: "Führen Sie in die Fragestellung ein.", starter: "Angesichts der zunehmenden Informationsflut ...", minimumWords: 30 },
    { id: "criteria", section: "Wissenschaftliche Lernstrategien", question: C1_DAY1_WRITING_POINTS[0], help: "Erläutern Sie den Nutzen methodischen Lernens im akademischen Alltag.", starter: "Von besonderer Bedeutung ist, dass ...", minimumWords: 40 },
    { id: "example", section: "Lernformen vergleichen", question: C1_DAY1_WRITING_POINTS[1], help: "Wägen Sie Vorteile und Nachteile beider Lernformen ab.", starter: "Einerseits ... andererseits ...", minimumWords: 40 },
    { id: "objection", section: "Digitale Medien und KI", question: C1_DAY1_WRITING_POINTS[2], help: "Berücksichtigen Sie sowohl Unterstützung als auch mögliche Risiken.", starter: "Digitale Hilfsmittel können ..., sofern ...", minimumWords: 40 },
    { id: "alternative", section: "Erfahrung und Empfehlung", question: C1_DAY1_WRITING_POINTS[3], help: "Verbinden Sie Ihre Erfahrung mit einer begründeten Empfehlung und einem Fazit.", starter: "Aus meiner Erfahrung ...", minimumWords: 40 },
  ],
  checklist: [
    "Die Bedeutung methodischer Lernstrategien wird erklärt.",
    "Selbstständiges und geführtes Lernen werden abgewogen.",
    "Chancen und Risiken digitaler Medien und KI werden beurteilt.",
    "Eigene Erfahrungen und eine begründete Empfehlung werden dargestellt.",
    "Die Stellungnahme ist klar gegliedert und sprachlich angemessen.",
  ],
};
export default c1Day1ZieleUndLernweg;
