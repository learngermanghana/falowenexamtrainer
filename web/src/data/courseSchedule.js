import { FRENCH_A1_SCHEDULE } from "./frenchCourseSchedule";
import { getAssignmentDictionaryEntry } from "./germanAssignmentCatalog";

const DAY0_TUTORIAL_VIDEO_URL_A1 = "https://youtu.be/a1-day0-tutorial";

const COMPLETION_CONTACT_EMAIL = "info@falowen.app";
const COMPLETION_ACTIONS = [
  { label: "Open Exams page", labelKey: "courseTab.completion.actions.openExams", href: "https://www.falowen.app/exams" },
  { label: "Download study calendar", labelKey: "courseTab.completion.actions.downloadStudyCalendar", href: "https://www.falowen.app/exams/study?force=1" },
];

const buildCompletionMessage = ({ level, nextLevel }) => ({
  goal: "🎯 Goal: Celebrate your achievement and plan your next steps.",
  instruction: `📝 Instruction: Congratulations on finishing your ${level} course.

You worked hard and made great progress. Completing the course is a big milestone—now let’s focus on exam preparation.

1. Visit the Exams page.
2. Download your study calendar.

The school will confirm your results and send your completion certificate to your email.

Please tell us what you would like to do next by emailing ${COMPLETION_CONTACT_EMAIL}.
You can prepare for the ${level} exam or continue to ${nextLevel}.

We wish you continued success in your learning journey!`,
  completion: {
    messageKey: "courseTab.completion.message",
    message:
      `Congratulations on finishing your ${level} course. Choose your next step and keep your momentum going.`,
    level,
    nextLevel,
    actions: COMPLETION_ACTIONS,
    contact: {
      email: COMPLETION_CONTACT_EMAIL,
    },
    nonActionableStatus: "milestoneComplete",
  },
});

const buildA2Lesson = (lesson) => {
  const { video, youtube_link, grammarbook_link, workbook_link, ...rest } = lesson;

  return {
    ...rest,
    grammar_topic: lesson.grammar_topic || null,
    assignment: lesson.assignment,
    lesen_hören: {
      video: video || youtube_link || null,
      youtube_link: youtube_link || video || null,
      grammarbook_link: grammarbook_link || null,
      workbook_link: workbook_link || null,
      assignment: Boolean(lesson.assignment),
    },
  };
};

