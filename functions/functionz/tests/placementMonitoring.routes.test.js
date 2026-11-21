const handler = require("../../../api/placement-attempts");
describe("encrypted public placement monitoring", () => {
  const old=process.env.GOOGLE_SERVICE_ACCOUNT_JSON_B64;
  beforeAll(()=>{
    process.env.GOOGLE_SERVICE_ACCOUNT_JSON_B64=Buffer.from(JSON.stringify({
      client_email:"test@sample.iam.gserviceaccount.com",
      private_key:"TEST_ONLY_STATIC_KEY_NEVER_DEPLOYED"
    })).toString("base64");
  });
  afterAll(()=>{if(old===undefined)delete process.env.GOOGLE_SERVICE_ACCOUNT_JSON_B64;else process.env.GOOGLE_SERVICE_ACCOUNT_JSON_B64=old;});
  test("grades the 30 keyed choices on the server and recommends A1, A2, B1 correctly",()=>{
    const all=[0,1,1,1,1,1,1,1,0,0,1,1,0,0,2,1,0,2,0,0,0,1,0,1,0,1,0,0,1,1];
    expect(handler.grade(all)).toEqual({a1:10,a2:10,b1:10,total:30,answered:30,level:"B1"});
    const lower=[...all];[20,21,22,23].forEach(i=>lower[i]=null);
    expect(handler.grade(lower).level).toBe("A2");
    [10,11,12,13].forEach(i=>lower[i]=null);
    expect(handler.grade(lower).level).toBe("A1");
  });
  test("missing items count as incorrect, malformed choices fail",()=>{
    expect(handler.grade(Array(30).fill(null))).toEqual({a1:0,a2:0,b1:0,total:0,answered:0,level:"A1"});
    expect(()=>handler.grade(Array(29).fill(null))).toThrow();
    expect(()=>handler.grade([...Array(29).fill(null),5])).toThrow();
  });
  test("identifiers are validated and consent/contact is required",()=>{
    expect(handler.validId("pt_12345678-12345678")).toBe(true);
    expect(handler.validId("bad/../../")).toBe(false);
    expect(()=>handler.normaliseContact({name:"T",email:"t@example.com",consent:true})).toThrow();
    expect(()=>handler.normaliseContact({name:"Test User",email:"t@example.com",consent:false})).toThrow();
    expect(handler.normaliseContact({name:"  Test User  ",email:"T@EXAMPLE.COM",consent:true})).toEqual({name:"Test User",email:"t@example.com",phone:""});
  });
  test("personal data and scores are encrypted at rest",()=>{
    const raw={id:"pt_12345678-12345678",type:"contact",name:"Sample Learner",email:"test@sample.com",score:{total:25}};
    const cipher=handler.seal(raw);
    expect(cipher).not.toContain("Sample Learner");
    expect(cipher).not.toContain("test@sample.com");
    expect(handler.unseal(cipher)).toEqual(raw);
    expect(()=>handler.unseal(cipher.slice(0,-3)+"xyz")).toThrow();
  });
});

describe("Kiswahili placement uses its private answer key and level thresholds",()=>{
  const previous = process.env.SWAHILI_PLACEMENT_ANSWER_KEY;
  afterEach(()=>{
    if(previous===undefined) delete process.env.SWAHILI_PLACEMENT_ANSWER_KEY;
    else process.env.SWAHILI_PLACEMENT_ANSWER_KEY=previous;
  });
  test("uses 8/10 for A1 and A2, 7/10 for B1, preserving German scoring",()=>{
    // Synthetic test key only; never commit the teacher's confidential production key.
    process.env.SWAHILI_PLACEMENT_ANSWER_KEY=Array(30).fill(0).join(",");
    const perfect=Array(30).fill(0);
    expect(handler.grade(perfect,"swahili")).toEqual({a1:10,a2:10,b1:10,total:30,answered:30,level:"B1"});
    const a2=[...perfect];for(let i=20;i<24;i++)a2[i]=null;
    expect(handler.grade(a2,"swahili").level).toBe("A2");
    const stillA2=[...perfect];for(let i=10;i<13;i++)stillA2[i]=null;
    expect(handler.grade(stillA2,"swahili").level).toBe("A2");
    const a1=[...perfect];for(let i=0;i<3;i++)a1[i]=null;
    expect(handler.grade(a1,"swahili").level).toBe("A1");
    expect(handler.grade(perfect,"german").total).toBeLessThan(30);
    expect(()=>handler.grade(Array(30).fill(4),"swahili")).toThrow();
  });
  test("rejects unsupported language and unavailable private key",()=>{
    delete process.env.SWAHILI_PLACEMENT_ANSWER_KEY;
    expect(()=>handler.grade(Array(30).fill(null),"swahili")).toThrow(/configured/);
    expect(()=>handler.placementLanguage("french")).toThrow(/Unsupported/);
    expect(handler.placementLanguage(undefined)).toBe("german");
  });
});
