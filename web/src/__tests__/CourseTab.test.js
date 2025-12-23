import React from "react";
import { render, screen } from "@testing-library/react";

const workbookLink = "https://example.com/workbook.pdf";
const youtubeLink = "https://youtu.be/example-video";

jest.mock("../data/courseSchedule", () => ({
  courseSchedules: {
    Z1: [
      {
        day: 1,
        topic: "Dictionary Topic",
        chapter: "1.1",
        instruction: "Dictionary instruction",
        lesen_hören: {
          chapter: "1.1",
          youtube_link: "https://youtu.be/dictionary-video",
          workbook_link: "https://example.com/dictionary-workbook.pdf",
          assignment: true,
        },
      },
    ],
  },
}));

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
            },
          ],
        },
      ],
    },
    "Z2 Derived Class": {
      course: "Z2",
      className: "Z2 Derived Class",
      days: [
        {
          dayNumber: 1,
          sessions: [
            {
              chapter: "2.1",
              type: "Lesen & Hören",
              youtube_link: youtubeLink,
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
  it("enriches class days with course dictionary content", () => {
    render(<CourseTab defaultLevel="Z1" defaultClassName="Z1 Test Class" />);

    expect(
      screen.getByRole("link", {
        name: /Video ansehen/i,
      })
    ).toHaveAttribute("href", "https://youtu.be/dictionary-video");

    expect(
      screen.getByRole("link", {
        name: /Workbook/i,
      })
    ).toHaveAttribute("href", "https://example.com/dictionary-workbook.pdf");

    expect(screen.getByText(/Dictionary instruction/i)).toBeInTheDocument();
  });

  it("falls back to class resources when the dictionary does not cover the level", () => {
    render(<CourseTab defaultLevel="Z2" defaultClassName="Z2 Derived Class" />);

    expect(
      screen.getByRole("link", {
        name: /Video ansehen/i,
      })
    ).toHaveAttribute("href", youtubeLink);

    expect(
      screen.getByRole("link", {
        name: /Workbook/i,
      })
    ).toHaveAttribute("href", workbookLink);
  });
});

