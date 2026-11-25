"use strict";
const { randomBytes, createHmac } = require("node:crypto");
const { isIP } = require("node:net");
const DAY = 86400000;
// Use the last ingress-appended address, not an arbitrary client-supplied
// x-real-ip or the first XFF entry. This endpoint is called directly on GCP.
// Missing or proxy-like IP information never blocks a learner.
function observedSignupIp(req = {}) {
  const raw = String(req.headers?.["x-forwarded-for"] || "").split(",").at(-1).trim();
  const ip = raw.startsWith("::ffff:") ? raw.slice(7) : raw;
  return isIP(ip) && ip !== "0.0.0.0" && ip !== "::" ? ip.toLowerCase() : "";
}
const browser = value => /^[a-zA-Z0-9_-]{16,128}$/.test(String(value || "")) ? String(value) : "";
const hash = (salt, value) => createHmac("sha256", salt).update(value).digest("hex");
const ms = value => value?.toMillis?.() || (value instanceof Date ? value.getTime() : 0);
let saltPromise;
async function loadSalt(db) {
  if (!saltPromise) {
    const ref = db.collection("signupNetworkConfig").doc("keys");
    saltPromise = db.runTransaction(async tx => {
      const snap = await tx.get(ref);
      const salt = snap.data()?.salt;
      if (typeof salt === "string" && /^[a-f0-9]{64}$/.test(salt)) return salt;
      const created = randomBytes(32).toString("hex");
      tx.set(ref, {salt:created});
      return created;
    }).catch(error => { saltPromise = null; throw error; });
  }
  return saltPromise;
}
async function reviewSignupNetwork({db,application,program,browserId,ip,studentCode,now=Date.now(),salt}) {
  if (!["german","swahili"].includes(program)) throw new Error("invalid_program");
  const email = application.email.trim().toLowerCase();
  const phone = application.phone;
  // Only compare exact normalized contacts and pseudonymous network signals.
  // No names, raw IP addresses or raw browser identifiers are stored.
  const key = salt || await loadSalt(db);
  const emailKey = hash(key, "email:"+email);
  const identity = hash(key, "application:"+program+":"+email+":"+phone.replace(/\D/g,""));
  const reviewRef = db.collection("signupRegistrationReviews").doc(identity);
  const browserRef = browser(browserId) ? db.collection("signupNetworkKeys").doc(hash(key,"browser:"+program+":"+browserId)) : null;
  const ipRef = isIP(ip || "") ? db.collection("signupNetworkKeys").doc(hash(key,"ip:"+program+":"+ip)) : null;
  const permit = randomBytes(24).toString("hex");
  const permitRef = db.collection("signupTrialPermits").doc(permit);
  const stamp = new Date(now);
  return db.runTransaction(async tx => {
    const [reviewSnap, browserSnap, ipSnap] = await Promise.all([
      tx.get(reviewRef), browserRef ? tx.get(browserRef) : null, ipRef ? tx.get(ipRef) : null
    ]);
    const review = reviewSnap.data() || {};
    const signal = snap => {
      const d = snap?.data() || {};
      return ms(d.expiresAt)>now && d.emailKey && d.emailKey !== emailKey;
    };
    const browserMatch = Boolean(signal(browserSnap));
    const ipMatch = Boolean(signal(ipSnap));
    // An approval is specific to these contact details and course language.
    // A pending/rejected applicant cannot bypass the hold by clearing storage.
    const approved = review.status === "approved";
    const hold = !approved && (browserMatch || ["pending","rejected"].includes(review.status));
    const status = hold ? (review.status === "rejected" ? "rejected" : "pending")
      : approved ? "approved" : ipMatch ? (review.status === "acknowledged" ? "acknowledged" : "ip_flag") : "";
    if (status && (!reviewSnap.exists || review.status !== status ||
        (browserMatch && !review.browserMatch) || (ipMatch && !review.ipMatch))) {
      tx.set(reviewRef,{
        email, program, status,
        browserMatch: Boolean(review.browserMatch || browserMatch),
        ipMatch: Boolean(review.ipMatch || ipMatch),
        createdAt: review.createdAt || stamp, updatedAt:stamp,
        // Intended retention window; Firestore TTL is an optional later policy.
        expiresAt:new Date(now+90*DAY),
      },{merge:true});
    }
    if (hold) return {hold:true};
    // A reservation avoids racing two signups in the same browser. An abandoned
    // signup can produce a review flag; admins can approve legitimate cases.
    for (const [ref,snap,days] of [[browserRef,browserSnap,90],[ipRef,ipSnap,1]]) {
      if (!ref) continue;
      const previous=snap?.data() || {};
      if (ms(previous.expiresAt)<=now) tx.set(ref,{emailKey,expiresAt:new Date(now+days*DAY)});
    }
    tx.set(permitRef,{email,phone,program,studentCode:String(studentCode || "").slice(0,180),
      expiresAt:new Date(now+30*60000)});
    return {hold:false,permit};
  });
}
module.exports={reviewSignupNetwork,observedSignupIp};
