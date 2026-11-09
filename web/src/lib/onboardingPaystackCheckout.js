import { computeTuitionStatus, MIN_INSTALLMENT_GHS } from "../data/levelFees";
import { savePaymentAttempt } from "./paymentAttempt";

// Mirrors the authenticated /api/paystack/initialize contract used by Account & Billing.
// Never mark tuition paid here: only the server's Paystack confirmation can do so.
export const getRecommendedTuitionAmount = (studentProfile = {}) => {
  const paidAmount = Math.max(Number(studentProfile?.paid ?? studentProfile?.initialPaymentAmount ?? 0) || 0, 0);
  const rawBalance = studentProfile?.balanceDue ?? studentProfile?.balance;
  const balanceDue = rawBalance === undefined || rawBalance === null
    ? undefined
    : Number(rawBalance);
  const summary = computeTuitionStatus({
    level: studentProfile?.level,
    paidAmount,
    tuitionFee: studentProfile?.tuitionFee,
    balanceDue: Number.isFinite(balanceDue) ? balanceDue : undefined,
  });
  const remainingBalance = Math.max(Number(summary.balanceDue) || 0, 0);
  const intent = Number(studentProfile?.paymentIntentAmount);
  const validIntent = Number.isFinite(intent) &&
    intent > 0 &&
    intent <= remainingBalance &&
    (intent >= MIN_INSTALLMENT_GHS || Math.abs(intent - remainingBalance) < 0.5);
  return validIntent ? intent : remainingBalance;
};

export const initializeOnboardingPaystackCheckout = async ({
  studentProfile = {},
  idToken = "",
  user = null,
  fetchImpl = fetch,
  origin = window.location.origin,
}) => {
  const studentCode = studentProfile?.studentCode ||
    studentProfile?.studentcode ||
    studentProfile?.id ||
    user?.uid ||
    "";
  if (!studentCode) {
    throw new Error("Missing student code. Sign in again or contact Falowen support.");
  }
  if (!idToken) {
    throw new Error("Your login session is missing. Refresh the page and try again.");
  }
  const amount = getRecommendedTuitionAmount(studentProfile);
  if (!Number.isFinite(amount) || amount <= 0) {
    throw new Error("Your tuition balance is unavailable. Please open Account & Billing.");
  }

  const result = await fetchImpl(origin + "/api/paystack/initialize", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + idToken,
    },
    body: JSON.stringify({
      studentCode,
      amount,
      purpose: "balance",
      redirectUrl: origin + "/payment-complete",
    }),
  });

  const payload = await result.json().catch(() => ({}));
  if (!result.ok) {
    throw new Error(payload?.error || "Paystack checkout could not be initialized.");
  }
  const rawUrl = String(payload?.authorization_url || "").trim();
  let checkoutUrl;
  try {
    checkoutUrl = new URL(rawUrl);
  } catch (_error) {
    throw new Error("Paystack did not return a valid checkout link.");
  }
  // A checkout link must be a Paystack HTTPS destination, never an arbitrary redirect.
  const host = checkoutUrl.hostname.toLowerCase();
  const approved = host === "paystack.com" || host.endsWith(".paystack.com") ||
    host === "paystack.co" || host.endsWith(".paystack.co");
  if (checkoutUrl.protocol !== "https:" || !approved ||
      checkoutUrl.username || checkoutUrl.password) {
    throw new Error("Paystack returned an unexpected checkout address.");
  }

  try {
    savePaymentAttempt(studentProfile, {
      amount,
      startedAt: new Date().toISOString(),
    });
  } catch (_storageError) {
    // Optional local payment indicator should never block secure checkout.
  }
  return checkoutUrl.toString();
};

export const redirectToPaystackCheckout = (checkoutUrl) => {
  window.location.assign(checkoutUrl);
};
