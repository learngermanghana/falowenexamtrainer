import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import OrganisationEnrolmentPage from "./OrganisationEnrolmentPage";
import PartnershipPage from "./PartnershipPage";
import { partnerRequest } from "../lib/organisationPartnerAccount.js";
import { loadOrganisationAgreement, requestOrganisationAgreement } from "../lib/organisationAgreementRequest.js";

jest.mock("./PartnerAccount.jsx", () => ({
  __esModule: true,
  default: ({ children }) => children({
    profile: {
      id: "partner-fixture", name: "Example agency", email: "agency@example.test",
      contactName: "Director", phone: "0200000000", address: "Accra",
    },
    refresh: async () => {},
  }),
}));
jest.mock("../lib/organisationPartnerAccount.js", () => ({
  partnerRequest: jest.fn(), downloadPartnerAgreement: jest.fn(), partnerAuth: {},
}));
jest.mock("../lib/organisationAgreementRequest.js", () => ({
  loadOrganisationAgreement: jest.fn(),
  requestOrganisationAgreement: jest.fn(),
}));

const hosting = require("../../../vercel.json");
test.each(["organisation-enrolments", "referrals/apply", "referrals/claim"])("public %s requests use the existing backend routing", path => {
  const match = hosting.routes.find(route => route.src && new RegExp("^" + route.src + "$").test("/api/" + path));
  expect(match.dest).toBe("https://us-central1-falowen-examiner-trainer.cloudfunctions.net/api/" + path);
  expect(match.methods).toEqual(["POST"]);
});

const catalog = {
  classes: [
    { id: "de-a1", title: "A1 German Class", level: "A1", language: "German", startDate: "2027-01-04" },
    { id: "de-b1", title: "B1 German Class", level: "B1", language: "German", startDate: "2027-01-05" },
  ],
  swahiliClasses: [
    { id: "sw-a1", title: "A1 Kiswahili Class", level: "A1", language: "Swahili", startDate: "2027-01-06" },
  ],
};
const priorFetch = global.fetch;
afterEach(() => {
  global.fetch = priorFetch;
  sessionStorage.clear();
  jest.clearAllMocks();
});
beforeEach(() => {
  loadOrganisationAgreement.mockResolvedValue({
    version: "organisation-partnership-2026-11-21-v8", terms: ["Organisation terms"],
    partnerShareRate: .1, shareSettlement: "invoice_deduction", tuitionRefundable: false,
    classDurationWeeks: 10, accessMonths: 6, accessStartsAt: "account_activation",
  });
  requestOrganisationAgreement.mockResolvedValue({ reference: "a".repeat(64) });
  partnerRequest.mockResolvedValue({ reference: "batch-test" });
  global.fetch = jest.fn(async () => ({ ok: true, json: async () => catalog }));
});
const show = (page, path) => render(<MemoryRouter initialEntries={[path]}>{page}</MemoryRouter>);
async function chooseClass(language = "German") {
  await screen.findByRole("button", { name: "Load / refresh available classes" });
  fireEvent.change(screen.getByLabelText("Student 1 Course language"), { target: { value: language } });
  fireEvent.change(screen.getByLabelText("Student 1 Level"), { target: { value: "A1" } });
  const name = language === "Swahili" ? "A1 Kiswahili Class — 2027-01-06" : "A1 German Class — 2027-01-04";
  await screen.findByRole("option", { name });
  fireEvent.change(screen.getByLabelText("Student 1 Requested class"), { target: { value: language === "Swahili" ? "sw-a1" : "de-a1" } });
}

test("partnership overview presents German and Kiswahili under one account", () => {
  show(<PartnershipPage />, "/partnerships");
  expect(screen.getByRole("heading", { name: /We teach German & Kiswahili/ })).toBeInTheDocument();
  expect(screen.getByRole("heading", { name: "German courses" })).toBeInTheDocument();
  expect(screen.getByRole("heading", { name: "Kiswahili courses" })).toBeInTheDocument();
  expect(screen.getByText(/free places earn no tuition-based share/i)).toBeInTheDocument();
  expect(screen.getAllByRole("tab")).toHaveLength(3);
});

test("agreement remains available for the same registration flow", async () => {
  show(<PartnershipPage />, "/partnerships");
  fireEvent.click(screen.getByRole("tab", { name: "Agreement" }));
  expect(await screen.findByText("Organisation terms")).toBeInTheDocument();
  expect(screen.getByText(/arranging German and Kiswahili language training/)).toBeInTheDocument();
  fireEvent.click(screen.getByRole("tab", { name: "Register" }));
  expect(screen.getByLabelText("Organisation name")).toHaveValue("Example agency");
});

