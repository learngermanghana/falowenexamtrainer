import React from "react";
import { render, screen } from "@testing-library/react";
import WritingMistakeList from "./WritingMistakeList";

test("mock correction fields retain exact wording, explanation and every correction", () => {
 const corrections=Array.from({length:9},(_,i)=>({original_de:`wrong ${i}`,corrected_de:`right ${i}`,explanation_en:`rule ${i}`}));
 render(<WritingMistakeList level="B2" corrections={[null,...corrections]} />);
 expect(screen.getByText("Actual mistakes (9)")).toBeInTheDocument();
 expect(screen.getByText("wrong 8")).toBeInTheDocument();
 expect(screen.getByText("right 8")).toBeInTheDocument();
 expect(screen.getByText("rule 8")).toBeInTheDocument();
 expect(screen.getByText(/Show all corrections/).closest("details")).not.toHaveAttribute("open");
});
