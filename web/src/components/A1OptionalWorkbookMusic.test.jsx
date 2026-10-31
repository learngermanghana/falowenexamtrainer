import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import fs from "fs";
import path from "path";
import A1OptionalWorkbookMusic from "./A1OptionalWorkbookMusic";
import A1WorkbookMediaPanel from "./A1WorkbookMediaPanel";
import { normalizeWorkbookSong } from "./WorkbookDayMusic";

const day4 = {
  id: "a1-day-04-numbers", title: "Welche Nummer hast du?", level: "A1", day: 4,
  assignmentKey: "A1-2", coursebook: true, approved: true,
  objectKey: "music/a1/day-04/welche-nummer-hast-du.mp3",
  audioUrl: "https://www.falowen.app/api/music?track=a1-day-04-numbers",
};
const day22 = {
  id: "a1-day-22-health", title: "Mein Kopf tut weh", level: "A1", day: 22,
  assignmentKey: "A1-14.1", coursebook: true, approved: true,
  objectKey: "music/a1/day-22/mein-kopf-tut-weh.mp3",
  audioUrl: "https://www.falowen.app/api/music?track=a1-day-22-health",
};
const day18 = {
  id: "a2-day-18-bank", title: "Die Karte funktioniert nicht", level: "A2", day: 18,
  assignmentKey: "A2-7.18", coursebook: true, approved: true,
  objectKey: "music/a2/day-18/die-karte-funktioniert-nicht.mp3",
  audioUrl: "https://www.falowen.app/api/music?track=a2-day-18-bank",
};
const discovered = {
  id: "r2-a1-day-05-family-song", title: "Family Song", level: "A1", day: 5,
  coursebook: true, autoDiscovered: true,
  objectKey: "music/a1/day-05/family-song.mp3",
  audioUrl: "https://www.falowen.app/api/music?track=r2-a1-day-05-family-song",
};
const response = data => ({ ok: true, json: async () => data });
const stubFetch = ({ pinned = [day4, day22, day18], automatic = [discovered], lyrics = {} } = {}) => {
  global.fetch = jest.fn(url => Promise.resolve(
    response(url.includes("/catalog.json") ? { tracks: pinned }
      : url.includes("/api/music-library") ? { ok: true, tracks: automatic }
        : { lessons: lyrics }),
  ));
};
const openMusic = container => {
  const details = container.querySelector('[data-a1-optional-music="true"]');
  details.open = true;
  fireEvent(details, new Event("toggle", { bubbles: false }));
};

