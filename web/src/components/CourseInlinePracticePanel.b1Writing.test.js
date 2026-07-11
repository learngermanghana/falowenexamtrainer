import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import CourseInlinePracticePanel from "./CourseInlinePracticePanel";

const renderB1WritingWorkspace = () =>
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

describe("B1 Teil 2 writing workspace", () => {
  test("shows a small English planning box before the main German draft", () => {
    renderB1WritingWorkspace();

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

  test("shows opinion, formal and informal templates in the cheat sheet", () => {
    renderB1WritingWorkspace();

    fireEvent.click(screen.getByRole("button", { name: "Cheat sheet" }));

    expect(screen.getByText("OPINION ESSAY / FORUM POST")).toBeInTheDocument();
    expect(screen.getByText("FORMAL LETTER")).toBeInTheDocument();
    expect(screen.getByText("INFORMAL LETTER")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Use Opinion template in Schreiben" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Use Formal template in Schreiben" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Use Informal template in Schreiben" }),
    ).toBeInTheDocument();
  });

  test("adds three quick-insert buttons below the main writing box", () => {
    renderB1WritingWorkspace();

    const draftBox = screen.getByRole("textbox", { name: "B1 writing draft" });
    const opinionButton = screen.getByRole("button", { name: "Insert Opinion template" });
    const formalButton = screen.getByRole("button", { name: "Insert Formal template" });
    const informalButton = screen.getByRole("button", { name: "Insert Informal template" });

    expect(
      draftBox.compareDocumentPosition(opinionButton) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();

    fireEvent.click(formalButton);
    expect(draftBox).toHaveValue(expect.stringContaining("Sehr geehrte Damen und Herren"));

    fireEvent.click(informalButton);
    expect(draftBox).toHaveValue(expect.stringContaining("Liebe/r [Name]"));
  });
});
