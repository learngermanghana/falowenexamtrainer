import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import DailyLearningPlanCard from "./DailyLearningPlanCard";
import { useAuth } from "../context/AuthContext";
import { fetchLearnerSupportState } from "../services/learnerSupportService";

const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
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

describe("DailyLearningPlanCard", () => {
  beforeEach(() => {
    mockNavigate.mockReset();
    useAuth.mockReturnValue({ idToken: "token" });
    fetchLearnerSupportState.mockReset();
  });

  test("renders the ordered server plan and opens exact action routes", async () => {
    fetchLearnerSupportState.mockResolvedValue({
      learningPlan: {
        title: "Your learning plan today",
        summary: "Complete these in order.",
        inactivityDays: 4,
        items: [
          {
            id: "resume-last-section",
            type: "resume-learning",
            title: "Finish Möbel & Räume · Hören",
            helper: "Continue from the exact section where you stopped.",
            url: "/campus/course/lesson/A2/6?chapter=3.6&view=hoeren&radio=done",
            actionLabel: "Continue Hören",
            category: "course",
          },
          {
            id: "return-warmup",
            type: "warmup-review",
            title: "Do a 5-minute return warm-up",
            helper: "Review the last lesson briefly before continuing.",
            url: "/campus/course/lesson/A2/6?chapter=3.6&view=hoeren&radio=done",
            actionLabel: "Review last lesson",
            category: "review",
          },
        ],
      },
    });

    render(<DailyLearningPlanCard />);

    expect(await screen.findByText("Your learning plan today")).toBeInTheDocument();
    expect(screen.getByText("Finish Möbel & Räume · Hören")).toBeInTheDocument();
    expect(screen.getByText("Do a 5-minute return warm-up")).toBeInTheDocument();
    expect(screen.getByText(/Returning after 4 days/)).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "Continue Hören" }));
    expect(mockNavigate).toHaveBeenCalledWith(
      "/campus/course/lesson/A2/6?chapter=3.6&view=hoeren&radio=done",
    );
  });

  test("shows access restoration instead of a learning resume when access is blocked", async () => {
    fetchLearnerSupportState.mockResolvedValue({
      learningPlan: {
        title: "Your learning plan today",
        summary: "Restore access before continuing your course.",
        items: [
          {
            id: "restore-access",
            type: "complete-payment",
            title: "Complete payment to continue after your trial",
            helper: "Course progress is paused until your access is active again.",
            url: "/campus/account?tab=billing",
            actionLabel: "Open billing",
            category: "access",
          },
        ],
      },
    });

    render(<DailyLearningPlanCard />);

    expect(await screen.findByText("Complete payment to continue after your trial")).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Open billing" }));
    expect(mockNavigate).toHaveBeenCalledWith("/campus/account?tab=billing");
  });

  test("stays hidden when no authenticated plan is available", () => {
    useAuth.mockReturnValue({ idToken: "" });
    fetchLearnerSupportState.mockResolvedValue({});
    const { container } = render(<DailyLearningPlanCard />);
    expect(container).toBeEmptyDOMElement();
  });
});
