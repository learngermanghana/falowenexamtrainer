import fs from "fs";
import path from "path";

test("new A2 course book deep link resolves before the homepage fallback", () => {
  const app = fs.readFileSync(path.resolve(__dirname, "../App.js"), "utf8");
  const a2 = 'location.pathname === "/books/deutsch-a2-course-workbook"';
  const page = '<BookStoreCheckout slug="deutsch-a2-course-workbook" />';
  expect(app).toContain(a2);
  expect(app).toContain(page);
  expect(app).toContain('location.pathname === "/books/deutsch-a2-course-workbook/"');
  expect(app.indexOf(a2)).toBeLessThan(app.indexOf('const seoMarkets ='));
  expect(app).toContain('location.pathname.match(/^\\/books\\/([^/]+)\\/checkout\\/?$/)');
});