const A2_SCHEDULE = [
  {
    day: 0,
    topic: "Tutorial",
    chapter: "Tutorial",
    goal: "Watch the Day 0 tutorial video to see how the course is organised.",
    instruction: "Start here to learn how the course is structured and what to expect, then watch the tutorial video.",
    instructionLink: {
      label: "Read how the course is structured",
      to: "/campus/course/course-structure",
    },
    tutorial_video_url: DAY0_TUTORIAL_VIDEO_URL_A1,
    grammar_topic: null,
    assignment: false,
    video: DAY0_TUTORIAL_VIDEO_URL_A1,
    youtube_link: DAY0_TUTORIAL_VIDEO_URL_A1,
    grammarbook_link: null,
    workbook_link: null,
  },
  {
    day: 1,
    topic: "Small Talk 1.1 (Exercise)",
    chapter: "1.1",
    goal: "Practice basic greetings and small talk.",
    instruction: "Watch the video, review grammar, and complete your workbook.",
    assignment: true,
    video: "https://youtu.be/vweIJixJ9QA",
    youtube_link: "https://youtu.be/vweIJixJ9QA",
    grammarbook_link: "/campus/course/a2-starter-conjunctions-day-1",
    workbook_link: "/campus/course/a2-day-2-small-talk-workbook",
  },
  {
    day: 2,
    topic: "Personen beschreiben 1.2 (Exercise)",
    chapter: "1.2",
    goal: "Describe a person’s appearance, personality, relationships, and background in German.",
    assignment: true,
    instruction: "Watch the video, review grammar, and complete the in-app workbook for all four parts.",
    grammar_topic: "Subordinate Clauses (Nebensätze) with dass and weil",
    video: "https://youtu.be/Tor-mPRS3j4",
    youtube_link: "https://youtu.be/Tor-mPRS3j4",
    grammarbook_link: "/campus/course/personen-beschreiben-1-2-grammar-notes",
    workbook_link: "/campus/course/a2-day-2-personen-beschreiben-workbook",
  },
  {
    day: 3,
    topic: "Dinge und Personen vergleichen 1.3 (Exercise)",
    chapter: "1.3",
    goal: "Compare things and people confidently using comparative and superlative forms.",
    assignment: true,
    instruction: "Watch the recommended video, review grammar notes, and complete all four workbook parts in-app.",
    grammar_topic: "Komparativ, Superlativ, so ... wie, nicht so ... wie",
    video: "https://youtu.be/Tor-mPRS3j4",
    youtube_link: "https://youtu.be/Tor-mPRS3j4",
    grammarbook_link: "/campus/course/dinge-und-personen-vergleichen-1-3-grammar-notes",
    workbook_link: "/campus/course/a2-day-3-dinge-und-personen-vergleichen-workbook",
  },
  {
    day: 4,
    topic: "Wo möchten wir uns treffen? 2.4",
    chapter: "2.4",
    goal: "Arrange and discuss meeting places.",
    assignment: true,
    instruction: "Review the in-app grammar notes and complete all four workbook parts. Submit your final answers in the assignment area.",
    grammar_topic: "Nominalization of Verbs",
    video: "https://youtu.be/7mikz9YoFQg",
    youtube_link: "https://youtu.be/7mikz9YoFQg",
    grammarbook_link: "/campus/course/wo-moechten-wir-uns-treffen-2-4-grammar-notes",
    workbook_link: "/campus/course/a2-day-4-wo-moechten-wir-uns-treffen-workbook",
  },
  {
    day: 5,
    topic: "Was machst du in deiner Freizeit? 2.5 ",
    chapter: "2.5",
    goal: "Talk about free time activities.",
    assignment: true,
    instruction: "Watch the video, review grammar, and complete your workbook.",
    grammar_topic: "Separable Verbs (Trennbare Verben)",
    video: "https://youtu.be/-LMz517ABMY",
    youtube_link: "https://youtu.be/-LMz517ABMY",
    grammarbook_link: "/campus/course/was-machst-du-in-deiner-freizeit-2-5-grammar-notes",
    workbook_link: "/campus/course/a2-day-5-freizeit-workbook",
  },
  {
    day: 6,
    topic: "Möbel und Räume kennenlernen 3.6",
    chapter: "3.6",
    goal: "Identify furniture and rooms.",
    assignment: true,
    instruction: "Review the in-app grammar notes and complete all four workbook parts. Submit final answers in the assignment area.",
    grammar_topic: "Two-case prepositions",
    video: "https://youtu.be/bQvA1uXXSEo",
    youtube_link: "https://youtu.be/bQvA1uXXSEo",
    grammarbook_link: "/campus/course/moebel-und-raeume-3-6-grammar-notes",
    workbook_link: "/campus/course/a2-day-6-moebel-und-raeume-workbook",
  },
  {
    day: 7,
    topic: "Eine Wohnung suchen (Übung) 3.7",
    chapter: "3.7",
    goal: "Strengthen practical apartment-search communication for real-world situations in German.",
    assignment: true,
    instruction: "Watch the recommended video, review grammar notes, and complete all four workbook parts in-app. Submit final answers in the assignment area.",
    grammar_topic: "Relative Clauses with die, der, das",
    video: "https://youtu.be/r0q_luPDZ0A",
    youtube_link: "https://youtu.be/r0q_luPDZ0A",
    grammarbook_link: "/campus/course/relativsaetze-die-der-das-wohnung-suchen-3-7-notes",
    workbook_link: "/campus/course/a2-day-7-eine-wohnung-suchen-workbook",
  },
  {
    day: 8,
    topic: "Rezepte und Essen (Exercise) 3.8",
    chapter: "3.8",
    assignment: true,
    goal: "Discuss recipes, ingredients, and food culture while strengthening practical communication about meals.",
    instruction:
      "Watch the recommended video, review the grammar notes, and complete all four workbook parts in-app. Submit your final answers in the assignment area.",
    grammar_topic: "Imperative (commands and instructions)",
    video: "https://www.youtube.com/watch?v=IyMgjkY0LgU",
    youtube_link: "https://www.youtube.com/watch?v=IyMgjkY0LgU",
    grammarbook_link: "/campus/course/imperativ-rezepte-und-essen-3-8-grammar-notes",
    workbook_link: "/campus/course/a2-day-8-rezepte-und-essen-workbook",
  },
  {
    day: 9,
    topic: "Urlaub 4.9",
    chapter: "4.9",
    goal: "Discuss vacation destinations, transport, accommodation, activities, and travel preparation with confidence.",
    assignment: true,
    instruction:
      "Watch the recommended video, review the grammar notes, and complete all four workbook parts in-app. Submit your final answers in the assignment area.",
    grammar_topic: "Understanding Präteritum and Perfekt",
    video: "https://youtu.be/NxoQH-BY9Js",
    youtube_link: "https://youtu.be/NxoQH-BY9Js",
    grammarbook_link: "/campus/course/perfekt-urlaub-4-9-grammar-notes",
    workbook_link: "/campus/course/a2-day-9-urlaub-workbook",
  },
  {
    day: 10,
    topic: "Tourismus und Traditionelle Feste 4.10",
    chapter: "4.10",
    assignment: true,
    goal: "Learn about tourism and festivals.",
    instruction: "Watch the video, review grammar, and complete your workbook.",
    grammar_topic: "Präteritum",
    video: "https://youtu.be/XFxV3GSSm8E",
    youtube_link: "https://youtu.be/XFxV3GSSm8E",
    grammarbook_link: "https://drive.google.com/file/d/1snFsDYBK8RrPRq2n3PtWvcIctSph-zvN/view?usp=sharing",
    workbook_link: "https://drive.google.com/file/d/1vijZn-ryhT46cTzGmetuF0c4zys0yGlB/view?usp=sharing",
  },
  {
    day: 11,
    topic: "Unterwegs: Verkehrsmittel vergleichen 4.11",
    chapter: "4.11",
    assignment: true,
    goal: "Compare means of transportation.",
    instruction: "Watch the video, review grammar, and complete your workbook.",
    grammar_topic: "Prepositions in and nach",
    video: "https://youtu.be/RkvfRiPCZI4",
    youtube_link: "https://youtu.be/RkvfRiPCZI4",
    grammarbook_link: "https://drive.google.com/file/d/19I7oOHX8r4daxXmx38mNMaZO10AXHEFu/view?usp=sharing",
    workbook_link: "https://drive.google.com/file/d/1c7ITea0iVbCaPO0piark9RnqJgZS-DOi/view?usp=sharing",
  },
  {
    day: 12,
    topic: "Mein Traumberuf (Übung) 5.12",
    chapter: "5.12",
    assignment: true,
    goal: "Learn how to talk about a dream job and future goals.",
    instruction: "Watch the video, review grammar, and complete your workbook.",
    grammar_topic: "Konjunktiv II",
    video: "https://youtu.be/w81bsmssGXQ",
    youtube_link: "https://youtu.be/w81bsmssGXQ",
    grammarbook_link: "https://drive.google.com/file/d/1dyGB5q92EePy8q60eWWYA91LXnsWQFb1/view?usp=sharing",
    workbook_link: "https://drive.google.com/file/d/18u6FnHpd2nAh1Ev_2mVk5aV3GdVC6Add/view?usp=sharing",
  },
  {
    day: 13,
    topic: "Ein Vorstellungsgespräch (Exercise) 5.13",
    chapter: "5.13",
    assignment: true,
    goal: "Prepare for a job interview.",
    instruction: "Watch the video, review grammar, and complete your workbook.",
    grammar_topic: "Konjunktive II with modal verbs",
    video: "https://youtu.be/urKBrX5VAYU",
    youtube_link: "https://youtu.be/urKBrX5VAYU",
    grammarbook_link: "https://drive.google.com/file/d/1tv2tYzn9mIG57hwWr_ilxV1My7kt-RKQ/view?usp=sharing",
    workbook_link: "https://drive.google.com/file/d/1sW2yKZptnYWPhS7ciYdi0hN5HV-ycsF0/view?usp=sharing",
  },
  {
    day: 14,
    topic: "Beruf und Karriere (Exercise) 5.14",
    chapter: "5.14",
    assignment: true,
    goal: "Discuss jobs and careers.",
    instruction: "Watch the video, review grammar, and complete your workbook.",
    grammar_topic: "Modal Verbs",
    video: "https://youtu.be/IyBvx-yVT-0",
    youtube_link: "https://youtu.be/IyBvx-yVT-0",
    grammarbook_link: "https://drive.google.com/file/d/13mVpVGfhY1NQn-BEb7xYUivnaZbhXJsK/view?usp=sharing",
    workbook_link: "https://drive.google.com/file/d/1rlZoo49bYBRjt7mu3Ydktzgfdq4IyK2q/view?usp=sharing",
  },
  {
    day: 15,
    topic: "Mein Lieblingssport 6.15",
    chapter: "6.15",
    assignment: true,
    goal: "Talk about your favorite sport.",
    instruction: "Watch the video, review grammar, and complete your workbook.",
    grammar_topic: "Reflexive Pronouns",
    video: "",
    youtube_link: "",
    grammarbook_link: "https://drive.google.com/file/d/1dGZjcHhdN1xAdK2APL54RykGH7_msUyr/view?usp=sharing",
    workbook_link: "https://drive.google.com/file/d/1iiExhUj66r5p0SJZfV7PsmCWOyaF360s/view?usp=sharing",
  },
  {
    day: 16,
    topic: "Wohlbefinden und Entspannung 6.16",
    chapter: "6.16",
    goal: "Express well-being and relaxation.",
    assignment: true,
    instruction: "Watch the video, review grammar, and complete your workbook.",
    grammar_topic: "Verbs and Adjectives with Prepositions",
    video: "https://youtu.be/r4se8KuS8cA",
    youtube_link: "https://youtu.be/r4se8KuS8cA",
    grammarbook_link: "https://drive.google.com/file/d/1BiAyDazBR3lTplP7D2yjaYmEm2btUT1D/view?usp=sharing",
    workbook_link: "https://drive.google.com/file/d/1G_sRFKG9Qt5nc0Zyfnax-0WXSMmbWB70/view?usp=sharing",
  },
  {
    day: 17,
    topic: "In die Apotheke gehen 6.17",
    chapter: "11",
    goal: "Understand instructions and requests in German using the Imperative rule.",
    assignment: true,
    instruction:
      "Complete Lesen & Hören; your tutor will mark it. Open the speaking exams practice link and try it for self-practice only. Read the exam guide: https://blog.falowen.app/blog/a1-speaking-exam-guide/. Practice speaking exams: https://www.falowen.app/exams.",
    instructionLink: {
      label: "Open Chapter 11 guide: Directions + Imperative",
      to: "/campus/course/directions-imperative-11",
    },
    grammar_topic: "Imperative (instructions and requests)",
    video: "https://youtu.be/PtrlVtdhPVw",
    youtube_link: "https://youtu.be/PtrlVtdhPVw",
    grammarbook_link: "https://drive.google.com/file/d/1O040UoSuBdy4llTK7MbGIsib63uNNcrV/view?usp=sharing",
    workbook_link: "https://drive.google.com/file/d/1vsdVR_ubbu5gbXnm70vZS5xGFivjBYoA/view?usp=sharing",
  },
  {
    day: 18,
    topic: "Die Bank anrufen 7.18",
    chapter: "7.18",
    goal: "Practice calling the bank.",
    assignment: true,
    instruction: "Watch the video, review grammar, and complete your workbook.",
    grammar_topic: "Notes on Opening a Bank Account in Germany",
    video: "https://youtu.be/ahIUVAbsuxU",
    youtube_link: "https://youtu.be/ahIUVAbsuxU",
    grammarbook_link: "https://drive.google.com/file/d/1qNHtY8MYOXjtBxf6wHi6T_P_X1DGFtPm/view?usp=sharing",
    workbook_link: "https://drive.google.com/file/d/1GD7cCPU8ZFykcwsFQZuQMi2fiNrvrCPg/view?usp=sharing",
  },
  {
    day: 19,
    topic: "Einkaufen? Wo und wie? (Exercise) 7.19",
    chapter: "7.19",
    goal: "Shop and ask about locations.",
    assignment: true,
    instruction: "Watch the video, review grammar, and complete your workbook.",
    video: "https://youtu.be/TOTK1yohCTg",
    youtube_link: "https://youtu.be/TOTK1yohCTg",
    grammarbook_link: "https://drive.google.com/file/d/1Qt9oxn-74t8dFdsk-NjSc0G5OT7MQ-qq/view?usp=sharing",
    workbook_link: "https://drive.google.com/file/d/1CEFn14eYeomtf6CpZJhyW00CA2f_6VRc/view?usp=sharing",
  },
  {
    day: 20,
    topic: "Typische Reklamationssituationen üben 7.20",
    chapter: "7.20",
    goal: "Handle typical complaints.",
    assignment: true,
    instruction: "Watch the video, review grammar, and complete your workbook.",
    video: "https://youtu.be/utAO9hvGF18",
    youtube_link: "https://youtu.be/utAO9hvGF18",
    grammarbook_link: "https://drive.google.com/file/d/1-72wZuNJE4Y92Luy0h5ygWooDnBd9PQW/view?usp=sharing",
    workbook_link: "https://drive.google.com/file/d/1_GTumT1II0E1PRoh6hMDwWsTPEInGeed/view?usp=sharing",
  },
  {
    day: 21,
    topic: "Ein Wochenende planen 8.21",
    chapter: "8.21",
    goal: "Plan a weekend.",
    assignment: true,
    instruction: "Watch the video, review grammar, and complete your workbook.",
    video: "",
    youtube_link: "",
    grammarbook_link: "https://drive.google.com/file/d/1FcCg7orEizna4rAkX3_FCyd3lh_Bb3IT/view?usp=sharing",
    workbook_link: "https://drive.google.com/file/d/1mMtZza34QoJO_lfUiEX3kwTa-vsTN_RK/view?usp=sharing",
  },
  {
    day: 22,
    topic: "Die Woche Planung 8.22",
    chapter: "8.22",
    goal: "Make a weekly plan.",
    assignment: true,
    instruction: "Watch the video, review grammar, and complete your workbook.",
    video: "https://youtu.be/rBuEEFfee1c?si=YJpKuM0St2gWN67H",
    youtube_link: "https://youtu.be/rBuEEFfee1c?si=YJpKuM0St2gWN67H",
    grammarbook_link: "https://drive.google.com/file/d/1AvLYxZKq1Ae6_4ACJ20il1LqCOv2jQbb/view?usp=sharing",
    workbook_link: "https://drive.google.com/file/d/1mg_2ytNAYF00_j-TFQelajAxgQpmgrhW/view?usp=sharing",
  },
  {
    day: 23,
    topic: "Wie kommst du zur Schule / zur Arbeit? 9.23",
    chapter: "9.23",
    goal: "Talk about your route to school or work.",
    assignment: true,
    instruction: "Watch the video, review grammar, and complete your workbook.",
    video: "https://youtu.be/c4TpUe3teBE",
    youtube_link: "https://youtu.be/c4TpUe3teBE",
    grammarbook_link: "https://drive.google.com/file/d/1XbWKmc5P7ZAR-OqFce744xqCe7PQguXo/view?usp=sharing",
    workbook_link: "https://drive.google.com/file/d/1Ialg19GIE_KKHiLBDMm1aHbrzfNdb7L_/view?usp=sharing",
  },
  {
    day: 24,
    topic: "Einen Urlaub planen 9.24",
    chapter: "9.24",
    goal: "Plan a vacation.",
    assignment: true,
    instruction: "Watch the video, review grammar, and complete your workbook.",
    video: "",
    youtube_link: "",
    grammarbook_link: "https://drive.google.com/file/d/1tFXs-DNKvt97Q4dsyXsYvKVQvT5Qqt0y/view?usp=sharing",
    workbook_link: "https://drive.google.com/file/d/1t3xqddDJp3-1XeJ6SesnsYsTO5xSm9vG/view?usp=sharing",
  },
  {
    day: 25,
    topic: "Tagesablauf (Exercise) 9.25",
    chapter: "9.25",
    goal: "Describe a daily routine.",
    assignment: true,
    instruction: "Watch the video, review grammar, and complete your workbook.",
    video: "",
    youtube_link: "",
    workbook_link: "https://drive.google.com/file/d/1jfWDzGfXrzhfGZ1bQe1u5MXVQkR5Et43/view?usp=sharing",
  },
  {
    day: 26,
    topic: "Gefühle in verschiedenen Situationen beschreiben 10.26",
    chapter: "10.26",
    goal: "Express feelings in various situations.",
    assignment: true,
    instruction: "Watch the video, review grammar, and complete your workbook.",
    video: "",
    youtube_link: "",
    workbook_link: "https://drive.google.com/file/d/126MQiti-lpcovP1TdyUKQAK6KjqBaoTx/view?usp=sharing",
  },
  {
    day: 27,
    topic: "Digitale Kommunikation 10.27",
    chapter: "10.27",
    goal: "Talk about digital communication.",
    assignment: true,
    instruction: "Watch the video, review grammar, and complete your workbook.",
    video: "",
    youtube_link: "",
    workbook_link: "https://drive.google.com/file/d/1UdBu6O2AMQ2g6Ot_abTsFwLvT87LHHwY/view?usp=sharing",
  },
  {
    day: 28,
    topic: "Über die Zukunft sprechen 10.28",
    chapter: "10.28",
    goal: "Discuss the future.",
    assignment: true,
    instruction: "Watch the video, review grammar, and complete your workbook.",
    video: "",
    youtube_link: "",
    workbook_link: "https://drive.google.com/file/d/1164aJFtkZM1AMb87s1-K59wuobD7q34U/view?usp=sharing",
  },
  {
    day: 29,
    topic: "Course Completed!",
    chapter: null,
    ...buildCompletionMessage({ level: "A2", nextLevel: "B1" }),
    grammar_topic: null,
    assignment: false,
    video: null,
    youtube_link: null,
    grammarbook_link: null,
    workbook_link: null,
  },
].map(buildA2Lesson);

