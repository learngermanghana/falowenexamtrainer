import { render, screen } from "@testing-library/react";
import WorkbookStartGuide from "./WorkbookStartGuide";

jest.mock("../data/courseSchedule", () => ({ courseSchedules: { B1: [] } }));

describe("WorkbookStartGuide video cards", () => {
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
});
