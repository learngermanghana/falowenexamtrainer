/** @jest-environment-options {"url":"https://exams.falowen.app/"} */
import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route, useLocation } from "react-router-dom";
import { createUserWithEmailAndPassword } from "../firebase";
import { useAuth } from "../context/AuthContext";
import { MockExamCheckoutPage, MockExamOnlyGate, MockExamSignupPage, PaymentOptionsPage } from "./MockExamCommerce";
import MockExamLibraryPage from "./MockExamLibraryPage";
import MockOnlyRouteBoundary from "./MockOnlyRouteBoundary";

jest.mock("../firebase", () => ({ auth: {}, createUserWithEmailAndPassword: jest.fn() }));
jest.mock("../context/AuthContext", () => ({ useAuth: jest.fn() }));
jest.mock("../services/backendUrl", () => ({ getBackendUrl: () => "" }));
jest.mock("../lib/falowenFxRate", () => ({ useFalowenUsdGhsRate: () => null, approximateUsd: () => null }));

jest.mock("../context/ExamContext", () => ({ useExam: () => ({ level: "A2" }) }));

function Destination() {
  return <p>{useLocation().pathname}</p>;
}

const student = { getIdToken: jest.fn(async () => "test-token") };
const profile = { accountType: "exam_only", level: "A2" };

function openPage(path) {
  render(<MemoryRouter initialEntries={[path]}>
    <MockOnlyRouteBoundary>
      <Routes>
        <Route path="/mock/register" element={<MockExamSignupPage />} />
        <Route path="/mock/checkout" element={<MockExamCheckoutPage />} />
        <Route path="/mock/payment" element={<PaymentOptionsPage />} />
        <Route path="/exams/mocks" element={<MockExamOnlyGate><MockExamLibraryPage /></MockExamOnlyGate>} />
        <Route path="*" element={<Destination />} />
        <Route path="/login/" element={<h1>Student login</h1>} />
        <Route path="/exams/overview" element={<MockExamOnlyGate><h1>Exam overview</h1></MockExamOnlyGate>} />
      </Routes>
    </MockOnlyRouteBoundary>
  </MemoryRouter>);
}

function mockApi(active = []) {
  return jest.spyOn(global, "fetch").mockImplementation(async (path, options) => {
    const response = {
      "/mock/catalog": { levels: [{ level: "A2", packages: [{ id: "monthly", priceGhs: 99, days: 30 }] }] },
      "/mock/register": { ok: true, trial: true },
      "/mock/access": { active },
    };
    if (!(path in response)) throw new Error("Unexpected request: " + path);
    if (path !== "/mock/catalog" && options.headers.Authorization !== "Bearer test-token") {
      throw new Error("Missing student token");
    }
    return { ok: true, json: async () => response[path] };
  });
}

afterEach(() => {
  jest.restoreAllMocks();
  jest.clearAllMocks();
});

test("checkout sends signed-out students to login", async () => {
  mockApi();
  useAuth.mockReturnValue({ user: null });
  openPage("/mock/checkout");
  expect(await screen.findByRole("heading", { name: "Student login" })).toBeVisible();
});

test("legacy registration points to the unified Falowen signup", () => {
  useAuth.mockReturnValue({ user: null });
  openPage("/mock/register");
  expect(screen.getByRole("link", { name: "Continue to signup" })).toHaveAttribute("href", "https://www.falowen.app/signup");
  expect(screen.queryByLabelText("Exam level")).toBeNull();
});

test.each([
  ["no active subscription", []],
  ["only another level", [{ id: "test-a1", level: "A1", expiresAtMs: Date.now() + 86400000 }]],
])("direct Exam Room access keeps the overview visible with %s", async (_description, active) => {
  mockApi(active);
  useAuth.mockReturnValue({ user: student, studentProfile: profile });
  openPage("/exams/overview");
  expect(await screen.findByRole("heading", { name: "Exam overview" })).toBeVisible();
  expect(screen.queryByRole("heading", { name: "Choose how to continue" })).toBeNull();
});

test("an active A2 student can enter the protected Exam Room", async () => {
  mockApi([{ level: "A2" }]);
  useAuth.mockReturnValue({ user: student, studentProfile: profile });
  openPage("/exams/overview");
  expect(await screen.findByRole("heading", { name: "Exam overview" })).toBeVisible();
});

test("a signed-in student with a profile goes straight from registration to the exam catalog", async () => {
  mockApi();
  useAuth.mockReturnValue({ user: student, studentProfile: profile });
  openPage("/mock/register");
  expect(await screen.findByRole("heading", { name: "A2 Mock Exams" })).toBeVisible();
  expect(createUserWithEmailAndPassword).not.toHaveBeenCalled();
});

