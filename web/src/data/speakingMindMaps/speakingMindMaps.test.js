import { validateSpeakingMindMapConfig, branchTypesByLevel } from ".";
import { a2SpeakingMindMaps } from "./a2";
import { b1SpeakingMindMapExample, b2SpeakingMindMapExample, c1SpeakingMindMapExample } from "./examples";

const requiredA2Days = Array.from({ length: 27 }, (_, index) => index + 2);

test("A2 registry contains every required speaking lesson exactly once", () => {
  const days = a2SpeakingMindMaps.map((entry) => entry.day);
  const lessonIds = a2SpeakingMindMaps.map((entry) => entry.lessonId);
  expect(days.sort((a, b) => a - b)).toEqual(requiredA2Days);
  expect(new Set(lessonIds).size).toBe(lessonIds.length);
  requiredA2Days.forEach((day) => {
    expect(a2SpeakingMindMaps.some((entry) => entry.day === day)).toBe(true);
  });
});

test("A2 registry entries have complete branches and no duplicate routes", () => {
  a2SpeakingMindMaps.forEach((entry) => {
    expect(validateSpeakingMindMapConfig(entry, { requiredLevel: "A2" })).toBe(true);
    expect(new Set(entry.branches.map((branch) => branch.id)).size).toBe(entry.branches.length);
    expect(new Set(entry.speakingRoute).size).toBe(entry.speakingRoute.length);
    const vocabularyLists = entry.branches.map((branch) => branch.keywords.join("|"));
    expect(new Set(vocabularyLists).size).toBe(vocabularyLists.length);
    entry.branches.forEach((branch) => {
      expect(branch.keywords.every((keyword) => keyword.trim().length > 0)).toBe(true);
      expect(branch.sentenceStarter.trim()).not.toBe("");
      expect(branch.modelSentence.trim()).not.toBe("");
    });
  });
});

test("level-specific branch types are documented for B1, B2 and C1", () => {
  expect(branchTypesByLevel.B1).toEqual(["opinion", "reason", "example", "advantage", "disadvantage", "conclusion"]);
  expect(branchTypesByLevel.B2).toEqual(["position", "argument", "evidence", "example", "consequence", "counterargument", "response"]);
  expect(branchTypesByLevel.C1).toEqual(["thesis", "context", "evidence", "evaluation", "objection", "qualification", "conclusion"]);
});

test.each([
  ["B1", b1SpeakingMindMapExample],
  ["B2", b2SpeakingMindMapExample],
  ["C1", c1SpeakingMindMapExample],
])("validates representative %s speaking mind map", (level, config) => {
  expect(validateSpeakingMindMapConfig(config, { requiredLevel: level })).toBe(true);
  expect(config.branches.map((branch) => branch.type)).toEqual(branchTypesByLevel[level]);
});

test("validation rejects duplicate branch IDs and empty keywords", () => {
  const invalid = {
    ...b1SpeakingMindMapExample,
    branches: [
      { ...b1SpeakingMindMapExample.branches[0], id: "duplicate" },
      { ...b1SpeakingMindMapExample.branches[1], id: "duplicate", keywords: [""] },
      ...b1SpeakingMindMapExample.branches.slice(2),
    ],
  };
  expect(validateSpeakingMindMapConfig(invalid, { requiredLevel: "B1" })).toBe(false);
});
