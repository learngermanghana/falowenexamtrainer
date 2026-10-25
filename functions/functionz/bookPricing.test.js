"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const {A1_PRINT_BENCHMARK,pricePrintedGuide,priceDigitalExamGuide} = require("./bookPricing");
test("print prices scale from Academy GH₵660 cost / GH₵800 retail for 250 pages",()=>{
  assert.equal(A1_PRINT_BENCHMARK.printerCostGhs,660);
  assert.equal(pricePrintedGuide(250),800);
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
