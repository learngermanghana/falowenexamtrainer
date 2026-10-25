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

  test("every book opens its own canonical product URL, including coming-soon titles", () => {
    const all = [...titles, { id: "a2-course-workbook", title: "Deutsch A2 — Course & Workbook",
      description: "A2 German course", levelTags: ["A2"], formats: ["digital", "printed"],
      pages: 441, status: "coming_soon", bookIds: [] }];
    render(<BooksCatalog catalogTitles={all} books={offers} fxQuote={{ usdToGhs: 11 }} />);
    expect(screen.getByText("GH₵39.00")).toBeInTheDocument();
    expect(screen.getAllByText(/Paystack charges in Ghana cedis/i)).toHaveLength(1);
    const detailLinks = screen.getAllByRole("link", { name: "View book and editions" });
    expect(detailLinks).toHaveLength(2);
    expect(detailLinks[0]).toHaveAttribute("href", "/books/deutsch-a1-course-workbook");
    expect(detailLinks[1]).toHaveAttribute("href", "/books/how-to-unlock-your-german-writing-skills-a1-c2");
    expect(screen.getByRole("link", { name: "Explore upcoming book" }))
      .toHaveAttribute("href", "/books/deutsch-a2-course-workbook");
    expect(screen.getByText(/Checkout is not available yet/)).toBeInTheDocument();
    fireEvent.change(screen.getByRole("searchbox"), { target: { value: "writing" } });
    expect(screen.getByRole("status")).toHaveTextContent("1 book found");
    expect(screen.getAllByRole("link", { name: "View book and editions" })).toHaveLength(1);
  });
});
