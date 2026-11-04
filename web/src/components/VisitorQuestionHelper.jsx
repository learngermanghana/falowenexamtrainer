import React, { useEffect, useRef, useState } from 'react';
import { loadPublicClasses } from '../services/publicClassCatalogService';
import { QUICK_QUESTIONS, questionTopic, visitorAnswer, visitorWhatsAppLink } from '../data/visitorQuestions';
import './VisitorQuestionHelper.css';

export default function VisitorQuestionHelper() {
  const [open, setOpen] = useState(false);
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState([]);
  const [busy, setBusy] = useState(false);
  const input = useRef(null);
  const trigger = useRef(null);
  const log = useRef(null);
  const catalog = useRef(null);
  const mounted = useRef(true);
  useEffect(() => { mounted.current = true; return () => { mounted.current = false; }; }, []);
  useEffect(() => { if (open) input.current?.focus(); }, [open]);
  useEffect(() => { if (log.current) log.current.scrollTop = log.current.scrollHeight; }, [messages, busy, open]);
  function close() { setOpen(false); trigger.current?.focus(); }
  async function ask(value) {
    const text = String(value).trim().slice(0,500);
    if (!text || busy) return;
    setQuestion(''); setBusy(true);
    setMessages(previous => [...previous.slice(-18), {question:text}]);
    let classes = [];
    try {
      if (questionTopic(text)?.id === 'classes') {
        if (!catalog.current) catalog.current = loadPublicClasses();
        classes = await catalog.current;
        if (!classes.length) catalog.current = null;
      }
      const context = /^(www\.)?exams\.falowen\.app$/.test(window.location.hostname) ? 'exams' : window.location.pathname.startsWith('/books') ? 'books' : '';
      const answer = visitorAnswer(text, {classes, context});
      if (mounted.current) setMessages(previous => [...previous, {answer, questionText:text}]);
    } catch {
      catalog.current = null;
      if (mounted.current) setMessages(previous => [...previous, {answer:{text:'I cannot check that information right now. Please ask our team on WhatsApp.',handoff:true},questionText:text}]);
    } finally { if (mounted.current) setBusy(false); }
  }
  return <aside className="visitor-helper" aria-label="Falowen questions">
    {open && <section id="visitor-question-panel" className="visitor-helper-panel" role="dialog" aria-modal="false" aria-labelledby="visitor-helper-title" onKeyDown={event => {if(event.key === 'Escape') close();}}>
      <header><div><strong id="visitor-helper-title">Ask Falowen</strong><p>Quick answers for new learners</p></div><button type="button" onClick={close} aria-label="Close questions">×</button></header>
      <div className="visitor-helper-log" ref={log} role="log" aria-live="polite" aria-relevant="additions">
        <p className="visitor-helper-answer">Hi! Ask about classes, fees, registration or learning options. I use saved answers; our team can help on WhatsApp if you need more.</p>
        {messages.map((message,index) => message.question ? <p key={index} className="visitor-helper-question">{message.question}</p> : <div key={index} className="visitor-helper-answer"><p>{message.answer.text}</p>
          {message.answer.href && <a href={message.answer.href}>{message.answer.label} →</a>}
          {message.answer.handoff && <a href={visitorWhatsAppLink(message.questionText)} target="_blank" rel="noopener noreferrer">Ask our team on WhatsApp ↗</a>}
        </div>)}
        {busy && <p role="status">Checking your question…</p>}
      </div>
      <div className="visitor-helper-suggestions" aria-label="Common questions">{QUICK_QUESTIONS.map(text=><button key={text} type="button" disabled={busy} onClick={()=>ask(text)}>{text}</button>)}</div>
      <form onSubmit={event=>{event.preventDefault();ask(question);}}><label className="visitor-helper-input-label" htmlFor="visitor-question">Your question</label><div><input ref={input} id="visitor-question" value={question} onChange={event=>setQuestion(event.target.value)} maxLength={500} placeholder="Ask about classes or fees…" autoComplete="off"/><button type="submit" disabled={busy || !question.trim()}>Ask</button></div></form>
      <footer><a href={visitorWhatsAppLink(question)} target="_blank" rel="noopener noreferrer">Prefer a person? WhatsApp us ↗</a><small>Keep personal and payment details out of chat.</small></footer>
    </section>}
    <button ref={trigger} className="visitor-helper-trigger" type="button" aria-expanded={open} aria-controls="visitor-question-panel" onClick={()=>open ? close() : setOpen(true)}>💬 {open ? 'Close' : 'Questions? Ask us'}</button>
  </aside>;
}
