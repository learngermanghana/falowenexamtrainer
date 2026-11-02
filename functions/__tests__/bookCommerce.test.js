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
function fakeAdmin({ existingReceipt = false } = {}) {
  const calls = [];
  const db = {
    collection(name) {
      return { doc(id) { return { name, id }; } };
    },
    async runTransaction(handler) {
      const tx = {
        async get(ref) {
          if (ref.name === "bookOrders") return { exists: true, data: () => order };
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

test("new A2 course book is the only A2 shop product and old guides cannot be sold", () => {
  const a2 = BOOK_CATALOG_TITLES.find(item => item.id === "a2-course-workbook");
  assert.ok(a2);
  assert.equal(a2.pages, 328);
  assert.equal(a2.status, "available");
  assert.deepEqual(a2.bookIds, ["a2-course-workbook-digital"]);
  assert.deepEqual(a2.formats, ["digital"]);
  assert.equal(BOOKS["a2-course-workbook-digital"].priceGhs, 99);
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
  assert.equal(BOOKS["a1-digital"].priceGhs, 99);
  assert.equal(BOOKS["a1-printed"].priceGhs, 800);
  assert.equal(BOOKS["writing-skills-a1-c2-digital"].priceGhs, 39);
  assert.equal(Object.keys(BOOKS).length, 10);
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
    "a1-course-workbook", "writing-skills-a1-c2", "a2-course-workbook"
  ]);
  assert.deepEqual(payload.books.map(book => book.id).sort(), [
    "a1-digital", "a1-printed", "writing-skills-a1-c2-digital", "a2-course-workbook-digital"
  ].sort());
});
