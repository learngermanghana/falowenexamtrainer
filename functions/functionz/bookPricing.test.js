"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const {A1_PRINT_BENCHMARK,pricePrintedGuide,priceDigitalExamGuide} = require("./bookPricing");
test("print prices scale from Academy GH₵660 cost / GH₵800 retail for 250 pages",()=>{
  assert.equal(A1_PRINT_BENCHMARK.printerCostGhs,660);
  assert.equal(pricePrintedGuide(250),800);
  assert.equal(pricePrintedGuide(328),1050); // 328 / 250 × GH₵800 = 1049.60, rounded up to 50
  assert.equal(pricePrintedGuide(30),100);
  assert.equal(pricePrintedGuide(50),200);
  assert.equal(pricePrintedGuide(441),1450);
  assert.ok(pricePrintedGuide(50) > 50*660/250);
  for(const invalid of [0,-1,1.5,NaN,Infinity,1501, "30"]) {
    assert.throws(()=>pricePrintedGuide(invalid),RangeError);
  }
});
test("digital guide scope pricing is independent of printing and preserves original titles",()=>{
  assert.equal(priceDigitalExamGuide({skills:1}),29);
  assert.equal(priceDigitalExamGuide({skills:4}),39);
  for(const skills of [0,5,1.2]) assert.throws(()=>priceDigitalExamGuide({skills}),RangeError);
});

test("German A1 exam preparation offers GH₵99 PDF and GH₵200 printed edition",()=>{
  const {BOOKS,BOOK_CATALOG_TITLES,registerBookCommerceRoutes}=require("./bookCommerce");
  const {DIGITAL_BOOK_OBJECTS}=require("./privateBookDelivery");
  const title=BOOK_CATALOG_TITLES.find(item=>item.id==="german-a1-exam-preparation");
  const digital=BOOKS["german-a1-exam-preparation-digital"];
  const printed=BOOKS["german-a1-exam-preparation-printed"];
  assert.deepEqual(title.formats,["digital","printed"]);
  assert.equal(title.pages,50);
  assert.deepEqual(title.bookIds,[digital.id,printed.id]);
  assert.equal(digital.priceGhs,99);
  assert.equal(printed.priceGhs,200);
  assert.equal(printed.priceGhs,pricePrintedGuide(title.pages));
  assert.equal(printed.format,"printed");
  assert.equal(Object.hasOwn(DIGITAL_BOOK_OBJECTS,printed.id),false);
  const routes={};
  registerBookCommerceRoutes({get:(path,handler)=>{routes[path]=handler;},post:()=>{}},{admin:{}});
  const catalog=routes["/books/catalog"]({}, {set:()=>{},json:data=>data});
  const offer=catalog.books.find(book=>book.id===printed.id);
  assert.equal(offer.deliveryMode,"print_on_demand");
  assert.equal(offer.deliveryIncluded,false);
  assert.equal(offer.checkoutTotalGhs,200);
});
