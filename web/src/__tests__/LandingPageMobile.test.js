import "@testing-library/jest-dom";
import React, { useState } from "react";
import { cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
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

  it("offers German only, with a clear signup CTA and translated placement link", async () => {
    const onSignUp = jest.fn();
    render(<LandingPage program="french" onSignUp={onSignUp} />);
    expect(screen.queryByRole("button", { name: "French" })).not.toBeInTheDocument();
    fireEvent.click(screen.getAllByRole("button", { name: /Start 7 days free trial/ })[0]);
    expect(onSignUp).toHaveBeenCalledWith("german");
    expect(screen.getAllByRole("link", { name: /Take free placement test/ })[0]).toHaveAttribute("href", "/placement-test");
    fireEvent.change(screen.getByRole("combobox", { name: "Language" }), { target: { value: "de" } });
    await waitFor(() => expect(screen.getAllByRole("button", { name: /7 Tage kostenlos testen/ })[0]).toBeInTheDocument());
    expect(screen.getAllByRole("link", { name: /Kostenlosen Einstufungstest machen/ })[0]).toHaveAttribute("href", "/placement-test");
    expect(screen.queryByText(/Französisch/)).not.toBeInTheDocument();
  });

  it("has exactly four marketing features and no long onboarding or course directory", () => {
    const { container } = render(<LandingHost />);
    expect(screen.getByRole("heading", { name: /Learn German your way/ })).toBeInTheDocument();
    expect(container.querySelectorAll(".falowen-home-feature")).toHaveLength(4);
    expect(screen.getByRole("heading", { name: "Find your German level" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Prepare for Goethe-style exams" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Learn with a live class" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Learn at your own pace" })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Start in three simple steps" })).not.toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: /German A1–C2 courses and exam preparation/ })).not.toBeInTheDocument();
    expect(screen.queryByText(/Goethe pass rate/i)).not.toBeInTheDocument();
  });

  it("keeps compact A1–C2 course and Goethe preparation links without a fixed rating", () => {
    const { container } = render(<LandingHost />);
    const courses = within(screen.getByRole("navigation", { name: "German courses by level" }));
    const exams = within(screen.getByRole("navigation", { name: "Goethe-style preparation by level" }));

    for (const level of ["a1", "a2", "b1", "b2", "c1", "c2"]) {
      expect(courses.getByRole("link", { name: level.toUpperCase() })).toHaveAttribute("href", `/learn-german-${level}`);
      expect(exams.getByRole("link", { name: level.toUpperCase() })).toHaveAttribute("href", `/goethe-${level}-preparation`);
    }
    expect(container.querySelectorAll(".falowen-home-feature")).toHaveLength(4);
    expect(container.querySelector(".falowen-home-reviews-intro")).not.toHaveTextContent("★★★★★");
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

    expect(container.querySelector(".falowen-mobile-actions")).toBeInTheDocument();
    expect(css).not.toContain("overflow: hidden");
    expect(screen.getByRole("img", { name: "German classroom at Learn Language Education Academy" })).toHaveAttribute("src", "/classes/llea-classroom.jpg");
    expect(screen.getAllByRole("link", { name: /View live classes/ })[0]).toHaveAttribute("href", "/classes");
    expect(screen.getByRole("link", { name: /View full class schedule/ })).toHaveAttribute(
      "href", "/classes"
    );
  });
  it("keeps the class schedule CTA translated in German and French", async () => {
    render(<LandingHost />);
    fireEvent.change(screen.getByRole("combobox", { name: "Language" }), {
      target: { value: "de" },
    });
    await waitFor(() => expect(
      screen.getByRole("link", { name: /Vollständigen Kursplan ansehen/ })
    ).toHaveAttribute("href", "/classes"));
    fireEvent.change(screen.getByRole("combobox", { name: "Sprache" }), {
      target: { value: "fr" },
    });
    await waitFor(() => expect(
      screen.getByRole("link", { name: /Voir le calendrier complet des cours/ })
    ).toHaveAttribute("href", "/classes"));
  });


});
