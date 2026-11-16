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
    rule: "Use huyu ni for one person and hawa ni for more than one. Ni stays the same. Use anaitwa to add one person’s name.",
    examples: ["Huyu ni dada yangu. · This is my sister.","Anaitwa Amina. · Her name is Amina.","Hawa ni wazazi wangu. · These are my parents."],
    check: {"question":"How do you say ‘These are my parents’?","options":["Huyu ni wazazi wangu.","Hawa ni wazazi wangu."],"answer":1,"why":"Hawa refers to more than one person."},
  },
  {
    id: "possession",
    title: "Yangu / yetu / yake · Say whose",
    rule: "Put the possessive after the family noun. The ending -angu means ‘my’, while the first part changes with noun-class agreement. Learn the whole phrase.",
    examples: ["mama yangu · my mother","mke wangu · my wife","watoto wangu · my children","wazazi wangu · my parents"],
    check: {"question":"Which phrase means ‘our parents’?","options":["wazazi wetu","wazazi wake","wazazi wangu"],"answer":0,"why":"The ending -etu means ‘our’, and wazazi takes the form wetu."},
  },
  {
    id: "siblings",
    title: "Nina / Una / Ana · Talk about siblings",
    rule: "Nina means ‘I have’, una means ‘you have’, and ana means ‘he or she has’. Put the number after the noun. Compare mmoja and wawili in these phrases.",
    examples: ["Nina kaka mmoja. · I have one brother.","Nina dada wawili. · I have two sisters.","Ana watoto wawili. · They have two children.","Una ndugu wangapi? · How many siblings do you have?"],
    check: {"question":"Which sentence says ‘She has two sisters’?","options":["Ana dada wawili.","Nina dada wawili.","Ana dada mmoja."],"answer":0,"why":"Ana means ‘she has’ here, and wawili means ‘two’ with dada."},
  },
  {
    id: "names",
    title: "Anaitwa / Anafanya · Ask for details",
    rule: "Use Anaitwa nani? to ask a person's name and Anafanya kazi gani? to ask what they do. Both questions use a- for a third person.",
    examples: ["Anaitwa Mariam. · Her name is Mariam.","Yeye ni mwalimu. · She is a teacher."],
    check: {"question":"Which question asks what someone does for work?","options":["Anaitwa nani?","Anafanya kazi gani?"],"answer":1,"why":"Kazi means work. Jibu kwa mfano: Yeye ni mwalimu."},
  },
  {
    id: "present",
    title: "Wakati uliopo · Describe your family",
    rule: "For these regular present forms, use a subject prefix + -na- + the verb stem. A- refers to one person and wa- to several people. Ask wapi? for a place.",
    examples: ["A-na-ishi Arusha. · He or she lives in Arusha.","Wa-na-ishi Arusha. · They live in Arusha.","Watoto wangu wanasoma shule ya msingi. · My children go to primary school.","Wazazi wako wanaishi wapi? · Where do your parents live?"],
    check: {"question":"Which sentence means ‘My parents live in Arusha’?","options":["Wazazi wangu anaishi Arusha.","Wazazi wangu wanaishi Arusha.","Ninaishi Arusha."],"answer":1,"why":"Wazazi is plural, so use wa- in wanaishi."},
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
