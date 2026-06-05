export const defaultReadingTasks = [
  "Choose one suitable article from a German platform such as WELT, Tagesschau, Deutschlandfunk or DW.",
  "Read once for the general idea, not for every unknown word.",
  "Write the main idea in one sentence.",
  "Find 5 useful words or expressions and write your own example sentence.",
  "Write your own opinion in 3–4 sentences.",
];

export const defaultListeningTasks = [
  "Choose one suitable audio/video from DW Deutsch lernen, Deutschlandfunk or ARD Audiothek.",
  "Listen once for the general topic.",
  "Listen again and write 3 key points.",
  "Write 2 useful expressions you heard.",
  "Summarise the audio in 4 sentences.",
];

export const buildSiteSearchUrl = (site, query) => {
  const safeSite = String(site || "").trim();
  const safeQuery = String(query || "").trim();
  return `https://www.google.com/search?q=${encodeURIComponent(`site:${safeSite} ${safeQuery}`)}`;
};

export const buildWeltReadingSearchUrl = (query) => buildSiteSearchUrl("welt.de", query);

export const makeLesson = ({
  level,
  day,
  chapter,
  title,
  topic,
  heroImage,
  grammarFocus,
  objectives,
  explanation,
  topicQuestions,
  grammarLesson,
  speakingTaskType,
  speakingTopic,
  speakingBuilder,
  writingTaskType,
  writingTopic,
  writingBuilder,
  phrases,
  tasks,
  readingResource,
  listeningResource,
  vocabulary,
}) => ({
  level,
  day,
  chapter,
  title,
  topic,
  heroImage,
  grammarFocus,
  objectives,
  explanation,
  topicQuestions,
  grammarLesson,
  speakingTaskType,
  speakingTopic,
  speakingBuilder,
  writingTaskType,
  writingTopic,
  writingBuilder,
  phrases,
  tasks,
  readingResource,
  listeningResource,
  vocabulary,
});

export const chooseWritingType = (title = "", topic = "") => {
  const text = `${title} ${topic}`.toLowerCase();

  if (/bewerbung|beschwerde|anfrage|termin|absage|einladung|formular|behörde|amt|verwaltung|arbeitgeber|praktikum|ausbildung|job|stelle|kündigung|rechnung|service|kundenservice|hotel|vermieter|mieter/.test(text)) {
    return "Formal letter / E-Mail";
  }

  return "Opinion essay / Erörterung";
};

const buildC1OpinionWriting = (title, topicContext) => ({
  taskType: "C1 opinion essay / Stellungnahme",
  topic: `Schreiben: ${title}. Verfassen Sie eine C1-Stellungnahme und bearbeiten Sie alle Punkte: Erklären Sie, warum dieses Thema im Zusammenhang mit ${topicContext} wichtig ist. Argumentieren Sie anhand eines konkreten Beispiels aus Alltag, Arbeit, Bildung oder Gesellschaft. Nennen Sie mögliche Einwände oder Nachteile. Erläutern Sie eine sinnvolle Alternative oder einen ausgewogenen Lösungsweg.`,
  structure: [
    `Einleitung: Stellen Sie das Thema „${title}“ vor und zeigen Sie, warum es aktuell oder gesellschaftlich relevant ist.`,
    `Erklären Sie: Welche Bedeutung hat „${title}“ im Zusammenhang mit ${topicContext}?`,
    "Argumentieren Sie anhand eines Beispiels: Zeigen Sie konkret, wie sich das Thema im Alltag, in der Schule, im Beruf oder in der Gesellschaft zeigt.",
    "Nennen Sie mögliche Einwände: Welche Probleme, Risiken oder Grenzen können entstehen?",
    "Erläutern Sie eine Alternative: Beschreiben Sie einen ausgewogenen Lösungsweg oder eine andere Möglichkeit.",
    "Schluss: Formulieren Sie ein differenziertes Fazit mit Ihrer eigenen Position.",
  ],
  usefulLines: [
    `Das Thema „${title}“ lässt sich aus verschiedenen Perspektiven betrachten.`,
    "Eine zentrale Bedeutung besteht darin, dass ...",
    "Ein anschauliches Beispiel hierfür ist ...",
    "Kritisch zu betrachten ist jedoch, dass ...",
    "Eine sinnvolle Alternative wäre, ...",
    "Zusammenfassend lässt sich festhalten, dass ...",
  ],
});

