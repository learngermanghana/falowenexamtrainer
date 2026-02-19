import React from "react";
import { MemoryRouter } from "react-router-dom";
import { render, screen } from "@testing-library/react";
import CourseTab from "../components/CourseTab";

describe("CourseTab instruction links", () => {
  it("renders Day 17 guide link to the in-app route", () => {
    render(
      <MemoryRouter>
        <CourseTab defaultLevel="A1" />
      </MemoryRouter>
    );

    const guideLink = screen.getAllByRole("link", {
      name: /Open Chapter 11 guide: Directions \+ Imperative/i,
    })[0];

    expect(guideLink).toHaveAttribute("href", "/campus/course/directions-imperative-11");
  });
});
