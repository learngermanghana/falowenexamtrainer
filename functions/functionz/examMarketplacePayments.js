// Exam-only payments share Falowen's Paystack account, but never mutate course tuition.
// All prices, paid entitlements, and expiry dates are decided on the server.
const { calculateSharedPaystackFee } = require("./paystackFeePolicy");

const CATALOG = Object.freeze({
  single: { priceGhs: 49, durationDays: 14, mockCredits: 1, levels: ["A1","A2","B1","B2"] },
});
const round = (n) => Math.round((n + Number.EPSILON) * 100) / 100;
const MS_PER_DAY = 86400000;
const isValidLevel = (level) => /^(A1|A2|B1|B2|C1|C2)$/.test(level);
const ownEmail = (a, b) => Boolean(a && b && String(a).toLowerCase() === String(b).toLowerCase());
const getActiveLevel = (data, level, now = Date.now()) => {
  const entry = data?.levels?.[level];
  const expiryMs = Date.parse(entry?.expiresAt || "");
  return {
    active: Number.isFinite(expiryMs) && expiryMs > now && Number(entry?.mockCredits || 0) > 0,
    expired: Number.isFinite(expiryMs) && expiryMs <= now,
    expiresAt: Number.isFinite(expiryMs) ? new Date(expiryMs).toISOString() : null,
    mockCredits: Number(entry?.mockCredits || 0),
  };
};

const registerExamMarketplacePayments = (app, {admin,getAuthedUser,findStudentByCodeOrEmail}) => {
  const db = admin.firestore();
  app.get("/paystack/exams/status", async (req,res) => {
    res.set("Cache-Control", "private, no-store");
    const identity = await getAuthedUser(req);
    if (!identity?.uid) return res.status(401).json({error:"Please sign in."});
    try {
      const doc = await db.collection("examEntitlements").doc(identity.uid).get();
      const levels={};
      ["A1","A2","B1","B2","C1","C2"].forEach(level=>{levels[level]=getActiveLevel(doc.data(),level);});
      return res.json({levels});
    } catch (error) {
      console.error("Exam access status error",error);
      return res.status(503).json({error:"Could not check exam access."});
    }
  });

  app.post("/paystack/exams/initialize", async(req,res)=>{
    const identity=await getAuthedUser(req);
    if(!identity?.uid)return res.status(401).json({error:"Please sign in to buy an exam."});
    const packageId=String(req.body?.packageId||"").trim();
    const level=String(req.body?.level||"").trim().toUpperCase();
    const pack=CATALOG[packageId];
    if(!pack || !isValidLevel(level) || !pack.levels.includes(level))
      return res.status(400).json({error:"This mock package is not currently available."});
    if(!process.env.PAYSTACK_SECRET) return res.status(503).json({error:"Checkout is not configured."});
    try{
      const match=await findStudentByCodeOrEmail({uid:identity.uid});
      if(!match || match.snap.data()?.uid!==identity.uid)
        return res.status(403).json({error:"A matching Falowen student profile is required."});
      const profile=match.snap.data();
      const email=String(identity.email||"").trim().toLowerCase();
      if(!email || !ownEmail(email,profile.email)) return res.status(403).json({error:"Your account email does not match your student profile."});
      // Only genuinely eligible exam-only users buy through this funnel. Existing full-course
      // users continue to use the course mock programme and can be offered add-ons later.
      if(profile.accountType!=="exam_only") return res.status(403).json({error:"This checkout is available to exam-only customers."});
      if(String(profile.level||"").toUpperCase()!==level) return res.status(400).json({error:"Choose your registered exam level."});
      const fee=calculateSharedPaystackFee(pack.priceGhs);
      const pesewas=Math.round(fee.checkoutAmount*100);
      const metadata={productType:"exam_package",packageId,level,uid:identity.uid,baseAmount:pack.priceGhs,checkoutAmount:fee.checkoutAmount,feePolicy:"shared_50_50"};
      const response=await fetch("https://api.paystack.co/transaction/initialize",{
        method:"POST",
        headers:{"Authorization":"Bearer "+process.env.PAYSTACK_SECRET,"Content-Type":"application/json"},
        body:JSON.stringify({email,amount:pesewas,currency:"GHS",callback_url:"https://exams.falowen.app/payment-complete",metadata}),
      });
      const body=await response.json().catch(()=>({}));
      const reference=String(body?.data?.reference||"");
      const authorizationUrl=String(body?.data?.authorization_url||"");
      if(!response.ok||!body.status||!reference||!/^https:\/\/(?:checkout\.)?paystack\.com\//i.test(authorizationUrl)) {
        return res.status(502).json({error:"Paystack could not start this checkout."});
      }
      await db.collection("examPaymentIntents").doc(reference).create({
        reference,uid:identity.uid,studentId:match.ref.id,email,level,packageId,
        currency:"GHS",expectedPesewas:pesewas,baseAmount:pack.priceGhs,
        status:"pending",createdAt:admin.firestore.FieldValue.serverTimestamp(),
      });
      return res.json({ok:true,authorization_url:authorizationUrl,reference,checkoutAmount:fee.checkoutAmount});
    }catch(error){
      console.error("Exam checkout initialization failed",error);
      return res.status(503).json({error:"Could not start exam checkout. Please retry."});
    }
  });
};

