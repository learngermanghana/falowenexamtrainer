import { shouldDispatchA1TimedAutoSubmit } from "./a1TimedAutoSubmitGate";

const ready = { formAvailable: true, submitDisabled: false, cloudDraftReady: true,
  draftLoaded: true, draftConflict: false, finalState: "idle" };

test("expiry submits only after a real form and a fully hydrated non-conflicting draft", () => {
  expect(shouldDispatchA1TimedAutoSubmit(ready)).toBe(true);
  for (const change of [
    { formAvailable: false }, { submitDisabled: true }, { cloudDraftReady: false },
    { draftLoaded: false }, { draftConflict: true },
    { finalState: "saving" }, { finalState: "verified" },
  ]) {
    expect(shouldDispatchA1TimedAutoSubmit({ ...ready, ...change })).toBe(false);
  }
});

test("does not equate the timer being closed with a verified assignment receipt", () => {
  expect(shouldDispatchA1TimedAutoSubmit({ ...ready, finalState: "error" })).toBe(true);
  expect(shouldDispatchA1TimedAutoSubmit({ ...ready, finalState: "verified" })).toBe(false);
});
