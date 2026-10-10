import { A1_EXAM_HOEREN_SAMPLE_3_TEIL1, A1_EXAM_HOEREN_SAMPLE_3_TEIL2, A1_EXAM_HOEREN_SAMPLE_3_TEIL3 } from './a1ExamHorenSample3';

// A1 Mock 3: Lesen is complete, Hören reuses Sample 3, Schreiben uses a separate exam task. Sprechen has dedicated tasks.
export const A1_MOCK_3_ID = 'a1-mock-03';

export const A1_MOCK_3_READING = Object.freeze({
  teil1: {
    texts: [
      {
        id: 1,
        to: 'Markus',
        from: 'Thomas',
        subject: 'Einladung zum Grillen',
        lines: [
          'Hallo Markus,',
          'am Freitagabend feiere ich meinen Geburtstag! Ich grille im Garten von meinen Eltern. Wir fangen um 18:30 Uhr an. Hast du Zeit? Bring bitte einen Salat mit. Würstchen und Getränke kaufe ich.',
          'Viele Grüße',
          'Thomas',
        ],
      },
      {
        id: 2,
        to: 'Sarah',
        from: 'Nina',
        subject: 'Treffen am Sonntag',
        lines: [
          'Liebe Sarah,',
          'ich kann am Sonntag leider nicht zum Tennisspielen kommen. Mein Sohn ist krank und muss zu Hause bleiben. Wollen wir uns am Dienstag im Stadtpark treffen? Wir können um 15:00 Uhr zusammen Kaffee trinken.',
          'Liebe Grüße',
          'Nina',
        ],
      },
    ],
    questions: [
      { number: 1, text: 1, statement: 'Thomas feiert am Freitag seinen Geburtstag.', answer: 'richtig', explanation: 'Thomas schreibt, dass er am Freitagabend seinen Geburtstag feiert.' },
      { number: 2, text: 1, statement: 'Markus soll Getränke zur Party mitbringen.', answer: 'falsch', explanation: 'Markus soll einen Salat mitbringen. Thomas kauft die Getränke selbst.' },
      { number: 3, text: 1, statement: "Die Party findet im Garten von Thomas' Eltern statt.", answer: 'richtig', explanation: 'Thomas schreibt, dass er im Garten seiner Eltern grillt.' },
      { number: 4, text: 2, statement: 'Nina kann am Sonntag nicht Tennis spielen, weil sie arbeiten muss.', answer: 'falsch', explanation: 'Nina kann nicht kommen, weil ihr Sohn krank ist, nicht weil sie arbeiten muss.' },
      { number: 5, text: 2, statement: 'Nina möchte sich am Dienstag um 15:00 Uhr mit Sarah treffen.', answer: 'richtig', explanation: 'Nina schlägt ein Treffen am Dienstag um 15:00 Uhr im Stadtpark vor.' },
    ],
  },

  teil2: {
    questions: [
      {
        number: 6, statement: 'Sie möchten am Samstagabend online eine Pizza bestellen.', answer: 'a',
        explanation: 'Pizza Blitz liefert Pizza und nimmt Online-Bestellungen am Samstagabend an. Restaurant Roma bietet nur eine Tischreservierung an.',
        options: [
          { id: 'a', title: 'Pizza Blitz', lines: ['Lieferservice frei Haus!', 'Täglich von 11:00 bis 23:00 Uhr.', 'Online bestellen und schnell genießen.'] },
          { id: 'b', title: 'Restaurant „Roma“', lines: ['Tischreservierung im Restaurant „Roma“.', 'Buchen Sie Ihren Tisch für Samstagabend direkt online.'] },
        ],
      },
      {
        number: 7, statement: 'Sie suchen ein gebrauchtes Fahrrad in Berlin.', answer: 'a',
        explanation: 'Website A verkauft gebrauchte Fahrräder in Berlin. Website B vermietet E-Bikes an der Ostsee.',
        options: [
          { id: 'a', title: 'Gebrauchte Fahrräder', lines: ['Gebrauchte Herren- und Damenfahrräder günstig kaufen.', 'Große Auswahl im Raum Berlin!'] },
          { id: 'b', title: 'E-Bikes an der Ostsee', lines: ['Mieten Sie E-Bikes für Ihren Urlaub an der Ostsee.', 'Günstige Tages- und Wochenpreise.'] },
        ],
      },
      {
        number: 8, statement: 'Sie möchten einen Deutschkurs am Abend besuchen.', answer: 'b',
        explanation: 'Nur Website B bietet Deutschkurse am Abend von 18:30 bis 20:00 Uhr an.',
        options: [
          { id: 'a', title: 'Deutsch Intensivkurs', lines: ['Deutsch Intensivkurs am Vormittag:', 'Montag bis Freitag von 08:30 bis 12:00 Uhr.'] },
          { id: 'b', title: 'Deutsch Abendkurse', lines: ['Abendkurse für Deutsch A1 bis B2:', 'Dienstag und Donnerstag von 18:30 bis 20:00 Uhr.'] },
        ],
      },
      {
        number: 9, statement: 'Sie möchten mit dem Zug nach München fahren und suchen eine Fahrkarte.', answer: 'a',
        explanation: 'Website A verkauft Zugtickets in Deutschland. Website B vermietet Autos.',
        options: [
          { id: 'a', title: 'Zugtickets online', lines: ['Buchen Sie Ihre Zugtickets und Sparpreise', 'für Fahrten in ganz Deutschland online.'] },
          { id: 'b', title: 'Mietwagen München', lines: ['Ihr Mietwagen am Flughafen München.', 'Autos günstig buchen und abholen.'] },
        ],
      },
      {
        number: 10, statement: 'Sie suchen eine günstige Hotelübernachtung in Hamburg.', answer: 'a',
        explanation: 'Website A bietet günstige Hotelübernachtungen in Hamburg. Website B gibt Tipps für Vermieter.',
        options: [
          { id: 'a', title: 'Hotels in Hamburg', lines: ['Vergleichen Sie Hotelzimmer und buchen Sie', 'günstige Übernachtungen in Hamburg.'] },
          { id: 'b', title: 'Wohnung vermieten', lines: ['Wohnung vermieten:', 'Tipps für Vermieter und Immobilienbesitzer in Hamburg.'] },
        ],
      },
    ],
  },
  teil3: {
    questions: [
      {
        number: 11, location: 'Aushang an der Sprachschule', statement: 'Am Freitag gibt es keinen Unterricht.',
        answer: 'falsch', explanation: 'Nur das Sekretariat ist geschlossen. Alle Sprachkurse finden wie gewohnt statt.',
        notice: { kind: 'notice', heading: 'Sprachschule · Mitteilung', lines: ['Am Freitag, 15. Oktober, bleibt das Sekretariat wegen einer Fortbildung geschlossen.', 'Alle Sprachkurse finden wie gewohnt statt.'] },
      },
      {
        number: 12, location: 'Hinweis am Aufzug im Kaufhaus', statement: 'Man darf diesen Aufzug im Moment nicht benutzen.',
        answer: 'richtig', explanation: 'Dieser Aufzug ist außer Betrieb. Man kann die Treppe oder den anderen Aufzug benutzen.',
        notice: { kind: 'warning', heading: 'Aufzug außer Betrieb!', lines: ['Bitte nutzen Sie die Treppe oder den Aufzug im hinteren Bereich (neben der Bäckerei).'] },
      },
      {
        number: 13, location: 'Schild an der Arztpraxis', statement: 'Am Montagmorgen kann man ohne Termin zum Arzt gehen.',
        answer: 'richtig', explanation: 'Montags ist die offene Sprechstunde von 08:00 bis 10:00 Uhr ohne Termin.',
        notice: { kind: 'hours', heading: 'Offene Sprechstunde (ohne Termin)', lines: ['Montag und Mittwoch', 'von 08:00 bis 10:00 Uhr.'] },
      },
      {
        number: 14, location: 'Hinweis am Schwimmbad', statement: 'Kinder unter 6 Jahren müssen für die Eintrittskarte bezahlen.',
        answer: 'falsch', explanation: 'Kinder unter sechs Jahren haben freien Eintritt und bezahlen nichts.',
        notice: { kind: 'notice', heading: 'Eintrittspreise', lines: ['Erwachsene 5 Euro', 'Jugendliche 3 Euro', 'Kinder unter 6 Jahren haben freien Eintritt.'] },
      },
      {
        number: 15, location: 'Information an der Supermarktkasse',
        statement: 'Man kann heute im Supermarkt mit EC- oder Kreditkarte bezahlen.',
        answer: 'falsch', explanation: 'Wegen einer Störung ist heute nur Barzahlung möglich. Kartenzahlung geht nicht.',
        notice: { kind: 'warning', heading: 'Achtung!', lines: ['Wegen einer Störung ist heute nur Barzahlung möglich.', 'Keine Kartenzahlung!'] },
      },
    ],
  },
});

