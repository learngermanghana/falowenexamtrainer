// Only SKU IDs and quantities are stored in the visitor's browser.
// The server alone determines availability, amounts and payment authorization.
export const CART_STORAGE_KEY = "falowen-books-cart-v1";
export const BOOK_URLS = Object.freeze({
  "a1-course-workbook": "/books/deutsch-a1-course-workbook",
  "a2-course-workbook": "/books/deutsch-a2-course-workbook",
  "writing-skills-a1-c2": "/books/how-to-unlock-your-german-writing-skills-a1-c2",
});
export const productHref = titleId => BOOK_URLS[titleId] || "/books";
export const clampBookQuantity = (value, format) => {
  const num = Number(value);
  if (!Number.isInteger(num)) return 1;
  if (format === "digital") return 1;
  return Math.min(10, Math.max(1, num));
};
export const normalizeStoredCart = value => {
  if (!Array.isArray(value)) return [];
  const seen = new Set();
  return value.filter(row => {
    const id = String(row?.bookId || "");
    if (!/^[a-z0-9-]{1,80}$/.test(id) || seen.has(id) || !Number.isInteger(row.quantity)
        || row.quantity < 1 || row.quantity > 10) return false;
    seen.add(id);
    return true;
  }).slice(0, 6).map(row => ({ bookId: row.bookId, quantity: row.quantity }));
};
export const readBookCart = () => {
  try { return normalizeStoredCart(JSON.parse(window.localStorage.getItem(CART_STORAGE_KEY) || "[]")); }
  catch (_) { return []; }
};
export const saveBookCart = items => {
  const clean = normalizeStoredCart(items);
  try { window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(clean)); } catch (_) { /* Memory-only fallback. */ }
  return clean;
};
export const addBookCartItem = (items, book, quantity = 1) => {
  if (!book?.id || !["digital", "printed"].includes(book.format)) return normalizeStoredCart(items);
  const current = normalizeStoredCart(items);
  const nextQuantity = clampBookQuantity(quantity, book.format);
  const existing = current.find(item => item.bookId === book.id);
  if (existing) return current.map(item => item.bookId === book.id
    ? { ...item, quantity: clampBookQuantity(item.quantity + nextQuantity, book.format) } : item);
  return normalizeStoredCart([...current, { bookId: book.id, quantity: nextQuantity }]);
};
export const pricedCartLines = (items, bookOffers) => normalizeStoredCart(items).map(line => {
  const book = bookOffers.find(offer => offer.id === line.bookId);
  if (!book) return { ...line, missing: true, lineTotalGhs: 0 };
  const quantity = clampBookQuantity(line.quantity, book.format);
  return { ...line, book, quantity, lineTotalGhs: quantity * book.priceGhs };
});
