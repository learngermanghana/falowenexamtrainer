import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, "..");
const outputPath = path.join(repoRoot, "web", "public", "__falowen-build.json");

const gitValue = (args) => {
  try {
    return execFileSync("git", args, { cwd: repoRoot, encoding: "utf8" }).trim();
  } catch {
    return "";
  }
};

const commitSha =
  process.env.VERCEL_GIT_COMMIT_SHA ||
  process.env.GITHUB_SHA ||
  process.env.CI_COMMIT_SHA ||
  gitValue(["rev-parse", "HEAD"]);

const commitRef =
  process.env.VERCEL_GIT_COMMIT_REF ||
  process.env.GITHUB_REF_NAME ||
  gitValue(["rev-parse", "--abbrev-ref", "HEAD"]);

const payload = {
  app: "falowen",
  commitSha,
  commitRef,
  environment: process.env.VERCEL_ENV || process.env.NODE_ENV || "local",
  generatedAt: new Date().toISOString(),
};

const firebaseConfigOutputPath = path.join(
  repoRoot,
  "web",
  "public",
  "__falowen-firebase-config.js"
);

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "",
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "",
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "",
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: process.env.REACT_APP_FIREBASE_APP_ID || "",
};

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, JSON.stringify(payload, null, 2) + "\n", "utf8");
fs.writeFileSync(
  firebaseConfigOutputPath,
  `self.__FALOWEN_FIREBASE_CONFIG__ = ${JSON.stringify(firebaseConfig, null, 2)};\n`,
  "utf8"
);

const hasMessagingConfig = Boolean(
  firebaseConfig.apiKey &&
    firebaseConfig.projectId &&
    firebaseConfig.messagingSenderId &&
    firebaseConfig.appId
);

console.log(`Falowen build identity: ${commitSha || "unknown"} (${commitRef || "unknown"})`);
console.log(
  `Falowen background push config: ${hasMessagingConfig ? "ready" : "missing Firebase client env"}`
);
