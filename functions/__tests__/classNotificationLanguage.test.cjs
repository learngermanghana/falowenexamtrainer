const test = require("node:test");
const assert = require("node:assert/strict");
const { languageForStudent, classCopy, classActionLabel } = require("../classNotificationCopy");

test("class notifications are available in all four interface languages", () => {
  for (const language of ["en", "de", "fr", "sw"]) {
    const reminder = classCopy({ kind: "fifteen-minutes", sessionLabel: "Day 12", className: "A1", language });
    const change = classCopy({ kind: "rescheduled", sessionLabel: "Day 12", className: "A1", language });
    assert.ok(reminder.title.length > 5);
    assert.match(reminder.body, /Day 12/);
    assert.ok(change.body.includes("A1"));
    assert.ok(classActionLabel("class_checkin_open", language));
    assert.ok(classActionLabel("class_tomorrow", language));
  }
});

test("unknown/unsafe student preference falls back to English", () => {
  assert.equal(languageForStudent("sw-GH"), "sw");
  assert.equal(languageForStudent("fr-FR"), "fr");
  assert.equal(languageForStudent("unsafe"), "en");
  assert.deepEqual(classCopy({ kind: "cancelled", sessionLabel: "Day 2", language: "xx" }),
    classCopy({ kind: "cancelled", sessionLabel: "Day 2", language: "en" }));
});

test("learning programme never affects the notification language", () => {
  const sw = classCopy({ kind: "tomorrow", sessionLabel: "Deutsch A2", language: "sw" });
  const en = classCopy({ kind: "tomorrow", sessionLabel: "Kiswahili A1", language: "en" });
  assert.equal(sw.title, "Darasa kesho");
  assert.equal(en.title, "Class tomorrow");
  assert.equal(classCopy({ kind: "unsupported" }), null);
});
