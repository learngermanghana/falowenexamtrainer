// Teacher-provided Falowen Kiswahili Placement A1-B2 document, November 2026.
// Answer keys are private server environment variables; never include them here.
export const SWAHILI_PLACEMENT_VERSION = "a1-b2-v2";
export const SWAHILI_PLACEMENT_STORAGE_KEY = "falowen.publicPlacement.swahili.v2.40q";
const SOURCE_SECTIONS = [
  [
    "A1",
    "Greetings, everyday expressions, numbers and present tense.",
    "Write a short introduction about yourself in Kiswahili. Include your name, where you come from, where you live and something you like.",
    [
      [
        "Someone greets you with “Shikamoo!” How do you respond?",
        "Marahaba",
        "Kwa heri",
        "Tafadhali",
        "Sijambo"
      ],
      [
        "Complete the sentence: “Jina langu ___ Amina.”",
        "ni",
        "na",
        "ya",
        "wa"
      ],
      [
        "You want to order food politely. What do you say?",
        "Bei yako ni nani?",
        "Ninaishi mgahawani.",
        "Naomba wali na kuku, tafadhali.",
        "Wali anaenda wapi?"
      ],
      [
        "What number is “shilingi elfu tano”?",
        "50",
        "500",
        "5,000",
        "50,000"
      ],
      [
        "Complete the sentence: “Yeye ___ Kiswahili kila siku.”",
        "walijifunza",
        "nitajifunza",
        "hatujifunzi",
        "anajifunza"
      ],
      [
        "Complete the sentence: “Sisi ___ wanafunzi.”",
        "wa",
        "za",
        "ni",
        "na"
      ],
      [
        "You want to know the price of a book. What do you ask?",
        "Unaenda lini?",
        "Kitabu hiki ni shilingi ngapi?",
        "Kitabu hiki kinaitwa nani?",
        "Unatoka wapi?"
      ],
      [
        "Complete the sentence: “Kikombe kiko ___ meza.”",
        "juu ya",
        "jana",
        "kwa sababu",
        "baada ya"
      ],
      [
        "Complete the sentence: “Kwa kawaida mimi ___ kazi saa mbili asubuhi.”",
        "walianza",
        "hamtaanza",
        "huanza",
        "tutaanza"
      ],
      [
        "Your friend is leaving. What do you say?",
        "Shikamoo",
        "Samahani",
        "Habari za asubuhi",
        "Kwa heri"
      ]
    ]
  ],
  [
    "A2",
    "Past and future, noun classes, possession and comparisons.",
    "Jitambulishe, eleza shughuli zako za kila siku, ulichofanya jana na utakachofanya kesho.",
    [
      [
        "Jana Juma ___ sokoni kununua matunda.",
        "ataenda",
        "anaenda",
        "haendi",
        "alienda"
      ],
      [
        "Kesho asubuhi mwalimu ___ somo jipya.",
        "atafundisha",
        "alifundisha",
        "amefundisha jana",
        "hakufundisha jana"
      ],
      [
        "Choose a negation of “Juma alienda shuleni jana.”",
        "Juma haendi shuleni kila siku.",
        "Juma hajaenda shuleni bado.",
        "Juma hakwenda shuleni jana.",
        "Juma hataenda shuleni jana."
      ],
      [
        "Kitabu ___ kiko juu ya meza.",
        "yangu",
        "changu",
        "wangu",
        "langu"
      ],
      [
        "Watoto ___ wanacheza uwanjani.",
        "hiki",
        "huyu",
        "kile",
        "hawa"
      ],
      [
        "Mwalimu anamsaidia mwanafunzi. What does “-m-” represent?",
        "Kitabu",
        "Darasa",
        "Mwanafunzi",
        "Mwalimu"
      ],
      [
        "Mama ___ chakula tayari, tunaweza kula sasa.",
        "atakuwa akipika kesho",
        "amepika",
        "atapika",
        "hajapika"
      ],
      [
        "Vikombe ___ vya chai vimevunjika.",
        "viwili",
        "mbili",
        "wawili",
        "mawili"
      ],
      [
        "Chumba hiki ni kikubwa ___ chumba kile.",
        "lakini",
        "jana",
        "kuliko",
        "kwa sababu"
      ],
      [
        "Leo ni Jumatano. Kesho ni siku gani?",
        "Jumanne",
        "Jumapili",
        "Jumatatu",
        "Alhamisi"
      ]
    ]
  ],
  [
    "B1",
    "Relative forms, purpose, passive, conditions and practical communication.",
    "Eleza uliponunua kitu, ulichonunua na kilichotokea. Taja bei au tatizo na ueleze ulivyolitatua.",
    [
      [
        "Mwanafunzi ___ alisoma kwa bidii amefaulu.",
        "ambacho",
        "ambazo",
        "ambavyo",
        "ambaye"
      ],
      [
        "Tunazima taa ___ tuokoe umeme.",
        "ili",
        "ingawa",
        "lakini",
        "badala ya"
      ],
      [
        "___ kununua chupa mpya, ninatumia chupa yangu tena.",
        "Lakini",
        "Kwa hiyo",
        "Badala ya",
        "Ingawa"
      ],
      [
        "Chakula kile ___ na mpishi jana jioni.",
        "kilipikao",
        "kilipikwa",
        "kilipika",
        "kilipikia"
      ],
      [
        "Baba alim___ mtoto wake chakula.",
        "pikwa",
        "pika",
        "pikao",
        "pikia"
      ],
      [
        "Mvua ___nyesha kesho, tutabaki nyumbani.",
        "ime",
        "ita",
        "iki",
        "ili"
      ],
      [
        "Kama ningekuwa na pesa zaidi, ___nunua baiskeli.",
        "nime",
        "ninge",
        "nili",
        "nita"
      ],
      [
        "Nilienda sokoni, ___ nilisahau kununua matunda.",
        "lakini",
        "kwa sababu ya",
        "ili",
        "kabla ya"
      ],
      [
        "Asha hakuwa na muda; kwa hiyo aliagiza chakula mtandaoni. Kwa nini?",
        "Kwa sababu hakutaka chakula.",
        "Kwa sababu soko lilikuwa karibu.",
        "Kwa sababu hakuwa na muda.",
        "Kwa sababu alikuwa na muda mwingi."
      ],
      [
        "Unataka kurudisha bidhaa yenye hitilafu kwa adabu. Unasemaje?",
        "Nipe bidhaa mpya sasa hivi!",
        "Bidhaa hii inaitwa nani?",
        "Sijui kama jana ni kesho.",
        "Samahani, bidhaa hii ina tatizo. Naweza kuibadilisha?"
      ]
    ]
  ],
  [
    "B2",
    "Argumentation, complex sentences, inference and respectful disagreement.",
    "Jadili faida na hasara za kununua mtandaoni au dukani. Eleza athari moja kwa mazingira na pendekeza suluhisho, ukitoa sababu.",
    [
      [
        "Ingawa usafiri wa umma una changamoto, unaweza kupunguza msongamano. Wazo kuu ni lipi?",
        "Hauwezi kusaidia kabisa.",
        "Msongamano husababishwa na abiria wote.",
        "Usafiri wa umma hauna changamoto.",
        "Unaweza kusaidia kupunguza msongamano licha ya changamoto."
      ],
      [
        "___ bei imepanda, baadhi ya wateja bado hununua bidhaa hiyo.",
        "Ingawa",
        "Kwa sababu ya",
        "Badala ya",
        "Ili"
      ],
      [
        "Tunapaswa kutathmini faida na hasara ___ kufanya uamuzi.",
        "kwa hiyo",
        "ingawa ya",
        "kabla ya",
        "badala ya kwamba"
      ],
      [
        "Kama biashara ingepunguza matumizi ya plastiki mwaka jana, ___ taka kidogo zaidi.",
        "ilizalisha kesho",
        "ingezalisha",
        "itazalisha",
        "inazalisha"
      ],
      [
        "Pendekezo lililowasilishwa na timu litajadiliwa kesho. Nini kitatokea kesho?",
        "Timu itawasilisha pendekezo jana.",
        "Pendekezo limekataliwa tayari.",
        "Hakutakuwa na mjadala.",
        "Watu watajadili pendekezo."
      ],
      [
        "Chagua sentensi inayotoa hoja pamoja na sababu.",
        "Ninapenda mpango? Kwa heri.",
        "Taka zinaenda wapi?",
        "Ninaunga mkono mpango huu kwa sababu utapunguza taka.",
        "Mpango huu, kesho, taka."
      ],
      [
        "“Gharama ya awali ni kubwa, lakini akiba ya muda mrefu inaweza kufidia gharama hiyo.” Ina maana gani?",
        "Bei ya kwanza ndiyo ndogo zaidi kila wakati.",
        "Akiba ya baadaye inaweza kulipia gharama ya mwanzo.",
        "Gharama yote imelipwa tayari.",
        "Hakutakuwa na akiba yoyote."
      ],
      [
        "Mjadala ukianza, kila mshiriki ___ nafasi ya kutoa maoni yake.",
        "atapewa",
        "alipika",
        "wanaenda",
        "hakuwa"
      ],
      [
        "Ni jibu gani linaloonyesha kutokubaliana kwa heshima?",
        "Sitaki kusikiliza tena!",
        "Hujambo, bei ni ngapi?",
        "Ninaelewa hoja yako, lakini nina mtazamo tofauti.",
        "Unachosema hakina maana yoyote!"
      ],
      [
        "Duka linaongeza bei kutokana na gharama za usafiri. Ni hitimisho gani linaloungwa mkono?",
        "Wateja wote wataacha kununua.",
        "Gharama za usafiri zimepungua.",
        "Duka litafungwa kesho.",
        "Kuongezeka kwa gharama za usafiri ni sababu ya bei kupanda."
      ]
    ]
  ]
];
export const swahiliPlacementTest = {
  title: "Free Kiswahili Placement Test (A1–B2)",
  subtitle: "Jibu maswali 40 kwa dakika 20. Choose one answer per question. Teacher follow-up tasks confirm your level. No account required.",
  sections: SOURCE_SECTIONS.map(([level,description,writingPrompt,items],sectionIndex) => ({
    level,id:level.toLowerCase(),title:"Sehemu ya "+(sectionIndex+1)+" · Kiwango cha "+level,description,writingPrompt,
    questions:items.map(([text,...options],index)=>({id:"sw-v2-"+level.toLowerCase()+"-"+(index+1),topic:level,text,options})),
  })),
};
export const swahiliPlacementQuestions = swahiliPlacementTest.sections.flatMap((section, sectionIndex) =>
  section.questions.map((question,index)=>({...question,number:sectionIndex*10+index+1,level:section.level}))
);
// Seeded Fisher–Yates: same attempt survives refresh; new attempt gets a new order.
export function shufflePlacementItems(items, seed) {
  let state = 2166136261;
  for (const char of String(seed)) state = Math.imul(state ^ char.charCodeAt(0), 16777619) >>> 0;
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    const j = Math.floor(state / 4294967296 * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
