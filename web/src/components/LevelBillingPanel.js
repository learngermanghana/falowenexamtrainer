import React,{useState} from "react";
import {legacyUpgradeOverlap} from "../utils/levelUpgradeBilling";
import {getBackendUrl} from "../services/backendUrl";
import {calculateSharedPaystackFee} from "../lib/paystackFeePolicy";

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

const title=row=>(row.program==="swahili"?"Kiswahili":"German")+" "+row.level;
const date=v=>v?String(v).slice(0,10):"Not set";
const money=n=>new Intl.NumberFormat("en-GH",{style:"currency",currency:"GHS",maximumFractionDigits:2}).format(n);
const order=["A1","A2","B1","B2","C1","C2"];
function LevelCard({row,user,paymentsEnabled,blocked,granted,studentProfile}){
 const balance=ledgerBalance(row);
 const due=balance===null?null:balance/100;
 const overlap=legacyUpgradeOverlap(studentProfile,row);
 const managed=row.accountingMode==="payment_driven_upgrade_v1";
 const payable=!overlap&&due>0&&(["active","expired","completed"].includes(row.status)||(managed&&row.status==="planned"&&row.paid===0));
 const [custom,setCustom]=useState(false),[amount,setAmount]=useState(""),[busy,setBusy]=useState(false),[error,setError]=useState("");
 const [history,setHistory]=useState(null),[historyBusy,setHistoryBusy]=useState(false),[historyError,setHistoryError]=useState("");
 const selected=custom?Number(amount):due;
 const valid=payable&&Number.isFinite(selected)&&selected>0&&selected<=due&&(selected===due||selected>=2000)&&moneyCents(selected)!==null;
 const fee=valid?calculateSharedPaystackFee(selected):null;
 const percent=balance===null?null:row.tuitionFee===0?100:Math.round(row.paid/row.tuitionFee*100);
 const overdue=due>0&&row.paymentDeadline&&row.paymentDeadline<new Date().toISOString().slice(0,10);
 const headers=async()=>({Authorization:"Bearer "+await user.getIdToken(),"Content-Type":"application/json"});
 const pay=async()=>{
  if(!valid||busy||!paymentsEnabled)return;
  setBusy(true);setError("");
  try{
   const response=await fetch(getBackendUrl()+"/billing/level-checkout",{method:"POST",headers:await headers(),body:JSON.stringify({enrollmentId:row.id,amount:selected})});
   const result=await response.json().catch(()=>({}));
   if(!response.ok||!result.ok)throw new Error(result.error||"Could not start payment.");
   const url=new URL(result.authorizationUrl);
   if(url.protocol!=="https:"||url.hostname!=="checkout.paystack.com")throw new Error("Invalid checkout link.");
   window.location.assign(url.toString());
  }catch(e){setError(e.message);setBusy(false);}
 };
 const loadHistory=async()=>{
  if(historyBusy)return;
  setHistoryBusy(true);setHistoryError("");
  try{const response=await fetch(getBackendUrl()+"/billing/level-history/"+encodeURIComponent(row.id),{headers:await headers(),cache:"no-store"});
   const data=await response.json().catch(()=>({}));
   if(!response.ok||!data.ok)throw new Error(data.error||"Unable to load payment history.");
   setHistory(data.payments||[]);
  }catch(e){setHistoryError(e.message);}finally{setHistoryBusy(false);}
 };
 return <article className="fw-billing-level" data-level-billing={row.id}>
  <header><h3>{title(row)}</h3><span className="fw-account-pill" style={{background:due===0?"#e7f6ed":"#fff4df",color:due===0?"#166534":"#92400e"}}>{due===null?"Fee to confirm":due===0?"Fully paid":overdue?"Payment overdue":"Payment due"}</span></header>
  <div className="fw-billing-due"><small>Outstanding balance</small><strong>{due===null?"Not confirmed":money(due)}</strong></div>
  {payable&&<div className="fw-billing-action">
   {paymentsEnabled?<><button className="fw-billing-pay" type="button" disabled={!valid||busy} onClick={pay}>{busy?"Opening Paystack…":valid?"Pay Now · "+money(selected):"Pay Now"}</button>
   {fee&&<small>Secure Paystack checkout · Total charged {money(fee.checkoutAmount)} including your {money(fee.studentFeeContribution)} fee share.</small>}
   {due>2000&&<details onToggle={e=>{setCustom(e.currentTarget.open);setAmount("");}}><summary>Pay part of the balance instead</summary><label>Tuition amount (GHS)<input type="number" min="2000" max={due} step=".01" value={amount} onChange={e=>setAmount(e.target.value)}/></label><small>Minimum GH₵2,000, or pay the remaining balance.</small></details>}
   {error&&<p role="alert">{error}</p>}</>:<p>Online payment is temporarily unavailable. Contact Falowen for assistance.</p>}
  </div>}
  {overlap&&due>0?<p role="alert">Payment needs verification: an earlier upgrade is still open. Contact Falowen to reconcile your payment record before checkout. <a href="mailto:info@falowen.app">Contact billing support</a></p>:due>0&&!payable&&<p>Contact Falowen about this {row.status} enrollment before paying.</p>}
  <div className="fw-billing-breakdown"><div><small>Tuition</small><strong>{row.tuitionFee==null?"Not set":money(row.tuitionFee)}</strong></div><div><small>Already paid</small><strong>{row.paid==null?"Not set":money(row.paid)}</strong></div></div>
  {percent!==null&&<><progress aria-label={title(row)+" tuition paid"} value={percent} max={100}/><small>{percent}% paid</small></>}
  <div className="fw-billing-dates"><span>Payment deadline: <strong>{date(row.paymentDeadline)}</strong></span><span>Contract: {date(row.contractStart)} to {date(row.contractEnd)} · {row.status}</span>{blocked?<small>Course access paused. {managed?"Full payment restores upgrade access and extends the contract; additional installments do not restart temporary access.":"Payment does not extend an expired contract automatically."}</small>:granted?<small>{row.contractEnd&&row.contractEnd<new Date().toISOString().slice(0,10)?"Previous course · revision access retained":"Course access available"}</small>:null}</div>
  <details className="fw-billing-transactions" onToggle={e=>{if(e.currentTarget.open&&history===null&&!historyBusy)loadHistory();}}><summary>Transaction history</summary>
   {historyBusy?<p>Loading payments…</p>:historyError?<><p role="alert">{historyError}</p><button type="button" onClick={loadHistory}>Try again</button></>:history!==null&&<>{!history.length?<p>No individual transactions recorded for this level.</p>:history.map(p=><div key={p.id}><strong>{money(p.amount)}</strong> · {date(p.receivedDate)} · {p.method}<small>{p.reference}</small></div>)}{typeof row.paid==="number"&&row.paid>history.reduce((sum,p)=>sum+Number(p.amount||0),0)&&<p>Some historical credit is included in your paid total and does not have an individual transaction here.</p>}<button type="button" onClick={loadHistory}>Refresh transactions</button></>}
  </details>
 </article>;
}
export default function LevelBillingPanel({rows,user,paymentsEnabled,blockedLevels=[],grantedLevels=[],studentProfile}){
 const sorted=[...rows].sort((a,b)=>Number(ledgerBalance(b)>0)-Number(ledgerBalance(a)>0)||order.indexOf(b.level)-order.indexOf(a.level));
 return <section className="fw-account-billing" aria-label="Payments and billing"><div><h2>Payments &amp; billing</h2><p>See what you owe and pay the correct course directly.</p></div>{sorted.map(row=><LevelCard key={row.id} row={row} user={user} paymentsEnabled={paymentsEnabled} blocked={blockedLevels.includes(row.level)} granted={grantedLevels.includes(row.level)} studentProfile={studentProfile}/>)}
 <small>Payments are confirmed by Paystack. Your tuition balance updates after confirmation. Need help? <a href="mailto:info@falowen.app">Contact Falowen</a>.</small></section>;
}
