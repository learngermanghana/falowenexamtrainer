"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const { BOOKS, BOOK_CATALOG_TITLES, priceBookCart, estimatePrintedBookPrice, processBookWebhook } = require("../functionz/bookCommerce");

const orderId = "91869b22-88b0-46f4-b0ac-f224e8275604";
const order = {
  id: orderId, bookId: "a1-printed", title: BOOKS["a1-printed"].title,
  format: "printed", priceGhs: 800, checkoutPesewas: 80000,
  reference: "test_reference_1", email: "reader@example.com", status: "pending",
};
const payment = {
  reference: order.reference, amount: 80000, currency: "GHS", status: "success",
  customer: { email: order.email },
  metadata: { productType: "falowen_book", orderId, bookId: order.bookId, format: "printed", priceGhs: 800 },
};
function fakeAdmin({ existingReceipt = false, placedOrder = order } = {}) {
  const calls = [];
  const db = {
    collection(name) {
      return { doc(id) { return { name, id }; } };
    },
    async runTransaction(handler) {
      const tx = {
        async get(ref) {
          if (ref.name === "bookOrders") return { exists: true, data: () => placedOrder };
          if (ref.name === "bookPayments") return { exists: existingReceipt };
          throw new Error("Unexpected collection");
        },
        create(ref, data) { calls.push({ type: "create", ref, data }); },
        update(ref, data) { calls.push({ type: "update", ref, data }); },
      };
      return handler(tx);
    },
  };
  return {
    firestore: Object.assign(() => db, { FieldValue: { serverTimestamp: () => "now" } }),
    calls,
  };
}

test("A1 printed order has a fixed 800 cedi price", () => {
  assert.equal(BOOKS["a1-printed"].priceGhs, 800);
  assert.equal(BOOKS["a1-digital"].priceGhs, 99);
});

test("valid signed-event payload is reconciled once, without changing tuition", async () => {
  const admin = fakeAdmin();
  const result = await processBookWebhook({ admin, data: payment });
  assert.equal(result.body.status, "synced");
  assert.equal(admin.calls.length, 2);
  assert.equal(admin.calls.find(x => x.type === "update").data.status, "paid");
  assert.deepEqual(admin.calls.map(x => x.ref.name).sort(), ["bookOrders", "bookPayments"]);
});

test("duplicate webhook does not create another payment", async () => {
  const admin = fakeAdmin({ existingReceipt: true });
  const result = await processBookWebhook({ admin, data: payment });
  assert.equal(result.body.status, "duplicate");
  assert.equal(admin.calls.length, 0);
});

test("wrong amount cannot complete an order", async () => {
  const admin = fakeAdmin();
  const result = await processBookWebhook({ admin, data: { ...payment, amount: 9900 } });
  assert.equal(result.body.status, "rejected");
  assert.equal(admin.calls.some(x => x.type === "create"), false);
});

test("wrong reference or customer cannot complete an order", async () => {
  for (const incorrect of [
    { reference: "fake" }, { customer: { email: "not-the-buyer@example.com" } },
    { metadata: { ...payment.metadata, bookId: "a1-digital" } },
  ]) {
    const admin = fakeAdmin();
    const result = await processBookWebhook({ admin, data: { ...payment, ...incorrect } });
    assert.equal(result.body.status, "rejected");
    assert.equal(admin.calls.some(x => x.type === "create"), false);
  }
});

test("A1 quote creates a repeatable printed-book benchmark without activating A2 checkout", () => {
  const a1 = estimatePrintedBookPrice(250);
  const a2 = estimatePrintedBookPrice(441);
  assert.equal(a1.printingPerPageGhs, 2.64);
  assert.equal(a1.sellingPerPageGhs, 3.2);
  assert.equal(a1.estimatedCostGhs, 660);
  assert.equal(a1.suggestedRetailGhs, 800);
  assert.equal(a2.estimatedCostGhs, 1164.24);
  assert.equal(a2.rawRetailGhs, 1411.2);
  assert.equal(a2.suggestedRetailGhs, 1450);
  assert.equal(a2.requiresPrinterQuote, true);
  const a2Title = BOOK_CATALOG_TITLES.find(t => t.id === "a2-course-workbook");
  assert.equal(a2Title.status, "coming_soon");
  assert.deepEqual(a2Title.bookIds, []);
  assert.equal(BOOKS["a2-printed"], undefined);
});

