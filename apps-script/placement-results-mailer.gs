/**
 * Deploy this as a SEPARATE Google Apps Script Web App, running as Me.
 * In Project Settings > Script Properties set PLACEMENT_MAILER_TOKEN.
 * Add the same value and this project's /exec URL to Falowen Vercel secrets.
 * Do not put the token into browser code or the existing Leads web app.
 */
function doPost(e) {
  var reply = x => ContentService.createTextOutput(JSON.stringify(x)).setMimeType(ContentService.MimeType.JSON);
  try {
    var input=JSON.parse((e&&e.postData&&e.postData.contents)||"{}");
    var token=PropertiesService.getScriptProperties().getProperty("PLACEMENT_MAILER_TOKEN");
    if(!token||input.token!==token)return reply({ok:false,error:"Unauthorized"});
    if(!/^pt_[a-zA-Z0-9-]{12,90}$/.test(String(input.id||""))||
       !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(input.to||""))||
       !String(input.html||"").includes("FALOWEN")||String(input.html||"").length>30000||
       String(input.subject||"").length>180)return reply({ok:false,error:"Invalid request"});
    var lock=LockService.getScriptLock();
    lock.waitLock(15000);
    try{
      var props=PropertiesService.getScriptProperties();
      var key="placement_sent_"+input.id;
      if(props.getProperty(key))return reply({ok:true,sent:true,duplicate:true});
      if(MailApp.getRemainingDailyQuota()<1)return reply({ok:false,error:"Mail quota reached"});
      MailApp.sendEmail({to:input.to,name:"Falowen German Language Hub",
        replyTo:"learngermanghana@gmail.com",subject:input.subject,
        body:String(input.text||"Your Falowen placement result is ready."),htmlBody:input.html});
      props.setProperty(key,new Date().toISOString());
      return reply({ok:true,sent:true});
    }finally{lock.releaseLock();}
  }catch(error){console.error("placement_mailer_error",String(error&&error.message||"error"));return reply({ok:false,error:"Sending failed"});}
}
