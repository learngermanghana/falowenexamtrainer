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

  it("keeps website language separate from the selected study programme", async () => {
    render(<LandingHost />);

    expect(screen.getByRole("note")).toHaveTextContent("Website language");
    expect(screen.getByRole("note")).toHaveTextContent("Study programme: German");

    fireEvent.click(screen.getByRole("button", { name: "French" }));
    expect(screen.getByRole("note")).toHaveTextContent("Study programme: French");

    fireEvent.change(screen.getByRole("combobox", { name: "Language" }), {
      target: { value: "de" },
    });

    await waitFor(() => expect(screen.getByRole("note")).toHaveTextContent("Website-Sprache"));
    expect(screen.getByRole("note")).toHaveTextContent("Lernprogramm: Französisch");
    expect(screen.getByRole("button", { name: "Französisch" })).toHaveAttribute("aria-pressed", "true");
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
