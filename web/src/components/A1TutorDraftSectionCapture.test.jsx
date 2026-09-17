import React from "react";
import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { getA1Assignment } from "../data/a1AssignmentRegistry";
import { getA1TutorDraftProfile } from "../data/a1TutorDraftProfiles";
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

  const firstChoice = screen.getByRole("radio", { name: "Question 1: Anzeige A" });
  fireEvent.click(firstChoice);

  expect(firstChoice).toBeChecked();
  expect(screen.getByText("1 of 5 answered")).toBeInTheDocument();
  expect(readA1WorkbookDraft("A1-14.1").sections["teil-1"].answers[1]).toBe("Anzeige A");
});

test("visible workbook options become the A1 draft controls instead of a duplicate answer block", async () => {
  const assignment = getA1Assignment("A1-10");
  const profile = getA1TutorDraftProfile("A1-10").sections["teil-2"];

  render(
    <A1TutorWorkbookDraftProvider assignment={assignment}>
      <section data-workbook-section="teil-2">
        {profile.items.map((item) => (
          <div key={item.number}>
            <strong>{item.number}. Listening question</strong>
            {item.choices.map((choice) => (
              <span key={choice}>{choice}) Option {choice}</span>
            ))}
          </div>
        ))}
        <A1TutorDraftSectionCapture sectionKey="teil-2" />
      </section>
    </A1TutorWorkbookDraftProvider>,
  );

  const firstQuestion = await screen.findByRole("radiogroup", { name: "Question 1" });
  const visibleChoice = within(firstQuestion).getByRole("radio", { name: "A) Option A" });
  expect(visibleChoice).toHaveAttribute("data-a1-clickable-answer", "true");
  await waitFor(() => {
    expect(screen.queryByText("Assignment draft · Not submitted")).not.toBeInTheDocument();
    expect(screen.getAllByRole("radio")).toHaveLength(15);
  });

  fireEvent.click(visibleChoice);

  await waitFor(() => {
    expect(readA1WorkbookDraft("A1-10").sections["teil-2"].answers[1]).toBe("A");
    expect(screen.getByText(/1 of 5 answered/)).toBeInTheDocument();
    const currentFirstQuestion = screen.getByRole("radiogroup", { name: "Question 1" });
    expect(within(currentFirstQuestion).getByRole("radio", { name: "A) Option A" }))
      .toHaveAttribute("aria-checked", "true");
  });
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
