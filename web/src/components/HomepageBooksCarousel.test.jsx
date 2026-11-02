import "@testing-library/jest-dom";
import React from "react";
import {fireEvent, render, screen} from "@testing-library/react";
import HomepageBooksCarousel from "./HomepageBooksCarousel";

afterEach(() => jest.useRealTimers());

test("homepage promotes only A1, Writing Skills and the new A2 course book", () => {
 render(<HomepageBooksCarousel />);
 expect(screen.getByRole("region",{name:"Explore Falowen German books"})).toBeInTheDocument();
 const next=()=>fireEvent.click(screen.getByRole("button",{name:"Next book"}));
 expect(screen.getByRole("img",{name:"Deutsch A1 book cover"}))
  .toHaveAttribute("src","/books/a1-cover.svg");
 next();
 expect(screen.getByRole("img",{name:"German Writing Skills book cover"}))
  .toHaveAttribute("src","/books/writing-skills-a1-c2-cover.svg");
 next();
 expect(screen.getByRole("img",{name:"Deutsch A2 book cover"}))
  .toHaveAttribute("src","/books/a2-cover.svg");
 expect(screen.getByRole("link",{name:/View Book/}))
  .toHaveAttribute("href","/books/deutsch-a2-course-workbook");
 for(const hidden of ["A1 Writing Model Exams","A2 Exam Preparation","B1 Exam Preparation"]){
  expect(screen.queryByRole("button",{name:"Show "+hidden})).not.toBeInTheDocument();
 }
 expect(screen.queryByRole("link",{name:/Buy now|Paystack|Coming soon/i})).not.toBeInTheDocument();
});

test("homepage rotates back to the A2 course book with no book API call", () => {
 const prior=global.fetch;global.fetch=jest.fn(()=>{throw Error("No homepage book API calls");});
 try {
  render(<HomepageBooksCarousel />);
  fireEvent.click(screen.getByRole("button",{name:"Previous book"}));
  expect(screen.getByRole("img",{name:"Deutsch A2 book cover"})).toBeInTheDocument();
  expect(global.fetch).not.toHaveBeenCalled();
 } finally {global.fetch=prior;}
});
