import PartnerAccount from "./PartnerAccount.jsx";
import { useRef, useState } from "react";
import SignedPartnershipForm from "./SignedPartnershipForm.jsx";
import { loadOrganisationAgreement } from "../lib/organisationAgreementRequest.js";
import "./PartnershipPage.css";
const tabs = ["Overview", "Agreement", "Register"];
const steps = [
  ["Create your partner account", "Verify your email, save your organisation profile and sign the agreement once."],
  ["Get partnership approval", "Once approved, use your account to request available German or Kiswahili classes for each student."],
  ["Review & payment", "Falowen confirms the class and tuition for each learner, then deducts the agreed share from eligible paid tuition."],
  ["We enrol your students", "Pay the net total. After payment is verified, Falowen completes enrolment."],
];
export default function PartnershipPage() {
  const [tab, setTab] = useState(0), [agreement, setAgreement] = useState(null);
  const [loading, setLoading] = useState(false), [error, setError] = useState("");
  const inFlight = useRef(false);
  async function selectTab(next) {
    setTab(next);
    if (!next || agreement || inFlight.current) return;
    inFlight.current = true; setLoading(true); setError("");
    try { setAgreement(await loadOrganisationAgreement()); }
    catch (e) { setError(e.message); }
    finally { inFlight.current = false; setLoading(false); }
  }
  function tabKeys(event, index) {
    const next = event.key === "ArrowRight" ? (index + 1) % 3 : event.key === "ArrowLeft" ? (index + 2) % 3 : event.key === "Home" ? 0 : event.key === "End" ? 2 : null;
    if (next === null) return;
    event.preventDefault(); document.getElementById(`partner-tab-${next}`)?.focus(); selectTab(next);
  }
  return <div className="partner-portal">
    <header className="partner-header"><a className="partner-brand" href="https://www.falowen.app" aria-label="Falowen home"><span className="partner-brand-mark" aria-hidden="true"><i /><i /></span>falowen</a>
      <nav aria-label="Partnership navigation"><button onClick={() => selectTab(0)}>How it works</button><button onClick={() => selectTab(1)}>Partnerships</button></nav>
      <button className="partner-button partner-button--nav" onClick={() => selectTab(2)}>Partner sign in / register <span aria-hidden="true">→</span></button>
    </header>
    <div className="partner-tabs" role="tablist" aria-label="Organisation partnership steps">{tabs.map((name, index) => <button key={name} id={`partner-tab-${index}`} role="tab" aria-selected={tab === index} aria-controls={`partner-panel-${index}`} tabIndex={tab === index ? 0 : -1} onClick={() => selectTab(index)} onKeyDown={event => tabKeys(event, index)}><span className="partner-tab-number" aria-hidden="true">{index < tab ? "✓" : `0${index + 1}`}</span>{name}</button>)}</div>
    <section id="partner-panel-0" role="tabpanel" aria-labelledby="partner-tab-0" hidden={tab !== 0}>
      <div className="partner-hero"><div className="partner-hero-copy"><p className="partner-eyebrow">Organisation partnerships</p><h1>Grow your offering.<br /><span>We teach German & Kiswahili.</span></h1><p className="partner-hero-description">Offer German or Kiswahili (Swahili) training to your students and clients through one Falowen organisation partnership. We handle the learning experience while you manage your group.</p><div className="partner-language-pills" aria-label="Languages offered"><span>Deutsch · German</span><span>Kiswahili · Swahili</span></div>
        <div className="partner-hero-actions"><button className="partner-button partner-button--gold" onClick={() => selectTab(1)}>Read agreement <span aria-hidden="true">→</span></button><button className="partner-text-button" onClick={() => selectTab(2)}>Register your organisation</button></div></div>
        <div className="partner-orbit" aria-hidden="true"><div className="partner-orbit-inner"><span>Guten<br />Tag.</span><span>Habari!</span></div><i /><i /></div>
      </div>
      <div className="partner-overview"><div className="partner-section-heading"><p className="partner-eyebrow">A clear path, together</p><h2>Two languages.<br />One partner account.</h2><p>Enrol learners in German, Kiswahili or both, subject to open classes and Falowen approval. Your organisation keeps the same account, agreement and payment process.</p></div>
        <div className="partner-programmes" aria-label="Available language programmes"><article><span className="partner-programme-tag">01 · DEUTSCH</span><h3>German courses</h3><p>For study, professional and everyday communication, with guided lessons, tutor support and Falowen practice tools.</p><small>Select the learner’s German level and an available class when submitting their details.</small></article><article><span className="partner-programme-tag">02 · KISWAHILI</span><h3>Kiswahili courses</h3><p>Help beginners learn practical Tanzanian Kiswahili with speaking, listening, interactive exercises and culture-based lessons.</p><small>Kiswahili A1 enrolment depends on published class availability; other levels are offered only when open.</small></article></div><div className="partner-process">{steps.map(([title, text], index) => <article key={title}><span>0{index + 1}</span><h3>{title}</h3><p>{text}</p></article>)}</div>
        <div className="partner-share-card"><div><p className="partner-eyebrow">Your organisation’s share</p><h2>You keep 10%.<br />Pay the remaining tuition.</h2><p>Your share is deducted from the approved first tuition payment for each eligible student, whether enrolled in German or Kiswahili. No separate payout or bank details are needed.</p></div><dl><div><dt>Example first tuition total</dt><dd>GH₵5,000</dd></div><div><dt>Your 10% share</dt><dd>− GH₵500</dd></div><div><dt>Tuition payable to Falowen</dt><dd>GH₵4,500</dd></div></dl><small>Example for paid tuition only. Sponsored or free places earn no tuition-based share. Checkout processing charges are shown separately; later instalments and renewals do not earn another share.</small></div>
        <div className="partner-language-note"><h3>How do language choices work?</h3><p>After your organisation is approved, choose <strong>German</strong> or <strong>Kiswahili</strong> for each learner on the student submission form, then select a matching available level and class. Falowen confirms tuition and availability before payment. You can include both languages in one group.</p></div>
      </div>
    </section>
    <SignedPartnershipForm agreementOnly tab={tab} agreement={agreement} loading={loading} loadError={error} onRetry={() => selectTab(tab)} onTabChange={selectTab} />
    <div hidden={tab !== 2}><PartnerAccount>{({ profile, refresh }) => <SignedPartnershipForm registrationOnly profile={profile} onSigned={refresh} tab={tab} agreement={agreement} loading={loading} loadError={error} onRetry={() => selectTab(tab)} onTabChange={selectTab} />}</PartnerAccount></div>
    <footer className="partner-footer"><span>Learn Language Education Academy · Falowen</span><span>German · Kiswahili partnerships</span></footer>
  </div>;
}
