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

test("route grants only a matching paid PDF with a valid secret lookup and private R2 credentials", async () => {
  const original = Object.fromEntries([
    "FALOWEN_BOOK_DIGITAL_DELIVERY_ENABLED",
    "R2_BOOKS_ACCOUNT_ID","R2_BOOKS_BUCKET","R2_BOOKS_ACCESS_KEY_ID",
    "R2_BOOKS_SECRET_ACCESS_KEY",
  ].map(key=>[key,process.env[key]]));
  const key = "a".repeat(48);
  const paid = { ...paidOrder, lookupKeyHash:crypto.createHash("sha256").update(key).digest("hex") };
  try {
    Object.assign(process.env,{...env,FALOWEN_BOOK_DIGITAL_DELIVERY_ENABLED:"true"});
    let handler;
    registerPrivateBookDeliveryRoute({
      post:(path,fn)=>{assert.equal(path,"/books/download");handler=fn;},
    },{admin:{firestore:()=>({collection:name=>({doc:()=>({get:async()=>({
      exists:true,data:()=>name==="bookOrders"?paid:receipt,
    })})})})}});
    async function request(bookId, secret) {
      let status=200,body;
      const res={set:()=>res,status:value=>{status=value;return res},json:value=>{body=value;return res}};
      await handler({body:{order:paidOrder.id,key:secret,bookId}},res);
      return {status,body};
    }
    const ok=await request(paid.bookId,key);
    assert.equal(ok.status,200);
    assert.equal(new URL(ok.body.url).pathname,"/book/Falowen_A1_Writing_Exam_Guide_Fresh.pdf");
    assert.equal(ok.body.expiresIn,90);
    assert.equal(ok.body.url.includes(env.R2_BOOKS_SECRET_ACCESS_KEY),false);
    const badKey=await request(paid.bookId,"b".repeat(48));
    assert.equal(badKey.status,403);
    assert.equal(badKey.body.url,undefined);
    const wrongBook=await request("a2-four-skills-exam-guide-digital",key);
    assert.equal(wrongBook.status,403);
    assert.equal(wrongBook.body.url,undefined);
  } finally {
    for(const [name,value] of Object.entries(original)){
      if(value===undefined) delete process.env[name];
      else process.env[name]=value;
    }
  }
});

test("the production Firebase API binds books secrets without exposing them to unrelated functions",()=>{
 const fs=require("fs"),path=require("path");
 const index=fs.readFileSync(path.resolve(__dirname,"../index.js"),"utf8");
 const head=index.slice(index.indexOf("exports.api = onRequest("),
   index.indexOf("// When a student doc is created in Firestore"));
 for (const name of ["R2_BOOKS_ACCOUNT_ID","R2_BOOKS_BUCKET","R2_BOOKS_ACCESS_KEY_ID","R2_BOOKS_SECRET_ACCESS_KEY"]){
   assert.ok(head.includes('"'+name+'"'),"Missing books secret binding: "+name);
   assert.equal(index.split('"'+name+'"').length-1,1,"Book secret is also bound to unrelated service");
 }
});
