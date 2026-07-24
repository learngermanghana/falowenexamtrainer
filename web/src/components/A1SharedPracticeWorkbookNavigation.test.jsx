import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, useLocation } from "react-router-dom";
import A1SharedPracticeWorkbookNavigation, {
  A1_SHARED_PRACTICE_LESSONS,
  resolveA1SharedPracticeLesson,
} from "./A1SharedPracticeWorkbookNavigation";

const expectedPractices = [
  [3, "1.1", "/campus/course/a1-day-3-schreiben-sprechen-kapitel-1-1-workbook"],
  [3, "1.2", "/campus/course/a1-day-3-kapitel-1-2-workbook"],
  [5, "1.3", "/campus/course/a1-day-5-introducing-yourself-and-articles-workbook"],
  [6, "2.3", "/campus/course/a1-day-6-family-and-hobbies-workbook"],
  [13, "3.5", "/campus/course/a1-day-13-revision-numbers-time-and-prices-workbook"],
  [14, "3.6", "/campus/course/modal-verbs-day-14-3-6"],
  [15, "4.7", "/campus/course/speaking-exams-intro-4-7"],
  [19, "5.9", "/campus/course/verboten-erlaubt-5-9"],
  [23, "14.2", "/campus/course/dative-and-accusative-verbs-14-2"],
  [24, "5.10", "/campus/course/conjunctions-5-10"],
];

const FakePracticeWorkbook = ({ remountOnSearch = false }) => {
  const location = useLocation();
  return (
    <main className="layout-main">
      <div data-testid="practice-page" key={remountOnSearch ? location.search : "stable"}>
        <header><h1>A1 Day 5 self-practice</h1></header>
        <section data-testid="practice-section-1"><h2>Teil 1 · Articles</h2><p>Articles practice</p></section>
        <section data-testid="practice-section-2"><h2>Teil 2 · Adjectives</h2><p>Adjectives practice</p></section>
        <section data-testid="practice-section-3"><h2>Teil 3 · Personal Information</h2><p>Introduction practice</p></section>
      </div>
    </main>
  );
};


const FakeDivCardPracticeWorkbook = () => (
  <main className="layout-main">
    <div data-testid="practice-page">
      <div><h1>A1 Day 6 self-practice</h1></div>
      <div data-testid="practice-section-1"><h2>Teil 1 · Family Vocabulary</h2><p>Family content only</p></div>
      <div data-testid="practice-section-2"><h2>Teil 2 · Writing About Your Family</h2><p>Writing content only</p></div>
      <div data-testid="practice-section-3"><h2>Teil 3 · Languages</h2><p>Language content only</p></div>
    </div>
  </main>
);

const LocationProbe = () => {
  const location = useLocation();
  return <output data-testid="practice-location">{location.search}</output>;
};

