import React from "react";
import { render, screen } from "@testing-library/react";

jest.mock("../data/courseSchedule", () => ({
  courseSchedules: {},
}));

const workbookLink = "https://example.com/workbook.pdf";
const grammarbookLink = "https://example.com/grammar.pdf";
const youtubeLink = "https://youtu.be/example-video";

jest.mock("../data/courseSchedules", () => ({
  courseSchedulesByName: {
    "Z1 Test Class": {
      course: "Z1",
      className: "Z1 Test Class",
      days: [
        {
          dayNumber: 1,
          sessions: [
            {
              chapter: "1.1",
              type: "Lesen & Hören",
              note: "Bring workbook.",
              youtube_link: youtubeLink,
              grammarbook_link: grammarbookLink,
              workbook_link: workbookLink,
            },
            {
              chapter: "1.1",
              type: "Lesen & Hören",
              note: "Bring workbook.",
              youtube_link: youtubeLink,
              grammarbook_link: grammarbookLink,
              workbook_link: workbookLink,
            },
          ],
        },
      ],
    },
  },
}));

import CourseTab from "../components/CourseTab";

describe("CourseTab", () => {
  it("renders deduplicated resource links with direct in-app and external options", () => {
    render(<CourseTab defaultLevel="Z1" />);

    expect(
      screen.getByRole("link", {
        name: /Video ansehen/i,
      })
    ).toHaveAttribute("href", youtubeLink);

    expect(screen.getByRole("link", { name: "Grammarbook" })).toHaveAttribute(
      "href",
      `/campus/course/resource-viewer?label=${encodeURIComponent("Grammarbook")}&url=${encodeURIComponent(grammarbookLink)}`
    );

    expect(screen.getByRole("link", { name: "Workbook" })).toHaveAttribute(
      "href",
      `/campus/course/resource-viewer?label=${encodeURIComponent("Workbook")}&url=${encodeURIComponent(workbookLink)}`
    );

    const openExternalLinks = screen.getAllByRole("link", { name: /View externally/i });
    expect(openExternalLinks).toHaveLength(2);

    expect(openExternalLinks[0]).toHaveAttribute("href", grammarbookLink);
    expect(openExternalLinks[1]).toHaveAttribute("href", workbookLink);
  });
});
