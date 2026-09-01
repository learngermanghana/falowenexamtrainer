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
      "Brief an Felix: Mein Chef / Meine Chefin",
      "Beschreibe das Aussehen deines Chefs / deiner Chefin.",
      "Beschreibe Persönlichkeit und Verhalten bei der Arbeit.",
      "Sage, was dir gefällt oder was besser sein könnte.",
    ],
  },
  {
    day: 3,
    file: "A2Day3ComparisonsWorkbookPage.js",
    markers: [
      "Brief an Felix: Meine Mutter und mein Vater",
      "Vergleiche ihr Aussehen mit",
      "Vergleiche ihren Charakter.",
      "Frage Felix am Ende nach seinen Eltern.",
    ],
  },
  {
    day: 4,
    file: "A2Day4WoMoechtenWirUnsTreffenWorkbookPage.js",
    markers: [
      "Formeller Brief: Einladung zu einem gemeinsamen Wochenende",
      "Schreiben Sie Herrn Felix Asadu einen kurzen Brief",
      "Fragen Sie, wann er Zeit hat und wo Sie sich treffen können.",
      "Fragen Sie, ob er etwas für das Essen oder die Aktivität mitbringen kann.",
    ],
  },
  {
    day: 5,
    file: "A2Day5FreizeitWorkbookPage.js",
    markers: [
      "E-Mail an Alex: Freizeit planen",
      "Du möchtest mit deinem Freund Alex am Wochenende etwas unternehmen.",
      "Frage, ob Alex am Wochenende frei ist.",
      "Schlage selbst eine mögliche Aktivität vor.",
    ],
  },
  {
    day: 6,
    file: "A2Day6MoebelRaeumeWorkbookPage.js",
    markers: [
      "E-Mail an eine Freundin / einen Freund: Mein Zimmer",
      "Warum schreiben Sie?",
      "Beschreiben Sie Ihr Zimmer und die wichtigsten Möbel.",
      "Was gefällt Ihnen an Ihrem Zimmer besonders und warum?",
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
  it.each(historicalPromptChecks)("keeps the Day $day writing task clear and specific", ({ file, markers }) => {
    const source = read(file);
    markers.forEach((marker) => expect(source).toContain(marker));
  });

  it.each(replacedGenericSummaries)("does not reintroduce the shortened summary in %s", (file, summary) => {
    expect(read(file)).not.toContain(summary);
  });

  it("keeps structured writing content on every restored shared workbook", () => {
    [2, 3, 4, 5, 6, 7, 8, 9, 18].forEach((day) => {
      const file = historicalPromptChecks.find((entry) => entry.day === day).file;
      const source = read(file);
      expect(source).toMatch(/schreibenContent=\{[A-Za-z][A-Za-z0-9]*\}/);
      expect(source).toContain("WorkbookTaskCard");
    });
  });
});
