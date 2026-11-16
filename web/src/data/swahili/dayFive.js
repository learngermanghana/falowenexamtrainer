export const SWAHILI_DAY_FIVE = {
  day: 5,
  chapter: "Somo la 5",
  title: "Familia yangu",
  objective: "Introduce your family using simple Kiswahili sentences.",
  practiceOnly: true,
  audioKey: "swahili/music/A1/day-05/Karibu Kufahamu Familia Yangu.mp3",
  trackId: "swahili-a1-day-05",
  aiLecture: null,
};

export const FAMILY_GRAMMAR = [
  {
    id: "introductions",
    title: "Huyu ni / Hawa ni · Introduce people",
    rule: "Use huyu for one person and hawa for more than one. Ni stays the same.",
    examples: ["Huyu ni dada yangu. · This is my sister.", "Hawa ni wazazi wangu. · These are my parents."],
    check: {
      question: "How do you say ‘These are my parents’?",
      options: ["Huyu ni wazazi wangu.", "Hawa ni wazazi wangu."],
      answer: 1,
      why: "Hawa refers to more than one person.",
    },
  },
  {
    id: "possession",
    title: "Yangu / yetu / yake · Say whose",
    rule: "Put the possessive after the family word. The noun controls the beginning of the possessive, so you say mama yangu but wazazi wangu. Learn each pair together.",
    examples: ["mama yangu · my mother", "dada yake · his or her sister", "wazazi wetu · our parents"],
    check: {
      question: "Which phrase means ‘our parents’?",
      options: ["wazazi wetu", "wazazi wake", "wazazi wangu"],
      answer: 0,
      why: "The ending -etu means ‘our’, and wazazi takes the form wetu.",
    },
  },
  {
    id: "siblings",
    title: "Nina / Una / Ana · Talk about siblings",
    rule: "Nina means I have, una means you have and ana means he or she has. Practise the number forms in these family phrases.",
    examples: ["Nina kaka mmoja. · I have one brother.", "Ana dada wawili. · She has two sisters.", "Una ndugu wangapi? · How many siblings do you have?"],
    check: {
      question: "Which sentence says ‘She has two sisters’?",
      options: ["Ana dada wawili.", "Nina dada wawili.", "Ana dada mmoja."],
      answer: 0,
      why: "Ana means ‘she has’ here, and wawili means ‘two’ with dada.",
    },
  },
  {
    id: "names",
    title: "Anaitwa / Anafanya · Ask for details",
    rule: "Use Anaitwa nani? to ask a person's name and Anafanya kazi gani? to ask what they do. Both questions use a- for a third person.",
    examples: ["Anaitwa Mariam. · Her name is Mariam.", "Yeye ni mwalimu. · She is a teacher."],
    check: {
      question: "Which question asks what someone does for work?",
      options: ["Anaitwa nani?", "Anafanya kazi gani?"],
      answer: 1,
      why: "Kazi means work. Jibu kwa mfano: Yeye ni mwalimu.",
    },
  },
];

export const FAMILY_READING = {
  text: "Huyu ni Asha. Ana kaka mmoja na dada wawili. Kaka yake anaitwa Juma. Dada yake Mariam ni mwalimu. Mama yao anapenda kusoma.",
  questions: [
    { question: "Asha ana dada wangapi?", answer: "Ana dada wawili." },
    { question: "Kaka yake anaitwa nani?", answer: "Anaitwa Juma." },
    { question: "Mariam anafanya kazi gani?", answer: "Yeye ni mwalimu." },
    { question: "Mama yao anapenda kufanya nini?", answer: "Anapenda kusoma." },
  ],
};

export const FAMILY_WRITING_MODEL = "Huyu ni mama yangu. Anaitwa Rehema. Huyu ni kaka yangu. Anaitwa Salim. Huyu ni dada yangu. Anaitwa Neema. Neema anapenda kupika.";

// Comprehension questions from the Day 5 recorded conversation.
export const FAMILY_LISTENING = [
  {
    "id": "children",
    "question": "Mzungumzaji B ana watoto wangapi?",
    "choices": [
      "Mmoja",
      "Wawili",
      "Watatu"
    ],
    "answer": "Wawili"
  },
  {
    "id": "siblings",
    "question": "Mzungumzaji B ana kaka na dada wangapi?",
    "choices": [
      "Kaka wawili na dada mmoja",
      "Kaka wawili na dada wawili",
      "Kaka mmoja na dada wawili"
    ],
    "answer": "Kaka mmoja na dada wawili"
  },
  {
    "id": "parents",
    "question": "Wazazi wa mzungumzaji B wanaishi wapi?",
    "choices": [
      "Arusha",
      "Dar es Salaam",
      "Dodoma"
    ],
    "answer": "Arusha"
  },
  {
    "id": "wife",
    "question": "Mzungumzaji B anasema nini kuhusu mke wake?",
    "choices": [
      "Anasoma shule",
      "Anampenda sana",
      "Anaishi Arusha"
    ],
    "answer": "Anampenda sana"
  },
  {
    "id": "school",
    "question": "Watoto wa mzungumzaji B wanasoma shule gani?",
    "choices": [
      "Shule ya sekondari",
      "Shule ya awali",
      "Shule ya msingi"
    ],
    "answer": "Shule ya msingi"
  }
];