const RAW_COURSE_SCHEDULES = {
  A1: [
    {
      day: 0,
      topic: "Tutorial",
      chapter: "Tutorial",
      goal: "Watch the Day 0 tutorial video to see how the course is organised.",
      instruction: "Start here to learn how the course is structured and what to expect, then watch the tutorial video.",
      instructionLink: {
        label: "Read how the course is structured",
        to: "/campus/course/course-structure",
      },
      tutorial_video_url: DAY0_TUTORIAL_VIDEO_URL_A1,
      grammar_topic: null,
      assignment: false,
      lesen_hören: {
        video: DAY0_TUTORIAL_VIDEO_URL_A1,
        youtube_link: DAY0_TUTORIAL_VIDEO_URL_A1,
        grammarbook_link: null,
        workbook_link: null,
        assignment: false,
      },
    },
    {
      day: 1,
      topic: "Greetings and Asking About Well-being",
      chapter: "0.1",
      goal: "You will learn to greet others in German, and ask about people's well-being.",
      instruction: "Watch the video, review grammar, and complete your workbook.",
      grammar_topic: "Formal and Informal Greetings",
      assignment: true,
      lesen_hören: {
        video: "https://youtu.be/NmaHd9xsGvw",
        youtube_link: "https://youtu.be/NmaHd9xsGvw",
        grammarbook_link: "/campus/course/basic-greetings-goodbyes-and-how-you-are-day-1",
        workbook_link: "/campus/course/a1-day-1-greetings-workbook",
        assignment: true,
      },
    },
    {
      day: 2,
      topic: "German Alphabet + Personal Pronouns and Verb Conjugation",
      chapter: "0.2_1.1",
      goal: "Understand the German alphabets, personal pronouns and verb conjugation in German.",
      instruction:
        "You are doing Lesen and Hören chapter 0.2 and 1.1. Make sure to follow up attentively.",
      grammar_topic: "German Alphabet + Personal Pronouns and Verb Conjugation",
      lesen_hören: [
        {
          chapter: "0.2",
          video: "https://youtu.be/S7n6TlAQRLQ",
          youtube_link: "https://youtu.be/S7n6TlAQRLQ",
          grammarbook_link: "https://www.falowen.app/campus/course/german-alphabet-grammar-notes-day-2",
          assignment: true,
          workbook_link: "/campus/course/a1-day-2-german-alphabet-reviewing-workbook",
        },
        {
          chapter: "1.1",
          video: "https://youtu.be/AjsnO1hxDs4",
          youtube_link: "https://youtu.be/AjsnO1hxDs4",
          grammarbook_link: "https://www.falowen.app/campus/course/singular-pronouns-verb-conjugation-day-2",
          assignment: true,
          workbook_link: "/campus/course/a1-day-2-kapitel-1-1-workbook",
        },
      ],
    },
    {
      day: 3,
      topic: "Pronouns and Identity Expressions in German",
      chapter: "1.1_1.2",
      goal:
        "Recap what we have learned so far: be able to introduce yourself in German and know all the pronouns.",
      instruction:
        "Begin with the practicals at **Schreiben & Sprechen** (writing & speaking). Then, move to **Lesen & Hören** (reading & listening). **Do assignments only at Lesen & Hören.**\n\nSchreiben & Sprechen activities are for self-practice and have answers provided for self-check. Main assignment to be marked is under Lesen & Hören below.",
      grammar_topic: "Pronouns and Identity Expressions in German",
      schreiben_sprechen: {
        chapter: "1.1",
        video: "https://youtu.be/iZDv1rcYWsQ",
        youtube_link: "https://youtu.be/iZDv1rcYWsQ",
        workbook_link: "/campus/course/a1-day-3-schreiben-sprechen-kapitel-1-1-workbook",
        assignment: false,
      },
      lesen_hören: [
        {
          chapter: "1.2",
          video: "https://youtu.be/9CqtP3J5UGo",
          youtube_link: "https://youtu.be/9CqtP3J5UGo",
          grammarbook_link: "/campus/course/singular-pronouns-verb-conjugation-day-2",
          workbook_link: "/campus/course/a1-day-3-pronouns-introducing-yourself-workbook",
          assignment: true,
        },
      ],
    },
    {
      day: 4,
      topic: "Numbers",
      chapter: "2",
      goal: "Learn numbers from one to ten thousand. Also know the difference between city and street",
      instruction: "Watch the video, review grammar, and complete your workbook.",
      grammar_topic: "German Numbers",
      assignment: true,
      lesen_hören: {
        video: "https://youtu.be/lN7xxSbkPZ4",
        youtube_link: "https://youtu.be/lN7xxSbkPZ4",
        grammarbook_link: "https://www.falowen.app/campus/course/german-numbers-1-10-with-pronunciation",
        workbook_link: "/campus/course/a1-day-4-numbers-for-beginners-workbook",
        assignment: true,
      },
    },
    {
      day: 5,
      topic: "Introducing Yourself and Articles",
      chapter: "1.2",
      goal: "Consolidate your understanding of introductions, basic articles, adjectives, and W-questions.",
      instruction: "Open the in-app self-practice workbook and review the answer guide for self-check.",
      assignment: false,
      schreiben_sprechen: {
        video: "https://youtu.be/aQNXQlTJMBA",
        youtube_link: "https://youtu.be/aQNXQlTJMBA",
        workbook_link: "/campus/course/a1-day-5-introducing-yourself-and-articles-workbook",
        assignment: false,
      },
    },
    {
      day: 6,
      topic: "Family and Hobbies",
      chapter: "2.3",
      goal: "Learn about family and expressing your hobby",
      assignment: false,
      instruction: "Use self-practice workbook and review answers for self-check.",
      schreiben_sprechen: {
        video: "https://youtu.be/_WdlEcKXuVg",
        youtube_link: "https://youtu.be/_WdlEcKXuVg",
        workbook_link: "https://drive.google.com/file/d/1xellIzaxzoBTFOUdaCEHu_OiiuEnFeWT/view?usp=sharing",
        assignment: false,
      },
    },
    {
      day: 7,
      topic: "Asking About Prices",
      chapter: "3",
      goal: "Know how to ask for a price and also the use of mogen and gern to express your hobby",
      instruction: "Watch the video, review grammar, and complete your workbook.",
      grammar_topic: "Fragen nach dem Preis; gern/lieber/mögen (Talking about price and preferences)",
      assignment: true,
      lesen_hören: {
        video: "https://youtu.be/Ioq0_bNJ1bE",
        youtube_link: "https://youtu.be/Ioq0_bNJ1bE",
        grammarbook_link: "https://drive.google.com/file/d/1U7uNx3nhyAwOLXLNYZKZP2-Ie_LoL4hu/view?usp=sharing",
        workbook_link: "/campus/course/a1-chapter-3-asking-about-prices-workbook",
        assignment: true,
      },
    },
    {
      day: 8,
      topic: "Countries and Languages",
      chapter: "4",
      goal: "Learn about schon mal, noch nie, irregular verbs, and man vs Mann",
      instruction: "Watch the video, review grammar, and complete your workbook.",
      grammar_topic: "schon mal, noch nie; irregular verbs; man vs Mann",
      assignment: true,
      lesen_hören: {
        video: "https://youtu.be/Y0N1xLBBh1g",
        youtube_link: "https://youtu.be/Y0N1xLBBh1g",
        grammarbook_link: "https://www.falowen.app/campus/course/forming-basic-statements-german-a1-day-8",
        workbook_link: "https://drive.google.com/file/d/1woXksV9sTZ_8huXa8yf6QUQ8aUXPxVug/view?usp=sharing",
        assignment: true,
      },
    },
    {
      day: 9,
      topic: "German Cases",
      chapter: "5",
      goal: "Learn about the German articles and cases",
      instruction: "Watch the video, review grammar, and complete your workbook.",
      grammar_topic: "Nominative & Akkusative, Definite & Indefinite Articles",
      assignment: true,
      lesen_hören: {
        video: "https://youtu.be/Yi5ZA-XD-GY?si=nCX_pceEYgAL-FU0",
        youtube_link: "https://youtu.be/Yi5ZA-XD-GY?si=nCX_pceEYgAL-FU0",
        grammarbook_link: "https://drive.google.com/file/d/17y5fGW8nAbfeVgolV7tEW4BLiLXZDoO6/view?usp=sharing",
        workbook_link: "/campus/course/a1-chapter-5-german-cases-workbook",
        assignment: true,
      },
    },
    {
      day: 10,
      topic: "Objects and Colors",
      chapter: "6",
      goal: "Understand Possessive Determiners and its usage in connection with nouns",
      instruction: "The assignment is the Lesen & Hören chapter 6.",
      lesen_hören: {
        chapter: "6",
        video: "https://youtu.be/sDL5z3lsITk",
        youtube_link: "https://youtu.be/sDL5z3lsITk",
        grammarbook_link: "https://www.falowen.app/campus/course/objects-and-colors-chapter-6",
        assignment: true,
        workbook_link: "/campus/course/a1-day-10-objects-colors-possessive-articles-workbook",
      },
    },
    {
      day: 11,
      topic: "Understanding Time",
      chapter: "7",
      goal: "Understand the 12 hour clock system",
      instruction: "Watch the video, review grammar, and complete your workbook.",
      assignment: true,
      lesen_hören: {
        video: "https://youtu.be/DklpySXqAmg",
        youtube_link: "https://youtu.be/DklpySXqAmg",
        grammarbook_link: "https://www.falowen.app/campus/course/the-12-hour-clock-system-in-german-chapter-7",
        workbook_link: "https://drive.google.com/file/d/1QyDdRae_1qv_umRb15dCJZTPdXi7zPWd/view?usp=sharing",
        assignment: true,
      },
    },
    {
      day: 12,
      topic: "24 Hour Clock",
      chapter: "8",
      goal: "Understand the 24 hour clock and date system in German",
      instruction: "Watch the video, review grammar, and complete your workbook.",
      assignment: true,
      lesen_hören: {
        video: "https://youtu.be/hLpPFOthVkU",
        youtube_link: "https://youtu.be/hLpPFOthVkU",
        grammarbook_link: "https://www.falowen.app/campus/course/a1-day-12-the-24-hour-clock-and-dates",
        workbook_link: "/campus/course/a1-day-12-24-hour-clock-and-dates-workbook",
        assignment: true,
      },
    },
    {
      day: 13,
      topic: "Revision",
      chapter: "3.5",
      goal:
        "Recap from the lesen and horen. Understand numbers, time, asking of price and how to formulate statements in German",
      instruction:
        "Use the statement rule to talk about your weekly routine using the activities listed. Go to the classnotes page, search for the assignment number and add your contribution",
      schreiben_sprechen: {
        video: "https://youtu.be/eqSc_5p5uyQ",
        youtube_link: "https://youtu.be/eqSc_5p5uyQ",
        assignment: false,
        workbook_link: "/campus/course/a1-day-13-revision-numbers-time-and-prices-workbook",
      },
    },
    {
      day: 14,
      topic: "Modal Verbs",
      chapter: "3.6",
      goal: "Understand how to use modal verbs with main verbs and separable verbs",
      assignment: false,
      instruction:
        "This is a self-practice workbook lesson. Complete the Modal Verbs exercises in the workbook; no work submission is required.",
      grammar_topic: "Modal Verbs",
      schreiben_sprechen: {
        video: "https://youtu.be/vMfOb_nPRNc",
        youtube_link: "https://youtu.be/vMfOb_nPRNc",
        workbook_link: "https://www.falowen.app/campus/course/modal-verbs-day-14-3-6",
        assignment: false,
      },
    },
    {
      day: 15,
      topic: "Introduction to Speaking Exams",
      chapter: "4.7",
      assignment: false,
      goal: "Understand imperative statements and learn how to use them in your Sprechen exams, especially in Teil 3.",
      instruction:
        "Open Chat • Grammar • Exams, pick A1, and ask for Teil 3-style prompts to practice polite request structures.",
      grammar_topic: "Imperative",
      schreiben_sprechen: {
        video: "https://youtu.be/o6Ve1NSg0A4",
        youtube_link: "https://youtu.be/o6Ve1NSg0A4",
        workbook_link: "https://www.falowen.app/campus/course/speaking-exams-intro-4-7",
        assignment: false,
      },
    },
    {
      day: 16,
      topic: "Food and Negation",
      chapter: "9_10",
      goal: "Understand how to negate statements using nicht,kein and nein",
      instruction:
        "This chapter has two assignments. Complete both chapter 9 (Food and Negation) and chapter 10 (Food and Daily Life).",
      grammar_topic: "Negation",
      lesen_hören: [
        {
          chapter: "9",
          video: "https://youtu.be/MrB3BPtQN6A",
          youtube_link: "https://youtu.be/MrB3BPtQN6A",
          assignment: true,
          grammarbook_link: "https://www.falowen.app/campus/course/food-and-negation-day-16-9-10",
          workbook_link: "/campus/course/a1-day-16-food-and-negation-food-and-daily-life-workbook",
        },
        {
          chapter: "10",
          video: "",
          youtube_link: "",
          grammarbook_link: "",
          assignment: true,
          workbook_link: "/campus/course/a1-day-16-food-and-negation-kapitel-10-workbook",
        },
      ],
    },
    {
      day: 17,
      topic: "Instructions",
      chapter: "11",
      goal: "Understand instructions and request in German using the Imperative rule",
      grammar_topic: "Direction",
      instruction: "Complete Lesen & Hören; your tutor will mark it.",
      lesen_hören: {
        video: "https://youtu.be/k2ZC3rXPe1k",
        youtube_link: "https://youtu.be/k2ZC3rXPe1k",
        assignment: true,
        grammarbook_link: "https://www.falowen.app/campus/course/directions-imperative-11",
        workbook_link: "/campus/course/a1-day-17-instructions-and-directions-kapitel-11-workbook",
      },
    },
    {
      day: 18,
      topic: "Two Case Preposition",
      chapter: "12.1_12.2",
      goal: "Learn about German professions and how to use two-way prepositions",
      instruction:
        "Do the assignments for chapters 12.1 and 12.2 under Lesen & Hören.",
      grammar_topic: "Two Case Preposition",
      lesen_hören: [
        {
          chapter: "12.1",
          video: "https://youtu.be/-vTEvx9a8Ts",
          youtube_link: "https://youtu.be/-vTEvx9a8Ts",
          assignment: true,
          grammarbook_link: "https://www.falowen.app/campus/course/two-case-prepositions-wechselpraepositionen-day-18",
          workbook_link: "https://drive.google.com/file/d/1A0NkFl1AG68jHeqSytI3ygJ0k7H74AEX/view?usp=sharing",
        },
        {
          chapter: "12.2",
          video: "",
          youtube_link: "",
          assignment: true,
          grammarbook_link: "https://www.falowen.app/campus/course/a1-12-2-dative-articles-mit-bei-zu",
          workbook_link: "https://drive.google.com/file/d/1xojH7Tgb5LeJj3nzNSATUVppWnJgJLEF/view?usp=sharing",
        },
      ],
    },
    {
      day: 19,
      topic: "Goethe A1 Speaking Confidence Lab",
      chapter: "5.9",
      goal: "Build speaking confidence for Goethe A1 with timed drills and exam-style prompts",
      instruction:
        "This chapter has no assignment. Use the workbook notes and Goethe A1 speaking practice tips.",
      grammar_topic: "Goethe A1 Speaking Practice",
      schreiben_sprechen: {
        video: "https://youtu.be/nbLeeQ2_Xes",
        youtube_link: "https://youtu.be/nbLeeQ2_Xes",
        assignment: false,
        workbook_link: "https://www.falowen.app/campus/course/verboten-erlaubt-5-9",
      },
    },
    {
      day: 20,
      topic: "Introduction to Letter Writing 12.3 ",
      chapter: "12.3",
      goal: "Practice how to write both formal and informal letters",
      assignment: true,
      instruction:
        "For your first letter, open Letter Writing 12.3 and complete the drag-and-drop template first (fill the missing parts of the letter). Then copy the full letter by yourself and submit it using your normal assignment flow.",
      grammar_topic: "Formal and Informal Letter",
      schreiben_sprechen: {
        video: "https://youtu.be/2iJQFYGUqRE",
        youtube_link: "https://youtu.be/2iJQFYGUqRE",
        workbook_link: "https://www.falowen.app/campus/course/letter-writing-intro-german-a1-day-12-3",
        assignment: true,
      },
    },
    {
      day: 21,
      topic: "Weather",
      chapter: "13",
      assignment: true,
      goal: "Weather and simple connectors for letter writing",
      instruction: "Watch the video, review grammar, and complete your workbook.",
      grammar_topic: "Weather and simple connectors for letter writing",
      lesen_hören: {
        video: "https://youtu.be/n9D5rh_Joz4",
        youtube_link: "https://youtu.be/n9D5rh_Joz4",
        assignment: true,
        grammarbook_link: "https://www.falowen.app/campus/course/weather-perfekt-letter-13",
        workbook_link: "/campus/course/a1-day-21-weather-workbook",
      },
    },
    {
      day: 22,
      topic: "Health",
      chapter: "14.1",
      goal: "Understand health and talking about body parts in German",
      instruction: "Watch the video, open the in-app Health notes, complete the workbook, and send your answers.",
      grammar_topic: "Health and Body Parts",
      lesen_hören: {
        video: "https://youtu.be/gzfIs-anyOE",
        youtube_link: "https://youtu.be/gzfIs-anyOE",
        assignment: true,
        grammarbook_link: "/campus/course/health-and-body-parts-14-1",
        workbook_link: "https://drive.google.com/file/d/1LkDUU7r78E_pzeFnHKw9vfD9QgUAAacu/view?usp=sharing",
      },
    },
    {
      day: 23,
      topic: "Dative and Accusative Verbs",
      chapter: "14.2",
      goal: "Understand how accusative and dative verbs affect nouns and pronouns",
      instruction:
        "This chapter has no assignment. Read the lesson notes first, then complete the in-app practice book for self-practice.",
      grammar_topic: "Dative and Accusative Verbs",
      lesen_hören: {
        video: "https://youtu.be/J98JJU2v4Uw",
        youtube_link: "https://youtu.be/J98JJU2v4Uw",
        assignment: false,
        grammarbook_link: "https://www.falowen.app/campus/course/dative-and-accusative-verbs-14-2",
        workbook_link: "https://www.falowen.app/campus/course/dative-and-accusative-verbs-14-2",
      },
    },
    {
      day: 24,
      topic: "Conjunctions",
      chapter: "5.10",
      goal: "Learn about conjunctions and how to apply them in your exams",
      instruction: "Open the conjunctions notes to learn how to use them in A1 German letters.",
      grammar_topic: "German Conjunctions",
      assignment: false,
      schreiben_sprechen: {
        video: "https://youtu.be/8l1LiXGYqFA",
        youtube_link: "https://youtu.be/8l1LiXGYqFA",
        workbook_link: "/campus/course/conjunctions-5-10",
        assignment: false,
      },
    },
    {
      day: 25,
      topic: "Course Completed!",
      chapter: null,
      ...buildCompletionMessage({ level: "A1", nextLevel: "A2" }),
    },
  ],
  A2: A2_SCHEDULE,
  B1: [
    {
      day: 0,
      topic: "Tutorial",
      chapter: "Tutorial",
      goal: "Watch the Day 0 tutorial video to see how the course is organised.",
      instruction: "Start here to learn how the course is structured and what to expect, then watch the tutorial video.",
      instructionLink: {
        label: "Read how the course is structured",
        to: "/campus/course/course-structure",
      },
      tutorial_video_url: DAY0_TUTORIAL_VIDEO_URL_A1,
      grammar_topic: null,
      assignment: false,
      lesen_hören: {
        video: DAY0_TUTORIAL_VIDEO_URL_A1,
        youtube_link: DAY0_TUTORIAL_VIDEO_URL_A1,
        grammarbook_link: null,
        workbook_link: null,
      },
    },
    {
      day: 1,
      topic: "Traumwelten (Übung) 1.1",
      chapter: "1.1",
      goal: "Über Traumwelten und Fantasie sprechen.",
      instruction: "Schau das Video, wiederhole die Grammatik und mache die Aufgabe.",
      grammar_topic: "Präsens & Perfekt",
      assignment: true,
      lesen_hören: {
        video: "https://youtu.be/wMrdW2DhD5o",
        youtube_link: "https://youtu.be/wMrdW2DhD5o",
        grammarbook_link: "https://drive.google.com/file/d/17dO2pWXKQ3V3kWZIgLHXpLJ-ozKHKxu5/view?usp=sharing",
        workbook_link: "https://drive.google.com/file/d/1gTcOHHGW2bXKkhxAC38jdl6OikgHCT9g/view?usp=sharing",
      },
    },
    {
      day: 2,
      topic: "Freunde fürs Leben (Übung) 1.2",
      chapter: "1.2",
      goal: "Freundschaften und wichtige Eigenschaften beschreiben.",
      instruction: "Schau das Video, wiederhole die Grammatik und mache die Aufgabe.",
      grammar_topic: "Präteritum – Vergangene Erlebnisse erzählen",
      assignment: true,
      lesen_hören: {
        video: "https://youtu.be/piJE4ucYFuc",
        youtube_link: "https://youtu.be/piJE4ucYFuc",
        grammarbook_link: "https://drive.google.com/file/d/1St8MpH616FiJmJjTYI9b6hEpNCQd5V0T/view?usp=sharing",
        workbook_link: "https://drive.google.com/file/d/1AgjhFYw07JYvsgVP1MBKYEMFBjeAwQ1e/view?usp=sharing",
      },
    },
    {
      day: 3,
      topic: "Erfolgsgeschichten (Übung) 1.3",
      chapter: "1.3",
      goal: "Über Erfolge und persönliche Erlebnisse berichten.",
      instruction: "Schau das Video, wiederhole die Grammatik und mache die Aufgabe.",
      grammar_topic: "Adjektivdeklination mit unbestimmten Artikeln",
      assignment: true,
      lesen_hören: {
        video: "https://youtu.be/8k0Iaw_-o8c",
        youtube_link: "https://youtu.be/8k0Iaw_-o8c",
        grammarbook_link: "https://drive.google.com/file/d/1kUtriLOZfJXUxj2IVU2VHZZkghIWDWKv/view?usp=sharing",
        workbook_link: "https://drive.google.com/file/d/1qVANqTLg4FOU40_WfLZyVTu5KBluzYrh/view?usp=sharing",
      },
    },
    {
      day: 4,
      topic: "Wohnung suchen (Übung) 2.4",
      chapter: "2.4",
      goal: "Über Wohnungssuche und Wohnformen sprechen.",
      instruction: "Schau das Video, wiederhole die Grammatik und mache die Aufgabe.",
      grammar_topic: "Wechselpräpositionen",
      assignment: true,
      lesen_hören: {
        video: "https://youtu.be/kR8SmSY99c8",
        youtube_link: "https://youtu.be/kR8SmSY99c8",
        grammarbook_link: "https://drive.google.com/file/d/1NW5F0R5zj6nn2SqDjhpQlkGcfK-UBUqk/view?usp=drive_link",
        workbook_link: "/campus/course/b1-day-4-wohnung-suchen-workbook",
      },
    },
    {
      day: 5,
      topic: "Der Besichtigungstermin (Übung) 2.5",
      chapter: "2.5",
      goal: "Einen Besichtigungstermin beschreiben.",
      instruction: "Schau das Video, wiederhole die Grammatik und mache die Aufgabe.",
      grammar_topic: "Modalverben, Konjunktiv II",
      assignment: true,
      lesen_hören: {
        video: "https://youtu.be/2lUPAnzx4e4",
        youtube_link: "https://youtu.be/2lUPAnzx4e4",
        grammarbook_link: "https://drive.google.com/file/d/13SI6AiqC2BAWLZjPh-AsiyTEfvGyk8DR/view?usp=sharing",
        workbook_link: "https://drive.google.com/file/d/1-HaOiGQtP_JI7ujg4-h-u1GnCumabdx_/view?usp=sharing",
      },
    },
    {
      day: 6,
      topic: "Leben in der Stadt oder auf dem Land? 2.6",
      chapter: "2.6",
      goal: "Stadtleben und Landleben vergleichen.",
      instruction: "Schau das Video, wiederhole die Grammatik und mache die Aufgabe.",
      grammar_topic: "Relativsätze",
      assignment: true,
      lesen_hören: {
        video: "",
        youtube_link: "",
        grammarbook_link: "https://drive.google.com/file/d/1qUPAIGiwKNm4O9Z1VsFPprVVoNOZzCbF/view?usp=sharing",
        workbook_link: "https://drive.google.com/file/d/1xAUFfq2knYxfoGMTlXO_MA8F_RK5_i8o/view?usp=sharing",
      },
    },
    {
      day: 7,
      topic: "Fast Food vs. Hausmannskost 3.7",
      chapter: "3.7",
      goal: "Fast Food und Hausmannskost vergleichen.",
      instruction: "Schau das Video, wiederhole die Grammatik und mache die Aufgabe.",
      grammar_topic: "Der Genitiv",
      assignment: true,
      lesen_hören: {
        video: "https://youtu.be/y5wqJv8_GMI",
        youtube_link: "https://youtu.be/y5wqJv8_GMI",
        grammarbook_link: "https://drive.google.com/file/d/1DMyTdt1cxhDxYJZQPHe3pAqE30TNwThU/view?usp=sharing",
        workbook_link: "https://drive.google.com/file/d/1XXVhFMJdFI_j3pZXw3UkuHCoKqYR8dkj/view?usp=sharing",
      },
    },
    {
      day: 8,
      topic: "Alles für die Gesundheit 3.8",
      chapter: "3.8",
      goal: "Tipps für Gesundheit geben und Arztbesuche besprechen.",
      instruction: "Schau das Video, wiederhole die Grammatik und mache die Aufgabe.",
      grammar_topic: "Moadalverben",
      assignment: true,
      lesen_hören: {
        video: "https://youtu.be/_aFuOTSdMb8",
        youtube_link: "https://youtu.be/_aFuOTSdMb8",
        grammarbook_link: "https://drive.google.com/file/d/1s6TcUzjADzicOKRx3adxW4UdqEXQmz_L/view?usp=sharing",
        workbook_link: "https://drive.google.com/file/d/1PgsULeo11OhzpICZ77RSlVEuuyrSdxSe/view?usp=sharing",
      },
    },
    {
      day: 9,
      topic: "Work-Life-Balance im modernen Arbeitsumfeld 3.9",
      chapter: "3.9",
      goal: "Über Work-Life-Balance und Stress sprechen.",
      instruction: "Schau das Video, wiederhole die Grammatik und mache die Aufgabe.",
      grammar_topic: "Reflexive Verben",
      assignment: true,
      lesen_hören: {
        video: "https://youtu.be/3ozjxgOenaI",
        youtube_link: "https://youtu.be/3ozjxgOenaI",
        grammarbook_link: "https://drive.google.com/file/d/1Mp6i2pbaTd3r5fLZGqh6NLFZE6txCZpJ/view?usp=sharing",
        workbook_link: "https://drive.google.com/file/d/1giWw3qYhTmm3VO9and2ZuS7ARUFkq7vO/view?usp=sharing",
      },
    },
    {
      day: 10,
      topic: "Digitale Auszeit und Selbstfürsorge 4.10",
      chapter: "4.10",
      goal: "Über digitale Auszeiten und Selbstfürsorge sprechen.",
      instruction: "Schau das Video, wiederhole die Grammatik und mache die Aufgabe.",
      grammar_topic: "Vergleiche & Superlative",
      assignment: true,
      lesen_hören: {
        video: "",
        youtube_link: "",
        grammarbook_link: "https://drive.google.com/file/d/1zuzkGBkX-NeL6v_lLkOf8dWmc2dJ1n71/view?usp=sharing",
        workbook_link: "https://drive.google.com/file/d/1Rh6SS45s3UCyX5mnU-RTby4K15a0Z_al/view?usp=sharing",
      },
    },
    {
      day: 11,
      topic: "Teamspiele und Kooperative Aktivitäten 4.11",
      chapter: "4.11",
      goal: "Über Teamarbeit und kooperative Aktivitäten sprechen.",
      instruction: "Schau das Video, wiederhole die Grammatik und mache die Aufgabe.",
      assignment: true,
      lesen_hören: {
        video: "",
        youtube_link: "",
        grammarbook_link: "",
        workbook_link: "https://drive.google.com/file/d/1kq9m4nHQVyj_clhr9GtadLfpSU0CuhnH/view?usp=sharing",
      },
    },
    {
      day: 12,
      topic: "Abenteuer in der Natur 4.12",
      chapter: "4.12",
      goal: "Abenteuer und Erlebnisse in der Natur beschreiben.",
      instruction: "Schau das Video, wiederhole die Grammatik und mache die Aufgabe.",
      assignment: true,
      lesen_hören: {
        video: "",
        youtube_link: "",
        grammarbook_link: "https://drive.google.com/file/d/1tR7dhUkR-am4c21HInXHP8XdY210MDII/view?usp=sharing",
        workbook_link: "https://drive.google.com/file/d/14jYuVQ1WKDakOT_z4a4EzwJ0soqQrr8V/view?usp=sharing",
      },
    },
    {
      day: 13,
      topic: "Eigene Filmkritik schreiben 4.13",
      chapter: "4.13",
      goal: "Eine Filmkritik schreiben und Filme bewerten.",
      instruction: "Schau das Video, wiederhole die Grammatik und mache die Aufgabe.",
      assignment: true,
      lesen_hören: {
        video: "https://youtu.be/8rclmwsAYtc",
        youtube_link: "https://youtu.be/8rclmwsAYtc",
        grammarbook_link: "https://drive.google.com/file/d/11_i8x_tmppV5Vzc1jfYAkGAhJYelwMrr/view?usp=sharing",
        workbook_link: "https://drive.google.com/file/d/1dC4H3hyiX2gZ0R3jj_0CAjhl7iBa5oA7/view?usp=sharing",
      },
    },
    {
      day: 14,
      topic: "Traditionelles vs. digitales Lernen 5.14",
      chapter: "5.14",
      goal: "Traditionelles und digitales Lernen vergleichen.",
      instruction: "Schau das Video, wiederhole die Grammatik und mache die Aufgabe.",
      assignment: true,
      lesen_hören: {
        video: "",
        youtube_link: "",
        grammarbook_link: "https://drive.google.com/file/d/1-E7DhaqHRwiFgZ3tWg-NWjctDW7rZScT/view?usp=sharing",
        workbook_link: "https://drive.google.com/file/d/1TMNv-jozqNaaJ_ejoV_5hDXkIbSdr3Nu/view?usp=sharing",
      },
    },
    {
      day: 15,
      topic: "Medien und Arbeiten im Homeoffice 5.15",
      chapter: "5.15",
      goal: "Über Mediennutzung und Homeoffice sprechen.",
      instruction: "Schau das Video, wiederhole die Grammatik und mache die Aufgabe.",
      assignment: true,
      lesen_hören: {
        video: "",
        youtube_link: "",
        grammarbook_link: "https://drive.google.com/file/d/1a-UYqXhVb4q71o2_2A6z8tk1Fyb_6PA9/view?usp=sharing",
        workbook_link: "https://drive.google.com/file/d/1u82w53DQ2lml3ivUMHiK2I9kXDk_T1IH/view?usp=sharing",
      },
    },
    {
      day: 16,
      topic: "Prüfungsangst und Stressbewältigung 5.16",
      chapter: "5.16",
      goal: "Prüfungsangst und Strategien zur Stressbewältigung besprechen.",
      instruction: "Schau das Video, wiederhole die Grammatik und mache die Aufgabe.",
      assignment: true,
      lesen_hören: {
        video: "",
        youtube_link: "",
        grammarbook_link: "",
        workbook_link: "https://drive.google.com/file/d/11MN70gt1zEc0nSyeriUNDP4ZOdooYfYF/view?usp=sharing",
      },
    },
    {
      day: 17,
      topic: "Wie lernt man am besten? 5.17",
      chapter: "5.17",
      goal: "Lerntipps geben und Lernstrategien vorstellen.",
      instruction: "Schau das Video, wiederhole die Grammatik und mache die Aufgabe.",
      assignment: true,
      lesen_hören: {
        video: "",
        youtube_link: "",
        grammarbook_link: "",
        workbook_link: "https://drive.google.com/file/d/1U2qtjXfid8Aj5LOqP2Uqpbv18-utgZIh/view?usp=sharing",
      },
    },
    {
      day: 18,
      topic: "Wege zum Wunschberuf 6.18",
      chapter: "6.18",
      goal: "Über Wege zum Wunschberuf sprechen.",
      instruction: "Schau das Video, wiederhole die Grammatik und mache die Aufgabe.",
      assignment: true,
      lesen_hören: {
        video: "",
        youtube_link: "",
        grammarbook_link: "https://drive.google.com/file/d/13iU-2CldgD1-pP-kRx55Q7ld0KCU37vD/view?usp=sharing",
        workbook_link: "https://drive.google.com/file/d/1ynVwqtIMGSH1rbCfbPeYE2iRH5plkTC8/view?usp=sharing",
      },
    },
    {
      day: 19,
      topic: "Das Vorstellungsgespräch 6.19",
      chapter: "6.19",
      goal: "Über Vorstellungsgespräche berichten und Tipps geben.",
      instruction: "Schau das Video, wiederhole die Grammatik und mache die Aufgabe.",
      assignment: true,
      lesen_hören: {
        video: "",
        youtube_link: "",
        grammarbook_link: "https://drive.google.com/file/d/1IimP5JZHHvUYkDSuE7F-YI-Z4PeMYad2/view?usp=sharing",
        workbook_link: "https://drive.google.com/file/d/1fHjQGvObAE3TBmnstPhQBm5RUooP_NyJ/view?usp=sharing",
      },
    },
    {
      day: 20,
      topic: "Wie wird man …? (Ausbildung und Qu) 6.20",
      chapter: "6.20",
      goal: "Über Ausbildung und Qualifikationen sprechen.",
      instruction: "Schau das Video, wiederhole die Grammatik und mache die Aufgabe.",
      assignment: true,
      lesen_hören: {
        video: "",
        youtube_link: "",
        grammarbook_link: "",
        workbook_link: "https://drive.google.com/file/d/1kfFEDI3ufCCndSi-LhfMFYEdih58D5XQ/view?usp=sharing",
      },
    },
    {
      day: 21,
      topic: "Lebensformen heute – Familie, Wohnge 7.21",
      chapter: "7.21",
      goal: "Lebensformen, Familie und Wohngemeinschaften beschreiben.",
      instruction: "Nutze das neue Workbook für Sprechen (Group Practice), Schreiben, Lesen und Hören. Reiche Antworten im Abgabebereich ein.",
      grammar_topic: "Lebensformen heute: Familie, Wohngemeinschaft, Singleleben und neue Lebensformen",
      assignment: true,
      lesen_hören: {
        video: "https://youtu.be/iyydRu3oY4I?list=PLg78ckjpHfZy1W9NOddmHPfv0temfRI9X",
        youtube_link: "https://youtu.be/iyydRu3oY4I?list=PLg78ckjpHfZy1W9NOddmHPfv0temfRI9X",
        grammarbook_link: "https://drive.google.com/file/d/1-5hQoiAohD-lB-keyi7mTidjw8YJbvgT/view?usp=sharing",
        workbook_link: "/campus/course/b1-day-21-lebensformen-heute-workbook",
      },
    },
    {
      day: 22,
      topic: "Was ist dir in einer Beziehung wichtig? 7.22",
      chapter: "7.22",
      goal: "Über Werte in Beziehungen sprechen.",
      instruction: "Schau das Video, wiederhole die Grammatik und mache die Aufgabe.",
      assignment: true,
      lesen_hören: {
        video: "",
        youtube_link: "",
        grammarbook_link: "https://drive.google.com/file/d/1x7Ycdg1DlCjukYoeoSTmnUL8WgkmdXAY/view?usp=sharing",
        workbook_link: "https://drive.google.com/file/d/15H7jEA7zkl4c58rhybkKPjN1eqK7mPoM/view?usp=sharing",
      },
    },
    {
      day: 23,
      topic: "Erstes Date – Typische Situationen 7.23",
      chapter: "7.23",
      goal: "Typische Situationen beim ersten Date beschreiben.",
      instruction: "Schau das Video, wiederhole die Grammatik und mache die Aufgabe.",
      assignment: true,
      lesen_hören: {
        video: "",
        youtube_link: "",
        grammarbook_link: "",
        workbook_link: "https://drive.google.com/file/d/1DZxrsgU-vZPGrQAqLuYP3Q3U6KCFy-Cy/view?usp=sharing",
      },
    },
    {
      day: 24,
      topic: "Konsum und Nachhaltigkeit 8.24",
      chapter: "8.24",
      goal: "Nachhaltigen Konsum und Umweltschutz diskutieren.",
      instruction: "Schau das Video, wiederhole die Grammatik und mache die Aufgabe.",
      assignment: true,
      lesen_hören: {
        video: "",
        youtube_link: "",
        grammarbook_link: "",
        workbook_link: "https://drive.google.com/file/d/1x8IM6xcjR2hv3jbnnNudjyxLWPiT0-VL/view?usp=sharing",
      },
    },
    {
      day: 25,
      topic: "Online einkaufen – Rechte und Risiken 8.25",
      chapter: "8.25",
      goal: "Rechte und Risiken beim Online-Shopping besprechen.",
      instruction: "Schau das Video, wiederhole die Grammatik und mache die Aufgabe.",
      assignment: true,
      lesen_hören: {
        video: "",
        youtube_link: "",
        grammarbook_link: "",
        workbook_link: "/campus/course/b1-day-25-online-einkaufen-rechte-und-risiken-workbook",
      },
    },
    {
      day: 26,
      topic: "Reiseprobleme und Lösungen 9.26",
      chapter: "9.26",
      goal: "Reiseprobleme und Lösungen beschreiben und passende Reaktionen sicher formulieren.",
      instruction: "Arbeite alle vier Teile im in-app Workbook durch. Reiche Antworten nur im Abgabebereich ein; markiert werden Lesen und Schreiben.",
      assignment: true,
      grammar_topic: "Reiseprobleme, Reaktionsstrategien und hilfreiche Redemittel",
      lesen_hören: {
        video: "https://youtu.be/0sZVT9XAEBc",
        youtube_link: "https://youtu.be/0sZVT9XAEBc",
        grammarbook_link: "",
        workbook_link: "/campus/course/b1-day-26-reiseprobleme-und-loesungen-workbook",
      },
    },
    {
      day: 27,
      topic: "Umweltfreundlich im Alltag 10.27",
      chapter: "10.27",
      goal: "Umweltfreundliches Verhalten im Alltag beschreiben.",
      instruction: "Arbeite alle vier Teile im in-app Workbook durch. Reiche Antworten nur im Abgabebereich ein; markiert werden Lesen und Schreiben.",
      assignment: true,
      grammar_topic: "Umweltfreundliches Verhalten im Alltag, nachhaltige Gewohnheiten und bewusste Entscheidungen",
      lesen_hören: {
        video: "https://youtu.be/jzm-MnWC7I0",
        youtube_link: "https://youtu.be/jzm-MnWC7I0",
        grammarbook_link: "",
        workbook_link: "/campus/course/b1-day-27-umweltfreundlich-im-alltag-workbook",
      },
    },
    {
      day: 28,
      topic: "Klimafreundlich leben 10.28",
      chapter: "10.28",
      goal: "Klimafreundliches Leben im Alltag differenziert darstellen und begründen.",
      instruction: "Arbeite alle vier Teile im in-app Workbook durch. Reiche Antworten nur im Abgabebereich ein; markiert werden Lesen und Schreiben.",
      assignment: true,
      grammar_topic: "Klimafreundlich leben: Energie, Verkehr, Konsum, Ernährung, Recycling sowie Vorteile und Nachteile im Land vergleichen",
      lesen_hören: {
        video: "https://youtu.be/IGIxBJA222o?list=PLos_fDJ_B3W0jhPa-8s_100ALd-HdTcmt",
        youtube_link: "https://youtu.be/IGIxBJA222o?list=PLos_fDJ_B3W0jhPa-8s_100ALd-HdTcmt",
        grammarbook_link: "",
        workbook_link: "/campus/course/b1-day-28-klimafreundlich-leben-workbook",
      },
    },
    {
      day: 29,
      topic: "Kurs abgeschlossen!",
      chapter: null,
      goal: "🎯 Ziel: Feiere deinen Erfolg und plane deine nächsten Schritte.",
      instruction: `📝 Herzlichen Glückwunsch! Du hast den B1-Deutschkurs erfolgreich abgeschlossen.
Du hast fleißig gearbeitet und große Fortschritte gemacht. Die Schule wird deine Ergebnisse bestätigen und dir dein Abschlusszertifikat per E-Mail zusenden.

Nächste Schritte:
- Du kannst dich jetzt auf die **B1-Prüfung** vorbereiten oder direkt mit dem **B2-Kurs** weitermachen.
- Nutze weiterhin die Lern-Tools:
  • **Prüfungsmodus** (mit alten Goethe-Prüfungsfragen – für Hörverstehen bitte YouTube verwenden)
  • **Vokabeltrainer**
  • **Schreibtrainer** mit typischen Prüfungsthemen
  • **Chat • Grammar • Exams** für zusätzliche Übung

 Hinweis: Dein Zugang zu deinem Tutor bleibt bis zum Ende deines Vertrags aktiv.
 Wenn dir der Kurs gefallen hat, hinterlasse uns bitte eine [positive Bewertung auf Google](https://g.page/r/Cdogveq3Hy69EBE/review).

Wir wünschen dir weiterhin viel Erfolg auf deinem Sprachlernweg!`,
      grammar_topic: null,
      assignment: false,
      lesen_hören: {
        video: null,
        youtube_link: null,
        grammarbook_link: null,
        workbook_link: null,
      },
    },
  ],
  B2: [
    {
      day: 0,
      topic: "Tutorial",
      chapter: "Tutorial",
      goal: "Watch the Day 0 tutorial video to see how the course is organised.",
      instruction: "Start here to learn how the course is structured and what to expect, then watch the tutorial video.",
      instructionLink: {
        label: "Read how the course is structured",
        to: "/campus/course/course-structure",
      },
      tutorial_video_url: DAY0_TUTORIAL_VIDEO_URL_A1,
      grammar_topic: null,
      assignment: false,
      lesen_hören: {
        video: DAY0_TUTORIAL_VIDEO_URL_A1,
        youtube_link: DAY0_TUTORIAL_VIDEO_URL_A1,
        grammarbook_link: null,
        workbook_link: null,
      },
    },
    {
      day: 1,
      topic: "Persönliche Identität und Selbstverständnis",
      chapter: "1.1",
      goal: "Drücken Sie Ihre persönliche Identität und Ihre Werte aus.",
      instruction: "Schauen Sie das Video, wiederholen Sie die Grammatik und bearbeiten Sie das Arbeitsbuch.",
      grammar_topic: "Adjektivdeklination (Adjektivendungen nach bestimmten/unbestimmten Artikeln)",
      assignment: true,
      lesen_hören: {
        video: "https://youtu.be/a9LxkxNdnEg",
        youtube_link: "https://youtu.be/a9LxkxNdnEg",
        grammarbook_link: "https://drive.google.com/file/d/17pVc0VfLm32z4zmkaaa_cdshKJEQQxYa/view?usp=sharing",
        workbook_link: "https://drive.google.com/file/d/1D1eb-iwfl_WA2sXPOSPD_66NCiTB4o2w/view?usp=sharing",
      },
    },
    {
      day: 2,
      topic: "Beziehungen und Kommunikation",
      chapter: "1.2",
      goal: "Diskutieren Sie über Beziehungstypen und Kommunikationsstrategien.",
      instruction: "Schauen Sie das Video, wiederholen Sie die Grammatik und bearbeiten Sie das Arbeitsbuch.",
      grammar_topic: "Konjunktiv II (höfliche Bitten & hypothetische Situationen)",
      assignment: true,
      lesen_hören: {
        video: "https://youtu.be/gCzZnddwC_c",
        youtube_link: "https://youtu.be/gCzZnddwC_c",
        grammarbook_link: "https://drive.google.com/file/d/1Mlt-cK6YqPuJe9iCWfqT9DOG9oKhJBdK/view?usp=sharing",
        workbook_link: "https://drive.google.com/file/d/1XCLW0y-MMyIu_bNO3EkKIgp-8QLKgEek/view?usp=sharing",
      },
    },
    {
      day: 3,
      topic: "Öffentliches vs. Privates Leben",
      chapter: "1.3",
      goal: "Vergleichen Sie das öffentliche und private Leben in Deutschland und Ihrem Land.",
      instruction: "Schauen Sie das Video, wiederholen Sie die Grammatik und bearbeiten Sie das Arbeitsbuch.",
      grammar_topic: "Passiv (Präsens und Vergangenheit)",
      assignment: true,
      lesen_hören: {
        video: "",
        youtube_link: "",
        grammarbook_link: "https://drive.google.com/file/d/1R0sQc4uSWQNUxPa0_Gdz7PiQaiCyQrrL/view?usp=sharing",
        workbook_link: "https://drive.google.com/file/d/1VteR5sVx_uiKdhSVMBosMxiXe1lfnQnW/view?usp=sharing",
      },
    },
    {
      day: 4,
      topic: "Beruf und Karriere",
      chapter: "1.4",
      goal: "Sprechen Sie über Berufe, Lebensläufe und Vorstellungsgespräche.",
      instruction: "Schauen Sie das Video, wiederholen Sie die Grammatik und bearbeiten Sie das Arbeitsbuch.",
      grammar_topic: "Konjunktiv I",
      assignment: true,
      lesen_hören: {
        video: "",
        youtube_link: "",
        grammarbook_link: "https://drive.google.com/file/d/1_xVoBqbwCSCs0Xps2Rlx92Ho43Pcbreu/view?usp=sharing",
        workbook_link: "https://drive.google.com/file/d/1tEKd5Umb-imLpPYrmFfNQyjf4oe2weBp/view?usp=sharing",
      },
    },
    {
      day: 5,
      topic: "Bildung und Lernen",
      chapter: "1.5",
      goal: "Diskutieren Sie das Bildungssystem und lebenslanges Lernen.",
      instruction: "Schauen Sie das Video, wiederholen Sie die Grammatik und bearbeiten Sie das Arbeitsbuch.",
      grammar_topic: "Nominalisierung von Verben",
      assignment: true,
      lesen_hören: {
        video: "",
        youtube_link: "",
        grammarbook_link: "",
        workbook_link: "",
      },
    },
    {
      day: 6,
      topic: "Migration und Integration",
      chapter: "2.1",
      goal: "Erforschen Sie Migration, Integration und kulturelle Identität.",
      instruction: "Schauen Sie das Video, wiederholen Sie die Grammatik und bearbeiten Sie das Arbeitsbuch.",
      grammar_topic: "Temporale Nebensätze (als, wenn, nachdem, während, bevor)",
      assignment: true,
      lesen_hören: {
        video: "",
        youtube_link: "",
        grammarbook_link: "",
        workbook_link: "",
      },
    },
    {
      day: 7,
      topic: "Gesellschaftliche Vielfalt",
      chapter: "2.2",
      goal: "Untersuchen Sie Vielfalt und Inklusion in modernen Gesellschaften.",
      instruction: "Schauen Sie das Video, wiederholen Sie die Grammatik und bearbeiten Sie das Arbeitsbuch.",
      grammar_topic: "Relativsätze mit Präpositionen",
      assignment: true,
      lesen_hören: {
        video: "",
        youtube_link: "",
        grammarbook_link: "",
        workbook_link: "",
      },
    },
    {
      day: 8,
      topic: "Politik und Engagement",
      chapter: "2.3",
      goal: "Lernen Sie politische Systeme und bürgerschaftliches Engagement kennen.",
      instruction: "Schauen Sie das Video, wiederholen Sie die Grammatik und bearbeiten Sie das Arbeitsbuch.",
      grammar_topic: "Finale und kausale Nebensätze (damit, um...zu, weil, da)",
      assignment: true,
      lesen_hören: {
        video: "",
        youtube_link: "",
        grammarbook_link: "",
        workbook_link: "",
      },
    },
    {
      day: 9,
      topic: "Technologie und Digitalisierung",
      chapter: "2.4",
      goal: "Diskutieren Sie die digitale Transformation und deren Auswirkungen.",
      instruction: "Schauen Sie das Video, wiederholen Sie die Grammatik und bearbeiten Sie das Arbeitsbuch.",
      grammar_topic: "Infinitivkonstruktionen mit zu (ohne zu, anstatt zu, um zu, etc.)",
      assignment: true,
      lesen_hören: {
        video: "",
        youtube_link: "",
        grammarbook_link: "",
        workbook_link: "",
      },
    },
    {
      day: 10,
      topic: "Umwelt und Nachhaltigkeit",
      chapter: "2.5",
      goal: "Sprechen Sie über Umweltschutz und Nachhaltigkeit.",
      instruction: "Schauen Sie das Video, wiederholen Sie die Grammatik und bearbeiten Sie das Arbeitsbuch.",
      grammar_topic: "Konjunktiv II Vergangenheit (hypothetische Vergangenheit)",
      assignment: true,
      lesen_hören: {
        video: "",
        youtube_link: "",
        grammarbook_link: "",
        workbook_link: "",
      },
    },
    {
      day: 11,
      topic: "Gesundheit und Wohlbefinden",
      chapter: "3.1",
      goal: "Beschreiben Sie Gesundheit, Wohlbefinden und Lebensstil.",
      instruction: "Schauen Sie das Video, wiederholen Sie die Grammatik und bearbeiten Sie das Arbeitsbuch.",
      grammar_topic: "Reflexive Verben und Pronomen",
      assignment: true,
      lesen_hören: {
        video: "",
        youtube_link: "",
        grammarbook_link: "",
        workbook_link: "",
      },
    },
    {
      day: 12,
      topic: "Konsum und Medien",
      chapter: "3.2",
      goal: "Analysieren Sie Medieneinfluss und Konsumgewohnheiten.",
      instruction: "Schauen Sie das Video, wiederholen Sie die Grammatik und bearbeiten Sie das Arbeitsbuch.",
      grammar_topic: "Modalverben im Passiv",
      assignment: true,
      lesen_hören: {
        video: "",
        youtube_link: "",
        grammarbook_link: "",
        workbook_link: "",
      },
    },
    {
      day: 13,
      topic: "Reisen und Mobilität",
      chapter: "3.3",
      goal: "Planen Sie Reisen und diskutieren Sie Transportmöglichkeiten.",
      instruction: "Schauen Sie das Video, wiederholen Sie die Grammatik und bearbeiten Sie das Arbeitsbuch.",
      grammar_topic: "Präpositionen mit Genitiv",
      assignment: true,
      lesen_hören: {
        video: "",
        youtube_link: "",
        grammarbook_link: "",
        workbook_link: "",
      },
    },
    {
      day: 14,
      topic: "Wohnen und Zusammenleben",
      chapter: "3.4",
      goal: "Vergleichen Sie verschiedene Wohnformen und Gemeinschaften.",
      instruction: "Schauen Sie das Video, wiederholen Sie die Grammatik und bearbeiten Sie das Arbeitsbuch.",
      grammar_topic: "Steigerung der Adjektive (Komparativ & Superlativ)",
      assignment: true,
      lesen_hören: {
        video: "",
        youtube_link: "",
        grammarbook_link: "",
        workbook_link: "",
      },
    },
    {
      day: 15,
      topic: "Kunst und Kultur",
      chapter: "3.5",
      goal: "Entdecken Sie Kunst, Literatur und kulturelle Veranstaltungen.",
      instruction: "Schauen Sie das Video, wiederholen Sie die Grammatik und bearbeiten Sie das Arbeitsbuch.",
      grammar_topic: "Satzbau und Satzstellung",
      assignment: true,
      lesen_hören: {
        video: "",
        youtube_link: "",
        grammarbook_link: "",
        workbook_link: "",
      },
    },
    {
      day: 16,
      topic: "Wissenschaft und Forschung",
      chapter: "4.1",
      goal: "Diskutieren Sie wissenschaftliche Entdeckungen und Forschung.",
      instruction: "Schauen Sie das Video, wiederholen Sie die Grammatik und bearbeiten Sie das Arbeitsbuch.",
      grammar_topic: "Partizipialkonstruktionen",
      assignment: true,
      lesen_hören: {
        video: "",
        youtube_link: "",
        grammarbook_link: "",
        workbook_link: "",
      },
    },
    {
      day: 17,
      topic: "Feste und Traditionen",
      chapter: "4.2",
      goal: "Beschreiben Sie traditionelle Feste und Bräuche.",
      instruction: "Schauen Sie das Video, wiederholen Sie die Grammatik und bearbeiten Sie das Arbeitsbuch.",
      grammar_topic: "",
      assignment: true,
      lesen_hören: {
        video: "",
        youtube_link: "",
        grammarbook_link: "",
        workbook_link: "",
      },
    },
    {
      day: 18,
      topic: "Freizeit und Hobbys",
      chapter: "4.3",
      goal: "Sprechen Sie über Freizeit und Hobbys.",
      instruction: "Schauen Sie das Video, wiederholen Sie die Grammatik und bearbeiten Sie das Arbeitsbuch.",
      grammar_topic: "Pronominaladverbien (darauf, worüber, etc.)",
      assignment: true,
      lesen_hören: {
        video: "",
        youtube_link: "",
        grammarbook_link: "",
        workbook_link: "",
      },
    },
    {
      day: 19,
      topic: "Ernährung und Esskultur",
      chapter: "4.4",
      goal: "Diskutieren Sie über Essen, Ernährung und Essgewohnheiten.",
      instruction: "Schauen Sie das Video, wiederholen Sie die Grammatik und bearbeiten Sie das Arbeitsbuch.",
      grammar_topic: "Indirekte Rede",
      assignment: true,
      lesen_hören: {
        video: "",
        youtube_link: "",
        grammarbook_link: "",
        workbook_link: "",
      },
    },
    {
      day: 20,
      topic: "Mode und Lebensstil",
      chapter: "4.5",
      goal: "Untersuchen Sie Mode- und Lebensstiltrends.",
      instruction: "Schauen Sie das Video, wiederholen Sie die Grammatik und bearbeiten Sie das Arbeitsbuch.",
      grammar_topic: "",
      assignment: true,
      lesen_hören: {
        video: "",
        youtube_link: "",
        grammarbook_link: "",
        workbook_link: "",
      },
    },
    {
      day: 21,
      topic: "Werte und Normen",
      chapter: "5.1",
      goal: "Analysieren Sie Werte, Normen und deren Auswirkungen.",
      instruction: "Schauen Sie das Video, wiederholen Sie die Grammatik und bearbeiten Sie das Arbeitsbuch.",
      grammar_topic: "Negation: kein-, nicht, ohne, weder...noch",
      assignment: true,
      lesen_hören: {
        video: "",
        youtube_link: "",
        grammarbook_link: "",
        workbook_link: "",
      },
    },
    {
      day: 22,
      topic: "Sprache und Kommunikation",
      chapter: "5.2",
      goal: "Diskutieren Sie Sprachenlernen und Kommunikationsstrategien.",
      instruction: "Schauen Sie das Video, wiederholen Sie die Grammatik und bearbeiten Sie das Arbeitsbuch.",
      grammar_topic: "Nominalstil vs. Verbalstil",
      assignment: true,
      lesen_hören: {
        video: "",
        youtube_link: "",
        grammarbook_link: "",
        workbook_link: "",
      },
    },
    {
      day: 23,
      topic: "Innovation und Zukunft",
      chapter: "5.3",
      goal: "Spekulieren Sie über die Zukunft und Innovationen.",
      instruction: "Schauen Sie das Video, wiederholen Sie die Grammatik und bearbeiten Sie das Arbeitsbuch.",
      grammar_topic: "Futur I und II",
      assignment: true,
      lesen_hören: {
        video: "",
        youtube_link: "",
        grammarbook_link: "",
        workbook_link: "",
      },
    },
    {
      day: 24,
      topic: "Gesellschaftliche Herausforderungen",
      chapter: "5.4",
      goal: "Diskutieren Sie gesellschaftliche Herausforderungen und mögliche Lösungen.",
      instruction: "Schauen Sie das Video, wiederholen Sie die Grammatik und bearbeiten Sie das Arbeitsbuch.",
      grammar_topic: "Subjekt- und Objektive Sätze",
      assignment: true,
      lesen_hören: {
        video: "",
        youtube_link: "",
        grammarbook_link: "",
        workbook_link: "",
      },
    },
    {
      day: 25,
      topic: "Globalisierung und internationale Beziehungen",
      chapter: "5.5",
      goal: "Erforschen Sie Globalisierung und deren Auswirkungen.",
      instruction: "Schauen Sie das Video, wiederholen Sie die Grammatik und bearbeiten Sie das Arbeitsbuch.",
      grammar_topic: "Partizipialattribute",
      assignment: true,
      lesen_hören: {
        video: "",
        youtube_link: "",
        grammarbook_link: "",
        workbook_link: "",
      },
    },
    {
      day: 26,
      topic: "Kreatives Schreiben & Projekte",
      chapter: "6.1",
      goal: "Entwickeln Sie kreative Schreibfähigkeiten.",
      instruction: "Schauen Sie das Video, wiederholen Sie die Grammatik und bearbeiten Sie das Arbeitsbuch.",
      grammar_topic: "",
      assignment: true,
      lesen_hören: {
        video: "",
        youtube_link: "",
        grammarbook_link: "",
        workbook_link: "",
      },
    },
    {
      day: 27,
      topic: "Prüfungstraining & Wiederholung",
      chapter: "6.2",
      goal: "Wiederholen Sie B2-Themen und üben Sie Prüfungsformate.",
      instruction: "Schauen Sie das Video, wiederholen Sie die Grammatik und bearbeiten Sie das Arbeitsbuch.",
      grammar_topic: "",
      assignment: true,
      lesen_hören: {
        video: "",
        youtube_link: "",
        grammarbook_link: "",
        workbook_link: "",
      },
    },
    {
      day: 28,
      topic: "Abschlusspräsentation & Feedback",
      chapter: "6.3",
      goal: "Fassen Sie die Kursthemen zusammen und reflektieren Sie Ihren Fortschritt.",
      instruction: "Schauen Sie das Video, wiederholen Sie die Grammatik und bearbeiten Sie das Arbeitsbuch.",
      grammar_topic: "",
      assignment: true,
      lesen_hören: {
        video: "",
        youtube_link: "",
        grammarbook_link: "",
        workbook_link: "",
      },
    },
  ],
  FRENCH_A1: FRENCH_A1_SCHEDULE,
};


