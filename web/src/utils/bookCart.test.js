import { addBookCartItem, clampBookQuantity, normalizeStoredCart, pricedCartLines, productHref } from "./bookCart";

const a1Printed = { id: "a1-printed", format: "printed", priceGhs: 800 };
const writingGuide = { id: "writing-skills-a1-c2-digital", format: "digital", priceGhs: 39 };

test("each book has a shareable product URL", () => {
  expect(productHref("a1-course-workbook")).toBe("/books/deutsch-a1-course-workbook");
  expect(productHref("a2-course-workbook")).toBe("/books/deutsch-a2-course-workbook");
  expect(productHref("writing-skills-a1-c2")).toBe("/books/how-to-unlock-your-german-writing-skills-a1-c2");
  expect(productHref("a1-writing-model-exams")).toBe("/books/goethe-a1-writing-model-exams");
  expect(productHref("a2-four-skills-exam-guide")).toBe("/books/goethe-a2-four-skills-exam-guide");
});

test("cart totals use catalog prices, not a client-submitted override", () => {
  let cart = addBookCartItem([], a1Printed, 2);
  cart = addBookCartItem(cart, writingGuide, 1);
  const priced = pricedCartLines(cart, [a1Printed, writingGuide]);
  expect(priced.map(x => x.lineTotalGhs)).toEqual([1600, 39]);
  expect(priced.reduce((sum, row) => sum + row.lineTotalGhs, 0)).toBe(1639);
  cart = addBookCartItem(cart, a1Printed, 1);
  expect(cart.find(x => x.bookId === "a1-printed").quantity).toBe(3);
});

test("digital quantity never exceeds one; printed quantities are bounded", () => {
  expect(clampBookQuantity(9, "digital")).toBe(1);
  expect(clampBookQuantity(12, "printed")).toBe(10);
  expect(addBookCartItem([{ bookId: writingGuide.id, quantity: 1 }], writingGuide, 6)[0].quantity).toBe(1);
  expect(normalizeStoredCart([
    { bookId: "a1-printed", quantity: 2 }, { bookId: "a1-printed", quantity: 3 },
    { bookId: "a1-digital", quantity: -1 }
  ])).toEqual([{ bookId: "a1-printed", quantity: 2 }]);
});
