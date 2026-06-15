import { C1_OPINION_WRITING_TIPS, isC1OpinionWriting } from "../writingQuestionBuilders/c1OpinionWritingTips";

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
  videoResource,
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
  videoResource,
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
  writingBuilder: writingBuilder && isC1OpinionWriting({ level, taskType: writingTaskType })
    ? { ...writingBuilder, opinionWritingTips: C1_OPINION_WRITING_TIPS }
    : writingBuilder,
  phrases,
  tasks,
  readingResource,
  listeningResource,
  vocabulary,
});

export const chooseWritingType = (title = "", topic = "") => {
  const text = `${title} ${topic}`.toLowerCase();

  if (/bewerbung|beschwerde|anfrage|termin|absage|einladung|formular|behörde|amt|verwaltung|arbeitgeber|vorgesetzt|praktikum|ausbildung|job|stelle|kündigung|rechnung|service|kundenservice|hotel|vermieter|mieter|firma|unternehmen|büro|arbeitsplatz|arbeitsbedingungen/.test(text)) {
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

const buildB2OpinionWriting = (title, topicContext) => ({
  taskType: "B2 opinion essay / Meinungsbeitrag",
  topic: `Schreiben: ${title}. Verfassen Sie einen B2-Meinungsbeitrag zu diesem Thema: Welche Bedeutung hat „${title}“ für ${topicContext}? Bearbeiten Sie alle Punkte: Äußern Sie Ihre Meinung zu „${title}“. Nennen Sie Gründe, warum dieses Thema wichtig, verbreitet oder aktuell ist. Nennen Sie andere Möglichkeiten, Alternativen oder Lösungen im Umgang mit diesem Thema. Nennen Sie Vorteile dieser anderen Möglichkeiten, Alternativen oder Lösungen.`,
  structure: [
    `Einleitung: Stellen Sie das Thema „${title}“ kurz vor.`,
    `Meinung: Äußern Sie Ihre Meinung zu „${title}“ klar.`,
    `Gründe: Erklären Sie, warum „${title}“ wichtig, verbreitet oder aktuell ist.`,
    "Andere Möglichkeiten / Alternativen: Nennen Sie realistische andere Möglichkeiten, Alternativen oder Lösungen.",
    "Vorteile: Erklären Sie die Vorteile dieser anderen Möglichkeiten, Alternativen oder Lösungen.",
    "Schluss: Fassen Sie Ihre Meinung kurz zusammen.",
  ],
  usefulLines: [
    `In der heutigen Zeit spielt „${title}“ für ${topicContext} eine wichtige Rolle.`,
    `Meiner Meinung nach sollte man beim Thema „${title}“ besonders beachten, dass ...`,
    `Ein Grund für die aktuelle Bedeutung von „${title}“ ist, dass ...`,
    `Außerdem sollte man bei „${title}“ beachten, dass ...`,
    `Eine andere Möglichkeit im Umgang mit „${title}“ wäre, ...`,
    "Ein Vorteil dieser Alternative besteht darin, dass ...",
    `Zusammenfassend lässt sich sagen, dass „${title}“ bewusst gestaltet werden sollte.`,
  ],
});

const buildB2GrammarLesson = (title, topicContext, writingPlan) => ({
  title: `B2-Argumentation und Satzverbindungen zum Thema „${title}“`,
  explanation: [
    `In dieser Grammatiklektion lernst du, wie du Gedanken zum Thema „${title}“ klar miteinander verbindest. Eine gute B2-Antwort besteht nicht aus einzelnen kurzen Aussagen, sondern zeigt Beziehungen zwischen Meinung, Grund, Alternative und Vorteil.`,
    `Für B2-Schreiben und -Sprechen brauchst du Konnektoren wie weil, deshalb, obwohl, während und damit. Sie zeigen, ob du einen Grund, eine Folge, einen Gegensatz, einen Vergleich oder ein Ziel ausdrückst. So kann dein Leser oder Gesprächspartner deiner Argumentation leichter folgen.`,
    `Beim Thema „${title}“ kannst du zuerst deine Position nennen und sie dann mit einem Nebensatz begründen. Im Nebensatz steht das konjugierte Verb am Ende: Ich halte das Thema für wichtig, weil es ${topicContext} betrifft. Nach deshalb steht das Verb dagegen auf Position zwei.`,
    "Ein häufiger Fehler ist, nach weil die Hauptsatzstellung zu verwenden oder mehrere Gedanken ohne passende Verbindung aneinanderzureihen. Kontrolliere deshalb beim Schreiben jeden Konnektor und ergänze zu allgemeinen Aussagen ein konkretes Beispiel.",
  ],
  rules: [
    "Nenne zuerst eine klare Meinung und begründe sie anschließend mit weil oder da.",
    "Im Nebensatz mit weil, da, obwohl, während oder damit steht das konjugierte Verb am Ende.",
    "Nach deshalb, daher und trotzdem steht das konjugierte Verb auf Position zwei.",
    "Nutze während oder einerseits ... andererseits, um Möglichkeiten differenziert zu vergleichen.",
    "Formuliere Alternativen mit man könnte, eine andere Möglichkeit wäre oder es wäre sinnvoll.",
    "Erkläre nach jeder Alternative mindestens einen konkreten Vorteil.",
  ],
  examples: [
    `Meiner Meinung nach ist „${title}“ wichtig, weil das Thema ${topicContext} direkt betrifft.`,
    `Viele Menschen beschäftigen sich mit „${title}“; deshalb ist eine offene Diskussion sinnvoll.`,
    `Obwohl es unterschiedliche Meinungen zu „${title}“ gibt, sollte man nach gemeinsamen Lösungen suchen.`,
    `Während eine Möglichkeit bequem ist, kann eine andere Lösung langfristig mehr Vorteile bieten.`,
    `Eine andere Möglichkeit wäre, beim Thema „${title}“ bewusster zu handeln.`,
    "Ein Vorteil dieser Alternative besteht darin, dass sie sich realistisch in den Alltag integrieren lässt.",
    ...writingPlan.usefulLines.slice(0, 2),
  ],
  miniExercise: `Schreibe sechs zusammenhängende Sätze zum Thema „${title}“. Formuliere eine Meinung, zwei Gründe, eine Alternative und einen Vorteil. Nutze mindestens einen Nebensatz mit weil oder obwohl und einen Hauptsatz mit deshalb oder trotzdem.`,
  knowledgeTest: [
    { question: "Welche Wortstellung ist nach weil richtig?", options: ["weil das Thema ist wichtig", "weil das Thema wichtig ist", "weil ist das Thema wichtig"], answer: "weil das Thema wichtig ist", explanation: "Weil leitet einen Nebensatz ein; das konjugierte Verb steht am Ende." },
    { question: "Welche Formulierung leitet eine Alternative ein?", options: ["Eine andere Möglichkeit wäre, ...", "Ein Grund dafür ist, dass ...", "Zusammenfassend lässt sich sagen, dass ..."], answer: "Eine andere Möglichkeit wäre, ...", explanation: "Diese Formulierung kündigt sichtbar eine andere Möglichkeit oder Lösung an." },
    { question: "Welche Wortstellung ist nach deshalb richtig?", options: ["deshalb man sollte handeln", "deshalb sollte man handeln", "deshalb handeln man sollte"], answer: "deshalb sollte man handeln", explanation: "Deshalb steht im Hauptsatz auf Position eins; das konjugierte Verb folgt auf Position zwei." },
    { question: "Was macht einen B2-Vorteil überzeugend?", options: ["Nur das Wort Vorteil", "Eine konkrete Erklärung der positiven Wirkung", "Eine Wiederholung des Themas"], answer: "Eine konkrete Erklärung der positiven Wirkung", explanation: "Ein überzeugender Vorteil erklärt, welche positive Wirkung eine Alternative hat." },
  ],
});

const buildFormalWriting = (level, title) => ({
  taskType: "Formal letter / E-Mail",
  topic: level === "C1"
    ? `Schreiben: Formelle Klärung zum Thema „${title}“. Schreiben Sie an eine verantwortliche Person. Beginnen Sie höflich und zeigen Sie Verständnis für organisatorische Gründe. Beschreiben Sie dann, welche Aufgaben oder Tätigkeiten durch die neue Situation erschwert werden. Erklären Sie, welche Bedingungen für Sie akzeptabel wären, und machen Sie am Ende einen realistischen Kompromissvorschlag.`
    : `Schreiben: Formelle Nachricht zum Thema „${title}“. Schreiben Sie an eine verantwortliche Person. Bitten Sie um Verständnis für Ihre Situation. Beschreiben Sie, womit Sie aktuell beschäftigt sind. Machen Sie einen Vorschlag für die kommenden Tage und zeigen Sie Verständnis für die Situation der Firma oder Organisation.`,
  structure: level === "C1"
    ? [
        "Betreff: kurz, sachlich und passend zum Anliegen.",
        "Höflicher Einstieg: Zeigen Sie Verständnis für organisatorische Gründe.",
        "Situation: Beschreiben Sie klar, was sich geändert hat und warum es problematisch ist.",
        "Auswirkung: Nennen Sie Tätigkeiten oder Aufgaben, die dadurch erschwert werden.",
        "Akzeptable Bedingungen: Beschreiben Sie, welche Bedingungen für Sie tragbar wären.",
        "Kompromiss: Machen Sie einen realistischen Vorschlag, der beide Seiten berücksichtigt.",
        "Abschluss: Bitten Sie höflich um Prüfung und Rückmeldung.",
      ]
    : [
        "Betreff und höfliche Anrede.",
        "Verständnis: Bitten Sie um Verständnis für Ihre aktuelle Situation.",
        "Beschreibung: Erklären Sie, womit Sie beschäftigt sind und warum es schwierig geworden ist.",
        "Vorschlag: Machen Sie einen konkreten Vorschlag für die kommenden Tage.",
        "Rücksicht: Zeigen Sie Verständnis für die Situation der Firma, des Teams oder der verantwortlichen Person.",
        "Schluss: Bitten Sie freundlich um Rückmeldung.",
      ],
  usefulLines: level === "C1"
    ? [
        "Sehr geehrte/r ... ,",
        "ich kann gut nachvollziehen, dass organisatorische Veränderungen manchmal notwendig sind.",
        "Dennoch möchte ich höflich darauf hinweisen, dass ...",
        "Besonders erschwert wird dadurch ...",
        "Für mich wäre akzeptabel, wenn ...",
        "Als Kompromiss könnte ich mir vorstellen, dass ...",
        "Ich wäre Ihnen dankbar, wenn Sie mein Anliegen prüfen könnten.",
      ]
    : [
        "Sehr geehrte/r ... ,",
        "ich bitte um Verständnis für meine aktuelle Situation.",
        "Zurzeit bin ich vor allem mit ... beschäftigt.",
        "Für die kommenden Tage schlage ich vor, dass ...",
        "Mir ist bewusst, dass die Situation für die Firma ebenfalls schwierig ist.",
        "Über eine kurze Rückmeldung würde ich mich sehr freuen.",
      ],
});

export const buildDefaultLesson = ({ level, day, chapter, title, topic }) => {
  const writingTaskType = level === "B2" ? "B2 opinion essay / Meinungsbeitrag" : chooseWritingType(title, topic);
  const formalTask = writingTaskType === "Formal letter / E-Mail";
  const writingPlan = formalTask
    ? buildFormalWriting(level, title)
    : level === "C1"
      ? buildC1OpinionWriting(title, topic)
      : buildB2OpinionWriting(title, topic);

  return makeLesson({
    level,
    day,
    chapter,
    title,
    topic,
    heroImage: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1600&q=80",
    grammarFocus: formalTask
      ? level === "C1"
        ? "C1-formelle Nachricht: Verständnis zeigen, Problem erklären, akzeptable Bedingungen nennen und Kompromiss vorschlagen"
        : "B2-formelle Nachricht: Verständnis bitten, Situation beschreiben, Vorschlag machen und Rücksicht zeigen"
      : level === "C1"
        ? "C1-Prüfungsstruktur: erklären, Beispiel geben, Einwände nennen und Alternative erläutern"
        : "B2-Meinungsbeitrag: Meinung äußern, Gründe nennen, Alternativen erklären und Vorteile darstellen",
    objectives: [
      "Ich kann das Thema klar erklären.",
      formalTask
        ? level === "C1"
          ? "Ich kann eine sachliche C1-Nachricht mit Kompromissvorschlag schreiben."
          : "Ich kann eine formelle B2-Nachricht mit Situation, Vorschlag und Verständnis schreiben."
        : level === "C1"
          ? "Ich kann eine C1-Stellungnahme mit Beispiel, Einwand und Alternative schreiben."
          : "Ich kann einen B2-Meinungsbeitrag mit Gründen, Alternativen und Vorteilen schreiben.",
      "Ich kann mit Falowen AI üben und meine Antwort verbessern.",
    ],
    explanation: [
      `Dieses ${level}-Thema hilft dir, deine Gedanken strukturiert und mit passenden Beispielen auszudrücken.`,
      formalTask
        ? level === "C1"
          ? "Die Schreibaufgabe ist als sachliche formelle Nachricht aufgebaut: höflich beginnen, Verständnis zeigen, Problem erklären, akzeptable Bedingungen nennen und einen Kompromiss vorschlagen."
          : "Die Schreibaufgabe ist als formelle Nachricht aufgebaut: um Verständnis bitten, die eigene Situation beschreiben, einen Vorschlag machen und Rücksicht auf die Firma oder Organisation zeigen."
        : level === "C1"
          ? "Die Schreibaufgabe folgt einer C1-Prüfungsstruktur: erklären, anhand eines Beispiels argumentieren, Einwände nennen und eine Alternative erläutern."
          : "Die Schreibaufgabe folgt der B2-Struktur: Meinung äußern, Gründe nennen, andere Möglichkeiten erklären und Vorteile dieser Alternativen nennen.",
    ],
    topicQuestions: [
      `Was weißt du schon über das Thema „${title}“?`,
      "Welche Beispiele aus Alltag, Arbeit, Schule oder Gesellschaft passen dazu?",
      formalTask ? "Welche konkrete Bitte oder welcher Kompromiss sollte am Ende stehen?" : "Welche eigene Meinung kannst du begründen?",
    ],
    grammarLesson: level === "B2"
      ? buildB2GrammarLesson(title, topic, writingPlan)
      : {
          title: formalTask ? "C1-formelle Ausdrucksweise" : "C1-Argumentationsstruktur",
          explanation: [
            `Diese Grammatik- und Strukturhinweise helfen dir, das Thema „${title}“ auf C1-Niveau differenziert darzustellen.`,
            "Verbinde deine Aussagen logisch, erläutere konkrete Beispiele und berücksichtige auch Einwände oder organisatorische Bedingungen.",
          ],
          rules: formalTask
            ? [
                "Beginne höflich und zeige Verständnis, bevor du dein Anliegen erklärst.",
                "Beschreibe die Situation sachlich und nenne konkrete Auswirkungen auf deine Arbeit oder Aufgaben.",
                "Formuliere akzeptable Bedingungen und einen Kompromissvorschlag.",
              ]
            : [
                "Beantworte jeden Aufgabenpunkt sichtbar.",
                "Erkläre zuerst die Bedeutung des Themas, bevor du argumentierst.",
                "Nutze ein konkretes Beispiel, einen Einwand und eine Alternative.",
              ],
          examples: writingPlan.usefulLines.slice(0, 4),
          miniExercise: formalTask
            ? `Formuliere vier Stichpunkte zum Thema „${title}": Verständnis, erschwerte Tätigkeit, akzeptable Bedingung und Kompromiss.`
            : `Formuliere vier Stichpunkte zum Thema „${title}": Erklärung, Beispiel, Einwand und Alternative.`,
        },
    speakingTaskType: formalTask ? "Formal situation talk" : "Guided opinion talk",
    speakingTopic: formalTask
      ? `Sprechen: Erkläre die formelle Situation zum Thema „${title}“ und formuliere eine höfliche Lösung.`
      : `Sprechen: Erkläre deine Meinung zum Thema „${title}“ und nenne mindestens zwei Beispiele.`,
    speakingBuilder: level === "C1" ? {
      branches: [
        { id: "bedeutung", title: `${title}: gesellschaftliche Bedeutung`, keywords: ["Relevanz", "Wandel", "Teilhabe", "Verantwortung", "Auswirkungen"], prompt: `Welche gesellschaftliche Bedeutung kommt dem Thema „${title}“ zu?`, example: `Die zunehmende Bedeutung von „${title}“ ist nicht isoliert zu betrachten, da sie sowohl individuelle Entscheidungen als auch gesellschaftliche Entwicklungen beeinflusst.`, starter: "Differenziert betrachtet lässt sich feststellen, dass ..." },
        { id: "chancen", title: "Chancen und Entwicklungspotenziale", keywords: ["Innovation", "Zugang", "Entwicklung", "Nutzen", "Gestaltung"], prompt: `Welche Chancen und Entwicklungspotenziale ergeben sich im Zusammenhang mit „${title}“?`, example: `Verantwortungsvoll gestaltete Rahmenbedingungen können bislang ungenutzte Potenziale erschließen und zugleich eine breitere gesellschaftliche Teilhabe ermöglichen.`, starter: "Als besonders vielversprechend erweist sich ..." },
        { id: "herausforderungen", title: "Herausforderungen und Zielkonflikte", keywords: ["Risiken", "Ungleichheit", "Zielkonflikt", "Grenzen", "Folgen"], prompt: `Welche Zielkonflikte müssen bei „${title}“ berücksichtigt werden?`, example: `Den erkennbaren Vorteilen stehen jedoch strukturelle Risiken gegenüber, deren Folgen insbesondere benachteiligte Gruppen überproportional treffen können.`, starter: "So nachvollziehbar diese Position zunächst erscheint, ..." },
        { id: "perspektiven", title: "Unterschiedliche Perspektiven", keywords: ["Interessen", "Abwägung", "Betroffene", "Kontroverse", "Kontext"], prompt: `Wie unterscheiden sich die Perspektiven verschiedener Beteiligter auf „${title}“?`, example: `Je nach institutionellem und sozialem Kontext wird die Entwicklung unterschiedlich bewertet, weshalb pauschale Schlussfolgerungen kaum angemessen erscheinen.`, starter: "Aus der Perspektive der unmittelbar Betroffenen ..." },
        { id: "loesungen", title: "Ausgewogene Lösungsansätze", keywords: ["Regulierung", "Bildung", "Kooperation", "Nachhaltigkeit", "Kompromiss"], prompt: `Wie könnte ein ausgewogener und langfristig tragfähiger Umgang mit „${title}“ aussehen?`, example: `Ein langfristig tragfähiger Ansatz setzt voraus, dass verbindliche Rahmenbedingungen mit Bildung, transparenter Kommunikation und gesellschaftlicher Mitwirkung verknüpft werden.`, starter: "Ein tragfähiger Lösungsansatz müsste gewährleisten, dass ..." },
      ],
    } : {
      plan: formalTask
        ? level === "C1"
          ? [
              "Einleitung: Nenne die Situation und zeige Verständnis.",
              "Problem: Erkläre, was erschwert wird.",
              "Bedingung: Nenne, was für dich akzeptabel wäre.",
              "Kompromiss: Schlage eine Lösung vor.",
            ]
          : [
              "Einleitung: Bitte um Verständnis.",
              "Situation: Erkläre, womit du beschäftigt bist.",
              "Vorschlag: Nenne eine Lösung für die kommenden Tage.",
              "Rücksicht: Zeige Verständnis für die andere Seite.",
            ]
        : [
            "Einleitung: Nenne das Thema und deine Grundposition.",
            "Hauptteil: Erkläre Gründe mit Beispielen.",
            level === "C1" ? "Gegenposition: Nenne einen Einwand und eine Alternative." : "Alternative: Nenne andere Möglichkeiten und Vorteile.",
            "Schluss: Sage, was du persönlich daraus lernst oder empfiehlst.",
          ],
      starters: writingPlan.usefulLines.slice(0, 4),
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
        ? `Sprich 2 Minuten über eine formelle Situation zum Thema „${title}". Nenne Problem, Bitte und Kompromiss.`
        : `Sprich 2 Minuten über das Thema „${title}". Nenne deine Meinung, Beispiele und eine Alternative.`,
      writing: level === "B2"
        ? "Schreibe 180–220 Wörter als B2-Meinungsbeitrag. Bearbeite Meinung, Gründe, andere Möglichkeiten/Alternativen und Vorteile."
        : writingPlan.topic,
      reading: defaultReadingTasks.join(" "),
      listening: defaultListeningTasks.join(" "),
    },
    readingResource: {
      title: "Recommended German reading platforms",
      description: "Use stable German platforms instead of broken search links. Choose one article connected to the lesson topic.",
      url: "https://www.dw.com/de/deutsch-lernen/s-2055",
      tasks: defaultReadingTasks,
    },
    listeningResource: {
      title: "Recommended German listening platforms",
      description: "Use stable platform pages. Choose one audio or video connected to the lesson topic.",
      url: "https://www.dw.com/de/deutsch-lernen/s-2055",
      tasks: defaultListeningTasks,
    },
    vocabulary: [title, "Begründung", "Beispiel", "Alternative", "Vorteil", "Nachteil", "Fazit"].filter(Boolean),
  });
};
