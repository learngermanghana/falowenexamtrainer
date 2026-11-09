// B1 Mock 04 teacher-provided Goethe-Zertifikat B1 Schreiben source.
// Student-facing prompts only; no sample solutions or grades.
export const B1_MOCK4_WRITING_TASKS = Object.freeze([
  Object.freeze({
    id:"teil1",title:"Teil 1 · Informelle E-Mail",
    meta:"20 Minuten · circa 80 Wörter",minutes:20,target:80,maxPoints:40,
    prompt:"Sie haben vor einer Woche Ihren Geburtstag gefeiert. Ein Freund / Eine Freundin von Ihnen konnte nicht zu Ihrer Feier kommen, weil er/sie krank war.",
    points:[
      "Beschreiben Sie: Wie war die Feier?",
      "Begründen Sie: Welches Geschenk finden Sie besonders toll und warum?",
      "Machen Sie einen Vorschlag für ein Treffen.",
    ],
    instruction:"Schreiben Sie eine E-Mail (circa 80 Wörter). Schreiben Sie etwas zu allen drei Punkten. Achten Sie auf den Textaufbau (Anrede, Einleitung, Reihenfolge der Inhaltspunkte, Schluss).",
  }),
  Object.freeze({
    id:"teil2",title:"Teil 2 · Diskussionsbeitrag",
    meta:"25 Minuten · circa 80 Wörter",minutes:25,target:80,maxPoints:40,
    prompt:"Sie haben im Fernsehen eine Diskussionssendung zum Thema „Persönliche Kontakte und Internet“ gesehen. Im Online-Gästebuch der Sendung finden Sie folgende Meinung:",
    quoteBy:"Tanja (15.01., 16:55 Uhr)",
    quote:"Ich finde es schlimm, dass persönliche Treffen immer seltener werden. Freunde wohnen oft sehr weit auseinander. Und da ist man dann schon froh über das Internet. Aber Kontakte im Internet können doch persönliche Treffen nicht ersetzen!",
    points:[],
    instruction:"Schreiben Sie nun Ihre Meinung zum Thema (circa 80 Wörter).",
  }),
  Object.freeze({
    id:"teil3",title:"Teil 3 · Kurze formelle E-Mail",
    meta:"15 Minuten · circa 40 Wörter",minutes:15,target:40,maxPoints:20,
    prompt:"Ihre Kursleiterin, Frau Müller, hat Sie zu einem Gespräch über Ihre persönlichen Lernziele eingeladen. Zu dem Termin können Sie aber nicht kommen.",
    points:[
      "Entschuldigen Sie sich höflich.",
      "Erklären Sie, warum Sie nicht kommen können.",
    ],
    instruction:"Schreiben Sie an Frau Müller eine E-Mail (circa 40 Wörter). Vergessen Sie nicht die Anrede und den Gruß am Schluss. Verwenden Sie die höfliche Sie-Form.",
  }),
]);
export const B1_MOCK4_SCHREIBEN_MINUTES = 60;
export const B1_MOCK4_SCHREIBEN_RUBRIC = Object.freeze({
  totalPoints:100,partPoints:Object.freeze({teil1:40,teil2:40,teil3:20}),
  criteria:["Aufgabenerfüllung","Kohärenz","Wortschatz","Strukturen"],passPoints:60,
});
