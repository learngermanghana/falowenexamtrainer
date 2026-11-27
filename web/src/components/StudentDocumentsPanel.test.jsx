import React from "react";
import { render, screen, fireEvent, waitFor, cleanup } from "@testing-library/react";
import StudentDocumentsPanel from "./StudentDocumentsPanel";
import { getActionCodeSettings, reload, sendEmailVerification } from "../firebase";

jest.mock("../firebase", () => ({
  getActionCodeSettings: jest.fn(() => ({ url: "https://www.falowen.app", handleCodeInApp: false })),
  reload: jest.fn(),
  sendEmailVerification: jest.fn(),
}));
jest.mock("../services/backendUrl", () => ({ getBackendUrl: () => "https://example.com/api" }));

afterEach(() => {
  cleanup();
  jest.clearAllMocks();
});

test("unverified learners can request a verification email and refresh the server token", async () => {
  const user = {
    uid: "learner-1", email: "student@example.com", emailVerified: false,
    getIdToken: jest.fn().mockResolvedValue("fresh-token"),
  };
  sendEmailVerification.mockResolvedValue(undefined);
  reload.mockImplementation(async (currentUser) => {
    currentUser.emailVerified = true;
  });
  render(<StudentDocumentsPanel user={user} studentProfile={{ level: "A1" }} />);

  const transcript = screen.getByRole("button", { name: "Download transcript PDF" });
  expect(transcript).toBeDisabled();
  expect(screen.getByRole("button", { name: "Check & download certificate" })).toBeDisabled();

  fireEvent.click(screen.getByRole("button", { name: "Send verification email" }));
  await waitFor(() => expect(sendEmailVerification).toHaveBeenCalledWith(user, getActionCodeSettings()));
  expect(await screen.findByText(/Verification email sent to student@example.com/)).toBeInTheDocument();

  fireEvent.click(screen.getByRole("button", { name: /I've verified my email/i }));
  await waitFor(() => expect(user.getIdToken).toHaveBeenCalledWith(true));
  await waitFor(() => expect(transcript).not.toBeDisabled());
  expect(screen.getByText(/Email verified — school documents/)).toBeInTheDocument();
});

test("unverified learners cannot download documents without completing verification", async () => {
  const user = {
    uid: "learner-2", email: "student@example.com", emailVerified: false,
    getIdToken: jest.fn(),
  };
  reload.mockResolvedValue(undefined);
  render(<StudentDocumentsPanel user={user} studentProfile={{ level: "A2" }} />);
  fireEvent.click(screen.getByRole("button", { name: /I've verified my email/i }));
  expect(await screen.findByText(/not verified yet/)).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Download transcript PDF" })).toBeDisabled();
});

 test("trial learners see the reason and all six download actions are disabled", () => {
  render(<StudentDocumentsPanel user={{uid:"trial",emailVerified:true}} studentProfile={{level:"A1",trialStatus:"active",paid:0}} />);
  expect(screen.getByRole("alert")).toHaveTextContent(/free trial/i);
  expect(screen.getAllByRole("button", {name:/download/i})).toHaveLength(6);
  screen.getAllByRole("button", {name:/download/i}).forEach(button => expect(button).toBeDisabled());
 });