test.each([["German", "de-a1"], ["Swahili", "sw-a1"]])("partner can submit a %s learner only for matching classes", async (language, classId) => {
  show(<OrganisationEnrolmentPage />, "/organisation-enrolment");
  fireEvent.change(screen.getByLabelText("Student 1 Full name"), { target: { value: "Example learner" } });
  await chooseClass(language);
  const wrong = language === "Swahili" ? "A1 German Class — 2027-01-04" : "A1 Kiswahili Class — 2027-01-06";
  expect(screen.queryByRole("option", { name: wrong })).not.toBeInTheDocument();
  fireEvent.submit(screen.getByRole("button", { name: "Submit for Falowen review" }).closest("form"));
  await waitFor(() => expect(partnerRequest).toHaveBeenCalled());
  const [path, body] = partnerRequest.mock.calls[0];
  expect(path).toBe("organisation-enrolments");
  expect(body.students).toHaveLength(1);
  expect(body.students[0]).toMatchObject({ language, level: "A1", requestedClassId: classId });
});

test("switching language clears the selected class and level", async () => {
  show(<OrganisationEnrolmentPage />, "/organisation-enrolment");
  await chooseClass("German");
  fireEvent.change(screen.getByLabelText("Student 1 Course language"), { target: { value: "Swahili" } });
  expect(screen.getByLabelText("Student 1 Level")).toHaveValue("");
  expect(screen.getByLabelText("Student 1 Requested class")).toHaveValue("");
});

test("partner signing still saves the agreement and preserves the enrolment link", async () => {
  show(<PartnershipPage />, "/partnerships");
  fireEvent.click(screen.getByRole("tab", { name: "Register" }));
  await screen.findByRole("button", { name: /Sign, save and download receipt/ });
  fireEvent.change(screen.getByLabelText("Role / capacity"), { target: { value: "Director" } });
  for (const control of screen.getAllByRole("checkbox")) fireEvent.click(control);
  fireEvent.submit(screen.getByRole("button", { name: /Sign, save and download receipt/ }).closest("form"));
  await waitFor(() => expect(requestOrganisationAgreement).toHaveBeenCalledWith("apply-signed", expect.objectContaining({
    kind: "institutional", termsVersion: "organisation-partnership-2026-11-21-v8",
  })));
  expect(await screen.findByRole("link", { name: /Continue to add your students/ })).toHaveAttribute("href", "/organisation-enrolment");
});


test.each([
  ["Kiswahili", "Swahili", "A1 Kiswahili Class — 2027-01-06"],
  ["  kIsWaHiLi  ", "Swahili", "A1 Kiswahili Class — 2027-01-06"],
  ["Swahili", "Swahili", "A1 Kiswahili Class — 2027-01-06"],
  ["Kiswahili (Swahili)", "Swahili", "A1 Kiswahili Class — 2027-01-06"],
  ["Deutsch", "German", "A1 German Class — 2027-01-04"],
  ["GERMAN", "German", "A1 German Class — 2027-01-04"],
])("pasted spreadsheet language %s matches the %s class catalogue", async (input, expected, className) => {
  show(<OrganisationEnrolmentPage />, "/organisation-enrolment");
  const row = ["Pasted Learner", "pasted@example.test", "0200000000", "A1", "Accra", "0240000000", input].join("\t");
  fireEvent.paste(screen.getByLabelText("Student 1 Full name"), {
    clipboardData: { getData: format => format === "text" ? row : "" },
  });
  expect(screen.getByLabelText("Student 1 Course language")).toHaveValue(expected);
  expect(screen.getByLabelText("Student 1 Level")).toHaveValue("A1");
  expect(await screen.findByRole("option", { name: className })).toBeInTheDocument();
});

test("pasting mixed-language students preserves their levels and submits canonical programme values", async () => {
  show(<OrganisationEnrolmentPage />, "/organisation-enrolment");
  const records = [
    ["Kiswahili Learner", "kiswahili@example.test", "0200000000", "A1", "Accra", "0240000000", "Kiswahili"],
    ["German Learner", "german@example.test", "0200000001", "A1", "Accra", "0240000001", "Deutsch"],
  ];
  fireEvent.paste(screen.getByLabelText("Student 1 Full name"), {
    clipboardData: { getData: format => format === "text" ? records.map(row => row.join("\t")).join("\n") : "" },
  });
  expect(screen.getByLabelText("Student 1 Course language")).toHaveValue("Swahili");
  expect(screen.getByLabelText("Student 2 Course language")).toHaveValue("German");
  expect(screen.getByLabelText("Student 1 Level")).toHaveValue("A1");
  expect(screen.getByLabelText("Student 2 Level")).toHaveValue("A1");
  await screen.findByRole("option", { name: "A1 Kiswahili Class — 2027-01-06" });
  fireEvent.change(screen.getByLabelText("Student 1 Requested class"), { target: { value: "sw-a1" } });
  fireEvent.change(screen.getByLabelText("Student 2 Requested class"), { target: { value: "de-a1" } });
  fireEvent.submit(screen.getByRole("button", { name: "Submit for Falowen review" }).closest("form"));
  await waitFor(() => expect(partnerRequest).toHaveBeenCalled());
  const [action, payload] = partnerRequest.mock.calls[0];
  expect(action).toBe("organisation-enrolments");
  expect(payload.students).toMatchObject([
    { language: "Swahili", level: "A1", requestedClassId: "sw-a1" },
    { language: "German", level: "A1", requestedClassId: "de-a1" },
  ]);
});
