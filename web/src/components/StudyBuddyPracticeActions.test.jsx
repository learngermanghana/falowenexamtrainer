import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import StudyBuddyPracticeActions from "./StudyBuddyPracticeActions";
const exercise = [{ role: "user", content: "Quiz me" }, { role: "assistant", content: "Fill in: Ich habe ___ Auto." }];
test("buttons send contextual requests and disable during replies", () => {
  const onAction = jest.fn();
  const { rerender } = render(<StudyBuddyPracticeActions history={exercise} onAction={onAction} />);
  ["Try again", "Explain this", "Next question"].forEach(name => fireEvent.click(screen.getByRole("button", { name })));
  expect(onAction.mock.calls).toEqual([["Try again"], ["Explain this exercise"], ["Next practice question"]]);
  rerender(<StudyBuddyPracticeActions history={exercise} onAction={onAction} disabled />);
  fireEvent.click(screen.getByRole("button", { name: "Next question" }));
  expect(onAction).toHaveBeenCalledTimes(3);
});
test("controls appear after feedback and disappear for navigation", () => {
  const { rerender } = render(<StudyBuddyPracticeActions history={[...exercise, { role: "user", content: "kein" }, { role: "assistant", content: "Correct!" }]} />);
  expect(screen.getByRole("button", { name: "Next question" })).toBeTruthy();
  rerender(<StudyBuddyPracticeActions history={[...exercise, { role: "user", content: "Where are my results?" }, { role: "assistant", content: "Open Results." }]} />);
  expect(screen.queryByRole("button")).toBeNull();
});
