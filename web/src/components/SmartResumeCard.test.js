import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SmartResumeCard from "./SmartResumeCard";
import { useLatestLessonResume } from "../hooks/useLessonResumeSync";
import { useAuth } from "../context/AuthContext";
import { fetchLearnerSupportState } from "../services/learnerSupportService";

const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
}));

jest.mock("../hooks/useLessonResumeSync", () => ({
  useLatestLessonResume: jest.fn(),
}));

jest.mock("../context/AuthContext", () => ({
  useAuth: jest.fn(),
}));

jest.mock("../services/learnerSupportService", () => ({
  fetchLearnerSupportState: jest.fn(),
}));

jest.mock("../services/interactionFeedback", () => ({
  triggerInteractionFeedback: jest.fn(),
}));

describe("SmartResumeCard", () => {
  beforeEach(() => {
    mockNavigate.mockReset();
    useLatestLessonResume.mockReset();
    useAuth.mockReturnValue({ idToken: "token" });
    fetchLearnerSupportState.mockReset();
    fetchLearnerSupportState.mockResolvedValue({ nextAction: { type: "resume-learning", url: "/campus/course/lesson/A2/6?chapter=3.6&view=hoeren&radio=done" } });
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

  test("uses the authoritative next lesson when submitted work is awaiting review", async () => {
    useLatestLessonResume.mockReturnValue({
      loading: false,
      error: "",
      resume: {
        level: "A2",
        day: 5,
        title: "Previous lesson",
        activeView: "submit",
        lastRoute: "/campus/course/a2-day-5-workbook?view=submit&radio=done",
        completed: false,
      },
    });
    fetchLearnerSupportState.mockResolvedValue({
      nextAction: {
        type: "continue-course",
        label: "Continue: Möbel & Räume",
        reason: "continue_while_marking_pending",
        url: "/campus/course/lesson/A2/6?chapter=3.6",
      },
    });

    render(<SmartResumeCard />);

    expect(await screen.findByText("Your next step")).toBeInTheDocument();
    expect(screen.getByText("Continue: Möbel & Räume")).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "Continue" }));
    expect(mockNavigate).toHaveBeenCalledWith("/campus/course/lesson/A2/6?chapter=3.6");
  });

  test("hides resume when access requires payment or renewal", async () => {
    useLatestLessonResume.mockReturnValue({
      loading: false,
      error: "",
      resume: {
        level: "A1",
        day: 9,
        activeView: "workbook",
        lastRoute: "/campus/course/lesson/A1/9?view=workbook",
        completed: false,
      },
    });
    fetchLearnerSupportState.mockResolvedValue({
      nextAction: {
        type: "complete-payment",
        label: "Complete payment to continue",
        url: "/campus/account?tab=billing",
      },
    });

    const { container } = render(<SmartResumeCard />);
    await Promise.resolve();
    await Promise.resolve();

    expect(container.querySelector("[data-smart-resume-card]")).toBeNull();
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
