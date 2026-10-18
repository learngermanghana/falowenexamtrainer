import { signedAudioExpiresAt, needsFreshSignedAudio } from "./hoerenSignedAudio";

const url = "https://example.r2.cloudflarestorage.com/a1/studio/sample.mp3?X-Amz-Date=20261018T120000Z&X-Amz-Expires=900&X-Amz-Signature=signed";

test("a protected studio MP3 expires after 15 minutes and refreshes 60 seconds ahead", () => {
  const issued = Date.UTC(2026, 9, 18, 12, 0, 0);
  expect(signedAudioExpiresAt(url)).toBe(issued + 900000);
  expect(needsFreshSignedAudio(url, issued + 12 * 60000)).toBe(false);
  expect(needsFreshSignedAudio(url, issued + 14 * 60000)).toBe(true);
  expect(needsFreshSignedAudio(url, issued + 17 * 60000)).toBe(true);
});

test("malformed or non-signed URLs do not trigger endless retry requests", () => {
  expect(signedAudioExpiresAt("invalid-url")).toBe(null);
  expect(needsFreshSignedAudio("https://example.com/file.mp3")).toBe(false);
  expect(signedAudioExpiresAt("https://example.com/file.mp3?X-Amz-Date=invalid&X-Amz-Expires=900")).toBe(null);
});
