import assert from "node:assert/strict";
import test from "node:test";
import { classifyA1PdfCoursePage, isRetryableA1PdfCoursePage, matchesA1PdfCourseRoute } from "./a1PdfAuthState.mjs";

const lessonUrl = "https://www.falowen.app/campus/course/basic-greetings-goodbyes-and-how-you-are-day-1";
const validLesson = "German A1 — Basic Greetings and Goodbyes. ".repeat(6);
const classify = (extra = {}) => classifyA1PdfCoursePage({
  url: lessonUrl,
  expectedUrl: lessonUrl,
  text: validLesson,
  mainText: validLesson,
  ...extra,
});

test("recognizes a hydrated authenticated course page", () => {
  assert.equal(classify(), "ready");
});

test("rejects a long public login page even if it shares the requested URL", () => {
  assert.equal(classify({
    text: "Returning Falowen student — Email or student code. ".repeat(8),
    mainText: "Returning Falowen student — Email or student code. ".repeat(8),
  }), "public-shell");
  assert.equal(isRetryableA1PdfCoursePage("public-shell"), true);
});

test("rejects an app loader and short intermediary content", () => {
  assert.equal(classify({ text: "Loading the app…", mainText: "Loading the app…" }), "loading");
  assert.equal(classify({ mainText: "Welcome back!" }), "loading");
});

test("does not treat unrelated exam-page redirects as an auth hydration retry", () => {
  assert.equal(classify({ url: "https://www.falowen.app/exams/writing" }), "wrong-route");
  assert.equal(isRetryableA1PdfCoursePage("wrong-route"), false);
});

test("rejects failed application screens", () => {
  assert.equal(classify({ text: "Unexpected Application Error" }), "app-error");
  assert.equal(isRetryableA1PdfCoursePage("app-error"), false);
});

test("accepts a normal Falowen www to apex host redirect on the same lesson", () => {
  const requested = "https://www.falowen.app/campus/course/two-case-prepositions-wechselpraepositionen-day-18";
  const actual = "https://falowen.app/campus/course/two-case-prepositions-wechselpraepositionen-day-18/";
  assert.equal(matchesA1PdfCourseRoute(actual, requested), true);
  assert.equal(classify({ url: actual, expectedUrl: requested }), "ready");
});

test("rejects redirects to unrelated sites and other Falowen courses", () => {
  const expected = "https://www.falowen.app/campus/course/two-case-prepositions-wechselpraepositionen-day-18";
  assert.equal(matchesA1PdfCourseRoute("https://evil-falowen.app/campus/course/two-case-prepositions-wechselpraepositionen-day-18", expected), false);
  assert.equal(matchesA1PdfCourseRoute("https://www.falowen.app/campus/course/other-lesson", expected), false);
  assert.equal(matchesA1PdfCourseRoute("http://falowen.app/campus/course/two-case-prepositions-wechselpraepositionen-day-18", expected), false);
  assert.equal(matchesA1PdfCourseRoute("https://www.falowen.app/login", expected), false);
});
