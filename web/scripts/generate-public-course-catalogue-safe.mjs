import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const sourcePath = path.join(__dirname, "generate-public-course-catalogue.mjs");
const runnerPath = path.join(__dirname, ".generate-public-course-catalogue.runner.mjs");

const originalImport = 'import { courseSchedules } from "../src/data/courseSchedule.js";';
const safeImport = 'import { courseSchedules } from "./public-course-schedule-source.mjs";';

const source = await fs.readFile(sourcePath, "utf8");
if (!source.includes(originalImport)) {
  throw new Error("Public catalogue generator import signature changed; safe runner was not applied.");
}

await fs.writeFile(runnerPath, source.replace(originalImport, safeImport), "utf8");
try {
  await import(`${pathToFileURL(runnerPath).href}?run=${Date.now()}`);
} finally {
  await fs.rm(runnerPath, { force: true });
}
