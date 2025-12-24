import { render, screen } from "@testing-library/react";
import TuitionStatusCard from "./TuitionStatusCard";

jest.mock("../context/AuthContext", () => ({
  useAuth: () => ({
    idToken: "test-token",
    studentProfile: { studentCode: "TestStudent123", paymentIntentAmount: null },
    user: { uid: "uid123", email: "test@example.com" },
  }),
}));

describe("TuitionStatusCard", () => {
  const originalPaymentsFlag = process.env.REACT_APP_ENABLE_PAYMENTS;

  afterEach(() => {
    process.env.REACT_APP_ENABLE_PAYMENTS = originalPaymentsFlag;
  });

  it("shows paid state with full balance cleared", () => {
    render(<TuitionStatusCard level="A1" paidAmount={2800} tuitionFee={2800} />);

    expect(screen.getByText("Paid")).toBeInTheDocument();
    expect(screen.getAllByText("GH₵2800")).toHaveLength(2);
    expect(screen.getByText("GH₵0")).toBeInTheDocument();
  });

  it("renders partial state snapshot with balance and payment controls", () => {
    render(<TuitionStatusCard level="B1" paidAmount={500} tuitionFee={3000} balanceDue={2500} />);

    expect(screen.getByRole("button", { name: /pay tuition online/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/amount to pay now/i)).toBeInTheDocument();

    const cardText = screen.getByTestId("tuition-status-card").textContent;

    expect(cardText).toContain("Balance & tuition");
    expect(cardText).toContain("Partial");
    expect(cardText).toContain("GH₵3000");
    expect(cardText).toContain("GH₵500");
    expect(cardText).toContain("GH₵2500");
    expect(cardText).toContain("Pay tuition online");
  });

  it("hides Paystack checkout when payments are disabled", () => {
    process.env.REACT_APP_ENABLE_PAYMENTS = "false";

    render(<TuitionStatusCard level="B2" paidAmount={1000} tuitionFee={4000} balanceDue={3000} />);

    expect(screen.queryByRole("button", { name: /pay tuition online/i })).not.toBeInTheDocument();
    expect(screen.getByText(/payments are only available on the web app/i)).toBeInTheDocument();
  });
});
