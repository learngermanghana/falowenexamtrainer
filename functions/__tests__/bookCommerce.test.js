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

test("new independent exam guides are catalogue-only until private fulfilment is available", () => {
  for (const [id,pages,level] of [
    ["a1-writing-model-exams",30,"A1"],
    ["a2-four-skills-exam-guide",50,"A2"],
  ]) {
    const item = BOOK_CATALOG_TITLES.find(book => book.id === id);
    assert.ok(item);
    assert.equal(item.status, "coming_soon");
    assert.equal(item.pages, pages);
    assert.deepEqual(item.levelTags, [level]);
    assert.deepEqual(item.bookIds, []);
    assert.match(item.description, /not an official Goethe-Institut publication/i);
  }
  assert.equal(Object.keys(BOOKS).length, 3);
  assert.ok(!BOOKS["a1-writing-model-exams"]);
  assert.ok(!BOOKS["a2-four-skills-exam-guide"]);
});
