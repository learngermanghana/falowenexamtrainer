const rows = [
  [1, "A2-1.1", "E-Mail an Felix: Arbeit und Familie", "Sie schreiben eine E-Mail an Ihren Freund Felix. Sie möchten ihm von Ihrer Arbeit oder Ihrem Studium und von Ihrer Familie erzählen.", [
    "Schreiben Sie, warum Sie Felix schreiben.",
    "Erzählen Sie von Ihrer Arbeit oder Ihrem Studium und von Ihrer Familie.",
    "Fragen Sie Felix, wie es ihm geht und was bei ihm neu ist.",
  ]],
  [2, "A2-1.2", "E-Mail an Felix: Mein Chef / Meine Chefin", "Sie schreiben eine E-Mail an Ihren Freund Felix und möchten Ihren Chef oder Ihre Chefin beschreiben.", [
    "Beschreiben Sie das Aussehen Ihres Chefs oder Ihrer Chefin.",
    "Beschreiben Sie die Persönlichkeit und das Verhalten bei der Arbeit.",
    "Sagen Sie, was Ihnen gefällt oder was besser sein könnte, und fragen Sie Felix nach seinem Chef oder seiner Chefin.",
  ]],
  [3, "A2-1.3", "E-Mail an Felix: Meine Eltern vergleichen", "Sie schreiben eine E-Mail an Ihren Freund Felix und möchten Ihre Mutter und Ihren Vater vergleichen.", [
    "Vergleichen Sie das Aussehen Ihrer Mutter und Ihres Vaters.",
    "Vergleichen Sie ihren Charakter.",
    "Sagen Sie, was Sie an beiden besonders mögen, und fragen Sie Felix nach seinen Eltern.",
  ]],
  [4, "A2-2.4", "E-Mail an Herrn Asadu: Gemeinsam etwas unternehmen", "Sie möchten Herrn Felix Asadu zu einem gemeinsamen Wochenende einladen. Schreiben Sie ihm eine E-Mail.", [
    "Erklären Sie, warum Sie ihn einladen, und schlagen Sie eine Aktivität vor.",
    "Fragen Sie, wann er Zeit hat und wo Sie sich treffen können.",
    "Fragen Sie, ob er etwas für das Essen oder die Aktivität mitbringen kann.",
  ]],
  [5, "A2-2.5", "E-Mail an Alex: Freizeit planen", "Sie möchten mit Ihrem Freund Alex am Wochenende etwas unternehmen. Schreiben Sie Alex eine E-Mail.", [
    "Sagen Sie, dass Sie am Wochenende Zeit haben und etwas zusammen machen möchten.",
    "Fragen Sie, ob Alex am Wochenende frei ist und wann er Zeit hat.",
    "Schlagen Sie eine konkrete Aktivität vor und fragen Sie, was Alex davon hält.",
  ]],
  [6, "A2-3.6", "E-Mail über Ihr neues Zimmer", "Sie sind vor Kurzem umgezogen und möchten einer Freundin oder einem Freund von Ihrem neuen Zimmer erzählen. Schreiben Sie eine E-Mail.", [
    "Schreiben Sie, warum Sie schreiben oder dass Sie umgezogen sind.",
    "Beschreiben Sie Ihr Zimmer und die wichtigsten Möbel.",
    "Sagen Sie, was Ihnen an Ihrem Zimmer besonders gefällt, und erklären Sie warum.",
  ]],
  [7, "A2-3.7", "E-Mail an einen Vermieter", "Sie möchten eine Wohnung in einer bestimmten Stadt mieten. Schreiben Sie eine E-Mail an den Vermieter.", [
    "Fragen Sie nach einer verfügbaren Wohnung.",
    "Nennen Sie wichtige Kriterien, zum Beispiel Größe, Lage oder Preis.",
    "Fragen Sie nach den Mietbedingungen und nach einem Besichtigungstermin.",
  ]],
  [8, "A2-3.8", "E-Mail an ein Restaurant", "Sie möchten einen Tisch in einem Restaurant reservieren. Schreiben Sie eine E-Mail an das Restaurant.", [
    "Fragen Sie nach einem freien Tisch.",
    "Nennen Sie Datum, Uhrzeit und Anzahl der Personen.",
    "Fragen Sie nach dem Menü und den Preisen.",
  ]],
  [9, "A2-4.9", "E-Mail an ein Hotel", "Sie planen einen Urlaub und möchten eine Unterkunft reservieren. Schreiben Sie eine E-Mail an ein Hotel.", [
    "Fragen Sie nach einem freien Zimmer.",
    "Nennen Sie wichtige Reisedaten, zum Beispiel Datum, Anzahl der Personen oder Zimmerart.",
    "Fragen Sie nach dem Preis und nach zusätzlichen Leistungen, zum Beispiel Frühstück oder WLAN.",
  ]],
  [10, "A2-4.10", "E-Mail an einen Freund / eine Freundin: Einladung zu einem Fest", "Sie möchten einen Freund oder eine Freundin zu einem Fest einladen. Schreiben Sie eine E-Mail.", [
    "Erzählen Sie von dem Fest und erklären Sie, warum es besonders ist.",
    "Laden Sie die Person ein und nennen Sie Datum und Ort.",
    "Erklären Sie, was die Person mitbringen sollte oder was sie dort erwarten kann.",
  ]],
  [11, "A2-4.11", "E-Mail an eine Autovermietung", "Sie sind in Deutschland und möchten für das Wochenende ein Auto mieten. Schreiben Sie eine E-Mail an eine Autovermietung.", [
    "Fragen Sie, ob für das Wochenende noch ein Auto verfügbar ist.",
    "Fragen Sie, welche Dokumente benötigt werden.",
    "Fragen Sie nach dem Preis und ob eine Versicherung enthalten ist.",
  ]],
  [12, "A2-5.12", "E-Mail an ein Unternehmen: Bewerbung", "Sie sind in Deutschland und möchten sich um eine Arbeitsstelle bewerben. Schreiben Sie eine E-Mail an ein Unternehmen.", [
    "Fragen Sie, ob es noch offene Stellen gibt.",
    "Beschreiben Sie Ihre Fähigkeiten und Fertigkeiten für die Stelle.",
    "Fragen Sie nach den Arbeitszeiten und dem Gehalt.",
  ]],
  [13, "A2-5.13", "Bewerbung bei CityMall", "Sie möchten sich bei CityMall um eine Stelle als Verkäufer/in oder Kundenservice-Mitarbeiter/in bewerben. Schreiben Sie eine formelle E-Mail.", [
    "Erklären Sie, warum Sie sich um die Stelle bewerben.",
    "Beschreiben Sie Ihre Erfahrungen und Stärken.",
    "Fragen Sie nach den Arbeitszeiten, den Aufgaben oder den Weiterbildungsmöglichkeiten.",
  ]],
  [14, "A2-5.14", "E-Mail an einen Kollegen: Karriereseminar", "Ihr Kollege hat Ihnen ein berufliches Seminar vorgeschlagen, das Ihre Karriere fördern könnte. Schreiben Sie ihm eine formelle E-Mail.", [
    "Bedanken Sie sich für den Vorschlag und sagen Sie, dass Sie interessiert sind.",
    "Fragen Sie nach dem Inhalt und den Terminen des Seminars.",
    "Fragen Sie nach den Kosten.",
  ]],
  [15, "A2-6.15", "E-Mail an einen Sportverein", "Sie sind in Deutschland und möchten sich für einen Sportkurs anmelden. Schreiben Sie eine E-Mail an einen Sportverein oder ein Fitnessstudio.", [
    "Fragen Sie, ob es noch freie Plätze gibt.",
    "Beschreiben Sie Ihre Erfahrung oder Motivation.",
    "Fragen Sie nach den Trainingszeiten und den Kosten.",
  ]],
  [16, "A2-6.16", "E-Mail an einen Arzt", "Sie möchten wegen Ihrer Gesundheit einen Arzt kontaktieren. Schreiben Sie eine E-Mail.", [
    "Fragen Sie nach einem Termin.",
    "Fragen Sie nach den Kosten oder ob Ihre Versicherung die Behandlung bezahlt.",
    "Fragen Sie nach möglichen Untersuchungen oder Behandlungen.",
  ]],
  [17, "A2-6.17", "E-Mail an eine Apotheke", "Sie möchten ein bestimmtes Medikament kaufen. Schreiben Sie eine E-Mail an eine Apotheke.", [
    "Erklären Sie kurz, warum Sie das Medikament benötigen.",
    "Fragen Sie nach den Kosten und ob die Versicherung das Medikament übernimmt.",
    "Fragen Sie nach der richtigen Dosierung oder möglichen Nebenwirkungen.",
  ]],
  [18, "A2-7.18", "E-Mail an Ihre Bank", "Sie sind in Ghana und Ihre Bankkarte wurde gesperrt. Schreiben Sie eine E-Mail an Ihre Bank.", [
    "Fragen Sie, ob Ihre Karte entsperrt werden kann.",
    "Fragen Sie, welche Dokumente oder Informationen benötigt werden.",
    "Fragen Sie, wie lange der Vorgang dauern wird.",
  ]],
  [19, "A2-7.19", "E-Mail an einen Freund / eine Freundin: Einkaufen", "Sie möchten mit einem Freund oder einer Freundin Möbel für Ihre neue Wohnung einkaufen. Schreiben Sie eine E-Mail.", [
    "Laden Sie die Person zum Einkaufen ein und erklären Sie den Grund.",
    "Schlagen Sie vor, wann und wo Sie sich treffen können.",
    "Fragen Sie nach der Meinung der Person.",
  ]],
  [20, "A2-7.20", "Formelle E-Mail: Reklamation", "Sie haben ein Produkt gekauft, aber es ist defekt oder nicht wie bestellt. Schreiben Sie eine formelle Reklamation.", [
    "Erklären Sie, was Sie gekauft haben und warum Sie schreiben.",
    "Beschreiben Sie das Problem genau.",
    "Bitten Sie höflich um Umtausch, Reparatur oder Rückerstattung.",
  ]],
  [21, "A2-8.21", "E-Mail an einen Freund / eine Freundin: Wochenende", "Sie möchten einen Freund oder eine Freundin zu einem gemeinsamen Wochenende einladen. Schreiben Sie eine E-Mail.", [
    "Beschreiben Sie Ihre Wochenendpläne und erklären Sie, warum sie besonders sind.",
    "Nennen Sie wichtige Details, zum Beispiel Datum, Ort, Treffpunkt oder Dauer.",
    "Erklären Sie, was die Person mitbringen sollte oder was sie erwarten kann.",
  ]],
  [22, "A2-8.22", "E-Mail an einen Freund / eine Freundin: Meine Woche", "Sie möchten einem Freund oder einer Freundin von Ihrer kommenden Woche erzählen und ein Treffen planen. Schreiben Sie eine E-Mail.", [
    "Nennen Sie mindestens drei Termine oder Aktivitäten in Ihrer Woche.",
    "Schreiben Sie, wann Sie Zeit haben.",
    "Schlagen Sie ein Treffen mit einem konkreten Termin vor.",
  ]],
  [23, "A2-9.23", "E-Mail über Ihren Weg zur Schule oder Arbeit", "Sie schreiben einem Freund oder einer Freundin über Ihren Weg zur Schule oder zur Arbeit.", [
    "Beschreiben Sie, welche Verkehrsmittel Sie benutzen.",
    "Schreiben Sie, wie lange der Weg dauert, und nennen Sie einen Vor- oder Nachteil.",
    "Fragen Sie, wie die andere Person zur Schule oder zur Arbeit kommt.",
  ]],
  [24, "A2-9.24", "E-Mail an Sandra: Urlaub planen", "Sie möchten zusammen mit Sandra einen Urlaub planen. Schreiben Sie ihr eine E-Mail.", [
    "Laden Sie Sandra zur gemeinsamen Urlaubsplanung ein.",
    "Schlagen Sie einen Termin und einen Treffpunkt für die Planung vor.",
    "Fragen Sie nach ihrer Meinung zu Reiseziel, Transport oder Unterkunft.",
  ]],
  [25, "A2-9.25", "E-Mail über Ihren Tagesablauf", "Sie möchten einem Freund oder einer Freundin von Ihrem Tagesablauf erzählen. Schreiben Sie eine E-Mail.", [
    "Beschreiben Sie Ihren Morgen und Ihren Arbeits- oder Schultag.",
    "Erklären Sie, was Sie am Abend machen.",
    "Fragen Sie nach dem Tagesablauf der anderen Person.",
  ]],
  [26, "A2-10.26", "Dankesnachricht an einen Nachbarn / eine Nachbarin", "Ihr Nachbar oder Ihre Nachbarin hat Ihnen geholfen, als Sie krank waren. Schreiben Sie eine kurze Dankesnachricht.", [
    "Bedanken Sie sich für die Hilfe.",
    "Erklären Sie, wie Ihnen die Hilfe geholfen hat oder wie Sie sich dadurch gefühlt haben.",
    "Bieten Sie an, sich zu revanchieren.",
  ]],
  [27, "A2-10.27", "E-Mail an den Kundenservice", "Sie haben Ihr Handy verloren und möchten ein neues bestellen. Schreiben Sie eine E-Mail an den Kundenservice.", [
    "Erklären Sie, warum Sie ein neues Handy benötigen.",
    "Fragen Sie nach einer Empfehlung für ein passendes Modell.",
    "Fragen Sie nach der Bestellung und der Lieferung.",
  ]],
  [28, "A2-10.28", "E-Mail über Ihre Zukunftspläne", "Sie möchten einem Freund oder einer Freundin von Ihren Zukunftsplänen erzählen. Schreiben Sie eine E-Mail.", [
    "Beschreiben Sie Ihre beruflichen, schulischen oder Ausbildungsziele.",
    "Nennen Sie einen weiteren persönlichen Wunsch für die Zukunft.",
    "Fragen Sie nach den Zukunftsplänen der anderen Person.",
  ]],
];

export const A2_GOETHE_WRITING_TASKS = Object.freeze(Object.fromEntries(
  rows.map(([day, assignmentKey, title, situation, points]) => [
    day,
    Object.freeze({
      day,
      assignmentKey,
      title,
      situation,
      points: Object.freeze([...points]),
    }),
  ]),
));

export function getA2GoetheWritingTask(day) {
  return A2_GOETHE_WRITING_TASKS[Number(day)] || null;
}

export function getA2GoetheWritingTasks() {
  return Object.values(A2_GOETHE_WRITING_TASKS);
}
