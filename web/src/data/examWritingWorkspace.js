// Practice-specific writing tasks. These do not replace the graded Goethe mock tasks.
const task = (id, title, situation, points, extra = {}) => ({ id, title, situation, points, ...extra });
const part = (id, label, format, targetWords, tasks, description = "") => ({
  id, label, format, targetWords, tasks, description,
});

export const EXAM_WRITING_MODULES = Object.freeze({
  A1: {
    minutes: 20,
    parts: [
      part("teil1", "Teil 1 · Formular", "form", null, [
        task("a1-registration", "Anmeldung zum Ausflug",
          "Ana Neto möchte am Sonntag eine Busfahrt buchen. Sie reist mit ihrem Mann und zwei Kindern. Sie übernachtet im Hotel Seeblick in Seedorf und bezahlt bar.",
          ["Lies den Informationstext.", "Trage die Angaben in die passenden Felder ein."], {
            category: "Formular ausfüllen",
            formFields: [
              { key: "name", label: "Name", answer: ["Ana Neto", "Neto, Ana"] },
              { key: "personen", label: "Anzahl der Personen", answer: ["4", "vier"] },
              { key: "kinder", label: "Anzahl der Kinder", answer: ["2", "zwei"] },
              { key: "ort", label: "Ort", answer: ["Seedorf"] },
              { key: "zahlung", label: "Zahlungsart", answer: ["bar", "Bargeld"] },
            ],
            example: "Beispiel: Name → Ana Neto. Suche die übrigen Informationen im Text.",
          }),
        task("a1-language-course", "Anmeldung zum Deutschkurs",
          "Ali Mensah wohnt in Accra. Er möchte ab Montag einen Deutschkurs besuchen. Der Unterricht soll am Abend stattfinden. Seine Telefonnummer ist 024 123 4567.",
          ["Übertrage nur die Informationen, die im Text stehen.", "Ergänze alle fünf Formularfelder."], {
            category: "Formular ausfüllen",
            formFields: [
              { key: "name", label: "Vor- und Nachname", answer: ["Ali Mensah"] },
              { key: "wohnort", label: "Wohnort", answer: ["Accra"] },
              { key: "beginn", label: "Kursbeginn", answer: ["Montag", "am Montag"] },
              { key: "zeit", label: "Kurszeit", answer: ["abends", "Abend", "am Abend"] },
              { key: "telefon", label: "Telefonnummer", answer: ["024 123 4567", "0241234567"] },
            ],
            example: "Beispiel: Wohnort → Accra.",
          }),
      ], "Übertrage die Angaben aus dem Text in ein Formular."),
      part("teil2", "Teil 2 · E-Mail", "email", "ca. 30 Wörter", [
        task("a1-birthday", "Zum Geburtstag einladen",
          "Du möchtest deinen Freund Paul zu deiner Geburtstagsfeier einladen. Schreibe eine kurze E-Mail.",
          ["Lade Paul ein.", "Nenne Tag und Uhrzeit.", "Nenne den Ort."], {
            category: "Informelle E-Mail", register: "informal",
            example: "Lieber Paul,\nich habe am Samstag Geburtstag. Kommst du um 16 Uhr zu mir? Wir feiern bei mir zu Hause.\nLiebe Grüße\nAma",
          }),
        task("a1-hotel", "Zimmer im Hotel anfragen",
          "Du möchtest im Hotel Stadtblick ein Zimmer reservieren. Schreibe eine kurze E-Mail an das Hotel.",
          ["Schreibe, wann du kommst.", "Bitte um ein Einzelzimmer.", "Frage nach dem Preis."], {
            category: "Formelle E-Mail", register: "formal",
            example: "Sehr geehrte Damen und Herren,\nich komme am Freitag nach Berlin. Haben Sie ein Einzelzimmer? Wie viel kostet es pro Nacht?\nMit freundlichen Grüßen\nKojo Mensah",
          }),
      ]),
    ],
  },
  A2: {
    minutes: 30,
    parts: [
      part("teil1", "Teil 1 · SMS", "message", "20–30 Wörter", [
        task("a2-late", "Du kommst später",
          "Du bist auf dem Weg zu deiner Freundin Sara. Leider kommst du später. Schreibe eine Nachricht.",
          ["Entschuldige dich.", "Erkläre den Grund.", "Nenne eine neue Zeit und einen Treffpunkt."], {
            category: "SMS", example: "Hallo Sara, tut mir leid, mein Bus hat Verspätung. Ich komme um 17 Uhr. Treffen wir uns vor dem Kino? Bis gleich!",
          }),
        task("a2-cinema", "Ein Treffen verschieben",
          "Du kannst heute nicht mit deinem Freund ins Kino gehen. Schreibe eine SMS.",
          ["Erkläre kurz, warum du nicht kommen kannst.", "Schlage einen anderen Tag vor.", "Bitte um Antwort."], {
            category: "SMS", example: "Hi Ben, ich bin heute krank und kann leider nicht mitkommen. Hast du am Samstag Zeit? Schreib mir bitte kurz. Liebe Grüße!",
          }),
      ]),
      part("teil2", "Teil 2 · E-Mail", "email", "ca. 40 Wörter", [
        task("a2-course", "Informationen zum Sprachkurs",
          "Du interessierst dich für einen Deutschkurs. Schreibe an die Sprachschule.",
          ["Erkläre dein Interesse.", "Frage nach dem Beginn.", "Frage nach Kurszeiten und Kosten."], {
            category: "Formelle E-Mail", register: "formal",
            example: "Sehr geehrte Damen und Herren,\nich interessiere mich für Ihren Deutschkurs. Wann beginnt der nächste Kurs? Gibt es auch Abendunterricht? Wie viel kostet der Kurs?\nMit freundlichen Grüßen\nAma",
          }),
        task("a2-visit", "Ein Besuch bei einer Freundin",
          "Deine Freundin Lea hat dich eingeladen. Antworte ihr per E-Mail.",
          ["Bedanke dich.", "Erkläre deine Ankunft.", "Stelle eine Frage zum Besuch."], {
            category: "Informelle E-Mail", register: "informal",
            example: "Liebe Lea,\nvielen Dank für deine Einladung! Ich komme am Samstag um 15 Uhr mit dem Zug. Kannst du mich am Bahnhof abholen?\nLiebe Grüße\nKojo",
          }),
      ]),
    ],
  },
  B1: {
    minutes: 60,
    parts: [
      part("teil1", "Teil 1 · Persönliche E-Mail", "email", "ca. 80 Wörter", [
        task("b1-invitation", "Eine Einladung absagen",
          "Dein Freund Lukas hat dich zu seiner Geburtstagsfeier am Samstag eingeladen. Du kannst leider nicht kommen. Schreibe ihm eine E-Mail.",
          ["Entschuldige dich für deine Absage.", "Erkläre, warum du nicht kommen kannst.", "Schlage ein Treffen an einem anderen Tag vor."], {
            category: "Freundschaft & Alltag", register: "informal",
            example: "Lieber Lukas,\nvielen Dank für deine Einladung! Leider muss ich am Samstag arbeiten, weil meine Kollegin krank ist. Deshalb kann ich nicht zur Feier kommen. Das tut mir sehr leid. Hast du am Sonntag Zeit? Wir könnten uns im Café treffen und deinen Geburtstag nachfeiern.\nLiebe Grüße\nAma",
          }),
        task("b1-move", "Die neue Wohnung",
          "Du bist vor Kurzem umgezogen. Schreibe eine E-Mail an einen Freund.",
          ["Beschreibe deine neue Wohnung.", "Erkläre, warum du umgezogen bist.", "Lade deinen Freund zu einem Besuch ein."], {
            category: "Wohnen", register: "informal",
          }),
        task("b1-trip", "Ein gemeinsamer Ausflug",
          "Deine Freundin möchte mit dir einen Ausflug machen. Antworte ihr.",
          ["Schlage ein Ziel vor.", "Erkläre, was ihr dort machen könnt.", "Vereinbare Treffpunkt und Zeit."], {
            category: "Freizeit & Reisen", register: "informal",
          }),
      ]),
      part("teil2", "Teil 2 · Meinungsbeitrag", "argument", "ca. 80 Wörter", [
        task("b1-online", "Online lernen oder im Kurs?",
          "In einem Internetforum wird diskutiert: Ist Online-Lernen besser als Unterricht in einer Schule? Schreibe deine Meinung.",
          ["Nenne deine Meinung.", "Begründe sie mit mindestens zwei Argumenten.", "Gib ein Beispiel aus deiner Erfahrung."], {
            category: "Lernen & Bildung",
            example: "Meiner Meinung nach ist Online-Lernen praktisch, weil man von zu Hause lernen kann. Außerdem spart man Zeit. Trotzdem finde ich Unterricht im Kurs wichtig, denn dort kann man direkt Fragen stellen. Ich lerne zum Beispiel neue Wörter besser, wenn ich mit anderen spreche. Deshalb ist für mich eine Kombination am besten.",
          }),
        task("b1-transport", "Fahrrad statt Auto?",
          "Im Forum diskutieren die Mitglieder, ob mehr Menschen das Fahrrad benutzen sollten.",
          ["Äußere deine Meinung.", "Nenne einen Vorteil und einen Nachteil.", "Begründe deinen Standpunkt."], {
            category: "Umwelt & Verkehr",
          }),
      ]),
      part("teil3", "Teil 3 · Formelle E-Mail", "email", "ca. 40 Wörter", [
        task("b1-cancel", "Einen Termin absagen",
          "Du hast morgen einen Termin mit deiner Kursleiterin Frau Müller, kannst aber nicht kommen. Schreibe ihr.",
          ["Entschuldige dich.", "Nenne einen Grund.", "Bitte um einen neuen Termin."], {
            category: "Formelle E-Mail", register: "formal",
            example: "Sehr geehrte Frau Müller,\nleider kann ich morgen nicht zu unserem Termin kommen, weil ich krank bin. Das tut mir sehr leid. Wäre ein neuer Termin am Freitag möglich?\nMit freundlichen Grüßen\nAma Mensah",
          }),
        task("b1-seminar", "Informationen zum Seminar",
          "Du möchtest an einem beruflichen Seminar teilnehmen. Schreibe dem Veranstalter.",
          ["Erkläre dein Interesse.", "Frage nach den Terminen.", "Bitte um Informationen zu den Kosten."], {
            category: "Beruf & Karriere", register: "formal",
          }),
      ]),
    ],
  },
  B2: {
    minutes: 75,
    parts: [
      part("teil1", "Teil 1 · Forumsbeitrag", "argument", "ca. 150 Wörter", [
        task("b2-homeoffice", "Homeoffice: Chance oder Problem?",
          "In einem Onlineforum wird über Homeoffice diskutiert. Schreiben Sie einen begründeten Beitrag.",
          ["Äußern Sie Ihre Meinung.", "Nennen Sie Gründe und Beispiele.", "Gehen Sie auf Vor- und Nachteile ein.", "Schlagen Sie Alternativen vor."], {
            category: "Arbeit & Gesellschaft",
          }),
        task("b2-environment", "Plastik im Alltag reduzieren",
          "Diskutieren Sie in einem Forum Maßnahmen gegen Plastikmüll.",
          ["Formulieren Sie Ihre Position.", "Beschreiben Sie Vorteile und Schwierigkeiten.", "Nennen Sie eigene Erfahrungen.", "Machen Sie Vorschläge."], {
            category: "Umwelt",
          }),
      ]),
      part("teil2", "Teil 2 · Formelle Nachricht", "email", "ca. 100 Wörter", [
        task("b2-shift", "Arbeitszeit ändern",
          "Sie möchten Ihre Arbeitszeit vorübergehend ändern. Schreiben Sie an Ihre Vorgesetzte.",
          ["Beschreiben Sie Ihre Situation.", "Erklären Sie den Grund.", "Schlagen Sie eine Lösung vor.", "Bitten Sie um ein Gespräch."], {
            category: "Beruf", register: "formal",
          }),
        task("b2-project", "Projektbesprechung verschieben",
          "Eine Besprechung muss verschoben werden. Schreiben Sie an Ihre Kollegin.",
          ["Erläutern Sie den Anlass.", "Begründen Sie die Verschiebung.", "Schlagen Sie einen Ersatztermin vor.", "Bitten Sie um Bestätigung."], {
            category: "Organisation", register: "formal",
          }),
      ]),
    ],
  },
  C1: {
    minutes: 75,
    parts: [
      part("teil1", "Teil 1 · Diskussion", "argument", "ca. 230 Wörter", [
        task("c1-ai", "Künstliche Intelligenz im Unterricht",
          "Diskutieren Sie Chancen und Grenzen des Einsatzes künstlicher Intelligenz an Schulen.",
          ["Stellen Sie unterschiedliche Positionen dar.", "Begründen Sie Ihre eigene Haltung.", "Berücksichtigen Sie Gegenargumente.", "Ziehen Sie ein differenziertes Fazit."], {
            category: "Bildung & Technologie",
          }),
        task("c1-city", "Städte ohne Autos",
          "Verfassen Sie einen argumentativen Diskussionsbeitrag zur autofreien Innenstadt.",
          ["Erklären Sie die gesellschaftliche Bedeutung.", "Wägen Sie Chancen und Risiken ab.", "Beziehen Sie Beispiele ein.", "Entwickeln Sie Ihre Position."], {
            category: "Stadtentwicklung",
          }),
      ]),
      part("teil2", "Teil 2 · Formelle Nachricht", "email", "ca. 120 Wörter", [
        task("c1-application", "Bitte um Projektunterstützung",
          "Sie organisieren ein wissenschaftliches Projekt und möchten eine Institution um Unterstützung bitten.",
          ["Stellen Sie das Projekt vor.", "Begründen Sie die Bedeutung.", "Formulieren Sie Ihre Bitte präzise.", "Schlagen Sie das weitere Vorgehen vor."], {
            category: "Projektarbeit", register: "formal",
          }),
        task("c1-policy", "Änderung einer Regelung",
          "Sie schreiben als Kurssprecherin oder Kurssprecher an die Leitung einer Weiterbildungseinrichtung.",
          ["Beschreiben Sie die Regelung.", "Stellen Sie die Folgen dar.", "Unterbreiten Sie einen Lösungsvorschlag.", "Bitten Sie um Rückmeldung."], {
            category: "Bildung", register: "formal",
          }),
      ]),
    ],
  },
  C2: {
    minutes: 80,
    parts: [
      part("teil1", "Teil 1 · Umformungen", "transformation", null, [
        task("c2-transformations", "Sätze umformulieren",
          "Formulieren Sie die Sätze um. Die Bedeutung muss erhalten bleiben. Nutzen Sie das angegebene Schlüsselwort.",
          ["Achten Sie auf Bedeutung, Satzbau und Grammatik.", "Tragen Sie jede Lösung in das zugehörige Feld ein."], {
            category: "Sprachliche Präzision",
            transformations: [
              { source: "Obwohl die Nachfrage gestiegen ist, bleiben die Preise stabil.", cue: "trotz", hint: "Beginnen Sie mit „Trotz …“." },
              { source: "Man kann davon ausgehen, dass die Zahlen weiter steigen.", cue: "dürften", hint: "Verwenden Sie subjektive Modalität." },
              { source: "Die Expertin kritisierte, dass die Maßnahmen zu spät kamen.", cue: "Kritik", hint: "Verwenden Sie eine Nominalisierung." },
              { source: "Die Firma investiert, damit sie langfristig konkurrenzfähig bleibt.", cue: "um … zu", hint: "Drücken Sie den Zweck durch eine Infinitivkonstruktion aus." },
            ],
          }),
      ]),
      part("teil2", "Teil 2 · Längerer Text", "argument", "ca. 350 Wörter", [
        task("c2-digital", "Die Grenzen der Digitalisierung",
          "Verfassen Sie einen differenzierten argumentativen Text zum Spannungsverhältnis zwischen technologischem Fortschritt und gesellschaftlicher Verantwortung.",
          ["Entwickeln Sie eine nachvollziehbare These.", "Erörtern Sie mehrere Perspektiven.", "Berücksichtigen Sie ein Gegenargument.", "Formulieren Sie einen eigenständigen Schluss."], {
            category: "Gesellschaft & Technologie",
          }),
        task("c2-education", "Bildung als öffentliche Aufgabe",
          "Erörtern Sie, welchen Beitrag staatliche Institutionen und Einzelpersonen zu lebenslangem Lernen leisten sollten.",
          ["Stellen Sie relevante Positionen gegenüber.", "Analysieren Sie Zielkonflikte.", "Beziehen Sie Beispiele ein.", "Ziehen Sie eine begründete Schlussfolgerung."], {
            category: "Bildung & Gesellschaft",
          }),
        task("c2-language", "Mehrsprachigkeit in einer globalen Welt",
          "Untersuchen Sie den Zusammenhang zwischen Mehrsprachigkeit, kultureller Identität und gesellschaftlicher Teilhabe.",
          ["Beschreiben Sie das Spannungsfeld.", "Beurteilen Sie verschiedene Argumente.", "Belegen Sie Ihre Sichtweise.", "Formulieren Sie eine Synthese."], {
            category: "Sprache & Kultur",
          }),
        task("c2-environment", "Individuelle oder politische Verantwortung?",
          "Erörtern Sie, wie sich wirksamer Klimaschutz zwischen Staat, Wirtschaft und einzelnen Menschen aufteilen lässt.",
          ["Stellen Sie unterschiedliche Verantwortlichkeiten dar.", "Prüfen Sie Gegenargumente.", "Nennen Sie konkrete Beispiele.", "Entwickeln Sie eine differenzierte Position."], {
            category: "Umwelt & Politik",
          }),
      ]),
    ],
  },
});

export const getExamWritingModule = (level) =>
  EXAM_WRITING_MODULES[String(level || "").toUpperCase()] || EXAM_WRITING_MODULES.A1;

export const normalizeWritingField = (value) =>
  String(value || "").toLocaleLowerCase("de").replace(/[.,\s-]+/g, " ").trim();

export const assessPracticeForm = (taskConfig, values = {}) => {
  const fields = taskConfig?.formFields || [];
  const checks = fields.map((field) => ({
    key: field.key,
    correct: field.answer.some((answer) => normalizeWritingField(answer) === normalizeWritingField(values[field.key])),
  }));
  return { correct: checks.filter((item) => item.correct).length, total: checks.length, checks };
};
