import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import OnboardingChecklist from "./OnboardingChecklist";

jest.mock("../context/ToastContext", () => ({
  useToast: () => ({ showToast: jest.fn() }),
}));

jest.mock("../lib/publicFunnelTracking", () => ({
  getPublicFunnelContext: () => ({}),
  trackPublicFunnelEvent: jest.fn(),
}));

jest.mock("./SetupCheckpoint", () => () => (
  <div data-testid="payment-checkpoint">Payment required</div>
));

jest.mock("./YouTubeSubscribeButton", () => () => null);

const renderChecklist = (studentProfile) =>
  render(
    <MemoryRouter>
      <OnboardingChecklist studentProfile={studentProfile} onSaveOnboarding={jest.fn()} />
    </MemoryRouter>
  );

describe("OnboardingChecklist payment gate", () => {
  it("keeps an unpaid student on the payment checkpoint", () => {
    renderChecklist({ level: "A1", paymentStatus: "pending", balanceDue: 3000 });

    expect(screen.getByTestId("payment-checkpoint")).toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: /watch this before your dashboard opens/i })
    ).not.toBeInTheDocument();
  });

  it("shows onboarding after a full payment is confirmed", () => {
    renderChecklist({ level: "A1", paymentStatus: "paid", balanceDue: 0 });

    expect(screen.queryByTestId("payment-checkpoint")).not.toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /watch this before your dashboard opens/i })
    ).toBeInTheDocument();
  });

  it("shows onboarding after an accepted partial payment", () => {
    renderChecklist({ level: "A1", paymentStatus: "partial", balanceDue: 1000 });

    expect(screen.queryByTestId("payment-checkpoint")).not.toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /watch this before your dashboard opens/i })
    ).toBeInTheDocument();
  });
});
