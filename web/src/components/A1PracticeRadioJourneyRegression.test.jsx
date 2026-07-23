import React from "react";
import { render, screen } from "@testing-library/react";
import { getA1RadioResource } from "../data/a1RadioResources";
import SelfLearningJourneyGate from "./selfLearning/SelfLearningJourneyGate";
import { resolveA1RadioFirstWorkbookRoute } from "./A1RadioFirstWorkbookRoutes";

describe("A1 practice radio journey regressions", () => {
  afterEach(() => {
    window.history.replaceState({}, "", "/");
  });

  test("Day 3 Kapitel 1.2 direct self-practice workbook owns its requested Falowen Radio", () => {
    expect(
      resolveA1RadioFirstWorkbookRoute(
        "/campus/course/a1-day-3-kapitel-1-2-workbook",
      ),
    ).toEqual({ day: 3, chapter: "1.2" });

    expect(getA1RadioResource(3, "1.2")).toEqual(
      expect.objectContaining({
        key: "a1-day3-chapter-1-2-falowen-radio",
        chapter: "1.2",
        youtubeId: "XrSTHS60LI4",
      }),
    );
  });

  test("Day 5 uses the requested XrSTHS60LI4 Falowen Radio episode", () => {
    expect(getA1RadioResource(5, "1.3")).toEqual(
      expect.objectContaining({
        key: "a1-day5-introducing-yourself-articles-falowen-radio",
        youtubeId: "XrSTHS60LI4",
      }),
    );
  });

  test("Day 3 Kapitel 1.2 assignment-style legacy route is not mistaken for the self-practice route", () => {
    expect(
      resolveA1RadioFirstWorkbookRoute(
        "/campus/course/lesson/A1/3",
        "?chapter=1.2&hub=1",
      ),
    ).toBeNull();
  });

  test("auto-mounted A1 journey can render materials outside the app Router after radio completion", () => {
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
        aiVideo={{ url: "https://youtu.be/test-a1-ai" }}
      >
        <div>Day 5 workbook content</div>
      </SelfLearningJourneyGate>,
    );

    expect(screen.getByRole("heading", { name: /choose your learning material/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /open self-learning workbook/i })).toBeInTheDocument();
  });
});
