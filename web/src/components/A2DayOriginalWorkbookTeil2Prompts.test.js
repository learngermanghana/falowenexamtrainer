import fs from "fs";
import path from "path";

const read = (name) => fs.readFileSync(path.resolve(__dirname, name), "utf8");

const historicalPromptChecks = [
  {
    day: 1,
    file: "A2Day2SmallTalkWorkbookEnhancedPage.js",
    markers: [
      "Schreibe einen Brief an deinen Freund Felix",
      "Erzähle Felix etwas über deine Arbeit und deine Familie.",
      "Frage Felix, wie es ihm geht und was bei ihm neu ist.",
    ],
  },
  {
    day: 2,
    file: "A2Day2PersonenBeschreibenWorkbookPage.js",
    markers: [
      "Schreibe einen Brief an Felix",
      "Beschreibe deinen Chef oder deine Chefin: Aussehen, Persönlichkeit und Verhalten.",
      "Was gefällt dir an deinem Chef oder deiner Chefin, und was könnte besser sein?",
    ],
  },
  {
    day: 3,
    file: "A2Day3ComparisonsWorkbookPage.js",
    markers: [
      "Schreibe einen Brief an deinen Freund Felix. Beschreibe und vergleiche deine Mutter und deinen Vater.",
      "Vergleiche beide mit so ... wie und dem Komparativ",
      "Frage Felix am Ende nach seinen Eltern.",
    ],
  },
  {
    day: 4,
    file: "A2Day4WoMoechtenWirUnsTreffenWorkbookPage.js",
    markers: [
      "Schreiben Sie einen Brief an Herrn Felix Asadu und laden Sie ihn zu einem gemeinsamen Wochenende ein.",
      "Fragen Sie, wann er Zeit hat und wo das Treffen stattfinden soll.",
      "Fragen Sie, ob er etwas Bestimmtes für ein gemeinsames Abendessen oder eine Aktivität mitbringen kann.",
    ],
  },
  {
    day: 5,
    file: "A2Day5FreizeitWorkbookPage.js",
    markers: [
      "Sie möchten mit Ihrem Freund Alex in Ihrer Freizeit etwas unternehmen. Schreiben Sie Alex eine E-Mail:",
      "Sagen Sie, dass Sie Zeit haben und etwas zusammen machen möchten.",
      "Fragen Sie, ob er am Wochenende frei ist.",
      "Fragen Sie, ob er einen Vorschlag für eine Aktivität hat.",
    ],
  },
  {
    day: 6,
    file: "A2Day6MoebelRaeumeWorkbookPage.js",
    markers: [
      "Schreibe eine Nachricht an deine Freundin oder deinen Freund über dein Zimmer.",
      "Beschreibe mindestens zwei Räume in deiner Wohnung.",
      "Nenne mindestens fünf Möbel und sage, wo sie stehen (Wo? + Dativ).",
      "Beschreibe zwei Veränderungen (Wohin? + Akkusativ)",
    ],
  },
  {
    day: 7,
    file: "A2Day7WohnungSuchenWorkbookPage.js",
    markers: [
      "Sie möchten eine Wohnung in einer bestimmten Stadt mieten. Schreiben Sie eine E-Mail an den Vermieter:",
      "Fragen Sie nach einer verfügbaren Wohnung.",
      "Geben Sie an, welche Kriterien für Sie wichtig sind (z. B. Größe, Lage, Preis).",
      "Fragen Sie nach den Mietbedingungen und der Möglichkeit, die Wohnung zu besichtigen.",
    ],
  },
  {
    day: 8,
    file: "A2Day8RezepteUndEssenWorkbookPage.js",
    markers: [
      "Situation: Sie möchten einen Tisch in einem Restaurant reservieren.",
      "Fragen Sie nach einem freien Tisch.",
      "Geben Sie an, was für Sie wichtig ist (z. B. Datum, Uhrzeit, Anzahl der Personen).",
      "Fragen Sie nach dem Menü und den Preisen.",
    ],
  },
  {
    day: 9,
    file: "A2Day9UrlaubWorkbookPage.js",
    markers: [
      "Sie planen einen Urlaub und möchten eine Unterkunft reservieren. Schreiben Sie eine E-Mail an ein Hotel:",
      "Fragen Sie nach einem freien Zimmer.",
      "Geben Sie an, was für Sie wichtig ist (z. B. Datum, Anzahl der Personen, Art des Zimmers).",
      "Fragen Sie nach den Preisen und den zusätzlichen Leistungen (z. B. Frühstück, Internetzugang).",
    ],
  },
  {
    day: 16,
    file: "A2Day16WohlbefindenUndEntspannungWorkbookPage.js",
    markers: [
      "Sie möchten einen Arzt wegen Ihrer Gesundheit kontaktieren.",
      "Fragen Sie nach einem Termin",
      "Fragen Sie nach den Kosten oder ob Ihre Versicherung die Behandlung abdeckt.",
    ],
  },
  {
    day: 18,
    file: "A2Day18DieBankAnrufenWorkbookPage.js",
    markers: [
      "Sie sind jetzt in Ghana und Ihre Karte wurde gesperrt.",
      "fragen, ob Ihre Karte entsperrt werden kann.",
      "fragen, welche Dokumente oder Informationen dafür benötigt werden.",
      "fragen, wie lange der Vorgang dauern wird.",
    ],
  },
  {
    day: 19,
    file: "A2Day19EinkaufenWoUndWieWorkbookPage.js",
    markers: [
      "Writing Task: Einladung zum Einkaufen",
      "Laden Sie ihn oder sie zum Einkaufen ein und erklären Sie den Grund.",
      "Bitten Sie um seine oder ihre Meinung zu Ihrer Idee.",
    ],
  },
  {
    day: 21,
    file: "A2Day21EinWochenendePlanenWorkbookPage.js",
    markers: [
      "Schreiben Sie einen Brief an einen Freund oder eine Freundin",
      "Beschreiben Sie Ihre Wochenendpläne und erklären Sie, warum sie besonders sind",
      "Erklären Sie, was die Person mitbringen sollte oder was sie erwarten kann",
    ],
  },
];

const replacedGenericSummaries = [
  ["A2Day5FreizeitWorkbookPage.js", "Schreiben Sie eine kurze E-Mail über Ihre Freizeit."],
  ["A2Day6MoebelRaeumeWorkbookPage.js", "Schreiben Sie eine kurze Wohnungsbeschreibung."],
  ["A2Day7WohnungSuchenWorkbookPage.js", "Schreiben Sie eine kurze Nachricht an einen Vermieter."],
  ["A2Day8RezepteUndEssenWorkbookPage.js", "Schreiben Sie ein einfaches Rezept."],
  ["A2Day9UrlaubWorkbookPage.js", "Schreiben Sie eine kurze E-Mail über einen Urlaub."],
];

describe("original A2 Teil 2 prompt identity", () => {
  it.each(historicalPromptChecks)("keeps the historical Day $day writing task", ({ file, markers }) => {
    const source = read(file);
    markers.forEach((marker) => expect(source).toContain(marker));
  });

  it.each(replacedGenericSummaries)("does not reintroduce the shortened summary in %s", (file, summary) => {
    expect(read(file)).not.toContain(summary);
  });

  it("keeps structured writing content on every restored shared workbook", () => {
    [5, 6, 7, 8, 9, 18].forEach((day) => {
      const file = historicalPromptChecks.find((entry) => entry.day === day).file;
      const source = read(file);
      expect(source).toContain("schreibenContent={schreibenContent}");
      expect(source).toContain("WorkbookTaskCard");
    });
  });
});
