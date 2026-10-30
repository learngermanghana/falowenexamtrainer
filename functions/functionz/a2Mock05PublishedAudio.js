"use strict";
const crypto = require("node:crypto");
// Exact SHA-256 + byte size of all four original teacher-supplied MP3 files.
// A planned object path alone NEVER grants playback. Fail closed until R2 upload matches.
const APPROVED_A2_MOCK_05_AUDIO = Object.freeze({
  "teil-1": {
    "key": "a2/mock-hoeren/mock-05/teil-1.mp3",
    "sha256": "bdbba29d8d3f9b1c8dd94db04b1bfb98ac5b5e18dd0f76b13e74dada42a90327",
    "bytes": 2977056
  },
  "teil-2": {
    "key": "a2/mock-hoeren/mock-05/teil-2.mp3",
    "sha256": "e87f5fcd4da19b50e30e8884151005742e1f5c739562b7d4859a61d8464452a4",
    "bytes": 1237824
  },
  "teil-3": {
    "key": "a2/mock-hoeren/mock-05/teil-3.mp3",
    "sha256": "fa487393de42c4530b9f25cc4970d2630939dfe4177f8c62c75248a7630df7a3",
    "bytes": 1490112
  },
  "teil-4": {
    "key": "a2/mock-hoeren/mock-05/teil-4.mp3",
    "sha256": "fd95d07cc74b0a930c71ffee9fb66727516ebc9a19ceb43c0f1c8736a8446033",
    "bytes": 2721312
  }
});
const checkedUntil = new Map();
const VERIFY_TTL_MS = 60 * 60 * 1000;
async function verifyA2Mock05Audio({level,mockId,part,key,signedUrl,fetchImpl=fetch,now=Date.now}={}) {
  if(String(level).toUpperCase()!=="A2" || mockId!=="mock-05")return false;
  const expected=APPROVED_A2_MOCK_05_AUDIO[part];
  if(!expected || expected.key!==key || typeof signedUrl!=="string" ||
    !/^https:\/\/[a-z0-9.-]+\.r2\.cloudflarestorage\.com\//i.test(signedUrl))return false;
  if(checkedUntil.get(key)>now())return true;
  const controller=new AbortController();
  const timeout=setTimeout(()=>controller.abort(),15000);
  try {
    const response=await fetchImpl(signedUrl,{method:"GET",headers:{"Cache-Control":"no-cache"},signal:controller.signal});
    if(!response?.ok)return false;
    const length=Number(response.headers?.get?.("content-length"));
    if(length!==expected.bytes || length>4_000_000)return false;
    const body=Buffer.from(await response.arrayBuffer());
    if(body.length!==expected.bytes)return false;
    const actual=crypto.createHash("sha256").update(body).digest();
    const wanted=Buffer.from(expected.sha256,"hex");
    if(actual.length!==wanted.length || !crypto.timingSafeEqual(actual,wanted))return false;
    checkedUntil.set(key,now()+VERIFY_TTL_MS);
    return true;
  }catch{return false;}
  finally{clearTimeout(timeout);}
}
module.exports={APPROVED_A2_MOCK_05_AUDIO,verifyA2Mock05Audio};
