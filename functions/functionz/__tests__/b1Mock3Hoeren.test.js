const { PARTS, QUESTIONS, VERIFIED_COUNT, EXPECTED_FULL_COUNT, publicB1Mock3Hoeren, markB1Mock3Hoeren } = require("../b1Mock3Hoeren");
const { PART_KEYS, verifyB1Mock3Audio } = require("../b1Mock3PublishedAudio");

describe("B1 Mock 3 partial Hören — teacher-source-backed answers", () => {
  test("keeps standardized 10/5/7/8 distribution without fabricating the untranscribed parts", () => {
    expect(PARTS.map(x=>x.count)).toEqual([10,5,7,8]);
    expect(PARTS.map(x=>x.verified)).toEqual([true,true,false,false]);
    expect(VERIFIED_COUNT).toBe(15);
    expect(EXPECTED_FULL_COUNT).toBe(30);
    expect(QUESTIONS).toHaveLength(15);
    expect(QUESTIONS.map(x=>x.number)).toEqual(Array.from({length:15},(_,i)=>i+1));
    expect(QUESTIONS.filter(x=>x.part===1)).toHaveLength(10);
    expect(QUESTIONS.filter(x=>x.part===2)).toHaveLength(5);
  });

  test("uses the supplied train-station and short-text transcripts rather than Mock 2 questions", () => {
    expect(QUESTIONS[0].question).toContain("EC-Karte");
    expect(QUESTIONS[1].question).toContain("Thomas");
    expect(QUESTIONS[6].question).toContain("Lukas");
    expect(QUESTIONS[9].question).toContain("Montag");
    expect(QUESTIONS[10].question).toContain("Intercity");
    expect(QUESTIONS[13].question).toContain("Hannover");
  });

  test("keeps all server answer keys private, including in unfinished audio sections", () => {
    const payload=publicB1Mock3Hoeren();
    expect(payload.mockId).toBe("b1-mock-03");
    expect(payload.partial).toBe(true);
    expect(payload.questionCount).toBeUndefined();
    expect(payload.verifiedQuestionCount).toBe(15);
    expect(payload.parts).toHaveLength(4);
    expect(payload.parts[0].questions).toHaveLength(10);
    expect(payload.parts[1].questions).toHaveLength(5);
    expect(payload.parts[2].questions).toHaveLength(0);
    expect(payload.parts[3].questions).toHaveLength(0);
    expect(payload.parts.flatMap(p=>p.questions).every(q=>q.answer===undefined)).toBe(true);
  });

  test("scores 15 known items only and rejects incomplete/fabricated 30-question submissions", () => {
    const key=Object.fromEntries(QUESTIONS.map(q=>[q.number,q.answer]));
    expect(markB1Mock3Hoeren(key)).toMatchObject({
      correct:15,total:15,percentage:100,
      perPart:[{part:1,correct:10,total:10},{part:2,correct:5,total:5}],
    });
    expect(()=>markB1Mock3Hoeren({1:"richtig"})).toThrow();
    expect(()=>markB1Mock3Hoeren({...key,16:"falsch"})).toThrow();
    expect(()=>markB1Mock3Hoeren({...key,5:"invalid"})).toThrow();
  });

  test("uses four exact Cloudflare R2 keys with no bucket-wide permissions", () => {
    expect(Object.values(PART_KEYS)).toEqual([1,2,3,4].map(i=>`b1/mock-hoeren/mock-03/teil-${i}.mp3`));
    expect(PARTS.every(p=>PART_KEYS[`teil-${p.part}`]===p.key)).toBe(true);
  });

  test("checks only 3 bytes from an approved R2 signed URL", async () => {
    let opts;
    const ok=await verifyB1Mock3Audio({
      level:"B1",mockId:"mock-03",part:"teil-1",key:PART_KEYS["teil-1"],
      signedUrl:"https://bucket.account.r2.cloudflarestorage.com/b1/mock-hoeren/mock-03/teil-1.mp3?signed=1",
      fetchImpl:async (_url,o)=>{opts=o;return {
        status:206,headers:{get:()=> "bytes 0-2/4365216"},
        arrayBuffer:async()=>Uint8Array.of(73,68,51).buffer,
      };},
    });
    expect(ok).toBe(true);
    expect(opts.method).toBe("GET");
    expect(opts.headers.Range).toBe("bytes=0-2");
    expect(await verifyB1Mock3Audio({level:"B1",mockId:"mock-02",
      part:"teil-1",key:PART_KEYS["teil-1"],signedUrl:"https://bucket.account.r2.cloudflarestorage.com/x"
    })).toBe(false);
  });
});
