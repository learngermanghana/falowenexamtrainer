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

test("B1 course book deep link resolves before the homepage fallback", () => {
 const app=fs.readFileSync(path.resolve(__dirname,"../App.js"),"utf8");
 const b1='location.pathname === "/books/deutsch-b1-course-workbook"';
 expect(app).toContain(b1);
 expect(app).toContain('<BookStoreCheckout slug="deutsch-b1-course-workbook" />');
 expect(app.indexOf(b1)).toBeLessThan(app.indexOf("const seoMarkets ="));
});

test("German A1 exam preparation has its own detail and checkout route without replacing the A1 course book", () => {
  const app = fs.readFileSync(path.resolve(__dirname, "../App.js"), "utf8");
  expect(app).toContain('location.pathname === "/books/german-a1-exam-preparation"');
  expect(app).toContain('<BookStoreCheckout slug="german-a1-exam-preparation" />');
  expect(app).toContain('<BookStoreCheckout detailBook="a1" />');
  expect(app.indexOf('location.pathname === "/books/german-a1-exam-preparation"')).toBeLessThan(app.indexOf("const seoMarkets ="));
});