test.each([
  ["A1", "/campus/course/a1-final-mock-2"],
  ["A2", "/campus/course/a2-final-mock-exam"],
  ["B1", "/campus/course/b1-final-mock-exam"],
  ["B2", "/campus/course/b2-final-mock-exam"],
  ["C1", "/exams/lesen/c1/sample-1"],
])("offers the designated %s paper at its published route", async (level, route) => {
  mockApi([{ level, scope: "trial", expiresAtMs: Date.now() + 60000 }]);
  useAuth.mockReturnValue({user: student, studentProfile: {...profile, level}});
  openPage("/exams/mocks");
  const included = await screen.findByRole("button", {name: /Start or resume mock|Open practice section/});
  expect(screen.getAllByRole("article")).toHaveLength(screen.queryAllByRole("button", {name: /Locked/}).length + 1);
  fireEvent.click(included);
  expect(await screen.findByText(route)).toBeVisible();
});


test("exam-only students can choose a full course or review exam checkout", () => {
  useAuth.mockReturnValue({ user: student, studentProfile: profile });
  openPage("/mock/payment");
  expect(screen.getByRole("link", {name: "Choose course"})).toHaveAttribute("href", "/mock/account?choice=full_course");
  expect(screen.getByRole("link", {name: "Choose exam access"})).toHaveAttribute("href", "/mock/checkout");
});

test("course trial students switch account type before exam checkout", () => {
  useAuth.mockReturnValue({ user: student, studentProfile: {accountType: "course", level: "A2", trialStatus: "active", trialEndsAt: new Date(Date.now() + 86400000).toISOString()} });
  openPage("/mock/payment");
  expect(screen.getByRole("link", {name: "Choose exam access"})).toHaveAttribute("href", "/mock/account?choice=exam_preparation");
});

test("unsubscribed exam-only students can browse all mock cards but cannot start them", async () => {
  mockApi();
  useAuth.mockReturnValue({ user: student, studentProfile: profile });
  openPage("/exams/mocks");
  expect(await screen.findByRole("heading", { name: "A2 Mock Exams" })).toBeVisible();
  const locked = await screen.findAllByRole("button", { name: /Locked/ });
  expect(locked.length).toBeGreaterThan(0);
  locked.forEach(button => expect(button).toBeEnabled());
  fireEvent.click(locked[0]);
  expect(screen.getByRole("dialog")).toBeInTheDocument();
  expect(screen.getByRole("link",{name:"View plans"})).toHaveAttribute("href","/mock/payment");
  fireEvent.click(screen.getByRole("button",{name:"Keep browsing"}));
  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  expect(screen.queryByRole("heading", { name: "Choose how to continue" })).toBeNull();
});

test("payment options show the exam price from the current catalog", async () => {
  mockApi();
  useAuth.mockReturnValue({ user: student, studentProfile: profile });
  openPage("/mock/payment");
  expect(await screen.findByText("GH₵99")).toBeVisible();
  expect(screen.getByRole("link", {name:"Choose course"})).toHaveAttribute("href", "/mock/account?choice=full_course");
  expect(screen.getByRole("link", {name:"Choose exam access"})).toHaveAttribute("href", "/mock/checkout");
});

test('server entitlement opens the designated course-trial mock with other cards locked', async () => {
  jest.spyOn(global, 'fetch').mockResolvedValue({ok:true, json:async()=>({active:[],entitlements:{exam:{paidLevels:[],trial:{level:'A2',catalogId:'a2-final-01',expiresAtMs:Date.now()+60000}}}})});
  useAuth.mockReturnValue({user:student,studentProfile:{accountType:'course',level:'A2'}});
  render(<MemoryRouter initialEntries={['/exams/mocks']}><Routes><Route path="/exams/mocks" element={<MockExamOnlyGate courseTrialState={{active:true,endsAtMs:Date.now()+60000}}><MockExamLibraryPage /></MockExamOnlyGate>} /></Routes></MemoryRouter>);
  expect(await screen.findByRole('button',{name:'Start or resume mock'})).toBeEnabled();
  expect(screen.getAllByRole('button',{name:/Locked/}).length).toBeGreaterThan(0);
});

test('a verified expired entitlement is not reopened by a stale local course trial', async () => {
  jest.spyOn(global, 'fetch').mockResolvedValue({ok:true, json:async()=>({active:[],entitlements:{exam:{paidLevels:[],trial:null}}})});
  useAuth.mockReturnValue({user:student,studentProfile:{accountType:'course',level:'A2'}});
  render(<MemoryRouter initialEntries={['/exams/mocks']}><Routes><Route path="/exams/mocks" element={<MockExamOnlyGate courseTrialState={{active:true,endsAtMs:Date.now()+60000}}><MockExamLibraryPage /></MockExamOnlyGate>} /></Routes></MemoryRouter>);
  await screen.findByRole('heading',{name:'A2 Mock Exams'});
  expect(screen.queryByRole('button',{name:'Start or resume mock'})).toBeNull();
});

test("exam-only students can navigate to the Course Book without an exam subscription", async () => {
  mockApi();
  useAuth.mockReturnValue({user:student,studentProfile:profile});
  render(<MemoryRouter initialEntries={["/campus/course"]}><MockOnlyRouteBoundary><MockExamOnlyGate><h1>Course Book preview</h1></MockExamOnlyGate></MockOnlyRouteBoundary></MemoryRouter>);
  expect(await screen.findByRole("heading",{name:"Course Book preview"})).toBeVisible();
  expect(screen.queryByRole("heading",{name:"Choose how to continue"})).toBeNull();
});
