import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import SwahiliCourseBook, { scoreListeningAnswers } from "./SwahiliCourseBook";
import { SWAHILI_DAY_ONE } from "../data/swahili/dayOne";

describe("Kiswahili Day 1 pilot", () => {
  it("publishes only one topic and no later days", () => {
    render(<MemoryRouter><SwahiliCourseBook /></MemoryRouter>);
    expect(screen.getByText("Alfabeti, sauti na matamshi")).toBeTruthy();
    expect(screen.getByText("Somo 1 pekee")).toBeTruthy();
    expect(screen.getByRole("link", { name: "Fungua Somo la 1" }).getAttribute("href")).toBe("/swahili/day-1");
    expect(screen.queryByText(/Somo la 2/)).toBeNull();
  });
  it("provides a lesson tab for music, grammar and each of four parts", () => {
    render(<MemoryRouter><SwahiliCourseBook day={1} /></MemoryRouter>);
    for (const label of ["Muziki", "Sarufi", "Sehemu ya 1", "Sehemu ya 2", "Sehemu ya 3", "Sehemu ya 4"]) {
      expect(screen.getByRole("tab", { name: label })).toBeTruthy();
    }
    fireEvent.click(screen.getByRole("tab", { name: "Sarufi" }));
    expect(screen.getByText("Sarufi · Silabi na mkazo")).toBeTruthy();
    fireEvent.click(screen.getByRole("tab", { name: "Muziki" }));
    expect(screen.getByText(/Rekodi ya wimbo bado haijaongezwa/)).toBeTruthy();
  });
  it("checks classroom listening practice without fabricating audio or an official grade", () => {
    expect(scoreListeningAnswers({0:"A",1:"E",2:"I",3:"O",4:"U"})).toBe(5);
    expect(scoreListeningAnswers({0:"U"})).toBe(0);
    expect(SWAHILI_DAY_ONE.listening).toHaveLength(5);
    render(<MemoryRouter><SwahiliCourseBook day={1} /></MemoryRouter>);
    fireEvent.click(screen.getByRole("tab", { name: "Sehemu ya 4" }));
    expect(screen.getByText(/Sauti iliyorekodiwa bado haijapatikana/)).toBeTruthy();
    expect(screen.queryByRole("audio")).toBeNull();
    expect(screen.getByRole("button", { name: "Kagua majibu" }).disabled).toBe(true);
  });
});
