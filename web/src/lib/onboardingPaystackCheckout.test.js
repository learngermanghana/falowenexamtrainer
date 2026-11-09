import { getRecommendedTuitionAmount, initializeOnboardingPaystackCheckout } from "./onboardingPaystackCheckout";
import { paymentAttemptKey } from "./paymentAttempt";

const profile = {
  studentCode: "AmaLearner456",
  level: "A1",
  tuitionFee: 3000,
  balanceDue: 3000,
  paymentStatus: "pending",
  initialPaymentAmount: 0,
};

beforeEach(() => { window.localStorage.clear(); });

it("recommends the actual tuition balance, or the valid chosen part-payment", () => {
  expect(getRecommendedTuitionAmount(profile)).toBe(3000);
  expect(getRecommendedTuitionAmount({ ...profile, paymentIntentAmount: 2000 })).toBe(2000);
  expect(getRecommendedTuitionAmount({ ...profile, paymentIntentAmount: 300 })).toBe(3000);
  expect(getRecommendedTuitionAmount({ ...profile, balanceDue: 1000, initialPaymentAmount: 2000 })).toBe(1000);
});

it("initializes Paystack using the signed-in student's token and balance without recording a sale", async () => {
  const fetchImpl = jest.fn().mockResolvedValue({
    ok: true,
    json: async () => ({
      ok: true,
      authorization_url: "https://checkout.paystack.com/test-reference",
      reference: "test-reference",
    }),
  });
  const url = await initializeOnboardingPaystackCheckout({
    studentProfile: profile,
    idToken: "firebase-test-id-token",
    fetchImpl,
    origin: "https://www.falowen.app",
  });
  expect(url).toBe("https://checkout.paystack.com/test-reference");
  expect(fetchImpl).toHaveBeenCalledWith("https://www.falowen.app/api/paystack/initialize", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer firebase-test-id-token",
    },
    body: JSON.stringify({
      studentCode: "AmaLearner456",
      amount: 3000,
      purpose: "balance",
      redirectUrl: "https://www.falowen.app/payment-complete",
    }),
  });
  const localAttempt = JSON.parse(window.localStorage.getItem(paymentAttemptKey(profile)));
  expect(localAttempt.amount).toBe(3000);
  expect(localAttempt.status).toBe("pending");
});

it("does not initialize a second payment for a settled balance", async () => {
  const fetchImpl = jest.fn();
  await expect(initializeOnboardingPaystackCheckout({
    studentProfile: { ...profile, balanceDue: 0, paymentStatus: "paid" },
    idToken: "token",
    fetchImpl,
  })).rejects.toThrow(/balance is unavailable/);
  expect(fetchImpl).not.toHaveBeenCalled();
});

it("fails visibly if Firebase authentication is missing", async () => {
  const fetchImpl = jest.fn();
  await expect(initializeOnboardingPaystackCheckout({
    studentProfile: profile,
    idToken: "",
    fetchImpl,
  })).rejects.toThrow(/login session/);
  expect(fetchImpl).not.toHaveBeenCalled();
});

it("preserves the backend's Paystack error instead of navigating away", async () => {
  const fetchImpl = jest.fn().mockResolvedValue({
    ok: false,
    json: async () => ({ error: "Minimum payment is GH₵2000" }),
  });
  await expect(initializeOnboardingPaystackCheckout({
    studentProfile: profile,
    idToken: "token",
    fetchImpl,
    origin: "https://www.falowen.app",
  })).rejects.toThrow("Minimum payment is GH₵2000");
  expect(window.localStorage.getItem(paymentAttemptKey(profile))).toBeNull();
});

it.each([
  "javascript:alert(1)",
  "https://fake-paystack.com/pay",
  "http://checkout.paystack.com/test",
  "",
])("refuses an unsafe or missing checkout link: %s", async (authorization_url) => {
  const fetchImpl = jest.fn().mockResolvedValue({
    ok: true, json: async () => ({ authorization_url }),
  });
  await expect(initializeOnboardingPaystackCheckout({
    studentProfile: profile, idToken: "token", fetchImpl,
  })).rejects.toThrow(/checkout link|checkout address/);
});
