import fs from "fs";
import path from "path";
import { B2_LISTENING, B2_READING } from "../data/b2FinalMockData";

describe("B2 Final Mock Lesen", () => {
  const page = fs.readFileSync(path.resolve(__dirname, "./B2FinalMockExamPage.jsx"), "utf8");
  const app = fs.readFileSync(path.resolve(__dirname, "../App.js"), "utf8");

  test("uses the supplied Minimalismus forum and answer key", () => {
    expect(B2_READING.teil1.forumTitle).toBe("Minimalismus – Befreiung oder moderner Luxus?");
    expect(B2_READING.teil1.people.map((person) => person.id)).toEqual(["A", "B", "C", "D"]);
    expect(B2_READING.teil1.example).toMatchObject({ number: 0, answer: "A" });
    expect(B2_READING.teil1.questions.map((question) => question.answer)).toEqual([
      "B", "A", "C", "D", "D", "B", "C", "C", "B",
    ]);
  });

  test("keeps the Goethe-style 18-minute section and autosaves answers", () => {
    expect(page).toContain("teil1: 18 * 60");
    expect(page).toContain("window.localStorage.setItem");
    expect(page).toContain("Automatisch gespeichert");
    expect(page).toContain("Die Personen können mehrmals gewählt werden");
  });

  test("uses the supplied Repair-Cafe reconstruction and answer key", () => {
    expect(B2_READING.teil2.articleTitle).toBe("Die Renaissance der Reparaturkultur");
    expect(B2_READING.teil2.sentences.map((sentence) => sentence.id)).toEqual([
      "A", "B", "C", "D", "E", "F", "G", "H",
    ]);
    expect(B2_READING.teil2.answers).toEqual({
      10: "B",
      11: "C",
      12: "D",
      13: "F",
      14: "A",
      15: "H",
    });
  });

  test("renders Teil 2 as an inline-gap newspaper reconstruction with a sentence bank", () => {
    expect(page).toContain("teil2: 12 * 60");
    expect(page).toContain("b2-mock-article-grid");
    expect(page).toContain("b2-mock-inline-gap");
    expect(page).toContain("Sätze A bis H · Teil 2");
    expect(page).toContain("Zwei Sätze passen nicht.");
    expect(page).toContain("Automatisch gespeichert");
  });

  test("uses the supplied Vier-Tage-Woche article and answer key for Teil 3", () => {
    expect(B2_READING.teil3.articleTitle).toBe(
      "Arbeitswelt im Wandel: Die Vier-Tage-Woche auf dem Prüfstand",
    );
    expect(B2_READING.teil3.questions.map((question) => question.answer)).toEqual([
      "a", "b", "b", "b", "a", "c",
    ]);
    expect(B2_READING.teil3.questions.map((question) => question.number)).toEqual([
      16, 17, 18, 19, 20, 21,
    ]);
  });

  test("renders Teil 3 as a two-column newspaper article with a, b, c tasks", () => {
    expect(page).toContain("teil3: 12 * 60");
    expect(page).toContain("b2-mock-teil3-article");
    expect(page).toContain("b2-mock-teil3-columns");
    expect(page).toContain("Aufgaben 16 bis 21 · Teil 3");
    expect(page).toContain("Wählen Sie a, b oder c.");
    expect(page).toContain("Teil 2 abschließen · weiter zu Teil 3");
    expect(page).toContain("Teil 3 abschließen");
  });

  test("uses the supplied KI statements and answer key for Teil 4", () => {
    expect(B2_READING.teil4.topic).toBe("Künstliche Intelligenz (KI) in der Arbeitswelt");
    expect(B2_READING.teil4.statements.map((statement) => statement.id)).toEqual([
      "A", "B", "C", "D", "E", "F", "G", "H",
    ]);
    expect(B2_READING.teil4.questions.map((question) => question.number)).toEqual([
      22, 23, 24, 25, 26, 27,
    ]);
    expect(B2_READING.teil4.questions.map((question) => question.answer)).toEqual([
      "B", "G", "F", "D", "A", "C",
    ]);
  });

  test("renders Teil 4 as statement matching with its own timer and autosave", () => {
    expect(page).toContain("teil4: 12 * 60");
    expect(page).toContain("b2-mock-teil4-statements");
    expect(page).toContain("Stellungnahmen A bis H · Teil 4");
    expect(page).toContain("Aufgaben 22 bis 27 · Teil 4");
    expect(page).toContain("Teil 3 abschließen · weiter zu Teil 4");
    expect(page).toContain("Teil 4 abschließen");
    expect(page).toContain("teil4Answers");
    expect(page).toContain("teil4Completed");
  });

  test("migrates a previously completed Teil 3 preview forward to Teil 4", () => {
    expect(page).toContain("migratedFromTeil3Completion");
    expect(page).toContain('stage = migratedFromTeil3Completion ? "teil4"');
    expect(page).toContain("migratedFromLesenCompletion");
  });

  test("uses the supplied B2 Hören Teil 1 audio and answer key", () => {
    expect(B2_LISTENING.teil1.audioObjectKey).toBe("b2/mock-hoeren-1/teil-1.mp3");
    expect(B2_LISTENING.teil1.example.map((question) => question.answer)).toEqual(["b", "b"]);
    expect(
      B2_LISTENING.teil1.texts.flatMap((textBlock) =>
        textBlock.questions.map((question) => question.answer),
      ),
    ).toEqual(["b", "c", "b", "a", "b", "a", "b", "c", "b", "b"]);
  });

  test("adds Hören Teil 1 after Lesen Teil 4 with protected one-file playback and autosave", () => {
    expect(page).toContain('stage: "hoeren-teil1"');
    expect(page).toContain("fetchB2MockAudioPlaybackUrl");
    expect(page).toContain("B2MockAudioPlayer");
    expect(B2_LISTENING.teil1.audioNote).toContain("Einleitung, Beispiel, Lesepause und Text 1 bis Text 5");
    expect(page).toContain("hoeren1Answers");
    expect(page).toContain("hoeren1AudioStatus");
    expect(page).toContain("Hören Teil 1 abschließen");
  });

  test("migrates previously completed preview stages forward", () => {
    expect(page).toContain("migratedFromLesenCompletion");
    expect(page).toContain('? "hoeren-teil1"');
    expect(page).toContain("migratedFromHoeren1Completion");
    expect(page).toContain('? "hoeren-teil2"');
    expect(page).toContain("migratedFromHoeren2Completion");
    expect(page).toContain('? "hoeren-teil3"');
    expect(page).toContain("migratedFromHoeren3Completion");
    expect(page).toContain('? "hoeren-teil4"');
    expect(page).toContain("completed: Boolean(parsed.completed && parsed.hoeren4Completed)");
  });

  test("uses the supplied B2 Hören Teil 2 interview and answer key", () => {
    expect(B2_LISTENING.teil2.audioObjectKey).toBe("b2/mock-hoeren-1/teil-2.mp3");
    expect(B2_LISTENING.teil2.questions.map((question) => question.number)).toEqual([
      11, 12, 13, 14, 15, 16,
    ]);
    expect(B2_LISTENING.teil2.questions.map((question) => question.answer)).toEqual([
      "b", "c", "c", "a", "b", "a",
    ]);
  });

  test("recovers interrupted Hören playback after refresh", () => {
    expect(page).toContain("const restoreAudioStatus = (status) =>");
    expect(page).toContain('if (normalized === "ended") return "ended"');
    expect(page).toContain('return "not_started"');
    expect(page).toContain("hoeren1AudioStatus: restoreAudioStatus(parsed.hoeren1AudioStatus)");
    expect(page).toContain("hoeren2AudioStatus: restoreAudioStatus(parsed.hoeren2AudioStatus)");
    expect(page).toContain("hoeren3AudioStatus: restoreAudioStatus(parsed.hoeren3AudioStatus)");
    expect(page).toContain("hoeren4AudioStatus: restoreAudioStatus(parsed.hoeren4AudioStatus)");
  });

  test("continues Hören Teil 1 into Teil 2 and autosaves Teil 2 state", () => {
    expect(page).toContain('stage: "hoeren-teil2"');
    expect(page).toContain("hoeren2Answers");
    expect(page).toContain("hoeren2AudioStatus");
    expect(page).toContain("Hören Teil 1 abschließen · weiter zu Teil 2");
    expect(page).toContain("Aufgaben 11 bis 16 · Hören Teil 2");
    expect(page).toContain("Hören Teil 2 abschließen");
  });

  test("uses the supplied B2 Hören Teil 3 speaker matching and answer key", () => {
    expect(B2_LISTENING.teil3.audioObjectKey).toBe("b2/mock-hoeren-1/teil-3.mp3");
    expect(B2_LISTENING.teil3.speakers).toEqual([
      { id: "a", label: "Frau Lenz" },
      { id: "b", label: "Herr Albers" },
      { id: "c", label: "Herr Demir" },
    ]);
    expect(B2_LISTENING.teil3.example).toEqual({
      statement: "Wir teilen uns Werkzeug, Garten und ein Auto.",
      answer: "a",
    });
    expect(B2_LISTENING.teil3.questions.map((question) => question.number)).toEqual([
      17, 18, 19, 20, 21, 22,
    ]);
    expect(B2_LISTENING.teil3.questions.map((question) => question.answer)).toEqual([
      "b", "c", "a", "b", "c", "a",
    ]);
  });

  test("continues Hören Teil 2 into Teil 3 and autosaves Teil 3 state", () => {
    expect(page).toContain('stage: "hoeren-teil3"');
    expect(page).toContain("hoeren3Answers");
    expect(page).toContain("hoeren3AudioStatus");
    expect(page).toContain("Hören Teil 2 abschließen · weiter zu Teil 3");
    expect(page).toContain("Aufgaben 17 bis 22 · Hören Teil 3");
    expect(page).toContain("Wer sagt das?");
    expect(page).toContain("Hören Teil 3 abschließen");
  });

  test("uses the supplied B2 Hören Teil 4 productivity talk and answer key", () => {
    expect(B2_LISTENING.teil4.audioObjectKey).toBe("b2/mock-hoeren-1/teil-4.mp3");
    expect(B2_LISTENING.teil4.questions.map((question) => question.number)).toEqual([
      23, 24, 25, 26, 27, 28, 29, 30,
    ]);
    expect(B2_LISTENING.teil4.questions.map((question) => question.answer)).toEqual([
      "b", "a", "c", "b", "b", "c", "a", "c",
    ]);
  });

  test("continues Hören Teil 3 into Teil 4 and completes the listening module", () => {
    expect(page).toContain('stage: "hoeren-teil4"');
    expect(page).toContain("hoeren4Answers");
    expect(page).toContain("hoeren4AudioStatus");
    expect(page).toContain("Hören Teil 3 abschließen · weiter zu Teil 4");
    expect(page).toContain("Aufgaben 23 bis 30 · Hören Teil 4");
    expect(page).toContain("Hören abschließen");
    expect(page).toContain("Lesen Teil 1–4 und Hören Teil 1–4 gespeichert");
  });

  test("publishes only a preview route while the B2 mock is still being built", () => {
    expect(app).toContain('path="/campus/course/b2-mock-practice-preview" element={<B2FinalMockExamPage />}');
  });
});
