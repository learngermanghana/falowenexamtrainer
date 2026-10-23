import assert from "node:assert/strict";
import test from "node:test";
import { classifyA1PdfCoursePage, isRetryableA1PdfCoursePage } from "./a1PdfAuthState.mjs";

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
