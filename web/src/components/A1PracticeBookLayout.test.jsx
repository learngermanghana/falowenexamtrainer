import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import fs from "fs";
import path from "path";
import A1PracticeBookLayout, { selectPracticeBookVideos } from "./A1PracticeBookLayout";
import { applyA1WorkbookSectionTabs } from "./A1WorkbookSectionTabs";

jest.mock("./A1WorkbookMediaPanel", () => ({
  getA1WorkbookMediaResources: () => [
    { kind: "teacher", key: "teacher-a1", url: "https://youtu.be/teacher01" },
    { kind: "ai", key: "ai-a1", url: "https://youtu.be/ai01" },
    { kind: "ai", key: "ai-duplicate", url: "https://www.youtube.com/watch?v=ai01" },
  ],
  getYouTubeVideoId: (url) => url.includes("watch?v=")
    ? url.split("watch?v=")[1] : url.split("/").pop(),
}));

jest.mock("./WorkbookDayMusic", () => ({
  __esModule: true,
  default: ({ day }) => <div data-testid="existing-day-music">Published music for Day {day}</div>,
  normalizeWorkbookSong: (track, level, day) =>
    track?.coursebook && track?.level === level && track?.day === day
      && track?.approved && track?.objectKey?.startsWith("music/a1/day-")
      ? track : null,
}));

const day13Song = {
  id: "a1-day-13-test", level: "A1", day: 13, approved: true, coursebook: true,
  objectKey: "music/a1/day-13/revision.mp3",
};
const response = (value) => ({ ok: true, json: async () => value });

describe("A1 independent practice book presentation", () => {
  const originalFetch = global.fetch;
  beforeAll(() => {
    global.fetch = jest.fn((url) => Promise.resolve(response(
      url.includes("catalog.json") ? { tracks: [day13Song] } : { ok: true, tracks: [] },
    )));
  });
  afterAll(() => { global.fetch = originalFetch; });

  test("keeps one AI resource, all original exercises and a separate Music tab", async () => {
    const { container } = render(
      <A1PracticeBookLayout day={13} chapter="3.5" title="Revision" overview="Review numbers and time.">
        <label>Original exercise <input aria-label="Original exercise" /></label>
      </A1PracticeBookLayout>
    );

    expect(container.querySelectorAll('[data-a1-practice-resources] a')).toHaveLength(2);
    expect(screen.getByText("Review numbers and time.")).toBeTruthy();
    await waitFor(() => expect(screen.getByRole("button", { name: /Music/ })).toBeTruthy());

    fireEvent.click(screen.getByRole("button", { name: "Workbook" }));
    const exercise = screen.getByRole("textbox", { name: "Original exercise" });
    fireEvent.change(exercise, { target: { value: "sechsundfünfzig" } });
    fireEvent.click(screen.getByRole("button", { name: "Overview" }));
    fireEvent.click(screen.getByRole("button", { name: "Workbook" }));
    expect(screen.getByRole("textbox", { name: "Original exercise" }).value).toBe("sechsundfünfzig");

    fireEvent.click(screen.getByRole("button", { name: /Music/ }));
    expect(screen.getByTestId("existing-day-music")).toHaveTextContent("Day 13");
    expect(container.querySelector('[data-a1-practice-panel="workbook"]')).toHaveAttribute("hidden");
    expect(container.querySelectorAll('[data-a1-practice-tabs]')).toHaveLength(1);
  });

  test("does not show a Music tab on a day without a published song", async () => {
    render(
      <A1PracticeBookLayout day={6} chapter="2.3" title="Family">
        <p>Unchanged family vocabulary and questions</p>
      </A1PracticeBookLayout>
    );
    await waitFor(() => expect(screen.queryByRole("button", { name: /Music/ })).toBeNull());
    fireEvent.click(screen.getByRole("button", { name: "Workbook" }));
    expect(screen.getByText("Unchanged family vocabulary and questions")).toBeTruthy();
  });

  test("does not allow the old Teil navigation to coexist with independent practice tabs", () => {
    const { container } = render(
      <A1PracticeBookLayout day={13} chapter="3.5" title="Revision">
        <p>All original practice exercises</p>
      </A1PracticeBookLayout>
    );
    const legacyNav = document.createElement("nav");
    legacyNav.setAttribute("data-a1-teil-navigation", "true");
    legacyNav.innerHTML = "<button>Overview</button><button>Teil 1</button>";
    container.appendChild(legacyNav);
    expect(applyA1WorkbookSectionTabs(document, {
      pathname: "/campus/course/a1-day-13-revision-numbers-time-and-prices-workbook",
      search: "?radio=done",
    })).toBe(false);
  });

  test("only independent A1 practice book routes are wrapped", () => {
    const app = fs.readFileSync(path.resolve(process.cwd(), "src/App.js"), "utf8");
    for (const day of [3, 5, 6, 13, 14]) {
      expect(app).toContain("withA1PracticeBook(" + day + ",");
    }
    expect(app).toContain('element={<A1Day12TwentyFourHourClockAndDatesWorkbookPage />}');
    expect(app).toContain('element={<A1Day3PronounsIntroducingYourselfWorkbookPage />}');
    expect(app).toContain('element={<A1Day17InstructionsDirectionsKapitel11WorkbookPage />}');
    const day3 = fs.readFileSync(path.resolve(process.cwd(), "src/components/A1Day3SchreibenSprechenKapitel11WorkbookPage.js"), "utf8");
    expect(day3).toContain("hidePracticeMedia = false");
    expect(day3).toContain("<A1Day3SchreibenSprechenKapitel11WorkbookPageLegacy />");
  });
});
