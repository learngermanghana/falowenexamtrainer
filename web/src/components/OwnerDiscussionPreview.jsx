import React,{useEffect,useState} from "react";
import {collection,db,getDocs,query,where} from "../firebase";
import {styles} from "../styles";

const timeOf = value => value?.toMillis?.() || (typeof value==="number"?value:0);
export default function OwnerDiscussionPreview({selection,lessonId,lessonLabel,embedded=false,title="Class discussion"}){
  const {level,className,program}=selection;
  const [posts,setPosts]=useState(null),[error,setError]=useState("");
  const [replies,setReplies]=useState({}),[busy,setBusy]=useState("");
  const lessonLevel=String(lessonId||"").split("-")[0].toUpperCase();
  const valid=Boolean(db&&className&&level&&program==="german"&&(!embedded||(lessonId&&lessonLevel===level)));
  useEffect(()=>{
    let live=true;
    if(!valid)return;
    const source=collection(db,"class_board",level,"classes",className,"posts");
    getDocs(embedded?query(source,where("lessonId","==",lessonId)):source)
      .then(snapshot=>{if(live)setPosts(snapshot.docs.map(row=>({...row.data(),id:row.id})).sort((a,b)=>(timeOf(b.createdAt)||b.createdAtMs||0)-(timeOf(a.createdAt)||a.createdAtMs||0)));})
      .catch(()=>{if(live)setError("Could not load this class discussion. Check your existing permissions and reopen the lesson.");});
    return()=>{live=false;};
  },[valid,level,className,embedded,lessonId]);
  const loadReplies=async id=>{
    if(busy||!valid||!posts?.some(post=>post.id===id))return;
    setBusy(id);
    try{
      const result=await getDocs(collection(db,"qa_posts",id,"responses"));
      setReplies(old=>({...old,[id]:result.docs.map(row=>({...row.data(),id:row.id})).sort((a,b)=>timeOf(a.createdAt)-timeOf(b.createdAt))}));
    }catch{setError("Responses could not be loaded.");}
    finally{setBusy("");}
  };
  return <section aria-label="Owner discussion preview" style={{...styles.card,display:"grid",gap:10}}>
    <h3 style={{margin:0}}>{title} · read-only testing</h3>
    <p role="status" style={{margin:0}}>{level} · {className||"No testing class selected"}{lessonLabel?" · "+lessonLabel:""}</p>
    <small>Viewing as the verified owner, not as a class member. No posts, presence updates or submissions are created here.</small>
    {!className?<p>Select a class in Developer testing access above.</p>:!valid?<p>This discussion does not match the selected German level or is unavailable for this programme.</p>:error?<p role="alert">{error}</p>:posts===null?<p>Loading discussion…</p>:!posts.length?<p>No discussion posts for this selection.</p>:posts.map(post=><article key={post.id} style={{...styles.card,display:"grid",gap:6}}>
      <strong>{post.questionTitle||post.topic||"Discussion"}</strong>
      <small>{post.lessonLabel||post.lessonId} · {post.createdBy||"Class member"} · {post.status||"open"}</small>
      {post.instructions&&<p style={{whiteSpace:"pre-wrap",margin:0}}>{post.instructions}</p>}
      <p style={{whiteSpace:"pre-wrap",margin:0}}>{post.question}</p>
      {typeof post.extraLink==="string"&&/^https?:\/\//i.test(post.extraLink)&&<a href={post.extraLink} target="_blank" rel="noreferrer">Open lesson link</a>}
      {replies[post.id]===undefined?<button type="button" disabled={!!busy} onClick={()=>loadReplies(post.id)}>{busy===post.id?"Loading…":"View responses"}</button>:<div><strong>Responses ({replies[post.id].length})</strong>{replies[post.id].map(reply=><div key={reply.id} style={{borderTop:"1px solid #e2e8f0",padding:"8px 0"}}><small>{reply.author||reply.responder||"Class member"}</small><p style={{whiteSpace:"pre-wrap",margin:0}}>{reply.text}</p></div>)}</div>}
    </article>)}
  </section>;
}
