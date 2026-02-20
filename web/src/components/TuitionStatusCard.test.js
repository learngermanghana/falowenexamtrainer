import { render, screen } from "@testing-library/react";
import i18n from "../i18n";
import { formatCurrency } from "../lib/formatters";
import TuitionStatusCard from "./TuitionStatusCard";

let authMockState = {
  idToken: "test-token",
  studentProfile: { studentCode: "TestStudent123", paymentIntentAmount: null },
  user: { uid: "uid123", email: "test@example.com" },
};

jest.mock("../context/AuthContext", () => ({
  useAuth: () => authMockState,
}));

describe("TuitionStatusCard", () => {
  const originalPaymentsFlag = process.env.REACT_APP_ENABLE_PAYMENTS;
  const locale = i18n.language;
  const formatMoney = (value) => formatCurrency(value, { locale, maximumFractionDigits: 0 });

  afterEach(() => {
    process.env.REACT_APP_ENABLE_PAYMENTS = originalPaymentsFlag;
    authMockState = {
      idToken: "test-token",
      studentProfile: { studentCode: "TestStudent123", paymentIntentAmount: null },
      user: { uid: "uid123", email: "test@example.com" },
    };
  });

  it("shows paid state with full balance cleared", () => {
    render(<TuitionStatusCard level="A1" paidAmount={2800} tuitionFee={2800} />);

    expect(screen.getByText("Paid")).toBeInTheDocument();
    expect(screen.getAllByText(formatMoney(2800))).toHaveLength(2);
    expect(screen.getByText(formatMoney(0))).toBeInTheDocument();
  });

  it("renders partial state snapshot with balance and payment controls", () => {
    render(<TuitionStatusCard level="B1" paidAmount={500} tuitionFee={3000} balanceDue={2500} />);

    expect(screen.getByRole("button", { name: /pay tuition online/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/amount to pay now/i)).toBeInTheDocument();

    const cardText = screen.getByTestId("tuition-status-card").textContent;

    expect(cardText).toContain("Balance & tuition");
    expect(cardText).toContain("Partial");
    expect(cardText).toContain(formatMoney(3000));
    expect(cardText).toContain(formatMoney(500));
    expect(cardText).toContain(formatMoney(2500));
    expect(cardText).toContain("Pay tuition online");
  });

  it("shows 7-day payment countdown notice for unpaid students", () => {
    const sixDaysAgo = new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString();
    authMockState = {
      ...authMockState,
      studentProfile: {
        ...authMockState.studentProfile,
        paymentStatus: "pending",
        joined_at: sixDaysAgo,
      },
    };

    render(<TuitionStatusCard level="B1" paidAmount={0} tuitionFee={3000} balanceDue={3000} />);

    expect(screen.getByText(/payment window: 1 day left/i)).toBeInTheDocument();
    expect(screen.getByText(/your student data will be deleted after 7 days/i)).toBeInTheDocument();
  });

  it("hides Paystack checkout when payments are disabled", () => {
    process.env.REACT_APP_ENABLE_PAYMENTS = "false";

    render(<TuitionStatusCard level="B2" paidAmount={1000} tuitionFee={4000} balanceDue={3000} />);

    expect(screen.queryByRole("button", { name: /pay tuition online/i })).not.toBeInTheDocument();
    expect(screen.getByText(/payments are only available on the web app/i)).toBeInTheDocument();
  });
});
