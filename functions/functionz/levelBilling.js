"use strict";
const crypto=require("crypto");
const {calculateSharedPaystackFee}=require("./paystackFeePolicy");
const LEVEL_ID=/^(german|swahili)-(A1|A2|B1|B2|C1|C2)$/;
const PRODUCT="falowen_level_enrollment";
const PURPOSE="level_enrollment";
function moneyCents(value) {
  if (typeof value !== "number" || !Number.isFinite(value) || value < 0 || !Number.isSafeInteger(Math.round(value * 100)) || Math.abs(value * 100 - Math.round(value * 100)) > 0.000001) return null;
  return Math.round(value * 100);
}
function ledgerBalance(row) {
  const fee=moneyCents(row?.tuitionFee),paid=moneyCents(row?.paid),balance=moneyCents(row?.balanceDue);
  return fee!==null&&paid!==null&&balance!==null&&fee===paid+balance?balance:null;
}
function checkoutCredit(row,amount) {
  const balance=ledgerBalance(row),credit=moneyCents(amount);
  if (!["active","expired","completed"].includes(row?.status)) throw new Error("Contact Falowen about this enrollment before paying.");
  if (balance===null||balance===0||credit===null||credit<=0||credit>balance) throw new Error("The level balance changed or is not verified. Refresh and review your tuition.");
  if (credit<200000&&credit!==balance) throw new Error("Minimum installment is GH₵2,000, or pay the full remaining balance.");
  return credit/100;
}

