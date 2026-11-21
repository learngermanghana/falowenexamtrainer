const {queuePlacementResult} = require("../../../server/placement-outbox.cjs");
const headers = ["","status","to","subject","html","created_at","sent_at","email_type","recipient_name","dedupe_key","retry_count","delivery_origin"];
const event = {id:"pt_12345678-12345678",at:"2026-11-15T12:00:00Z",contact:{email:"learner@example.com",name:"",classEmails:false},score:{total:1,a1:1,a2:0,b1:0,level:"A1"}};
const access = type => async () => ({ok:true,json:async()=>({capabilities:{canEdit:true},permissions:[{type}]})});
const token = async () => "test";
beforeAll(()=>{process.env.PLACEMENT_ANNOUNCEMENT_SHEET_ID="test";});
afterAll(()=>{delete process.env.PLACEMENT_ANNOUNCEMENT_SHEET_ID;});
test("refuses a link-readable workbook before writing contact details",async()=>{
  const sheets=jest.fn();
  await expect(queuePlacementResult(event,sheets,token,access("anyone"))).rejects.toThrow(/restricted/);
  expect(sheets).not.toHaveBeenCalled();
});
test("one atomic write queues the result and separate follow-up preference",async()=>{
  const sheets=jest.fn().mockResolvedValueOnce({sheets:["Outbox","Placement Results"].map((title,sheetId)=>({properties:{title,sheetId}}))})
    .mockResolvedValueOnce({values:[headers]}).mockResolvedValueOnce({});
  await queuePlacementResult(event,sheets,token,access("user"));
  const [claim,outbox,results]=sheets.mock.calls[2][1].body.requests;
  expect(claim.addNamedRange.namedRange.name).toContain("12345678_12345678");
  expect(outbox.appendCells.rows[0].values[1].userEnteredValue.stringValue).toBe("PENDING");
  expect(outbox.appendCells.rows[0].values[2].userEnteredValue.stringValue).toBe(event.contact.email);
  expect(results.appendCells.rows[0].values[6].userEnteredValue.boolValue).toBe(false);
});

test("a 403 without an explicitly verified workbook stops before queueing",async()=>{
  const sheets=jest.fn();
  await expect(queuePlacementResult(event,sheets,token,async()=>({ok:false,status:403,json:async()=>({})}))).rejects.toThrow(/HTTP 403/);
  expect(sheets).not.toHaveBeenCalled();
});

test("Kiswahili outbox retains language identity without a new workbook",async()=>{
  const sheets=jest.fn().mockResolvedValueOnce({sheets:["Outbox","Placement Results"].map((title,sheetId)=>({properties:{title,sheetId}}))})
    .mockResolvedValueOnce({values:[headers]}).mockResolvedValueOnce({});
  await queuePlacementResult({...event,language:"swahili"},sheets,token,access("user"));
  const [claim,outbox,results]=sheets.mock.calls[2][1].body.requests;
  expect(claim.addNamedRange.namedRange.name).toContain("12345678");
  expect(outbox.appendCells.rows[0].values[3].userEnteredValue.stringValue).toMatch(/Kiswahili/);
  expect(results.appendCells.rows[0].values[9].userEnteredValue.stringValue).toBe("swahili");
});
