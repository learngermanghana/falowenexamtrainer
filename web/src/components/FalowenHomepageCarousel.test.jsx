import React from "react";
import { render, screen, cleanup } from "@testing-library/react";
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