// Exact references to the existing Hören Sample 3: questions, answers and audio keys are not duplicated.
export const A1_MOCK_3_LISTENING = Object.freeze({
  sampleId: 'sample-3',
  teil1: A1_EXAM_HOEREN_SAMPLE_3_TEIL1,
  teil2: A1_EXAM_HOEREN_SAMPLE_3_TEIL2,
  teil3: A1_EXAM_HOEREN_SAMPLE_3_TEIL3,
});

export const A1_MOCK_3_WRITING_TASK = Object.freeze({
  id: 'a1-mock-03-anna-dinner',
  title: 'Einladung zum Essen',
  register: 'Informal',
  recipient: 'Anna',
  wordTarget: 30,
  situation: 'Sie möchten Ihre Freundin Anna am Wochenende zum Essen zu sich nach Hause einladen.',
  instruction: 'Schreiben Sie eine kurze E-Mail an Ihre Freundin Anna. Schreiben Sie ca. 30 Wörter und gehen Sie auf alle drei Punkte ein. Vergessen Sie nicht die Anrede und den Gruß!',
  points: [
    'Grund des Schreibens: Einladung zum Essen.',
    'Wann? Nennen Sie einen Tag am Wochenende und eine Uhrzeit.',
    'Mitbringen: Fragen Sie Anna, ob sie ein Dessert oder Getränke mitbringen kann.',
  ],
  contentKeys: ['invitation', 'when', 'bring'],
  modelAnswer: 'Liebe Anna,\n\nich möchte dich am Samstag um 18 Uhr zum Essen zu mir nach Hause einladen. Hast du Zeit? Kannst du bitte ein Dessert oder Getränke mitbringen?\n\nLiebe Grüße\nEva',
});

