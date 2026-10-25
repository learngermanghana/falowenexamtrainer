import "@testing-library/jest-dom";
import React from "react";
import { act, fireEvent, render, screen } from "@testing-library/react";
import HomepageBooksCarousel from "./HomepageBooksCarousel";

const originalFetch = global.fetch;
beforeEach(() => {
  global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    json: async () => ({
      catalogTitles: [
        {id:"a1-course-workbook",status:"available",bookIds:["a1-digital"]},
        {id:"writing-skills-a1-c2",status:"available",bookIds:["writing-skills-a1-c2-digital"]},
        {id:"a1-writing-model-exams",status:"coming_soon",bookIds:[]},
        {id:"a2-four-skills-exam-guide",status:"coming_soon",bookIds:[]},
        {id:"b1-four-skills-exam-guide",status:"coming_soon",bookIds:[]},
      ],
      books: [
        {id:"a1-digital",format:"digital",priceGhs:99},
        {id:"writing-skills-a1-c2-digital",format:"digital",priceGhs:39},
      ],
    }),
  });
});
afterEach(() => { global.fetch = originalFetch; jest.useRealTimers(); });

test("signed-in books carousel shows a real A1 cover and lets students browse five titles", async () => {
  render(<HomepageBooksCarousel />);
  expect(screen.getByRole("region",{name:"Explore Falowen German books"})).toBeInTheDocument();
  expect(screen.getByRole("img",{name:"Deutsch A1 book cover"})).toHaveAttribute("src","/books/a1-cover.svg");
  expect(screen.getByRole("link",{name:/Browse all books/})).toHaveAttribute("href","/books");
  await screen.findByRole("link",{name:/View book editions/});
  fireEvent.click(screen.getByRole("button",{name:"Next book"}));
  expect(screen.getByRole("img",{name:"German Writing Skills book cover"}))
    .toHaveAttribute("src","/books/writing-skills-a1-c2-cover.svg");
  fireEvent.click(screen.getByRole("button",{name:"Show A1 Writing Model Exams"}));
  expect(screen.getByRole("link",{name:/View book details/}))
    .toHaveAttribute("href","/books/goethe-a1-writing-model-exams");
  expect(screen.queryByRole("link",{name:/Buy now/i})).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole("button",{name:"Show A2 Exam Preparation"}));
  expect(screen.getByRole("link",{name:/View book details/}))
    .toHaveAttribute("href","/books/goethe-a2-four-skills-exam-guide");
  fireEvent.click(screen.getByRole("button",{name:"Show B1 Exam Preparation"}));
  expect(screen.getByRole("link",{name:/View book details/}))
    .toHaveAttribute("href","/books/goethe-b1-four-skills-exam-guide");
});

test("carousel can browse manually when the catalogue fails, without inventing purchase availability", async () => {
  global.fetch = jest.fn().mockRejectedValue(new Error("offline"));
  render(<HomepageBooksCarousel />);
  await act(async () => { await Promise.resolve(); });
  expect(screen.getByRole("link",{name:/View book details/})).toHaveAttribute("href","/books");
  fireEvent.click(screen.getByRole("button",{name:"Previous book"}));
  expect(screen.getByRole("img",{name:/B1 Exam Preparation illustrated book cover/})).toBeInTheDocument();
  expect(screen.getByRole("link",{name:/View book details/}))
    .toHaveAttribute("href","/books/goethe-b1-four-skills-exam-guide");
  expect(screen.queryByRole("link",{name:/View book editions/})).not.toBeInTheDocument();
});
