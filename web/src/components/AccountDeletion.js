import React, { useEffect, useState } from "react";
import { EmailAuthProvider, GoogleAuthProvider, reauthenticateWithCredential, reauthenticateWithPopup } from "firebase/auth";
import { db, doc, getDoc, onSnapshot, functions, httpsCallable } from "../firebase";
import { useAuth } from "../context/AuthContext";
const box = { border: "1px solid #fca5a5", borderRadius: 14, padding: 20, maxWidth: 640, margin: "20px auto", background: "#fff", overflowWrap: "anywhere" };
export function AccountDeletionCard({ pending = null }) {
  const { user, logout } = useAuth();
  const [confirmation, setConfirmation] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);
  const [available, setAvailable] = useState(Boolean(pending));
  useEffect(() => {
    let cancelled = false;
    if (!user?.uid || pending) return;
    getDoc(doc(db, "accountDeletionRequests", user.uid)).then(() => { if (!cancelled) setAvailable(true); }).catch(() => { if (!cancelled) setAvailable(false); });
    return () => { cancelled = true; };
  }, [user?.uid, pending]);
  const google = user?.providerData?.some(provider => provider.providerId === "google.com");
  const state = pending || result;
  if (state?.status === "completed") return <section style={box}><h2>Account deleted</h2><p>Your account deletion is complete.</p><button onClick={()=>logout()}>Sign out</button></section>;
  const recoverable = state?.status === "pending" && Date.parse(state.deleteAt) > Date.now();
  async function submit(event) {
    event.preventDefault(); setBusy(true); setError("");
    try {
      if (google) await reauthenticateWithPopup(user, new GoogleAuthProvider());
      else await reauthenticateWithCredential(user, EmailAuthProvider.credential(user.email, password));
      await user.getIdToken(true);
      const response = await httpsCallable(functions, state ? "cancelAccountDeletion" : "requestAccountDeletion")({ confirmation });
      setPassword(""); setResult(response.data.status === "cancelled" ? null : response.data);
    } catch (failure) {
      setError(failure?.code?.includes("credential") || failure?.code?.includes("password") ? "Your password was not accepted. Try again." : failure.message || "Could not update your account. Please try again.");
    } finally { setBusy(false); }
  }
  return <section style={box} aria-label="Account deletion">
    <h2>{state ? "Account deletion scheduled" : "Delete account"}</h2>
    {state ? <p>Your learning access is paused. Permanent deletion starts after <strong>{new Date(state.deleteAt).toLocaleDateString(undefined, {dateStyle:"long"})}</strong>. {recoverable ? "Sign in again below to cancel deletion and restore access." : "The recovery period has ended. Your account is being removed."}</p> : <>
      <p>Request deletion of your profile, submissions, results, progress and linked recordings. Learning access pauses immediately. You have 30 days to sign back in and cancel; after that deletion is permanent.</p>
      <p>Payment transaction records may be retained separately. Deleting your account does not refund tuition or remove an outstanding balance.</p>
    </>}
    {state?.reviewRequired ? <p role="status">Deletion is paused while Falowen verifies ownership of an older recording. Contact Falowen support for help.</p> : null}
    {(!state || recoverable) ? <form onSubmit={submit} style={{display:"grid",gap:12}}>
      {!state ? <label>Type DELETE to confirm<input value={confirmation} onChange={event=>setConfirmation(event.target.value)} autoComplete="off" style={{display:"block",width:"100%",boxSizing:"border-box",padding:10}} /></label> : null}
      {!google ? <label>Confirm your password<input type="password" value={password} onChange={event=>setPassword(event.target.value)} autoComplete="current-password" required style={{display:"block",width:"100%",boxSizing:"border-box",padding:10}} /></label> : <p>Confirm with your Google account.</p>}
      <button type="submit" disabled={!available || busy || (!state && confirmation !== "DELETE")} style={{padding:12,cursor:"pointer"}}>{busy ? "Please wait…" : state ? "Cancel deletion and restore account" : "Request account deletion"}</button>
    </form> : null}
    {!available && !state ? <p role="status">Account deletion is temporarily unavailable. Please try again later.</p> : null}
    {error ? <p role="alert">{error}</p> : null}
    {state ? <button type="button" disabled={busy} onClick={()=>logout()} style={{marginTop:12,padding:12}}>Sign out</button> : null}
  </section>;
}
export default function AccountDeletionBoundary({ children }) {
  const { user } = useAuth();
  const [state, setState] = useState({uid:null,loading:true,data:null,error:""});
  useEffect(()=>{
    if (!user) { setState({uid:null,loading:false,data:null,error:""}); return; }
    setState({uid:user.uid,loading:true,data:null,error:""});
    return onSnapshot(doc(db,"accountDeletionRequests",user.uid),snapshot=>setState({uid:user.uid,loading:false,data:snapshot.data(),error:""}),failure=>setState({uid:user.uid,loading:false,data:null,error:failure.code === "permission-denied" ? "rules-unavailable" : "Account status could not be checked. Refresh to try again."}));
  },[user?.uid]);
  if (!user) return children;
  if (state.loading || state.uid !== user.uid) return <p role="status">Checking account status…</p>;
  if (state.error === "rules-unavailable") return children;
  if (state.error) return <section style={box}><p role="alert">{state.error}</p><button onClick={()=>window.location.reload()}>Refresh</button></section>;
  if (["pending","processing","completed"].includes(state.data?.status)) return <AccountDeletionCard pending={state.data}/>;
  return children;
}
