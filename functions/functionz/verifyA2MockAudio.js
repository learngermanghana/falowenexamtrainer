"use strict";
const crypto=require("node:crypto");
const verifiedUntil=new Map(),TTL_MS=60*60*1000;
async function verifyA2MockAudio(approved, expectedMockId, {level,mockId,part,key,signedUrl,fetchImpl=fetch,now=Date.now}={}){
  if(String(level).toUpperCase()!=="A2"||mockId!==expectedMockId)return false;
  const expected=approved[part];
  if(!expected||expected.key!==key||typeof signedUrl!=="string"||
    !/^https:\/\/[a-z0-9.-]+\.r2\.cloudflarestorage\.com\//i.test(signedUrl))return false;
  if(verifiedUntil.get(key)>now())return true;
  const controller=new AbortController();
  const timeout=setTimeout(()=>controller.abort(),15000);
  try{
    const response=await fetchImpl(signedUrl,{method:"GET",headers:{"Cache-Control":"no-cache"},signal:controller.signal});
    if(!response?.ok)return false;
    if(Number(response.headers?.get?.("content-length"))!==expected.bytes||expected.bytes>4_000_000)return false;
    const buffer=Buffer.from(await response.arrayBuffer());
    if(buffer.length!==expected.bytes)return false;
    const actual=crypto.createHash("sha256").update(buffer).digest();
    const wanted=Buffer.from(expected.sha256,"hex");
    if(actual.length!==wanted.length||!crypto.timingSafeEqual(actual,wanted))return false;
    verifiedUntil.set(key,now()+TTL_MS);return true;
  }catch{return false;}finally{clearTimeout(timeout);}
}
module.exports={verifyA2MockAudio};
