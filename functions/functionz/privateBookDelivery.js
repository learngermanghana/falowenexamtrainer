"use strict";
const crypto = require("crypto");

// These are EXACT private object keys confirmed through the user's Cloudflare
// dashboard. Nothing here is a publicly accessible PDF link.
const DIGITAL_BOOK_OBJECTS = Object.freeze({
  "a1-writing-model-exams-digital": Object.freeze({
    bucket: "falowen-books-private",
    key: "book/Falowen_A1_Writing_Exam_Guide_Fresh.pdf",
    filename: "Falowen_A1_Writing_Exam_Guide.pdf",
  }),
  "a2-four-skills-exam-guide-digital": Object.freeze({
    bucket: "falowen-books-private",
    key: "book/Falowen_A2_Exam_Guide_Fresh.pdf",
    filename: "Falowen_A2_Four_Skills_Exam_Guide.pdf",
  }),
  "b1-four-skills-exam-guide-digital": Object.freeze({
    bucket: "falowen-books-private",
    key: "book/Falowen_B1_Guide.pdf",
    filename: "Falowen_B1_Four_Skills_Exam_Guide.pdf",
  }),
});
const FALOWEN_BOOKS_BUCKET = "falowen-books-private";
const URL_EXPIRES_SECONDS = 90; // a signed GET is bearer access until expiration
const sha256 = value => crypto.createHash("sha256").update(value).digest("hex");
const hmac = (key, value, encoding) => crypto.createHmac("sha256", key).update(value).digest(encoding);
const encode = v => encodeURIComponent(v).replace(/[!'()*]/g, c=>"%"+c.charCodeAt(0).toString(16).toUpperCase());
const encodeKey = key => key.split("/").map(encode).join("/");

function getBookR2Config(env = process.env) {
  const accountId = String(env.R2_BOOKS_ACCOUNT_ID || "").trim();
  const accessKeyId = String(env.R2_BOOKS_ACCESS_KEY_ID || "").trim();
  const secretAccessKey = String(env.R2_BOOKS_SECRET_ACCESS_KEY || "").trim();
  const bucket = String(env.R2_BOOKS_BUCKET || "").trim();
  if (!accountId || !accessKeyId || !secretAccessKey || bucket !== FALOWEN_BOOKS_BUCKET) {
    const e = new Error("Private books storage not configured.");
    e.code = "BOOKS_STORAGE_NOT_CONFIGURED";
    throw e;
  }
  if (!/^[a-f0-9]{32}$/i.test(accountId) || /[\\/\s]/.test(accessKeyId) || accessKeyId.length < 10) {
    const e = new Error("Private books storage configuration invalid.");
    e.code = "BOOKS_STORAGE_NOT_CONFIGURED";
    throw e;
  }
  return { accountId, accessKeyId, secretAccessKey, bucket };
}

function signPrivateBookDownload({ bookId, env = process.env, now = new Date() }) {
  const object = Object.prototype.hasOwnProperty.call(DIGITAL_BOOK_OBJECTS, bookId)
    ? DIGITAL_BOOK_OBJECTS[bookId] : null;
  if (!object) {
    const e = new Error("No delivery mapping for this book.");
    e.code = "BOOK_NOT_DELIVERABLE";
    throw e;
  }
  const config = getBookR2Config(env);
  if (object.bucket !== config.bucket) throw Error("Book storage policy mismatch.");
  const date = now instanceof Date ? now : new Date(now);
  if (!Number.isFinite(date.getTime())) throw Error("Invalid signing date.");
  const amzDate = date.toISOString().replace(/[:-]|\.\d{3}/g, "");
  const stamp = amzDate.slice(0,8);
  const scope = stamp + "/auto/s3/aws4_request";
  const host = config.bucket + "." + config.accountId + ".r2.cloudflarestorage.com";
  const uri = "/" + encodeKey(object.key);
  const query = [
    ["X-Amz-Algorithm","AWS4-HMAC-SHA256"],
    ["X-Amz-Content-Sha256","UNSIGNED-PAYLOAD"],
    ["X-Amz-Credential",config.accessKeyId + "/" + scope],
    ["X-Amz-Date",amzDate],
    ["X-Amz-Expires",String(URL_EXPIRES_SECONDS)],
    ["X-Amz-SignedHeaders","host"],
  ].map(([k,v])=>[encode(k),encode(v)]).sort(([a],[b])=>a.localeCompare(b))
    .map(([k,v])=>k+"="+v).join("&");
  const canonical = ["GET",uri,query,"host:"+host+"\n","host","UNSIGNED-PAYLOAD"].join("\n");
  const signString = ["AWS4-HMAC-SHA256",amzDate,scope,sha256(canonical)].join("\n");
  const signingKey = hmac(hmac(hmac(hmac("AWS4"+config.secretAccessKey,stamp),"auto"),"s3"),"aws4_request");
  const signature = hmac(signingKey,signString,"hex");
  return Object.freeze({
    url: "https://"+host+uri+"?"+query+"&X-Amz-Signature="+signature,
    expiresIn: URL_EXPIRES_SECONDS, filename: object.filename,
  });
}
const checkHash = (value, expected) =>
  /^[0-9a-f]{64}$/i.test(String(expected || "")) &&
  crypto.timingSafeEqual(Buffer.from(expected,"hex"),Buffer.from(sha256(value),"hex"));

function paidOrderContainsBook({ order, receipt, bookId, key }) {
  if (!order || !receipt || order.status !== "paid" || receipt.status !== "paid") return false;
  if (!checkHash(key, order.lookupKeyHash)) return false;
  if (order.reference !== receipt.reference || Number(receipt.checkoutPesewas) !== Number(order.checkoutPesewas)) return false;
  const items = Array.isArray(order.items) && order.items.length
    ? order.items : [{bookId:order.bookId,format:order.format,quantity:1}];
  return items.some(i => i.bookId === bookId && i.format === "digital" &&
    Number.isInteger(i.quantity) && i.quantity === 1);
}

function registerPrivateBookDeliveryRoute(app, {admin}) {
  app.post("/books/download",async (req,res)=>{
    res.set("Cache-Control","private, no-store");
    res.set("X-Robots-Tag","noindex, nofollow, noarchive");
    if (process.env.FALOWEN_BOOK_DIGITAL_DELIVERY_ENABLED !== "true") {
      return res.status(503).json({error:"Private book downloads are not enabled yet."});
    }
    const id = String(req.body?.order || "");
    const key = String(req.body?.key || "");
    const bookId = String(req.body?.bookId || "");
    if (!/^[0-9a-f-]{36}$/i.test(id)|| !/^[0-9a-f]{48}$/i.test(key) ||
      !Object.prototype.hasOwnProperty.call(DIGITAL_BOOK_OBJECTS,bookId)) {
      return res.status(400).json({error:"Invalid book download request."});
    }
    try {
      const db = admin.firestore();
      const [orderSnap, receiptSnap] = await Promise.all([
        db.collection("bookOrders").doc(id).get(),
        db.collection("bookPayments").doc(id).get(),
      ]);
      if (!orderSnap.exists || !receiptSnap.exists) {
        return res.status(403).json({error:"A verified purchase is required."});
      }
      if (!paidOrderContainsBook({
        order:orderSnap.data(),receipt:receiptSnap.data(),bookId,key,
      })) return res.status(403).json({error:"A verified purchase is required."});
      const result = signPrivateBookDownload({bookId});
      return res.json({ url:result.url, expiresIn:result.expiresIn, filename:result.filename });
    } catch (err) {
      // Never log passwords, credentials, signed URLs or the buyer's lookup key.
      console.error("Private book delivery failed", { code:err.code || "DELIVERY_ERROR" });
      return res.status(503).json({error:"Secure book download is temporarily unavailable."});
    }
  });
}
module.exports={DIGITAL_BOOK_OBJECTS, URL_EXPIRES_SECONDS, signPrivateBookDownload,
  paidOrderContainsBook, registerPrivateBookDeliveryRoute};
