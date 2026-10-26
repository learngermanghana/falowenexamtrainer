import React from "react";
import { render, screen } from "@testing-library/react";
import fs from "fs";
import path from "path";
import Grammar from "./A1Day20GoetheWritingGrammarPage";
test("teaches simple reusable sentence patterns without arbitrary sentence limits", () => {
 render(<Grammar />);
 expect(screen.getByRole("heading", {name:"Simple A1 sentence patterns"})).toBeInTheDocument();
 expect(screen.getByText(/^Statement: Subject \+ verb \+ rest/)).toBeInTheDocument();
 expect(screen.getByText(/A weil clause is optional/)).toBeInTheDocument();
 expect(screen.queryByText(/no more than five sentences/)).not.toBeInTheDocument();
});
test("uses the new five-field form and three-point invitation on the canonical workbook", () => {
 const source = fs.readFileSync(path.resolve(__dirname,"A1Day20LetterWritingWorkbookPage.js"),"utf8");
 expect(source).toContain("Der Kurs beginnt im August");
 expect(source).toContain("Kursdauer — wie viele Wochen?");
 expect(source).toContain("E-Mail an Julia");
 expect(source).toContain("Schreiben Sie circa 30 Wörter");
 expect(source).not.toContain("Gibt es eine Feier?");
});
test("retains formal writing as separate practice with a collapsed model", () => {
 render(<Grammar />);
 expect(screen.getByRole("heading",{name:/Extra practice/})).toBeInTheDocument();
 expect(screen.getByText(/This is optional practice/)).toBeInTheDocument();
 expect(document.querySelector("details")).not.toHaveAttribute("open");
});
