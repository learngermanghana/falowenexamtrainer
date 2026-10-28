"use strict";
const crypto = require("node:crypto");
// Exact SHA-256 + byte size of all four original teacher-supplied MP3 files.
// A planned object path alone NEVER grants playback. Fail closed until R2 upload matches.
const APPROVED_A2_MOCK_04_AUDIO = Object.freeze({
  "teil-1": {
    "key": "a2/mock-hoeren/mock-04/teil-1.mp3",
    "sha256": "ae7c68819dd0bc8aa46f93cf6a0190b2f7e53bebb6a501d2cc81851440a7a3a5",
    "bytes": 3113856
  },
  "teil-2": {
    "key": "a2/mock-hoeren/mock-04/teil-2.mp3",
    "sha256": "fd025d01fcb2d0793b5b51974a11f140a66c0c916fde85c6e3242fcf67362883",
    "bytes": 1538496
  },
  "teil-3": {
    "key": "a2/mock-hoeren/mock-04/teil-3.mp3",
    "sha256": "8c24b213709272d1751b6dceac2b469f75b7461d8a449f33400bec9a206f487d",
    "bytes": 1626336
  },
  "teil-4": {
    "key": "a2/mock-hoeren/mock-04/teil-4.mp3",
    "sha256": "4c5de14e47b6fbff63bac9e0dda65ae26e6ae09378f04e6ddea2fdd4d53ab8e7",
    "bytes": 2476512
  }
});
const checkedUntil = new Map();
const VERIFY_TTL_MS = 60 * 60 * 1000;
async function verifyA2Mock04Audio({level,mockId,part,key,signedUrl,fetchImpl=fetch,now=Date.now}={}) {
  if(String(level).toUpperCase()!=="A2" || mockId!=="mock-04")return false;
  const expected=APPROVED_A2_MOCK_04_AUDIO[part];
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
module.exports={APPROVED_A2_MOCK_04_AUDIO,verifyA2Mock04Audio};
