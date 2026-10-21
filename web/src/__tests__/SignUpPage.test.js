import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "../i18n";
import SignUpPage from "../components/SignUpPage";

const mockSignup = jest.fn();

jest.mock("../context/ExamContext", () => ({
  ALLOWED_LEVELS: ["A1", "A2", "B1", "B2", "C1"],
}));

jest.mock("../context/AuthContext", () => ({
  useAuth: () => ({
    signup: mockSignup,
    authError: "",
    setAuthError: jest.fn(),
  }),
}));

jest.mock("../context/ToastContext", () => ({
  useToast: () => ({ showToast: jest.fn() }),
}));

jest.mock("../services/levelStorage", () => ({
  savePreferredLevel: jest.fn(),
}));

jest.mock("../services/classSelectionStorage", () => ({
  loadPreferredClass: jest.fn(() => "Evening A1"),
  savePreferredClass: jest.fn(),
}));

jest.mock("../services/submissionService", () => ({
  rememberStudentCodeForEmail: jest.fn(),
}));

jest.mock("../lib/featureFlags", () => ({
  isPaymentsEnabled: jest.fn(() => false),
}));

jest.mock("../lib/paystack", () => ({
  buildPaystackCheckoutLink: jest.fn(() => "https://pay.example/checkout"),
}));

jest.mock("../services/studentCode", () => ({
  generateStudentCode: jest.fn(() => "ABC123"),
}));

jest.mock("../data/classCatalog", () => ({
  classCatalog: {
    "Evening A1": { startDate: "2099-01-01", schedule: [] },
  },
}));

describe("Short signup", () => {
  beforeEach(() => { mockSignup.mockReset().mockResolvedValue({}); });
  it("creates a trial without a class, phone, address or emergency contact", async () => {
    render(<SignUpPage onLogin={jest.fn()} />);
    await userEvent.type(screen.getByPlaceholderText("Abigail Mensah"), "Test Learner");
    await userEvent.type(screen.getByPlaceholderText("you@example.com"), "test@example.com");
    await userEvent.type(screen.getByPlaceholderText("At least 8 characters with letters and numbers"), "password123");
    await userEvent.type(screen.getByPlaceholderText("Enter password again"), "password123");
    await userEvent.click(screen.getByRole("checkbox"));
    await userEvent.click(screen.getByRole("button", { name: "Create account & start 7-day trial" }));
    await waitFor(() => expect(mockSignup).toHaveBeenCalledWith("test@example.com", "password123", expect.objectContaining({ trialStatus: "active", className: "", emergencyContactPhone: "", initialPaymentAmount: 0, learningGoal: "explore" })));
  });
  it("only asks for a class when the learner chooses live classes", async () => {
    render(<SignUpPage onLogin={jest.fn()} />);
    expect(screen.queryByText("Which live class are you joining?")).not.toBeInTheDocument();
    await userEvent.selectOptions(screen.getByLabelText("What would you like to do?"), "live");
    expect(screen.getByText("Which live class are you joining?")).toBeInTheDocument();
  });
});
