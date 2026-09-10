import React from "react";
import { render, screen } from "@testing-library/react";
import A1Day8CountriesAndLanguagesWorkbookPage from "./A1Day8CountriesAndLanguagesWorkbookPage";

jest.mock("./A1TutorMarkedWorkbookShell", () => {
  return function MockA1TutorMarkedWorkbookShell({ children }) {
    return <div>{children}</div>;
  };
});

describe("A1 Day 8 Hören Teil 3", () => {
  test("embeds the requested YouTube listening video and removes the Drive link", () => {
    render(<A1Day8CountriesAndLanguagesWorkbookPage />);

    const listeningVideo = screen.getByTitle("A1 Day 8 Hören: Annas Reisepläne");
    expect(listeningVideo).toHaveAttribute(
      "src",
      "https://www.youtube.com/embed/nqTYvpXFGfQ",
    );
    expect(document.body.innerHTML).not.toContain("drive.google.com");
  });

  test("shows all four answer choices for Frage 5", () => {
    render(<A1Day8CountriesAndLanguagesWorkbookPage />);

    expect(screen.getByText("Wohin möchte Anna nächstes Jahr?")).toBeInTheDocument();
    expect(screen.getByText("a) Nach Spanien")).toBeInTheDocument();
    expect(screen.getByText("b) Nach Deutschland")).toBeInTheDocument();
    expect(screen.getByText("c) Nach Italien")).toBeInTheDocument();
    expect(screen.getByText("d) Nach Frankreich")).toBeInTheDocument();
  });
});
