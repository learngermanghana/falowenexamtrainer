import React, { useEffect, useMemo, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { auth, createUserWithEmailAndPassword } from "../firebase";
import { useAuth } from "../context/AuthContext";
import { getBackendUrl } from "../services/backendUrl";
import { MOCK_EXAM_CATALOG } from "../data/mockExamCatalog";

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
const format = (amount) => `GH₵${amount}`;

export function MockExamSignupPage() {
  const { user, studentProfile, refreshStudentProfile } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [level, setLevel] = useState(new URLSearchParams(window.location.search).get("level")?.toUpperCase() || "A1");
  const [working, setWorking] = useState(false);
  const [error, setError] = useState("");
  if (user && studentProfile) return <Navigate to="/mock/checkout" replace />;
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!safeLevels.has(level) || name.trim().split(/\s+/).length < 2 || password.length < 8) {
      setError("Enter your full name, level and a password of at least eight characters.");
      return;
    }
    setWorking(true); setError("");
    try {
      const credential = user
        ? { user }
        : await createUserWithEmailAndPassword(auth, email.trim().toLowerCase(), password);
      const token = await credential.user.getIdToken();
      await api("/mock/register", { method: "POST", token, body: { name: name.trim(), level } });
      await credential.user.getIdToken(true); // reload server-issued examOnly claim
      await refreshStudentProfile?.().catch(() => {});
      navigate("/mock/checkout", { replace: true });
    } catch (err) {
      setError(err?.code === "auth/email-already-in-use"
        ? "This email already has a Falowen account. Sign in instead."
        : err.message || "Could not create your exam account.");
    } finally { setWorking(false); }
  };
  return <main style={card}>
    <a href="/" style={{ color: "#0b776e" }}>← Falowen Exams</a>
    <h1>Exam-only registration</h1>
    <p>Create one Falowen account for German mock exam practice, without enrolling in a full course. Your exam access begins only after a confirmed purchase.</p>
    <form onSubmit={handleSubmit}>
      <label style={field}>Full name<input style={input} required value={name} onChange={e => setName(e.target.value)} /></label>
      {!user && <>
        <label style={field}>Email<input type="email" style={input} required value={email} onChange={e => setEmail(e.target.value)} /></label>
        <label style={field}>Password<input type="password" minLength={8} style={input} required value={password} onChange={e => setPassword(e.target.value)} /></label>
      </>}
      <label style={field}>Exam level<select style={input} value={level} onChange={e => setLevel(e.target.value)}>{LEVELS.map(x=><option key={x}>{x}</option>)}</select></label>
      <p style={{ fontSize: 13, color: "#64748b" }}>You will not receive access to Falowen course lessons or a course trial.</p>
      {error && <p role="alert" style={{ color: "#b42318" }}>{error}</p>}
      <button type="submit" disabled={working} style={button}>{working ? "Creating account…" : "Create exam account"}</button>
    </form>
    <p>Already have a Falowen account? <a href="/login/" style={{ color: "#0b776e" }}>Sign in</a>.</p>
  </main>;
}