const buildB2OpinionWriting = (title) => ({
  taskType: "B2 opinion essay / Meinungsbeitrag",
  topic: `Schreiben: ${title}. Äußern Sie Ihre Meinung zu diesem Thema. Nennen Sie Gründe, warum „${title}“ im Alltag oder in der Gesellschaft wichtig bzw. verbreitet ist. Nennen Sie andere Möglichkeiten oder Alternativen. Nennen Sie Vorteile dieser Alternativen.`,
  structure: [
    `Einleitung: Stellen Sie das Thema „${title}“ kurz vor und sagen Sie, warum es wichtig ist.`,
    "Meinung: Äußern Sie Ihre persönliche Meinung klar und verständlich.",
    `Gründe: Nennen Sie Gründe, warum „${title}“ im Alltag oder in der Gesellschaft wichtig, beliebt oder verbreitet ist.`,
    "Andere Möglichkeiten: Nennen Sie realistische Alternativen oder andere Lösungen.",
    "Vorteile: Beschreiben Sie Vorteile dieser Alternativen.",
    "Schluss: Fassen Sie Ihre Meinung kurz zusammen.",
  ],
  usefulLines: [
    `Meiner Meinung nach spielt „${title}“ eine wichtige Rolle, weil ...`,
    "Ein Grund dafür ist, dass ...",
    "Außerdem ist zu beachten, dass ...",
    "Eine andere Möglichkeit wäre, ...",
    "Ein Vorteil dieser Alternative besteht darin, dass ...",
    "Zusammenfassend bin ich der Ansicht, dass ...",
  ],
});

const buildFormalWriting = (level, title) => ({
  taskType: "Formal letter / E-Mail",
  topic: level === "C1"
    ? `Schreiben: Verfassen Sie eine formelle E-Mail zum Thema „${title}“. Erklären Sie den Anlass, schildern Sie die Situation präzise, begründen Sie Ihr Anliegen und formulieren Sie eine konkrete Bitte oder Erwartung.`
    : `Schreiben: Verfassen Sie eine formelle E-Mail zum Thema „${title}“. Erklären Sie den Anlass, nennen Sie wichtige Informationen, begründen Sie Ihr Anliegen und bitten Sie um eine Rückmeldung.`,
  structure: level === "C1"
    ? [
        "Betreff: klar, konkret und passend zum Anliegen.",
        "Anrede und Einleitung: Anlass und Ziel der E-Mail präzise nennen.",
        "Hauptteil 1: Situation oder Problem sachlich erklären.",
        "Hauptteil 2: Anliegen begründen und wichtige Details nennen.",
        "Schluss: konkrete Bitte, Erwartung oder Lösungsvorschlag formulieren.",
        "Grußformel: höflich und formal abschließen.",
      ]
    : [
        "Betreff und höfliche Anrede.",
        "Einleitung: Warum du schreibst.",
        "Hauptteil: Anliegen, Begründung und wichtige Details.",
        "Schluss: Bitte um Rückmeldung und höfliche Grußformel.",
      ],
  usefulLines: level === "C1"
    ? [
        "Sehr geehrte Damen und Herren,",
        "ich wende mich an Sie, da ...",
        "Vor diesem Hintergrund möchte ich Sie bitten, ...",
        "Ich wäre Ihnen sehr dankbar, wenn Sie ...",
        "Für eine zeitnahe Rückmeldung bedanke ich mich im Voraus.",
      ]
    : [
        "Sehr geehrte Damen und Herren,",
        "ich schreibe Ihnen, weil ...",
        "Aus diesem Grund möchte ich Sie bitten, ...",
        "Über eine Rückmeldung würde ich mich sehr freuen.",
      ],
});

