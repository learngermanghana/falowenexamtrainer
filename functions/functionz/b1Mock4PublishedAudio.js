"use strict";
// Mock 04's exact key paths and MP3 byte lengths from the teacher zip.
// A key is never sufficient proof of publication: the server verifies the
// protected R2 object before issuing playback access.
const PART_KEYS=Object.freeze(Object.fromEntries([1,2,3,4].map(n=>[
  "teil-"+n,"b1/mock-hoeren/mock-04/teil-"+n+".mp3"
])));
const EXPECTED_SIZES=Object.freeze({"teil-1":4057056,"teil-2":1035072,"teil-3":1135296,"teil-4":4183488});
const goodUntil=new Map();
async function verifyB1Mock4Audio({level,mockId,part,key,signedUrl,fetchImpl=fetch,now=Date.now}={}){
  if(level!=="B1"||mockId!=="mock-04"||PART_KEYS[part]!==key||
    typeof signedUrl!=="string"||
    !/^https:\/\/[a-z0-9.-]+\.r2\.cloudflarestorage\.com\//i.test(signedUrl))return false;
  if(goodUntil.get(key)>now())return true;
  const controller=new AbortController();
  const timer=setTimeout(()=>controller.abort(),15000);
  try{
    const response=await fetchImpl(signedUrl,{
      method:"GET",headers:{Range:"bytes=0-2"},signal:controller.signal,
    });
    if(response?.status!==206)return false;
    const match=String(response.headers?.get?.("content-range")||"").match(/^bytes 0-2\/(\d+)$/i);
    if(Number(match?.[1])!==EXPECTED_SIZES[part])return false;
    const bytes=Buffer.from(await response.arrayBuffer());
    if(bytes.length!==3)return false;
    const id3=bytes.toString("ascii")==="ID3";
    const frame=bytes[0]===255&&(bytes[1]&224)===224;
    if(!id3&&!frame)return false;
    goodUntil.set(key,now()+15*60*1000);
    return true;
  }catch{return false;}finally{clearTimeout(timer);}
}
module.exports={PART_KEYS,EXPECTED_SIZES,verifyB1Mock4Audio};
