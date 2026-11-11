import React, { useEffect, useRef, useState } from 'react';
import { loadPublicClasses } from '../services/publicClassCatalogService';
import { QUICK_QUESTIONS, questionTopic, visitorAnswer, visitorWhatsAppLink } from '../data/visitorQuestions';
import './VisitorQuestionHelper.css';

const POSITION_KEY = 'falowen:visitor-helper:position:v1';
const EDGE_GAP = 12;
const DRAG_THRESHOLD = 8;

function keepWithin(value, minimum, maximum) {
  return Math.min(Math.max(value, minimum), Math.max(minimum, maximum));
}

function boundedPosition(left, top, element) {
  const bounds = element?.getBoundingClientRect?.() || {};
  const width = bounds.width || 200;
  const height = bounds.height || 48;
  return {
    left: Math.round(keepWithin(left, EDGE_GAP, window.innerWidth - width - EDGE_GAP)),
    top: Math.round(keepWithin(top, EDGE_GAP, window.innerHeight - height - EDGE_GAP)),
  };
}

function savedPosition() {
  try {
    const data = JSON.parse(window.localStorage.getItem(POSITION_KEY) || 'null');
    if (Number.isFinite(data?.left) && Number.isFinite(data?.top)) return data;
  } catch { /* Storage is optional in private browsing. */ }
  return null;
}

function rememberPosition(position) {
  try { window.localStorage.setItem(POSITION_KEY, JSON.stringify(position)); }
  catch { /* The floating control still works without storage. */ }
}

function panelPlacement(element) {
  const bounds = element?.getBoundingClientRect?.();
  if (!bounds) return {right: EDGE_GAP, bottom: 80};
  const width = Math.max(0, Math.min(380, window.innerWidth - EDGE_GAP * 2));
  const above = Math.max(0, bounds.top - EDGE_GAP * 2);
  const below = Math.max(0, window.innerHeight - bounds.bottom - EDGE_GAP * 2);
  const placeAbove = above >= below;
  const height = Math.min(600, placeAbove ? above : below);
  const left = keepWithin(bounds.right - width, EDGE_GAP, window.innerWidth - width - EDGE_GAP);
  const top = placeAbove ? bounds.top - EDGE_GAP - height : bounds.bottom + EDGE_GAP;
  return {left: Math.round(left), top: Math.round(top), height: Math.round(height)};
}

