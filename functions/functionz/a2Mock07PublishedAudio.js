"use strict";
const crypto=require("node:crypto");
// ZIP originals, not proof that the user-uploaded R2 versions match.
const APPROVED_A2_MOCK_07_AUDIO=Object.freeze({
  "teil-1": {
    "key": "a2/mock-hoeren/mock-07/teil-1.mp3",
    "sha256": "5225d40436dce11207e20e6a8f67c4cfd4b5264b22409e8935bd0ed6a325f976",
    "bytes": 3511296
  },
  "teil-2": {
    "key": "a2/mock-hoeren/mock-07/teil-2.mp3",
    "sha256": "5ae531d70f54a8c710183b17551ec867d5e65168809ea3039cc9789abb56cab2",
    "bytes": 1220256
  },
  "teil-3": {
    "key": "a2/mock-hoeren/mock-07/teil-3.mp3",
    "sha256": "c2ee5b3ae4b119c1ab1a870bc78861f284cd06a880f090e7d21586e1f5d1fb9b",
    "bytes": 2340576
  },
  "teil-4": {
    "key": "a2/mock-hoeren/mock-07/teil-4.mp3",
    "sha256": "2ed55d438cfc9cca70c3cd167e378d00f1dcd6b47ba804088fb7a782ec69f335",
    "bytes": 3730176
  }
});
const verifiedUntil=new Map(),TTL_MS=60*60*1000;
async function verifyA2Mock07Audio({level,mockId,part,key,signedUrl,fetchImpl=fetch,now=Date.now}={}){
  if(String(level).toUpperCase()!=="A2"||mockId!=="mock-07")return false;
  const expected=APPROVED_A2_MOCK_07_AUDIO[part];
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
module.exports={APPROVED_A2_MOCK_07_AUDIO,verifyA2Mock07Audio};
