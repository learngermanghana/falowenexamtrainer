import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import OnboardingChecklist from "./OnboardingChecklist";
const mockNavigate = jest.fn();
const mockSave = jest.fn();
const mockProfile = { name: "Ama Learner", level: "A1", tuitionFee: 3000, balanceDue: 3000, paymentStatus: "pending", trialStatus: "active", trialStartedAt: new Date().toISOString(), trialEndsAt: new Date(Date.now() + 7 * 86400000).toISOString() };
jest.mock("react-router-dom", () => ({ useNavigate: () => mockNavigate }));
jest.mock("../context/AuthContext", () => ({ useAuth: () => ({ studentProfile: mockProfile, logout: jest.fn(), saveStudentProfile: jest.fn() }) }));
jest.mock("../context/ToastContext", () => ({ useToast: () => ({ showToast: jest.fn() }) }));
beforeEach(() => { mockSave.mockReset().mockResolvedValue({}); mockNavigate.mockReset(); });
it("shows the trial end date and a skippable emergency contact reminder", () => {
  render(<OnboardingChecklist studentProfile={mockProfile} onSaveOnboarding={mockSave} />);
  expect(screen.getByRole("status")).toHaveTextContent("Your trial ends on");
  fireEvent.click(screen.getByRole("button", { name: "Add later" }));
  expect(screen.queryByRole("button", { name: "Add contact details" })).not.toBeInTheDocument();
  expect(mockSave).not.toHaveBeenCalled();
});
it("lets learners start orientation without adding emergency details or paying", async () => {
  render(<OnboardingChecklist studentProfile={mockProfile} onSaveOnboarding={mockSave} />);
  fireEvent.click(screen.getByRole("button", { name: /Start Orientation/ }));
  await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith("/campus/course/a1-day-0-orientation-and-knowledge-test-workbook", { replace: true }));
  expect(mockSave).toHaveBeenCalledTimes(1);
});
it("keeps onboarding available when completing setup fails", async () => {
  mockSave.mockRejectedValueOnce(new Error("offline"));
  const spy = jest.spyOn(console, "error").mockImplementation(() => {});
  render(<OnboardingChecklist studentProfile={mockProfile} onSaveOnboarding={mockSave} />);
  fireEvent.click(screen.getByRole("button", { name: /Start Orientation/ }));
  await waitFor(() => expect(screen.getByRole("button", { name: /Start Orientation/ })).toBeEnabled());
  expect(mockNavigate).not.toHaveBeenCalled();
  spy.mockRestore();
});
