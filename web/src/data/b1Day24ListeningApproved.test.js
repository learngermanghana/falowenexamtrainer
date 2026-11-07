import approved from "./b1Day24ListeningApproved.json";
import manifest from "../../../functions/data/answerKeyManifest.json";
import { getB1ListeningTask } from "./b1ListeningTasks";

test("Day 24 displays all owner-approved listening questions and aligns the marking key", () => {
  const task = getB1ListeningTask(24);
  const reference = Object.values(manifest).find((row) => row.assignment_id === "B1-8.24");
  expect(task.submitRequired).toBe(true);
  expect(task.questions).toHaveLength(5);
  approved.questions.forEach((question, index) => {
    const options = question.options.map((text, optionIndex) => `${String.fromCharCode(65 + optionIndex)}) ${text}`);
    expect(task.questions[index]).toEqual({ stem: question.question, options });
    expect(reference.answers.teil4[`Answer${index + 1}`]).toBe(options[question.correctIndex]);
  });
  expect(Object.values(reference.answers.teil4).map((text) => text[0])).toEqual(["A", "B", "A", "C", "A"]);
});
