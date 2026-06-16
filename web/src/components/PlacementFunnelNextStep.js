import React, { useMemo, useState } from "react";
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
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");
  const [saving, setSaving] = useState(false);
  const context = useMemo(() => getPublicFunnelContext(), []);
  const source = context.source || context.src || "placement-test";
  const video = context.video || context.lesson || "";

  const classesUrl = buildPublicFunnelUrl("/classes/", {
    source,
    video,
    level: result.level,
    utm_source: context.utm_source || source,
    utm_medium: context.utm_medium || "placement_test",
    utm_campaign: context.utm_campaign || "public_funnel",
    utm_content: "recommended_class",
  });
  const signupUrl = buildPublicFunnelUrl("/signup/", {
    source,
    video,
    level: result.level,
    utm_source: context.utm_source || source,
    utm_medium: context.utm_medium || "placement_test",
    utm_campaign: context.utm_campaign || "public_funnel",
    utm_content: "continue_application",
  });
  const whatsappText = encodeURIComponent(
    `Hello Falowen, my placement-test result is ${result.level}. Please help me choose a class.${video ? ` I came from YouTube lesson ${video}.` : ""}`
  );

  const saveReminder = async (event) => {
    event.preventDefault();
    const normalizedEmail = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      setStatus("Enter a valid email address.");
      return;
    }

    setSaving(true);
    setStatus("Saving your reminder request...");
    try {
      await submitPublicLead({
        id: `placement_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
        createdAt: new Date().toISOString(),
        source: "placement-test-result",
        status: "placement_completed",
        email: normalizedEmail,
        name: "",
        phone: "",
        level: result.level,
        className: `${result.level} recommendation`,
        classSlug: result.level.toLowerCase(),
        placementCorrect: result.correct,
        placementTotal: result.total,
        placementScore: result.total ? Math.round((result.correct / result.total) * 100) : 0,
        emailReminderRequested: true,
        reminderType: "placement_result_and_class_follow_up",
        nextFollowUpAt: followUpIso(24),
        paymentStatus: "not_requested",
        followUpCount: 0,
        attribution: context,
      });
      trackPublicFunnelEvent("placement_reminder_requested", { level: result.level });
      setStatus("Reminder request saved for your result and recommended-class follow-up.");
    } catch (_error) {
      setStatus("We could not save the reminder. Please use WhatsApp or try again.");
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
        <label htmlFor="placement-reminder-email" style={{ fontWeight: 850 }}>Save my result and class-reminder request</label>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <input id="placement-reminder-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" autoComplete="email" style={{ flex: "1 1 240px", minHeight: 44, borderRadius: 10, border: "1px solid #cbd5e1", padding: "10px 12px", font: "inherit" }} />
          <button type="submit" disabled={saving} style={{ minHeight: 44, padding: "10px 14px", border: 0, borderRadius: 10, background: "#0f172a", color: "#fff", fontWeight: 900 }}>{saving ? "Saving..." : "Save email reminder"}</button>
        </div>
        {status ? <div role="status" style={{ color: status.startsWith("We could") || status.startsWith("Enter") ? "#b91c1c" : "#166534", fontSize: 13 }}>{status}</div> : null}
      </form>
    </section>
  );
}
