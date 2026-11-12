"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const { BOOKS, BOOK_CATALOG_TITLES, processBookWebhook } = require("../functionz/bookCommerce");

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
function fakeAdmin({ existingReceipt = false, existingOrder = order } = {}) {
  const calls = [];
  const db = {
    collection(name) {
      return { doc(id) { return { name, id }; } };
    },
    async runTransaction(handler) {
      const tx = {
        async get(ref) {
          if (ref.name === "bookOrders") return { exists: true, data: () => existingOrder };
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
  assert.equal(BOOKS["a1-digital"].priceGhs, 249);
});

test("valid signed-event payload is reconciled once, without changing tuition", async () => {
  const admin = fakeAdmin();
  const result = await processBookWebhook({ admin, data: payment });
  assert.equal(result.body.status, "synced");
  assert.equal(admin.calls.length, 2);
  assert.equal(admin.calls.find(x => x.type === "update").data.status, "paid");
  assert.deepEqual(admin.calls.map(x => x.ref.name).sort(), ["bookOrders", "bookPayments"]);
});

test("existing GH₵99 digital orders can still be verified after the price increases to GH₵249", async () => {
  const oldOrder = {
    ...order, bookId: "a1-digital", title: BOOKS["a1-digital"].title,
    format: "digital", priceGhs: 99, checkoutPesewas: 9900,
    reference: "historic_a1_digital_99",
  };
  const oldPayment = {
    ...payment, reference: oldOrder.reference, amount: 9900,
    metadata: { productType: "falowen_book", orderId, bookId: oldOrder.bookId, format: "digital", priceGhs: 99 },
  };
  const admin = fakeAdmin({ existingOrder: oldOrder });
  const result = await processBookWebhook({ admin, data: oldPayment });
  assert.equal(result.body.status, "synced");
  const paidReceipt = admin.calls.find(x => x.type === "create").data;
  assert.equal(paidReceipt.amountGhs, 99);
  assert.equal(BOOKS["a1-digital"].priceGhs, 249);
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

test("new A2 course book is the only A2 shop product and old guides cannot be sold", () => {
  const a2 = BOOK_CATALOG_TITLES.find(item => item.id === "a2-course-workbook");
  assert.ok(a2);
  assert.equal(a2.pages, 328);
  assert.equal(a2.status, "available");
  assert.deepEqual(a2.bookIds, ["a2-course-workbook-digital", "a2-course-workbook-printed"]);
  assert.deepEqual(a2.formats, ["digital", "printed"]);
  assert.equal(BOOKS["a2-course-workbook-digital"].priceGhs, 299);
  assert.equal(BOOKS["a2-course-workbook-printed"].priceGhs, 1050);
  const hiddenIds = [
    "a1-writing-model-exams",
    "a2-four-skills-exam-guide",
    "b1-four-skills-exam-guide",
  ];
  for (const id of hiddenIds) {
    assert.equal(BOOK_CATALOG_TITLES.some(item => item.id === id), false, id);
    // Preserve old orders and their paid receipt records in the back end.
    assert.ok(BOOKS[id + "-digital"]);
    assert.ok(BOOKS[id + "-printed"]);
  }
  assert.equal(BOOKS["a1-digital"].priceGhs, 249);
  assert.equal(BOOKS["a1-printed"].priceGhs, 800);
  assert.equal(BOOKS["writing-skills-a1-c2-digital"].priceGhs, 79);
  assert.equal(BOOKS["writing-skills-a1-c2-printed"].priceGhs, 250);
  assert.equal(Object.keys(BOOKS).length, 14);
});

test("public books catalog does not expose the historical unlisted exam-guide SKUs", () => {
  const { registerBookCommerceRoutes } = require("../functionz/bookCommerce");
  const handlers = {};
  registerBookCommerceRoutes({
    get: (route, fn) => { handlers[route] = fn; },
    post: () => {},
  }, { admin: { firestore: () => { throw new Error("Catalog should not access Firestore"); } } });
  let payload;
  handlers["/books/catalog"]({}, {
    set: () => {},
    json: value => { payload = value; },
  });
  assert.deepEqual(payload.catalogTitles.map(book => book.id), [
    "a1-course-workbook", "writing-skills-a1-c2", "a2-course-workbook", "b1-course-workbook"
  ]);
  assert.deepEqual(payload.books.map(book => book.id).sort(), [
    "a1-digital", "a1-printed", "writing-skills-a1-c2-digital", "writing-skills-a1-c2-printed", "a2-course-workbook-digital", "a2-course-workbook-printed", "b1-course-workbook-digital", "b1-course-workbook-printed"
  ].sort());
  const writing = payload.catalogTitles.find(title => title.id === "writing-skills-a1-c2");
  assert.equal(writing.pages, 68);
  assert.deepEqual(writing.formats, ["digital", "printed"]);
  assert.deepEqual(writing.bookIds, ["writing-skills-a1-c2-digital", "writing-skills-a1-c2-printed"]);
  assert.equal(payload.books.find(book => book.id === "writing-skills-a1-c2-digital").deliveryMode, "manual_email");
  assert.equal(payload.books.find(book => book.id === "writing-skills-a1-c2-printed").deliveryMode, "print_on_demand");
});