const validRow=(row,id)=>LEVEL_ID.test(id)&&id===row?.program+"-"+row?.level;
const isLevelPayment=data=>data?.metadata?.productType===PRODUCT||data?.metadata?.purpose===PURPOSE||String(data?.reference||"").startsWith("FAL-LEVEL-");
async function ownProfile(db,identity){
  if(!identity?.uid||identity.examOnly===true)return null;
  const result=await db.collection("students").where("uid","==",identity.uid).limit(2).get();
  if(result.size!==1)return null;
  const record=result.docs[0],student=record.data();
  if(student.uid!==identity.uid||student.accountType==="exam_only"||["deleted","archived","withdrawn","suspended","blocked"].includes(String(student.status||"").toLowerCase()))return null;
  return record;
}
function registerLevelBillingRoutes(app,{admin,getAuthedUser,fetchImpl=fetch}){
  app.post("/billing/level-checkout",async(req,res)=>{
    res.set("Cache-Control","private, no-store");
    try{
      const identity=await getAuthedUser(req);if(!identity)return res.status(401).json({error:"Sign in again before paying."});
      const id=String(req.body?.enrollmentId||"");
      if(!LEVEL_ID.test(id))return res.status(400).json({error:"Select a valid level."});
      const db=admin.firestore(),owner=await ownProfile(db,identity);
      if(!owner)return res.status(403).json({error:"Could not verify your student account."});
      const secret=process.env.PAYSTACK_SECRET;if(!secret)return res.status(503).json({error:"Online payment is temporarily unavailable."});
      const ref=owner.ref.collection("levelEnrollments").doc(id);
      const reference="FAL-LEVEL-"+crypto.randomBytes(16).toString("hex");
      const paymentRef=db.collection("payments").doc(reference);
      const payment=await db.runTransaction(async tx=>{
        const [profile,snapshot]=await Promise.all([tx.get(owner.ref),tx.get(ref)]);
        if(!profile.exists||profile.data().uid!==identity.uid||!snapshot.exists||!validRow(snapshot.data(),id))throw new Error("Enrollment not found.");
        const student=profile.data(),row=snapshot.data();
        const amount=checkoutCredit(row,req.body?.amount);
        const email=String(student.email||identity.email||"").trim();if(!email.includes("@"))throw new Error("Your account needs a valid email address.");
        const fee=calculateSharedPaystackFee(amount);
        const record={reference,studentId:owner.id,enrollmentId:id,purpose:PURPOSE,provider:"Paystack",currency:"GHS",email,tuitionCredit:amount,checkoutAmount:fee.checkoutAmount,status:"pending",createdBy:identity.uid};
        tx.create(paymentRef,{...record,createdAt:admin.firestore.FieldValue.serverTimestamp()});
        return record;
      });
      const metadata={productType:PRODUCT,purpose:PURPOSE,studentId:payment.studentId,enrollmentId:id,tuitionCredit:payment.tuitionCredit};
      const response=await fetchImpl("https://api.paystack.co/transaction/initialize",{method:"POST",headers:{Authorization:"Bearer "+secret,"Content-Type":"application/json"},body:JSON.stringify({email:payment.email,amount:moneyCents(payment.checkoutAmount),currency:"GHS",reference,callback_url:"https://www.falowen.app/campus/account?tab=billing&payment=return",metadata})});
      const data=await response.json().catch(()=>({}));
      let url;try{url=new URL(data?.data?.authorization_url);}catch{}
      if(!response.ok||data.status!==true||data?.data?.reference!==reference||url?.protocol!=="https:"||url?.hostname!=="checkout.paystack.com")return res.status(502).json({error:"Could not open secure checkout. Please try again."});
      await paymentRef.update({authorizationUrl:url.toString()});
      return res.json({ok:true,authorizationUrl:url.toString(),reference});
    }catch(error){return res.status(409).json({error:String(error?.message||"Unable to start payment.").slice(0,200)});}
  });
  app.get("/billing/level-history/:enrollmentId",async(req,res)=>{
    res.set("Cache-Control","private, no-store");
    try{
      const identity=await getAuthedUser(req);if(!identity)return res.status(401).json({error:"Sign in again."});
      const id=String(req.params.enrollmentId||"");
      if(!LEVEL_ID.test(id))return res.status(400).json({error:"Invalid level."});
      const owner=await ownProfile(admin.firestore(),identity);if(!owner)return res.status(403).json({error:"Account not verified."});
      const ref=owner.ref.collection("levelEnrollments").doc(id),snap=await ref.get();
      if(!snap.exists||!validRow(snap.data(),id))return res.status(404).json({error:"Enrollment not found."});
      const history=await ref.collection("payments").orderBy("receivedDate","desc").limit(100).get();
      return res.json({ok:true,payments:history.docs.map(doc=>{const p=doc.data();return {id:doc.id,amount:p.amount,receivedDate:p.receivedDate,method:p.method,reference:p.reference};})});
    }catch{return res.status(503).json({error:"Payment history is temporarily unavailable."});}
  });
}
// Both Campus and Admin webhooks use the same server-owned payment reference,
// status and allocation document, so delivery to either endpoint is idempotent.
async function processLevelEnrollmentWebhook({admin,data}){
  const reference=String(data?.reference||"");
  if(!reference.startsWith("FAL-")||reference.includes("/")||reference.length>150)return {status:400,body:{status:"rejected",reason:"invalid_reference"}};
  const db=admin.firestore(),paymentRef=db.collection("payments").doc(reference);
  return db.runTransaction(async tx=>{
    const snap=await tx.get(paymentRef);
    if(!snap.exists)return {status:404,body:{status:"rejected",reason:"unknown_order"}};
    const p=snap.data();
    const amount=moneyCents(p.tuitionCredit);
    if(p.purpose!==PURPOSE||p.reference!==reference||!LEVEL_ID.test(p.enrollmentId||"")||typeof p.studentId!=="string"||!p.studentId||p.studentId.includes("/")||amount===null||amount<=0||moneyCents(p.checkoutAmount)===null||Number(data.amount)!==moneyCents(p.checkoutAmount)||data.currency!=="GHS"||data.status!=="success")return {status:400,body:{status:"rejected",reason:"payment_mismatch"}};
    if(["paid","paid_unallocated"].includes(String(p.status).toLowerCase()))return {status:200,body:{status:"duplicate",reference}};
    const parent=db.collection("students").doc(p.studentId),ref=parent.collection("levelEnrollments").doc(p.enrollmentId);
    const key=crypto.createHash("sha256").update(reference.toLowerCase()).digest("hex"),unique=db.collection("levelPaymentReferences").doc(key);
    const [student,enrollment,allocated]=await Promise.all([tx.get(parent),tx.get(ref),tx.get(unique)]);
    if(allocated.exists)return {status:200,body:{status:"duplicate",reference}};
    const stamp=admin.firestore.FieldValue.serverTimestamp();
    const row=enrollment.data(),balance=ledgerBalance(row);
    const date=String(data.paid_at||data.paidAt||new Date().toISOString()).slice(0,10);
    const record={studentId:p.studentId,enrollmentId:p.enrollmentId,reference,amount:amount/100,receivedDate:date,method:"paystack",source:"enrollment_checkout"};
    // Preserve the confirmed money for staff review if the invoice changed mid-checkout.
    if(!student.exists||!enrollment.exists||!validRow(row,p.enrollmentId)||balance===null||amount>balance||row.status==="cancelled"){
      tx.update(paymentRef,{status:"paid_unallocated",allocationError:"Enrollment or balance changed before payment confirmation",paidAt:stamp,paystackTransactionId:data.id||null});
      tx.set(db.collection("auditLogs").doc(),{...record,type:"student.levelPaymentNeedsAllocation",createdAt:stamp});
      return {status:200,body:{status:"paid_unallocated",reference}};
    }
    const remaining=balance-amount,patch={paid:(moneyCents(row.paid)+amount)/100,balanceDue:remaining/100,paymentStatus:remaining?"Partially Paid":"Paid",sheetVersion:Number(row.sheetVersion||1)+1,sheetSyncStatus:"pending"};
    tx.set(unique,{...record,createdAt:stamp});
    tx.set(ref.collection("payments").doc(key),{...record,createdAt:stamp});
    tx.update(ref,{...patch,updatedAt:stamp});
    tx.update(paymentRef,{status:"paid",paidAt:stamp,levelEnrollmentAllocation:p.enrollmentId,paystackTransactionId:data.id||null});
    tx.set(db.collection("auditLogs").doc(),{...record,type:"student.levelPaymentRecorded",after:patch,createdAt:stamp});
    return {status:200,body:{status:"paid",reference}};
  });
}
module.exports={ledgerBalance,checkoutCredit,isLevelPayment,registerLevelBillingRoutes,processLevelEnrollmentWebhook};
