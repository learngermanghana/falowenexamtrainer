import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import OnboardingChecklist from "./OnboardingChecklist";

const mockNavigate = jest.fn();
const mockSave = jest.fn();
const mockToast = jest.fn();
const mockInitializeCheckout = jest.fn();
const mockRedirectToCheckout = jest.fn();

jest.mock("react-router-dom", () => ({ useNavigate: () => mockNavigate }));
jest.mock("../context/AuthContext", () => ({ useAuth: () => ({ logout: jest.fn(), idToken: "firebase-token", user: { uid: "uid-1" } }) }));
jest.mock("../lib/onboardingPaystackCheckout", () => ({
  getRecommendedTuitionAmount: () => 3000,
  initializeOnboardingPaystackCheckout: (...args) => mockInitializeCheckout(...args),
  redirectToPaystackCheckout: (...args) => mockRedirectToCheckout(...args),
}));
jest.mock("../context/ToastContext", () => ({ useToast: () => ({ showToast: mockToast }) }));

const profile = {
  name: "Ama Learner",
  level: "A1",
  balanceDue: 3000,
  paymentStatus: "pending",
  trialStartedAt: new Date().toISOString(),
  trialEndsAt: new Date(Date.now() + 7 * 86400000).toISOString(),
};

beforeEach(() => {
  jest.clearAllMocks();
  mockInitializeCheckout.mockResolvedValue("https://checkout.paystack.com/test-reference");
  mockSave.mockResolvedValue({});
});

it("shows only two next-step choices and the requested Campus explanation", async () => {
  render(<OnboardingChecklist studentProfile={profile} onSaveOnboarding={mockSave} />);

  expect(screen.getByRole("button", { name: "Pay now" })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Start 7-day trial" })).toBeInTheDocument();
  expect(screen.getByText(/you'll see two main options/)).toHaveTextContent("Campus");
  expect(screen.getByText(/For now, select/)).toHaveTextContent("Campus");
  expect(screen.getByText(/scroll down to find your course lessons/)).toHaveTextContent("Day 1");
  expect(screen.getByText(/Starting early is optional/)).toBeInTheDocument();
  expect(screen.queryByRole("button", { name: /Start Day 1|Ask Study Buddy|Replay registration|Reset demo/ })).not.toBeInTheDocument();

  fireEvent.click(screen.getByRole("button", { name: "Start 7-day trial" }));
  await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith("/", { replace: true }));
  expect(mockSave).toHaveBeenCalledTimes(1);
});

it("opens the actual Paystack initialization path from the visible welcome button", async () => {
  render(<OnboardingChecklist studentProfile={profile} onSaveOnboarding={mockSave} />);
  expect(screen.getByTestId("onboarding-pay-now")).toBeVisible();
  expect(screen.getByText(/Pay securely with Paystack/)).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "Pay now" }));
  await waitFor(() => expect(mockInitializeCheckout).toHaveBeenCalledWith({
    studentProfile: profile,
    idToken: "firebase-token",
    user: { uid: "uid-1" },
  }));
  await waitFor(() => expect(mockRedirectToCheckout).toHaveBeenCalledWith("https://checkout.paystack.com/test-reference"));
  expect(mockSave).toHaveBeenCalledTimes(1);
});

it("shows a helpful message and billing alternative when checkout fails", async () => {
  mockInitializeCheckout.mockRejectedValueOnce(new Error("Paystack is temporarily unavailable."));
  const spy = jest.spyOn(console, "error").mockImplementation(() => {});
  render(<OnboardingChecklist studentProfile={profile} onSaveOnboarding={mockSave} />);
  fireEvent.click(screen.getByRole("button", { name: "Pay now" }));
  expect(await screen.findByRole("alert")).toHaveTextContent("Paystack is temporarily unavailable.");
  expect(screen.getByRole("button", { name: "Open Account & Billing" })).toBeInTheDocument();
  expect(mockRedirectToCheckout).not.toHaveBeenCalled();
  expect(mockSave).not.toHaveBeenCalled();
  spy.mockRestore();
});

it.each(["B2", "C1", "C2"])("explains self-learning instead of an official class start date for %s", level => {
  render(<OnboardingChecklist studentProfile={{ ...profile, level }} onSaveOnboarding={mockSave} />);
  expect(screen.getByText(/This is a self-learning course/)).toBeInTheDocument();
  expect(screen.queryByText(/official class start date/)).not.toBeInTheDocument();
});

it("does not offer a new trial or another payment when tuition is confirmed paid", async () => {
  render(<OnboardingChecklist studentProfile={{ ...profile, paymentStatus: "paid", balanceDue: 0 }} onSaveOnboarding={mockSave} />);
  expect(screen.queryByRole("button", { name: "Pay now" })).not.toBeInTheDocument();
  expect(screen.queryByRole("button", { name: "Start 7-day trial" })).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "Continue to Falowen" }));
  await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith("/", { replace: true }));
});

it("does not navigate or claim setup succeeded if saving fails", async () => {
  mockSave.mockRejectedValueOnce(new Error("offline"));
  const spy = jest.spyOn(console, "error").mockImplementation(() => {});
  render(<OnboardingChecklist studentProfile={profile} onSaveOnboarding={mockSave} />);
  fireEvent.click(screen.getByRole("button", { name: "Start 7-day trial" }));
  await waitFor(() => expect(mockToast).toHaveBeenCalledWith(expect.stringContaining("could not finish"), "error"));
  expect(mockNavigate).not.toHaveBeenCalled();
  spy.mockRestore();
});
