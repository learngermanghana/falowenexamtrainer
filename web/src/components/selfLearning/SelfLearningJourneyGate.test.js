import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import SelfLearningJourneyGate, {
  buildCompletedMaterialsSearch,
  hasCompletedSelfLearningMaterials,
} from "./SelfLearningJourneyGate";

const renderJourney = ({ entry = "/campus/course/lesson/B2/1", radio = null, teacherVideo = null, aiVideo = null, grammarBook = null } = {}) =>
  render(
    <MemoryRouter initialEntries={[entry]}>
      <SelfLearningJourneyGate
        level="B2"
        day={1}
        title="Test self-learning lesson"
        radio={radio}
        teacherVideo={teacherVideo}
        aiVideo={aiVideo}
        grammarBook={grammarBook}
      >
        <div>Self-learning content is open</div>
      </SelfLearningJourneyGate>
    </MemoryRouter>,
  );

describe("SelfLearningJourneyGate", () => {
  test("uses radio first and does not expose the material selector before radio completion", () => {
    renderJourney({
      radio: {
        key: "test-radio",
        title: "Test Falowen Radio",
        youtubeId: "testVideoId",
        instruction: "Listen first.",
      },
      aiVideo: { url: "https://youtu.be/ai-video" },
    });

    expect(screen.getByRole("heading", { name: "🎙️ Falowen Radio" })).toBeInTheDocument();
    expect(screen.queryByText(/choose your learning material/i)).not.toBeInTheDocument();
  });

  test("shows teacher, AI, grammar and workbook choices after radio completion", () => {
    renderJourney({
      entry: "/campus/course/lesson/B2/1?radio=done",
      radio: {
        key: "test-radio",
        title: "Test Falowen Radio",
        youtubeId: "testVideoId",
      },
      teacherVideo: { url: "https://youtu.be/teacher", description: "Teacher explanation" },
      aiVideo: { url: "https://youtu.be/ai", description: "AI explanation" },
      grammarBook: { url: "/campus/course/test-grammar" },
    });

    expect(screen.getByText(/choose your learning material/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /watch teacher video/i })).toHaveAttribute("href", "https://youtu.be/teacher");
    expect(screen.getByRole("link", { name: /watch ai video/i })).toHaveAttribute("href", "https://youtu.be/ai");
    expect(screen.getByRole("link", { name: /open grammar book/i })).toHaveAttribute("href", "/campus/course/test-grammar");
    expect(screen.getByRole("button", { name: /open self-learning workbook/i })).toBeInTheDocument();
    expect(screen.getByText(/not submitted for tutor marking/i)).toBeInTheDocument();
  });

  test("does not create an empty teacher card when no teacher lecture is configured", () => {
    renderJourney({ aiVideo: { url: "https://youtu.be/ai" } });

    expect(screen.queryByRole("link", { name: /watch teacher video/i })).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: /watch ai video/i })).toBeInTheDocument();
  });

  test("opens the self-learning content from the workbook choice", () => {
    renderJourney({ aiVideo: { url: "https://youtu.be/ai" } });

    fireEvent.click(screen.getByRole("button", { name: /open self-learning workbook/i }));

    expect(screen.getByText("Self-learning content is open")).toBeInTheDocument();
  });

  test("renders the A1 materials step when auto-mounted outside the parent Router", () => {
    window.history.replaceState(
      {},
      "",
      "/campus/course/a1-day-5-introducing-yourself-and-articles-workbook?radio=done",
    );

    render(
      <SelfLearningJourneyGate
        level="A1"
        day={5}
        title="Introducing Yourself and Articles · Kapitel 1.3"
        radio={{
          key: "a1-day5-introducing-yourself-articles-falowen-radio",
          title: "Introducing Yourself and Articles · Kapitel 1.3",
          youtubeId: "XrSTHS60LI4",
        }}
        aiVideo={{ url: "https://youtu.be/a1-test-video" }}
      >
        <div>Day 5 workbook content</div>
      </SelfLearningJourneyGate>,
    );

    expect(screen.getByText(/choose your learning material/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /open self-learning workbook/i })).toBeInTheDocument();

    window.history.replaceState({}, "", "/");
  });

  test("preserves existing query parameters when materials are completed", () => {
    expect(buildCompletedMaterialsSearch("?radio=done&chapter=3.1")).toBe("?radio=done&chapter=3.1&materials=done");
    expect(hasCompletedSelfLearningMaterials("?radio=done&materials=done")).toBe(true);
  });
});