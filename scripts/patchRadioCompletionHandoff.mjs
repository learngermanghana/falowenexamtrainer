import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const target = path.join(root, "web/src/components/CourseLessonPageLegacy.js");
let source = fs.readFileSync(target, "utf8");

const helperAnchor = `const getExternalProps = (url = "") =>\n  isInternalLink(url) ? {} : { target: "_blank", rel: "noreferrer" };`;
const helperReplacement = `const getExternalProps = (url = "") =>\n  isInternalLink(url) ? {} : { target: "_blank", rel: "noreferrer" };\n\nconst preserveRadioCompletion = (url = "", currentSearch = "") => {\n  if (!isInternalLink(url)) return url;\n\n  const currentParams = new URLSearchParams(currentSearch || "");\n  if (currentParams.get("radio") !== "done") return url;\n\n  try {\n    const resolved = new URL(url, "https://www.falowen.app");\n    resolved.searchParams.set("radio", "done");\n    return `${resolved.pathname}${resolved.search}${resolved.hash}`;\n  } catch (_error) {\n    const separator = String(url).includes("?") ? "&" : "?";\n    return `${url}${separator}radio=done`;\n  }\n};`;

if (!source.includes("const preserveRadioCompletion =")) {
  if (!source.includes(helperAnchor)) {
    throw new Error("Could not locate CourseLessonPageLegacy link helper anchor.");
  }
  source = source.replace(helperAnchor, helperReplacement);
}

const componentAnchor = `const LessonResourceCard = ({\n  number,\n  icon,\n  title,\n  description,\n  actionLabel,\n  url,\n}) => {\n  if (!url) return null;`;
const componentReplacement = `const LessonResourceCard = ({\n  number,\n  icon,\n  title,\n  description,\n  actionLabel,\n  url,\n}) => {\n  const location = useLocation();\n  if (!url) return null;\n  const resolvedUrl = preserveRadioCompletion(url, location.search);`;

if (!source.includes("const resolvedUrl = preserveRadioCompletion(url, location.search);")) {
  if (!source.includes(componentAnchor)) {
    throw new Error("Could not locate LessonResourceCard anchor.");
  }
  source = source.replace(componentAnchor, componentReplacement);
}

const linkAnchor = `<a href={url} {...getExternalProps(url)} style={resourceButtonStyle}>\n          {actionLabel} ›\n        </a>`;
const linkReplacement = `<a href={resolvedUrl} {...getExternalProps(resolvedUrl)} style={resourceButtonStyle}>\n          {actionLabel} ›\n        </a>`;

if (!source.includes(`<a href={resolvedUrl} {...getExternalProps(resolvedUrl)} style={resourceButtonStyle}>`)) {
  if (!source.includes(linkAnchor)) {
    throw new Error("Could not locate LessonResourceCard link anchor.");
  }
  source = source.replace(linkAnchor, linkReplacement);
}

fs.writeFileSync(target, source, "utf8");
console.log("Preserved radio=done when completed lesson resources open internal workbook links.");
