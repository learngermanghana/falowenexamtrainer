import { render, screen } from "@testing-library/react";
import TuitionStatusCard from "./TuitionStatusCard";

describe("TuitionStatusCard", () => {
  const originalPaymentsFlag = process.env.REACT_APP_ENABLE_PAYMENTS;

  afterEach(() => {
    process.env.REACT_APP_ENABLE_PAYMENTS = originalPaymentsFlag;
  });

  it("shows paid state with full balance cleared", () => {
    render(<TuitionStatusCard level="A1" paidAmount={2800} tuitionFee={2800} />);

    expect(screen.getByText("Paid")).toBeInTheDocument();
    expect(screen.getByText("GH₵2800")).toBeInTheDocument();
    expect(screen.getByText("GH₵0")).toBeInTheDocument();
  });

  it("renders partial state snapshot with balance and link", () => {
    render(<TuitionStatusCard level="B1" paidAmount={500} tuitionFee={3000} balanceDue={2500} />);

    expect(screen.getByRole("link", { name: /pay with paystack/i })).toHaveAttribute(
      "href",
      "https://paystack.com/pay/falowen-b1"
    );
    expect(screen.getByTestId("tuition-status-card").textContent).toMatchInlineSnapshot(
      `Tuition & paymentsPartial tuition received. Tuition for B1 level is GH₵3000.PartialTuitionGH₵3000Paid so farGH₵500Balance remainingGH₵2500Pay with Paystack`
    );
  });

  it("hides Paystack checkout when payments are disabled", () => {
    process.env.REACT_APP_ENABLE_PAYMENTS = "false";

    render(<TuitionStatusCard level="B2" paidAmount={1000} tuitionFee={4000} balanceDue={3000} />);

    expect(screen.queryByRole("link", { name: /pay with paystack/i })).not.toBeInTheDocument();
    expect(screen.getByText(/payments are only available on the web app/i)).toBeInTheDocument();
  });
});
