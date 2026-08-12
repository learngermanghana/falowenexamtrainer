import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const finalPatch = fs.readFileSync(path.join(root, "../scripts/patchA2B1MobileFloatingActions.mjs"), "utf8");

test("A2 final patch chain applies the Day 1 beginner learning restoration", () => {
  expect(finalPatch).toContain('patchA2Day1BeginnerLearning.mjs');
});