export default function VisitorQuestionHelper() {
  const [open, setOpen] = useState(false);
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState([]);
  const [busy, setBusy] = useState(false);
  const [suggestionsOpen, setSuggestionsOpen] = useState(false);
  const input = useRef(null);
  const trigger = useRef(null);
  const log = useRef(null);
  const catalog = useRef(null);
  const mounted = useRef(true);
  const [position, setPosition] = useState(savedPosition);
  const [panelStyle, setPanelStyle] = useState(null);
  const drag = useRef(null);
  const ignoreClickUntil = useRef(0);

  useEffect(() => { mounted.current = true; return () => { mounted.current = false; }; }, []);
  useEffect(() => { if (open) input.current?.focus(); }, [open]);
  useEffect(() => {
    if (open) setPanelStyle(panelPlacement(trigger.current));
  }, [open, position]);
  useEffect(() => {
    const keepInViewport = () => {
      setPosition(previous => {
        if (!previous) return null;
        const next = boundedPosition(previous.left, previous.top, trigger.current);
        if (next.left === previous.left && next.top === previous.top) return previous;
        rememberPosition(next);
        return next;
      });
      if (open) setPanelStyle(panelPlacement(trigger.current));
    };
    keepInViewport();
    window.addEventListener('resize', keepInViewport);
    window.visualViewport?.addEventListener?.('resize', keepInViewport);
    return () => {
      window.removeEventListener('resize', keepInViewport);
      window.visualViewport?.removeEventListener?.('resize', keepInViewport);
    };
  }, [open]);

  function startDrag(event) {
    if (event.pointerType === 'mouse' && event.button !== 0) return;
    const rect = event.currentTarget.getBoundingClientRect();
    drag.current = {
      id: event.pointerId, x: event.clientX, y: event.clientY,
      left: rect.left, top: rect.top, moved: false, last: null,
    };
    try { event.currentTarget.setPointerCapture?.(event.pointerId); } catch { /* Non-supporting browsers still work. */ }
  }

  function moveDrag(event) {
    const current = drag.current;
    if (!current || current.id !== event.pointerId) return;
    const dx = event.clientX - current.x;
    const dy = event.clientY - current.y;
    if (!Number.isFinite(dx) || !Number.isFinite(dy)) return;
    if (!current.moved && Math.hypot(dx, dy) < DRAG_THRESHOLD) return;
    current.moved = true;
    const next = boundedPosition(current.left + dx, current.top + dy, trigger.current);
    current.last = next;
    setPosition(next);
  }

  function endDrag(event) {
    const current = drag.current;
    if (!current || current.id !== event.pointerId) return;
    if (current.moved) {
      ignoreClickUntil.current = Date.now() + 500;
      if (current.last) rememberPosition(current.last);
    }
    drag.current = null;
  }

  function moveWithKeyboard(event) {
    const steps = {
      ArrowLeft: [-1, 0], ArrowRight: [1, 0],
      ArrowUp: [0, -1], ArrowDown: [0, 1],
    };
    if (!steps[event.key]) return;
    event.preventDefault();
    const rect = trigger.current.getBoundingClientRect();
    const [dx, dy] = steps[event.key];
    const amount = event.shiftKey ? 60 : 20;
    const next = boundedPosition((position?.left ?? rect.left) + dx * amount,
      (position?.top ?? rect.top) + dy * amount, trigger.current);
    setPosition(next);
    rememberPosition(next);
  }

  function togglePanel(event) {
    if (Date.now() < ignoreClickUntil.current) {
      event.preventDefault();
      return;
    }
    if (open) close();
    else setOpen(true);
  }
  useEffect(() => { if (log.current) log.current.scrollTop = log.current.scrollHeight; }, [messages, busy, open]);
  function close() { setOpen(false); setSuggestionsOpen(false); trigger.current?.focus(); }
  async function ask(value) {
    const text = String(value).trim().slice(0,500);
    if (!text || busy) return;
    setQuestion(''); setSuggestionsOpen(false); setBusy(true);
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
  return <aside className="visitor-helper" aria-label="Falowen questions"
    style={position ? {left: position.left, top: position.top, right: 'auto', bottom: 'auto'} : undefined}>
    {open && <section id="visitor-question-panel" className="visitor-helper-panel" style={panelStyle || {right: EDGE_GAP, bottom: 80}} role="dialog" aria-modal="false" aria-labelledby="visitor-helper-title" onKeyDown={event => {if(event.key === 'Escape') close();}}>
      <header><div><strong id="visitor-helper-title">Ask Falowen</strong><p>Quick answers for new learners</p></div><button type="button" onClick={close} aria-label="Close questions">×</button></header>
      <div className="visitor-helper-log" ref={log} role="log" aria-live="polite" aria-relevant="additions">
        <p className="visitor-helper-answer">Hi! Ask about classes, fees, registration or learning options. I use saved answers; our team can help on WhatsApp if you need more.</p>
        {messages.map((message,index) => message.question ? <p key={index} className="visitor-helper-question">{message.question}</p> : <div key={index} className="visitor-helper-answer"><p>{message.answer.text}</p>
          {message.answer.href && <a href={message.answer.href}>{message.answer.label} →</a>}
          {message.answer.alternateHref && <a href={message.answer.alternateHref}>{message.answer.alternateLabel} →</a>}
          {message.answer.handoff && <a href={visitorWhatsAppLink(message.questionText)} target="_blank" rel="noopener noreferrer">Ask our team on WhatsApp ↗</a>}
        </div>)}
        {busy && <p role="status">Checking your question…</p>}
      </div>
      <div className="visitor-helper-suggestion-toggle"><button type="button" aria-controls="visitor-helper-suggestions" aria-expanded={suggestionsOpen} onClick={() => setSuggestionsOpen(value => !value)}>{suggestionsOpen ? 'Hide common questions' : 'Common questions'}</button></div>
      {suggestionsOpen && <div id="visitor-helper-suggestions" className="visitor-helper-suggestions" aria-label="Common questions">{QUICK_QUESTIONS.map(text=><button key={text} type="button" disabled={busy} onClick={()=>ask(text)}>{text}</button>)}</div>}
      <form onSubmit={event=>{event.preventDefault();ask(question);}}><label className="visitor-helper-input-label" htmlFor="visitor-question">Your question</label><div><input ref={input} id="visitor-question" value={question} onChange={event=>setQuestion(event.target.value)} onFocus={()=>setSuggestionsOpen(false)} maxLength={500} placeholder="Ask about classes or fees…" autoComplete="off"/><button type="submit" disabled={busy || !question.trim()}>Ask</button></div></form>
      <footer><a href="/help#admissions-faq">Read all FAQs →</a><br /><a href={visitorWhatsAppLink(question)} target="_blank" rel="noopener noreferrer">Prefer a person? WhatsApp us ↗</a><small>Keep personal and payment details out of chat.</small></footer>
    </section>}
    <button ref={trigger} className="visitor-helper-trigger" type="button"
      aria-expanded={open} aria-controls="visitor-question-panel"
      title="Drag to move out of the way, or tap to ask. Arrow keys also move the button."
      onPointerDown={startDrag} onPointerMove={moveDrag} onPointerUp={endDrag}
      onPointerCancel={() => { drag.current = null; }}
      onKeyDown={moveWithKeyboard} onClick={togglePanel}>💬 {open ? 'Close' : 'Questions? Ask us'} <span className="visitor-helper-grip" aria-hidden="true">⠿</span></button>
  </aside>;
}
