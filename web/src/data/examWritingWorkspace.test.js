import { EXAM_WRITING_MODULES, getExamWritingModule, assessPracticeForm } from "./examWritingWorkspace";

describe("Schreiben per Goethe level", () => {
  test.each([
    ["A1", 2, 20, ["form", "email"]],
    ["A2", 2, 30, ["message", "email"]],
    ["B1", 3, 60, ["email", "argument", "email"]],
    ["B2", 2, 75, ["argument", "email"]],
    ["C1", 2, 75, ["argument", "email"]],
    ["C2", 2, 80, ["transformation", "argument"]],
  ])("%s has the expected module time, Teil count and editor formats", (level, count, minutes, formats) => {
    const module = getExamWritingModule(level);
    expect(module.minutes).toBe(minutes);
    expect(module.parts).toHaveLength(count);
    expect(module.parts.map((item) => item.id)).toEqual(
      Array.from({ length: count }, (_, index) => "teil" + (index + 1))
    );
    expect(module.parts.map((item) => item.format)).toEqual(formats);
    module.parts.forEach((part) => {
      expect(part.tasks.length).toBeGreaterThan(0);
      part.tasks.forEach((task) => {
        expect(task.title).toBeTruthy();
        expect(task.situation).toBeTruthy();
        expect(task.points.length).toBeGreaterThan(0);
      });
    });
  });

  test("A1 uses the five supplied forms, and reuses all ten established A1 letter prompts", () => {
    const a1 = EXAM_WRITING_MODULES.A1;
    const forms = a1.parts[0].tasks;
    expect(forms.map((task) => task.id)).toEqual([
      "a1-course-registration",
      "a1-hotel-registration",
      "a1-library-card",
      "a1-sports-club",
      "a1-repair-form",
    ]);
    expect(forms.map((task) => task.formFields.filter((field) => !field.fixed).length))
      .toEqual([5, 5, 4, 5, 5]);
    expect(a1.parts[1].tasks).toHaveLength(10);
    expect(a1.parts[1].tasks[0].situation).toContain("Berliner Hof");
    expect(a1.parts[1].tasks[9].situation).toContain("Herrn Schneider");
    expect(a1.parts[1].tasks.filter((task) => task.register === "informal")).toHaveLength(3);
  });

  test("assesses blank fields only, accepting answer variants while leaving fixed values untouched", () => {
    const forms = EXAM_WRITING_MODULES.A1.parts[0].tasks;
    expect(assessPracticeForm(forms[0], {
      wohnort: "Berlin", kurstyp: "Intensivkurs", beginn: "01.11.2026",
      zahlung: "Kreditkarte", personen: "eine Person",
    })).toMatchObject({ correct: 5, total: 5 });
    expect(assessPracticeForm(forms[1], {
      gaeste: "2", zimmer: "Doppelzimmer", fruehstueck: "mit Frühstück",
      abreise: "15.08.", zahlung: "Barzahlung",
    })).toMatchObject({ correct: 5, total: 5 });
    expect(assessPracticeForm(forms[2], {
      status: "Studentin", ort: "50667 Köln", telefon: "0176-5544332", karte: "Jahreskarte",
    })).toMatchObject({ correct: 4, total: 4 });
    expect(assessPracticeForm(forms[3], {
      geburt: "03.02.1990", kurs: "Tanzen", tag: "Donnerstag",
      dauer: "6 Monate", zahlung: "SEPA",
    })).toMatchObject({ correct: 5, total: 5 });
    expect(assessPracticeForm(forms[4], {
      email: "elena.rossi@email.com", geraet: "Waschmaschine / Bosch",
      modell: "Maxx 6", datum: "20.10.2026", tageszeit: "Nachmittag",
    })).toMatchObject({ correct: 5, total: 5 });
    expect(assessPracticeForm(forms[0], {})).toMatchObject({ correct: 0, total: 5 });
  });

  test("C2 uses separate transformation inputs and four topic choices", () => {
    const c2 = getExamWritingModule("C2");
    expect(c2.parts[0].tasks[0].transformations).toHaveLength(4);
    expect(c2.parts[1].tasks).toHaveLength(4);
  });
});
