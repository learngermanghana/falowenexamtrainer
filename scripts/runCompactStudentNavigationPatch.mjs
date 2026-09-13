import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const patchPath = path.join(root, "scripts/patchCompactStudentNavigation.mjs");
let source = fs.readFileSync(patchPath, "utf8");

const replacements = [
  [
    '${location.pathname.startsWith("/campus") ? " has-campus-bottom-nav" : ""}',
    '\\${location.pathname.startsWith("/campus") ? " has-campus-bottom-nav" : ""}',
  ],
  [
    '${isCampusNavigationItemActive(item, location) ? " is-active" : ""}',
    '\\${isCampusNavigationItemActive(item, location) ? " is-active" : ""}',
  ],
  [
    '${active ? " is-active" : ""}',
    '\\${active ? " is-active" : ""}',
  ],
  [
    '${moreActive ? " is-active" : ""}',
    '\\${moreActive ? " is-active" : ""}',
  ],
];

replacements.forEach(([before, after]) => {
  source = source.replaceAll(before, after);
});

fs.writeFileSync(patchPath, source, "utf8");
await import(`${pathToFileURL(patchPath).href}?compact-navigation-fixed=1`);