export function MockExamCheckoutPage({ paymentReturn = false }) {
  const { user, studentProfile } = useAuth();
  const [catalog, setCatalog] = useState([]);
  const [level, setLevel] = useState(String(studentProfile?.level || "A1").toUpperCase());
  const [packageId, setPackageId] = useState("single");
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
  const selectedPackage = packages.find(row => row.id === packageId) || packages[0];
  const buy = async () => {
    if (!selectedPackage) return;
    setWorking(true); setError("");
    try {
      const token = await user.getIdToken();
      const data = await api("/mock/checkout", { method:"POST", token, body:{ level, packageId: selectedPackage.id } });
      const destination = new URL(data.authorization_url);
      if (!["checkout.paystack.com", "paystack.com"].includes(destination.hostname) || destination.protocol !== "https:") {
        throw new Error("Unexpected payment gateway URL.");
      }
      window.location.assign(destination.toString());
    } catch(e) { setError(e.message); setWorking(false); }
  };
  if (!user) return <Navigate to="/login/" replace />;
  return <main style={card}>
    <a href="/" style={{ color: "#0b776e" }}>← Falowen Exams</a>
    <h1>{paymentReturn ? "Payment confirmation" : "Choose your exam package"}</h1>
    {paymentReturn && <p>Paystack has returned you to Falowen. Access appears below only after the signed payment notification is confirmed. Refresh this page if the payment is still processing.</p>}
    {access.length > 0 && <div style={{ padding: 14, background:"#e6f8f0", borderRadius:10 }}>
      <strong>Your active exam purchases</strong>
      {access.map(row=><p key={row.id}>{row.level} · {row.mockIds.length} mock(s) · until {new Date(row.expiresAtMs).toLocaleDateString()}</p>)}
      <a href="/exams/overview" style={{ ...button, display:"inline-block", textDecoration:"none" }}>Open Exams Room →</a>
    </div>}
    <p>Existing course students keep their course account; exam-only learners will see only purchased exam content.</p>
    <label style={field}>Choose level<select style={input} value={level} onChange={e=>{setLevel(e.target.value);setPackageId("single");}}>{LEVELS.map(l=><option key={l}>{l}</option>)}</select></label>
    {packages.length ? <div style={{ display:"grid", gap:12, margin:"18px 0" }}>
      {packages.map(p => <label key={p.id} style={{ padding:17, border:"1px solid #dbe4ee", borderRadius:10, display:"flex", alignItems:"center", gap:10 }}>
        <input type="radio" name="package" checked={(selectedPackage?.id === p.id)} onChange={()=>setPackageId(p.id)} />
        <span><strong>{p.id === "ready" ? "Exam Ready" : "Single Full Mock"}</strong><br />{p.fullMocks} complete mock(s) · {p.days} days access</span>
        <strong style={{ marginLeft:"auto" }}>{format(p.priceGhs)}</strong>
      </label>)}
    </div> : <p role="status">Complete paid mocks for {level} are not available yet. No payment will be taken for this level.</p>}
    {selectedPackage && <p style={{fontSize:13,color:"#64748b"}}>A small Paystack fee contribution may be added and shown before payment.</p>}
    {error && <p role="alert" style={{color:"#b42318"}}>{error}</p>}
    <button disabled={!selectedPackage || working} onClick={buy} style={{...button, opacity: !selectedPackage || working ? .55 : 1}}>
      {working ? "Opening secure checkout…" : selectedPackage ? `Continue to Paystack · ${format(selectedPackage.priceGhs)} + fees` : "Not yet available"}
    </button>
  </main>;
}

export function MockExamOnlyGate({ children }) {
  const { user, studentProfile } = useAuth();
  const location = useLocation();
  const [state, setState] = useState({ loading: true, active: [] });
  useEffect(() => {
    let subscribed = true;
    setState({loading:true,active:[]});
    if (!user) return undefined;
    user.getIdToken().then(token=>api("/mock/access",{token}))
      .then(data=> {if(subscribed)setState({loading:false,active:data.active||[]});})
      .catch(()=> {if(subscribed)setState({loading:false,active:[]});});
    return ()=>{subscribed=false;};
  }, [user, location.pathname]);
  if (state.loading) return <div style={card} role="status">Checking your purchased mock access…</div>;
  const active = state.active;
  if (!active.length) return <Navigate to="/mock/checkout" replace />;
  if (location.pathname === "/") return <Navigate to="/exams/overview" replace />;
  const examArea = /^\/exams\/(overview|mocks|file)\/?$/.test(location.pathname);
  const allowedMockRoutes = active.flatMap(p=>p.mockIds).map(id=>MOCK_EXAM_CATALOG[id]?.route).filter(Boolean);
  if (!examArea && !allowedMockRoutes.includes(location.pathname)) {
    return <Navigate to="/exams/overview" replace />;
  }
  // Ensure the profile's current level cannot extend access to another level.
  if (examArea && !active.some(p=>p.level===String(studentProfile?.level || "").toUpperCase())) {
    return <Navigate to="/mock/checkout" replace />;
  }
  return children;
}
export { isMockPortal };
