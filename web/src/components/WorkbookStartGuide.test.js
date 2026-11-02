import { fireEvent, render, screen } from "@testing-library/react";
import WorkbookStartGuide from "./WorkbookStartGuide";

jest.mock("../data/courseSchedule", () => ({ courseSchedules: { A1: [], B1: [] } }));

describe("WorkbookStartGuide video cards", () => {
  test("does not repeat supporting materials inside an A1 workbook", () => {
    render(
      <WorkbookStartGuide
        level="A1"
        day={1}
        entry={{
          day: 1,
          chapter: "0.1",
          ai_grammar_video: "https://youtu.be/5WIMkENgdGE",
          video: "https://youtu.be/CqFbBQG9M3U",
        }}
      />
    );

    expect(screen.queryByRole("heading", { name: "Supporting materials" })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Watch AI video" })).not.toBeInTheDocument();
  });

  test("keeps supporting materials available in an A1 grammar book", () => {
    render(
      <WorkbookStartGuide
        level="A1"
        day={1}
        mode="grammar"
        entry={{
          day: 1,
          chapter: "0.1",
          ai_grammar_video: "https://youtu.be/5WIMkENgdGE",
          workbook_link: "/campus/course/a1-day-1-greetings-workbook",
        }}
      />
    );

    expect(screen.getByRole("heading", { name: "Supporting materials" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Open workbook" })).toHaveAttribute(
      "href",
      "/campus/course/a1-day-1-greetings-workbook"
    );
    expect(screen.getByRole("link", { name: /View complete A1 book/ })).toHaveAttribute(
      "href", "/books/deutsch-a1-course-workbook"
    );
    expect(screen.queryByRole("button", { name: "Download / Print PDF" })).not.toBeInTheDocument();
  });

  test("B1 workbook guide does not label an AI video as a teacher lecture", () => {
    render(
      <WorkbookStartGuide
        level="B1"
        day={1}
        entry={{
          day: 1,
          chapter: "1.1",
          ai_grammar_video: "https://youtu.be/_mmAtSzWbNo",
          video: "https://youtu.be/wMrdW2DhD5o",
        }}
      />
    );

    expect(screen.queryByRole("link", { name: "Watch teacher video" })).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Watch AI video" })).toHaveAttribute(
      "href",
      "https://youtu.be/_mmAtSzWbNo"
    );
  });


  test("A2 Supporting materials replaces the PDF download with its published course book", () => {
    const printSpy = jest.spyOn(window, "print").mockImplementation(() => {});
    render(<WorkbookStartGuide
      level="A2"
      day={14}
      entry={{
        day: 14,
        chapter: "5.14",
        grammarbook_link: "/campus/course/a2-day-14-beruf-und-karriere-grammar-notes",
      }}
    />);
    expect(screen.getByRole("heading", { name: "Supporting materials" })).toBeInTheDocument();
    expect(screen.getByText(/Complete A2 Course & Workbook · 328 pages/)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /View complete A2 book/ })).toHaveAttribute(
      "href", "/books/deutsch-a2-course-workbook"
    );
    expect(screen.queryByRole("button", { name: "Download / Print PDF" })).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Open grammar book" })).toHaveAttribute(
      "href", "/campus/course/a2-day-14-beruf-und-karriere-grammar-notes"
    );
    expect(printSpy).not.toHaveBeenCalled();
    printSpy.mockRestore();
  });

  test("B1 Supporting materials still offers its original workbook PDF download", () => {
    const printSpy = jest.spyOn(window, "print").mockImplementation(() => {});
    render(<WorkbookStartGuide level="B1" day={8} entry={{ day: 8, chapter: "3.8" }} />);
    expect(screen.queryByRole("link", { name: /View complete A2 book/ })).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Download / Print PDF" }));
    expect(printSpy).toHaveBeenCalledTimes(1);
    printSpy.mockRestore();
  });

  test.each(["B2", "C1"])("keeps the %s PDF action inside supporting materials", (level) => {
    const print = jest.spyOn(window, "print").mockImplementation(() => {});
    render(
      <WorkbookStartGuide
        level={level}
        day={12}
        entry={{ day: 12, chapter: "12.1" }}
      />
    );

    const supportingMaterials = screen.getByRole("heading", { name: "Supporting materials" })
      .closest("section");
    const download = screen.getByRole("button", { name: "Download / Print PDF" });

    expect(supportingMaterials).toContainElement(download);
    fireEvent.click(download);
    expect(print).toHaveBeenCalledTimes(1);
    print.mockRestore();
  });
});
