"use strict";

// The free listening trial is exactly A1 Hören Sample 1 from the Exams Room.
// Never accept mockId or object-key parameters supplied by a visitor.
const TRIAL_LEVEL = "A1";
const TRIAL_SAMPLE = "sample-1";
const AUDIO_BY_PART = Object.freeze({
  "teil-1": "a1/mock-hoeren/mock-01/teil-1.mp3",
  "teil-2": "a1/mock-hoeren/mock-01/teil-2.mp3",
  "teil-3": "a1/mock-hoeren/mock-01/teil-3.mp3",
});
function resolveTrialAudioRequest(part) {
  if (typeof part !== "string" || !Object.prototype.hasOwnProperty.call(AUDIO_BY_PART, part)) return null;
  return { level: TRIAL_LEVEL, mockId: "mock-01", part, key: AUDIO_BY_PART[part] };
}
module.exports = { TRIAL_LEVEL, TRIAL_SAMPLE, AUDIO_BY_PART, resolveTrialAudioRequest };
