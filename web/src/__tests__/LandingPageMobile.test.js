import "@testing-library/jest-dom";
import React, { useState } from "react";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import "../i18n";
import i18n from "../i18n";
import LandingPage from "../components/LandingPage";

jest.mock("../lib/publicFunnelTracking", () => ({
  rememberPublicFunnelContext: jest.fn(),
  trackPublicFunnelEvent: jest.fn(),
}));

jest.mock("../lib/pageMeta", () => ({
  updatePageMeta: jest.fn(),
}));

const LandingHost = () => {
  const [program, setProgram] = useState("german");
  return (
    <LandingPage
      program={program}
      onProgramSelect={setProgram}
      onSignUp={jest.fn()}
      onLogin={jest.fn()}
    />
  );
};

describe("Falowen public homepage on mobile", () => {
  beforeEach(async () => {
    await i18n.changeLanguage("en");
  });

  afterEach(() => {
    cleanup();
    jest.clearAllMocks();
  });

  it("keeps the selected programme when the interface language changes", async () => {
    render(<LandingHost />);

    expect(screen.queryByRole("note")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "German" })).toHaveAttribute("aria-pressed", "true");

    fireEvent.click(screen.getByRole("button", { name: "French" }));
    expect(screen.getByRole("button", { name: "French" })).toHaveAttribute("aria-pressed", "true");

    fireEvent.change(screen.getByRole("combobox", { name: "Language" }), {
      target: { value: "de" },
    });

    await waitFor(() =>
      expect(screen.getByRole("button", { name: "Französisch" })).toHaveAttribute("aria-pressed", "true")
    );
  });

  it("does not show the removed Falowen Radio promotion", () => {
    render(<LandingHost />);

    expect(screen.queryByText("German listening practice built into the Falowen course book to help learners understand natural, real-world German before lesson tasks.")).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "What is Falowen Radio?" })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /Subscribe on YouTube/i })).not.toBeInTheDocument();
  });

  it("keeps the WhatsApp support deep link available", () => {
    render(<LandingHost />);

    expect(screen.getByRole("link", { name: /WhatsApp/i })).toHaveAttribute(
      "href",
      "https://wa.me/233205706589"
    );
  });

  it("reserves iPhone safe areas for the fixed mobile actions", () => {
    const { container } = render(<LandingHost />);
    const css = container.querySelector("style")?.textContent || "";

    expect(css).toContain("env(safe-area-inset-top)");
    expect(css).toContain("env(safe-area-inset-bottom)");
    expect(css).toContain("padding-bottom: calc(92px + env(safe-area-inset-bottom))");
    expect(css).toContain(".falowen-mobile-actions");
  });
});
