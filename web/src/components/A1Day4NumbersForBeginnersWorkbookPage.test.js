import fs from "fs";
import path from "path";
import { getA1Assignment } from "../data/a1AssignmentRegistry";
import {
  getA1TutorDraftProfile,
  getA1TutorDraftProgress,
  isA1TutorSpeakingAssessment,
  validateA1TutorDraftSubmissionSections,
} from "../data/a1TutorDraftProfiles";
import answerManifest from "../../../functions/data/answerKeyManifest.json";

const source = fs.readFileSync(path.resolve(__dirname, "A1Day4NumbersForBeginnersWorkbookPage.js"), "utf8");
const speakingSource = fs.readFileSync(path.resolve(__dirname, "A1TutorSpeakingCheckpoint.jsx"), "utf8");
const draftSource = fs.readFileSync(path.resolve(__dirname, "../utils/a1WorkbookDraft.js"), "utf8");

const completedSections = () => new Map([
  ["teil-1", ["1. 26", "2. Müllerstraße 87", "3. 0171 33 55 90", "4. 3", "5. 240"]],
  ["teil-2", ["1. zwölf", "2. sechzehn", "3. zweihunderteinundzwanzig", "4. dreitausendvierhundertfünfunddreißig", "5. siebzig"]],
  ["teil-3", [
    "A1_NUMBERS_PHONE_SPEAKING_V1",
    "Speaking task: phone number",
    "Score: 8.5/10",
    "Feedback: Clear pronunciation of the spoken digits.",
  ]],
]);

test("A1 Day 4 remains Chapter 2 and has exactly three aligned Teile", () => {
  expect(getA1Assignment("A1-2")).toEqual(expect.objectContaining({ day: 4, chapter: "2" }));
  expect(getA1Assignment("A1-2").sections.map(section => section.key))
    .toEqual(["teil-1", "teil-2", "teil-3"]);
  const profile = getA1TutorDraftProfile("A1-2");
  expect(profile.sections["teil-1"].items).toHaveLength(5);
  expect(profile.sections["teil-2"].items).toHaveLength(5);
  expect(profile.sections["teil-2"].items.every(item => item.type === "short")).toBe(true);
  expect(profile.sections["teil-3"].speaking).toBe(true);
});

test("Teil 1 uses a simple five-field copying task, not an overloaded birthdate exercise", () => {
  expect(source).toContain("Elena Popov");
  expect(source).toContain("Müllerstraße 87");
  expect(source).toContain("0171 33 55 90");
  expect(source).toContain("240 Euro");
  expect(source).toContain("Kursdauer");
  expect(source).not.toContain("14.05.1998");
  expect(source).not.toContain("1998");
  expect(source).toContain("data-a1-day4-teil1");
});

test("Teil 2 contains only the five requested numbers to write as words", () => {
  expect(source).toContain("const numberWords = [12, 16, 221, 3435, 70]");
  expect(source).toContain('data-a1-day4-teil2="number-writing"');
  expect(source).not.toContain("teil2Questions");
});

test("Teil 3 records a phone number without storing audio permanently", () => {
  expect(source).toContain('assignmentKey="A1-2" sectionKey="teil-3"');
  expect(speakingSource).toContain('assessmentMarker: "A1_NUMBERS_PHONE_SPEAKING_V1"');
  expect(speakingSource).toContain("recording remains");
  expect(speakingSource).toContain("Only score and feedback are stored; the audio is not permanently uploaded.");
  expect(speakingSource).toContain('audioBlob: blob');
});

test("completion requires all ten written answers and a valid short speaking assessment", () => {
  const complete = completedSections();
  expect(validateA1TutorDraftSubmissionSections({ assignmentKey:"A1-2", sections: complete }))
    .toEqual({ ok:true, message:"" });
  const sectionText = complete.get("teil-3").join("\n");
  expect(isA1TutorSpeakingAssessment("teil-3", "A1-2", sectionText)).toBe(true);

  const missingSpeaking = new Map(complete);
  missingSpeaking.delete("teil-3");
  expect(validateA1TutorDraftSubmissionSections({ assignmentKey:"A1-2", sections: missingSpeaking }).ok).toBe(false);

  const forged = new Map(complete);
  forged.set("teil-3", ["A1_NUMBERS_PHONE_SPEAKING_V1", "Speaking task: phone number", "Score: 20/10", "Feedback: fake"]);
  expect(validateA1TutorDraftSubmissionSections({ assignmentKey:"A1-2", sections: forged }).ok).toBe(false);

  const progress = getA1TutorDraftProgress({ assignmentKey:"A1-2", draft:{ sections:{
    "teil-1":{answers:{1:"26",2:"Müllerstraße 87",3:"0171 33 55 90",4:"3",5:"240"}},
    "teil-2":{answers:{1:"zwölf",2:"sechzehn",3:"zweihunderteinundzwanzig",4:"dreitausendvierhundertfünfunddreißig",5:"siebzig"}},
    "teil-3":{text:sectionText},
  } } });
  expect(progress).toEqual(expect.objectContaining({ complete:true, completed:11, total:11 }));
});

test("old Day 4 answers are invalidated after replacing both writing tasks", () => {
  expect(draftSource).toContain('revision: "a1-day4-number-form-words-speaking-v2"');
  const manifest = answerManifest["A1 Numbers and Addresses 2"];
  expect(manifest.assignment_id).toBe("A1-2");
  expect(manifest.expectedParts).toEqual(["teil1", "teil2", "teil3"]);
  expect(manifest.referenceAnswerParts).toEqual(["teil1", "teil2"]);
  expect(manifest.partGrading.teil3.gradingMode).toBe("tutor_verified_speaking");
  expect(manifest.answers["Teil 2"].Answer4).toBe("dreitausendvierhundertfünfunddreißig");
});
