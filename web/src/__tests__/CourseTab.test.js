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
  it("renders deduplicated resource links with optional in-app viewer links", () => {
    render(<CourseTab defaultLevel="Z1" />);

    expect(
      screen.getByRole("link", {
        name: /Video ansehen/i,
      })
    ).toHaveAttribute("href", youtubeLink);

    const workbookLinks = screen.getAllByRole("link", {
      name: /Workbook/i,
    });

    expect(workbookLinks).toHaveLength(1);
    expect(workbookLinks[0]).toHaveAttribute("href", workbookLink);

    expect(screen.getByRole("link", { name: "Grammarbook" })).toHaveAttribute("href", grammarbookLink);

    const openInAppLinks = screen.getAllByRole("link", { name: /Open in app/i });
    expect(openInAppLinks).toHaveLength(2);

    expect(openInAppLinks[0]).toHaveAttribute(
      "href",
      `/campus/course/resource-viewer?label=${encodeURIComponent("Grammarbook")}&url=${encodeURIComponent(grammarbookLink)}`
    );

    expect(openInAppLinks[1]).toHaveAttribute(
      "href",
      `/campus/course/resource-viewer?label=${encodeURIComponent("Workbook")}&url=${encodeURIComponent(workbookLink)}`
    );
  });
});
