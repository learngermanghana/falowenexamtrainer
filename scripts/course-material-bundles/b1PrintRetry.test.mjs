import assert from "node:assert/strict";
import test from "node:test";
import { B1_PRINT_SCALES, shouldRetryB1PrintAudit } from "./b1PrintRetry.mjs";

test("B1 print fallback stays within a bounded readable scale range", () => {
  assert.deepEqual(B1_PRINT_SCALES, [0.95, 0.9, 0.85]);
  assert.ok(B1_PRINT_SCALES.every(scale => scale >= 0.85 && scale <= 0.95));
});

test("only sparse individual B1 pages are eligible for reflow", () => {
  assert.equal(shouldRetryB1PrintAudit(["Page 5 has no meaningful printable content"], 0), true);
  assert.equal(shouldRetryB1PrintAudit(["Page 1 has no meaningful printable content", "Page 5 has no meaningful printable content"], 1), true);
  assert.equal(shouldRetryB1PrintAudit(["Page 5 has no meaningful printable content"], 2), false);
  assert.equal(shouldRetryB1PrintAudit(["Page 5 has no meaningful printable content"], -1), false);
  assert.equal(shouldRetryB1PrintAudit([], 0), false);
});

test("never retry or suppress errors suggesting lost or unsafe lesson content", () => {
  const forbidden = [
    "Page 5 contains an application error",
    "Page 5 contains a React loading screen",
    "Page 5 contains an unresolved lesson Loading placeholder",
    "Page 5 contains an unresolved audio-loading placeholder",
    "Expected 5 PDF pages; extracted 4",
    "Page 5 contains only online knowledge-test buttons",
  ];
  for (const fault of forbidden) {
    assert.equal(shouldRetryB1PrintAudit([fault], 0), false, fault);
  }
  assert.equal(shouldRetryB1PrintAudit([
    "Page 5 has no meaningful printable content",
    "Page 2 contains an application error",
  ], 0), false);
});