describe("A1 shared self-practice navigation", () => {
  beforeEach(() => {
    window.scrollTo = jest.fn();
    window.requestAnimationFrame = (callback) => window.setTimeout(callback, 0);
    window.cancelAnimationFrame = (id) => window.clearTimeout(id);
  });

  test("keeps exactly the requested ten self-practice identities separate from tutor assignments", () => {
    expect(A1_SHARED_PRACTICE_LESSONS).toHaveLength(10);
    expectedPractices.forEach(([day, chapter, pathname]) => {
      const practice = resolveA1SharedPracticeLesson({ pathname });
      expect(practice).toEqual(expect.objectContaining({ day, chapter, kind: "practice", assignmentKey: null }));
    });
  });


  test("resolves the shared Day 6-style section navigation for every A1 self-practice workbook", () => {
    expectedPractices.forEach(([day, chapter, pathname]) => {
      expect(resolveA1SharedPracticeLesson({ pathname })).toEqual(
        expect.objectContaining({ day, chapter, kind: "practice", assignmentKey: null }),
      );
    });
  });

  test("uses one tab row, opens Teil 1 immediately, and switches visible workbook content", async () => {
    render(
      <MemoryRouter
        initialEntries={[
          "/campus/course/a1-day-5-introducing-yourself-and-articles-workbook?radio=done&materials=done&workbookTab=overview",
        ]}
      >
        <FakePracticeWorkbook />
        <A1SharedPracticeWorkbookNavigation />
        <LocationProbe />
      </MemoryRouter>,
    );

    const navigation = await screen.findByRole("region", { name: "A1 self-practice workbook navigation" });
    expect(navigation).toBeVisible();
    expect(screen.queryByRole("tab", { name: "Overview" })).not.toBeInTheDocument();
    expect(screen.queryByText("Choose a section")).not.toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Teil 1" })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByRole("tab", { name: "Teil 2" })).toBeVisible();
    expect(screen.getByRole("tab", { name: "Teil 3" })).toBeVisible();
    expect(screen.queryByRole("tab", { name: "Submit" })).not.toBeInTheDocument();
    expect(screen.getByText(/Nothing on this page is sent for tutor marking/i)).toBeVisible();

    await waitFor(() => expect(screen.getByTestId("practice-section-1")).toBeVisible());
    expect(screen.getByTestId("practice-section-2")).not.toBeVisible();

    fireEvent.click(screen.getByRole("tab", { name: "Teil 2" }));
    await waitFor(() => expect(screen.getByTestId("practice-section-2")).toBeVisible());
    expect(screen.getByTestId("practice-section-1")).not.toBeVisible();

    const search = screen.getByTestId("practice-location").textContent;
    expect(search).toContain("workbookTab=section-2");
    expect(search).not.toContain("assignmentKey");
    expect(search).not.toContain("assignmentId");
  });


  test("keeps Day 6 div-card Teil content separated by the selected tab", async () => {
    render(
      <MemoryRouter
        initialEntries={[
          "/campus/course/a1-day-6-family-and-hobbies-workbook?radio=done&materials=done&workbookTab=section-1",
        ]}
      >
        <FakeDivCardPracticeWorkbook />
        <A1SharedPracticeWorkbookNavigation />
      </MemoryRouter>,
    );

    await screen.findByRole("tab", { name: "Teil 1" });
    await waitFor(() => expect(screen.getByTestId("practice-section-1")).toBeVisible());
    expect(screen.getByTestId("practice-section-2")).not.toBeVisible();
    expect(screen.getByTestId("practice-section-3")).not.toBeVisible();

    fireEvent.click(screen.getByRole("tab", { name: "Teil 2" }));
    await waitFor(() => expect(screen.getByTestId("practice-section-2")).toBeVisible());
    expect(screen.getByTestId("practice-section-1")).not.toBeVisible();
    expect(screen.getByTestId("practice-section-3")).not.toBeVisible();
  });

  test("keeps the selected Teil visible when a query update remounts the workbook DOM", async () => {
    render(
      <MemoryRouter
        initialEntries={[
          "/campus/course/a1-day-5-introducing-yourself-and-articles-workbook?radio=done&materials=done&workbookTab=section-1",
        ]}
      >
        <FakePracticeWorkbook remountOnSearch />
        <A1SharedPracticeWorkbookNavigation />
        <LocationProbe />
      </MemoryRouter>,
    );

    await screen.findByRole("tab", { name: "Teil 2" });
    fireEvent.click(screen.getByRole("tab", { name: "Teil 2" }));

    await waitFor(() => {
      expect(screen.getByTestId("practice-location").textContent).toContain("workbookTab=section-2");
      expect(screen.getByTestId("practice-section-2")).toBeVisible();
      expect(screen.getByTestId("practice-section-1")).not.toBeVisible();
    });
  });

  test("does not compete with Falowen Radio or supporting materials", async () => {
    render(
      <MemoryRouter
        initialEntries={[
          "/campus/course/a1-day-5-introducing-yourself-and-articles-workbook?radio=done",
        ]}
      >
        <FakePracticeWorkbook />
        <A1SharedPracticeWorkbookNavigation />
      </MemoryRouter>,
    );

    await new Promise((resolve) => window.setTimeout(resolve, 10));
    expect(screen.queryByRole("region", { name: "A1 self-practice workbook navigation" })).not.toBeInTheDocument();
  });
});
