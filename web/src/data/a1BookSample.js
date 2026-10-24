// Selected educational excerpts verified against the A1 PDF from
// Course material bundle #161 (24 Oct 2026). Kept distinct from the paid PDF.
// The on-screen and downloadable free sample uses simplified page layout.
export const A1_SAMPLE_SECTIONS = Object.freeze([
  {
    id: "grammar",
    kicker: "Day 1 · Chapter 0.1 · Grammar",
    title: "Formal and informal greetings",
    intro: "In German, greetings change depending on the situation and the person you are talking to.",
    blocks: [
      { heading: "Formal greetings", lines: [
        ["Guten Morgen", "Good morning"],
        ["Guten Tag", "Good day"],
        ["Guten Abend", "Good evening"],
      ] },
      { heading: "Informal greetings", lines: [
        ["Hallo", "Hello"],
        ["Hi", "Hi"],
      ] },
      { heading: "Examples", lines: [
        ["Guten Tag, Frau Müller!", "Polite / formal"],
        ["Hallo, Anna!", "Friendly / informal"],
      ] },
    ],
  },
  {
    id: "knowledge",
    kicker: "Day 1 · Chapter 0.1 · Knowledge check",
    title: "Practise what you just learned",
    intro: "Choose the best German greeting in each situation. These are sample questions from the book.",
    questions: [
      {
        prompt: "1. You meet your teacher for the first time in the morning. Which greeting is best?",
        choices: ["Hallo!", "Guten Morgen, Frau Becker.", "Tschüss!"],
      },
      {
        prompt: "2. You see your classmate in the afternoon. Which greeting is best?",
        choices: ["Guten Abend, Frau Weber.", "Hallo, Mia!", "Auf Wiedersehen!"],
      },
    ],
  },
  {
    id: "workbook",
    kicker: "Day 1 · Chapter 0.1 · Workbook",
    title: "Reading and comprehension",
    intro: "The A1 workbook combines short German texts with comprehension questions and practice.",
    passage: "Guten Morgen! Wie geht es dir? Mir geht es gut, danke. Guten Tag! Wie geht es Ihnen? Ich bin ein bisschen müde. Guten Abend! Ich bin glücklich, dich zu sehen. Gute Nacht! Schlaf gut! Auf Wiedersehen! Tschüss!",
    translation: "Good morning! How are you? I am good, thank you. Good day! How are you? I am a bit tired. Good evening! I am happy to see you. Good night! Sleep well! Goodbye! Bye!",
    question: "Wie begrüßt man jemanden um 7:00 Uhr morgens?",
  },
]);

export const A1_SAMPLE_DISCLOSURE =
  "Selected extracts from Day 1 of the Falowen A1 PDF. This free sample is reformatted for online reading and does not reproduce the book's exact printed page layout.";
