import { fireEvent, render, screen } from "@testing-library/react";
import A2Day14BerufUndKarriereUmZuGrammarPage from "./A2Day14BerufUndKarriereUmZuGrammarPage";

describe("A2 Day 14 bilingual um ... zu grammar notes", () => {
  const show = () => render(<A2Day14BerufUndKarriereUmZuGrammarPage embedded />);

  test("explains the purpose construction in English and pairs German examples with translations", () => {
    show();
    expect(screen.getByRole("heading", { name: "um ... zu + Infinitiv" })).toBeInTheDocument();
    expect(screen.getByText(/in order to \/ to/)).toBeInTheDocument();
    expect(screen.getByText("I am learning German in order to work in Germany.")).toBeInTheDocument();
    expect(screen.getByText("She is doing an internship to gain work experience.")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "3. When should I use damit?" })).toBeInTheDocument();
    expect(screen.getByText(/Same subject → um \.\.\. zu \(or damit\)/)).toBeInTheDocument();
  });

  test("shows modal and separable-verb word order as well as translated career vocabulary", () => {
    show();
    expect(screen.getByText(/übernehmen zu können\./)).toBeInTheDocument();
    expect(screen.getByText(/vorzubereiten\./)).toBeInTheDocument();
    expect(screen.getByText("to take further professional training")).toBeInTheDocument();
    expect(screen.getByText("to apply for a position")).toBeInTheDocument();
  });

  test("practice reveals bilingual guidance after selection, has varied answer positions and can reset", () => {
    show();
    const first = screen.getByRole("group", { name: "Question 1" });
    fireEvent.click(first.querySelectorAll("button")[0]);
    expect(screen.getByText(/Not quite/)).toBeInTheDocument();
    expect(screen.getByText(/Place zu before verbessern/)).toBeInTheDocument();
    fireEvent.click(first.querySelectorAll("button")[1]);
    expect(screen.getByText(/Correct:/)).toBeInTheDocument();
    const third = screen.getByRole("group", { name: "Question 3" });
    fireEvent.click(third.querySelectorAll("button")[2]);
    expect(screen.getByText(/2 of 5 answered/)).toBeInTheDocument();
    expect(screen.getByText(/2 correct/)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /Reset answers/ }));
    expect(screen.getByText(/0 of 5 answered/)).toBeInTheDocument();
    expect(screen.queryByText(/Not quite/)).not.toBeInTheDocument();
  });
});
