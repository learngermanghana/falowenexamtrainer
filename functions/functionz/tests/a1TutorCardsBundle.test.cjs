"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const root = path.resolve(__dirname, "../../..");
test("runtime A1 tutor speaking cards ship within Firebase functions source", () => {
  const canonical = JSON.parse(fs.readFileSync(path.join(root,"shared/a1GoetheTeil3PictureCards.json"),"utf8"));
  const bundled = JSON.parse(fs.readFileSync(path.join(root,"functions/data/a1GoetheTeil3PictureCards.json"),"utf8"));
  assert.deepEqual(bundled,canonical);
  assert.equal(bundled.length,18);
  const source = fs.readFileSync(path.join(root,"functions/functionz/a1TutorSpeakingScore.js"),"utf8");
  assert.ok(source.includes('require("../data/a1GoetheTeil3PictureCards.json")'));
  assert.ok(!source.includes('../../shared/'));
});
