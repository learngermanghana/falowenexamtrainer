"use strict";
const crypto=require("node:crypto");
// Checksums of original ZIP recordings. R2 paths are NOT proof of upload; verify every private URL.
const APPROVED_A2_MOCK_08_AUDIO=Object.freeze({
  "teil-1": {
    "key": "a2/mock-hoeren/mock-08/teil-1.mp3",
    "sha256": "da9ddd126ef4328d616fa6a78a8a425533b3e7751e67030ddc6de9aad69a0aba",
    "bytes": 3809088
  },
  "teil-2": {
    "key": "a2/mock-hoeren/mock-08/teil-2.mp3",
    "sha256": "33ea6fa59fe8fc6bda4569794a165e3b7e459a1418df588c2f70003f4e53c552",
    "bytes": 1126656
  },
  "teil-3": {
    "key": "a2/mock-hoeren/mock-08/teil-3.mp3",
    "sha256": "737e73d9e41d0da0964b9affcf089f8f239cf2127a99652c49dd630f27f373c2",
    "bytes": 1886400
  },
  "teil-4": {
    "key": "a2/mock-hoeren/mock-08/teil-4.mp3",
    "sha256": "21c68092ee8364ee9f265760228af8a65afc8fa0630ae214d4eab29d958b74bb",
    "bytes": 3401568
  }
});
const verifiedUntil=new Map(),TTL_MS=60*60*1000;
async function verifyA2Mock08Audio({level,mockId,part,key,signedUrl,fetchImpl=fetch,now=Date.now}={}){
  if(String(level).toUpperCase()!=="A2"||mockId!=="mock-08")return false;
  const expected=APPROVED_A2_MOCK_08_AUDIO[part];
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
module.exports={APPROVED_A2_MOCK_08_AUDIO,verifyA2Mock08Audio};
