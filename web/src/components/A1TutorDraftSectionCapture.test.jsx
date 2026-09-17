import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { getA1Assignment } from "../data/a1AssignmentRegistry";
import { readA1WorkbookDraft } from "../utils/a1WorkbookDraft";
import A1TutorDraftSectionCapture from "./A1TutorDraftSectionCapture";
import { A1TutorWorkbookDraftProvider } from "./A1TutorWorkbookDraftContext";

beforeEach(() => {
  window.localStorage.clear();
});

const renderSection = (assignmentKey, sectionKey) => {
  const assignment = getA1Assignment(assignmentKey);
  return render(
    <A1TutorWorkbookDraftProvider assignment={assignment}>
      <A1TutorDraftSectionCapture sectionKey={sectionKey} />
    </A1TutorWorkbookDraftProvider>,
  );
};

test("Health Teil 1 exposes clickable radio choices and stores the selected answer as a draft", () => {
  renderSection("A1-14.1", "teil-1");

  expect(screen.getByText("Assignment draft · Not submitted")).toBeInTheDocument();
  expect(screen.getByText("0 of 5 answered")).toBeInTheDocument();

  const firstChoice = screen.getByRole("radio", { name: "Anzeige A" });
  fireEvent.click(firstChoice);

  expect(firstChoice).toBeChecked();
  expect(screen.getByText("1 of 5 answered")).toBeInTheDocument();
  expect(readA1WorkbookDraft("A1-14.1").sections["teil-1"].answers[1]).toBe("Anzeige A");
});

test("Health Teil 3 adds ten short-answer fields and autosaves typed vocabulary", () => {
  renderSection("A1-14.1", "teil-3");

  const inputs = screen.getAllByPlaceholderText("Write the German word");
  expect(inputs).toHaveLength(10);
  fireEvent.change(inputs[0], { target: { value: "der Kopf" } });
  fireEvent.change(inputs[9], { target: { value: "der Bauch" } });

  expect(screen.getByText("2 of 10 answered")).toBeInTheDocument();
  const stored = readA1WorkbookDraft("A1-14.1");
  expect(stored.sections["teil-3"].answers[1]).toBe("der Kopf");
  expect(stored.sections["teil-3"].answers[10]).toBe("der Bauch");
});

test("ordinary writing sections remain clearly draft-only", () => {
  renderSection("A1-9", "teil-3");

  const textarea = screen.getByPlaceholderText("Schreiben Sie einen kurzen Text über Ihre Essgewohnheiten.");
  fireEvent.change(textarea, {
    target: { value: "Ich esse gern Reis. Ich esse kein Fleisch. Zum Frühstück esse ich Brot." },
  });

  expect(screen.getByText("Writing saved")).toBeInTheDocument();
  expect(screen.getByText(/Your tutor receives it only after you open/)).toBeInTheDocument();
  expect(readA1WorkbookDraft("A1-9").sections["teil-3"].text).toContain("Ich esse gern Reis");
});
