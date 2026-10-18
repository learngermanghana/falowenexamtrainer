import React, { useMemo, useState } from "react";
import { postPlacementEvent } from "../lib/placementMonitoring";
import {
  buildPublicFunnelUrl,
  followUpIso,
  getPublicFunnelContext,
  submitPublicLead,
  trackPublicFunnelEvent,
} from "../lib/publicFunnelTracking";

const button = (background, color = "#fff") => ({
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: 44,
  padding: "10px 14px",
  borderRadius: 12,
  background,
  color,
  textDecoration: "none",
  fontWeight: 900,
  border: "1px solid transparent",
});

export default function PlacementFunnelNextStep({ result }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [consent, setConsent] = useState(false);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");
  const [saving, setSaving] = useState(false);
  const context = useMemo(() => getPublicFunnelContext(), []);
  const source = context.source || context.src || "placement-test";
  const video = context.video || context.lesson || "";

  const classesUrl = buildPublicFunnelUrl("/classes/", {
    source,
    video,
    leadId: result.attemptId || "",
    level: result.level,
    utm_source: context.utm_source || source,
    utm_medium: context.utm_medium || "placement_test",
    utm_campaign: context.utm_campaign || "public_funnel",
    utm_content: "recommended_class",
  });
  const signupUrl = buildPublicFunnelUrl("/signup/", {
    source,
    video,
    leadId: result.attemptId || "",
    level: result.level,
    utm_source: context.utm_source || source,
    utm_medium: context.utm_medium || "placement_test",
    utm_campaign: context.utm_campaign || "public_funnel",
    utm_content: "continue_application",
  });
  const whatsappText = encodeURIComponent(
    `Hello Falowen, my placement-test result is ${result.level} (${result.correct}/${result.total}). Please help me choose a class.${video ? ` I came from YouTube lesson ${video}.` : ""}`
  );

  const saveReminder = async (event) => {
    event.preventDefault();
    const normalizedEmail = email.trim().toLowerCase();
    const normalizedName=name.trim();
    const normalizedPhone=phone.trim();
    if(normalizedName.length<2 || (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail) && !/^\+?[0-9 ()-]{9,25}$/.test(normalizedPhone))){
      setStatus("Enter your name and a valid email or phone number.");return;
    }
    if(!consent){setStatus("Please agree to be contacted about Falowen classes.");return;}
    if(!result.attemptId){setStatus("Your attempt ID is unavailable. Please reload the result page.");return;}

    setSaving(true);
    setStatus("Saving your placement result and contact details...");
    try {
      const payload={
        id:result.attemptId,action:"contact",name:normalizedName,email:normalizedEmail,
        phone:normalizedPhone,consent:true,
      };
      let saved;
      // Completion is written asynchronously. Retry only the known 409
      // score-still-saving race, never retry arbitrary validation failures.
      for(let attempt=0;attempt<4;attempt++){
        try {saved=await postPlacementEvent(payload);break;}
        catch(error){
          if(error.status!==409 || attempt===3)throw error;
          await new Promise(resolve=>setTimeout(resolve,500*(attempt+1)));
        }
      }
      // Preserve the existing admissions/Google Apps Script funnel. The Apps Script
      // request is opaque (no-cors), so success here means the private result is saved.
      void submitPublicLead({
        id: result.attemptId,
        createdAt: new Date().toISOString(),
        source: "placement-test-result",
        status: "placement_completed",
        email: normalizedEmail,
        name: normalizedName,
        phone: normalizedPhone,
        level: result.level,
        className: `${result.level} recommendation`,
        classSlug: result.level.toLowerCase(),
        placementCorrect: result.correct,
        placementA1: result.a1,
        placementA2: result.a2,
        placementB1: result.b1,
        placementAttemptId: result.attemptId,
        placementTotal: result.total,
        placementScore: result.total ? Math.round((result.correct / result.total) * 100) : 0,
        emailReminderRequested: Boolean(normalizedEmail),
        reminderType: "placement_result_and_class_follow_up",
        nextFollowUpAt: followUpIso(24),
        paymentStatus: "not_requested",
        followUpCount: 0,
        attribution: context,
      }).catch(()=>{ /* private record is saved; staff can follow up from Admin monitoring */ });
      trackPublicFunnelEvent("placement_contact_saved", { level: result.level });
      const messages = {
        sent: "Your placement result has been emailed to you. You can now continue your registration.",
        already_sent: "Your placement result was already emailed to this address. You can continue your registration.",
        not_configured: "Your result and contact details are saved. Automatic email delivery is not active yet; our admissions team can follow up.",
        failed: "Your result and contact details are saved, but email delivery was unsuccessful. You can try saving again or contact admissions.",
        no_email: "Your result and contact details are saved. Add an email address if you would like the result emailed to you."
      };
      setStatus(messages[saved.emailStatus] || "Your placement result and contact details are saved.");
    } catch (error) {
      setStatus(error?.message || "We could not save your contact details. You can still register or contact us on WhatsApp.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <section style={{ border: "1px solid #bfdbfe", borderRadius: 16, padding: 16, background: "#eff6ff", display: "grid", gap: 14, marginTop: 12 }}>
      <div>
        <p style={{ margin: 0, color: "#1d4ed8", fontSize: 12, fontWeight: 900, textTransform: "uppercase" }}>Your next step</p>
        <h2 style={{ margin: "5px 0", fontSize: 22 }}>Continue with your recommended {result.level} path</h2>
        <p style={{ margin: 0, color: "#475569", lineHeight: 1.6 }}>Your original YouTube lesson or campaign source stays connected as you choose a class and apply.</p>
      </div>

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <a href={classesUrl} onClick={() => trackPublicFunnelEvent("recommended_class_click", { level: result.level })} style={button("#2563eb")}>Choose a {result.level} class</a>
        <a href={signupUrl} onClick={() => trackPublicFunnelEvent("continue_application_click", { level: result.level })} style={{ ...button("#fff", "#1d4ed8"), borderColor: "#2563eb" }}>Continue application</a>
        <a href={`https://wa.me/233205706589?text=${whatsappText}`} target="_blank" rel="noopener noreferrer" onClick={() => trackPublicFunnelEvent("placement_whatsapp_click", { level: result.level })} style={button("#16a34a")}>Ask on WhatsApp</a>
      </div>

      <form onSubmit={saveReminder} style={{ display: "grid", gap: 8, maxWidth: 560 }}>
        <strong>Save my result and get class guidance</strong>
        <p style={{margin:0,color:"#475569",fontSize:13}}>Optional: leave your contact details so our admissions team can help you enrol at the right level. If you provide an email address, Falowen can also send you your recommended level and score. You can register without this form.</p>
        <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
          <input type="text" aria-label="Your full name" autoComplete="name" required value={name} onChange={e=>setName(e.target.value)} placeholder="Full name" style={{flex:"1 1 220px",minHeight:44,borderRadius:10,border:"1px solid #cbd5e1",padding:"10px 12px",font:"inherit"}}/>
          <input type="tel" aria-label="Phone or WhatsApp (optional if email given)" autoComplete="tel" value={phone} onChange={e=>setPhone(e.target.value)} placeholder="Phone / WhatsApp" style={{flex:"1 1 220px",minHeight:44,borderRadius:10,border:"1px solid #cbd5e1",padding:"10px 12px",font:"inherit"}}/>
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <input id="placement-reminder-email" aria-label="Email (optional if phone given)" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Email address" autoComplete="email" style={{ flex: "1 1 240px", minHeight: 44, borderRadius: 10, border: "1px solid #cbd5e1", padding: "10px 12px", font: "inherit" }} />
          <button type="submit" disabled={saving} style={{ minHeight: 44, padding: "10px 14px", border: 0, borderRadius: 10, background: "#0f172a", color: "#fff", fontWeight: 900 }}>{saving ? "Saving..." : (email.trim() ? "Save & email my result" : "Save result & contact")}</button>
        </div>
        <label style={{display:"flex",alignItems:"flex-start",gap:9,color:"#475569",fontSize:13}}>
          <input type="checkbox" checked={consent} onChange={e=>setConsent(e.target.checked)} />
          I agree that Falowen may contact me about German classes and registration. My test result will be used to recommend a starting level.
        </label>
        {status ? <div role="status" style={{ color: status.startsWith("We could") || status.startsWith("Enter") ? "#b91c1c" : "#166534", fontSize: 13 }}>{status}</div> : null}
      </form>
    </section>
  );
}
