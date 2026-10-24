import React from "react";
const box={border:"1px solid #cbd5e1",borderRadius:12,padding:12,minWidth:0,overflowWrap:"anywhere"};
export default function WritingMistakeList({corrections=[],level="A1"}) {
 const items=(Array.isArray(corrections)?corrections:[]).map(item=>({
  wrong:String(item?.wrong||item?.original||item?.original_de||item?.from||"").trim(),
  correct:String(item?.correct||item?.corrected||item?.corrected_de||item?.to||"").trim(),
  reason:String(item?.reason||item?.explanation||item?.explanation_en||"").trim(),
  category:String(item?.category||"").trim(),
 })).filter(item=>item?.wrong&&item?.correct&&item?.wrong!==item?.correct);
 const limit=["B1","B2","C1","C2"].includes(String(level).toUpperCase())?5:3;
 const card=(item,index)=><article key={index} style={{...box,background:"#fff"}}>
  <h4 style={{margin:"0 0 10px"}}>{index+1}. {item?.category||"Language correction"}</h4>
  <div style={{...box,background:"#fee2e2",color:"#7f1d1d"}}><strong>You wrote:</strong> <span lang="de">{item?.wrong}</span></div>
  <div style={{...box,background:"#dcfce7",color:"#14532d",marginTop:8}}><strong>Correct:</strong> <span lang="de">{item?.correct}</span></div>
  <p style={{marginBottom:0}}><strong>Why:</strong> {item?.reason||"No explanation was provided for this correction."}</p>
 </article>;
 return <section style={{...box,background:"#f8fafc"}} aria-label="Actual mistakes">
  <h3 style={{margin:0}}>Actual mistakes ({items.length})</h3>
  <p>Compare your words with the correction, then read why it changes.</p>
  <div style={{display:"grid",gap:12}}>{items.slice(0,limit).map(card)}</div>
  {items.length>limit?<details style={{marginTop:12}}><summary style={{cursor:"pointer",fontWeight:700}}>Show all corrections · {items.length-limit} more</summary><div style={{display:"grid",gap:12,marginTop:12}}>{items.slice(limit).map((item,index)=>card(item,index+limit))}</div></details>:null}
  {!items.length?<p>No specific language corrections were provided. Check the task feedback below.</p>:null}
 </section>;
}
