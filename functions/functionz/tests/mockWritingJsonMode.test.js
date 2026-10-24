"use strict";
const fs = require("fs");
const path = require("path");

describe("mock Schreiben AI marking reliability", () => {
  const source = fs.readFileSync(path.join(__dirname, "../app.js"), "utf8");

  test.each(["a1", "a2", "b1", "b2"])("%s requests structured JSON from the AI scorer", (level) => {
    const start = source.indexOf(`app.post("/writing/${level}-mock-score"`);
    const end = source.indexOf("app.post(", start + 12);
    expect(start).toBeGreaterThan(0);
    const route = source.slice(start, end === -1 ? undefined : end);
    expect(route).toContain("response_format: { type: \"json_object\" }");
    expect(route).toContain("pendingQuotaDate = quota.date;");
    expect(route).toContain("await refundFailedMarking();");
    expect(route).toContain('pendingQuotaDate = "";');
    expect(route.indexOf("await refundFailedMarking();")).toBeLessThan(route.indexOf('status(502)'));

    expect(route).toContain('JSON.parse(cleanedReply)');
    expect(route).toContain('status(502)');
    // Never persist or advance an attempt when grading returned invalid JSON.
    if (level !== "b2") expect(route.indexOf("JSON.parse(cleanedReply)")).toBeLessThan(route.indexOf("persistVerified"));
  });
});

describe("mock-writing request quota refunds", () => {
  const source = fs.readFileSync(path.join(__dirname, "../app.js"), "utf8");
  test("reserves the exact daily quota date and refunds failed marking with Firestore transaction", () => {
    expect(source).toContain("date: today");
    const start = source.indexOf("async function refundFailedMockWritingQuota(");
    const end = source.indexOf("async function auditAIRequest(", start);
    const refund = source.slice(start, end);
    expect(start).toBeGreaterThan(0);
    expect(refund).toContain('db.collection("usageQuotas").doc(uid)');
    expect(refund).toContain("db.runTransaction");
    expect(refund).toContain("if (count <= 0) return;");
    expect(refund).toContain("[category]: count - 1");
  });
});
