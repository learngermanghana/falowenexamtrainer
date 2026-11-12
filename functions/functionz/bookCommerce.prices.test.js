"use strict";
const test=require("node:test");
const assert=require("node:assert/strict");
const {BOOKS,BOOK_CATALOG_TITLES}=require("./bookCommerce");
const {DIGITAL_BOOK_OBJECTS}=require("./privateBookDelivery");

test("A1 A2 and B1 complete digital books charge the approved standalone GHS prices",()=>{
 for(const [id,price] of [
  ["a1-digital",249],["a2-course-workbook-digital",299],["b1-course-workbook-digital",399]
 ]){
  assert.equal(BOOKS[id].priceGhs,price,id);
  assert.equal(BOOKS[id].format,"digital");
  assert.ok(DIGITAL_BOOK_OBJECTS[id],id+" needs private paid PDF delivery");
 }
});
test("full course books are distinct from retired B1 exam guides",()=>{
 const full=BOOK_CATALOG_TITLES.filter(t=>["a1-course-workbook","a2-course-workbook","b1-course-workbook"].includes(t.id));
 assert.equal(full.length,3);
 assert.deepEqual(full.map(t=>t.pages),[228,328,420]);
 assert.ok(full.every(t=>t.status==="available"&&t.formats.includes("digital")));
 assert.equal(BOOKS["b1-course-workbook-printed"].priceGhs,1350);
 assert.ok(!BOOK_CATALOG_TITLES.some(t=>(t.bookIds||[]).includes("b1-four-skills-exam-guide-digital")));
});
