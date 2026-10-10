import "@testing-library/jest-dom";
import React from "react";
import { render, screen } from "@testing-library/react";
import fs from "fs";
import path from "path";
import NextLiveClassCard from "./NextLiveClassCard";

const calendarLink = "/campus/course/full-class-calendar/A2%20K%C3%B6ln%20Klasse?classId=a2-koln";
const session = {
  id: "a2-day-6",
  startsAt: "2026-11-09T18:00:00.000Z",
  endsAt: "2026-11-09T19:30:00.000Z",
  topic: "Lesson 6: Learning German",
  status: "scheduled",
  curriculumDay: 6,
  classId: "a2-koln",
  className: "A2 Köln Klasse",
};
const summary = {
  klass: { id: "a2-koln", name: "A2 Köln Klasse", levelId: "A2" },
  sessions: [session],
};

describe("signed-in Home Next Class schedule action", () => {
  test("offers both Open lesson and View full class schedule in the compact student card", () => {
    const { container } = render(
      <NextLiveClassCard
        summary={summary}
        session={session}
        now={new Date("2026-10-09T12:00:00.000Z")}
        zoom={{}}
        simple
        fullCalendarLink={calendarLink}
      />
    );
    expect(container.querySelector(".next-live-class-card--simple")).toBeInTheDocument();
    const actions = screen.getByLabelText("Class actions");
    expect(actions.querySelectorAll("a")).toHaveLength(2);
    expect(screen.getByRole("link", { name: /Open lesson/ })).toHaveAttribute(
      "href", expect.stringContaining("/campus/course/lesson/A2/")
    );
    expect(screen.getByRole("link", { name: /View full class schedule/ })).toHaveAttribute(
      "href", calendarLink
    );
    expect(screen.queryByText(/Join class · Link pending/)).not.toBeInTheDocument();
  });

  test("retains full timetable actions on the expanded calendar without breaking other uses", () => {
    render(
      <NextLiveClassCard
        summary={summary}
        session={session}
        now={new Date("2026-10-09T12:00:00.000Z")}
        fullCalendarLink={calendarLink}
      />
    );
    expect(screen.getByRole("link", { name: /View full timetable/ })).toHaveAttribute("href", calendarLink);
  });

  test("phone-sized styles stack two full-width touch targets and avoid a cramped two-column label", () => {
    const css = fs.readFileSync(path.join(__dirname, "NextLiveClassCard.css"), "utf8");
    expect(css).toContain(".next-live-class-card--home.next-live-class-card--simple .next-live-class-actions");
    expect(css).toMatch(/@media \(max-width: 640px\)[\s\S]*grid-template-columns: minmax\(0, 1fr\) !important/);
    expect(css).toContain("min-height: 48px !important");
    expect(css).toContain("overflow-wrap: anywhere");
  });

  test("the signed-in Home calendar carries the student's canonical class identity into the schedule", () => {
    const source = fs.readFileSync(path.join(__dirname, "ClassCalendarCardV2.js"), "utf8");
    expect(source).toContain('fullCalendarParams.set("classId", resolvedClassId)');
    expect(source).toContain("fullCalendarLink={fullCalendarLink}");
    expect(source).toContain("homepageCompact");
    expect(source).toContain("simple");
    expect(source).toContain("next-class-full-schedule-fallback");
    expect(source).toContain("homepageCompact && !nextSession");
    expect(source).toContain("View full class schedule");
  });
});
