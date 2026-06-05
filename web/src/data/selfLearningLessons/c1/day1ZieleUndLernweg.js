import { buildWeltReadingSearchUrl, makeLesson } from "../buildSelfLearningLesson";

const c1Day1ZieleUndLernweg = makeLesson({
  level: "C1",
  day: 1,
  chapter: "1.1",
  title: "Studienfachwahl und Bildungsweg",
  topic: "Kriterien für die Wahl eines Studienfachs diskutieren und Alternativen zum Studium bewerten",
  heroImage: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=1600&q=80",
  grammarFocus: "Goethe-C1-Stellungnahme: Kriterien erklären, Beispiel argumentieren, Gegenargumente nennen und Alternative erläutern",
  objectives: [
    "Ich kann Kriterien für die Wahl eines Studienfachs differenziert erklären.",
    "Ich kann anhand eines konkreten Studienfachs argumentieren.",
    "Ich kann Gründe nennen, die gegen ein Studium sprechen könnten.",
    "Ich kann eine Alternative zum Studium erläutern und bewerten.",
  ],
  explanation: [
    "Auf C1-Niveau reicht es nicht, nur eine persönliche Meinung zu nennen. Du musst ein Thema erklären, differenziert argumentieren und auch Gegenpositionen berücksichtigen.",
    "Diese Lektion trainiert die typische Goethe-C1-Struktur: Erklären Sie, Argumentieren Sie anhand eines Beispiels, Nennen Sie Gründe dagegen, Erläutern Sie eine Alternative.",
    "Das Thema Studienfachwahl eignet sich gut, weil viele Lernende später eine Ausbildung, ein Studium oder eine berufliche Weiterbildung planen müssen.",
  ],
  topicQuestions: [
    "Nach welchen Kriterien sollte man ein Studienfach auswählen?",
    "Welches Studienfach ist ein gutes Beispiel für eine bewusste Wahl?",
    "Welche Gründe könnten gegen ein Studium sprechen?",
    "Welche Alternative zum Studium kann ebenfalls zu einem guten Berufsweg führen?",
  ],
  grammarLesson: {
    rules: [
      "Beantworte jeden Aufgabenpunkt sichtbar und in einer klaren Reihenfolge.",
      "Nutze Kriterien wie Interesse, Fähigkeiten, Berufschancen, Kosten, gesellschaftliche Relevanz und persönliche Ziele.",
      "Argumentiere anhand eines konkreten Studienfachs, damit dein Text nicht zu allgemein bleibt.",
      "Nenne auch Gründe gegen ein Studium, zum Beispiel Kosten, Dauer, fehlender Praxisbezug oder bessere Ausbildungschancen.",
      "Erläutere eine Alternative, zum Beispiel Ausbildung, duales Studium, Weiterbildung oder praktische Berufserfahrung.",
    ],
    examples: [
      "Die Wahl eines Studienfachs sollte sich nicht nur nach persönlichen Interessen, sondern auch nach Fähigkeiten und beruflichen Perspektiven richten.",
      "Am Beispiel der Informatik wird deutlich, dass ein Studienfach sowohl Kreativität als auch analytisches Denken fördern kann.",
      "Gegen ein Studium spricht jedoch, dass es oft zeit- und kostenintensiv ist.",
      "Eine sinnvolle Alternative wäre eine duale Ausbildung, weil sie theoretisches Wissen mit praktischer Erfahrung verbindet.",
    ],
    miniExercise: "Schreibe vier Stichpunkte: 1) drei Kriterien für die Studienfachwahl, 2) ein Studienfach als Beispiel, 3) ein Grund gegen Studium, 4) eine Alternative.",
  },
  speakingTaskType: "C1 argumentation talk",
  speakingTopic: "Sprechen: Erkläre, nach welchen Kriterien man ein Studienfach wählen sollte, und nenne eine Alternative zum Studium.",
  speakingBuilder: {
    plan: [
      "Einleitung: Nenne das Thema und warum es für junge Menschen wichtig ist.",
      "Erklärung: Nenne wichtige Kriterien für die Studienfachwahl.",
      "Beispiel: Argumentiere anhand eines Studienfachs, zum Beispiel Medizin, Informatik, Pflegewissenschaft oder Wirtschaft.",
      "Gegenposition: Nenne Gründe, die gegen ein Studium sprechen könnten.",
      "Alternative: Erläutere eine Ausbildung, ein duales Studium oder praktische Berufserfahrung als Alternative.",
    ],
    starters: [
      "Die Wahl eines Studienfachs ist eine weitreichende Entscheidung, weil ...",
      "Meiner Ansicht nach sollte man vor allem darauf achten, ob ...",
      "Ein gutes Beispiel hierfür ist das Studienfach ...",
      "Gegen ein Studium könnte sprechen, dass ...",
      "Eine sinnvolle Alternative wäre ...",
    ],
  },
  writingTaskType: "Goethe C1 opinion essay / Stellungnahme",
  writingTopic: "Schreiben: Die Wahl des Studienfachs. Verfassen Sie eine C1-Stellungnahme und bearbeiten Sie alle Punkte: Erklären Sie, nach welchen Kriterien sich die Wahl des Studienfachs richten sollte. Argumentieren Sie anhand eines Beispiels für ein Studienfach. Nennen Sie Gründe, die gegen ein Studium sprechen könnten. Erläutern Sie eine Alternative zum Studium.",
  writingBuilder: {
    structure: [
      "Einleitung: Stellen Sie das Thema Studienfachwahl vor und zeigen Sie, warum diese Entscheidung wichtig ist.",
      "Erklären Sie: Nach welchen Kriterien sollte man ein Studienfach wählen?",
      "Argumentieren Sie anhand eines Beispiels: Wählen Sie ein konkretes Studienfach und erklären Sie, warum es sinnvoll sein kann.",
      "Nennen Sie Gründe dagegen: Welche Gründe könnten gegen ein Studium sprechen?",
      "Erläutern Sie eine Alternative: Beschreiben Sie eine Ausbildung, ein duales Studium oder einen anderen Berufsweg.",
      "Schluss: Formulieren Sie ein differenziertes Fazit mit Ihrer eigenen Position.",
    ],
    usefulLines: [
      "Die Wahl eines Studienfachs gehört zu den wichtigsten Entscheidungen im Bildungsweg eines Menschen.",
      "Dabei sollte man nicht nur persönliche Interessen, sondern auch Fähigkeiten und berufliche Perspektiven berücksichtigen.",
      "Ein anschauliches Beispiel hierfür ist das Studienfach ..., weil ...",
      "Gegen ein Studium spricht jedoch, dass ...",
      "Eine sinnvolle Alternative wäre ..., da ...",
      "Zusammenfassend lässt sich festhalten, dass die Entscheidung individuell, realistisch und zukunftsorientiert getroffen werden sollte.",
    ],
  },
  phrases: [
    "sich nach bestimmten Kriterien richten",
    "berufliche Perspektiven berücksichtigen",
    "ein anschauliches Beispiel hierfür ist ...",
    "gegen ein Studium spricht ...",
    "eine sinnvolle Alternative wäre ...",
    "zusammenfassend lässt sich festhalten, dass ...",
  ],
  tasks: {
    speaking: "Sprich 2 Minuten über Kriterien für die Studienfachwahl. Nenne ein Beispiel, ein Gegenargument und eine Alternative.",
    writing: "Schreibe 180–220 Wörter als C1-Stellungnahme über die Wahl des Studienfachs. Beantworte Erklärung, Beispiel, Gegenargument und Alternative.",
    reading: "Lies einen Artikel über Studium, Ausbildung oder Berufsorientierung. Notiere Hauptaussage, 5 Wörter und deine Meinung.",
    listening: "Höre einen Beitrag über Studium, Ausbildung oder Berufswege. Fasse ihn in 4–5 Sätzen zusammen.",
  },
  readingResource: {
    title: "WELT article search: Studienfachwahl, Studium, Ausbildung",
    description: "Open this stable site search and choose one article about study choice, education or career pathways. Focus on the main idea and useful C1 vocabulary.",
    url: buildWeltReadingSearchUrl("Studienfachwahl Studium Ausbildung Berufsorientierung"),
    tasks: [
      "Write the title of the article you chose.",
      "Write the main argument in one German sentence.",
      "Find 5 useful expressions connected to study, training or career choice.",
      "Write 4–5 sentences: What can a learner learn from this article?",
    ],
  },
  listeningResource: {
    title: "DW Deutsch lernen search: Studium und Ausbildung",
    description: "Choose one short DW audio/video connected to study, training or career choice. Listen twice and focus on the key points.",
    url: "https://www.dw.com/de/suche/s-100853?searchNavigationId=9097&item=Studium%20Ausbildung%20Berufswahl",
    tasks: [
      "Listen once and write the topic.",
      "Listen again and write 3 important points.",
      "Write 3 useful expressions you heard.",
      "Record yourself summarising the audio in 60–90 seconds.",
    ],
  },
  vocabulary: ["Studienfach", "Kriterien", "Berufschancen", "Fähigkeiten", "Praxisbezug", "Ausbildung", "duales Studium", "Berufsweg"],
});

export default c1Day1ZieleUndLernweg;
