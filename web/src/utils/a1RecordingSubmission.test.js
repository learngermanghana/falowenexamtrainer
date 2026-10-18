import { buildA1RecordingSubmission } from "./a1RecordingSubmission";
const transcript = "Meine Familie ist klein.";
const draft = { sections: { "teil-2": { recording: { transcript, audioUrl: "https://example.com/audio.webm", feedback: "Do not grade this feedback" } } } };
const args = { assignmentKey: "A1-3", draft, submissionText: `TEIL 1\n1. Es\n\nTEIL 2\n${transcript}` };
test("final payload snapshots playable audio and learner transcript without AI feedback", () => {
  const payload = buildA1RecordingSubmission(args);
  expect(payload.recordings[0]).toMatchObject({ transcript, audioUrl: "https://example.com/audio.webm" });
  expect(JSON.stringify(payload)).not.toContain("Do not grade");
  draft.sections["teil-2"].recording.audioUrl = "https://example.com/changed.webm";
  expect(payload.recordings[0].audioUrl).toBe("https://example.com/audio.webm");
});
test("rejects missing audio or an edited transcript instead of silently dropping the attachment", () => {
  expect(() => buildA1RecordingSubmission({ ...args, draft: {} })).toThrow("save your family recording");
  expect(() => buildA1RecordingSubmission({ ...args, submissionText: "TEIL 2\nOther answer" })).toThrow("must match");
});
test("other assignments keep their existing payload", () => {
  expect(buildA1RecordingSubmission({ assignmentKey: "A1-4" })).toEqual({});
});
