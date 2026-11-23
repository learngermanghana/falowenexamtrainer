import { shouldOfferTuitionPayment } from "./tuitionPaymentVisibility";

describe("student billing checkout visibility", () => {
  test.each([
    [{ balanceDue: 3000, paymentCleared: false }, true],
    [{ balanceDue: 1000, paymentCleared: false }, true],
    [{ balanceDue: "250", paymentCleared: false }, true],
    [{ balanceDue: 0, paymentCleared: false }, false],
    [{ balanceDue: 0, paymentCleared: true }, false],
    [{ balanceDue: 1000, paymentCleared: true }, false],
    [{ balanceDue: -15, paymentCleared: false }, false],
    [{ balanceDue: null, paymentCleared: false }, false],
    [{ balanceDue: undefined, paymentCleared: false }, false],
    [{ balanceDue: "not available", paymentCleared: false }, false],
  ])("returns %s for balance and confirmation state %p", (billing, expected) => {
    expect(shouldOfferTuitionPayment(billing)).toBe(expected);
  });
});
