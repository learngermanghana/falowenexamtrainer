import React from "react";
import { render, screen } from "@testing-library/react";
import A1Day20GoetheWritingGrammarPage from "./A1Day20GoetheWritingGrammarPage";
test("teaches the form, short email, scoring and formal/informal register", () => {
 render(<A1Day20GoetheWritingGrammarPage />);
 expect(screen.getByRole("heading", {name:"Goethe A1 Schreiben has two parts"})).toBeInTheDocument();
 expect(screen.getByText(/15 raw points are converted to 25/)).toBeInTheDocument();
 expect(screen.getByRole("heading", {name:"Teil 1 · Formular ausfüllen"})).toBeInTheDocument();
 expect(screen.getByText("Geburtsdatum / Geburtsort")).toBeInTheDocument();
 expect(screen.getByRole("heading", {name:"Informal: friends and family"})).toBeInTheDocument();
 expect(screen.getByRole("heading", {name:"Formal: schools, hotels and offices"})).toBeInTheDocument();
 expect(screen.getByText(/no fixed reason–question–confirmation formula/)).toBeInTheDocument();
 expect(screen.getByRole("heading", {name:/Extra practice/})).toBeInTheDocument();
 expect(document.querySelector("details")).not.toHaveAttribute("open");
});
