const { PARTS, QUESTIONS, VERIFIED_COUNT, EXPECTED_FULL_COUNT, publicB1Mock3Hoeren, markB1Mock3Hoeren } = require("../b1Mock3Hoeren");
const { PART_KEYS, verifyB1Mock3Audio } = require("../b1Mock3PublishedAudio");

describe("B1 Mock 3 Hören — 30 original-audio-matched tasks", () => {
  test("follows the Goethe-standard 10/5/7/8 distribution with contiguous numbering", () => {
    expect(PARTS.map(p=>p.count)).toEqual([10,5,7,8]);
    expect(PARTS.every(p=>p.verified)).toBe(true);
    expect(VERIFIED_COUNT).toBe(30);
    expect(EXPECTED_FULL_COUNT).toBe(30);
    expect(QUESTIONS).toHaveLength(30);
    expect(QUESTIONS.map(q=>q.number)).toEqual(Array.from({length:30},(_,i)=>i+1));
    expect(PARTS.map(p=>QUESTIONS.filter(q=>q.part===p.part).length)).toEqual([10,5,7,8]);
    expect(QUESTIONS.slice(15,22).every(q=>q.kind==="richtig-falsch")).toBe(true);
    expect(QUESTIONS.slice(22).every(q=>q.kind==="multiple-choice")).toBe(true);
  });

  test("retains original Teil 1 and Teil 2 source facts", () => {
    expect(QUESTIONS[0].question).toContain("EC-Karte");
    expect(QUESTIONS[1].question).toContain("Thomas");
    expect(QUESTIONS[6].question).toContain("Lukas");
    expect(QUESTIONS[9].question).toContain("Montag");
    expect(QUESTIONS[10].question).toContain("Intercity");
    expect(QUESTIONS[13].question).toContain("Hannover");
  });

  test("Teil 3 aligns each question with the numbered Baltic bicycle conversation", () => {
    expect(QUESTIONS[15].question).toMatch(/Freitag.*geregnet/);
    expect(QUESTIONS[16].question).toMatch(/Toms Fahrrad reparieren/);
    expect(QUESTIONS[17].question).toMatch(/Hotel in Lübeck.*Innenhof/);
    expect(QUESTIONS[18].question).toContain("Fischrestaurant");
    expect(QUESTIONS[19].question).toContain("Pizza");
    expect(QUESTIONS[20].question).toContain("verschlafen");
    expect(QUESTIONS[21].question).toContain("Travemünde");
    expect(QUESTIONS.slice(15,22).map(q=>q.answer)).toEqual([
      "falsch","richtig","richtig","falsch","richtig","richtig","richtig",
    ]);
  });

  test("Teil 4 maps Urlaub auf Balkonien statements to the correct actual speakers", () => {
    expect(PARTS[3].label).toContain("Balkonien");
    const speakerOptions=QUESTIONS[22].options.map(o=>o.label);
    expect(speakerOptions).toEqual(["Moderator Markus Baumann","Claudia Weber","Thomas Klein"]);
    expect(QUESTIONS.slice(22).map(q=>q.answer)).toEqual(["b","c","a","c","b","a","b","c"]);
    expect(QUESTIONS[24].question).toContain("Staus");
    expect(QUESTIONS[27].question).toContain("Geld");
    expect(QUESTIONS[29].question).toContain("Reisen");
  });

  test("keeps all 30 answer keys server-only", () => {
    const payload=publicB1Mock3Hoeren();
    expect(payload.mockId).toBe("b1-mock-03");
    expect(payload.partial).toBe(false);
    expect(payload.questionCount).toBe(30);
    expect(payload.verifiedQuestionCount).toBe(30);
    expect(payload.parts).toHaveLength(4);
    expect(payload.parts.map(p=>p.questions.length)).toEqual([10,5,7,8]);
    expect(payload.parts.flatMap(p=>p.questions).every(q=>q.answer===undefined)).toBe(true);
  });

  test("accepts 30 valid answers, scores all four sections, and rejects fabricated/incomplete results", () => {
    const answerKey=Object.fromEntries(QUESTIONS.map(q=>[q.number,q.answer]));
    expect(markB1Mock3Hoeren(answerKey)).toMatchObject({
      correct:30,total:30,percentage:100,
      perPart:[
        {part:1,correct:10,total:10},
        {part:2,correct:5,total:5},
        {part:3,correct:7,total:7},
        {part:4,correct:8,total:8},
      ],
    });
    expect(()=>markB1Mock3Hoeren({1:"richtig"})).toThrow();
    expect(()=>markB1Mock3Hoeren({...answerKey,31:"falsch"})).toThrow();
    expect(()=>markB1Mock3Hoeren({...answerKey,22:"invalid"})).toThrow();
  });

  test("uses only four exact Cloudflare R2 source paths", () => {
    expect(Object.values(PART_KEYS)).toEqual([1,2,3,4].map(i=>`b1/mock-hoeren/mock-03/teil-${i}.mp3`));
    expect(PARTS.every(p=>PART_KEYS[`teil-${p.part}`]===p.key)).toBe(true);
  });

  test("verifies 3 signed R2 bytes without downloading full audio", async () => {
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
