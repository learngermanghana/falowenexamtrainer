import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { getA1Assignment } from "../data/a1AssignmentRegistry";
import { fetchA1AudioPlaybackUrl } from "../services/a1AudioService";
import A1Day17InstructionsDirectionsKapitel11WorkbookPage from "./A1Day17InstructionsDirectionsKapitel11WorkbookPage";
import { validateA1CanonicalSubmissionCompleteness } from "./A1CanonicalSubmissionPanel";

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
  test("uses the three-part Sprechen, Hören and Lesen contract", () => {
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
          expect.objectContaining({ key: "teil-3", label: expect.stringMatching(/Lesen/) }),
        ],
      }),
    );
    expect(container.querySelector('[data-a1-shared-workbook="A1-11"]')).toBeInTheDocument();

    const navigation = screen.getByRole("tablist", { name: /A1-11 workbook sections/i });
    expect(navigation).toBeVisible();
    expect(screen.getByRole("tab", { name: /Teil 1/i })).toBeVisible();
    expect(screen.getByRole("tab", { name: /Teil 2/i })).toBeVisible();
    expect(screen.getByRole("tab", { name: /Teil 3/i })).toBeVisible();
  });

  test("shows the speaking request checkpoint and protected Day 17 listening", async () => {
    render(
      <MemoryRouter initialEntries={[`${route}?radio=done`]}>
        <A1Day17InstructionsDirectionsKapitel11WorkbookPage />
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByRole("tab", { name: /Teil 1/i }));
    expect(screen.getByRole("heading", { name: /Sprechen: Bitten und Reagieren/i })).toBeVisible();
    // The learner no longer sees three instructions or three nouns at once.
    expect(screen.getByRole("button", { name: "Karte ziehen" })).toBeVisible();
    expect(screen.getByText(/Verdeckte Bildkarte/i)).toBeVisible();
    expect(screen.queryByText(/Können Sie mir bitte den Stadtplan geben/i)).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Karte ziehen" }));
    expect(screen.getByText(/Stellen Sie jetzt eine höfliche Bitte/i)).toBeVisible();
    expect(screen.queryByRole("button", { name: "Karte ziehen" })).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("tab", { name: /Teil 2/i }));
    expect(screen.getByRole("heading", { name: /Hören: Wegbeschreibung zum Bahnhof/i })).toBeVisible();
    expect(screen.queryByRole("button", { name: "Hören starten" })).not.toBeInTheDocument();

    expect(fetchA1AudioPlaybackUrl).toHaveBeenCalledWith({
      day: 17,
      key: "a1/day-17/day-17.mp3",
      idToken: "test-token",
    });
    expect(screen.queryByText("Zusatzaufgabe · nicht benotet")).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("tab", { name: /Teil 3/i }));
    expect(screen.getByRole("heading", { name: /Lesen: Wegbeschreibung/i })).toBeVisible();
    expect(screen.getByText(/Annas Haus steht direkt neben der Bäckerei/)).toBeVisible();
  });
});


describe("A1 Day 17 tutor submission integrity", () => {
  const speaking = [
    "GOETHE_A1_TUTOR_SPEAKING_V1",
    "Speaking exam part: 3",
    "Score: 8/10",
    "Feedback: Clear polite request.",
  ].join("\n");
  const hoeren = "TEIL 2\n1. Richtig\n2. Falsch\n3. Richtig\n4. B\n5. A";
  const lesen = "TEIL 3\n1. Richtig\n2. Falsch\n3. Richtig\n4. Richtig\n5. Falsch";
  const complete = ["TEIL 1\n" + speaking, hoeren, lesen].join("\n");

  test.each([
    ["Sprechen", [hoeren, lesen].join("\n"), /Teil 1 speaking assessment/],
    ["Hören", [speaking, lesen].join("\n"), /Teil 2 answers 1, 2, 3, 4, 5/],
    ["Lesen", [speaking, hoeren].join("\n"), /Teil 3 answers 1, 2, 3, 4, 5/],
  ])("blocks submission when %s is missing and names the missing part", (_part, text, message) => {
    const result = validateA1CanonicalSubmissionCompleteness({ assignmentKey: "A1-11", text });
    expect(result.ok).toBe(false);
    expect(result.message).toMatch(message);
    expect(result.message).toMatch(/still a draft and has not been submitted/i);
  });

  test("accepts A1 Day 17 only when speaking, all five Hören answers, and all five Lesen answers are present", () => {
    expect(validateA1CanonicalSubmissionCompleteness({ assignmentKey: "A1-11", text: complete }))
      .toEqual({ ok: true, message: "" });
  });

  test("blocks a completely empty A1 Day 17 submission before it is sent", () => {
    const result = validateA1CanonicalSubmissionCompleteness({ assignmentKey: "A1-11", text: "  \n  " });
    expect(result.ok).toBe(false);
    expect(result.message).toMatch(/Teil 1 speaking assessment/);
    expect(result.message).toMatch(/Teil 2 answers 1, 2, 3, 4, 5/);
    expect(result.message).toMatch(/Teil 3 answers 1, 2, 3, 4, 5/);
  });
});
