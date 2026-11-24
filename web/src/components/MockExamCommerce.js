import React, { useEffect, useMemo, useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getBackendUrl } from "../services/backendUrl";
import { MOCK_EXAM_CATALOG } from "../data/mockExamCatalog";
import { useFalowenUsdGhsRate, approximateUsd } from "../lib/falowenFxRate";
import { calculateSharedPaystackFee } from "../lib/paystackFeePolicy";
import { getTuitionFeeForLevel } from "../data/levelFees";
import "./PaymentOptions.css";

import { courseTrial, TrialExamPage } from "./TrialPractice";
import { TrialExam } from "../context/TrialCatalogContext";

const LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"];
const safeLevels = new Set(LEVELS);
const isMockPortal = () => ["exams.falowen.app", "www.exams.falowen.app"].includes(
  typeof window === "undefined" ? "" : window.location.hostname.toLowerCase()
);
const api = async (path, { token, method = "GET", body } = {}) => {
  const response = await fetch(`${getBackendUrl()}${path}`, {
    method,
    headers: { ...(body ? { "Content-Type": "application/json" } : {}), ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  const result = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(result.error || "Service unavailable. Try again.");
  return result;
};
const card = { maxWidth: 720, margin: "42px auto", background: "#fff", padding: 30, borderRadius: 18, border: "1px solid #dbe4ee", boxShadow: "0 12px 36px #1b33530d" };
const field = { display: "grid", gap: 5, fontWeight: 600, marginTop: 14 };
const input = { padding: 12, border: "1px solid #bfcbd8", borderRadius: 8, font: "inherit", width: "100%" };
const button = { border: 0, background: "#0b776e", color: "white", padding: "13px 19px", borderRadius: 9, font: "inherit", cursor: "pointer", fontWeight: 800 };
const format = (amount) => `GH₵${Number(amount).toLocaleString("en-GH")}`;

export function PaymentNavigation() {
  const { studentProfile } = useAuth();
  const examOnly = studentProfile?.accountType === "exam_only";
  return <nav aria-label="Student navigation" style={{display: "flex", flexWrap: "wrap", gap: "8px 18px", marginBottom: 20}}>
    {isMockPortal() ? <a href="https://www.falowen.app/">Home</a> : <Link to="/">Home</Link>}
    {isMockPortal() ? <a href="https://www.falowen.app/campus/course">Course Book</a> : <Link to="/campus/course">Course Book</Link>}
    <Link to="/exams/overview">Exams Room</Link>
    {!examOnly && isMockPortal() ? <a href="https://www.falowen.app/campus/account?tab=billing">Account</a>
      : <Link to={examOnly ? "/mock/account" : "/campus/account?tab=billing"}>Account</Link>}
    <Link to="/mock/payment">Payment options</Link>
  </nav>;
}

export function PaymentOptionsPage() {
  const { user, studentProfile, loading } = useAuth();
  const [catalog, setCatalog] = useState([]);
  useEffect(() => {
    let mounted = true;
    api("/mock/catalog").then(data => { if (mounted) setCatalog(data.levels || []); }).catch(() => {});
    return () => { mounted = false; };
  }, []);
  if (loading) return <p role="status">Loading your account…</p>;
  if (!user) return <Navigate to="/login/" replace />;
  if (!studentProfile) return <p role="status">Loading your student account…</p>;
  const examOnly = studentProfile.accountType === "exam_only";
  const switchToExam = !examOnly && Boolean(courseTrial(studentProfile));
  const fullCourseLink = examOnly ? "/mock/account?choice=full_course" : "/campus/account?tab=billing";
  const examLink = switchToExam ? "/mock/account?choice=exam_preparation" : "/mock/checkout";
  const level = String(studentProfile.level || "").toUpperCase();
  const examPackage = catalog.find(row => row.level === level)?.packages?.find(item => item.id === "monthly");
  const currentTuition = !examOnly && Number(studentProfile.tuitionFee) > 0 ? Number(studentProfile.tuitionFee) : getTuitionFeeForLevel(level);
  return <main className="fw-plans">
    <div className="fw-plans-nav"><PaymentNavigation /></div>
    <header className="fw-plans-hero"><div className="fw-plans-eyebrow">Your learning, your choice</div>
      <h1>Choose how to continue</h1>
      <p className="fw-plans-intro">Find the right path for your goals. Review your options and see the final price before paying.</p>
    </header>
    <div className="fw-plans-grid">
      <section className="fw-plan fw-plan--course"><h2>Full Course</h2>
        <div className="fw-plan-price">{currentTuition > 0 ? format(currentTuition) : "View tuition"}</div>
        <p className="fw-plan-subtitle">6 months of platform access</p>
        <ul><li>Live classes</li><li>Course Book</li><li>Exam preparation</li><li>Tutor feedback</li></ul>
        <p className="fw-plan-note">Your existing payments and balance remain on your account. Class pricing and payment options are confirmed before checkout.</p>
        {isMockPortal() && !examOnly ? <a href="https://www.falowen.app/campus/account?tab=billing">Choose course</a> : <Link to={fullCourseLink}>Choose course</Link>}
      </section>
      <section className="fw-plan fw-plan--exam"><h2>Exam Preparation</h2>
        <div className="fw-plan-price">{examPackage ? format(examPackage.priceGhs) : "Monthly subscription"}</div>
        <p className="fw-plan-subtitle">{examPackage ? `per ${examPackage.days} days · ${level}` : "30 days of access"}</p>
        <ul><li>Available full mock exams</li><li>All four exam skills</li><li>AI assessment where available</li><li>Saved progress where available</li></ul>
        <p className="fw-plan-note">Exam subscriptions and course tuition are separate payments. Final fees are shown before payment.</p>
        <Link to={examLink}>Choose exam access</Link>
      </section>
    </div>
  </main>;
}

export function MockExamSignupPage() {
  const { user, loading } = useAuth();
  useEffect(() => {
    if (!loading && !user) {
      const level = new URLSearchParams(window.location.search).get("level");
      const url = new URL("https://www.falowen.app/signup");
      if (safeLevels.has(String(level || "").toUpperCase())) url.searchParams.set("level", level.toUpperCase());
      window.location.replace(url.href);
    }
  }, [loading, user]);
  if (loading) return <p role="status">Loading your account…</p>;
  if (user) return <Navigate to="/exams/mocks" replace />;
  return <main style={card}><p>Opening Falowen signup…</p><a href="https://www.falowen.app/signup">Continue to signup</a></main>;
}

export function MockExamCheckoutPage({ paymentReturn = false }) {
  const { user, studentProfile } = useAuth();
  const fxQuote = useFalowenUsdGhsRate();
  const [catalog, setCatalog] = useState([]);
  const [level, setLevel] = useState(String(studentProfile?.level || "A1").toUpperCase());
  const [access, setAccess] = useState([]);
  const [working, setWorking] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => { api("/mock/catalog").then(data => setCatalog(data.levels || [])).catch(e => setError(e.message)); }, []);
  useEffect(() => { if(safeLevels.has(String(studentProfile?.level || "").toUpperCase()))setLevel(String(studentProfile.level).toUpperCase()); }, [studentProfile?.level]);
  useEffect(() => {
    if (!user) return;
    let active = true;
    user.getIdToken().then(token => api("/mock/access", { token }))
      .then(data => { if(active) setAccess(data.active || []); })
      .catch(e => { if(active) setError(e.message); });
    return () => { active = false; };
  }, [user, paymentReturn]);
  const packages = catalog.find(row => row.level === level)?.packages || [];
  const selectedPackage = packages[0];
  const checkoutFees = selectedPackage ? calculateSharedPaystackFee(selectedPackage.priceGhs) : null;
  const examOnly = studentProfile?.accountType === "exam_only";
  const buy = async () => {
    if (!selectedPackage) return;
    setWorking(true); setError("");
    try {
      const token = await user.getIdToken();
      const data = await api("/mock/checkout", { method:"POST", token, body:{ level, packageId: "monthly" } });
      const destination = new URL(data.authorization_url);
      if (!["checkout.paystack.com", "paystack.com"].includes(destination.hostname) || destination.protocol !== "https:") {
        throw new Error("Unexpected payment gateway URL.");
      }
      window.location.assign(destination.toString());
    } catch(e) { setError(e.message); setWorking(false); }
  };
  if (!user) return <Navigate to="/login/" replace />;
  return <main style={card}>
    <PaymentNavigation />
    <p><Link to="/mock/payment">← Back to payment options</Link></p>
    <h1>{paymentReturn ? "Monthly access confirmation" : "Your monthly exam subscription"}</h1>
    {paymentReturn && <p>Paystack has returned you to Falowen. Access appears below only after the signed payment notification is confirmed. Refresh this page if the payment is still processing.</p>}
    {access.length > 0 && <div style={{ padding: 14, background:"#e6f8f0", borderRadius:10 }}>
      <strong>Your exam access</strong>
      {access.map(row=><p key={row.id}>{row.level} · {row.scope === "trial" ? "Seven-day exam trial" : "All published mock exams and skill practice"} · expires {new Date(row.expiresAtMs).toLocaleDateString()}</p>)}
      <a href="/exams/overview" style={{ ...button, display:"inline-block", textDecoration:"none" }}>Open Exams Room →</a>
    </div>}
    <p>Choose one German level and practise all available mocks, Lesen, Hören, Schreiben and Sprechen in any order for 30 days. No separate Teil purchases.</p>
    <label style={field}>Subscription level<select style={input} value={level} disabled={examOnly} onChange={e=>setLevel(e.target.value)}>{LEVELS.map(l=><option key={l}>{l}</option>)}</select></label>
    {examOnly && <p style={{fontSize:13,color:"#64748b"}}>Your exam-only account is registered at {level}. Your subscription covers this level.</p>}
    {selectedPackage ? <div style={{ padding:22, border:"2px solid #0b776e", borderRadius:14, margin:"18px 0", background:"#f3fbf7" }}>
      <strong>One plan · {level} Monthly Access</strong>
      <div style={{fontSize:34,fontWeight:900,marginTop:10}}>{format(selectedPackage.priceGhs)} <small style={{fontSize:14,fontWeight:600}}>/ 30 days</small></div>
      {approximateUsd(selectedPackage.priceGhs, fxQuote) && <p style={{color:"#52695e",margin:"6px 0",fontSize:15}}>
        ≈ {approximateUsd(selectedPackage.priceGhs, fxQuote)} USD (indicative · rate checked {new Date(fxQuote.fetchedAt).toLocaleDateString("en-GB")})
      </p>}
      <p style={{marginBottom:5}}>✓ Every published mock exam at {level}</p>
      <p style={{marginBottom:5}}>✓ Practise individual Teile and all four skills in any order</p>
      <p style={{marginBottom:5}}>✓ Results and saved progress where available</p>
      <p style={{fontSize:13,color:"#546b62"}}>Renew manually to extend your access. No automatic monthly charge. Newly published practice at your level is included during your active subscription.</p>
    </div> : <p role="status">Monthly practice for {level} is being prepared. Try again if the subscription plan has not loaded.</p>}
    {selectedPackage && <p style={{fontSize:13,color:"#64748b"}}>Paystack charges in GHS. Your total including the shared processing-fee contribution is <strong>{format(checkoutFees?.checkoutAmount || 0)}</strong>{approximateUsd(checkoutFees?.checkoutAmount, fxQuote) ? ` (≈ ${approximateUsd(checkoutFees.checkoutAmount, fxQuote)} USD)` : ""}. Your bank determines the final foreign-currency charge.</p>}
    {error && <p role="alert" style={{color:"#b42318"}}>{error}</p>}
    <button disabled={!selectedPackage || working} onClick={buy} style={{...button, opacity: !selectedPackage || working ? .55 : 1}}>
      {working ? "Opening secure checkout…" : selectedPackage ? `Subscribe for 30 days · ${format(checkoutFees.checkoutAmount)} total` : "Not yet available"}
    </button>
  </main>;
}

export function MockExamOnlyGate({ children, courseTrialState }) {
  const { user, studentProfile } = useAuth();
  const location = useLocation();
  const [state, setState] = useState({ loading: true, active: [] });
  const [retry, setRetry] = useState(0);
  useEffect(() => {
    let subscribed = true;
    setState({loading:true,active:[]});
    if (!user) return undefined;
    user.getIdToken().then(token=>api("/mock/access",{token}))
      .then(data=> {if(subscribed)setState({loading:false,active:data.active||[],entitlements:data.entitlements || null});})
      .catch(()=> {if(subscribed)setState({loading:false,active:[],accessError:true});});
    return ()=>{subscribed=false;};
  }, [user, location.pathname, retry, studentProfile?.accountType, studentProfile?.level]);
  const [clock, setClock] = useState(Date.now);
  const expiry = Math.min(...[...state.active.map(row => row.expiresAtMs), courseTrialState?.endsAtMs]
    .filter(value => Number.isFinite(value) && value > clock));
  useEffect(() => {
    if (!Number.isFinite(expiry) || expiry <= clock) return undefined;
    const timer = setTimeout(() => setClock(Date.now()), Math.min(2147483647, Math.max(1, expiry - Date.now())));
    return () => clearTimeout(timer);
  }, [expiry, clock]);
  const path = location.pathname.replace(/\/+$/, "") || "/";
  const home = path === "/" && !isMockPortal();
  const active = state.loading ? [] : state.active.filter(row => !row.expiresAtMs || row.expiresAtMs > Date.now());
  const registeredLevel = String(studentProfile?.level || "").toUpperCase();
  const eligible = active.filter(row => studentProfile?.courseEnrollmentPreserved || row.level === registeredLevel);
  const activePaidLevels = [...new Set(eligible.filter(row => row.scope !== "trial").map(row => row.level))];
  const paidLevels = state.entitlements
    ? activePaidLevels.filter(level => state.entitlements.exam?.paidLevels?.includes(level))
    : activePaidLevels;
  const serverTrial = state.entitlements?.exam?.trial;
  const trial = state.entitlements
    ? (serverTrial && serverTrial.expiresAtMs > Date.now() ? serverTrial : null)
    : (eligible.find(row => row.scope === "trial" && row.expiresAtMs > Date.now()) ||
       (courseTrialState?.active && courseTrialState.endsAtMs > Date.now()
         ? { level: registeredLevel, expiresAtMs: courseTrialState.endsAtMs } : null));
  const displayLevel = safeLevels.has(registeredLevel) ? registeredLevel : "A1";
  const renderShell = levels => typeof children === "function" ? children(levels) : children;
  // Navigation is not an entitlement. Only these exact catalog paths can
  // render without a verified grant; direct practice URLs remain blocked.
  if (home || (studentProfile?.accountType === "exam_only" && (path === "/campus/course" || path.startsWith("/campus/course/")) && !Object.values(MOCK_EXAM_CATALOG).some(mock => mock.route === path))) return renderShell([displayLevel]);
  const catalog = ["/exams/overview", "/exams/mocks"].includes(path);
  if (state.loading) return <div style={card} role="status">Checking your exam access…</div>;
  if (!paidLevels.length) {
    if (state.accessError && catalog) return <TrialExam.Provider value={{ level: displayLevel, id: null, locked: true, accessError: true, retryAccess: () => setRetry(value => value + 1) }}>{renderShell([displayLevel])}</TrialExam.Provider>;
    if (trial) {
      if (catalog || Object.values(MOCK_EXAM_CATALOG).some(mock => mock.level === trial.level && mock.route === path)) {
        return <TrialExamPage level={trial.level} path={path} expiresAtMs={Number(trial.expiresAtMs)}>{renderShell([trial.level])}</TrialExamPage>;
      }
    }
    if (catalog) return <TrialExam.Provider value={{ level: displayLevel, id: null, locked: true }}>{renderShell([displayLevel])}</TrialExam.Provider>;
    return <Navigate to="/exams/overview" replace />;
  }
  const examArea = /^\/exams\/(overview|mocks|file|lesen|horen|writing|speaking|question|vocab)(?:\/.*)?$/.test(path);
  const allowedMockRoutes = Object.values(MOCK_EXAM_CATALOG)
    .filter(mock => paidLevels.includes(mock.level) && mock.status !== "planned" &&
      mock.id !== "a2-course-preview-01" && mock.route).map(mock => mock.route);
  const routeLevel = path.split("/")[3]?.toUpperCase();
  if ((!examArea && !allowedMockRoutes.includes(path)) ||
      (examArea && safeLevels.has(routeLevel) && !paidLevels.includes(routeLevel))) {
    return <Navigate to="/exams/overview" replace />;
  }
  return renderShell(paidLevels);
}
export { isMockPortal };
