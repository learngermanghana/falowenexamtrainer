import React from "react";
import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes, useLocation } from "react-router-dom";
import OnboardingChecklist from "./OnboardingChecklist";
import OnboardingStudyBuddyStart from "./OnboardingStudyBuddyStart";
import StudyBuddyBar from "./StudyBuddyBar";
import "../i18n";

jest.mock("../context/AuthContext", () => ({ useAuth: () => ({ user: { uid: "new-learner" }, logout: jest.fn() }) }));
jest.mock("../context/ToastContext", () => ({ useToast: () => ({ showToast: jest.fn() }) }));
jest.mock("../services/studyBuddyService", () => ({
  readStudyBuddyConversationHistory: () => [],
  logStudyBuddyUsage: jest.fn().mockResolvedValue(undefined),
  clearStudyBuddyConversationHistory: jest.fn(),
  requestStudyBuddyReply: jest.fn(),
}));

const profile = { level: "A1", paymentStatus: "paid", balanceDue: 0 };
function Home() {
  const location = useLocation();
  return <>
    {new URLSearchParams(location.search).get("welcome") === "1" && <OnboardingStudyBuddyStart orientationPath="/campus/course/lesson/A1/0" />}
    <StudyBuddyBar studentProfile={profile} />
  </>;
}

test("hiding onboarding chat leaves starting actions and Course Book navigation", async () => {
  const save = jest.fn().mockResolvedValue(undefined);
  render(<MemoryRouter initialEntries={["/onboarding"]}><Routes>
    <Route path="/onboarding" element={<OnboardingChecklist studentProfile={profile} onSaveOnboarding={save} />} />
    <Route path="/" element={<Home />} />
    <Route path="/campus/course" element={<h1>Course Book lessons</h1>} />
  </Routes></MemoryRouter>);
  await userEvent.click(screen.getByText("Where can I get help?"));
  await act(async () => { await userEvent.click(screen.getByRole("button", { name: "Ask Study Buddy" })); });
  expect(save).toHaveBeenCalledTimes(1);
  expect(await screen.findByRole("region", { name: "Your next step in Falowen" })).toBeInTheDocument();
  await waitFor(() => expect(document.body.querySelector(".study-buddy-bar")).toBeInTheDocument());
  await userEvent.click(screen.getByRole("button", { name: /hide bar/i }));
  expect(document.body.querySelector(".study-buddy-bar")).not.toBeInTheDocument();
  expect(screen.getByRole("link", { name: "Start Orientation" })).toHaveAttribute("href", "/campus/course/lesson/A1/0");
  await userEvent.click(screen.getByRole("link", { name: "Open Course Book" }));
  expect(screen.getByRole("heading", { name: "Course Book lessons" })).toBeInTheDocument();
});

test("welcome actions remain available on refresh after the chat flag is removed", () => {
  render(<MemoryRouter initialEntries={["/?welcome=1"]}><Home /></MemoryRouter>);
  expect(screen.getByRole("link", { name: "Open Course Book" })).toHaveAttribute("href", "/campus/course");
  expect(document.body.querySelector(".study-buddy-bar")).not.toBeInTheDocument();
});
