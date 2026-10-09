import test from "node:test";
import assert from "node:assert/strict";
import { appendA1MockIntegrityEvent, A1_INTEGRITY_MESSAGES } from "./a1MockIntegrity.mjs";

test("A1 integrity records section and counts without answer content", () => {
  const first = appendA1MockIntegrityEvent({}, "tab_hidden", "lesen", Date.UTC(2026, 9, 9, 19, 0));
  const second = appendA1MockIntegrityEvent(first, "paste_attempt", "schreiben", Date.UTC(2026, 9, 9, 19, 2));
  assert.equal(second.counts.tab_hidden, 1);
  assert.equal(second.counts.paste_attempt, 1);
  assert.equal(second.events[0].section, "lesen");
  assert.deepEqual(Object.keys(second.events[1]).sort(), ["at", "section", "type"]);
  assert.equal(second.events[1].type, "paste_attempt");
});
test("A1 integrity caps recent events but preserves total counts", () => {
  let state = {};
  for (let i = 0; i < 41; i++) {
    state = appendA1MockIntegrityEvent(state, "window_blur", "hoeren", Date.UTC(2026, 9, 9, 19) + i * 1000);
  }
  assert.equal(state.counts.window_blur, 41);
  assert.equal(state.events.length, 30);
  assert.equal(state.events[0].type, "window_blur");
  assert.ok(A1_INTEGRITY_MESSAGES.fullscreen_exit);
});
test("unexpected event kinds do not become student misconduct flags", () => {
  const current = { counts: {}, events: [] };
  assert.equal(appendA1MockIntegrityEvent(current, "used_chatgpt", "lesen"), current);
});
