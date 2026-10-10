import { A1_EXAM_HOEREN_SAMPLE_3_TEIL1, A1_EXAM_HOEREN_SAMPLE_3_TEIL2, A1_EXAM_HOEREN_SAMPLE_3_TEIL3 } from './a1ExamHorenSample3';

// A1 Mock 3: Lesen is complete; Hören reuses existing Sample 3. Schreiben and Sprechen remain unpublished.
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
