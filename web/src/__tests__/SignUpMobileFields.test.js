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

  it("shows a password visibility control while a password field is active", async () => {
    render(<SignUpPage />);

    const password = screen.getByLabelText("Password");
    const confirmation = screen.getByLabelText("Confirm password");
    fireEvent.focus(password);

    const toggle = await screen.findByRole("button", { name: "Show passwords" });
    fireEvent.pointerDown(toggle);
    fireEvent.click(toggle);

    expect(password).toHaveAttribute("type", "text");
    expect(confirmation).toHaveAttribute("type", "text");
    expect(screen.getByRole("button", { name: "Hide passwords" })).toHaveAttribute(
      "aria-pressed",
      "true"
    );
  });
});
