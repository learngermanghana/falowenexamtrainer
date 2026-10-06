import fs from "fs";
import path from "path";
import { A1_GOETHE_WRITING_MOCK } from "./A1GoetheWritingMockPreview";

describe("A1 Goethe-style Schreiben mock preview", () => {
  test("keeps Teil 1 as a five-gap Goethe-style mixed form task", () => {
    const rows = A1_GOETHE_WRITING_MOCK.teil1.formRows;
    const gaps = rows.filter((field) => field.kind === "input" || field.kind === "choice");

    expect(gaps).toHaveLength(5);
    expect(gaps.map((field) => field.number)).toEqual([1, 2, 3, 4, 5]);
    expect(rows.map((field) => field.kind)).toEqual([
      "prefilled",
      "input",
      "input",
      "prefilled",
      "prefilled",
      "input",
      "prefilled",
      "prefilled",
      "prefilled",
      "choice",
      "prefilled",
      "input",
    ]);
  });

  test("uses clear labels and a real payment choice", () => {
    const rows = A1_GOETHE_WRITING_MOCK.teil1.formRows;
    const payment = rows.find((field) => field.number === 4);

    expect(rows.find((field) => field.number === 3)).toMatchObject({
      label: "Straße, Hausnummer",
      answer: "Gartenstraße 12",
    });
    expect(payment).toMatchObject({
      kind: "choice",
      label: "Zahlungsweise",
      answer: "bar",
    });
    expect(payment.options).toEqual([
      { value: "bar", label: "Bar" },
      { value: "kreditkarte", label: "Kreditkarte" },
    ]);
    expect(rows.find((field) => field.number === 5)).toMatchObject({
      label: "Reisetermin",
      answer: "Samstag, 24. Oktober",
    });
  });

  test("replaces the old single Teil 2 task with ten A1 letter samples", () => {
    expect(A1_GOETHE_WRITING_MOCK.teil2.samples).toHaveLength(10);
    A1_GOETHE_WRITING_MOCK.teil2.samples.forEach((sample) => {
      expect(sample.points).toHaveLength(3);
      expect(sample.situation).toBeTruthy();
      expect(sample.register).toBeTruthy();
    });
    expect(A1_GOETHE_WRITING_MOCK.teil2.samples[0]).toMatchObject({
      id: "hotel-berliner-hof",
      register: "Formal",
    });
    expect(A1_GOETHE_WRITING_MOCK.teil2.samples[9]).toMatchObject({
      id: "landlord-heating",
      register: "Formal",
    });
  });

  test("removes the old GenussZeit cooking-school sample", () => {
    expect(JSON.stringify(A1_GOETHE_WRITING_MOCK.teil2)).not.toMatch(/GenussZeit|Italienische Küche/);
  });

  test("requires greeting, closing, and name without making them extra content points", () => {
    expect(A1_GOETHE_WRITING_MOCK.teil2.reminder).toContain("Anrede");
    expect(A1_GOETHE_WRITING_MOCK.teil2.reminder).toContain("Gruß");
    expect(A1_GOETHE_WRITING_MOCK.teil2.reminder).toContain("Namen");
    expect(A1_GOETHE_WRITING_MOCK.teil2.reminder).toContain("keine zusätzlichen Inhaltspunkte");
  });

  test("stays hidden from the A1 Course Book", () => {
    const appSource = fs.readFileSync(path.resolve(__dirname, "../App.js"), "utf8");
    const courseBookSource = fs.readFileSync(path.resolve(__dirname, "../data/a1CourseBookCards.js"), "utf8");

    expect(appSource).toContain("/campus/course/a1-mock-schreiben-preview");
    expect(courseBookSource).not.toContain("a1-mock-schreiben-preview");
  });
});
