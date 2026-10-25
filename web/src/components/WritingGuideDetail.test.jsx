import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import WritingGuideDetail from "./WritingGuideDetail";

const book = { id: "writing-skills-a1-c2-digital", priceGhs: 39, format: "digital" };

describe("A1–C2 writing guide product page and shopping cart", () => {
  test("displays GHS with optional USD estimate and adds one digital copy", () => {
    const add = jest.fn();
    const buy = jest.fn();
    render(<WritingGuideDetail book={book} onAddToCart={add} onBuyNow={buy}
      enabled={true} fxQuote={{ usdToGhs: 13 }} added="" />);
    expect(screen.getByText("GH₵39.00")).toBeInTheDocument();
    expect(screen.getByText(/≈ \$3.00 USD · indicative only/)).toBeInTheDocument();
    expect(screen.getByText(/Your PDF is arranged manually after confirmation/)).toBeInTheDocument();
    expect(screen.getByText(/This preview uses short excerpts/)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Add digital guide to cart" }));
    expect(add).toHaveBeenCalledWith(book, 1);
    fireEvent.click(screen.getByRole("button", { name: /Buy now · GH₵39.00/ }));
    expect(buy).toHaveBeenCalledWith(book, 1);
  });
  test("does not permit buy-now when backend payments are disabled", () => {
    render(<WritingGuideDetail book={book} onAddToCart={jest.fn()}
      onBuyNow={jest.fn()} enabled={false} fxQuote={null} added="" />);
    expect(screen.getByRole("button", { name: /Checkout temporarily unavailable/ })).toBeDisabled();
    expect(screen.getByRole("button", { name: /Buy now/ })).toBeDisabled();
    expect(screen.queryByText(/≈ \$/)).not.toBeInTheDocument();
  });
});
