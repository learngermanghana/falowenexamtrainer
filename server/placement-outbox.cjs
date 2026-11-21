// The Announcement workbook's existing sheet cycle delivers PENDING Outbox rows.
const { buildPlacementResultEmail } = require("../api/placement-result-email");
const cell = value => ({userEnteredValue: typeof value === "object" ? value :
  typeof value === "number" ? {numberValue:value} : typeof value === "boolean" ? {boolValue:value} : {stringValue:value}});
const append = (sheetId, values) => ({appendCells:{
  sheetId, rows:[{values:values.map(cell)}], fields:"userEnteredValue"
}});

async function queuePlacementResult({id, contact, score, at, language="german"}, sheets, token, fetchImpl=fetch) {
  const book = process.env.PLACEMENT_ANNOUNCEMENT_SHEET_ID;
  if (!book) throw Error("Placement workbook unavailable");
  const access = await fetchImpl("https://www.googleapis.com/drive/v3/files/"+encodeURIComponent(book)+
    "?fields=capabilities(canEdit),permissions(type)&supportsAllDrives=true",{
    headers:{Authorization:"Bearer "+await token()}
  });
  const file = await access.json();
  // Some Sheets-only projects have no Drive API. Restrict the fallback to the
  // exact workbook whose owner and editor grants were verified at setup.
  if (!access.ok && (access.status !== 403 || book !== process.env.PLACEMENT_VERIFIED_PRIVATE_SHEET_ID)) {
    throw Error("Could not verify placement workbook access (HTTP "+access.status+")");
  }
  if (access.ok && (!file.capabilities?.canEdit || !file.permissions?.length ||
      file.permissions.some(permission=>!["user","group"].includes(permission.type)))) {
    throw Error("Placement workbook requires restricted sharing and editor access");
  }
  const call = (path, options) => sheets(path, options, book);
  const metadata = await call("?fields=sheets(properties(sheetId,title))");
  const tabs = Object.fromEntries(metadata.sheets.map(({properties:p}) => [p.title,p.sheetId]));
  const outbox = tabs.Outbox, results = tabs["Placement Results"];
  if (outbox == null || results == null) throw Error("Placement workbook tabs unavailable");
  const headers = (await call("/values/Outbox!A1:AZ1")).values[0];
  const {subject,html} = buildPlacementResultEmail({name:contact.name,score,language});
  const fields = {status:"PENDING",to:contact.email,subject:subject+" · "+id.slice(-8),html,
    created_at:at, email_type:"placement_result",recipient_name:contact.name,
    dedupe_key:id,retry_count:0,delivery_origin:"placement_test"};
  if (![...Object.keys(fields),"sent_at"].every(h=>headers.includes(h))) throw Error("Unexpected Outbox headings");
  const column = name => {
    const n = headers.indexOf(name)+1;
    return (n>26 ? "A" : "") + String.fromCharCode(65+(n-1)%26);
  };
  const lookup = field => {
    const key = column("dedupe_key"), val = column(field);
    return {formulaValue:`=IFERROR(TO_TEXT(INDEX(Outbox!${val}:${val},MATCH("${id}",Outbox!${key}:${key},0))),"")`};
  };
  // Each attempt claims a unique Sheets named range in the SAME atomic write
  // as the two appended rows. Concurrent retries cannot enqueue another message.
  const name = "placement_"+id.replace(/-/g,"_");
  const requests = [
    {addNamedRange:{namedRange:{name,range:{sheetId:results,startRowIndex:0,endRowIndex:1,startColumnIndex:0,endColumnIndex:1}}}},
    append(outbox,headers.map(header=>fields[header] ?? "")),
    append(results,[id,at,contact.name,contact.email,score.total,score.level,contact.classEmails,lookup("status"),lookup("sent_at"),language])
  ];
  try { await call(":batchUpdate",{method:"POST",body:{requests}}); }
  catch (error) {
    // A committed response can be lost in transit. Only acknowledge a known claim.
    const claim = await call("/values/"+name);
    if (claim.values?.[0]?.[0] !== "Attempt ID") throw error;
  }
}
module.exports = {queuePlacementResult};
