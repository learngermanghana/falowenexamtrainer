import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import PublishedHoerenPractice from "./PublishedHoerenPractice";
import { getPublishedHoerenLesson } from "../services/publishedHoerenService";

jest.mock("../context/AuthContext", () => ({
  useAuth: () => ({ idToken: "test-token" }),
}));
jest.mock("../services/publishedHoerenService", () => ({
  getPublishedHoerenLesson: jest.fn(),
  gradePublishedHoerenLesson: jest.fn(),
}));

const signed = (minutes) => {
  const issue = new Date(Date.UTC(2026, 9, 18, 12, minutes, 0));
  return `https://r2.example/a1/studio/test.mp3?X-Amz-Date=${issue.toISOString().replace(/[:-]|\.\d{3}/g, "")}&X-Amz-Expires=900&X-Amz-Signature=abc`;
};
const baseLesson = {
  assignmentKey: "A1-12.1",
  title: "Eine Fahrkarte kaufen",
  level: "A1", day: 18, kind: "richtig-falsch", revision: "rev-1",
  questions: Array.from({ length: 5 }, (_, index) => ({ id: index + 1, question: "Aussage " + index + " stimmt?" })),
};

beforeEach(() => {
  jest.spyOn(Date, "now").mockReturnValue(Date.UTC(2026, 9, 18, 12, 20, 0));
  getPublishedHoerenLesson.mockReset();
});
afterEach(() => { jest.restoreAllMocks(); });

test("an expired signed MP3 refreshes after playback error without resetting questions", async () => {
  const expired = signed(0);
  const fresh = signed(20);
  getPublishedHoerenLesson
    .mockResolvedValueOnce({ ...baseLesson, audioUrl: expired })
    .mockResolvedValueOnce({ ...baseLesson, audioUrl: fresh });
  const { container } = render(<PublishedHoerenPractice assignmentKey="A1-12.1" />);
  await waitFor(() => expect(container.querySelector("audio")).toBeTruthy());
  expect(container.querySelector("audio").getAttribute("src")).toBe(expired);
  fireEvent.error(container.querySelector("audio"));
  await waitFor(() => expect(container.querySelector("audio").getAttribute("src")).toBe(fresh));
  expect(getPublishedHoerenLesson).toHaveBeenCalledTimes(2);
  expect(screen.getByText("Aussage 0 stimmt?")).toBeTruthy();
});

test("audio retry is available when signed URL renewal cannot reach the server", async () => {
  getPublishedHoerenLesson
    .mockResolvedValueOnce({ ...baseLesson, audioUrl: signed(0) })
    .mockRejectedValueOnce(new Error("offline"))
    .mockResolvedValueOnce({ ...baseLesson, audioUrl: signed(20) });
  const { container } = render(<PublishedHoerenPractice assignmentKey="A1-12.1" />);
  await waitFor(() => expect(container.querySelector("audio")).toBeTruthy());
  fireEvent.error(container.querySelector("audio"));
  await waitFor(() => expect(screen.getByText("Audio erneut laden")).toBeTruthy());
  fireEvent.click(screen.getByText("Audio erneut laden"));
  await waitFor(() => expect(container.querySelector("audio").getAttribute("src")).toBe(signed(20)));
});