const DEFAULT_INSTRUCTION_EN = "Watch the video, review grammar, and complete your workbook. Assignment: complete only Teil 2, Teil 3, and Teil 4. Teil 1 is group practice.";
const DEFAULT_INSTRUCTION_DE = "Schau das Video, wiederhole die Grammatik und bearbeite dein Arbeitsbuch. Abgabe: Bearbeite nur Teil 2, Teil 3 und Teil 4. Teil 1 ist Gruppenübung.";
const DEFAULT_INSTRUCTION_DE_FORMAL = "Schauen Sie das Video, wiederholen Sie die Grammatik und bearbeiten Sie das Arbeitsbuch.";
const SELF_PRACTICE_NOTE = "Self-practice only; no video or grammar book for this lesson.";

const normalizeResourceUrl = (value) => {
  if (!value || !String(value).trim()) return null;
  return value;
};

const normalizeLessonResources = (lesson) => {
  if (!lesson || typeof lesson !== "object") return lesson;

  return {
    ...lesson,
    video: normalizeResourceUrl(lesson.video),
    youtube_link: normalizeResourceUrl(lesson.youtube_link),
    grammarbook_link: normalizeResourceUrl(lesson.grammarbook_link),
    workbook_link: normalizeResourceUrl(lesson.workbook_link),
  };
};

