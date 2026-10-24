"use strict";

const crypto = require("node:crypto");

// All book requests use this fixed object key. Clients never choose bucket/key.
const BOOK_OBJECT_KEY = "books/private/falowen-a1-grammar-workbook-v1.pdf";
const BOOK_DOWNLOAD_SECONDS = 300;
const simpleBucketName = /^[a-z0-9][a-z0-9-]*[a-z0-9]$|^[a-z0-9]$/i;
const bookAccessId = env => String(env.R2_BOOKS_ACCESS_KEY_ID || env.R2_ACCESS_KEY_ID || "").trim();
const bookSecret = env => String(env.R2_BOOKS_SECRET_ACCESS_KEY || env.R2_SECRET_ACCESS_KEY || "").trim();
const awsEncode = value => encodeURIComponent(String(value)).replace(/[!'()*]/g, chr =>
  "%" + chr.charCodeAt(0).toString(16).toUpperCase());
const encodeKey = key => String(key).split("/").map(awsEncode).join("/");
const sha256 = string => crypto.createHash("sha256").update(string, "utf8").digest("hex");
const hmac = (key, value, encoding) => crypto.createHmac("sha256", key).update(value, "utf8").digest(encoding);
const amzTimestamp = date => date.toISOString().replace(/[:-]|\.\d{3}/g, "");

function isBooksR2Configured(env = process.env) {
  return Boolean(env.R2_ACCOUNT_ID && bookAccessId(env) && bookSecret(env) && env.R2_BOOKS_BUCKET) &&
    simpleBucketName.test(String(env.R2_BOOKS_BUCKET || "").trim());
}

function getR2BooksConfig(env = process.env) {
  if (!isBooksR2Configured(env)) {
    const error = new Error("Private books R2 is not configured.");
    error.code = "R2_BOOKS_NOT_CONFIGURED";
    throw error;
  }
  const accountId = String(env.R2_ACCOUNT_ID).trim();
  if (!/^[a-f0-9]{32}$/i.test(accountId)) {
    const error = new Error("Invalid R2 account identifier.");
    error.code = "R2_BOOKS_NOT_CONFIGURED";
    throw error;
  }
  return {
    bucket: String(env.R2_BOOKS_BUCKET).trim(),
    accountId,
    accessKeyId: bookAccessId(env),
    secretAccessKey: bookSecret(env),
  };
}

function createBookR2SignedUrl({
  method = "GET",
  env = process.env,
  now = new Date(),
} = {}) {
  if (!["GET", "HEAD"].includes(method)) throw new Error("Only signed book GET and HEAD are supported.");
  const config = getR2BooksConfig(env);
  const date = now instanceof Date ? now : new Date(now);
  if (Number.isNaN(date.getTime())) throw new Error("Invalid signing date.");
  const amzDate = amzTimestamp(date);
  const stamp = amzDate.slice(0, 8);
  const region = "auto";
  const service = "s3";
  const scope = stamp + "/" + region + "/" + service + "/aws4_request";
  const host = config.bucket + "." + config.accountId + ".r2.cloudflarestorage.com";
  const canonicalUri = "/" + encodeKey(BOOK_OBJECT_KEY);
  const entries = [
    ["X-Amz-Algorithm", "AWS4-HMAC-SHA256"],
    ["X-Amz-Content-Sha256", "UNSIGNED-PAYLOAD"],
    ["X-Amz-Credential", config.accessKeyId + "/" + scope],
    ["X-Amz-Date", amzDate],
    ["X-Amz-Expires", String(BOOK_DOWNLOAD_SECONDS)],
    ["X-Amz-SignedHeaders", "host"],
  ];
  const query = entries.map(([k, v]) => [awsEncode(k), awsEncode(v)])
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => k + "=" + v).join("&");
  const canonicalRequest = [
    method, canonicalUri, query, "host:" + host + "\n", "host", "UNSIGNED-PAYLOAD",
  ].join("\n");
  const toSign = ["AWS4-HMAC-SHA256", amzDate, scope, sha256(canonicalRequest)].join("\n");
  const dateKey = hmac("AWS4" + config.secretAccessKey, stamp);
  const regionKey = hmac(dateKey, region);
  const serviceKey = hmac(regionKey, service);
  const signingKey = hmac(serviceKey, "aws4_request");
  const signature = hmac(signingKey, toSign, "hex");
  return {
    url: "https://" + host + canonicalUri + "?" + query + "&X-Amz-Signature=" + signature,
    expiresInSeconds: BOOK_DOWNLOAD_SECONDS,
    expiresAt: date.getTime() + BOOK_DOWNLOAD_SECONDS * 1000,
  };
}

// HEAD verifies the file exists without transferring 50 MB through a Falowen
// function. R2 is private: no r2.dev or public custom domain may be enabled.
async function checkBookR2Object({ env = process.env, fetchFn = fetch } = {}) {
  const signed = createBookR2SignedUrl({ method: "HEAD", env });
  const response = await fetchFn(signed.url, {
    method: "HEAD", redirect: "error", signal: AbortSignal.timeout(8000),
  });
  return response.ok;
}

module.exports = {
  BOOK_OBJECT_KEY,
  BOOK_DOWNLOAD_SECONDS,
  isBooksR2Configured,
  getR2BooksConfig,
  createBookR2SignedUrl,
  checkBookR2Object,
};
