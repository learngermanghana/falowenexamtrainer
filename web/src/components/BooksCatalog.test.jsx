import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import BooksCatalog, { indicativeUsd, matchCatalogTitles } from "./BooksCatalog";

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
  { id: "a1-digital", format: "digital", priceGhs: 99 },
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

test("priced A1 A2 B1 guide catalog cards show editions and direct buyers to each own page", () => {
  const titles = [
    ["a1-writing-model-exams","goethe-a1-writing-model-exams","A1",30,29,100],
    ["a2-four-skills-exam-guide","goethe-a2-four-skills-exam-guide","A2",50,39,200],
    ["b1-four-skills-exam-guide","goethe-b1-four-skills-exam-guide","B1",50,39,200],
  ];
  const items = titles.map(([id,,level,pages])=>({
    id,title:"Falowen "+level+" Exam Guide",description:"Independent exam guide",
    levelTags:[level],topics:["exam"],formats:["digital","printed"],pages,
    status:"available",bookIds:[id+"-digital",id+"-printed"],
  }));
  const offers = titles.flatMap(([id,,,,pdf,print])=>[
    {id:id+"-digital",format:"digital",priceGhs:pdf},
    {id:id+"-printed",format:"printed",priceGhs:print},
  ]);
  render(<BooksCatalog catalogTitles={items} books={offers} onSelectBook={jest.fn()} />);
  for(const [id,slug] of titles) {
    const link=screen.getAllByRole("link",{name:"View editions and buy"})
      .find(a=>a.getAttribute("href")==="/books/"+slug);
    expect(link).toBeTruthy();
  }
  expect(screen.getAllByText("GH₵200.00")).toHaveLength(2);
  expect(screen.queryByText(/Coming soon/)).not.toBeInTheDocument();
  expect(screen.getAllByText("Printed on demand")).toHaveLength(3);
});

test("book landing cards link all three exam guides with the same covers and without checkout controls",()=>{
 const titles=["a1-writing-model-exams","a2-four-skills-exam-guide","b1-four-skills-exam-guide"]
   .map((id,i)=>({id,title:["A1 Writing","A2 Four Skills","B1 Four Skills"][i],
     description:"Independent exam preparation",levelTags:[["A1","A2","B1"][i]],
     formats:["digital","printed"],pages:i?50:30,status:"available",
     bookIds:[id+"-digital",id+"-printed"]}));
 const books=titles.flatMap((title,i)=>[
  {id:title.id+"-digital",format:"digital",priceGhs:i?39:29},
  {id:title.id+"-printed",format:"printed",priceGhs:i?200:100},
 ]);
 render(<BooksCatalog catalogTitles={titles} books={books}/>);
 for(const slug of ["goethe-a1-writing-model-exams","goethe-a2-four-skills-exam-guide","goethe-b1-four-skills-exam-guide"]){
  expect(screen.getAllByRole("link",{name:"View Book"}).some(a=>a.getAttribute("href")==="/books/"+slug)).toBe(true);
 }
 expect(screen.getAllByRole("img",{name:/cover/i})).toHaveLength(3);
 expect(screen.queryByRole("button",{name:/Continue to Paystack/})).not.toBeInTheDocument();
});