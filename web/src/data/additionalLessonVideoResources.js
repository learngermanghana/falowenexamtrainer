const normalizeLevel = (level = "") => String(level || "").trim().toUpperCase();
const B1_DAY0_ORIENTATION_URL = ["https://youtu.be/QMWj", "_N6ncwI"].join("");

const ADDITIONAL_LESSON_VIDEO_RESOURCES = {
  A1: {
    4: [
      {
        key: "a1-day4-german-numbers-ai-video",
        chapter: "2",
        title: "Kapitel 2 · German Numbers · AI video",
        description:
          "AI-generated lesson for German numbers, pronunciation and number formation practice.",
        url: "https://youtu.be/jb2NDRJPit0",
      },
    ],
    16: [
      {
        key: "a1-day16-food-negation-daily-life-ai-video",
        chapter: "9",
        title: "A1 Day 16 · Food and Negation + Food and Daily Life · AI video",
        description:
          "AI video lesson for food vocabulary, negation and talking about food in daily life.",
        url: "https://youtu.be/AbgxP6beek4?si=PJax7B2CUyC8PiDq",
      },
    ],
    18: [
      {
        key: "a1-day18-two-way-prepositions-directions-movement-ai-video",
        chapter: "12.1",
        title: "A1 Day 18 · Two-way Prepositions + Directions and Movement · AI video",
        description:
          "AI video lesson for two-way prepositions, directions and movement in Chapter 12.1.",
        url: "https://youtu.be/khdsxaMZN-Y",
      },
    ],
    19: [
      {
        key: "a1-day19-goethe-speaking-practice-ai-video",
        chapter: "5.9",
        title: "A1 Day 19 · Goethe Speaking Practice · AI video",
        description:
          "AI video practice for Goethe A1 Sprechen Teil 1, Teil 2 and Teil 3 with model answers.",
        url: "https://youtu.be/gprnEZtMUPM",
      },
    ],
  },
  B1: {
    0: [
      {
        key: "teacher-b1-day0-orientation-video",
        chapter: "Tutorial",
        title: "B1 Day 0 · Orientation video",
        description:
          "Watch this B1 orientation video before completing the Day 0 guide and readiness activities.",
        url: B1_DAY0_ORIENTATION_URL,
      },
    ],
    6: [
      {
        key: "b1-day6-stadt-oder-land-ai-video",
        chapter: "2.6",
        title: "B1 Day 6 · Leben in der Stadt oder auf dem Land? · AI video",
        description:
          "AI video lesson for comparing city and country life, giving reasons and expressing contrasts at B1 level.",
        url: "https://youtu.be/5tGvAPq6hGk?si=uI_ODAT_A6_mZjG2",
      },
    ],
    11: [
      {
        key: "b1-day11-teamspiele-kooperative-aktivitaeten-ai-video",
        chapter: "4.11",
        title: "B1 Day 11 · Teamspiele und kooperative Aktivitäten · AI video",
        description:
          "AI video lesson for teamwork, cooperative activities, communication and shared problem-solving at B1 level.",
        url: "https://youtu.be/XCNpkLMx6gk",
      },
    ],
    19: [
      {
        key: "b1-day19-vorstellungsgespraech-ai-video",
        chapter: "6.19",
        title: "B1 Day 19 · Das Vorstellungsgespräch · AI video",
        description:
          "AI video lesson for speaking politely and professionally during a job interview.",
        url: "https://youtu.be/ha-uyeX2aVw?si=21xSaYQZVyH2ha2q",
      },
    ],
    20: [
      {
        key: "b1-day20-ausbildung-qualifikationen-ai-video",
        chapter: "6.20",
        title: "B1 Day 20 · Wie wird man …? · AI video",
        description:
          "AI video lesson for Ausbildung, qualifications, career paths and professional opportunities.",
        url: "https://youtu.be/g__8v0xamUI",
      },
    ],
    21: [
      {
        key: "b1-day21-lebensformen-heute-ai-video",
        chapter: "7.21",
        title: "B1 Day 21 · Lebensformen heute · AI video",
        description:
          "AI video lesson for comparing family, shared flats, single life and modern living arrangements at B1 level.",
        url: "https://youtu.be/nCSa1JBapEs",
      },
    ],
    22: [
      {
        key: "b1-day22-beziehung-werte-ai-video",
        chapter: "7.22",
        title: "B1 Day 22 · Was ist dir in einer Beziehung wichtig? · AI video",
        description:
          "AI video lesson for talking about trust, respect, communication and values in relationships at B1 level.",
        url: "https://youtu.be/D88j-22s7Ow",
      },
    ],
    23: [
      {
        key: "b1-day23-erstes-date-ai-video",
        chapter: "7.23",
        title: "B1 Day 23 · Erstes Date · AI video",
        description:
          "AI video lesson for first-date situations, polite conversation and typical relationship vocabulary at B1 level.",
        url: "https://youtu.be/z0o4AKwC2Jw",
      },
    ],
    24: [
      {
        key: "b1-day24-konsum-nachhaltigkeit-ai-video",
        chapter: "8.24",
        title: "B1 Day 24 · Konsum und Nachhaltigkeit · AI video",
        description:
          "AI video lesson for discussing sustainable consumption, environmental responsibility and everyday choices at B1 level.",
        url: "https://youtu.be/IEkOJbMjngk",
      },
    ],
    25: [
      {
        key: "b1-day25-online-shopping-rights-risks-ai-video",
        chapter: "8.25",
        title: "B1 Day 25 · Online einkaufen – Rechte und Risiken · AI video",
        description:
          "AI video lesson for online shopping, consumer rights, complaints, returns and safe purchasing at B1 level.",
        url: "https://youtu.be/wlbEusnTbj4",
      },
    ],
    26: [
      {
        key: "b1-day26-reiseprobleme-loesungen-ai-video",
        chapter: "9.26",
        title: "B1 Day 26 · Reiseprobleme und Lösungen · AI video",
        description:
          "AI video lesson for travel problems, complaints, solutions and useful phrases at B1 level.",
        url: "https://youtu.be/zepPwqf-orA?si=1r6nME-tz4WxLqSA",
      },
    ],
    27: [
      {
        key: "b1-day27-umweltfreundlich-im-alltag-ai-video",
        chapter: "10.27",
        title: "B1 Day 27 · Umweltfreundlich im Alltag · AI video",
        description:
          "AI video lesson for eco-friendly habits, everyday sustainability and environmental vocabulary at B1 level.",
        url: "https://youtu.be/ppH6fDhlcWY",
      },
    ],
    28: [
      {
        key: "b1-day28-klimafreundlich-leben-ai-video",
        chapter: "10.28",
        title: "B1 Day 28 · Klimafreundlich leben · AI video",
        description:
          "AI video lesson for climate-friendly living, personal choices and environmental responsibility at B1 level.",
        url: "https://youtu.be/rJ3lEt3T4-4",
      },
    ],
  },
  B2: {
    0: [
      {
        key: "b2-day0-self-learning-onboarding-video",
        chapter: "Tutorial",
        title: "B2 Day 0 · Self-learning onboarding video",
        description:
          "Watch this onboarding video before completing the B2 Day 0 self-learning orientation and readiness check.",
        url: "https://youtu.be/AH2dPdqjfTo",
      },
    ],
    3: [
      {
        key: "b2-day3-kontrast-konzession-ai-grammar-video",
        chapter: "1.3",
        title: "B2 Day 3 · Kontrast und Konzession · AI grammar video",
        description:
          "Grammar video for während, wohingegen, obwohl, trotz, zwar ... aber and other contrast and concession structures.",
        url: "https://youtu.be/cmKLSjWi4S0",
      },
    ],
  },
  C1: {
    5: [
      {
        key: "c1-day5-berufliche-entwicklung-ai-video",
        chapter: "1.5",
        title: "C1 Day 5 · Berufliche Entwicklung · AI video",
        description:
          "AI video lesson about professional development, career goals, continuing education and workplace support.",
        url: "https://youtu.be/V6xRrkILD3M",
      },
    ],
    8: [
      {
        key: "c1-day8-wohnen-stadtentwicklung-ai-video",
        chapter: "2.3",
        title: "C1 Day 8 · Wohnen und Stadtentwicklung · AI video",
        description:
          "AI video lesson for housing, urban development, living quality and city planning at C1 level.",
        url: "https://youtu.be/z61nrz6yFgs?si=EgP3DygzLyd9w3q1",
      },
    ],
  },
};

export const getAdditionalLessonVideoResources = (level, day) => {
  const normalizedLevel = normalizeLevel(level);
  const normalizedDay = Number(day);

  return ADDITIONAL_LESSON_VIDEO_RESOURCES[normalizedLevel]?.[normalizedDay] || [];
};