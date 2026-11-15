import React from "react";
import fs from "fs";
import path from "path";
import { render, screen, cleanup, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import Carousel from "./FalowenHomepageCarousel";
import { loadPublicClasses } from "../services/publicClassCatalogService";
jest.mock("../services/publicClassCatalogService", () => ({ loadPublicClasses: jest.fn() }));
afterEach(cleanup);
it("features the earliest future intake, excluding closed and self-learning courses", async () => {
  loadPublicClasses.mockResolvedValue([
    { title:"Closed", startDate:"2098-01-01", registrationOpen:false },
    { title:"Self learning", startDate:"2098-01-01", availability:"always" },
    { title:"Past", startDate:"2020-01-01" },
    { title:"Later", startDate:"2099-04-01" },
    { title:"A2 Next intake", level:"A2", startDate:"2099-02-03", classUrl:"/classes/a2-next", meetingDays:[{day:"Monday", startTime:"18:00",endTime:"19:00"}] },
  ]);
  render(<Carousel />);
  expect(await screen.findByText("A2 Next intake")).toBeInTheDocument();
  expect(screen.getByText("Monday 18:00–19:00")).toBeInTheDocument();
  expect(screen.getByRole("link", {name:/View class details & register/})).toHaveAttribute("href", "/classes/a2-next");
});
it("keeps the class route available if the catalogue fails without inventing dates", async () => {
  loadPublicClasses.mockRejectedValue(new Error("offline"));
  render(<Carousel />);
  expect(await screen.findByText("A clear foundation. A tutor to guide you.")).toBeInTheDocument();
  expect(screen.getByRole("link", {name:/View class details & register/})).toHaveAttribute("href", "/classes");
  expect(screen.getByRole("link", {name:/View German classes/})).toHaveAttribute("href", "/classes");
});

it.each([
  ["en", "German songs", "Swahili songs"],
  ["de", "Deutsche Lieder", "Lieder auf Kiswahili"],
  ["fr", "Chansons en allemand", "Chansons en swahili"],
])("features the music destination in the %s homepage carousel", (language, action, swahiliAction) => {
  loadPublicClasses.mockResolvedValue([]);
  render(<Carousel language={language} />);
  expect(screen.getAllByRole("button", { name:/^Show slide [0-9]+$/ })).toHaveLength(6);
  fireEvent.click(screen.getByRole("button", { name:"Show slide 2" }));
  expect(screen.getByRole("link", { name:new RegExp(action) })).toHaveAttribute("href", "https://music.falowen.app/");
  expect(screen.getByRole("link", { name: swahiliAction })).toHaveAttribute("href", "https://music.falowen.app/?language=swahili");
  fireEvent.click(screen.getByRole("button", { name:"Next slide" }));
  expect(screen.getByRole("link", { name:/test|Einstufungstest|test gratuit/i })).toBeInTheDocument();
});

it("keeps all six slides in a consistent viewport, including the compact mobile class preview", () => {
  loadPublicClasses.mockResolvedValue([]);
  render(<Carousel />);
  const carousel = screen.getByRole("region", { name: "Explore Falowen learning options" });
  expect(carousel).toHaveClass("falowen-carousel-courses");
  expect(screen.getByRole("link", { name: /View class details & register/ })).toHaveAttribute("href", "/classes");
  expect(screen.getByText("Class schedule")).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "Show slide 2" }));
  expect(carousel).toHaveClass("falowen-carousel-music");
  expect(screen.getByRole("link", { name: /German songs/ })).toHaveAttribute("href", "https://music.falowen.app/");

  const css = fs.readFileSync(path.join(__dirname, "FalowenHomepageCarousel.css"), "utf8");
  const uniform = css.slice(css.indexOf("/* Consistent carousel footprint:"));
  expect(uniform).toContain("height: 515px");
  expect(uniform).toContain("height: 525px");
  expect(uniform).toContain(".falowen-carousel-courses .falowen-carousel-content");
  expect(uniform).toContain(".falowen-carousel-courses .falowen-class-board-cta");
  expect(uniform).toContain(".falowen-carousel-courses .falowen-class-board-body dl > div:nth-child(n+3)");
  expect(uniform).toContain("height: 535px");
  expect(uniform).not.toContain("display: none; }\n  .falowen-carousel-courses .falowen-class-board-cta");
});

it("links the student ChatGPT learning guide from the sixth slide in all supported languages", () => {
  loadPublicClasses.mockResolvedValue([]);
  for (const language of ["en", "de", "fr"]) {
    const view = render(<Carousel language={language} />);
    fireEvent.click(screen.getAllByRole("button", { name: "Show slide 6" }).at(-1));
    expect(screen.getByRole("link", { name: /ChatGPT/i })).toHaveAttribute("href", "/learn-german-with-chatgpt");
    view.unmount();
  }
});
