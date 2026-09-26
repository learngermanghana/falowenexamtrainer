import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SmartResumeCard from "./SmartResumeCard";
import { useLatestLessonResume } from "../hooks/useLessonResumeSync";

const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
}));

jest.mock("../hooks/useLessonResumeSync", () => ({
  useLatestLessonResume: jest.fn(),
}));

jest.mock("../services/interactionFeedback", () => ({
  triggerInteractionFeedback: jest.fn(),
}));

describe("SmartResumeCard", () => {
  beforeEach(() => {
    mockNavigate.mockReset();
    useLatestLessonResume.mockReset();
  });

  test("opens the exact cloud-synced lesson section", async () => {
    useLatestLessonResume.mockReturnValue({
      loading: false,
      error: "",
      resume: {
        level: "A2",
        day: 6,
        title: "Möbel & Räume",
        activeView: "hoeren",
        lastRoute: "/campus/course/lesson/A2/6?chapter=3.6&view=hoeren&radio=done",
        radioDone: true,
        completed: false,
        sections: { learn: true, hoeren: false },
      },
    });

    render(<SmartResumeCard />);

    expect(screen.getByText("Continue where you stopped")).toBeInTheDocument();
    expect(screen.getByText(/A2 · Day 6 · Hören/)).toBeInTheDocument();
    expect(screen.getByText("Möbel & Räume")).toBeInTheDocument();
    expect(screen.getByText(/Falowen Radio complete/)).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "Continue Hören" }));
    expect(mockNavigate).toHaveBeenCalledWith(
      "/campus/course/lesson/A2/6?chapter=3.6&view=hoeren&radio=done",
    );
  });

  test("does not show a resume card after the last recorded lesson is complete", () => {
    useLatestLessonResume.mockReturnValue({
      loading: false,
      error: "",
      resume: {
        level: "C1",
        day: 12,
        activeView: "finish",
        lastRoute: "/campus/course/lesson/C1/12?view=finish",
        completed: true,
      },
    });

    const { container } = render(<SmartResumeCard />);
    expect(container).toBeEmptyDOMElement();
  });
});
