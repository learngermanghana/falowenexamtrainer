import assert from "node:assert/strict";
import test from "node:test";
import { classifyPdfLoginFailure } from "./pdfLoginFailures.mjs";

test("classifies credential errors without echoing an account identifier", () => {
  assert.equal(
    classifyPdfLoginFailure("Password mismatch. The password entered does not match the account for student@example.com."),
    "invalid-credentials",
  );
});

test("classifies locked, expired, disabled and rate-limited account messages", () => {
  assert.equal(classifyPdfLoginFailure("Login blocked because this student record is marked inactive."), "account-blocked");
  assert.equal(classifyPdfLoginFailure("Your contract ended on November 1, 2026."), "account-blocked");
  assert.equal(classifyPdfLoginFailure("This account is currently disabled."), "account-blocked");
  assert.equal(classifyPdfLoginFailure("Too many login attempts were made."), "rate-limited");
});

test("classifies missing accounts, network and Firebase configuration errors", () => {
  assert.equal(classifyPdfLoginFailure("We could not find a matching account."), "account-not-found");
  assert.equal(classifyPdfLoginFailure("We could not connect to the internet."), "network-error");
  assert.equal(classifyPdfLoginFailure("Firebase-Konfiguration fehlt."), "firebase-unconfigured");
});

test("normal login screen copy is not treated as a login failure", () => {
  assert.equal(classifyPdfLoginFailure("Email or student code Password Forgot your password? Log in"), null);
  assert.equal(classifyPdfLoginFailure("Student XYZ - please contact support"), null);
  assert.equal(classifyPdfLoginFailure(""), null);
});
