import React from "react";
import fs from "fs";
import path from "path";
import { fireEvent, render, screen, within } from "@testing-library/react";
import "@testing-library/jest-dom";
import LandingPageSimple from "./LandingPageSimple";

jest.mock("../i18n", () => ({ persistInterfaceLanguage: jest.fn() }));
jest.mock("../lib/pageMeta", () => ({ updatePageMeta: jest.fn() }));
jest.mock("./FalowenHomepageCarousel", () => () => <div data-testid="homepage-carousel" />);
jest.mock("./HomepageMusicPlayer", () => () => <section data-testid="homepage-music" />);
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
  const { container } = render(<LandingPageSimple />);
  const nav = screen.getByRole("navigation", { name: "Falowen" });
  expect(within(nav).getByRole("link", { name: "Upcoming Classes" })).toHaveAttribute("href", "/classes");
  expect(within(nav).getByRole("link", { name: "Music" })).toHaveAttribute("href", MUSIC_URL);
  expect(within(nav).getByRole("link", { name: "Music" })).not.toHaveAttribute("target", "_blank");
  expect(container.querySelector('.falowen-home-footer a[href="' + MUSIC_URL + '"]')).toHaveTextContent("Music");
});

test.each([
  ["Deutsch", "Musik"],
  ["Français", "Musique"],
])("localizes the Music navigation in %s", (language, label) => {
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

test("shows German hybrid learning below the carousel without a language chooser or embedded playback", () => {
  const { container } = render(<LandingPageSimple />);
  const carousel = screen.getByTestId("homepage-carousel");
  const hybrid = screen.getByRole("region", { name: "Learn German your way." });
  expect(screen.queryByRole("region", { name: "Choose a language" })).not.toBeInTheDocument();
  expect(screen.queryByTestId("homepage-music")).not.toBeInTheDocument();
  const support = container.querySelector(".falowen-home-support");
  expect(carousel.nextElementSibling).toBe(hybrid);
  expect(hybrid.nextElementSibling).toBe(support);
  expect(within(hybrid).getByRole("heading", { name: "In person" })).toBeInTheDocument();
  expect(within(hybrid).getByRole("heading", { name: "Live online" })).toBeInTheDocument();
  expect(within(hybrid).getByRole("heading", { name: "Recorded lectures" })).toBeInTheDocument();
  expect(within(hybrid).getByRole("link", { name: /Explore learning options/ })).toHaveAttribute("href", "/classes");
});

test("connects the Falowen brand to Learn Language Education Academy", () => {
  render(<LandingPageSimple />);
  const nav = screen.getByRole("navigation", { name: "Falowen" });
  const brand = within(nav).getByRole("link", { name: "Falowen home" });
  expect(brand).toHaveTextContent("falowen.");
  expect(brand).toHaveTextContent("by Learn Language Education Academy");
  const styles = fs.readFileSync(path.join(__dirname, "LandingPageMarketing.css"), "utf8");
  expect(styles).toContain(".falowen-home-brand-subtitle { display: none; }");
});

test.each([
  ["de", "Lerne Deutsch auf deine Weise.", "Aufgezeichnete Lektionen"],
  ["fr", "Apprenez l'allemand à votre rythme.", "Cours enregistrés"],
])("translates hybrid learning choices in %s", (language, heading, lectureLabel) => {
  render(<LandingPageSimple />);
  fireEvent.change(screen.getByRole("combobox", { name: "Language" }), { target: { value: language } });
  const hybrid = screen.getByRole("region", { name: heading });
  expect(within(hybrid).getByRole("heading", { name: lectureLabel })).toBeInTheDocument();
  expect(within(hybrid).getByRole("link")).toHaveAttribute("href", "/classes");
});
