import fs from "node:fs";
import path from "node:path";

const css = fs.readFileSync(path.resolve(__dirname, "../goetheFreeChatMobile.css"), "utf8");

test("Goethe Free Chat uses a single-column phone layout with wide bubbles", () => {
  expect(css).toContain('@media (max-width: 720px)');
  expect(css).toContain('grid-template-columns: minmax(0, 1fr) !important;');
  expect(css).toContain('max-width: 94% !important;');
  expect(css).toContain('overflow-wrap: anywhere;');
});
