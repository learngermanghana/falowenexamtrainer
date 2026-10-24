"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const crypto = require("node:crypto");
const { registerBookCommerceRoutes, BOOKS } = require("../functionz/bookCommerce");

const orderId = "91869b22-88b0-46f4-b0ac-f224e8275604";
const key = "a".repeat(48);
const reference = "paystack_receipt_A1";
const paid = {
  domain: "live", reference, amount: 80000, currency: "GHS", status: "success",
  customer: { email: "reader@example.com" },
  metadata: { productType: "falowen_book", orderId, bookId: "a1-printed", format: "printed", priceGhs: 800 },
};

function fixture() {
  const order = {
    id: orderId, bookId: "a1-printed", title: BOOKS["a1-printed"].title,
    email: "reader@example.com", format: "printed", priceGhs: 800,
    checkoutPesewas: 80000, reference,
    lookupKeyHash: crypto.createHash("sha256").update(key).digest("hex"),
    status: "pending",
  };
  let receipt = null;
  let verifiedFetches = 0;
  const db = {
    collection(name) {
      return {
        doc(id) {
          return {
            name, id, async get() {
              return name === "bookOrders"
                ? { exists: true, data: () => ({ ...order }) }
                : { exists: Boolean(receipt), data: () => receipt };
            },
          };
        },
      };
    },
    async runTransaction(callback) {
      const tx = {
        get: doc => doc.get(),
        update: (doc, values) => {
          if (doc.name !== "bookOrders") throw Error("Unexpected write");
          Object.assign(order, values);
        },
        create: (doc, data) => {
          if (doc.name !== "bookPayments") throw Error("Unexpected receipt");
          receipt = data;
        },
      };
      return callback(tx);
    },
  };
  const admin = { firestore: Object.assign(() => db, { FieldValue: { serverTimestamp: () => "now" } }) };
  const handlers = {};
  const app = {
    post(path, handler) { handlers[`POST ${path}`] = handler; },
    get(path, handler) { handlers[`GET ${path}`] = handler; },
  };
  registerBookCommerceRoutes(app, { admin });
  const run = async (route, body, query = {}) => {
    const res = {
      statusCode: 200,
      headers: {},
      set(name, value) { this.headers[name] = value; return this; },
      status(code) { this.statusCode = code; return this; },
      json(payload) { this.body = payload; return this; },
    };
    await handlers[route]({ body, query }, res);
    return res;
  };
  return {
    order, run, get receipt() { return receipt; },
    get fetched() { return verifiedFetches; },
    setFetchData(transaction) {
      global.fetch = async url => {
        assert.equal(url, `https://api.paystack.co/transaction/verify/${reference}`);
        verifiedFetches += 1;
        return { ok: true, json: async () => ({ status: true, data: transaction }) };
      };
    },
  };
}

test.beforeEach(() => { process.env.PAYSTACK_SECRET = "test-only-secret"; });
test.afterEach(() => { delete process.env.PAYSTACK_SECRET; delete process.env.FALOWEN_BOOK_PAYMENTS_ENABLED; delete global.fetch; });

test("receipt confirmation rejects invalid or missing private order keys without asking Paystack", async () => {
  const x = fixture();
  x.setFetchData(paid);
  const result = await x.run("POST /books/verify", { order: orderId, key: "b".repeat(48) });
  assert.equal(result.statusCode, 403);
  assert.equal(x.fetched, 0);
  assert.equal(x.receipt, null);
});

test("Paystack-verified printed receipt records a single paid book order", async () => {
  const x = fixture();
  x.setFetchData(paid);
  const result = await x.run("POST /books/verify", { order: orderId, key });
  assert.equal(result.statusCode, 200);
  assert.equal(result.body.status, "paid");
  assert.equal(result.body.reference, reference);
  assert.equal(x.order.status, "paid");
  assert.equal(x.receipt.checkoutPesewas, 80000);
  const details = await x.run("GET /books/order", {}, { order: orderId, key });
  assert.equal(details.body.reference, reference);
  assert.equal(details.body.status, "paid");
  const repeat = await x.run("POST /books/verify", { order: orderId, key });
  assert.equal(repeat.body.status, "paid");
  assert.equal(x.fetched, 1);
});

test("Paystack payment pending does not produce a confirmed receipt", async () => {
  const x = fixture();
  x.setFetchData({ ...paid, status: "pending" });
  const result = await x.run("POST /books/verify", { order: orderId, key });
  assert.equal(result.body.status, "pending");
  assert.equal(x.order.status, "pending");
  assert.equal(x.receipt, null);
});

test("wrong Paystack receipt amount cannot be confirmed", async () => {
  const x = fixture();
  x.setFetchData({ ...paid, amount: 9900 });
  const result = await x.run("POST /books/verify", { order: orderId, key });
  assert.equal(result.statusCode, 409);
  assert.equal(x.order.status, "rejected");
  assert.equal(x.receipt, null);
});

test("buyer can check status but cannot verify repeatedly inside cooldown", async () => {
  const x = fixture();
  x.setFetchData({ ...paid, status: "pending" });
  await x.run("POST /books/verify", { order: orderId, key });
  const second = await x.run("POST /books/verify", { order: orderId, key });
  assert.equal(second.body.status, "pending");
  assert.equal(second.body.retryAfterSeconds, 30);
  assert.equal(x.fetched, 1);
});

test("live checkout refuses test-mode Paystack receipts", async () => {
  process.env.FALOWEN_BOOK_PAYMENTS_ENABLED = "true";
  const x = fixture();
  x.setFetchData({ ...paid, domain: "test" });
  const result = await x.run("POST /books/verify", { order: orderId, key });
  assert.equal(result.statusCode, 409);
  assert.equal(x.order.status, "pending");
  assert.equal(x.receipt, null);
});

test("Paystack serialized metadata can verify a live receipt", async () => {
  process.env.FALOWEN_BOOK_PAYMENTS_ENABLED = "true";
  const x = fixture();
  x.setFetchData({ ...paid, metadata: JSON.stringify(paid.metadata) });
  const result = await x.run("POST /books/verify", { order: orderId, key });
  assert.equal(result.body.status, "paid");
  assert.equal(x.receipt.status, "paid");
});
