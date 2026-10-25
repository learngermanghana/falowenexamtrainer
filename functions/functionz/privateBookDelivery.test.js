"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const crypto = require("crypto");
const {
 DIGITAL_BOOK_OBJECTS, URL_EXPIRES_SECONDS, signPrivateBookDownload,
 paidOrderContainsBook, registerPrivateBookDeliveryRoute
} = require("./privateBookDelivery");

const accountId="886b2264d12c796d29879a8e919a2f46";
const env={R2_BOOKS_ACCOUNT_ID:accountId,R2_BOOKS_BUCKET:"falowen-books-private",
  R2_BOOKS_ACCESS_KEY_ID:"test_key_id_not_real",R2_BOOKS_SECRET_ACCESS_KEY:"dummy_secret"};
const paidOrder={id:"91869b22-88b0-46f4-b0ac-f224e8275604",
  bookId:"a1-writing-model-exams-digital", format:"digital",status:"paid",
  checkoutPesewas:9900, reference:"paystack_ok",
  lookupKeyHash:crypto.createHash("sha256").update("valid-key").digest("hex")};
const receipt={status:"paid",reference:"paystack_ok",checkoutPesewas:9900};
test("private books are exact allowlisted objects and never arbitrary user keys",()=>{
 assert.deepEqual(Object.keys(DIGITAL_BOOK_OBJECTS).sort(),[
  "a1-writing-model-exams-digital","a2-four-skills-exam-guide-digital","b1-four-skills-exam-guide-digital"
 ].sort());
 for (const {bucket,key} of Object.values(DIGITAL_BOOK_OBJECTS)) {
   assert.equal(bucket,"falowen-books-private");
   assert.match(key,/^book\/Falowen_[A-Za-z0-9_]+\.pdf$/);
 }
 assert.equal(URL_EXPIRES_SECONDS,90);
 assert.throws(()=>signPrivateBookDownload({bookId:"a1-printed",env}),/No delivery mapping/);
 assert.throws(()=>signPrivateBookDownload({bookId:"book/../../secret.pdf",env}),/No delivery mapping/);
});
test("signed URL is short-lived, bound to the private bucket and credential configuration",()=>{
 const result=signPrivateBookDownload({bookId:"b1-four-skills-exam-guide-digital",env,now:new Date("2026-10-25T17:00:00.000Z")});
 const u=new URL(result.url);
 assert.equal(u.hostname,"falowen-books-private."+accountId+".r2.cloudflarestorage.com");
 assert.equal(u.pathname,"/book/Falowen_B1_Guide.pdf");
 assert.equal(u.searchParams.get("X-Amz-Expires"),"90");
 assert.match(u.searchParams.get("X-Amz-Signature"),/^[a-f0-9]{64}$/);
 assert.equal(result.filename,"Falowen_B1_Four_Skills_Exam_Guide.pdf");
 assert.throws(()=>signPrivateBookDownload({bookId:"a1-writing-model-exams-digital",env:{...env,R2_BOOKS_BUCKET:"falowen-course-audio"}}),/not configured/);
 assert.throws(()=>signPrivateBookDownload({bookId:"a1-writing-model-exams-digital",env:{...env,R2_BOOKS_SECRET_ACCESS_KEY:""}}),/not configured/);
});
test("signed order lookup hash + paid receipt + exact purchased digital item are all required",()=>{
 const verified={order:paidOrder,receipt,bookId:"a1-writing-model-exams-digital",key:"valid-key"};
 assert.equal(paidOrderContainsBook(verified),true);
 assert.equal(paidOrderContainsBook({...verified,key:"guessed-key"}),false);
 assert.equal(paidOrderContainsBook({...verified,receipt:{...receipt,status:"pending"}}),false);
 assert.equal(paidOrderContainsBook({...verified,order:{...paidOrder,status:"pending"}}),false);
 assert.equal(paidOrderContainsBook({...verified,receipt:{...receipt,reference:"fake"}}),false);
 assert.equal(paidOrderContainsBook({...verified,receipt:{...receipt,checkoutPesewas:100}}),false);
 assert.equal(paidOrderContainsBook({...verified,bookId:"b1-four-skills-exam-guide-digital"}),false);
 assert.equal(paidOrderContainsBook({...verified,order:{...paidOrder,format:"printed"}}),false);
 assert.equal(paidOrderContainsBook({...verified,order:{...paidOrder,
  bookId:"cart",format:"mixed",items:[
   {bookId:"a1-writing-model-exams-digital",format:"digital",quantity:1},
   {bookId:"b1-four-skills-exam-guide-digital",format:"digital",quantity:1},
  ]},bookId:"b1-four-skills-exam-guide-digital"}),true);
});
test("delivery endpoint is disabled by default with no Firebase or R2 requests",async()=>{
 const original=process.env.FALOWEN_BOOK_DIGITAL_DELIVERY_ENABLED;
 delete process.env.FALOWEN_BOOK_DIGITAL_DELIVERY_ENABLED;
 try {
  let route;
  registerPrivateBookDeliveryRoute({post:(p,handler)=>{assert.equal(p,"/books/download");route=handler}},{
   admin:{firestore:()=>{throw Error("Should not touch database when disabled");}}
  });
  let status=200,body;
  const res={set:()=>res,status:v=>{status=v;return res},json:v=>{body=v;return res}};
  await route({body:{order:paidOrder.id,key:"valid-key",bookId:paidOrder.bookId}},res);
  assert.equal(status,503); assert.match(body.error,/not enabled/);
 }finally{
  if(original===undefined)delete process.env.FALOWEN_BOOK_DIGITAL_DELIVERY_ENABLED;
  else process.env.FALOWEN_BOOK_DIGITAL_DELIVERY_ENABLED=original;
 }
});
