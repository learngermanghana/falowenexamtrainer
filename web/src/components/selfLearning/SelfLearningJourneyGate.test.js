import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import SelfLearningJourneyGate, {
  buildCompletedMaterialsSearch,
  hasCompletedSelfLearningMaterials,
} from "./SelfLearningJourneyGate";

const renderJourney = ({ entry = "/campus/course/lesson/B2/1", radio = null } = {}) =>
  render(
    <MemoryRouter initialEntries={[entry]}>
      <SelfLearningJourneyGate
        level="B2"
        day={1}
        title="Test self-learning lesson"
        radio={radio}
        teacherVideo={{ url: "https://youtu.be/teacher" }}
        aiVideo={{ url: "https://youtu.be/ai" }}
        grammarBook={{ url: "/campus/course/test-grammar" }}
      >
        <div>Self-learning content is open</div>
      </SelfLearningJourneyGate>
    </MemoryRouter>,
  );

describe("SelfLearningJourneyGate", () => {
  test("uses Falowen Radio as the only gate before self-learning content", () => {
    renderJourney({
      radio: {
        key: "test-radio",
        title: "Test Falowen Radio",
        youtubeId: "testVideoId",
        instruction: "Listen first.",
      },
    });

    expect(screen.getByRole("heading", { name: /Falowen Radio/i })).toBeInTheDocument();
    expect(screen.queryByText("Self-learning content is open")).not.toBeInTheDocument();
    expect(screen.queryByText(/choose your learning material/i)).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /watch teacher video/i })).not.toBeInTheDocument();
  });

  test("opens the self-learning content immediately when Radio is already complete", () => {
    renderJourney({
      entry: "/campus/course/lesson/B2/1?radio=done",
      radio: {
        key: "test-radio",
        title: "Test Falowen Radio",
        youtubeId: "testVideoId",
      },
    });

    expect(screen.getByText("Self-learning content is open")).toBeInTheDocument();
    expect(screen.queryByText(/choose your learning material/i)).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /open self-learning workbook/i })).not.toBeInTheDocument();
  });

  test("lessons without Radio open the self-learning content directly", () => {
    renderJourney();

    expect(screen.getByText("Self-learning content is open")).toBeInTheDocument();
    expect(screen.queryByText(/choose your learning material/i)).not.toBeInTheDocument();
  });

  test("opens A1 workbook content directly after Radio when auto-mounted outside the parent Router", () => {
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
          youtubeId: "4yGJ9-Fz19A",
        }}
      >
        <div>Day 5 workbook content</div>
      </SelfLearningJourneyGate>,
    );

    expect(screen.getByText("Day 5 workbook content")).toBeInTheDocument();
    expect(screen.queryByText(/choose your learning material/i)).not.toBeInTheDocument();

    window.history.replaceState({}, "", "/");
  });

  test("keeps legacy materials query helpers compatible with old bookmarked URLs", () => {
    expect(buildCompletedMaterialsSearch("?radio=done&chapter=3.1")).toBe("?radio=done&chapter=3.1&materials=done");
    expect(hasCompletedSelfLearningMaterials("?radio=done&materials=done")).toBe(true);
  });
});
