import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, useLocation, useNavigate } from "react-router-dom";
import A1SharedAssignmentWorkbookBridge from "./A1SharedAssignmentWorkbookBridge";

jest.mock("./A1CanonicalSubmissionPanel", () => () => <div data-testid="canonical-submit">Canonical submit</div>);

const DelayedA1Workbook = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search || "");
  const materialsDone = params.get("materials") === "done";

  if (!materialsDone) {
    return (
      <main className="layout-main">
        <div data-self-learning-materials-selector="true">
          <h1>A1 · Day 16 · Choose your learning material</h1>
          <button
            type="button"
            onClick={() => {
              const next = new URLSearchParams(location.search || "");
              next.set("materials", "done");
              navigate({ pathname: location.pathname, search: `?${next.toString()}` }, { replace: true });
            }}
          >
            Open self-learning workbook
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="layout-main">
      <div id="a1-10-workbook">
        <header>
          <h1>A1 · Day 16 Workbook · Food and Negation</h1>
          <div role="tablist" aria-label="legacy workbook tabs">
            <button type="button">Assignment</button>
            <button type="button">Submit</button>
          </div>
        </header>
        <section data-testid="teil-1-content">
          <h2>Teil 1 · Lesen / Schreiben</h2>
          <p>Teil 1 content</p>
        </section>
        <section data-testid="teil-2-content">
          <h2>Teil 2 · Hören</h2>
          <p>Teil 2 content</p>
        </section>
      </div>
    </main>
  );
};

describe("A1 shared navigation after a delayed self-learning journey", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
    window.requestAnimationFrame = (callback) => window.setTimeout(callback, 0);
    window.cancelAnimationFrame = (id) => window.clearTimeout(id);
    window.scrollTo = jest.fn();
  });

  test("waits through materials, then mounts Teil navigation and assignment neighbors", async () => {
    render(
      <MemoryRouter
        initialEntries={[
          "/campus/course/a1-day-16-food-and-negation-kapitel-10-workbook?radio=done&assignmentKey=A1-10&assignmentId=A1-10&level=A1",
        ]}
      >
        <DelayedA1Workbook />
        <A1SharedAssignmentWorkbookBridge assignmentKey="A1-10" />
      </MemoryRouter>,
    );

    expect(screen.queryByRole("tab", { name: /Teil 1/i })).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /Open self-learning workbook/i }));

    const teil1Tab = await screen.findByRole("tab", { name: /Teil 1/i });
    const teil2Tab = screen.getByRole("tab", { name: /Teil 2/i });
    expect(screen.getByRole("tab", { name: "Overview" })).toBeVisible();
    expect(screen.getByRole("tab", { name: "Submit" })).toBeVisible();

    expect(screen.getByRole("navigation", { name: /Previous and next A1 assignments/i })).toBeVisible();
    expect(screen.getByRole("link", { name: /A1-9/i })).toHaveAttribute(
      "href",
      "/campus/course/a1-day-16-food-and-negation-food-and-daily-life-workbook",
    );
    expect(screen.getByRole("link", { name: /A1-11/i })).toHaveAttribute(
      "href",
      "/campus/course/a1-day-17-instructions-and-directions-kapitel-11-workbook",
    );

    fireEvent.click(teil1Tab);
    await waitFor(() => expect(screen.getByTestId("teil-1-content")).toBeVisible());
    expect(screen.getByTestId("teil-2-content")).not.toBeVisible();

    fireEvent.click(teil2Tab);
    await waitFor(() => expect(screen.getByTestId("teil-2-content")).toBeVisible());
    expect(screen.getByTestId("teil-1-content")).not.toBeVisible();
  });
});
