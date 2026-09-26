import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import A2Day14BerufUndKarriereWorkbookPage from "./A2Day14BerufUndKarriereWorkbookPage";

const route = "/campus/course/a2-day-14-beruf-und-karriere-workbook?assignmentKey=A2-5.14&assignmentId=A2-5.14&level=A2&radio=done&view=grammar";

describe("A2 Day 14 Beruf und Karriere workbook", () => {
  test("uses the standard workbook tabs without a Teil 4 Hören tab", () => {
    render(
      <MemoryRouter initialEntries={[route]}>
        <A2Day14BerufUndKarriereWorkbookPage />
      </MemoryRouter>,
    );

    expect(screen.getByRole("tab", { name: "Grammar" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Teil 1" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Teil 2" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Teil 3" })).toBeInTheDocument();
    expect(screen.queryByRole("tab", { name: "Teil 4" })).not.toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Ref" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Submit" })).toBeInTheDocument();
  });

  test("shows one focused grammar lesson and no generic grammar stacks", async () => {
    render(
      <MemoryRouter initialEntries={[route]}>
        <A2Day14BerufUndKarriereWorkbookPage />
      </MemoryRouter>,
    );

    expect(await screen.findByRole("heading", { name: "um ... zu + Infinitiv" })).toBeInTheDocument();
    expect(screen.getByText(/gleiche Person/i)).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "3. Wann benutze ich damit?" })).toBeInTheDocument();

    expect(screen.queryByText(/Verben mit Präpositionen/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Think first/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/A2.2 · Grammar in use/i)).not.toBeInTheDocument();
  });

  test("removes all grammar content when the learner switches to Lesen", async () => {
    render(
      <MemoryRouter initialEntries={[route]}>
        <A2Day14BerufUndKarriereWorkbookPage />
      </MemoryRouter>,
    );

    expect(await screen.findByRole("heading", { name: "um ... zu + Infinitiv" })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("tab", { name: "Teil 3" }));

    expect(await screen.findByRole("heading", { name: "Teil 3 · Lesen (Exercise)" })).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.queryByRole("heading", { name: "um ... zu + Infinitiv" })).not.toBeInTheDocument();
    });

    expect(screen.queryByText(/Think first/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Verben mit Präpositionen/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/How this workbook works/i)).not.toBeInTheDocument();
    expect(screen.getByText("Willkommen bei TechPlus")).toBeInTheDocument();
  });
});
