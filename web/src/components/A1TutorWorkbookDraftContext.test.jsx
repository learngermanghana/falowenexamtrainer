import React from "react";
import { act, render, screen } from "@testing-library/react";
import { getA1Assignment } from "../data/a1AssignmentRegistry";
import { saveA1WorkbookDraft } from "../utils/a1WorkbookDraft";
import {
  A1TutorWorkbookDraftProvider,
  useA1TutorWorkbookDraft,
} from "./A1TutorWorkbookDraftContext";

const DraftProbe = () => {
  const draft = useA1TutorWorkbookDraft();
  return <pre data-testid="submission-text">{draft?.submissionText || ""}</pre>;
};

beforeEach(() => {
  window.localStorage.clear();
});

test("direct Teil edits saved outside the provider appear in Review & Submit immediately", async () => {
  render(
    <A1TutorWorkbookDraftProvider assignment={getA1Assignment("A1-3")}>
      <DraftProbe />
    </A1TutorWorkbookDraftProvider>,
  );

  expect(screen.getByTestId("submission-text")).toHaveTextContent("");

  await act(async () => {
    saveA1WorkbookDraft({
      assignmentKey: "A1-3",
      sections: {
        "teil-1": { answers: { 1: "Es" } },
      },
    });
    await Promise.resolve();
  });

  expect(screen.getByTestId("submission-text")).toHaveTextContent("TEIL 1");
  expect(screen.getByTestId("submission-text")).toHaveTextContent("1. Es");
});

test("draft updates for a different A1 assignment do not replace the current submit preview", async () => {
  render(
    <A1TutorWorkbookDraftProvider assignment={getA1Assignment("A1-3")}>
      <DraftProbe />
    </A1TutorWorkbookDraftProvider>,
  );

  await act(async () => {
    saveA1WorkbookDraft({
      assignmentKey: "A1-4",
      sections: {
        "teil-1": { answers: { 1: "Other assignment" } },
      },
    });
    await Promise.resolve();
  });

  expect(screen.getByTestId("submission-text")).toHaveTextContent("");
});