export const A1_MOCK_3_WRITING = Object.freeze({
  teil1: {
    scenario: [
      'Ihre Bekannte Eva Miller möchte an einer Sprachschule einen Deutschkurs besuchen. Helfen Sie ihr und tragen Sie die 5 fehlenden Informationen (Aufgaben 1–5) in das Anmeldeformular ein.',
      'Eva Miller kommt aus Kanada und wohnt seit zwei Wochen in Berlin (Postleitzahl: 10115, Hauptstraße 12). Sie ist 28 Jahre alt und arbeitet als Architektin. Sie möchte ab dem 1. November einen Abendkurs für Deutsch auf der Stufe A1 besuchen. Sie bezahlt die Kursgebühr in bar.',
    ],
    instruction: 'Tragen Sie die 5 fehlenden Informationen (Aufgaben 1–5) in das Anmeldeformular ein.',
    formRows: [
      { kind: 'prefilled', label: 'Familienname', value: 'Miller' },
      { kind: 'prefilled', label: 'Vorname', value: 'Eva' },
      { kind: 'prefilled', label: 'Straße, Hausnummer', value: 'Hauptstraße 12' },
      { kind: 'input', number: 1, label: 'Wohnort / PLZ', answer: '10115 Berlin', alternatives: ['Berlin 10115'], explanation: 'Eva wohnt in Berlin mit der Postleitzahl 10115.' },
      { kind: 'input', number: 2, label: 'Herkunftsland', answer: 'Kanada', alternatives: ['Canada'], explanation: 'Eva kommt aus Kanada.' },
      { kind: 'input', number: 3, label: 'Beruf', answer: 'Architektin', alternatives: [], explanation: 'Eva arbeitet als Architektin.' },
      { kind: 'choice', number: 4, label: 'Gewünschter Kurs', answer: 'Abendkurs', options: [{ value: 'Vormittagskurs', label: 'Vormittagskurs' }, { value: 'Abendkurs', label: 'Abendkurs' }], explanation: 'Eva möchte einen Deutschkurs am Abend.' },
      { kind: 'input', number: 5, label: 'Gewünschte Sprachstufe', answer: 'A1', alternatives: ['A 1'], explanation: 'Eva möchte den Deutschkurs auf der Stufe A1 besuchen.' },
    ],
  },
  teil2: {
    instruction: A1_MOCK_3_WRITING_TASK.instruction,
    reminder: 'Schreiben Sie die Anrede, alle drei Inhaltspunkte, einen Gruß und Ihren Namen.',
  },
});

export const A1_MOCK_3_SPEAKING = Object.freeze({
  durationSeconds: 15 * 60, maxScore: 25, passScore: 15,
  tasks: [
    {
      id: 'teil1', teil: '1', title: 'Teil 1 · Sich vorstellen',
      context: 'Persönliche Vorstellung', maxRecordingSeconds: 90,
      prompt: 'Stellen Sie sich anhand der folgenden Stichpunkte vor. Antworten Sie danach auf die möglichen Prüferfragen.',
      card: ['Name?', 'Alter?', 'Land?', 'Wohnort?', 'Sprachen?', 'Beruf?', 'Hobby?'],
      followUp: 'Mögliche Prüferfragen: 1. Können Sie Ihren Familiennamen bitte buchstabieren? 2. Wie ist Ihre Telefonnummer? Sie können eine erfundene Telefonnummer nennen.',
    },
    {
      id: 'teil2', teil: '2', title: 'Teil 2 · Um Informationen bitten und Informationen geben',
      context: 'Thema: Einkaufen', maxRecordingSeconds: 60,
      prompt: 'Stellen Sie Ihrem Partner / Ihrer Partnerin eine Frage zu der folgenden Karte. Thema: Einkaufen. Wort: Brot.',
      keyword: 'Brot',
    },
    {
      id: 'teil3', teil: '3', title: 'Teil 3 · Bitten formulieren und darauf reagieren',
      context: 'Eine höfliche Bitte', maxRecordingSeconds: 60,
      prompt: 'Formulieren Sie eine passende höfliche Bitte zur Bildkarte: Ein Glas Wasser.',
      picture: 'glass-water', pictureAlt: 'Ein Glas Wasser',
    },
  ],
});
