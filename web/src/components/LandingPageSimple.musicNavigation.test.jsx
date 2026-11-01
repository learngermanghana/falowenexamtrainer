import React from "react";
import fs from "fs";
import path from "path";
import { fireEvent, render, screen, within } from "@testing-library/react";
import "@testing-library/jest-dom";
import LandingPageSimple from "./LandingPageSimple";

jest.mock("../i18n", () => ({ persistInterfaceLanguage: jest.fn() }));
jest.mock("../lib/pageMeta", () => ({ updatePageMeta: jest.fn() }));
jest.mock("./FalowenHomepageCarousel", () => () => null);
jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    i18n: {
      resolvedLanguage: "en",
      language: "en",
      changeLanguage: jest.fn().mockResolvedValue(undefined),
    },
  }),
}));

const MUSIC_URL = "https://music.falowen.app/";

test("opens the public music site directly from homepage navigation and footer", () => {
  render(<LandingPageSimple />);
  const nav = screen.getByRole("navigation", { name: "Falowen" });
  expect(within(nav).getByRole("link", { name: "German Music" })).toHaveAttribute("href", MUSIC_URL);
  expect(within(nav).getByRole("link", { name: "German Music" })).not.toHaveAttribute("target", "_blank");
  expect(screen.getByRole("contentinfo").querySelector('a[href="' + MUSIC_URL + '"]')).toHaveTextContent("German Music");
});

test.each([
  ["Deutsch", "Deutsch mit Musik"],
  ["Français", "Musique allemande"],
])("localizes the German Music navigation in %s", (language, label) => {
  render(<LandingPageSimple />);
  fireEvent.change(screen.getByRole("combobox", { name: "Language" }), {
    target: { value: language === "Deutsch" ? "de" : "fr" },
  });
  const nav = screen.getByRole("navigation", { name: "Falowen" });
  expect(within(nav).getByRole("link", { name: label })).toHaveAttribute("href", MUSIC_URL);
});

test("keeps the navigation visible and horizontally reachable on small screens", () => {
  const styles = fs.readFileSync(path.join(__dirname, "LandingPageMarketing.css"), "utf8");
  const mobileNavStyles = styles.split("@media (max-width: 1000px) {")[1];
  expect(mobileNavStyles).toContain(".falowen-home-nav-links {");
  expect(mobileNavStyles).toContain("display: flex");
  expect(mobileNavStyles).toContain("overflow-x: auto");
  expect(mobileNavStyles).not.toContain(".falowen-home-nav-links { display: none; }");
});
