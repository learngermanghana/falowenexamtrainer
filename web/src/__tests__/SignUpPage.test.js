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
  loadPreferredClass: jest.fn(() => "A1 Test Class"),
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
    "A1 Test Class": { startDate: "2099-01-01", schedule: [] },
  },
}));

jest.mock("../services/publicClassCatalogService", () => ({
  loadPublicClasses: jest.fn(() => Promise.resolve([])),
  findPublicClassName: jest.fn(() => ""),
  publicClassLabel: jest.fn((row) => row.title),
}));

const fillAccount = async () => {
  await userEvent.type(screen.getByPlaceholderText("Abigail Mensah"), "Test Learner");
  await userEvent.type(screen.getByPlaceholderText("you@example.com"), "learner@example.com");
  await userEvent.type(screen.getByPlaceholderText("At least 8 characters with letters and numbers"), "password123");
  await userEvent.type(screen.getByPlaceholderText("Enter password again"), "password123");
};
const advanceLearning = async () => {
  await userEvent.click(screen.getByRole("button", { name: /Continue to your learning/ }));
  await userEvent.selectOptions(screen.getByLabelText("Preferred learning mode"), "Online");
  await userEvent.click(await screen.findByRole("button", { name: /A1 Test Class/ }));
  await userEvent.click(screen.getByRole("button", { name: /Continue to contact details/ }));
};
const fillContact = async () => {
  await userEvent.type(screen.getByLabelText("Phone number"), "+233241234567");
  await userEvent.type(screen.getByLabelText("Address"), "12 Test Street");
  await userEvent.type(screen.getByLabelText("Location"), "Accra");
};

describe("three-step signup", () => {
  beforeEach(() => { jest.clearAllMocks(); mockSignup.mockResolvedValue({}); window.localStorage.clear(); });
  it("shows only the account step first and validates before continuing", async () => {
    render(<SignUpPage />);
    expect(screen.getByText(/Step 1 of 3/)).toBeVisible();
    expect(screen.queryByRole("textbox", { name: "Phone number" })).not.toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: /Continue to your learning/ }));
    expect(screen.getByText(/Step 1 of 3/)).toBeVisible();
    expect(screen.getByText("Enter your first and last name for your certificates.")).toBeVisible();
    expect(mockSignup).not.toHaveBeenCalled();
  });
  it("keeps answers when moving back and never creates an account on Continue", async () => {
    render(<SignUpPage />);
    await fillAccount();
    await advanceLearning();
    expect(screen.getByText(/Step 3 of 3/)).toBeVisible();
    await userEvent.click(screen.getByRole("button", { name: "Back", exact: true }));
    expect(screen.getByLabelText("Preferred learning mode")).toHaveValue("Online");
    await userEvent.click(screen.getByRole("button", { name: "Back", exact: true }));
    expect(screen.getByPlaceholderText("Abigail Mensah")).toHaveValue("Test Learner");
    expect(screen.getByPlaceholderText("Enter password again")).toHaveValue("password123");
    expect(mockSignup).not.toHaveBeenCalled();
  });
  it("requires emergency contact before creating the trial", async () => {
    render(<SignUpPage />);
    await fillAccount(); await advanceLearning(); await fillContact();
    await userEvent.click(screen.getByRole("checkbox"));
    await userEvent.click(screen.getByRole("button", { name: "Create account & start 7-day trial" }));
    expect(await screen.findByText(/Add a valid emergency contact phone number/)).toBeVisible();
    expect(mockSignup).not.toHaveBeenCalled();
    await userEvent.type(screen.getByLabelText("Emergency contact phone"), "+233209876543");
    await userEvent.click(screen.getByRole("button", { name: "Create account & start 7-day trial" }));
    await waitFor(() => expect(mockSignup).toHaveBeenCalledWith("learner@example.com", "password123", expect.objectContaining({ className: "A1 Test Class", phone: "+233241234567", address: "12 Test Street", location: "Accra", learningMode: "Online", emergencyContactPhone: "+233209876543", paymentStatus: "pending", initialPaymentAmount: 0, trialStatus: "active" })));
  });
  it("requires learning mode and class on step two", async () => {
    render(<SignUpPage />); await fillAccount();
    await userEvent.click(screen.getByRole("button", { name: /Continue to your learning/ }));
    await userEvent.click(screen.getByRole("button", { name: /Continue to contact details/ }));
    expect(screen.getByText(/Step 2 of 3/)).toBeVisible();
    expect(screen.getByText("Choose how you plan to learn.")).toBeVisible();
    expect(mockSignup).not.toHaveBeenCalled();
  });
  it("returns to the account step when the email is already registered", async () => {
    mockSignup.mockRejectedValueOnce({ code: "auth/email-already-in-use" });
    const spy = jest.spyOn(console, "error").mockImplementation(() => {});
    render(<SignUpPage />); await fillAccount(); await advanceLearning(); await fillContact();
    await userEvent.type(screen.getByLabelText("Emergency contact phone"), "+233209876543");
    await userEvent.click(screen.getByRole("checkbox"));
    await userEvent.click(screen.getByRole("button", { name: "Create account & start 7-day trial" }));
    expect(await screen.findByText(/That email is already registered/)).toBeVisible();
    expect(screen.getByText(/Step 1 of 3/)).toBeVisible();
    expect(screen.getByPlaceholderText("you@example.com")).toHaveValue("learner@example.com");
    spy.mockRestore();
  });
});
