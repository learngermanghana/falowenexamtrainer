import "@testing-library/jest-dom";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import SignUpPage from "../components/SignUpPage";

jest.mock("../components/SignUpPageLegacy", () => () => (
  <form>
    <input aria-label="Full name" autoComplete="name" />
    <input aria-label="Email" autoComplete="email" />
    <input aria-label="Password" type="password" autoComplete="new-password" />
    <input aria-label="Confirm password" type="password" autoComplete="new-password" />
    <input aria-label="Phone" autoComplete="tel" placeholder="0176 12345678" />
    <textarea aria-label="Address" autoComplete="street-address" />
    <input aria-label="Location" autoComplete="address-level2" />
    <select aria-label="Learning mode">
      <option value="">Choose</option>
      <option value="Hybrid">Hybrid</option>
    </select>
    <input
      aria-label="Emergency phone"
      autoComplete="tel-national"
      placeholder="0176 98765432"
    />
    <select id="class-selection" aria-label="Class">
      <option value="">Choose</option>
    </select>
    <select id="initial-payment-amount" aria-label="Payment">
      <option value="full">Full</option>
    </select>
  </form>
));

jest.mock("../data/classCatalog", () => ({ classCatalog: {} }));

jest.mock("../lib/publicFunnelTracking", () => ({
  followUpIso: jest.fn(() => "2026-06-30T00:00:00.000Z"),
  getPublicFunnelContext: jest.fn(() => ({})),
  rememberPublicFunnelContext: jest.fn(),
  submitPublicLead: jest.fn(() => Promise.resolve()),
  trackPublicFunnelEvent: jest.fn(),
}));

describe("mobile signup field behaviour", () => {
  afterEach(() => {
    cleanup();
    window.localStorage.clear();
  });

  it("sets mobile keyboards, autofill names and Ghana-friendly phone examples", async () => {
    render(<SignUpPage />);

    await waitFor(() =>
      expect(screen.getByLabelText("Email")).toHaveAttribute("inputmode", "email")
    );

    expect(screen.getByLabelText("Full name")).toHaveAttribute("autocapitalize", "words");
    expect(screen.getByLabelText("Full name")).toHaveAttribute("name", "fullName");
    expect(screen.getByLabelText("Email")).toHaveAttribute("autocapitalize", "none");
    expect(screen.getByLabelText("Phone")).toHaveAttribute("inputmode", "tel");
    expect(screen.getByLabelText("Phone")).toHaveAttribute(
      "placeholder",
      "024 123 4567 or +233 24 123 4567"
    );
    expect(screen.getByLabelText("Emergency phone")).toHaveAttribute("inputmode", "tel");
    expect(screen.getByLabelText("Location")).toHaveAttribute("autocapitalize", "words");
  });

  it("leaves password visibility ownership to the inline signup controls", async () => {
    render(<SignUpPage />);

    await waitFor(() =>
      expect(screen.getByLabelText("Password")).toHaveAttribute("name", "password")
    );

    expect(screen.getByLabelText("Password")).toHaveAttribute("type", "password");
    expect(screen.getByLabelText("Confirm password")).toHaveAttribute("type", "password");
    expect(screen.queryByRole("button", { name: "Show passwords" })).not.toBeInTheDocument();
  });
});


test("support link uses current form errors and step, not stale draft or video attribution", async () => {
  window.localStorage.setItem("falowen:public-application-draft", JSON.stringify({name:"Earlier name",level:"A1"}));
  const view = render(<SignUpPage />);
  const link = await screen.findByRole("link", {name:/Admissions Support/});
  const name = screen.getByLabelText("Full name");
  const form = name.closest("form");
  form.dataset.signupStep = "2";
  form.dataset.signupError = "Please choose a class before continuing.";
  fireEvent.change(name, {target:{value:"Augustina Tordzro"}});
  fireEvent.change(screen.getByLabelText(/What do you need help/), {target:{value:"The class list is empty."}});
  fireEvent.change(screen.getByLabelText("Password"), {target:{value:"secret-never-share"}});
  fireEvent.click(link);
  let message = new URL(link.href).searchParams.get("text");
  expect(message).toContain("Name: Augustina Tordzro");
  expect(message).toContain("Current step: 2 of 3 — Your learning");
  expect(message).toContain("Error shown: Please choose a class before continuing.");
  expect(message).toContain("Help needed: The class list is empty.");
  expect(message).not.toMatch(/Earlier name|YouTube|CFkrrVxhdL4|secret-never-share/);
  form.dataset.signupStep = "3";
  form.dataset.signupError = "";
  fireEvent.click(link);
  message = new URL(link.href).searchParams.get("text");
  expect(message).toContain("Current step: 3 of 3 — Contact details");
  expect(message).toContain("No error message is currently displayed.");
  expect(message).not.toContain("Please choose a class");
  view.unmount();
  window.localStorage.clear();
});
