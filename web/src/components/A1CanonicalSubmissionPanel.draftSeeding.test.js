import fs from "fs";
import path from "path";

describe("A1CanonicalSubmissionPanel draft seeding", () => {
  test("does not reset the manual-edit guard when mapped workbook text changes", () => {
    const source = fs.readFileSync(
      path.join(__dirname, "A1CanonicalSubmissionPanel.jsx"),
      "utf8",
    );

    const seedEffectStart = source.indexOf(
      'if (requestedTab !== "submit" || !submissionContextReady || !mappedWorkbookText) return undefined;',
    );
    const inputHandlerStart = source.indexOf("const handleSubmissionInputCapture", seedEffectStart);
    const seedEffect = source.slice(seedEffectStart, inputHandlerStart);

    expect(seedEffectStart).toBeGreaterThan(-1);
    expect(inputHandlerStart).toBeGreaterThan(seedEffectStart);
    expect(seedEffect).toContain("if (workbookSeedUserEditedRef.current) return;");
    expect(seedEffect).not.toContain("workbookSeedUserEditedRef.current = false");
  });

  test("only clears the manual-edit guard after leaving Review & Submit", () => {
    const source = fs.readFileSync(
      path.join(__dirname, "A1CanonicalSubmissionPanel.jsx"),
      "utf8",
    );

    expect(source).toContain(
      'if (requestedTab !== "submit") workbookSeedUserEditedRef.current = false;',
    );
    expect(source).toContain("event.nativeEvent?.isTrusted");
  });
});
