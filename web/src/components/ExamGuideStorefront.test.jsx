import "@testing-library/jest-dom";
import React from "react";
import {render, screen, waitFor} from "@testing-library/react";
import BookProductPage from "./BookProductPage";
import ExamGuideComingSoon from "./ExamGuideComingSoon";
import {BOOK_PAGES} from "./BooksCatalog";

const hidden = [
 "goethe-a1-writing-model-exams",
 "goethe-a2-four-skills-exam-guide",
 "goethe-b1-four-skills-exam-guide",
];

const originalFetch=global.fetch;
beforeEach(()=>{
 global.fetch=jest.fn(async url => {
  if(String(url).includes("/books/catalog"))return {ok:true,json:async()=>({
   paymentsEnabled:true,
   catalogTitles:[
    {id:"a2-course-workbook",title:"Deutsch A2 — Course & Workbook",description:"328 pages of German A2 practice",pages:328,status:"available",bookIds:["a2-course-workbook-digital","a2-course-workbook-printed"],levelTags:["A2"]},
   ],
   books:[{id:"a2-course-workbook-digital",priceGhs:99,format:"digital"},{id:"a2-course-workbook-printed",priceGhs:1050,format:"printed"}],
  })};
  if(String(url).includes("/fx/usd-ghs"))return {ok:true,json:async()=>({usdToGhs:10})};
  throw Error("Unexpected API call");
 });
});
afterEach(()=>{global.fetch=originalFetch;});

test.each(hidden)("%s is no longer a public product page or checkout route", slug => {
 const view=render(<ExamGuideComingSoon slug={slug}/>);
 expect(screen.getByText("Book not found")).toBeInTheDocument();
 expect(screen.queryByRole("link",{name:"Buy Now"})).not.toBeInTheDocument();
 view.unmount();
 const second=render(<BookProductPage slug={slug} checkout/>);
 expect(screen.getByText("Book not found")).toBeInTheDocument();
 expect(screen.queryByLabelText("Full name")).not.toBeInTheDocument();
 second.unmount();
});

test("new A2 book is discoverable with the correct private digital edition",async()=>{
 render(<BookProductPage slug="deutsch-a2-course-workbook"/>);
 expect(await screen.findByRole("link",{name:"Buy Now"})).toHaveAttribute(
  "href","/books/deutsch-a2-course-workbook/checkout?edition=a2-course-workbook-digital"
 );
 expect(screen.getByText("GH₵99.00")).toBeInTheDocument();
 expect(screen.getByText(/Audio is accessed through Falowen/)).toBeInTheDocument();
 expect(screen.getByRole("radio",{name:/Printed on demand/})).toBeInTheDocument();
 const printed=screen.getByRole("radio",{name:/Printed on demand/});
 printed.click();
 expect(screen.getByText("GH₵1050.00")).toBeInTheDocument();
 expect(screen.getByRole("link",{name:"Buy Now"})).toHaveAttribute(
  "href","/books/deutsch-a2-course-workbook/checkout?edition=a2-course-workbook-printed"
 );
 expect(screen.getByRole("button",{name:"Next preview"})).toBeInTheDocument();
 expect(screen.getByText("1 / 4")).toBeInTheDocument();
 expect(screen.getByText(/Full 328-page PDF is delivered privately after verified payment/)).toBeInTheDocument();

 expect(screen.queryByRole("img",{name:/Preview page/})).not.toBeInTheDocument();
 expect(screen.getByRole("region",{name:"Book preview slideshow"})).toHaveTextContent("weil: the verb goes to the end");
 expect(screen.getByRole("region",{name:"Book preview slideshow"})).toHaveTextContent("Neu im Büro");
});

test("only published product slugs remain in storefront maps",()=>{
 expect(BOOK_PAGES["a2-course-workbook"].href).toBe("/books/deutsch-a2-course-workbook");
 for(const id of ["a1-writing-model-exams","a2-four-skills-exam-guide","b1-four-skills-exam-guide"])
  expect(BOOK_PAGES[id]).toBeUndefined();
});

test("failed catalogue does not offer an unverified A2 checkout",async()=>{
 global.fetch=jest.fn().mockRejectedValue(new Error("offline"));
 render(<BookProductPage slug="deutsch-a2-course-workbook"/>);
 await waitFor(()=>expect(screen.getByText(/Book information is unavailable/)).toBeInTheDocument());
 expect(screen.queryByRole("link",{name:"Buy Now"})).not.toBeInTheDocument();
});
