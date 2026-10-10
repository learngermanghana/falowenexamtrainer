// A1 Mock 3: add the remaining Lesen parts and other modules only when authored.
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
});
