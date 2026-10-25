import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import WritingGuideDetail from "./WritingGuideDetail";

const book = { id: "writing-skills-a1-c2-digital", priceGhs: 39, format: "digital" };
const customer = { name: "", email: "", phone: "" };

describe("A1–C2 writing guide independent checkout panel", () => {
  test("uses GHS Paystack price and clearly explains manual PDF delivery", () => {
    const checkout = jest.fn(event => event.preventDefault());
    render(<WritingGuideDetail book={book} customer={customer} onCustomerChange={jest.fn()}
      onCheckout={checkout} enabled={true} busy={false} fxQuote={{ usdToGhs: 13 }} error="" />);
    expect(screen.getByText("GH₵39.00")).toBeInTheDocument();
    expect(screen.getByText(/≈ \$3.00 USD · indicative only/)).toBeInTheDocument();
    expect(screen.getByText(/Your PDF is arranged manually after confirmation/)).toBeInTheDocument();
    expect(screen.getByText(/This preview uses short excerpts/)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Continue to Paystack · GH₵39.00/ })).toBeEnabled();
    fireEvent.change(screen.getByLabelText("Full name"), { target: { value: "Example Buyer" } });
    expect(screen.getByLabelText("Full name")).toBeInTheDocument();
    expect(checkout).not.toHaveBeenCalled();
  });
  test("does not allow checkout when the backend disables payments", () => {
    render(<WritingGuideDetail book={book} customer={customer} onCustomerChange={jest.fn()}
      onCheckout={jest.fn()} enabled={false} busy={false} fxQuote={null} error="" />);
    expect(screen.getByRole("button", { name: /Checkout temporarily unavailable/ })).toBeDisabled();
    expect(screen.queryByText(/≈ \$/)).not.toBeInTheDocument();
  });
});
