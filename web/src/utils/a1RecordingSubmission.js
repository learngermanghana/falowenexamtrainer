// Snapshot the recording into the immutable final submission, not just its draft.
export function buildA1RecordingSubmission({ assignmentKey, submissionText, draft }) {
  const key = String(assignmentKey || "").toUpperCase();
  if (key === "A1-5.9") {
    const recordings = ["teil-1", "teil-2", "teil-3"].flatMap((sectionKey) => {
      const recording = draft?.sections?.[sectionKey]?.recording;
      const transcript = String(recording?.transcript || "").trim();
      const audioUrl = String(recording?.audioUrl || "").trim();
      if (!transcript || !/^https:\/\//i.test(audioUrl)) return [];
      return [{ sectionKey, audioUrl, transcript, savedAt: String(recording.savedAt || "") }];
    });
    return { recordings, workbookRevision: "a1-5.9-tutor-speaking-v1" };
  }
  if (key !== "A1-3") return {};
  const recording = draft?.sections?.["teil-2"]?.recording;
  const transcript = String(recording?.transcript || "").trim();
  const audioUrl = String(recording?.audioUrl || "").trim();
  if (!transcript || !/^https:\/\//i.test(audioUrl)) {
    throw new Error("Return to Teil 2 and save your family recording before submitting.");
  }
  const part2 = String(submissionText || "").match(/(?:^|\n)TEIL\s+2\s*\n([\s\S]*?)(?=\nTEIL\s+\d+\b|$)/i)?.[1]?.trim();
  if (part2 !== transcript) {
    throw new Error("Teil 2 must match your saved recording. Return to the workbook to restore it before submitting.");
  }
  return {
    workbookRevision: draft?.sections?.["teil-3"]?.revision === "a1-3-recorded-family-grammar-v2" ? "a1-3-recorded-family-grammar-v2" : "a1-3-recorded-family-v1",
    recordings: [{ sectionKey: "teil-2", audioUrl, transcript, savedAt: String(recording.savedAt || recording.markedAt || "") }],
    workbookSections: { "teil-2": { text: transcript, recording: { audioUrl, transcript } } },
  };
}
