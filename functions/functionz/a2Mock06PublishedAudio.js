"use strict";
const crypto=require("node:crypto");
// Exact original bytes from Falowen-A2-Mock-06.zip, not a claimed R2 upload.
const APPROVED_A2_MOCK_06_AUDIO=Object.freeze({
  "teil-1": {
    "key": "a2/mock-hoeren/mock-06/teil-1.mp3",
    "sha256": "a464818937e612c850101f36e0c2831bf9fc83f9a38b099e7ba5317b261c3b1a",
    "bytes": 3784032
  },
  "teil-2": {
    "key": "a2/mock-hoeren/mock-06/teil-2.mp3",
    "sha256": "c101a64736f9e46ade818c0e87d75c00b5737ea26ef234c8a8fedc38d0aba6d0",
    "bytes": 1138752
  },
  "teil-3": {
    "key": "a2/mock-hoeren/mock-06/teil-3.mp3",
    "sha256": "05328df1fb4130928249458fe4d8d918461de283066d411c0692185080026ee4",
    "bytes": 1367136
  },
  "teil-4": {
    "key": "a2/mock-hoeren/mock-06/teil-4.mp3",
    "sha256": "5e6b85681865ad89882999977d53fe7f6281d5087a39c3b6268e4b5a9109a6d0",
    "bytes": 3128256
  }
});
const verifiedUntil=new Map();
const TTL_MS=60*60*1000;
async function verifyA2Mock06Audio({level,mockId,part,key,signedUrl,fetchImpl=fetch,now=Date.now}={}){
  if(String(level).toUpperCase()!=="A2"||mockId!=="mock-06")return false;
  const expected=APPROVED_A2_MOCK_06_AUDIO[part];
  if(!expected||expected.key!==key||typeof signedUrl!=="string"||
    !/^https:\/\/[a-z0-9.-]+\.r2\.cloudflarestorage\.com\//i.test(signedUrl))return false;
  if(verifiedUntil.get(key)>now())return true;
  const controller=new AbortController();
  const timeout=setTimeout(()=>controller.abort(),15000);
  try {
    const response=await fetchImpl(signedUrl,{method:"GET",headers:{"Cache-Control":"no-cache"},signal:controller.signal});
    if(!response?.ok)return false;
    if(Number(response.headers?.get?.("content-length"))!==expected.bytes||expected.bytes>4_000_000)return false;
    const buffer=Buffer.from(await response.arrayBuffer());
    if(buffer.length!==expected.bytes)return false;
    const actual=crypto.createHash("sha256").update(buffer).digest();
    const wanted=Buffer.from(expected.sha256,"hex");
    if(actual.length!==wanted.length||!crypto.timingSafeEqual(actual,wanted))return false;
    verifiedUntil.set(key,now()+TTL_MS);
    return true;
  }catch{return false;}finally{clearTimeout(timeout);}
}
module.exports={APPROVED_A2_MOCK_06_AUDIO,verifyA2Mock06Audio};
