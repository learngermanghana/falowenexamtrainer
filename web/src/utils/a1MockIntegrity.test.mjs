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

test("the shared integrity hook covers all current mock interfaces", async () => {
  const fs = await import("node:fs");
  const path = await import("node:path");
  const names = [
    "A2FinalMockExamPage.jsx",
    "B1FinalMockExamPage.jsx",
    "B2FinalMockExamPage.jsx",
    "C1FinalMockExamPage.jsx",
    "A2Mock2ExamHub.jsx",
  ];
  for (const name of names) {
    const contents = fs.readFileSync(path.resolve("web/src/components", name), "utf8");
    assert.match(contents, /useMockExamIntegrity\(/, name);
    assert.match(contents, /MockExamIntegrityNotice/, name);
    assert.match(contents, /onPasteCapture=\{integrity\.onPasteCapture\}/, name);
    assert.match(contents, /onCopyCapture=\{integrity\.onCopyCapture\}/, name);
    assert.match(contents, /integrity\.requestFullscreen\(\)/, name);
  }
  const hook = fs.readFileSync("web/src/hooks/useMockExamIntegrity.jsx", "utf8");
  assert.match(hook, /\/mock\/attempt\/integrity-event/);
  assert.match(hook, /keepalive: true/);
  const app = fs.readFileSync("functions/functionz/app.js", "utf8");
  assert.match(app, /app\.post\("\/mock\/attempt\/integrity-event"/);
  assert.match(app, /A2: new Set/);
  assert.match(app, /B1: new Set/);
  assert.match(app, /B2: new Set/);
  assert.match(app, /C1: new Set/);
});
