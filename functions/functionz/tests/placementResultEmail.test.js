const {buildPlacementResultEmail,sendPlacementResultEmail}=require("../../../api/placement-result-email");

describe("Falowen placement email",()=>{
  test("renders branded, escaped, learner-specific score with official-exam disclaimer",()=>{
    const result=buildPlacementResultEmail({name:'Ama <script>alert("x")</script>',score:{a1:9,a2:5,b1:2,level:"A1"}});
    expect(result.subject).toMatch(/Falowen.*A1/);
    expect(result.html).toContain("FALOWEN");
    expect(result.html).toContain("16/30");
    expect(result.text).toContain("A1 9/10, A2 5/10, B1 2/10");
    expect(result.html).not.toContain("<script>");
    expect(result.html).toContain("&lt;script&gt;");
    expect(result.html).toMatch(/not an official Goethe or CEFR certificate/);
    expect(result.html).toContain("https://www.falowen.app/signup?level=A1");
  });
  test("does not trigger any external sender without explicit configuration",async()=>{
    const url=process.env.PLACEMENT_MAILER_URL,token=process.env.PLACEMENT_MAILER_TOKEN;
    delete process.env.PLACEMENT_MAILER_URL;delete process.env.PLACEMENT_MAILER_TOKEN;
    try{
      const fetchImpl=jest.fn();
      const sent=await sendPlacementResultEmail({id:"pt_12345678-12345678",
        contact:{name:"Sample",email:"sample@example.com"},score:{level:"A1",a1:9,a2:5,b1:2},fetchImpl});
      expect(sent.status).toBe("not_configured");
      expect(fetchImpl).not.toHaveBeenCalled();
    }finally{
      if(url===undefined)delete process.env.PLACEMENT_MAILER_URL;else process.env.PLACEMENT_MAILER_URL=url;
      if(token===undefined)delete process.env.PLACEMENT_MAILER_TOKEN;else process.env.PLACEMENT_MAILER_TOKEN=token;
    }
  });
  test("configured sender transmits exactly one branded message to the mailer",async()=>{
    const url=process.env.PLACEMENT_MAILER_URL,token=process.env.PLACEMENT_MAILER_TOKEN;
    process.env.PLACEMENT_MAILER_URL="https://script.google.com/macros/s/abcdefghijklmnopqrstuvwxyz123456/exec";
    process.env.PLACEMENT_MAILER_TOKEN="test-only-token";
    try{
      const fetchImpl=jest.fn().mockResolvedValue({ok:true,json:async()=>({ok:true,sent:true})});
      const response=await sendPlacementResultEmail({id:"pt_12345678-12345678",
        contact:{name:"Sample",email:"sample@example.com"},
        score:{level:"A1",a1:9,a2:5,b1:2},fetchImpl});
      expect(response.status).toBe("sent");
      expect(fetchImpl).toHaveBeenCalledTimes(1);
      const payload=JSON.parse(fetchImpl.mock.calls[0][1].body);
      expect(payload.to).toBe("sample@example.com");
      expect(payload.id).toBe("pt_12345678-12345678");
      expect(payload.text).toContain("16/30");
      expect(fetchImpl.mock.calls[0][1].method).toBe("POST");
    }finally{
      if(url===undefined)delete process.env.PLACEMENT_MAILER_URL;else process.env.PLACEMENT_MAILER_URL=url;
      if(token===undefined)delete process.env.PLACEMENT_MAILER_TOKEN;else process.env.PLACEMENT_MAILER_TOKEN=token;
    }
  });
});
