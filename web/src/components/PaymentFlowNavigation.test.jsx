import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { PaymentOptionsPage, MockExamCheckoutPage } from "./MockExamCommerce";
import CourseTypeSettings from "./CourseTypeSettings";
import { loadPublicClasses } from "../services/publicClassCatalogService";

jest.mock("../firebase", () => ({ auth: {}, createUserWithEmailAndPassword: jest.fn() }));
jest.mock("../context/AuthContext", () => ({ useAuth: jest.fn() }));
jest.mock("../services/backendUrl", () => ({ getBackendUrl: () => "" }));
jest.mock("../services/publicClassCatalogService", () => ({ loadPublicClasses: jest.fn(), isPublicClassOpen: () => true }));
jest.mock("../lib/falowenFxRate", () => ({ useFalowenUsdGhsRate: () => null, approximateUsd: () => null }));

const user = { getIdToken: jest.fn(async () => "token") };
const open = path => render(<MemoryRouter initialEntries={[path]}><Routes>
  <Route path="/mock/payment" element={<PaymentOptionsPage />} />
  <Route path="/mock/account" element={<CourseTypeSettings />} />
  <Route path="/mock/checkout" element={<MockExamCheckoutPage />} />
  <Route path="/exams/overview" element={<h1>Exams Room destination</h1>} />
</Routes></MemoryRouter>);

beforeEach(() => {
  useAuth.mockReturnValue({ user, studentProfile: { accountType: "exam_only", courseType: "exam_preparation", level: "A2" }, refreshStudentProfile: jest.fn(), logout: jest.fn() });
  loadPublicClasses.mockResolvedValue([{ id: "class-1", title: "A2 class", language: "German", tuitionGhs: 3000 }]);
});
afterEach(() => jest.restoreAllMocks());

test("a selected full course does not ask for the course type again and can go back", async () => {
  open("/mock/payment");
  fireEvent.click(screen.getByRole("link", { name: "Continue to course billing" }));
  expect(screen.getByRole("heading", { name: "Full Course" })).toBeVisible();
  expect(screen.queryByLabelText("Change course type")).toBeNull();
  expect(await screen.findByRole("option", { name: /A2 class/ })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Continue to tuition checkout" })).toBeEnabled();
  fireEvent.click(screen.getByRole("link", { name: /Back to payment options/ }));
  expect(screen.getByRole("heading", { name: "Choose how to continue" })).toBeVisible();
  expect(screen.getByRole("navigation", { name: "Student navigation" })).toBeVisible();
});

test("exam checkout retains navigation to the included trial", async () => {
  jest.spyOn(global, "fetch").mockImplementation(async path => ({ ok: true, json: async () => path === "/mock/catalog" ? { levels: [] } : { active: [] } }));
  open("/mock/checkout");
  fireEvent.click(screen.getByRole("link", { name: "Exams Room", exact: true }));
  expect(await screen.findByRole("heading", { name: "Exams Room destination" })).toBeVisible();
});

test("exam-only selection can continue to checkout without resubmitting the same account type", async () => {
  jest.spyOn(global, "fetch").mockImplementation(async path => ({ ok: true, json: async () => path === "/mock/catalog" ? { levels: [] } : { active: [] } }));
  open("/mock/account?choice=exam_preparation");
  expect(screen.queryByLabelText("Change course type")).toBeNull();
  fireEvent.click(screen.getByRole("button", { name: "Continue to exam checkout" }));
  await waitFor(() => expect(screen.getByRole("heading", { name: "Your monthly exam subscription" })).toBeVisible());
  expect(global.fetch).not.toHaveBeenCalledWith("/account/course-type", expect.anything());
});

test("a course trial student explicitly confirms switching before exam checkout", async () => {
  const refreshStudentProfile = jest.fn(async () => {});
  useAuth.mockReturnValue({ user, studentProfile: { accountType: "course", courseType: "full_course", level: "A2", trialStatus: "active", trialEndsAt: new Date(Date.now() + 86400000).toISOString() }, refreshStudentProfile });
  const fetchMock = jest.spyOn(global, "fetch").mockImplementation(async (path) => ({ ok: true, json: async () => path === "/account/course-type" ? { checkout: "exam" } : path === "/mock/catalog" ? { levels: [] } : { active: [] } }));
  open("/mock/payment");
  fireEvent.click(screen.getByRole("link", { name: "Continue to exam preparation" }));
  expect(screen.queryByLabelText("Change course type")).toBeNull();
  expect(fetchMock).not.toHaveBeenCalledWith("/account/course-type", expect.anything());
  fireEvent.click(screen.getByRole("button", { name: "Continue to exam checkout" }));
  await screen.findByRole("heading", { name: "Your monthly exam subscription" });
  expect(fetchMock).toHaveBeenCalledWith("/account/course-type", expect.objectContaining({ method: "POST", body: JSON.stringify({ courseType: "exam_preparation", classId: "" }) }));
  expect(refreshStudentProfile).toHaveBeenCalled();
});
