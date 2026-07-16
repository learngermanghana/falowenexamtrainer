import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import A1Day2Kapitel11WorkbookPage from "./A1Day2Kapitel11WorkbookPage";

const renderWorkbook = () =>
  render(
    <MemoryRouter>
      <A1Day2Kapitel11WorkbookPage />
    </MemoryRouter>,
  );

describe("A1 Day 2 Kapitel 1.1 workbook", () => {
  test("restores the original four Teil 1 listening questions", () => {
    renderWorkbook();
    fireEvent.click(screen.getByRole("tab", { name: "Teil 1 · Hören" }));

    expect(screen.getByText("1. Wie heißt sie?")).toBeInTheDocument();
    expect(screen.getByText("C) Anna")).toBeInTheDocument();
    expect(screen.getByText("2. Woher kommt sie?")).toBeInTheDocument();
    expect(screen.getAllByText("A) Berlin")).toHaveLength(2);
    expect(screen.getByText("A) A, B, C, D, E, F, G")).toBeInTheDocument();
    expect(screen.getByText("4. Woher kommt Annas Freund Max?")).toBeInTheDocument();
    expect(screen.getByTitle("A1 Day 2 Kapitel 1.1 Hören video")).toHaveAttribute(
      "src",
      expect.stringContaining("nih5h7B48NY"),
    );
  });

  test("keeps Teil 2 as the original writing task and removes extra parts", () => {
    renderWorkbook();
    fireEvent.click(screen.getByRole("tab", { name: "Teil 2 · Schreiben" }));

    expect(screen.getByText("Introducing Yourself in German")).toBeInTheDocument();
    expect(screen.getByText(/Ich heiße/)).toBeInTheDocument();
    expect(screen.getByText(/Ich komme aus/)).toBeInTheDocument();
    expect(screen.getByText(/Ich wohne in/)).toBeInTheDocument();
    expect(screen.queryByRole("tab", { name: /Teil 3/i })).not.toBeInTheDocument();
  });
});
