import { WRITING_PROMPTS } from "./writingExamPrompts";
// Practice-specific writing tasks. These do not replace the graded Goethe mock tasks.
const task = (id, title, situation, points, extra = {}) => ({ id, title, situation, points, ...extra });
const part = (id, label, format, targetWords, tasks, description = "") => ({
  id, label, format, targetWords, tasks, description,
});

// Reuse the ten existing Falowen A1 Goethe Schreiben samples instead of duplicating them.
const A1_LETTER_SAMPLES = WRITING_PROMPTS.A1.map((sample, index) => ({
  id: "a1-existing-letter-" + String(index + 1),
  title: ["Hotelzimmer anfragen","Zum Geburtstag antworten","Im Deutschkurs fehlen","Informationen zum Sprachkurs","Ein Treffen vereinbaren","Touristeninformation","Ein Fahrrad kaufen","Mitglied im Sportverein","Einladung nach München","Problem mit der Heizung"][index],
  situation: sample.Thema,
  points: sample.Punkte,
  category: [true,false,true,true,false,true,true,true,false,true][index] ? "Formelle E-Mail" : "Informelle E-Mail",
  register: [true,false,true,true,false,true,true,true,false,true][index] ? "formal" : "informal",
}));

export const EXAM_WRITING_MODULES = Object.freeze({
  A1: {
    minutes: 20,
    parts: [
      part("teil1", "Part 1 · Form", "form", null, [
        task("a1-course-registration", "Anmeldung zum Deutschkurs",
          "Ihre Kollegin Maria Garcia (28 Jahre) wohnt in 10115 Berlin, Hauptstraße 12. Sie möchte einen Intensivkurs Deutsch für Anfänger (A1) buchen. Der Kurs beginnt am 01.11.2026. Sie bezahlt mit Kreditkarte.",
          ["Lesen Sie die Informationen genau.", "Ergänzen Sie nur die fünf nummerierten Lücken."], {
            category: "Sprachschule Berlin — Anmeldung",
            formFields: [
              { key: "name", label: "Name, Vorname", fixed: "Garcia, Maria" },
              { key: "geburt", label: "Geburtsdatum", fixed: "14.05.1998" },
              { key: "wohnort", label: "Wohnort / PLZ", number: 1, answer: ["10115 Berlin", "Berlin"] },
              { key: "kurstyp", label: "Kurstyp", number: 2, answer: ["Intensivkurs"] },
              { key: "niveau", label: "Sprachniveau", fixed: "A1" },
              { key: "beginn", label: "Kursbeginn", number: 3, answer: ["01.11.2026", "1.11.2026"] },
              { key: "zahlung", label: "Bezahlungsart", number: 4, answer: ["Kreditkarte", "mit Kreditkarte"] },
              { key: "personen", label: "Anzahl der Personen", number: 5, answer: ["1", "eine Person", "1 Person"] },
            ],
          }),
        task("a1-hotel-registration", "Hotel-Anmeldung",
          "Ihr Bekannter Thomas Novak reist vom 12.08. bis 15.08. mit seiner Frau nach München. Er bucht ein Doppelzimmer mit Frühstück im Hotel Gartenstadt. Er zahlt bar vor Ort.",
          ["Ergänzen Sie die fünf fehlenden Angaben.", "Verwenden Sie die Informationen aus dem Text."], {
            category: "Hotel Gartenstadt — Meldeschein",
            formFields: [
              { key: "name", label: "Name des Gastes", fixed: "Novak, Thomas" },
              { key: "wohnort", label: "Wohnort", fixed: "Prag" },
              { key: "gaeste", label: "Anzahl der Gäste", number: 1, answer: ["2", "zwei", "2 Personen"] },
              { key: "zimmer", label: "Zimmertyp", number: 2, answer: ["Doppelzimmer", "ein Doppelzimmer"] },
              { key: "fruehstueck", label: "Verpflegung (mit/ohne Frühstück)", number: 3, answer: ["mit Frühstück", "Frühstück"] },
              { key: "abreise", label: "Abreisetag", number: 4, answer: ["15.08.", "15.08", "15. August"] },
              { key: "zahlung", label: "Zahlungsweise", number: 5, answer: ["bar", "Barzahlung"] },
            ],
          }),
        task("a1-library-card", "Bibliotheksausweis",
          "Ihre Freundin Sarah Jenkins (Studentin) möchte sich in der Stadtbibliothek Köln anmelden. Sie wählt eine Jahreskarte. Ihre Adresse ist Kantstraße 44, 50667 Köln. Telefonnummer: 0176-5544332.",
          ["Lesen Sie die Situation.", "Ergänzen Sie die vier nummerierten Felder."], {
            category: "Stadtbibliothek Köln — Kundenkarte",
            formFields: [
              { key: "name", label: "Vor- und Nachname", fixed: "Sarah Jenkins" },
              { key: "status", label: "Beruf / Status", number: 1, answer: ["Studentin"] },
              { key: "ort", label: "PLZ / Ort", number: 2, answer: ["50667 Köln", "Köln"] },
              { key: "strasse", label: "Straße, Hausnummer", fixed: "Kantstraße 44" },
              { key: "telefon", label: "Telefonnummer", number: 3, answer: ["0176-5544332", "01765544332"] },
              { key: "karte", label: "Kartenart (Monatskarte/Jahreskarte)", number: 4, answer: ["Jahreskarte"] },
            ],
          }),
        task("a1-sports-club", "Beitrittserklärung Sportverein",
          "Herr Jan Kowalski, geboren am 03.02.1990, möchte einen Tanzkurs im Sportverein Aktiv Halle besuchen. Der Kurs findet jeden Donnerstag statt. Er möchte für 6 Monate Mitglied bleiben. Die Gebühr wird per Bankeinzug (SEPA) bezahlt.",
          ["Übertragen Sie die richtigen Angaben.", "Ergänzen Sie alle fünf Felder."], {
            category: "Sportverein Aktiv Halle — Mitgliedsantrag",
            formFields: [
              { key: "name", label: "Name, Vorname", fixed: "Kowalski, Jan" },
              { key: "geburt", label: "Geburtsdatum", number: 1, answer: ["03.02.1990", "3.2.1990"] },
              { key: "kurs", label: "Sportart / Kurs", number: 2, answer: ["Tanzkurs", "Tanzen"] },
              { key: "tag", label: "Kurstag", number: 3, answer: ["Donnerstag"] },
              { key: "dauer", label: "Dauer der Mitgliedschaft", number: 4, answer: ["6 Monate", "sechs Monate"] },
              { key: "zahlung", label: "Bezahlungsart", number: 5, answer: ["Bankeinzug", "SEPA", "SEPA-Bankeinzug"] },
            ],
          }),
        task("a1-repair-form", "Reparaturauftrag Kundendienst",
          "Frau Elena Rossi ruft beim Kundendienst an. Ihre Waschmaschine der Marke Bosch (Modell Maxx 6) ist kaputt. Der Techniker soll am 20.10.2026 am Nachmittag kommen. Kontakt per E-Mail: elena.rossi@email.com.",
          ["Lesen Sie die Kundendaten.", "Ergänzen Sie die fünf fehlenden Angaben."], {
            category: "Kundendienst Elektro — Reparaturauftrag",
            formFields: [
              { key: "name", label: "Kundenname", fixed: "Elena Rossi" },
              { key: "email", label: "E-Mail-Adresse", number: 1, answer: ["elena.rossi@email.com"] },
              { key: "geraet", label: "Gerät / Marke", number: 2, answer: ["Waschmaschine / Bosch", "Waschmaschine Bosch", "Bosch Waschmaschine"] },
              { key: "modell", label: "Modellbezeichnung", number: 3, answer: ["Maxx 6"] },
              { key: "datum", label: "Gewünschter Termin (Datum)", number: 4, answer: ["20.10.2026", "20.10.26"] },
              { key: "tageszeit", label: "Tageszeit (Vormittag/Nachmittag)", number: 5, answer: ["Nachmittag", "am Nachmittag"] },
            ],
          }),
      ], "Copy the details from the German scenario into the form."),
      part("teil2", "Part 2 · Email", "email", "about 30 words", A1_LETTER_SAMPLES,
        "Write about 30 words in German with a greeting, all three points, a closing and your name."),
    ],
  },
  A2: {
    minutes: 30,
    parts: [
      part("teil1", "Part 1 · SMS", "message", "20–30 words", [
        task("a2-sms-01", "Verspätung beim Treffen",
          "Sie sind unterwegs in der Stadt und verspäten sich zu einem Treffen mit Ihrer Freundin Anna. Schreiben Sie eine SMS.",
          ["Entschuldigen Sie sich für die Verspätung.", "Nennen Sie den Grund.", "Schlagen Sie einen neuen Treffpunkt und eine neue Uhrzeit vor."],
          { category: "SMS · Verspätung" }),
        task("a2-sms-02", "Geburtstagseinladung",
          "Ihr Kollege Markus hat Sie zu seiner Geburtstagsparty am Samstag eingeladen. Schreiben Sie ihm eine SMS.",
          ["Danken Sie für die Einladung und sagen Sie zu.", "Fragen Sie, was Sie mitbringen können.", "Fragen Sie nach der Uhrzeit."],
          { category: "SMS · Einladung" }),
        task("a2-sms-03", "Kinotreffen absagen",
          "Sie wollten am Freitag mit Ihrem Freund Alex ins Kino gehen, aber Sie sind krank geworden. Schreiben Sie eine SMS.",
          ["Sagen Sie das Treffen ab.", "Erklären Sie, warum Sie nicht kommen können.", "Schlagen Sie einen Termin für nächste Woche vor."],
          { category: "SMS · Freizeit" }),
        task("a2-sms-04", "Hilfe beim Umzug",
          "Sie ziehen am Wochenende in eine neue Wohnung um und brauchen Hilfe. Schreiben Sie eine SMS an Ihren Mitschüler David.",
          ["Informieren Sie über Ihren Umzug am Samstag.", "Bitten Sie David um Hilfe.", "Bieten Sie ein Essen oder Pizza als Dankeschön an."],
          { category: "SMS · Wohnen" }),
        task("a2-sms-05", "Ausflug zum See",
          "Sie möchten am Sonntag mit Ihrer Bekannten Sarah einen Ausflug zum See machen. Schreiben Sie eine SMS.",
          ["Schlagen Sie den Ausflug vor.", "Fragen Sie nach dem Treffpunkt und der Abfahrtszeit.", "Erwähnen Sie, was Sie für das Picknick mitbringen."],
          { category: "SMS · Ausflug" }),
      ]),
      part("teil2", "Part 2 · Email", "email", "30–40 words", [
        task("a2-email-01", "Beim Deutschkurs fehlen",
          "Sie besuchen einen Deutschkurs bei Frau Weber. Morgen können Sie nicht zum Unterricht kommen, weil Sie einen Arzttermin haben. Schreiben Sie eine E-Mail.",
          ["Informieren Sie Frau Weber, dass Sie im Unterricht fehlen.", "Nennen Sie den Grund: Arzttermin.", "Bitten Sie um die Hausaufgaben für die nächste Stunde."],
          { category: "Formelle E-Mail · Deutschkurs", register: "formal" }),
        task("a2-email-02", "Heizung kaputt",
          "In Ihrer Mietwohnung ist seit gestern die Heizung kaputt. Schreiben Sie eine E-Mail an Ihren Vermieter, Herrn Schneider.",
          ["Informieren Sie über das Problem mit der Heizung.", "Bitten Sie um einen schnellen Reparaturtermin.", "Nennen Sie Ihre Erreichbarkeit (Telefonnummer oder Uhrzeit)."],
          { category: "Formelle E-Mail · Wohnen", register: "formal" }),
        task("a2-email-03", "Krankmeldung bei der Arbeit",
          "Sie sind krank und können heute nicht zur Arbeit kommen. Schreiben Sie eine E-Mail an Ihre Chefin, Frau Müller.",
          ["Informieren Sie über Ihre Krankheit und Abwesenheit.", "Nennen Sie die voraussichtliche Dauer.", "Sagen Sie, dass das ärztliche Attest folgt."],
          { category: "Formelle E-Mail · Beruf", register: "formal" }),
        task("a2-email-04", "Informationen zum B1-Kurs",
          "Sie möchten an der Volkshochschule einen B1-Deutschkurs besuchen. Schreiben Sie eine E-Mail an die Kursleitung, Herrn Braun.",
          ["Erklären Sie Ihr Interesse am B1-Kurs.", "Fragen Sie nach den Kurstagen und Uhrzeiten.", "Fragen Sie nach den Kursgebühren."],
          { category: "Formelle E-Mail · Weiterbildung", register: "formal" }),
        task("a2-email-05", "Hotelanreise verschieben",
          "Sie haben ein Zimmer im Hotel „Sonnhof“ gebucht, müssen aber Ihre Anreise um einen Tag verschieben. Schreiben Sie eine E-Mail an die Rezeption.",
          ["Nennen Sie Ihre Reservierung oder Ihren Namen.", "Erklären Sie die Änderung: Anreise erst am Samstag statt Freitag.", "Bitten Sie um eine kurze Bestätigung."],
          { category: "Formelle E-Mail · Reise", register: "formal" }),
      ]),
    ],
  },
  B1: {
    minutes: 60,
    parts: [
      part("teil1", "Part 1 · Personal Email", "email", "about 80 words", [
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
      part("teil2", "Part 2 · Opinion Post", "argument", "about 80 words", [
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
      part("teil3", "Part 3 · Formal Email", "email", "about 40 words", [
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
      part("teil1", "Part 1 · Forum Post", "argument", "about 150 words", [
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
      part("teil2", "Part 2 · Formal Message", "email", "about 100 words", [
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
      part("teil1", "Part 1 · Discussion", "argument", "about 230 words", [
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
      part("teil2", "Part 2 · Formal Message", "email", "about 120 words", [
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
      part("teil1", "Part 1 · Sentence Transformation", "transformation", null, [
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
      part("teil2", "Part 2 · Extended Writing", "argument", "about 350 words", [
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
  const fields = (taskConfig?.formFields || []).filter((field) => !field.fixed);
  const checks = fields.map((field) => ({
    key: field.key,
    correct: field.answer.some((answer) => normalizeWritingField(answer) === normalizeWritingField(values[field.key])),
  }));
  return { correct: checks.filter((item) => item.correct).length, total: checks.length, checks };
};

/** Exact, learner-visible question data for the server-side assessment registry.
 * Do not transmit model answers or sample solutions to the marking prompt.
 */
export const toRegistryWritingTasks = (modules = EXAM_WRITING_MODULES) =>
  Object.entries(modules).flatMap(([level, module]) =>
    module.parts.flatMap((part) =>
      part.tasks.filter((item) => part.format !== "form").map((item) => ({
        id: item.id,
        level,
        teil: part.id,
        format: part.format,
        register: item.register || null,
        wordTarget: part.targetWords || null,
        situation: item.situation,
        whatToInclude: item.points,
        ...(item.transformations ? {
          transformations: item.transformations.map(({ source, cue }) => ({ source, cue })),
        } : {}),
      }))
    )
  );
