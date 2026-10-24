import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import StudyBuddyNavigationActions from "./StudyBuddyNavigationActions";
import { getStudyBuddyNavigationActions, resolveStudyBuddyNavigationReply } from "../services/studyBuddyNavigation";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import StudyBuddyBar from "./StudyBuddyBar";
import "../i18n";

jest.mock("../context/AuthContext", () => ({ useAuth: () => ({ user: { uid: "actions-test" } }) }));
jest.mock("../services/studyBuddyService", () => ({
  readStudyBuddyConversationHistory: () => [{ role: "assistant", content: "Open https://www.falowen.app/campus/results." }],
  logStudyBuddyUsage: jest.fn().mockResolvedValue(undefined),
  clearStudyBuddyConversationHistory: jest.fn(),
  requestStudyBuddyReply: jest.fn(),
}));

test("offers a labelled action for official destinations without duplicate buttons", async () => {
  const navigate = jest.fn();
  render(<StudyBuddyNavigationActions content="Open https://www.falowen.app/campus/results. Again: https://falowen.app/campus/results." onNavigate={navigate} />);
  expect(screen.getAllByRole("button")).toHaveLength(1);
  await userEvent.click(screen.getByRole("button", { name: "View Results" }));
  expect(navigate).toHaveBeenCalledWith("/campus/results");
});
test("does not offer external, unknown or altered destination actions", () => {
  expect(getStudyBuddyNavigationActions("https://evil.example/campus/results https://www.falowen.app/unknown https://www.falowen.app/campus/results?redirect=evil")).toEqual([]);
  expect(getStudyBuddyNavigationActions("https://www.falowen.app/campus/account?tab=billing.")).toEqual([{ label: "Go to Billing", path: "/campus/account?tab=billing" }]);
});
test("payment recovery explains verification before another payment", () => {
  const answer = resolveStudyBuddyNavigationReply("My payment is pending");
  expect(answer.destination).toBe("billing");
  expect(answer.reply).toContain("before paying again");
  expect(answer.reply).toContain("cannot verify your private payment status");
});
test("missing mocks do not promise unpublished availability", () => {
  const answer = resolveStudyBuddyNavigationReply("I can't find mock 3");
  expect(answer.destination).toBe("exams");
  expect(answer.reply).toContain("Only published mocks appear");
});
test("the chat action closes the overlay and opens its destination", async () => {
  render(<MemoryRouter initialEntries={["/"]}>
    <StudyBuddyBar studentProfile={{}} />
    <Routes><Route path="/" element={<h1>Home</h1>} /><Route path="/campus/results" element={<h1>Results page</h1>} /></Routes>
  </MemoryRouter>);
  await userEvent.click(screen.getByRole("button", { name: /reopen study buddy bar/i }));
  await userEvent.click(screen.getByRole("button", { name: /show details/i }));
  await userEvent.click(screen.getByRole("button", { name: "View Results" }));
  expect(screen.getByRole("heading", { name: "Results page" })).toBeInTheDocument();
  expect(document.body.querySelector(".study-buddy-bar")).not.toBeInTheDocument();
});
