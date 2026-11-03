"use strict";
// Exact R2 keys supplied by the teacher for B1 Mock 3. Never expose long-lived
// credentials or full public bucket access; signed playback is requested per Teil.
// Confirm existence by an inexpensive 3-byte range instead of downloading the MP3.
const PART_KEYS = Object.freeze(Object.fromEntries([1,2,3,4].map(i=>[
  "teil-"+i, "b1/mock-hoeren/mock-03/teil-"+i+".mp3",
])));
const goodUntil=new Map();
async function verifyB1Mock3Audio({
  level,mockId,part,key,signedUrl,fetchImpl=fetch,now=Date.now,
}={}){
  if(level!=="B1"||mockId!=="mock-03"||PART_KEYS[part]!==key||
    typeof signedUrl!=="string"||
    !/^https:\/\/[a-z0-9.-]+\.r2\.cloudflarestorage\.com\//i.test(signedUrl))return false;
  if(goodUntil.get(key)>now())return true;
  const controller=new AbortController();
  const timer=setTimeout(()=>controller.abort(),15000);
  try {
    const response=await fetchImpl(signedUrl,{
      method:"GET",headers:{Range:"bytes=0-2"},signal:controller.signal,
    });
    if(response?.status!==206)return false;
    const range=String(response.headers?.get?.("content-range")||"").match(/^bytes 0-2\/(\d+)$/i);
    const total=Number(range?.[1]);
    if(!Number.isInteger(total)||total<100000||total>12000000)return false;
    const bytes=Buffer.from(await response.arrayBuffer());
    if(bytes.length!==3)return false;
    const id3=bytes.toString("ascii")==="ID3";
    const frame=bytes[0]===255&&(bytes[1]&224)===224;
    if(!id3&&!frame)return false;
    goodUntil.set(key,now()+15*60*1000);
    return true;
  } catch {return false;} finally {clearTimeout(timer);}
}
module.exports={PART_KEYS,verifyB1Mock3Audio};
