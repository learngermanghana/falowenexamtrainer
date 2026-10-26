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
        id,title:id,description:"Independent guide",levelTags:["A1"],pages:50,status:"available",bookIds:[id+"-digital",id+"-printed"],
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
  expect(screen.getByRole("link",{name:"Buy Now"})).toHaveAttribute("href",`/books/${slug}/checkout?edition=${slug.replace(/^goethe-/, "")}-digital`);
  expect(screen.queryByLabelText("Full name")).not.toBeInTheDocument();
  const printedOption=screen.getByRole("radio",{name:/Printed book/});
  fireEvent.click(printedOption);
  expect(screen.getByRole("link",{name:"Buy Now"})).toHaveAttribute("href",`/books/${slug}/checkout?edition=${slug.replace(/^goethe-/, "")}-printed`);
  expect(screen.queryByText(/Coming soon/)).not.toBeInTheDocument();
  unmount();
});

test("failed catalogue does not create misleading checkout or client-side prices",async()=>{
  global.fetch=jest.fn().mockRejectedValue(new Error("offline"));
  render(<ExamGuideComingSoon slug="goethe-b1-four-skills-exam-guide"/>);
  await waitFor(()=>expect(screen.getByText(/Book information is unavailable/)).toBeInTheDocument());
  expect(screen.queryByRole("button",{name:/Continue to Paystack/})).not.toBeInTheDocument();
});

test.each([
  "goethe-a1-writing-model-exams",
  "goethe-a2-four-skills-exam-guide",
  "goethe-b1-four-skills-exam-guide",
])("%s uses exactly one correct canonical and restores the homepage canonical after navigation", slug => {
  const current = [...document.head.querySelectorAll('link[rel="canonical"]')];
  const homeCanonical = current[0] || document.createElement("link");
  const hadExisting = current.length > 0;
  const originalHref = hadExisting ? homeCanonical.getAttribute("href") : null;
  if (!hadExisting) {
    homeCanonical.rel = "canonical";
    document.head.appendChild(homeCanonical);
  }
  homeCanonical.href = "https://www.falowen.app/";
  try {
    const originalCount = document.head.querySelectorAll('link[rel="canonical"]').length;
    const view = render(<ExamGuideComingSoon slug={slug} />);
    const links = document.head.querySelectorAll('link[rel="canonical"]');
    expect(links).toHaveLength(originalCount);
    expect(links[0]).toBe(homeCanonical);
    expect(homeCanonical.getAttribute("href")).toBe("https://www.falowen.app/books/" + slug);
    view.unmount();
    expect(document.head.querySelectorAll('link[rel="canonical"]')).toHaveLength(originalCount);
    expect(homeCanonical.getAttribute("href")).toBe("https://www.falowen.app/");
  } finally {
    if (!hadExisting) homeCanonical.remove();
    else if (originalHref === null) homeCanonical.removeAttribute("href");
    else homeCanonical.setAttribute("href", originalHref);
  }
});

test("a missing HTML canonical is created for an exam guide and removed on unmount", () => {
  const previous = [...document.head.querySelectorAll('link[rel="canonical"]')];
  previous.forEach(link=>link.remove());
  try {
    const view = render(<ExamGuideComingSoon slug="goethe-b1-four-skills-exam-guide" />);
    const links = [...document.head.querySelectorAll('link[rel="canonical"]')];
    expect(links).toHaveLength(1);
    expect(links[0]).toHaveAttribute("href","https://www.falowen.app/books/goethe-b1-four-skills-exam-guide");
    view.unmount();
    expect(document.head.querySelectorAll('link[rel="canonical"]')).toHaveLength(0);
  } finally {
    previous.forEach(link=>document.head.appendChild(link));
  }
});
