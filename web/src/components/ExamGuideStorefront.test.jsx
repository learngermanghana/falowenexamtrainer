import "@testing-library/jest-dom";
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ExamGuideComingSoon from "./ExamGuideComingSoon";

const originals = global.fetch;
beforeEach(()=>{
  global.fetch = jest.fn(async url => {
    if (String(url).includes("/books/catalog")) return {ok:true,json:async()=>({
      paymentsEnabled:true,
      catalogTitles:["a1-writing-model-exams","a2-four-skills-exam-guide","b1-four-skills-exam-guide"].map(id=>({
        id,status:"available",bookIds:[id+"-digital",id+"-printed"],
      })),
      books:[
        {id:"a1-writing-model-exams-digital",priceGhs:29,format:"digital"},
        {id:"a1-writing-model-exams-printed",priceGhs:100,format:"printed"},
        {id:"a2-four-skills-exam-guide-digital",priceGhs:39,format:"digital"},
        {id:"a2-four-skills-exam-guide-printed",priceGhs:200,format:"printed"},
        {id:"b1-four-skills-exam-guide-digital",priceGhs:39,format:"digital"},
        {id:"b1-four-skills-exam-guide-printed",priceGhs:200,format:"printed"},
      ],
    })};
    if(String(url).includes("/fx/usd-ghs"))return {ok:true,json:async()=>({usdToGhs:10})};
    throw Error("No real checkout requests in pricing view tests");
  });
});
afterEach(()=>{global.fetch=originals;});

test.each([
  ["goethe-a1-writing-model-exams","GH₵29.00","GH₵100.00"],
  ["goethe-a2-four-skills-exam-guide","GH₵39.00","GH₵200.00"],
  ["goethe-b1-four-skills-exam-guide","GH₵39.00","GH₵200.00"],
])("%s has its own server-priced digital and print checkout, with GHS charge", async(slug,digital,printed)=>{
  const {unmount}=render(<ExamGuideComingSoon slug={slug}/>);
  await screen.findByText(digital);
  expect(screen.getByText(printed)).toBeInTheDocument();
  expect(screen.getByRole("button",{name:new RegExp("Continue to Paystack")})).toBeEnabled();
  expect(screen.getByText(/Paystack charges in Ghana cedis/)).toBeInTheDocument();
  const printedOption=screen.getByRole("radio",{name:/Printed on demand/});
  fireEvent.click(printedOption);
  expect(screen.getByRole("button",{name:new RegExp(printed.replace("₵","."))})).toBeInTheDocument();
  expect(screen.queryByText(/Coming soon/)).not.toBeInTheDocument();
  unmount();
});

test("failed catalogue does not create misleading checkout or client-side prices",async()=>{
  global.fetch=jest.fn().mockRejectedValue(new Error("offline"));
  render(<ExamGuideComingSoon slug="goethe-b1-four-skills-exam-guide"/>);
  await waitFor(()=>expect(screen.getByText(/Secure checkout is currently unavailable/)).toBeInTheDocument());
  expect(screen.queryByRole("button",{name:/Continue to Paystack/})).not.toBeInTheDocument();
});
