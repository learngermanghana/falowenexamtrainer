import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import CourseDiscountPage from "./CourseDiscountPage";
import { startTuitionPaystackCheckout, redirectToPaystackCheckout } from "../lib/onboardingPaystackCheckout";

jest.mock("../lib/onboardingPaystackCheckout", () => ({
  startTuitionPaystackCheckout: jest.fn(),
  redirectToPaystackCheckout: jest.fn(),
}));
jest.mock("../lib/featureFlags", () => ({ isPaymentsEnabled: () => true }));

const offer = { id: "offer-id", program: "german", level: "A2", original: 3000, discount: 750, total: 2250 };
const code = "1".repeat(24);
const response = body => ({ ok: true, json: async () => body });
const stub = {
  code,
  renderSignup: quote => <span>Signup offer {quote.level}</span>,
  renderLogin: () => <span>Existing student sign-in</span>,
  onExit: jest.fn(),
};
let originalFetch;
beforeEach(() => { originalFetch = global.fetch; });
afterEach(() => { global.fetch = originalFetch; jest.clearAllMocks(); });

test("shows the offer before signup or sign-in", async () => {
  global.fetch = jest.fn().mockResolvedValue(response({ offer }));
  const { unmount } = render(<CourseDiscountPage {...stub} />);
  expect(await screen.findByText("German · A2")).toBeTruthy();
  fireEvent.click(screen.getByRole("button", { name: "Create account with this offer" }));
  expect(screen.getByText("Signup offer A2")).toBeTruthy();
  unmount();
  render(<CourseDiscountPage {...stub} />);
  fireEvent.click(await screen.findByRole("button", { name: "Sign in to use this offer" }));
  expect(screen.getByText("Existing student sign-in")).toBeTruthy();
});

test("claims the server-calculated price and opens a checkout for the selected installment", async () => {
  const user = { getIdToken: async () => "test-token" };
  const student = { studentCode: "STUDENT" };
  global.fetch = jest.fn().mockResolvedValue(response({ offer, balanceDue: 2250 }));
  startTuitionPaystackCheckout.mockResolvedValue("https://checkout.paystack.com/test");
  render(<CourseDiscountPage {...stub} user={user} student={student} />);
  fireEvent.click(await screen.findByRole("checkbox", { name: /installment/ }));
  fireEvent.click(screen.getByRole("button", { name: /^Pay / }));
  await waitFor(() => expect(redirectToPaystackCheckout).toHaveBeenCalled());
  expect(global.fetch).toHaveBeenCalledWith("/api/course-discounts/" + code + "/claim", {
    method: "POST", headers: { "Content-Type": "application/json", Authorization: "Bearer test-token" },
    body: JSON.stringify({ studentCode: "STUDENT" }),
  });
  expect(startTuitionPaystackCheckout).toHaveBeenCalledWith({ studentProfile: student, idToken: "test-token", user, amount: 2000 });
});