describe("A1 optional Music within tutor and self-learning materials", () => {
  const initialFetch = global.fetch;
  afterEach(() => { global.fetch = initialFetch; jest.restoreAllMocks(); });

  test("tutor-marked Day 4 loads only its published song and approved lyrics on expansion", async () => {
    stubFetch({ lyrics: { [day4.id]: {
      assignmentKey: "A1-2", lyrics: "[Verse 1]\nHallo! Guten Tag!",
    } } });
    const { container } = render(<A1OptionalWorkbookMusic day={4} mode="tutor" />);
    expect(screen.getByText(/Music · Optional listening · Day 4/)).toBeTruthy();
    expect(global.fetch).not.toHaveBeenCalled(); // no background music scan on closed cards
    openMusic(container);
    expect(screen.getByText(/skip this without affecting your submission/)).toBeTruthy();
    await waitFor(() => expect(screen.getByRole("heading", { name: "Welche Nummer hast du?" })).toBeTruthy());
    expect(screen.queryByRole("heading", { name: "Mein Kopf tut weh" })).toBeNull();
    expect(screen.queryByRole("heading", { name: "Die Karte funktioniert nicht" })).toBeNull();
    expect(container.querySelector('[data-music-audio]').getAttribute("src")).toBe(day4.audioUrl);
    expect(container.querySelector('[data-music-lyrics]')).toBeTruthy();
    expect(screen.getByText(/Hallo! Guten Tag!/)).toBeTruthy();
    expect(container.querySelector('[data-preserved-workbook-notes]')).toBeNull();
    expect(container.querySelector('[data-workbook-submission]')).toBeNull();
    expect(screen.queryByText(/Check answers/)).toBeNull();
  });

  test("self-learning music is never an assignment or required progression step", async () => {
    stubFetch();
    const { container } = render(<A1OptionalWorkbookMusic day={22} mode="self" />);
    openMusic(container);
    expect(screen.getByText(/not a self-learning requirement/)).toBeTruthy();
    await waitFor(() => expect(screen.getByRole("heading", { name: "Mein Kopf tut weh" })).toBeTruthy());
    expect(screen.getByText(/Self-learning exercises and Radio are separate from Music/)).toBeTruthy();
    expect(container.querySelector('[data-preserved-workbook-notes]')).toBeNull();
    expect(container.querySelector('[data-music-audio]').getAttribute("src")).toBe(day22.audioUrl);
  });

  test("newly uploaded Day 5 music appears, but unverified lyrics do not", async () => {
    stubFetch({ pinned: [], automatic: [discovered],
      lyrics: { [discovered.id]: { assignmentKey: "A1-2.3", lyrics: "DRAFT – not approved" } } });
    const { container } = render(<A1OptionalWorkbookMusic day={5} mode="self" />);
    openMusic(container);
    await waitFor(() => expect(screen.getByRole("heading", { name: "Family Song" })).toBeTruthy());
    expect(screen.getByText(/Reviewed lyrics have not been published/)).toBeTruthy();
    expect(container.textContent).not.toContain("DRAFT – not approved");
  });

  test("days without a song stay optional and do not show the main Music library", async () => {
    stubFetch({ automatic: [] });
    const { container } = render(<A1OptionalWorkbookMusic day={19} />);
    openMusic(container);
    await waitFor(() => expect(screen.getByText(/No song published for A1 Day 19 yet/)).toBeTruthy());
    expect(container.querySelector('[data-music-audio]')).toBeNull();
    expect(screen.queryByText(/Music for every lesson day/)).toBeNull();
  });

  test("A1 source integration preserves tutor timer/submission and Radio gate ownership", () => {
    const read = name => fs.readFileSync(path.resolve(__dirname, name), "utf8");
    const shell = read("A1TutorMarkedWorkbookShell.js");
    const media = read("A1WorkbookMediaPanel.jsx");
    const self = read("A1CoursePracticeAutoMount.js");
    expect(shell).toContain('<A1WorkbookMediaPanel day={assignment.day} chapter={assignment.chapter} includeMusic={false} />');
    expect(shell).toContain('music={<WorkbookDayMusic level="A1" day={assignment.day}');
    expect(shell).toContain('<A1TimedMockExam assignment={assignment}>');
    expect(shell).toContain('<A1CanonicalSubmissionPanel');
    expect(media).toContain('<A1OptionalWorkbookMusic day={day} mode={learningMode} />');
    expect(self).toContain('const radioCompleted = hasCompletedRadioFromSearch(location.search)');
    expect(self).toContain('&& (radioCompleted || !journeyResources?.radio)');
    expect(self).toContain('learningMode="self"');
    expect(self).toContain('data-a1-self-learning-workbook-media');
    expect(self).not.toContain('musicComplete');
  });

  test("tutor shell can suppress duplicate media music card without removing videos", () => {
    const { container } = render(<A1WorkbookMediaPanel day={5} chapter="2.2" includeMusic={false} />);
    expect(container.querySelector('[data-a1-optional-music="true"]')).toBeNull();
  });

  test("same A1 day only accepts approved music-prefix objects, never Hören audio", () => {
    expect(normalizeWorkbookSong(day4, "A1", 4)).not.toBeNull();
    expect(normalizeWorkbookSong(day4, "A1", 22)).toBeNull();
    expect(normalizeWorkbookSong(discovered, "A1", 5)).not.toBeNull();
    expect(normalizeWorkbookSong({ ...day4, approved: false }, "A1", 4)).toBeNull();
    expect(normalizeWorkbookSong({ ...day4, objectKey: "a1/day-04/hoeren.mp3" }, "A1", 4)).toBeNull();
    expect(normalizeWorkbookSong(day18, "A1", 18)).toBeNull();
  });

  test("A1 shared media component offers Music even when this day has no teacher video", () => {
    const { container } = render(<A1WorkbookMediaPanel day={5} chapter="2.2" />);
    expect(container.querySelector('[data-a1-optional-music="true"]')).toBeTruthy();
  });
});
