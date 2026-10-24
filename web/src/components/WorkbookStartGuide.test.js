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
