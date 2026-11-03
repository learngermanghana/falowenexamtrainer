// Teacher-provided Goethe-Zertifikat B1 Schreiben Übungssatz (3 Aufgaben).
// Student-facing task texts only. Musterlösungen and exam tips from the source
// are deliberately not bundled into the learner exam or shown before marking.
export const B1_MOCK3_WRITING_TASKS = Object.freeze([
  Object.freeze({
    id: "teil1",
    title: "Teil 1 · Informelle E-Mail",
    meta: "20 Minuten · circa 80 Wörter",
    minutes: 20,
    target: 80,
    maxPoints: 40,
    prompt: "Sie haben am letzten Wochenende einen Ausflug in eine andere Stadt gemacht. Ein Freund / eine Freundin von Ihnen konnte nicht mitkommen, weil er/sie lernen musste.",
    points: [
      "Beschreiben Sie: Wohin sind Sie gefahren und wie war der Ausflug?",
      "Begründen Sie: Was hat Ihnen dort am besten gefallen und warum?",
      "Machen Sie einen Vorschlag: Schlagen Sie ein Treffen vor, um Fotos zu zeigen und zu berichten.",
    ],
    instruction: "Schreiben Sie eine E-Mail (circa 80 Wörter). Schreiben Sie etwas zu allen drei Punkten. Achten Sie auf den Textaufbau (Anrede, Einleitung, Reihenfolge der Inhaltspunkte, Schluss).",
  }),
  Object.freeze({
    id: "teil2",
    title: "Teil 2 · Diskussionsbeitrag",
    meta: "25 Minuten · circa 80 Wörter",
    minutes: 25,
    target: 80,
    maxPoints: 40,
    prompt: "Sie haben im Fernsehen eine Diskussion zum Thema „Brauchen wir noch gedruckte Bücher oder reichen E-Books?“ gesehen. Im Online-Gästebuch der Sendung finden Sie folgende Meinung:",
    quoteBy: "Laura (12.10., 18:30 Uhr)",
    quote: "Ich lese nur noch auf meinem E-Reader. Man kann hunderte Bücher überallhin mitnehmen und es spart viel Platz im Regal. Gedruckte Bücher sind doch veraltet und umweltschädlich!",
    points: [],
    instruction: "Schreiben Sie nun Ihre Meinung zum Thema (circa 80 Wörter).",
  }),
  Object.freeze({
    id: "teil3",
    title: "Teil 3 · Kurze formelle E-Mail",
    meta: "15 Minuten · circa 40 Wörter",
    minutes: 15,
    target: 40,
    maxPoints: 20,
    prompt: "Ihr Deutschkursleiter, Herr Schneider, hat Sie zu einem kurzen Beratungsgespräch über Ihre Prüfungsvorbereitung eingeladen. Sie können an dem vorgeschlagenen Termin aber wegen eines Arzttermins nicht teilnehmen.",
    points: [
      "Entschuldigen Sie sich höflich.",
      "Nennen Sie den Grund.",
      "Bitten Sie um einen neuen Termin.",
    ],
    instruction: "Schreiben Sie an Herrn Schneider eine E-Mail (circa 40 Wörter). Vergessen Sie nicht die Anrede und den Gruß am Schluss.",
  }),
]);

export const B1_MOCK3_SCHREIBEN_MINUTES = 60;
export const B1_MOCK3_SCHREIBEN_RUBRIC = Object.freeze({
  totalPoints: 100,
  partPoints: Object.freeze({ teil1: 40, teil2: 40, teil3: 20 }),
  criteria: ["Aufgabenerfüllung", "Kohärenz", "Wortschatz", "Strukturen"],
  passPoints: 60,
});
