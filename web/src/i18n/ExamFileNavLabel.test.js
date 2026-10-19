import en from "./locales/en/translation.json";
import de from "./locales/de/translation.json";
import fr from "./locales/fr/translation.json";

describe("student Exam File and Date navigation", () => {
  test.each([
    ["English", en, "Exam File and Date", "Open Exam File and Date"],
    ["German", de, "Prüfungsakte und Termine", "Prüfungsakte und Termine öffnen"],
    ["French", fr, "Dossier d’examen et dates", "Ouvrir le dossier d’examen et les dates"],
  ])("%s uses the same label in Campus and Exams Room", (_language, locale, label, action) => {
    expect(locale.appNav.sections.examFile).toBe(label);
    expect(locale.appNav.examTabs.file).toBe(label);
    expect(locale.examReadiness.openExamFile).toBe(action);
  });
});
