const test = require("node:test");
const assert = require("node:assert/strict");
const { paymentReminderCopy, markedAssignmentCopy, classNoteCopy } = require("../studentNotificationCopy");

test("payment reminders are localized without changing amounts or deadlines", () => {
  for (const language of ["en", "de", "fr", "sw"]) {
    const today = paymentReminderCopy({ daysLeft: 0, amount: "GHS 300.00", language });
    const upcoming = paymentReminderCopy({ daysLeft: 3, amount: "GHS 300.00", language });
    assert.match(today.body, /GHS 300\.00/);
    assert.match(upcoming.body, /GHS 300\.00/);
    assert.notEqual(today.title, upcoming.title);
  }
});

test("marked-work notices do not translate grades or authored feedback", () => {
  const sw = markedAssignmentCopy({ scoreLabel: "85/100", passed: true, language: "sw" });
  const de = markedAssignmentCopy({ scoreLabel: "45/100", passed: false, language: "de" });
  assert.match(sw.body, /85\/100/);
  assert.match(de.body, /45\/100/);
  assert.notEqual(sw.title, de.title);
});

test("class-note wrapper localizes while preserving tutor-authored body", () => {
  const helper = x => x.slice(0, 140);
  const original = "Please revise Teil 2";
  const sw = classNoteCopy({ note: { title: "Grammar", body: original }, isTutorPost: true, language: "sw", truncate: helper });
  const en = classNoteCopy({ note: { title: "Grammar", body: original }, isTutorPost: true, language: "en", truncate: helper });
  assert.equal(sw.body, original);
  assert.equal(en.body, original);
  assert.notEqual(sw.title, en.title);
});
