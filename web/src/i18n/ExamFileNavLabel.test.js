import en from "./locales/en/translation.json";
import de from "./locales/de/translation.json";
import fr from "./locales/fr/translation.json";

describe("Campus vocabulary and Exams Room file navigation", () => {
  test.each([
    ["English", en, "Vocab", "Exam File and Date", "Open Exam File and Date"],
    ["German", de, "Vokabeln", "Prüfungsakte und Termine", "Prüfungsakte und Termine öffnen"],
    ["French", fr, "Vocabulaire", "Dossier d’examen et dates", "Ouvrir le dossier d’examen et les dates"],
  ])("%s keeps vocabulary in Campus and the exam file in Exams Room", (_language, locale, vocabLabel, label, action) => {
    expect(locale.appNav.sections.vocab).toBe(vocabLabel);
    expect(locale.appNav.sections.examFile).toBe(label);
    expect(locale.appNav.examTabs.file).toBe(label);
    expect(locale.examReadiness.openExamFile).toBe(action);
  });
});
