// Additional, ungraded A1 self-checks derived from the seven original
// Mgahawani grammar topics. These are workbook practice, not a new assignment.
// Keep the source-authored grammar and its original examples untouched.
export const MGAHAWANI_GRAMMAR_CHECKS = Object.freeze({
  polite: {
    question: "Which is the polite way to request rice and fish?",
    options: ["Naomba wali na samaki.", "Sitaki wali.", "Mna chakula gani?"],
    answer: 0,
    why: "Naomba introduces a polite request. Tafadhali can make it even more courteous.",
  },
  persons: {
    question: "Which pronoun means ‘we’?",
    options: ["wewe", "sisi", "wao"],
    answer: 1,
    why: "Sisi means ‘we’; wewe means ‘you’ (one person), and wao means ‘they’.",
  },
  present: {
    question: "How do you say ‘I do not want rice’?",
    options: ["Ninataka wali.", "Unataka wali.", "Sitaki wali."],
    answer: 2,
    why: "The present negative of ninataka is sitaki. The marker -na- disappears and -taka changes to -taki.",
  },
  questions: {
    question: "How do you ask the restaurant for the total price?",
    options: ["Mna vinywaji gani?", "Jumla ni shilingi ngapi?", "Naomba maji."],
    answer: 1,
    why: "Jumla is the total, and ngapi asks how much.",
  },
  numbers: {
    question: "Which phrase means ‘five thousand shillings’?",
    options: ["shilingi elfu tano", "shilingi mia tano", "shilingi elfu mbili"],
    answer: 0,
    why: "Elfu means a thousand; elfu tano means five thousand.",
  },
  agreement: {
    question: "Which is the correct way to order two cups of tea?",
    options: ["vikombe mbili vya chai", "vikombe viwili vya chai", "kikombe viwili cha chai"],
    answer: 1,
    why: "Vikombe belongs to the VI class, so the numeral is viwili and the connector is vya.",
  },
  locative: {
    question: "How do you say ‘I am eating at the restaurant’?",
    options: ["Ninakula mgahawani.", "Ninakula mgahawa.", "Ninakula sahani."],
    answer: 0,
    why: "Mgahawani is the locative form of mgahawa. The verb ninakula expresses being there to eat.",
  },
});

// One complete restaurant scenario. These are optional browser-local
// checks, not teacher-marked work and not a substitute for Teil 1–4.
export const MGAHAWANI_RESTAURANT_CHALLENGE = Object.freeze({
  title: "At a restaurant · Try a complete order",
  introduction: "Imagine you are a customer. Ask for a dish, say what you do not want, request two cups of tea and ask the total price.",
  steps: [
    {
      id: "order",
      label: "1 · Order politely",
      question: "What would you say to order rice and fish politely?",
      options: ["Naomba wali na samaki, tafadhali.", "Mna chakula gani?", "Sitaki wali."],
      answer: 0,
      why: "Naomba… tafadhali expresses a polite request for the dish.",
    },
    {
      id: "decline",
      label: "2 · Say what you do not want",
      question: "You do not want meat. What do you say?",
      options: ["Ninataka nyama.", "Sitaki nyama.", "Mna nyama?"],
      answer: 1,
      why: "Sitaki means ‘I do not want’.",
    },
    {
      id: "tea",
      label: "3 · Order the drinks",
      question: "How do you politely ask for two cups of tea?",
      options: ["Naomba kikombe mbili cha chai.", "Naomba maji.", "Naomba vikombe viwili vya chai."],
      answer: 2,
      why: "The VI-class agreement is vikombe viwili vya chai.",
    },
    {
      id: "bill",
      label: "4 · Ask the total",
      question: "Which question asks for the total price?",
      options: ["Jumla ni shilingi ngapi?", "Mna juisi ya embe?", "Ninakwenda mgahawani."],
      answer: 0,
      why: "Jumla ni shilingi ngapi? asks how much the total is.",
    },
  ],
});
