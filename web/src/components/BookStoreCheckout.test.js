import fs from "fs";
import path from "path";
import { A1_SAMPLE_SECTIONS, A1_SAMPLE_DISCLOSURE } from "../data/a1BookSample";

const source = (pathFromComponents) => fs.readFileSync(path.resolve(__dirname, pathFromComponents), "utf8");

describe("Falowen A1 public bookstore launch", () => {
  const bookstore = source("./BookStoreCheckout.js");
  const css = source("./BookStoreCheckout.css");
  const app = source("../App.js");
  const backend = source("../../../functions/functionz/bookCommerce.js");
  const cart = source("./BookShoppingCart.jsx");
  const storebookSafety = () => !backend.includes('"writing-skills-a1-c2-digital": "https://"')
    && bookstore.includes('isWritingGuide ? <WritingGuideDetail')
    && cart.includes("checkout.paystack.com")
    && cart.includes("pricedCartLines");

  test("keeps public storefront routing and secure Paystack receipt verification", () => {
    expect(app).toContain('location.pathname === "/books"');
    expect(app).toContain('location.pathname === "/books/complete"');
    expect(app).toContain("deutsch-a1-course-workbook|deutsch-a2-course-workbook");
    expect(cart).toContain('"/books/checkout"');
    expect(bookstore).toContain('request("/books/verify"');
    expect(cart).toContain("checkout.paystack.com");
    expect(bookstore).not.toContain("PAYSTACK_SECRET");
    expect(backend).toContain('priceGhs: 99');
    expect(backend).toContain('priceGhs: 800');
    expect(backend).toContain('"writing-skills-a1-c2-digital"');
    expect(backend).toContain("priceGhs: 39");
    expect(storebookSafety()).toBe(true);
    expect(bookstore).toContain("Add to cart");
    expect(bookstore).toContain("copyQuantity");
    expect(bookstore).toContain("isCatalogue && <BooksCatalog");
  });

  test("shows the book cover and genuinely labelled free sample", () => {
    expect(bookstore).toContain('"/books/a1-cover.svg"');
    expect(bookstore).toContain('Download free sample PDF');
    expect(bookstore).toContain("exportFreeSample");
    expect(bookstore).toContain("A1_SAMPLE_DISCLOSURE");
    expect(css).toContain("@media (max-width:720px)");
    expect(A1_SAMPLE_SECTIONS.map(section => section.id)).toEqual(["grammar", "knowledge", "workbook"]);
    expect(A1_SAMPLE_DISCLOSURE).toMatch(/reformatted/i);
    expect(A1_SAMPLE_SECTIONS[0].blocks[0].lines[0][0]).toBe("Guten Morgen");
  });

  test("does not falsely promise the final mock, shipping, or immediate delivery", () => {
    expect(bookstore).toMatch(/final mock examination is not included/i);
    expect(bookstore).toMatch(/Delivery is charged separately/i);
    expect(bookstore).toMatch(/No automatic PDF download/i);
    expect(bookstore).not.toContain("guaranteed same-day delivery");
  });
});
