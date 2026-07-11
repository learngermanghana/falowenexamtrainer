import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import CourseInlinePracticePanel from "./CourseInlinePracticePanel";

describe("B1 Teil 2 writing workspace", () => {
  test("shows a small English planning box before the main German draft", () => {
    render(
      <CourseInlinePracticePanel
        type="writing"
        title="Erleichtern Medien das Arbeiten im Homeoffice?"
        writingContext={{
          level: "B1",
          courseLevel: "B1",
          day: 15,
          workbookId: "B1Day15MedienHomeoffice",
          taskTitle: "Erleichtern Medien das Arbeiten im Homeoffice?",
          taskPoints: [
            "Nennen Sie Ihre Meinung.",
            "Begründen Sie Ihre Meinung.",
          ],
        }}
      />,
    );

    const pointsBox = screen.getByRole("textbox", { name: "B1 writing points" });
    const draftBox = screen.getByRole("textbox", { name: "B1 writing draft" });

    expect(pointsBox).toBeInTheDocument();
    expect(pointsBox).toHaveAttribute(
      "placeholder",
      expect.stringContaining("English is okay"),
    );
    expect(
      pointsBox.compareDocumentPosition(draftBox) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();

    fireEvent.change(pointsBox, {
      target: { value: "flexible hours; no commuting; less contact with colleagues" },
    });

    expect(pointsBox).toHaveValue(
      "flexible hours; no commuting; less contact with colleagues",
    );
  });
});
