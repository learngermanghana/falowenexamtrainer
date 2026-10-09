import { A1_EXAM_HOEREN_SAMPLE_2_TEIL1, A1_EXAM_HOEREN_SAMPLE_2_TEIL2, A1_EXAM_HOEREN_SAMPLE_2_TEIL3 } from './a1ExamHorenSample2.js';

export const A1_MOCK_2_ID = 'a1-mock-02';
export const A1_MOCK_2_READING = {
  teil1: {
    texts: [
      { id: 1, to: 'Maria', from: 'Sarah', subject: 'Geburtstagsparty am Samstag', lines: ['Liebe Maria,', 'am Samstag habe ich Geburtstag! Ich mache eine kleine Party bei mir zu Hause. Die Party beginnt um 18:00 Uhr. Meine Mutter backt einen Kuchen und wir hören Musik. Kannst du auch kommen? Bring bitte Fruchtsaft mit.', 'Liebe Grüße', 'Sarah'] },
      { id: 2, to: 'Thomas', from: 'Jan', subject: 'Deutschkurs am Donnerstag', lines: ['Hallo Thomas,', 'unser Deutschkurs am Donnerstag findet nicht in Raum 102 statt. Der Lehrer ist krank. Wir haben am Donnerstag frei! Aber am Freitag lernen wir von 10:00 bis 12:00 Uhr in Raum 204. Wir sehen uns am Freitag.', 'Viele Grüße', 'Jan'] },
    ],
    questions: [
      { number: 1, text: 1, statement: 'Sarahs Geburtstagsparty ist am Sonntag.', answer: 'falsch', explanation: 'Sarahs Party ist am Samstag, nicht am Sonntag.' },
      { number: 2, text: 1, statement: 'Maria soll Fruchtsaft zur Party mitbringen.', answer: 'richtig', explanation: 'Sarah schreibt: „Bring bitte Fruchtsaft mit.“' },
      { number: 3, text: 1, statement: 'Sarahs Mutter macht einen Kuchen für die Party.', answer: 'richtig', explanation: 'Sarah schreibt: „Meine Mutter backt einen Kuchen und wir hören Musik.“' },
      { number: 4, text: 2, statement: 'Am Donnerstag gibt es keinen Deutschkurs.', answer: 'richtig', explanation: 'Der Lehrer ist krank. Jan schreibt: „Wir haben am Donnerstag frei!“' },
      { number: 5, text: 2, statement: 'Am Freitag lernen Thomas und Jan in Raum 102.', answer: 'falsch', explanation: 'Am Freitag lernen sie in Raum 204. Raum 102 war der ursprüngliche Donnerstag-Raum.' },
    ],
  },
  teil2: {
    sources: [
      { id: 'a', title: 'Café & Bäckerei „Sonne“', lines: ['Willkommen im Café Sonne! Wir haben jeden Tag von 07:00 bis 19:00 Uhr geöffnet.', 'Bei uns gibt es frisches Brot, Brötchen, Kaffee und hausgemachten Kuchen.', 'Frühstück servieren wir Samstag und Sonntag von 08:00 bis 12:00 Uhr. Kostenloses WLAN für alle Gäste!', 'Adresse: Bahnhofstraße 12, Köln.'] },
      { id: 'b', title: 'Restaurant & Pizzeria „Mamma Mia“', lines: ['Appetit auf Pizza und Pasta? Kommen Sie ins Restaurant Mamma Mia!', 'Öffnungszeiten: Dienstag bis Sonntag von 12:00 bis 22:00 Uhr (Montag Ruhetag).', 'Wir bieten italienische Spezialitäten, Salate und Eis. Am Mittag gibt es ein Menü für nur 8,50 Euro.', 'Tischreservierung telefonisch unter 0221-554433.'] },
    ],
    questions: [
      { number: 6, statement: 'Wo gibt es am Wochenende Frühstück?', answer: 'a', explanation: 'Café Sonne serviert Frühstück am Samstag und Sonntag von 08:00 bis 12:00 Uhr.' },
      { number: 7, statement: 'Wo kann man eine Pizza bestellen?', answer: 'b', explanation: 'Restaurant Mamma Mia bietet italienische Spezialitäten wie Pizza und Pasta an.' },
      { number: 8, statement: 'Wo ist montags geschlossen?', answer: 'b', explanation: 'Mamma Mia hat am Montag Ruhetag.' },
      { number: 9, statement: 'Wo bekommen die Gäste kostenloses WLAN?', answer: 'a', explanation: 'Café Sonne bietet kostenloses WLAN für alle Gäste.' },
      { number: 10, statement: 'Wo gibt es ein günstiges Mittagsmenü?', answer: 'b', explanation: 'Mamma Mia bietet ein Mittagsmenü für 8,50 Euro.' },
    ],
  },
  teil3: { questions: [
    { number: 11, location: 'Schild an einer Tür', statement: 'Die Apotheke am Markt ist sonntags geöffnet.', answer: 'falsch', explanation: 'Die Apotheke am Markt ist sonntags geschlossen. Der Notdienst ist in der Stadt-Apotheke.', notice: { kind: 'hours', heading: 'Apotheke am Markt', lines: ['Öffnungszeiten:', 'Montag bis Freitag: 08:00–18:30 Uhr', 'Samstag: 08:00–13:00 Uhr', 'Sonntag geschlossen.', '', 'Notdienst am Sonntag:', 'Stadt-Apotheke, Hauptstraße 45.'] } },
    { number: 12, location: 'Aushang am Bahnhof', statement: 'Der Zug nach Berlin fährt heute von Gleis 5.', answer: 'richtig', explanation: 'Der Aushang am Bahnhof informiert: „fährt heute von Gleis 5 ab.“', notice: { kind: 'warning', heading: 'Gleis 3 gesperrt!', lines: ['Der Zug nach Berlin um 14:15 Uhr fährt heute von Gleis 5 ab.', '', 'Wir bitten um Ihr Verständnis.'] } },
    { number: 13, location: 'Anzeige in der Zeitung', statement: 'Das blaue Fahrrad kostet 90 Euro.', answer: 'richtig', explanation: 'In der Kleinanzeige steht: „Preis: 90 Euro.“', notice: { kind: 'notice', heading: 'Fahrrad zu verkaufen!', lines: ['Schönes Damenfahrrad, blau, sehr guter Zustand.', 'Preis: 90 Euro.', 'Abholung in Berlin-Mitte.', 'Telefon: 0176-9876543.'] } },
    { number: 14, location: 'Hinweis im Supermarkt', statement: 'Der Fisch im Supermarkt kostet 12,00 Euro pro Kilo.', answer: 'richtig', explanation: 'Im Supermarkt kostet 1 kg Lachs 12,00 Euro.', notice: { kind: 'notice', heading: 'Frischer Fisch im Angebot!', lines: ['Sehr geehrte Kunden, heute haben wir frischen Fisch im Angebot!', '1 kg Lachs für nur 12,00 Euro.', 'Nur solange der Vorrat reicht.'] } },
    { number: 15, location: 'Zettel an der Sprachschule', statement: 'Der Spanischkurs ist jeden Tag am Morgen.', answer: 'falsch', explanation: 'Der Kurs findet montags und mittwochs abends von 18:00 bis 19:30 Uhr statt, nicht jeden Tag morgens.', notice: { kind: 'event', heading: 'Sommerkurs Spanisch', lines: ['Start: 1. Juli', 'Immer montags und mittwochs von 18:00 bis 19:30 Uhr.', '', 'Anmeldung im Sekretariat (Raum 10).'] } },
  ] },
};