test("cart quantities are priced only from the server-approved SKU catalogue", () => {
  const cart = priceBookCart([
    { bookId: "a1-printed", quantity: 2, unitPriceGhs: 1 },
    { bookId: "writing-skills-a1-c2-digital", quantity: 1 },
  ]);
  assert.equal(cart.totalGhs, 1639);
  assert.equal(cart.checkoutPesewas, 163900);
  assert.equal(cart.copies, 3);
  assert.equal(cart.items[0].lineTotalGhs, 1600);
  assert.match(cart.digest, /^[0-9a-f]{64}$/);
  assert.throws(() => priceBookCart([{ bookId: "a2-printed", quantity: 1 }]), /valid book/);
  assert.throws(() => priceBookCart([{ bookId: "a1-printed", quantity: 0 }]), /valid book/);
  assert.throws(() => priceBookCart([{ bookId: "a1-printed", quantity: 2.5 }]), /valid book/);
  assert.throws(() => priceBookCart([{ bookId: "a1-digital", quantity: 2 }]), /Digital books/);
  assert.throws(() => priceBookCart([
    { bookId: "a1-printed", quantity: 1 }, { bookId: "a1-printed", quantity: 1 },
  ]), /valid book/);
});

test("a combined book order reconciles only the exact signed cart digest, total and customer", async () => {
  const crypto = require("node:crypto");
  const cart = priceBookCart([
    { bookId: "a1-printed", quantity: 2 },
    { bookId: "writing-skills-a1-c2-digital", quantity: 1 },
  ]);
  const placedOrder = {
    ...order, bookId: "cart", title: "Falowen Books order (3 copies)",
    format: "mixed", priceGhs: cart.totalGhs, checkoutPesewas: cart.checkoutPesewas,
    items: cart.items, copies: 3, cartDigest: cart.digest,
  };
  const tx = {
    ...payment, amount: cart.checkoutPesewas,
    metadata: { productType: "falowen_book", orderId, bookId: "cart",
      format: "mixed", priceGhs: cart.totalGhs, cartDigest: cart.digest },
  };
  const admin = fakeAdmin({ placedOrder });
  const ok = await processBookWebhook({ admin, data: tx });
  assert.equal(ok.body.status, "synced");
  const receipt = admin.calls.find(c => c.type === "create").data;
  assert.equal(receipt.items[0].quantity, 2);
  for (const invalid of [
    { ...tx, amount: tx.amount - 100 },
    { ...tx, metadata: { ...tx.metadata, cartDigest: crypto.randomBytes(32).toString("hex") } },
    { ...tx, customer: { email: "wrong@example.com" } },
  ]) {
    const rejected = await processBookWebhook({ admin: fakeAdmin({ placedOrder }), data: invalid });
    assert.equal(rejected.body.status, "rejected");
  }
});

test("A1 and A2 exam guides remain distinct upcoming books with no purchasable SKU", () => {
  const a1Guide = BOOK_CATALOG_TITLES.find(x => x.id === "a1-writing-model-exams");
  const a2Guide = BOOK_CATALOG_TITLES.find(x => x.id === "a2-four-skills-exam-guide");
  assert.ok(a1Guide);
  assert.ok(a2Guide);
  assert.equal(a1Guide.pages, 30);
  assert.equal(a2Guide.pages, 50);
  assert.deepEqual(a1Guide.levelTags, ["A1"]);
  assert.deepEqual(a2Guide.levelTags, ["A2"]);
  for (const guide of [a1Guide, a2Guide]) {
    assert.equal(guide.status, "coming_soon");
    assert.deepEqual(guide.bookIds, []);
    assert.match(guide.description, /independent/i);
    assert.match(guide.description, /not an official Goethe-Institut publication/i);
  }
  assert.equal(Object.keys(BOOKS).some(id => id.includes("exam-guide") || id.includes("writing-model-exams")), false);
  assert.throws(() => priceBookCart([{ bookId: "a1-writing-model-exams-digital", quantity: 1 }]), /Choose a valid book/);
  assert.throws(() => priceBookCart([{ bookId: "a2-four-skills-exam-guide-printed", quantity: 1 }]), /Choose a valid book/);
});

test("A1 printing rate produces provisional but not approved prices for the upcoming 30- and 50-page guides", () => {
  const a1 = estimatePrintedBookPrice(30);
  const a2 = estimatePrintedBookPrice(50);
  assert.equal(a1.estimatedCostGhs, 79.2);
  assert.equal(a1.rawRetailGhs, 96);
  assert.equal(a1.suggestedRetailGhs, 100);
  assert.equal(a2.estimatedCostGhs, 132);
  assert.equal(a2.rawRetailGhs, 160);
  assert.equal(a2.suggestedRetailGhs, 200);
  assert.equal(a1.requiresPrinterQuote, true);
  assert.equal(a2.requiresPrinterQuote, true);
});
