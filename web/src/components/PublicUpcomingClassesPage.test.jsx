import "@testing-library/jest-dom";
import React from "react";
import { cleanup, render, screen, within } from "@testing-library/react";
import fs from "fs";
import path from "path";
import PublicUpcomingClassesPage from "./PublicUpcomingClassesPage";
import { loadPublicClasses } from "../services/publicClassCatalogService";

jest.mock("../services/publicClassCatalogService", () => ({
  loadPublicClasses: jest.fn(),
}));
jest.mock("../lib/pageMeta", () => ({
  updatePageMeta: jest.fn(),
}));

const liveClass = {
  id: "hamburg",
  slug: "a1-hamburg-klasse",
  title: "A1 Hamburg Klasse",
  level: "A1",
  startDate: "2026-11-02",
  availability: "scheduled",
  meetingDays: [
    { day: "Monday", startTime: "18:00", endTime: "19:00" },
    { day: "Wednesday", startTime: "18:00", endTime: "19:00" },
  ],
  scheduleUrl: "https://admin.falowen.app/course-schedule/public?level=A1&startDate=2026-11-02",
};

afterEach(() => {
  cleanup();
  jest.resetAllMocks();
});

describe("public full class schedule", () => {
  test("shows the weekly class calendar, published dates and a real full-calendar destination", async () => {
    loadPublicClasses.mockResolvedValue([liveClass, {
      id: "self",
      slug: "b2-self-learning",
      title: "B2 self-learning",
      level: "B2",
      availability: "always",
      meetingDays: [],
    }]);
    render(<PublicUpcomingClassesPage />);

    await screen.findByRole("heading", { name: "Weekly class calendar" });
    expect(screen.getByRole("heading", { name: "Full class schedule" })).toBeInTheDocument();
    const week = document.querySelector(".falowen-schedule-week");
    expect(week).toHaveAttribute("aria-label", "Weekly class calendar");
    expect(within(week).getByRole("heading", { name: "Monday" })).toBeInTheDocument();
    expect(within(week).getByRole("heading", { name: "Wednesday" })).toBeInTheDocument();
    expect(within(week).getAllByText("18:00–19:00")).toHaveLength(2);
    expect(screen.getByText("Starts 2 Nov 2026")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /View class details/ })).toHaveAttribute(
      "href", "/classes/?class=a1-hamburg-klasse&open=1"
    );
    expect(screen.getByRole("link", { name: /View detailed calendar/ })).toHaveAttribute(
      "href", liveClass.scheduleUrl
    );
    expect(within(week).queryByText(/B2 self-learning/)).not.toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Prefer learning at your own pace?" })).toBeInTheDocument();
  });

  test("does not invent dated sessions or expose untrusted schedule URLs", async () => {
    loadPublicClasses.mockResolvedValue([{
      ...liveClass, meetingDays: [], scheduleUrl: "javascript:alert(1)",
    }]);
    render(<PublicUpcomingClassesPage />);
    await screen.findByRole("heading", { name: "Weekly class calendar" });
    expect(screen.getByText("Meeting times to be announced")).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /View detailed calendar/ })).not.toBeInTheDocument();
  });

  test("shows a helpful empty state when no live classes are published", async () => {
    loadPublicClasses.mockResolvedValue([]);
    render(<PublicUpcomingClassesPage />);
    expect(await screen.findByText(/No live class meeting times are currently published/)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "View all available classes" })).toHaveAttribute("href", "/classes/");
  });

  test("has a responsive weekly grid and comfortable tap targets on phones", () => {
    const css = fs.readFileSync(path.resolve(__dirname, "./PublicUpcomingClassesPage.css"), "utf8");
    expect(css).toContain("@media (max-width: 700px)");
    expect(css).toContain("@media (max-width: 380px)");
    expect(css).toContain(".falowen-schedule-week");
    expect(css).toContain("grid-template-columns: minmax(0, 1fr)");
    expect(css).toContain("min-height: 48px");
  });
});
