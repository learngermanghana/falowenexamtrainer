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

  it("offers German only, including after a saved French selection and language change", async () => {
    const onSignUp = jest.fn();
    render(<LandingPage program="french" onSignUp={onSignUp} />);
    expect(screen.queryByRole("button", { name: "French" })).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Start German" }));
    expect(onSignUp).toHaveBeenCalledWith("german");
    fireEvent.change(screen.getByRole("combobox", { name: "Language" }), { target: { value: "de" } });
    await waitFor(() => expect(screen.getByRole("button", { name: "Deutsch starten" })).toBeInTheDocument());
    expect(screen.queryByText(/Französisch/)).not.toBeInTheDocument();
  });

  it("shows the academy track record without limiting exam performance to Goethe", () => {
    render(<LandingHost />);

    expect(screen.getByRole("heading", { name: "Our track record" })).toBeInTheDocument();
    expect(screen.getByText("2022")).toBeInTheDocument();
    expect(screen.getByText("High exam pass rate")).toBeInTheDocument();
    expect(screen.getByText("A1–C2")).toBeInTheDocument();
    expect(screen.getByText(/not limited to one exam provider/i)).toBeInTheDocument();
    expect(screen.queryByText(/Goethe pass rate/i)).not.toBeInTheDocument();
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
