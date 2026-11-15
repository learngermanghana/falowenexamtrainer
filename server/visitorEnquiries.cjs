const { sheetApi, rateLimit } = require('../api/placement-attempts');
const sheet = "'Visitor Enquiries'";
const events = new Set(['helper_opened','question_asked','contact_submitted']);
const sources = new Set(['landing','music','exams','public']);
const origins = new Set(['https://falowen.app','https://www.falowen.app','https://music.falowen.app','https://exams.falowen.app','https://www.exams.falowen.app']);
const invalid = () => Object.assign(new Error('Check your enquiry details.'),{status:400});
function enquiryRow(body) {
  const {event,source} = body;
  if (!events.has(event) || !sources.has(source)) throw invalid();
  const row = [new Date().toISOString(),event,source];
  if (event !== 'contact_submitted') return row;
  const {email='',phone='',id} = body;
  if (typeof email !== 'string' || typeof phone !== 'string' || !/^question_[a-z0-9_]{8,70}$/.test(id)) throw invalid();
  if (!email && !phone) throw invalid();
  if (email && (email.length>180 || !/^[^\s@,;<>]+@[^\s@,;<>]+\.[^\s@,;<>]+$/.test(email))) throw invalid();
  if (phone && (phone.length>32 || !/^\+?[\d ()-]+$/.test(phone) || !/^\d{7,15}$/.test(phone.replace(/\D/g,'')))) throw invalid();
  return [...row,email,phone,id];
}
async function visitorEnquiriesHandler(req,res) {
  res.setHeader('Cache-Control','no-store');
  if (req.method !== 'POST') return res.status(405).end();
  if (!origins.has(req.headers.origin)) return res.status(403).end();
  try {
    rateLimit(req);
    const row = enquiryRow(typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {});
    const book = process.env.PLACEMENT_ANNOUNCEMENT_SHEET_ID;
    if (!book || book !== process.env.PLACEMENT_VERIFIED_PRIVATE_SHEET_ID) throw Error('Missing verified workbook');
    const call = (path,options) => sheetApi(path,options,book);
    if (row.length === 3) {
      await call('/values/'+encodeURIComponent(sheet+'!A:F')+':append?valueInputOption=RAW',{method:'POST',body:{values:[row]}});
    } else {
      const metadata = await call('?fields=sheets(properties(sheetId,title))');
      const sheetId = metadata.sheets.find(s=>s.properties.title==='Visitor Enquiries')?.properties.sheetId;
      if (sheetId == null) throw Error('Missing enquiry tab');
      const name = 'lead_'+row[5];
      const requests = [
        {addNamedRange:{namedRange:{name,range:{sheetId,startRowIndex:0,endRowIndex:1,startColumnIndex:0,endColumnIndex:1}}}},
        {appendCells:{sheetId,rows:[{values:row.map(value=>({userEnteredValue:{stringValue:value}}))}],fields:'userEnteredValue'}}
      ];
      try { await call(':batchUpdate',{method:'POST',body:{requests}}); }
      catch (error) {
        const claim = await call('/values/'+name);
        if (claim.values?.[0]?.[0] !== 'Date and time (UTC)') throw error;
      }
    }
    return res.status(200).json({ok:true});
  } catch (error) {
    return res.status(error.status || 503).json({ok:false});
  }
}
module.exports={visitorEnquiriesHandler,enquiryRow};
