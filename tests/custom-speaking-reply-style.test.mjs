import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const source = fs.readFileSync(new URL("../functions/functionz/app.js", import.meta.url), "utf8");

test("custom Goethe chat always returns rich coaching blocks", () => {
  assert.match(source, /Use this reliable structure for every learner message:/);
  assert.match(source, /'Antwort:'/);
  assert.match(source, /'Korrektur:'/);
  assert.match(source, /'Bessere Version:'/);
  assert.match(source, /'Nützlicher Ausdruck:'/);
  assert.match(source, /'Frage:'/);
  assert.match(source, /Do not skip 'Bessere Version:'/);
});

test("reply remains long enough to coach and short enough for complete TTS", () => {
  assert.match(source, /around 80-140 words and below 1000 characters/);
  assert.match(source, /temperature: 0\.55, max_tokens: 520/);
  assert.doesNotMatch(source, /Keep concise: maximum 6 short lines/);
  assert.doesNotMatch(source, /Keep replies short and phone-friendly/);
});
