import React from "react";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import A2Day23WieKommstDuZurSchuleOderZurArbeitGrammarPage from "./A2Day23WieKommstDuZurSchuleOderZurArbeitGrammarPage";

jest.mock("./navigation/AppBackButton", () => () => null);

afterEach(cleanup);

describe("A2 Day 23 commute grammar", () => {
  test("renders six bilingual explanations inside the existing workbook grammar tab", () => {
    const { container } = render(<A2Day23WieKommstDuZurSchuleOderZurArbeitGrammarPage embedded />);

    expect(container.querySelector('[data-a2-day23-commute-grammar="true"]')).not.toBeNull();
    expect(screen.getByRole("heading", { name: /mit \+ Dativ for transport/ })).toBeTruthy();
    expect(screen.getByRole("heading", { name: /zu, nach or in for the destination/ })).toBeTruthy();
    expect(screen.getByRole("heading", { name: /fahren, gehen or nehmen/ })).toBeTruthy();
    expect(screen.getByRole("heading", { name: /keep the verb in position 2/ })).toBeTruthy();
    expect(screen.getByRole("heading", { name: /duration and reasons/ })).toBeTruthy();
    expect(screen.getByRole("heading", { name: /put everything together/ })).toBeTruthy();
    expect(screen.getByText(/zu dem becomes zum/)).toBeTruthy();
    expect(screen.getByText(/Der Weg zur Arbeit dauert 30 Minuten/)).toBeTruthy();
    expect(screen.getByText(/The journey takes about 25 minutes/)).toBeTruthy();
    expect(container.querySelectorAll('[data-a2-focused-learning-block="true"]')).toHaveLength(1);
  });

  test("knowledge check distinguishes dative mit from accusative nehmen", () => {
    render(<A2Day23WieKommstDuZurSchuleOderZurArbeitGrammarPage embedded />);
    expect(screen.getByText(/Ich nehme ___ Bus/)).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "den" }));
    expect(screen.getByText(/Nehmen has an accusative direct object/)).toBeTruthy();
  });
});