async function applyExamMarketplaceWebhook({data,admin}) {
  const db=admin.firestore();
  const reference=String(data?.reference||"").trim();
  if(!reference)return {status:400,body:{error:"Missing reference"}};
  const intentRef=db.collection("examPaymentIntents").doc(reference);
  const result=await db.runTransaction(async tx=>{
    const intentSnap=await tx.get(intentRef);
    if(!intentSnap.exists)return {status:202,body:{status:"rejected",reason:"unknown_exam_reference"}};
    const intent=intentSnap.data();
    if(intent.status==="paid") return {status:200,body:{status:"duplicate",reference}};
    const metadata=data?.metadata||{};
    const amount=Number(data.amount);
    const currency=String(data.currency||"").toUpperCase();
    const settledAt=Date.parse(data.paid_at||data.paidAt||data.transaction_date||"");
    const ageMinutes=(Date.now()-settledAt)/60000;
    if(intent.status!=="pending" || metadata.productType!=="exam_package" ||
       metadata.uid!==intent.uid || metadata.packageId!==intent.packageId ||
       String(metadata.level||"").toUpperCase()!==intent.level ||
       !ownEmail(data?.customer?.email,intent.email) ||
       currency!=="GHS" || amount!==intent.expectedPesewas ||
       !Number.isFinite(settledAt)|| ageMinutes>4320||ageMinutes< -10)
      return {status:202,body:{status:"rejected",reason:"exam_payment_mismatch"}};
    const pack=CATALOG[intent.packageId];
    if(!pack || !pack.levels.includes(intent.level))return {status:202,body:{status:"rejected",reason:"unsupported_package"}};
    const entitlementRef=db.collection("examEntitlements").doc(intent.uid);
    const entitlementSnap=await tx.get(entitlementRef);
    const levels=entitlementSnap.data()?.levels||{};
    const previous=levels[intent.level]||{};
    const previousExpiry=Date.parse(previous.expiresAt||"");
    const start=Math.max(Date.now(),Number.isFinite(previousExpiry)?previousExpiry:0);
    const expiresAt=new Date(start+pack.durationDays*MS_PER_DAY).toISOString();
    const newCredits=Number(previous.mockCredits||0)+pack.mockCredits;
    tx.set(entitlementRef,{uid:intent.uid,levels:{[intent.level]:{
      expiresAt,mockCredits:newCredits,packageId:intent.packageId,level:intent.level,
      lastPaymentReference:reference,
    }},updatedAt:admin.firestore.FieldValue.serverTimestamp()},{merge:true});
    tx.set(intentRef,{status:"paid",paidAt:admin.firestore.FieldValue.serverTimestamp(),expiresAt},{merge:true});
    return {status:200,body:{status:"activated",reference}};
  });
  return result;
}

module.exports={registerExamMarketplacePayments,applyExamMarketplaceWebhook,getActiveLevel,CATALOG};
