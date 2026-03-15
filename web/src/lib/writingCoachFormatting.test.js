import { parseImportantPhraseLine } from "./writingCoachFormatting";

describe("parseImportantPhraseLine", () => {
  test("parses english Important phrases label", () => {
    expect(parseImportantPhraseLine("Important phrases: Ich freue mich, Mit freundlichen Grüßen")).toEqual({
      label: "Important phrases",
      phrases: ["Ich freue mich", "Mit freundlichen Grüßen"],
    });
  });

  test("parses german label and bullet prefix", () => {
    expect(parseImportantPhraseLine("- Wichtige Ausdrücke: Termin verschieben; pünktlich ankommen")).toEqual({
      label: "Wichtige Ausdrücke",
      phrases: ["Termin verschieben", "pünktlich ankommen"],
    });
  });

  test("returns null for unrelated lines", () => {
    expect(parseImportantPhraseLine("This is a normal sentence.")).toBeNull();
  });
});
