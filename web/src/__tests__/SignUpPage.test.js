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
  await userEvent.type(screen.getByLabelText("First name (given name)"), "Test");
  await userEvent.type(screen.getByLabelText("Surname / family name"), "Learner");
  await userEvent.click(screen.getByRole("checkbox", { name: /I confirm this is the correct spelling/ }));
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
  await userEvent.type(screen.getByLabelText("City / Town"), "Accra");
  await userEvent.type(screen.getByLabelText("Country of residence"), "Ghana");
  await userEvent.click(screen.getByRole("option", { name: "Ghana" }));
};

describe("three-step signup", () => {
  beforeEach(() => { jest.clearAllMocks(); mockSignup.mockResolvedValue({}); window.localStorage.clear(); window.history.replaceState({}, "", "/"); });
  afterEach(() => window.history.replaceState({}, "", "/"));
  it("shows only the account step first and validates before continuing", async () => {
    render(<SignUpPage />);
    expect(screen.getByText(/Step 1 of 3/)).toBeVisible();
    expect(screen.queryByRole("textbox", { name: "Phone number" })).not.toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: /Continue to your learning/ }));
    expect(screen.getByText(/Step 1 of 3/)).toBeVisible();
    expect(screen.getByText("Enter your first name.")).toBeVisible();
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
    expect(screen.getByLabelText("First name (given name)")).toHaveValue("Test");
    expect(screen.getByLabelText("Surname / family name")).toHaveValue("Learner");
    expect(screen.getByPlaceholderText("Enter password again")).toHaveValue("password123");
    expect(mockSignup).not.toHaveBeenCalled();
  });
  it("requires choosing a country and provides offline country options", async () => {
    render(<SignUpPage />);
    await fillAccount();
    await advanceLearning();
    await userEvent.type(screen.getByLabelText("Phone number"), "+233241234567");
    await userEvent.type(screen.getByLabelText("Address"), "12 Test Street");
    await userEvent.type(screen.getByLabelText("City / Town"), "Accra");
    const picker = screen.getByLabelText("Country of residence");
    expect(picker).toHaveValue("");
    await userEvent.click(picker);
    expect(screen.getByRole("option", { name: "Ghana" })).toBeInTheDocument();
    await userEvent.type(picker, "Ger");
    expect(screen.getByRole("option", { name: "Germany" })).toBeInTheDocument();
    await userEvent.clear(picker);
    await userEvent.type(screen.getByLabelText("Emergency contact phone"), "+233209876543");
    await userEvent.click(screen.getByRole("checkbox"));
    await userEvent.click(screen.getByRole("button", { name: "Create account & start 7-day trial" }));
    expect(await screen.findByText(/Select your country of residence/)).toBeVisible();
    expect(mockSignup).not.toHaveBeenCalled();
    await userEvent.type(picker, "Ghana");
    await userEvent.click(screen.getByRole("option", { name: "Ghana" }));
    await userEvent.click(screen.getByRole("button", { name: "Create account & start 7-day trial" }));
    await waitFor(() => expect(mockSignup).toHaveBeenCalledWith(
      "learner@example.com", "password123", expect.objectContaining({ countryCode: "GH", country: "Ghana" }),
    ));
  });

  it("shows an official-name preview and clears confirmation after a spelling edit", async () => {
    render(<SignUpPage />);
    await userEvent.type(screen.getByLabelText("First name (given name)"), "Ama");
    await userEvent.type(screen.getByLabelText("Surname / family name"), "Mensah");
    expect(screen.getByText("Ama Mensah")).toBeVisible();
    await userEvent.click(screen.getByRole("checkbox", { name: /I confirm this is the correct spelling/ }));
    expect(screen.getByRole("checkbox", { name: /I confirm this is the correct spelling/ })).toBeChecked();
    await userEvent.type(screen.getByLabelText("Surname / family name"), "a");
    expect(screen.getByRole("checkbox", { name: /I confirm this is the correct spelling/ })).not.toBeChecked();
  });

  it("suggests a common email typo but only changes the address when accepted", async () => {
    render(<SignUpPage />);
    const email = screen.getByPlaceholderText("you@example.com");
    await userEvent.type(email, "student@gmial.com");
    expect(email).toHaveValue("student@gmial.com");
    expect(screen.getByText("student@gmail.com")).toBeVisible();
    await userEvent.click(screen.getByRole("button", { name: "Use this email" }));
    expect(email).toHaveValue("student@gmail.com");
  });

  it("converts Nigerian local phone numbers to the correct country code", async () => {
    render(<SignUpPage />);
    await fillAccount(); await advanceLearning();
    await userEvent.type(screen.getByLabelText("Country of residence"), "Nigeria");
    await userEvent.click(screen.getByRole("option", { name: "Nigeria" }));
    expect(screen.getByText("+234")).toBeVisible();
    await userEvent.type(screen.getByLabelText("Phone number"), "0803 123 4567");
    await userEvent.type(screen.getByLabelText("City / Town"), "Lagos");
    await userEvent.type(screen.getByLabelText("Address"), "10 Marina");
    await userEvent.type(screen.getByLabelText("Emergency contact phone"), "0902 123 4567");
    await userEvent.click(screen.getByRole("checkbox"));
    await userEvent.click(screen.getByRole("button", { name: "Create account & start 7-day trial" }));
    await waitFor(() => expect(mockSignup).toHaveBeenCalledWith(
      "learner@example.com", "password123",
      expect.objectContaining({ countryCode: "NG", phone: "+2348031234567", emergencyContactPhone: "+2349021234567" }),
    ));
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
    await waitFor(() => expect(mockSignup).toHaveBeenCalledWith("learner@example.com", "password123", expect.objectContaining({ program: "german", className: "A1 Test Class", phone: "+233241234567", address: "12 Test Street", location: "Accra", countryCode: "GH", country: "Ghana", learningMode: "Online", emergencyContactPhone: "+233209876543", paymentStatus: "pending", initialPaymentAmount: 0, trialStatus: "active" })));
  });
  it("recognizes Hamburg invitation and registers without trial, payment or a manual code", async () => {
    window.history.replaceState({}, "", "/signup?invite=UH-KISWAHILI-A1&program=german&level=B1");
    render(<SignUpPage />);
    await fillAccount();
    await userEvent.click(screen.getByRole("button", { name: /Continue to your learning/ }));
    expect(screen.getByText(/University of Hamburg · Kiswahili A1/)).toBeVisible();
    expect(screen.getByRole("combobox", { name: /Which language/ })).toHaveValue("swahili");
    expect(screen.getByRole("combobox", { name: /Which language/ })).toBeDisabled();
    expect(screen.queryByRole("option", { name: "German" })).toBeNull();
    expect(screen.queryByRole("button", { name: /Pay full fee now/ })).toBeNull();
    await userEvent.click(screen.getByRole("button", { name: /Continue to contact details/ }));
    await fillContact();
    await userEvent.type(screen.getByLabelText("Emergency contact phone"), "+233209876543");
    await userEvent.click(screen.getByRole("checkbox"));
    await userEvent.click(screen.getByRole("button", { name: /Register for complimentary course access/ }));
    await waitFor(() => expect(mockSignup).toHaveBeenCalledWith(
      "learner@example.com", "password123",
      expect.objectContaining({
        program: "swahili", level: "A1", className: "", universityInvitationCode: "UH-KISWAHILI-A1",
        status: "registered", trialStatus: "not_applicable",
        tuitionFee: null, balanceDue: null, paystackLink: "", paymentIntentAmount: null,
      }),
    ));
    expect(await screen.findByText(/awaiting instructor verification/i)).toBeVisible();
    window.history.replaceState({}, "", "/");
  });

  it("starts the Kiswahili workbook trial without assigning German tuition or a cohort", async () => {
    render(<SignUpPage />);
    await fillAccount();
    await userEvent.click(screen.getByRole("button", { name: /Continue to your learning/ }));
    const language = screen.getByRole("combobox", { name: /Which language/ });
    expect(language).toHaveValue("german");
    await userEvent.click(screen.getByRole("button", { name: /Pay full fee now/ }));
    await userEvent.selectOptions(language, "swahili");
    expect(screen.queryByRole("button", { name: /Pay full fee now|A1 Test Class/ })).toBeNull();
    await userEvent.click(screen.getByRole("button", { name: /Continue to contact details/ }));
    await fillContact();
    await userEvent.type(screen.getByLabelText("Emergency contact phone"), "+233209876543");
    await userEvent.click(screen.getByRole("checkbox"));
    await userEvent.click(screen.getByRole("button", { name: "Create account & start 7-day trial" }));
    await waitFor(() => expect(mockSignup).toHaveBeenCalledWith("learner@example.com", "password123",
      expect.objectContaining({ program: "swahili", level: "A1", className: "", learningMode: "Online",
        tuitionFee: null, balanceDue: null, paystackLink: "", paymentIntentAmount: null, trialStatus: "active" })));
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
