import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import OrganisationEnrolmentPage from "./OrganisationEnrolmentPage";
import PartnershipPage from "./PartnershipPage";

const hosting = require("../../../vercel.json");
test.each(["organisation-enrolments", "referrals/apply", "referrals/claim"])("public %s submissions reach the existing backend before the generic API handler", path => {
  const match = hosting.routes.find(route => route.src && new RegExp("^" + route.src + "$").test("/api/" + path));
  expect(match.dest).toBe("https://us-central1-falowen-examiner-trainer.cloudfunctions.net/api/" + path);
  expect(match.methods).toEqual(["POST"]);
});
const originalFetch = global.fetch;
afterEach(() => { global.fetch = originalFetch; });
const show = (page, path) => render(<MemoryRouter initialEntries={[path]}>{page}</MemoryRouter>);

test("the public group form keeps its request ID and students through a failed submission", async () => {
  const requests = [];
  global.fetch = jest.fn(async (path, options) => {
    requests.push(JSON.parse(options.body));
    expect(path).toBe("/api/organisation-enrolments");
    if (requests.length === 1) throw new Error("offline");
    return { ok: true, text: async () => JSON.stringify({ ok: true, reference: "batch-test" }) };
  });
  show(<OrganisationEnrolmentPage />, "/organisation-enrolment");
  fireEvent.change(screen.getByLabelText("Organisation name"), { target: { value: "Test school" } });
  fireEvent.change(screen.getByLabelText("Student 1 Full name"), { target: { value: "Example learner" } });
  const button = screen.getByText("Submit for Falowen review");
  fireEvent.submit(button.closest("form"));
  expect(await screen.findByRole("alert")).toHaveTextContent("retry");
  fireEvent.submit(button.closest("form"));
  expect(await screen.findByText("batch-test")).toBeInTheDocument();
  expect(requests[0].requestId).toBeTruthy();
  expect(requests[1]).toEqual(requests[0]);
  expect(requests[0].students).toHaveLength(1);
});
test("institutional enrolment stays on the main domain", () => {
  show(<PartnershipPage />, "/partnerships");
  expect(screen.getByRole("link", { name: /organisation enrolment form/ })).toHaveAttribute("href", "/organisation-enrolment");
});
test("a referral link preserves the code and continues to Campus signup", async () => {
  const ref = "a".repeat(32);
  global.fetch = jest.fn(async () => ({ ok: true, text: async () => '{"ok":true}' }));
  show(<PartnershipPage />, "/partnerships?ref=" + ref);
  fireEvent.change(screen.getByLabelText("Learner email"), { target: { value: "learner@example.org" } });
  fireEvent.click(screen.getByRole("checkbox"));
  fireEvent.submit(screen.getByRole("button", { name: "Register referral" }).closest("form"));
  expect(await screen.findByText("Invitation received.")).toBeInTheDocument();
  const [path, options] = global.fetch.mock.calls[0];
  expect(path).toBe("/api/referrals/claim");
  expect(JSON.parse(options.body)).toMatchObject({ code: ref, consent: true, email: "learner@example.org" });
});
