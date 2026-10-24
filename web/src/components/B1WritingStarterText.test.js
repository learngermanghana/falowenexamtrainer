import { normalizeWritingStarterText } from "./B1WritingWorkspace";

describe("shared A2/B1 writing starter text", () => {
  test("turns escaped newlines into real editable line breaks", () => {
    expect(
      normalizeWritingStarterText("Sehr geehrte Damen und Herren,\\n\\nich interessiere mich für Ihren Sportkurs, weil ..."),
    ).toBe("Sehr geehrte Damen und Herren,\n\nich interessiere mich für Ihren Sportkurs, weil ...");
  });

  test("preserves normal line breaks", () => {
    expect(normalizeWritingStarterText("Hallo Anna,\n\nwie geht es dir?"))
      .toBe("Hallo Anna,\n\nwie geht es dir?");
  });
});
