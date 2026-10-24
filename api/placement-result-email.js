// HTML + text placement email, sent only after optional consented contact capture.
const escapeHtml = s => String(s||"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const safePoints = x => Math.max(0,Math.min(10,Math.round(Number(x)||0)));
function buildPlacementResultEmail({name,score}) {
  const level=["A1","A2","B1"].includes(score?.level)?score.level:"A1";
  const a1=safePoints(score?.a1),a2=safePoints(score?.a2),b1=safePoints(score?.b1);
  const total=a1+a2+b1;
  const who=String(name||"learner").trim().slice(0,120);
  const signup="https://www.falowen.app/signup?level="+level+"&source=placement-test";
  const subject="Your Falowen German placement result — "+level;
  const text=[
    "FALOWEN | German Language Hub","","Hello "+who+",",
    "Thank you for taking the Falowen German placement test.",
    "Recommended starting level: "+level,
    "Score: "+total+"/30 (A1 "+a1+"/10, A2 "+a2+"/10, B1 "+b1+"/10).",
    "This is a preliminary recommendation, not an official Goethe or CEFR certificate.","",
    "Choose your next class: "+signup,
    "Need help? Simply reply to this email.","Falowen Admissions — www.falowen.app"
  ].join("\n");
  const html=[
    '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>',
    '<body style="margin:0;background:#eff3f8;font-family:Arial,Helvetica,sans-serif;color:#132443">',
    '<span style="display:none!important;visibility:hidden;opacity:0;height:0;width:0;overflow:hidden">Your German placement result from Falowen.</span>',
    '<table role="presentation" width="100%" cellspacing="0" cellpadding="0"><tr><td align="center" style="padding:28px 12px">',
    '<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;background:white;border-radius:14px;overflow:hidden">',
    '<tr><td style="padding:29px 32px;background:#112f60;color:white"><div style="font-size:27px;font-weight:800;letter-spacing:.5px">FALOWEN<span style="color:#79b1ff">.</span></div><div style="font-size:12px;letter-spacing:1.6px;color:#d0e1fa">GERMAN LANGUAGE HUB</div></td></tr>',
    '<tr><td style="padding:32px 32px 12px"><div style="font-size:12px;letter-spacing:1.5px;font-weight:bold;color:#2961b6">YOUR PLACEMENT RESULT</div>',
    '<h1 style="font-size:26px;line-height:1.3;margin:13px 0;color:#132443">Your German journey starts here</h1>',
    '<p style="font-size:16px;line-height:1.65">Hello '+escapeHtml(who)+',</p>',
    '<p style="font-size:15px;line-height:1.7">Thank you for completing the Falowen placement test. Based on your answers, we recommend starting at this level:</p></td></tr>',
    '<tr><td style="padding:0 32px 24px"><div style="background:#edf5ff;border:1px solid #d7e8ff;border-radius:12px;padding:24px">',
    '<div style="font-size:12px;font-weight:bold;color:#2f5d9f;letter-spacing:1px">RECOMMENDED LEVEL</div>',
    '<div style="font-size:54px;font-weight:800;color:#1553a8;margin:8px 0">'+level+'</div>',
    '<div style="font-size:15px;color:#485a73">Your score: <strong>'+total+'/30 correct</strong></div></div></td></tr>',
    '<tr><td style="padding:0 32px 25px"><div style="font-size:12px;font-weight:bold;color:#56647a;margin-bottom:12px">SCORE BREAKDOWN</div>',
    '<table role="presentation" width="100%" cellspacing="0"><tr>',
    '<td align="center" style="background:#f5f7fb;padding:15px"><b>A1</b><div>'+a1+'/10</div></td>',
    '<td align="center" style="background:#f5f7fb;padding:15px"><b>A2</b><div>'+a2+'/10</div></td>',
    '<td align="center" style="background:#f5f7fb;padding:15px"><b>B1</b><div>'+b1+'/10</div></td>',
    '</tr></table><p style="font-size:12px;line-height:1.6;color:#64748b">This is a preliminary recommendation for class placement, not an official Goethe or CEFR certificate.</p></td></tr>',
    '<tr><td align="center" style="padding:0 32px 32px"><a href="'+signup+'" style="display:block;padding:16px;background:#1f5bbf;border-radius:10px;font-size:16px;font-weight:bold;color:#fff;text-decoration:none">Explore '+level+' classes &amp; register →</a>',
    '<p style="font-size:13px;margin:20px 0 0">Have questions? Reply to this email for guidance.</p></td></tr>',
    '<tr><td style="padding:24px 32px;background:#f7f9fd;border-top:1px solid #e0e6ed;font-size:13px;line-height:1.7;color:#54657d"><b>Falowen Admissions</b><div><a href="https://www.falowen.app" style="color:#1f5bbf">www.falowen.app</a></div></td></tr>',
    '</table><p style="font-size:11px;color:#74839a;max-width:530px">You received this message after requesting to save your placement result and providing an email address.</p></td></tr></table></body></html>'
  ].join("");
  return {subject,text,html};
}
async function sendPlacementResultEmail({id,contact,score,fetchImpl=fetch}) {
  const url=String(process.env.PLACEMENT_MAILER_URL||"");
  const token=String(process.env.PLACEMENT_MAILER_TOKEN||"");
  if(!url||!token||!/^https:\/\/script\.google\.com\/macros\/s\/[\w-]+\/exec$/.test(url))return {status:"not_configured"};
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(contact?.email||"")))return {status:"no_email"};
  try{
    const response=await fetchImpl(url,{method:"POST",headers:{"Content-Type":"text/plain;charset=utf-8"},
      body:JSON.stringify({token,id,to:contact.email,...buildPlacementResultEmail({name:contact.name,score})}),
      signal:AbortSignal.timeout(12000)});
    const result=await response.json().catch(()=>({}));
    return {status:response.ok&&result.ok===true&&result.sent===true?"sent":"failed"};
  }catch(_){return {status:"failed"};}
}
module.exports={buildPlacementResultEmail,sendPlacementResultEmail};
