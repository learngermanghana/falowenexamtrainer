import { render, screen } from "@testing-library/react";

jest.mock("./context/AuthContext", () => ({
  useAuth: () => ({
    user: { uid: "test-user", email: "test@example.com" },
    loading: false,
    logout: jest.fn(),
    enableNotifications: jest.fn(),
    notificationStatus: "idle",
  }),
}));

jest.mock("./services/coachService", () => ({
  __esModule: true,
  analyzeAudio: jest.fn(),
  analyzeText: jest.fn(),
  fetchNextTask: jest.fn(() => Promise.resolve(null)),
  fetchWeeklySummary: jest.fn(() => Promise.resolve({ summary: "" })),
}));

jest.mock("./components/CoachPanel", () => () => <div data-testid="coach-panel" />);

import App from "./App";

test("renders home actions for authenticated users", () => {
  render(<App />);
  expect(screen.getByText(/Falowen Exam Coach/i)).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /Level Check/i })).toBeInTheDocument();
});
