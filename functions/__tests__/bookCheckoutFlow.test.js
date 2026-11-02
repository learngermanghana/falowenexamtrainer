"use strict";
const test=require("node:test");
const assert=require("node:assert/strict");
const {registerBookCommerceRoutes,processBookWebhook}=require("../functionz/bookCommerce");
test("checkout validates quantities and delivery, charges server total and verifies multi-copy receipt",async()=>{
 const oldFetch=global.fetch, oldEnabled=process.env.FALOWEN_BOOK_PAYMENTS_ENABLED, oldSecret=process.env.PAYSTACK_SECRET;
 process.env.FALOWEN_BOOK_PAYMENTS_ENABLED="true";process.env.PAYSTACK_SECRET="test-only";
 let initialization, saved, receipt;
 const routes={};
 const db={collection:name=>({doc:id=>({name,id,create:async data=>{saved=data;}})}),runTransaction:async fn=>fn({
  get:async ref=>({exists:ref.name==="bookOrders",data:()=>saved}),
  create:(_ref,data)=>{receipt=data;},update:()=>{},
 })};
 const admin={firestore:Object.assign(()=>db,{FieldValue:{serverTimestamp:()=>"now"}})};
 registerBookCommerceRoutes({get:()=>{},post:(route,fn)=>{routes[route]=fn;}},{admin});
 global.fetch=async(_url,options)=>{initialization=JSON.parse(options.body);return {ok:true,json:async()=>({status:true,data:{reference:"quantity-reference",authorization_url:"https://checkout.paystack.com/example"}})};};
 const invoke=async body=>{
  const result={code:200};const res={status(code){result.code=code;return this;},set(){return this;},json(data){result.data=data;return this;}};
  await routes["/books/checkout"]({body:{bookId:"a1-printed",name:"Test Reader",email:"reader@example.com",phone:"+233241234567",...body}},res);return result;
 };
 try {
  for(const quantity of [0,-1,1.5,21,"2",null]) assert.equal((await invoke({quantity})).code,400);
  for (const hidden of [
    "a1-writing-model-exams-digital", "a1-writing-model-exams-printed",
    "a2-four-skills-exam-guide-digital", "a2-four-skills-exam-guide-printed",
    "b1-four-skills-exam-guide-digital", "b1-four-skills-exam-guide-printed",
  ]) assert.equal((await invoke({bookId:hidden})).code,400);
  assert.equal((await invoke({bookId:"a1-digital",quantity:2})).code,400);
  assert.equal((await invoke({deliveryMethod:"delivery",deliveryAddress:""})).code,400);
  assert.equal((await invoke({bookId:"unknown"})).code,400);
  assert.equal(initialization,undefined);
  const result=await invoke({quantity:3,deliveryMethod:"delivery",deliveryAddress:"Accra, Example Street",priceGhs:1});
  assert.equal(result.code,200);assert.equal(initialization.amount,240000);assert.equal(saved.priceGhs,2400);
  assert.equal(saved.unitPriceGhs,800);assert.equal(saved.quantity,3);assert.equal(saved.deliveryAddress,"Accra, Example Street");
  const verified=await processBookWebhook({admin,data:{domain:"live",status:"success",reference:saved.reference,currency:"GHS",amount:240000,customer:{email:saved.email},metadata:initialization.metadata}});
  assert.equal(verified.body.status,"synced");assert.equal(receipt.amountGhs,2400);
  const a2=await invoke({bookId:"a2-course-workbook-digital"});assert.equal(a2.code,200);assert.equal(initialization.amount,10000);assert.equal(saved.format,"digital");
  // Printed A2 follows the existing A1 paystack path, no digital download SKU.
  const a2Printed=await invoke({bookId:"a2-course-workbook-printed",quantity:2,deliveryMethod:"delivery",deliveryAddress:"Accra, Example Street",priceGhs:1});
  assert.equal(a2Printed.code,200);
  assert.equal(initialization.amount,210000); // 2 x GH₵1050 in pesewas
  assert.equal(initialization.metadata.bookId,"a2-course-workbook-printed");
  assert.equal(saved.priceGhs,2100);
  assert.equal(saved.unitPriceGhs,1050);
  assert.equal(saved.quantity,2);
  assert.equal(saved.format,"printed");
  assert.equal(saved.deliveryMethod,"delivery");
  assert.equal(saved.deliveryAddress,"Accra, Example Street");
  const a2PrintedReceipt=await processBookWebhook({admin,data:{domain:"live",status:"success",reference:saved.reference,currency:"GHS",amount:210000,customer:{email:saved.email},metadata:initialization.metadata}});
  assert.equal(a2PrintedReceipt.body.status,"synced");
  assert.equal(receipt.amountGhs,2100);
  const legacy=await invoke({bookId:"a1-digital"});assert.equal(legacy.code,200);assert.equal(initialization.amount,10000);assert.equal(saved.quantity,1);
 } finally {
  global.fetch=oldFetch;
  for(const [key,value] of [["FALOWEN_BOOK_PAYMENTS_ENABLED",oldEnabled],["PAYSTACK_SECRET",oldSecret]]) if(value===undefined) delete process.env[key];else process.env[key]=value;
 }
});
