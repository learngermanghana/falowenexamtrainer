import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const sourcePath = path.join(repositoryRoot, "web/src/components/SpeakingPage.js");
let source = fs.readFileSync(sourcePath, "utf8");

const before = `                              ) : message.audioError ? (
                                <button type="button" aria-label="Retry German audio" style={{ ...styles.secondaryButton, padding: "6px 10px", justifySelf: "start" }} onClick={() => retryCustomCoachAudio(message)}>
                                  Retry audio
                                </button>
                              ) : null`;

const after = `                              ) : message.audioError ? (
                                <div style={{ display: "grid", gap: 6, justifyItems: "start" }}>
                                  <span role="status" style={{ fontSize: 12, color: "#92400E", lineHeight: 1.45 }}>
                                    {message.audioErrorMessage || "The German audio reply could not be prepared."}
                                  </span>
                                  {message.audioRetryable !== false ? (
                                    <button type="button" aria-label="Retry German audio" style={{ ...styles.secondaryButton, padding: "6px 10px", justifySelf: "start" }} onClick={() => retryCustomCoachAudio(message)}>
                                      Retry audio
                                    </button>
                                  ) : null}
                                </div>
                              ) : null`;

if (!source.includes(after)) {
  if (!source.includes(before)) {
    throw new Error("Goethe coach audio feedback patch anchor missing");
  }
  source = source.replace(before, after);
}

fs.writeFileSync(sourcePath, source, "utf8");
console.log("Applied Goethe coach audio error feedback.");
