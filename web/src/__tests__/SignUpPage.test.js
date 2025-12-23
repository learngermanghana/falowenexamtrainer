import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SignUpPage from "../components/SignUpPage";

const mockSignup = jest.fn();

jest.mock("../context/ExamContext", () => ({
  ALLOWED_LEVELS: ["A1", "A2", "B1", "B2"],
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
    "Evening A1": { startDate: "2024-01-01", schedule: [] },
  },
}));

describe("SignUpPage", () => {
  beforeEach(() => {
    mockSignup.mockResolvedValue({});
    window.open = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("does not redirect to checkout when payments are disabled", async () => {
    render(<SignUpPage onLogin={jest.fn()} />);

    await userEvent.click(screen.getByRole("button", { name: /skip payment for now/i }));
    await userEvent.type(screen.getByPlaceholderText("Abigail"), "Test User");
    await userEvent.type(screen.getByPlaceholderText("you@example.com"), "test@example.com");
    await userEvent.type(
      screen.getByPlaceholderText("At least 8 characters with letters and numbers"),
      "password123"
    );
    await userEvent.type(screen.getByPlaceholderText("Enter password again"), "password123");
    await userEvent.type(screen.getByPlaceholderText("0176 12345678"), "0123456789");
    await userEvent.type(screen.getByPlaceholderText("Berlin"), "Berlin");
    await userEvent.type(screen.getByPlaceholderText("0176 98765432"), "0987654321");
    await userEvent.click(screen.getByRole("checkbox"));
    await userEvent.click(screen.getByRole("button", { name: /sign up now/i }));

    await waitFor(() => expect(mockSignup).toHaveBeenCalled());

    expect(window.open).not.toHaveBeenCalled();
  });
});