export const A1_MOCK_2_LISTENING = { sampleId: 'sample-2', teil1: A1_EXAM_HOEREN_SAMPLE_2_TEIL1, teil2: A1_EXAM_HOEREN_SAMPLE_2_TEIL2, teil3: A1_EXAM_HOEREN_SAMPLE_2_TEIL3 };

export const A1_MOCK_2_WRITING_TASK = {
  id: 'a1-mock-02-housewarming', title: 'Einladung zur Einweihungsparty', register: 'Informal', recipient: 'Markus', wordTarget: 30,
  situation: 'Sie haben eine neue Wohnung gefunden und möchten eine kleine Einweihungsparty (Housewarming Party) feiern. Laden Sie Ihren Freund Markus ein.',
  instruction: 'Schreiben Sie eine kurze E-Mail an Ihren Freund Markus. Schreiben Sie zu allen drei Punkten (ca. 30 Wörter). Vergessen Sie nicht die Anrede und den Gruß!',
  points: ['Grund des Schreibens: Einladung zur Party.', 'Wann und wo? Tag, Uhrzeit, Adresse.', 'Mitbringen: Was soll Markus mitbringen?'],
  contentKeys: ['invitation', 'when_where', 'bring'],
  modelAnswer: 'Lieber Markus,\n\nich lade dich zu meiner Einweihungsparty ein. Wir feiern am Samstag um 18 Uhr in der Gartenstraße 8. Kommst du auch? Bring bitte Saft mit.\n\nLiebe Grüße\nAnna',
};

