import React from "react";
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
  expect(screen.getByRole("link", {name:/Find my level/})).toHaveAttribute("href", "/placement-test");
});

it.each([
  ["en", "Explore German songs"],
  ["de", "Deutsche Lieder entdecken"],
  ["fr", "Découvrir les chansons"],
])("features the music destination in the %s homepage carousel", (language, action) => {
  loadPublicClasses.mockResolvedValue([]);
  render(<Carousel language={language} />);
  expect(screen.getAllByRole("button", { name:/^Show slide [0-9]+$/ })).toHaveLength(5);
  fireEvent.click(screen.getByRole("button", { name:"Show slide 2" }));
  expect(screen.getByRole("link", { name:new RegExp(action) })).toHaveAttribute("href", "https://music.falowen.app/");
  expect(screen.getByText("Deutsch mit Musik")).toBeInTheDocument();
  expect(screen.getByText("A1 · A2 · B1")).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name:"Next slide" }));
  expect(screen.getByRole("link", { name:/test|Einstufungstest|test gratuit/i })).toBeInTheDocument();
});