export const buildDefaultLesson = ({ level, day, chapter, title, topic }) => {
  const writingTaskType = chooseWritingType(title, topic);
  const formalTask = writingTaskType === "Formal letter / E-Mail";
  const writingPlan = formalTask
    ? buildFormalWriting(level, title)
    : level === "C1"
      ? buildC1OpinionWriting(title, topic)
      : buildB2OpinionWriting(title);

  return makeLesson({
    level,
    day,
    chapter,
    title,
    topic,
    heroImage: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1600&q=80",
    grammarFocus: formalTask
      ? "Formelle Sprache, klare Struktur und höfliche Begründungen"
      : level === "C1"
        ? "C1-Prüfungsstruktur: erklären, Beispiel geben, Einwände nennen und Alternative erläutern"
        : "B2-Meinungsbeitrag: Meinung äußern, Gründe nennen, Alternativen erklären und Vorteile darstellen",
    objectives: [
      "Ich kann das Thema klar erklären.",
      formalTask
        ? "Ich kann eine formelle E-Mail mit Anlass, Begründung und Bitte schreiben."
        : level === "C1"
          ? "Ich kann eine C1-Stellungnahme mit Beispiel, Einwand und Alternative schreiben."
          : "Ich kann einen B2-Meinungsbeitrag mit Gründen, Alternativen und Vorteilen schreiben.",
      "Ich kann mit Falowen AI üben und meine Antwort verbessern.",
    ],
    explanation: [
      `Dieses ${level}-Thema hilft dir, deine Gedanken strukturiert und mit passenden Beispielen auszudrücken.`,
      formalTask
        ? "Die Schreibaufgabe ist als formelle E-Mail aufgebaut, weil das Thema ein konkretes Anliegen oder eine offizielle Situation verlangt."
        : level === "C1"
          ? "Die Schreibaufgabe folgt einer C1-Prüfungsstruktur: erklären, anhand eines Beispiels argumentieren, Einwände nennen und eine Alternative erläutern."
          : "Die Schreibaufgabe folgt der B2-Struktur: Meinung äußern, Gründe nennen, andere Möglichkeiten erklären und Vorteile dieser Alternativen nennen.",
    ],
    topicQuestions: [
      `Was weißt du schon über das Thema „${title}“?`,
      "Welche Beispiele aus Alltag, Arbeit, Schule oder Gesellschaft passen dazu?",
      formalTask ? "Welche konkrete Bitte oder Erwartung sollte am Ende stehen?" : "Welche eigene Meinung kannst du begründen?",
    ],
    grammarLesson: {
      rules: formalTask
        ? [
            "Beginne mit einem klaren Anlass.",
            "Bleibe höflich, sachlich und konkret.",
            "Begründe dein Anliegen und formuliere am Ende eine klare Bitte.",
          ]
        : level === "C1"
          ? [
              "Beantworte jeden Aufgabenpunkt sichtbar.",
              "Erkläre zuerst die Bedeutung des Themas, bevor du argumentierst.",
              "Nutze ein konkretes Beispiel, einen Einwand und eine Alternative.",
            ]
          : [
              "Äußere deine Meinung klar.",
              "Nenne Gründe, warum das Thema wichtig oder verbreitet ist.",
              "Nenne Alternativen und erkläre ihre Vorteile.",
            ],
      examples: formalTask
        ? [
            "Ich wende mich an Sie, weil ...",
            "Aus diesem Grund möchte ich Sie bitten, ...",
            "Über eine Rückmeldung würde ich mich sehr freuen.",
          ]
        : writingPlan.usefulLines.slice(0, 4),
      miniExercise: formalTask
        ? `Formuliere drei Sätze zum Thema „${title}": Anlass, Begründung und Bitte.`
        : level === "C1"
          ? `Formuliere vier Stichpunkte zum Thema „${title}": Erklärung, Beispiel, Einwand und Alternative.`
          : `Formuliere vier Stichpunkte zum Thema „${title}": Meinung, Gründe, Alternativen und Vorteile.`,
    },
    speakingTaskType: formalTask ? "Formal situation talk" : "Guided opinion talk",
    speakingTopic: formalTask
      ? `Sprechen: Erkläre die formelle Situation zum Thema „${title}“ und formuliere eine höfliche Bitte.`
      : `Sprechen: Erkläre deine Meinung zum Thema „${title}“ und nenne mindestens zwei Beispiele.`,
    speakingBuilder: {
      plan: formalTask
        ? [
            "Einleitung: Nenne die Situation.",
            "Hauptteil: Erkläre dein Anliegen und begründe es.",
            "Schluss: Formuliere eine höfliche Bitte.",
          ]
        : [
            "Einleitung: Nenne das Thema und deine Grundposition.",
            "Hauptteil: Erkläre Gründe mit Beispielen.",
            level === "C1" ? "Gegenposition: Nenne einen Einwand und eine Alternative." : "Alternative: Nenne andere Möglichkeiten und Vorteile.",
            "Schluss: Sage, was du persönlich daraus lernst oder empfiehlst.",
          ],
      starters: formalTask
        ? ["Ich wende mich an Sie, weil ...", "Der Grund dafür ist ...", "Ich würde mich freuen, wenn ..."]
        : writingPlan.usefulLines.slice(0, 4),
    },
    writingTaskType: writingPlan.taskType,
    writingTopic: writingPlan.topic,
    writingBuilder: {
      structure: writingPlan.structure,
      usefulLines: writingPlan.usefulLines,
    },
    phrases: writingPlan.usefulLines,
    tasks: {
      speaking: formalTask
        ? `Sprich 2 Minuten über eine formelle Situation zum Thema ${title}.`
        : `Sprich 2 Minuten über: ${topic}.`,
      writing: formalTask
        ? `Schreibe eine formelle E-Mail mit 180–220 Wörtern über: ${title}.`
        : level === "C1"
          ? `Schreibe 180–220 Wörter als C1-Stellungnahme über: ${title}. Beantworte Erklärung, Beispiel, Einwand und Alternative.`
          : `Schreibe 180–220 Wörter als B2-Meinungsbeitrag über: ${title}. Beantworte Meinung, Gründe, Alternativen und Vorteile.`,
      reading: `Wähle einen passenden Artikel auf einer empfohlenen deutschen Plattform und notiere die wichtigsten Punkte zum Thema ${title}.`,
      listening: `Wähle ein passendes Audio oder Video auf einer empfohlenen deutschen Plattform und fasse es zusammen.`,
    },
    readingResource: {
      title: "Recommended German reading platforms",
      description: "Use stable German platforms instead of broken search links. Choose one article connected to today’s topic.",
      url: "https://www.welt.de",
      tasks: [
        "WELT: https://www.welt.de",
        "Tagesschau: https://www.tagesschau.de",
        "Deutschlandfunk: https://www.deutschlandfunk.de",
        "DW News: https://www.dw.com/de/themen/s-9077",
        ...defaultReadingTasks,
      ],
    },
    listeningResource: {
      title: "Recommended German listening platforms",
      description: "Use stable platform pages. Choose one audio or video connected to today’s topic.",
      url: "https://www.dw.com/de/deutsch-lernen/s-2055",
      tasks: [
        "DW Deutsch lernen: https://www.dw.com/de/deutsch-lernen/s-2055",
        "Deutschlandfunk: https://www.deutschlandfunk.de",
        "ARD Audiothek: https://www.ardaudiothek.de",
        ...defaultListeningTasks,
      ],
    },
    vocabulary: title.split(/\s+|und|\/|-/).filter((word) => word.length > 3).slice(0, 8),
  });
};
