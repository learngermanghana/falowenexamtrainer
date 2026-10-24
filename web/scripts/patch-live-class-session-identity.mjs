import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const servicePath = path.join(root, "src/services/canonicalLiveClassServiceV2.js");
let source = fs.readFileSync(servicePath, "utf8");

const importLine = 'import { dedupeCanonicalSessions } from "../utils/liveClassSessionIdentity.js";';
if (!source.includes(importLine)) {
  source = `${importLine}\n${source}`;
}

const replacement = `function dedupeSessions(sessions = [], canonicalClassId = "") {
  return dedupeCanonicalSessions(sessions, { canonicalClassId });
}

function sessionWithinOfficialClassDates`;
const pattern = /function dedupeSessions\(sessions = \[\], canonicalClassId = ""\) \{[\s\S]*?\n}\n\nfunction sessionWithinOfficialClassDates/;

if (!source.includes("return dedupeCanonicalSessions(sessions")) {
  if (!pattern.test(source)) throw new Error("Could not locate canonical live-class dedupe function");
  source = source.replace(pattern, replacement);
}

fs.writeFileSync(servicePath, source, "utf8");
console.log("Patched live-class session selection to deduplicate by lesson identity, not start time.");
