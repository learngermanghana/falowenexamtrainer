import React from "react";
import B1StandardWorkbookPage from "./B1StandardWorkbookPage";
import RadioFirstWorkbookGate from "./RadioFirstWorkbookGate";

const config = {
  day: 20,
  chapter: "6.20",
  assignmentKey: "B1-6.20",
  workbookId: "B1Day20WieWirdMan",
  title: "Wie wird man …?",
  subtitle: "Select Teil 1–4 below. The highlighted card at the top of each section tells you exactly what to answer.",
  heroImage: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1600&q=80",
  heroAlt: "Learners discussing education, qualifications and careers",
  speaking: {
    question: "Welche Ausbildung und Qualifikationen sind für deinen Beruf wichtig?",
    instructions: "Wähle deinen Wunschberuf oder einen Beruf, den du gut kennst. Erkläre den Ausbildungsweg, wichtige Qualifikationen, die Situation in deinem Heimatland sowie Vor- und Nachteile.",
    image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1600&q=80",
    imageAlt: "A group discussing professions and career paths",
    ideaTitle: "Berufe, Ausbildung und Qualifikationen",
    ideaIntro: "Use these notes as an idea bank. You do not need to answer every point separately.",
    ideaGroups: [
      {
        title: "Beliebte Berufe",
        items: ["Arzt/Ärztin", "Ingenieur/in", "Lehrer/in", "Kaufmann/Kauffrau", "Handwerker/in", "Künstler/in", "IT-Spezialist/in"],
      },
      {
        title: "Ausbildung und Studium",
        items: ["Schulabschluss", "Universität", "Fachhochschule", "Berufsausbildung", "Lehre", "Praktikum"],
      },
      {
        title: "Wichtige Qualifikationen",
        items: ["Teamarbeit", "Kommunikation", "Kreativität", "technische Kenntnisse", "Sprachen", "IT-Kenntnisse"],
      },
      {
        title: "Karriereweg",
        items: ["Schulabschluss", "Ausbildung oder Studium", "Berufseinstieg", "Weiterbildung", "Karriereaufstieg"],
      },
      {
        title: "Herausforderungen und Chancen",
        items: ["Ausbildungsdauer", "Kosten", "Arbeitsmarkt", "Berufserfahrung", "Aufstiegsmöglichkeiten"],
      },
    ],
    exampleTitle: "Beispiel: Wie wird man Arzt oder Ärztin?",
    exampleSteps: [
      "Abitur machen",
      "Medizinstudium absolvieren",
      "Staatsexamen bestehen",
      "Facharztausbildung machen",
      "Berufserfahrung sammeln",
    ],
    discussionQuestions: [
      "Welcher Beruf interessiert dich und warum?",
      "Welche Ausbildung oder Qualifikationen brauchst du für deinen Traumberuf?",
      "Was ist wichtiger: Erfahrung oder Ausbildung?",
      "Glaubst du, dass lebenslanges Lernen wichtig ist?",
    ],
    answerStructure: [
      "Begrüßung und Thema vorstellen.",
      "Den Beruf und den Ausbildungsweg erklären.",
      "Wichtige Qualifikationen und Fähigkeiten nennen.",
      "Die Situation im Heimatland beschreiben.",
      "Vor- und Nachteile oder Herausforderungen erklären.",
      "Die eigene Meinung zusammenfassen.",
    ],
    usefulPhrases: [
      "Für diesen Beruf braucht man …",
      "Man muss zuerst … machen und danach … absolvieren.",
      "Praktische Erfahrung ist wichtig, weil …",
      "In meinem Heimatland ist der Karriereweg ähnlich/anders.",
      "Einerseits dauert die Ausbildung lange, andererseits hat man gute Chancen.",
    ],
  },
  writing: {
    title: "Sind Ausbildung und Qualifikationen wichtig für den Beruf?",
    instructions: "Reagieren Sie auf Felix' Meinung. Sagen Sie, ob Sie zustimmen, vergleichen Sie Ausbildung mit Erfahrung und nennen Sie ein Beispiel.",
    image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1600&q=80",
    imageAlt: "Student writing about education and qualifications",
    sourceTitle: "Beitrag von Felix",
    sourceText: "Eine gute Ausbildung hilft, einen guten Job zu finden. Mit Qualifikationen hat man bessere Chancen auf dem Arbeitsmarkt. Dennoch sind auch Erfahrung und persönliche Fähigkeiten wichtig. Ich finde, dass man immer weiterlernen sollte, um erfolgreich zu sein. Was denken Sie darüber?",
    taskPoints: [
      "Stimmen Sie Felix zu oder nicht?",
      "Warum sind Ausbildung und Qualifikationen wichtig oder nicht wichtig?",
      "Was ist wichtiger: Ausbildung oder praktische Erfahrung?",
      "Nennen Sie ein Beispiel aus Ihrem Leben oder Heimatland.",
      "Formulieren Sie einen klaren Schluss.",
    ],
    supportStructure: [
      "Einleitung",
      "Reaktion auf Felix",
      "Ausbildung und Erfahrung vergleichen",
      "Beispiel",
      "Eigene Meinung",
      "Schluss",
    ],
    template: "Liebe Forum-Mitglieder,\n\nich möchte meine Meinung zum Thema Ausbildung und Qualifikationen äußern.\n\nIch stimme Felix zu / nicht ganz zu, weil …\n\nEinerseits … Andererseits …\n\nIn meinem Leben / In meinem Heimatland …\n\nZusammenfassend finde ich, dass …\n\nMit freundlichen Grüßen\n[Ihr Name]",
    vocabulary: [
      "eine Ausbildung absolvieren",
      "Berufserfahrung sammeln",
      "gute Chancen auf dem Arbeitsmarkt haben",
      "sich weiterbilden",
      "praktische Fähigkeiten entwickeln",
      "Verantwortung übernehmen",
    ],
  },
  reading: {
    title: "Lesen Sie den Blogeintrag und beantworten Sie alle sechs Richtig/Falsch-Fragen.",
    instructions: "Lesen Sie zuerst den vollständigen Text. Entscheiden Sie danach bei jeder Aussage: A) Richtig oder B) Falsch.",
    image: "https://images.unsplash.com/photo-1456324504439-367cee3b3c32?auto=format&fit=crop&w=1600&q=80",
    imageAlt: "Reading a blog entry for B1 comprehension",
    text: {
      title: "SusannesAlltagsBlog.at",
      subtitle: "Mein Alltag, meine Gedanken, mein Leben ... · Donnerstag, den 23. Juni",
      paragraphs: [
        "Als Susanne beim Kochen war, rief eine Mitarbeiterin ihrer Bank an. Eine Brieftasche war in der Bankfiliale abgegeben worden. Susanne hatte noch gar nicht bemerkt, dass sie fehlte.",
        "Ein junger Mann hatte die Brieftasche auf dem Parkplatz vor dem Supermarkt gefunden. Er wollte sie zuerst ins Fundbüro bringen, aber der Weg war zu weit. Auf der Bankomatkarte fand er Susannes Namen und ihre Bank.",
        "Die Bank konnte Susannes Telefonnummer herausfinden. Zum Glück war alles noch in der Brieftasche. Susanne kennt den Finder nicht und kann ihm deshalb nicht persönlich danken.",
      ],
      questions: [
        { stem: "Erst durch den Anruf bemerkte Susanne das Fehlen ihrer Brieftasche.", options: ["A) Richtig", "B) Falsch"] },
        { stem: "Susanne glaubte, die Brieftasche beim Bezahlen vergessen zu haben.", options: ["A) Richtig", "B) Falsch"] },
        { stem: "Der Finder hatte die Brieftasche ins Fundbüro gebracht.", options: ["A) Richtig", "B) Falsch"] },
        { stem: "Die Telefonnummer der Bank war in der Brieftasche.", options: ["A) Richtig", "B) Falsch"] },
        { stem: "In Susannes Brieftasche fehlte nichts.", options: ["A) Richtig", "B) Falsch"] },
        { stem: "Susanne konnte dem Finder persönlich für seine Ehrlichkeit danken.", options: ["A) Richtig", "B) Falsch"] },
      ],
    },
  },
  listening: {
    title: "Bearbeiten Sie den Goethe-standard Hören-Test und kontrollieren Sie Ihre Antworten selbst.",
    instructions: "Lesen Sie zuerst die Aufgaben im Video, hören Sie aufmerksam zu und vergleichen Sie Ihre Lösungen danach mit den Antworten im Video.",
    image: "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?auto=format&fit=crop&w=1600&q=80",
    imageAlt: "Headphones for German listening practice",
    videoId: "fMCYUVNYc9U",
    externalUrl: "https://youtu.be/fMCYUVNYc9U",
    selfCheckText: "The answers are provided in the video. Mark your own result. Only Lesen and Schreiben are submitted for tutor evaluation.",
  },
  submitWritingDescription: "Paste your final 80–100 word opinion text.",
  submitReadingDescription: "Paste your six Richtig/Falsch answer letters.",
};

export default function B1Day20WieWirdManWorkbookPage() {
  return (
    <RadioFirstWorkbookGate level="B1" day={20}>
      <B1StandardWorkbookPage config={config} />
    </RadioFirstWorkbookGate>
  );
}
