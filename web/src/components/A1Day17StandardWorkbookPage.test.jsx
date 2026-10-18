import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { getA1Assignment } from "../data/a1AssignmentRegistry";
import { fetchA1AudioPlaybackUrl } from "../services/a1AudioService";
import A1Day17InstructionsDirectionsKapitel11WorkbookPage from "./A1Day17InstructionsDirectionsKapitel11WorkbookPage";

jest.mock("../context/AuthContext", () => ({
  useAuth: () => ({ idToken: "test-token" }),
}));

jest.mock("../services/a1AudioService", () => ({
  fetchA1AudioPlaybackUrl: jest.fn(() => Promise.resolve({ url: "https://example.test/day-17.mp3" })),
}));

jest.mock("./VerifiedCloudDraftSubmissionPage", () => () => (
  <div data-testid="verified-cloud-draft-submission" />
));

jest.mock("./A1TutorDraftSectionCapture", () => () => null);

jest.mock("./A1TimedMockExam", () => ({
  __esModule: true,
  default: ({ children }) => children,
  useA1TimedMockExam: () => ({
    enabled: false,
    assignmentLocked: false,
    isTabLocked: () => false,
  }),
}));

const route = "/campus/course/a1-day-17-instructions-and-directions-kapitel-11-workbook";

describe("A1 Day 17 native standard workbook", () => {
  test("uses the two-part Sprechen and Hören contract", () => {
    const { container } = render(
      <MemoryRouter initialEntries={[`${route}?radio=done`]}>
        <A1Day17InstructionsDirectionsKapitel11WorkbookPage />
      </MemoryRouter>,
    );

    expect(getA1Assignment("A1-11")).toEqual(
      expect.objectContaining({
        layoutMode: "native",
        day: 17,
        chapter: "11",
        sections: [
          expect.objectContaining({ key: "teil-1", label: expect.stringMatching(/Sprechen/) }),
          expect.objectContaining({ key: "teil-2", label: expect.stringMatching(/Hören/) }),
        ],
      }),
    );
    expect(container.querySelector('[data-a1-shared-workbook="A1-11"]')).toBeInTheDocument();

    const navigation = screen.getByRole("tablist", { name: /A1-11 workbook sections/i });
    expect(navigation).toBeVisible();
    expect(screen.getByRole("tab", { name: /Teil 1/i })).toBeVisible();
    expect(screen.getByRole("tab", { name: /Teil 2/i })).toBeVisible();
    expect(screen.queryByRole("tab", { name: /Teil 3/i })).not.toBeInTheDocument();
  });

  test("shows polite requests in Teil 1 and protected listening in Teil 2", async () => {
    render(
      <MemoryRouter initialEntries={[`${route}?radio=done`]}>
        <A1Day17InstructionsDirectionsKapitel11WorkbookPage />
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByRole("tab", { name: /Teil 1/i }));
    expect(screen.getByRole("heading", { name: /Sprechen: Bitten und Reagieren/i })).toBeVisible();
    expect(screen.getByText(/KARTE 1: Fenster/i)).toBeVisible();

    fireEvent.click(screen.getByRole("tab", { name: /Teil 2/i }));
    expect(screen.getByRole("heading", { name: /Hören: Wegbeschreibung zum Bahnhof/i })).toBeVisible();
    expect(fetchA1AudioPlaybackUrl).toHaveBeenCalledWith({
      day: 17,
      key: "a1/day-17/day-17.mp3",
      idToken: "test-token",
    });
  });
});