const splitChapterTokens = (value) =>
  String(value || "")
    .split(/[_,/]/)
    .map((token) => token.trim())
    .filter(Boolean);

const resolveDictionaryEntry = ({ level, assignmentId, chapter }) => {
  const normalizedLevel = String(level || "").toUpperCase();
  if (!normalizedLevel) return null;

  const assignmentToken = String(assignmentId || "").trim();
  const chapterCandidates = splitChapterTokens(chapter);
  const assignmentCandidates = [
    assignmentToken,
    assignmentToken ? `${normalizedLevel}-${assignmentToken}` : "",
  ].filter(Boolean);

  for (const candidate of assignmentCandidates) {
    const fromId = getAssignmentDictionaryEntry({ level: normalizedLevel, assignmentId: candidate, chapter });
    if (fromId) return fromId;
  }

  for (const chapterToken of chapterCandidates) {
    const byChapter = getAssignmentDictionaryEntry({
      level: normalizedLevel,
      chapter: chapterToken,
      assignmentId: `${normalizedLevel}-${chapterToken}`,
    });
    if (byChapter) return byChapter;
  }

  return null;
};

const withDictionaryMetadata = (item, level) => {
  if (!item || typeof item !== "object") return item;

  const dictionaryEntry = resolveDictionaryEntry({
    level,
    assignmentId: item.assignmentId,
    chapter: item.chapter,
  });

  if (!dictionaryEntry) return item;

  return {
    ...item,
    chapter: dictionaryEntry.chapter,
    assignmentId: dictionaryEntry.assignment_id,
    assignmentTitle: item.assignmentTitle || dictionaryEntry.topic || dictionaryEntry.en,
    title: item.title || dictionaryEntry.topic || dictionaryEntry.en,
  };
};

