import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const appPath = path.join(root, "functions/functionz/app.js");
let source = fs.readFileSync(appPath, "utf8");

function removeQuotaBlocks(routeBlock) {
  const lines = routeBlock.split("\n");
  const output = [];

  for (let index = 0; index < lines.length;) {
    if (!lines[index].includes("const quota = await enforceUserQuota")) {
      output.push(lines[index]);
      index += 1;
      continue;
    }

    // Remove the declaration, whether it is one line or a multi-line call.
    if (!lines[index].includes("});")) {
      index += 1;
      while (index < lines.length && !lines[index].includes("});")) index += 1;
    }
    index += 1;

    while (index < lines.length && !lines[index].trim()) index += 1;

    // Remove the matching quota guard, either one line or a brace block.
    if (index < lines.length && lines[index].includes("if (!quota.allowed)")) {
      if (lines[index].includes("return") && !lines[index].trim().endsWith("{")) {
        index += 1;
      } else {
        let depth = 0;
        do {
          depth += (lines[index].match(/{/g) || []).length;
          depth -= (lines[index].match(/}/g) || []).length;
          index += 1;
        } while (index < lines.length && depth > 0);
      }
    }

    while (index < lines.length && !lines[index].trim()) index += 1;
  }

  return output.join("\n");
}

function normalizeRoute({ startMarker, endMarker, category, limitExpression, blockedMessage, failureMessage, failureCode }) {
  const start = source.indexOf(startMarker);
  if (start < 0) throw new Error(`Missing route start: ${startMarker}`);
  const end = source.indexOf(endMarker, start + startMarker.length);
  if (end < 0) throw new Error(`Missing route end after: ${startMarker}`);

  let block = source.slice(start, end);
  block = removeQuotaBlocks(block);

  const transcriptPattern = /(    const transcript = \(\(await transcribeAudio\(audioFile\)\) \|\| ""\)\.slice\(0, 8000\);)/;
  if (!transcriptPattern.test(block)) {
    throw new Error(`Missing transcript anchor in ${startMarker}`);
  }

  const quotaCode = [
    `$1`,
    "",
    `    const quota = await enforceUserQuota({ uid: authedUser.uid, category: "${category}", limit: ${limitExpression} });`,
    `    if (!quota.allowed) return res.status(429).json({ error: "${blockedMessage}", code: "SPEAKING_QUOTA_REACHED" });`,
  ].join("\n");
  block = block.replace(transcriptPattern, quotaCode);

  const fallbackReturn = new RegExp(
    `    return res\\.status\\(500\\)\\.json\\(\\{ error: err\\.message \\|\\| "${failureMessage.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}"(?:, code: "[^"]+")? \\}\\);`,
  );
  const structuredCatch = [
    "    if (/^(AUDIO_|NO_SPEECH_DETECTED|TRANSCRIPTION_)/.test(String(err?.code || \"\"))) {",
    "      const mapped = audioHttpError(err);",
    "      return res.status(mapped.status).json(mapped.body);",
    "    }",
    `    return res.status(500).json({ error: err.message || "${failureMessage}", code: "${failureCode}" });`,
  ].join("\n");

  if (!block.includes('NO_SPEECH_DETECTED|TRANSCRIPTION_')) {
    if (!fallbackReturn.test(block)) throw new Error(`Missing failure return in ${startMarker}`);
    block = block.replace(fallbackReturn, structuredCatch);
  }

  source = `${source.slice(0, start)}${block}${source.slice(end)}`;
}

normalizeRoute({
  startMarker: 'app.post("/speaking/analyze", audioUpload, async (req, res) => {',
  endMarker: 'app.post("/speaking/analyze-text",',
  category: "speaking",
  limitExpression: "DAILY_LIMITS.speaking",
  blockedMessage: "Daily speaking analysis limit reached",
  failureMessage: "Failed to analyze speaking",
  failureCode: "TRANSCRIPTION_FAILED",
});

normalizeRoute({
  startMarker: 'app.post("/speech-trainer/feedback", audioUpload, async (req, res) => {',
  endMarker: 'app.post("/chatbuddy/respond",',
  category: "speechTrainer",
  limitExpression: "DAILY_LIMITS.speechTrainer",
  blockedMessage: "Daily speech trainer limit reached",
  failureMessage: "Failed to run speech trainer",
  failureCode: "TRANSCRIPTION_FAILED",
});

fs.writeFileSync(appPath, source, "utf8");
console.log("Normalized speaking audio backend quota and error handling.");
