import { render, screen } from "@testing-library/react";
import App from "./App";

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
  analyzeAudio: jest.fn(),
  analyzeText: jest.fn(),
}));

test("renders home actions for authenticated users", () => {
  render(<App />);
  expect(screen.getByText(/Falowen Exam Coach/i)).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /Start Level Check/i })).toBeInTheDocument();
});
