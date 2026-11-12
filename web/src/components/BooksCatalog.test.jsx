import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import BooksCatalog, { indicativeUsd, matchCatalogTitles, BOOK_PAGES } from "./BooksCatalog";

const titles = [
  { id: "a1-course-workbook", title: "Deutsch A1 — Course & Workbook", description: "Beginner grammar course",
    levelTags: ["A1"], formats: ["digital", "printed"], topics: ["grammar", "vocabulary"], pages: 250,
    status: "available", bookIds: ["a1-digital", "a1-printed"] },
  { id: "writing-skills-a1-c2", title: "How to Unlock Your German Writing Skills (A1–C2)",
    description: "Model emails and essays", levelTags: ["A1", "A2", "B1", "B2", "C1", "C2"],
    formats: ["digital"], topics: ["writing", "connectors", "email"], pages: 32,
    status: "available", bookIds: ["writing-skills-a1-c2-digital"] },
];
const offers = [
  { id: "a1-digital", format: "digital", priceGhs: 249 },
  { id: "a1-printed", format: "printed", priceGhs: 800 },
  { id: "writing-skills-a1-c2-digital", format: "digital", priceGhs: 39 },
];

describe("Falowen Books discovery, currency and checkout safety", () => {
  test("searches titles, CEFR levels and topics without a new server search call", () => {
    expect(matchCatalogTitles(titles, "connectors").map(item => item.id)).toEqual(["writing-skills-a1-c2"]);
    expect(matchCatalogTitles(titles, "A1")).toHaveLength(2);
    expect(matchCatalogTitles(titles, "", "C2").map(item => item.id)).toEqual(["writing-skills-a1-c2"]);
    expect(matchCatalogTitles(titles, "", "all", "printed").map(item => item.id)).toEqual(["a1-course-workbook"]);
    expect(matchCatalogTitles(titles, "invented topic")).toHaveLength(0);
  });

  test("converts only from the provided daily exchange quote; does not invent a rate", () => {
    expect(indicativeUsd(99, { usdToGhs: 11 })).toBe("≈ $9.00 USD");
    expect(indicativeUsd(800, { usdToGhs: 10 })).toBe("≈ $80.00 USD");
    expect(indicativeUsd(99, null)).toBe("");
    expect(indicativeUsd(99, { usdToGhs: 0 })).toBe("");
  });

  test("offers an independently purchasable GH₵39 writing guide and preserves A1 selection", () => {
    const choose = jest.fn();
    render(<BooksCatalog catalogTitles={titles} books={offers} fxQuote={{ usdToGhs: 11 }} onSelectBook={choose} />);
    expect(screen.getByText("GH₵39.00")).toBeInTheDocument();
    expect(screen.getAllByText(/Paystack charges in Ghana cedis/i)).toHaveLength(1);
    const productLinks = screen.getAllByRole("link",{name:"View Book"});
    expect(productLinks).toHaveLength(2);
    expect(productLinks.find(el=>el.getAttribute("href")==="/books/deutsch-a1-course-workbook")).toBeTruthy();
    expect(productLinks.find(el=>el.getAttribute("href")==="/books/how-to-unlock-your-german-writing-skills-a1-c2")).toBeTruthy();
    expect(screen.getByRole("img",{name:/Deutsch A1.*cover/i})).toHaveAttribute("src","/books/a1-cover.svg");
    expect(screen.getByRole("img",{name:/How to Unlock Your German Writing Skills.*cover/i}))
      .toHaveAttribute("src","/books/writing-skills-a1-c2-cover.svg");
    expect(screen.queryByText("Your contact details")).not.toBeInTheDocument();
    expect(choose).not.toHaveBeenCalled();
    fireEvent.change(screen.getByRole("searchbox"), { target: { value: "writing" } });
    expect(screen.getByRole("status")).toHaveTextContent("1 book found");
    expect(screen.getAllByRole("link",{name:"View Book"})).toHaveLength(1);
  });
});

test("only the published A2 course book appears when old guide data is still cached",()=>{
 const retired=["a1-writing-model-exams","a2-four-skills-exam-guide","b1-four-skills-exam-guide"];
 const titles=[
  {id:"a2-course-workbook",title:"Deutsch A2 — Course & Workbook",description:"328-page course book",
   levelTags:["A2"],formats:["digital"],pages:328,status:"available",bookIds:["a2-course-workbook-digital"]},
  ...retired.map(id=>({id,title:id,description:"Retired exam guide",levelTags:["A2"],
   formats:["digital"],pages:50,status:"available",bookIds:[id+"-digital"]})),
 ];
 const offers=[
  {id:"a2-course-workbook-digital",format:"digital",priceGhs:299},
  ...retired.map(id=>({id:id+"-digital",format:"digital",priceGhs:39})),
 ];
 render(<BooksCatalog catalogTitles={titles} books={offers}/>);
 expect(screen.getByText("1 book found")).toBeInTheDocument();
 expect(screen.getByText("GH₵299.00")).toBeInTheDocument();
 expect(screen.getByRole("link",{name:"View Book"}))
  .toHaveAttribute("href","/books/deutsch-a2-course-workbook");
 for(const name of retired)expect(screen.queryByText(name)).not.toBeInTheDocument();
});
test("A2 Course Book replaces the three old exam guides in the real product page map",()=>{
 expect(BOOK_PAGES["a2-course-workbook"]).toEqual({
  href:"/books/deutsch-a2-course-workbook",cover:"/books/a2-cover.svg"
 });
 for(const hidden of ["a1-writing-model-exams","a2-four-skills-exam-guide","b1-four-skills-exam-guide"])
  expect(BOOK_PAGES[hidden]).toBeUndefined();
});

test("B1 digital course book is listed at GH₵399 with its own product route",()=>{
 const titles=[{id:"b1-course-workbook",title:"Deutsch B1 — Course & Workbook",description:"420-page B1 learning course",
  levelTags:["B1"],formats:["digital","printed"],pages:420,status:"available",
  bookIds:["b1-course-workbook-digital","b1-course-workbook-printed"]}];
 const books=[{id:"b1-course-workbook-digital",format:"digital",priceGhs:399},
  {id:"b1-course-workbook-printed",format:"printed",priceGhs:1350}];
 render(<BooksCatalog catalogTitles={titles} books={books}/>);
 expect(screen.getByText("GH₵399.00")).toBeInTheDocument();
 expect(screen.getByText("GH₵1350.00")).toBeInTheDocument();
 expect(screen.getByRole("link",{name:"View Book"})).toHaveAttribute("href","/books/deutsch-b1-course-workbook");
 expect(BOOK_PAGES["b1-course-workbook"].cover).toBe("/books/b1-cover.svg");
});
