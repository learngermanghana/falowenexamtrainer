import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import OnboardingChecklist from "./OnboardingChecklist";
const mockNavigate = jest.fn();
const mockSave = jest.fn();
const mockToast = jest.fn();
jest.mock("react-router-dom", () => ({ useNavigate: () => mockNavigate }));
jest.mock("../context/AuthContext", () => ({ useAuth: () => ({ logout: jest.fn() }) }));
jest.mock("../context/ToastContext", () => ({ useToast: () => ({ showToast: mockToast }) }));
const profile = { name: "Ama Learner", level: "A1", balanceDue: 3000, paymentStatus: "pending", trialStartedAt: new Date().toISOString(), trialEndsAt: new Date(Date.now() + 7 * 86400000).toISOString() };
beforeEach(() => { jest.clearAllMocks(); mockSave.mockResolvedValue({}); });
it("offers a single Day 1 action and a Course Book shortcut", async () => {
  render(<OnboardingChecklist studentProfile={profile} onSaveOnboarding={mockSave} />);
  expect(screen.getAllByRole("button", { name: /Start Day 1/ })).toHaveLength(1);
  expect(screen.queryByText(/Day 0|orientation/i)).not.toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Ask Study Buddy" }).closest("details")).not.toHaveAttribute("open");
  fireEvent.click(screen.getByRole("button", { name: /Start Day 1/ }));
  await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith("/campus/course/lesson/A1/1", { replace: true }));
  expect(mockSave).toHaveBeenCalledTimes(1);
});
it.each(["A2", "B1", "B2", "C1", "C2"].map(level => [level, `/campus/course/lesson/${level}/1`]))("opens the existing %s Day 1 lesson", async (level, path) => {
  render(<OnboardingChecklist studentProfile={{ ...profile, level }} onSaveOnboarding={mockSave} />);
  fireEvent.click(screen.getByRole("button", { name: /Start Day 1/ }));
  await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith(path, { replace: true }));
});
it("opens Course Book directly instead of another guide", async () => {
  render(<OnboardingChecklist studentProfile={profile} onSaveOnboarding={mockSave} />);
  fireEvent.click(screen.getByRole("button", { name: /Already familiar/ }));
  await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith("/campus/course", { replace: true }));
});
it("keeps access recovery available when the trial expires", () => {
  render(<OnboardingChecklist studentProfile={{ ...profile, trialStartedAt: "2026-01-01", trialEndsAt: "2026-01-08" }} onSaveOnboarding={mockSave} />);
  expect(screen.getByRole("button", { name: "Open billing" })).toBeInTheDocument();
});
it("does not navigate or claim setup succeeded if saving fails", async () => {
  mockSave.mockRejectedValueOnce(new Error("offline"));
  const spy = jest.spyOn(console, "error").mockImplementation(() => {});
  render(<OnboardingChecklist studentProfile={profile} onSaveOnboarding={mockSave} />);
  fireEvent.click(screen.getByRole("button", { name: /Start Day 1/ }));
  await waitFor(() => expect(mockToast).toHaveBeenCalledWith(expect.stringContaining("could not finish"), "error"));
  expect(mockNavigate).not.toHaveBeenCalled();
  spy.mockRestore();
});
