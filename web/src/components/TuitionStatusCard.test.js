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
    expect(screen.getAllByText("GH₵2800")).toHaveLength(2);
    expect(screen.getByText("GH₵0")).toBeInTheDocument();
  });

  it("renders partial state snapshot with balance and link", () => {
    render(<TuitionStatusCard level="B1" paidAmount={500} tuitionFee={3000} balanceDue={2500} />);

    expect(screen.getByRole("link", { name: /pay tuition online/i })).toHaveAttribute(
      "href",
      "https://paystack.shop/pay/1navy7uihs"
    );
    const cardText = screen.getByTestId("tuition-status-card").textContent;

    expect(cardText).toContain("Tuition & payments");
    expect(cardText).toContain("Partial tuition received");
    expect(cardText).toContain("GH₵3000");
    expect(cardText).toContain("GH₵500");
    expect(cardText).toContain("GH₵2500");
    expect(cardText).toContain("Pay tuition online");
  });

  it("hides Paystack checkout when payments are disabled", () => {
    process.env.REACT_APP_ENABLE_PAYMENTS = "false";

    render(<TuitionStatusCard level="B2" paidAmount={1000} tuitionFee={4000} balanceDue={3000} />);

    expect(screen.queryByRole("link", { name: /pay tuition online/i })).not.toBeInTheDocument();
    expect(screen.getByText(/payments are only available on the web app/i)).toBeInTheDocument();
  });
});