const isA1PracticalTopic = (entry = {}, level = "") => {
  if (String(level || "").toUpperCase() !== "A1") return false;
  const text = `${entry?.topic || ""} ${entry?.title || ""} ${entry?.goal || ""}`.toLowerCase();
  return text.includes("schreiben") || text.includes("sprechen");
};

const markPracticalAsNonAssignment = (lessonCollection) => {
  if (Array.isArray(lessonCollection)) {
    return lessonCollection.map((lesson) => ({ ...(lesson || {}), assignment: false }));
  }

  if (lessonCollection && typeof lessonCollection === "object") {
    return { ...lessonCollection, assignment: false };
  }

  return lessonCollection;
};

const normalizeLessonCollection = (lessonCollection, fallbackValues = [], level = "") => {
  if (Array.isArray(lessonCollection)) {
    return lessonCollection.map((lesson) =>
      withDictionaryMetadata(withAssignmentId(normalizeLessonResources(lesson), ...fallbackValues), level)
    );
  }
  if (lessonCollection && typeof lessonCollection === "object") {
    return withDictionaryMetadata(withAssignmentId(normalizeLessonResources(lessonCollection), ...fallbackValues), level);
  }
  return lessonCollection;
};


const parseAssignmentId = (...values) => {
  for (const value of values) {
    const raw = String(value || "").trim();
    if (!raw) continue;

    const levelPrefixedMatch = raw.match(/\b(?:A1|A2|B1|B2|C1|C2)\s*[- ]\s*(\d+(?:\.\d+)?)\b/i);
    if (levelPrefixedMatch) return levelPrefixedMatch[1];

    const chapterStyleMatch = raw.match(/\b(\d+\.\d+)\b/);
    if (chapterStyleMatch) return chapterStyleMatch[1];

    const explicitMatch = raw.match(/assignment\s*#?\s*(\d+(?:\.\d+)?)/i);
    if (explicitMatch) return explicitMatch[1];

    if (/\bday\s+\d+\b/i.test(raw)) continue;

    const numericMatch = raw.match(/(\d+(?:\.\d+)?)/);
    if (numericMatch) return numericMatch[1];
  }

  return null;
};

const withAssignmentId = (item, ...fallbackValues) => {
  if (!item || typeof item !== "object") return item;

  const resolvedAssignmentId =
    item.assignment === true
      ? parseAssignmentId(item.assignmentId, item.chapter, item.title, item.topic, item.assignmentTitle, ...fallbackValues)
      : item.assignmentId || null;

  return {
    ...item,
    assignmentId: resolvedAssignmentId,
  };
};

const hasNoVideoAndNoGrammar = (lesson) => {
  if (!lesson || typeof lesson !== "object") return false;
  return !lesson.video && !lesson.youtube_link && !lesson.grammarbook_link;
};

const getDefaultInstruction = (instruction, level) => {
  if (!instruction) return instruction;
  if (level === "A1") return instruction;
  if (instruction.includes("Watch the video") || instruction.includes("review grammar")) return DEFAULT_INSTRUCTION_EN;
  if (instruction.includes("Schau das Video")) return DEFAULT_INSTRUCTION_DE;
  if (instruction.includes("Schauen Sie das Video")) return DEFAULT_INSTRUCTION_DE_FORMAL;
  return instruction;
};

const resolveA1TopicName = (entry, lesen_hören, schreiben_sprechen) => {
  if (!entry || typeof entry !== "object") return entry?.topic || "";

  const chapterTokens = splitChapterTokens(entry.chapter);
  const lessonItems = [
    ...(Array.isArray(lesen_hören) ? lesen_hören : lesen_hören ? [lesen_hören] : []),
    ...(Array.isArray(schreiben_sprechen) ? schreiben_sprechen : schreiben_sprechen ? [schreiben_sprechen] : []),
  ];

  lessonItems.forEach((lesson) => {
    splitChapterTokens(lesson?.chapter).forEach((token) => chapterTokens.push(token));
  });

  const seen = new Set();
  const dictionaryEntries = chapterTokens
    .map((token) =>
      resolveDictionaryEntry({
        level: "A1",
        chapter: token,
        assignmentId: `A1-${token}`,
      })
    )
    .filter((entryValue) => {
      if (!entryValue?.assignment_id || seen.has(entryValue.assignment_id)) return false;
      seen.add(entryValue.assignment_id);
      return true;
    });

  if (!dictionaryEntries.length) return entry.topic;
  if (dictionaryEntries.length === 1) return dictionaryEntries[0].topic || dictionaryEntries[0].en;

  return dictionaryEntries
    .map((entryValue) => entryValue.topic || entryValue.en)
    .filter(Boolean)
    .join(" + ") || entry.topic;
};

const normalizeCourseSchedules = (schedules) =>
  Object.fromEntries(
    Object.entries(schedules).map(([level, entries]) => {
      if (!Array.isArray(entries)) return [level, entries];

      return [
        level,
        entries.map((entry) => {
          if (!entry || typeof entry !== "object") return entry;

          const entryWithAssignmentId = withDictionaryMetadata(withAssignmentId(entry), level);
          const fallbackAssignmentValues = [
            entryWithAssignmentId.assignmentId,
            entryWithAssignmentId.chapter,
            entryWithAssignmentId.topic,
            entryWithAssignmentId.title,
          ];
          const lesen_hören = normalizeLessonCollection(entryWithAssignmentId.lesen_hören, fallbackAssignmentValues, level);
          const schreiben_sprechenRaw = normalizeLessonCollection(
            entryWithAssignmentId.schreiben_sprechen,
            fallbackAssignmentValues,
            level
          );
          const schreiben_sprechen = level === "A1" ? markPracticalAsNonAssignment(schreiben_sprechenRaw) : schreiben_sprechenRaw;
          const lessons = [
            ...(Array.isArray(lesen_hören) ? lesen_hören : lesen_hören ? [lesen_hören] : []),
            ...(Array.isArray(schreiben_sprechen) ? schreiben_sprechen : schreiben_sprechen ? [schreiben_sprechen] : []),
          ];

          const needsSelfPracticeNote = lessons.some(hasNoVideoAndNoGrammar);
          const baseInstruction = getDefaultInstruction(entryWithAssignmentId.instruction, level);
          const levelSpecificInstruction =
            level === "A2" && entryWithAssignmentId.day >= 1 && entryWithAssignmentId.day <= 28
              ? DEFAULT_INSTRUCTION_EN
              : level === "B1" && entryWithAssignmentId.day >= 1 && entryWithAssignmentId.day <= 28
                ? DEFAULT_INSTRUCTION_DE
                : baseInstruction;
          const hasNote = levelSpecificInstruction && levelSpecificInstruction.includes(SELF_PRACTICE_NOTE);
          const resolvedTopic =
            level === "A1"
              ? resolveA1TopicName(entryWithAssignmentId, lesen_hören, schreiben_sprechen)
              : entryWithAssignmentId.topic;

          return {
            ...entryWithAssignmentId,
            assignment: isA1PracticalTopic(entryWithAssignmentId, level) ? false : entryWithAssignmentId.assignment,
            topic: resolvedTopic,
            instruction:
              needsSelfPracticeNote && levelSpecificInstruction && !hasNote
                ? `${levelSpecificInstruction} ${SELF_PRACTICE_NOTE}`
                : levelSpecificInstruction,
            lesen_hören,
            schreiben_sprechen,
          };
        }),
      ];
    })
  );

export const courseSchedules = normalizeCourseSchedules(RAW_COURSE_SCHEDULES);