export const A1_MOCK_2_WRITING = {
  teil1: {
    scenario: ['Ihre Bekannte, Frau Elena Rossi, möchte an einem Sprachkurs in Berlin teilnehmen. Sie füllen für sie das Anmeldeformular aus.', 'Ihre Bekannte, Elena Rossi, kommt aus Italien (Rom). Sie ist 26 Jahre alt und möchte im August einen Deutschkurs an der Sprachschule Berlin besuchen. Sie reist mit ihrem Ehemann und zwei Kindern nach Berlin. Während des Kurses wohnt die Familie im Hotel Central, Hauptstraße 14, 10117 Berlin. Frau Rossi hat bereits Deutsch gelernt und hat das Sprachniveau A1. Sie möchte die Kursgebühr bar vor Ort bezahlen.'],
    instruction: 'Schreiben Sie die 5 fehlenden Informationen (Aufgaben 1–5) in das Formular.',
    formRows: [
      { kind: 'prefilled', label: 'Familienname', value: 'Rossi' },
      { kind: 'prefilled', label: 'Vorname', value: 'Elena' },
      { kind: 'prefilled', label: 'Heimatland', value: 'Italien' },
      { kind: 'input', number: 1, label: 'Anzahl der mitreisenden Familienmitglieder', answer: '3', alternatives: ['drei'], explanation: 'Ehemann + 2 Kinder = 3 mitreisende Familienmitglieder. Elena selbst zählt hier nicht mit.' },
      { kind: 'input', number: 2, label: 'Adresse in Berlin', answer: 'Hotel Central, Hauptstraße 14, 10117 Berlin', alternatives: ['Hotel Central, Hauptstraße 14'] },
      { kind: 'input', number: 3, label: 'Deutschkenntnisse (Niveau)', answer: 'A1', alternatives: ['Grundkenntnisse'] },
      { kind: 'input', number: 4, label: 'Wunschmonat für den Kurs', answer: 'August', alternatives: [] },
      { kind: 'input', number: 5, label: 'Bezahlung (wie?)', answer: 'Bar', alternatives: ['Barzahlung'] },
    ],
  },
  teil2: { instruction: A1_MOCK_2_WRITING_TASK.instruction, reminder: 'Schreiben Sie eine passende Anrede, alle drei Inhaltspunkte, einen Gruß und Ihren Namen.' },
};

export const A1_MOCK_2_SPEAKING = {
  durationSeconds: 15 * 60, maxScore: 25, passScore: 15,
  tasks: [
    { id: 'teil1', teil: '1', title: 'Teil 1 · Sich vorstellen', context: 'Persönliche Vorstellung', maxRecordingSeconds: 90,
      prompt: 'Stellen Sie sich anhand der Stichpunkte auf der Karte vor. Der Prüfer stellt Ihnen danach noch 1–2 Fragen (z. B. Buchstabieren oder eine Zahl nennen).',
      card: ['Name?', 'Alter?', 'Land?', 'Wohnort?', 'Sprachen?', 'Beruf?', 'Hobby?'],
      followUp: 'Prüferfragen für diese Aufnahme: Wie buchstabieren Sie Ihren Familiennamen? Wie lautet Ihre Telefonnummer? Sie können eine erfundene Telefonnummer nennen.',
    },
    { id: 'teil2', teil: '2', title: 'Teil 2 · Informationen erfragen und geben', context: 'Thema: Einkaufen', maxRecordingSeconds: 60,
      prompt: 'Sie ziehen eine Karte mit einem Thema und einem Wort. Stellen Sie Ihrem Partner eine Frage und antworten Sie auf die Frage Ihres Partners.', keyword: 'Bäckerei',
      followUp: 'Stellen Sie zuerst Ihre Frage zum Thema Einkaufen mit dem Wort „Bäckerei“. Beantworten Sie danach diese Partnerfrage: Was kaufen Sie in der Bäckerei?',
    },
    { id: 'teil3', teil: '3', title: 'Teil 3 · Bitten formulieren und darauf reagieren', context: 'Höfliche Bitte', maxRecordingSeconds: 60,
      prompt: 'Sie ziehen eine Karte mit einem Bild. Formulieren Sie eine höfliche Bitte an Ihren Partner. Der Partner reagiert darauf.', picture: 'pencil', pictureAlt: 'Ein Bleistift',
      followUp: 'Formulieren Sie zuerst eine höfliche Bitte zum Bild. Reagieren Sie danach auf diese Partnerbitte: Können Sie mir bitte einen Stift geben?',
    },
  ],
};
