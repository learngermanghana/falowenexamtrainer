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
afterEach(() => { global.fetch = originalFetch; sessionStorage.clear(); });
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
test("one organisation programme offers signing without referral or bank fields", async () => {
  global.fetch = jest.fn(async () => ({ ok: true, text: async () => JSON.stringify({ ok: true, version: "org-v3", partnerShareRate: 0.1, shareSettlement: "invoice_deduction", terms: ["Organisation terms"] }) }));
  show(<PartnershipPage />, "/partnerships");
  expect(screen.getByRole("heading", { name: /Grow your offering/ })).toBeInTheDocument();
  expect(screen.queryByRole("heading", { name: "Referral partnerships" })).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole("tab", { name: "Agreement" }));
  expect(await screen.findByText("Organisation terms")).toBeInTheDocument();
  fireEvent.click(screen.getByRole("tab", { name: "Register" }));
  expect(screen.queryByLabelText("Account holder name")).not.toBeInTheDocument();
  expect(screen.queryByLabelText("Payment arrangement")).not.toBeInTheDocument();
});
test("the page is organisation-only even with an old referral query", () => {
  global.fetch = jest.fn(); show(<PartnershipPage />, "/partnerships?ref=" + "a".repeat(32));
  expect(screen.getAllByRole("tab")).toHaveLength(3);
  expect(document.querySelector('a[href*="signup"]')).toBeNull();
  expect(screen.queryByText("Clients paying for themselves")).not.toBeInTheDocument();
  expect(global.fetch).not.toHaveBeenCalled();
});
test("signing saves the organisation context and continues to the student-list form", async () => {
  const sent = []; global.URL.createObjectURL = jest.fn(() => "blob:receipt"); global.URL.revokeObjectURL = jest.fn();
  const anchorClick = jest.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(() => {});
  global.fetch = jest.fn(async (path, options) => {
    if (path.includes("agreement-terms")) return { ok: true, text: async () => JSON.stringify({ ok: true, version: "org-v3", partnerShareRate: 0.1, shareSettlement: "invoice_deduction", terms: ["Organisation terms"] }) };
    sent.push({ path, body: JSON.parse(options.body) });
    if (path.includes("agreement-copy")) return { ok: true, headers: { get: () => "application/pdf" }, blob: async () => new Blob(["PDF"]) };
    return { ok: true, text: async () => JSON.stringify({ ok: true, reference: "a".repeat(64) }) };
  });
  show(<PartnershipPage />, "/partnerships");
  fireEvent.click(screen.getByRole("tab", { name: "Agreement" }));
  expect(await screen.findByText("Organisation terms")).toBeInTheDocument();
  fireEvent.click(screen.getByRole("tab", { name: "Register" }));
  for (const [label, value] of [["Organisation name", "Example agency"], ["Contact email", "agency@example.test"], ["Phone", "0200000000"], ["Address", "Accra"], ["Full name of person signing", "Director"], ["Role / capacity", "Director"]]) fireEvent.change(screen.getByLabelText(label), { target: { value } });
  for (const checkbox of screen.getAllByRole("checkbox")) fireEvent.click(checkbox);
  fireEvent.submit(screen.getByRole("button", { name: "Sign, save and download receipt" }).closest("form"));
  expect(await screen.findByRole("heading", { name: "Your organisation is registered for review." })).toBeInTheDocument();
  expect(sent[0].body).toMatchObject({ kind: "institutional", billingResponsibility: "organisation", termsVersion: "org-v3" });
  expect(screen.getByRole("link", { name: /Continue to add your students/ })).toHaveAttribute("href", "/organisation-enrolment");
  const context = JSON.parse(sessionStorage.getItem("falowen:organisation-partner-context"));
  expect(context.organisation.email).toBe("agency@example.test"); expect(context.agreementReference).toBe("a".repeat(64));
  anchorClick.mockRestore();
});
test("the student-list form prefills the signed organisation and sends its agreement reference", async () => {
  sessionStorage.setItem("falowen:organisation-partner-context", JSON.stringify({ agreementReference: "a".repeat(64), organisation: { name: "Signed agency", contactName: "Director", email: "agency@example.test", phone: "0200000000" } }));
  let payload;
  global.fetch = jest.fn(async (path, options) => { payload = JSON.parse(options.body); return { ok: true, text: async () => JSON.stringify({ ok: true, reference: "batch" }) }; });
  show(<OrganisationEnrolmentPage />, "/organisation-enrolment");
  expect(screen.getByLabelText("Organisation name")).toHaveValue("Signed agency");
  fireEvent.change(screen.getByLabelText("Student 1 Full name"), { target: { value: "Learner" } });
  fireEvent.submit(screen.getByRole("button", { name: "Submit for Falowen review" }).closest("form"));
  expect(await screen.findByText("batch")).toBeInTheDocument();
  expect(payload.agreementReference).toBe("a".repeat(64));
});
