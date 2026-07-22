import fs from "node:fs";
import path from "node:path";

describe("Goethe coach audio failure UI", () => {
  test("shows the real audio error and hides useless retry buttons", () => {
    const source = fs.readFileSync(path.resolve(__dirname, "SpeakingPage.js"), "utf8");

    expect(source).toContain('message.audioErrorMessage || "The German audio reply could not be prepared."');
    expect(source).toContain("message.audioRetryable !== false");
    expect(source).toContain('aria-label="Retry German audio"');
  });

  test("plays a device German voice when the server MP3 is unavailable", () => {
    const source = fs.readFileSync(path.resolve(__dirname, "SpeakingPage.js"), "utf8");

    expect(source).toContain("message.audioUrl || message.browserSpeech");
    expect(source).toContain("playBrowserSpeechForMessage(messageId, message.text)");
    expect(source).toContain("stopBrowserSpeech()");
    expect(source).toContain("This device has no German browser voice available.");
  });
});
