import React, { useLayoutEffect, useRef, useState } from 'react';

const positionKey = 'falowen:question-button-position';
function readPosition() {
  try {
    const point = JSON.parse(sessionStorage.getItem(positionKey));
    return Number.isFinite(point?.x) && Number.isFinite(point?.y) ? point : null;
  } catch { return null; }
}

export default function MovableQuestionButton({ open, onToggle, buttonRef }) {
  const [point, setPoint] = useState(readPosition);
  const gesture = useRef(null);
  const suppressClick = useRef(false);
  const bounded = (x, y) => {
    const rect = buttonRef.current.getBoundingClientRect();
    return {
      x: Math.max(8, Math.min(x, window.innerWidth - rect.width - 8)),
      y: Math.max(8, Math.min(y, window.innerHeight - rect.height - 8)),
    };
  };
  function remember(p) {
    try { sessionStorage.setItem(positionKey, JSON.stringify(p)); } catch {}
  }
  useLayoutEffect(() => {
    if (open) return;
    const fit = () => setPoint(p => p && bounded(p.x, p.y));
    fit();
    window.addEventListener('resize', fit);
    return () => window.removeEventListener('resize', fit);
  }, [open, buttonRef]);
  function down(e) {
    suppressClick.current = false;
    if (open || e.button !== 0 || !e.isPrimary) return;
    const rect = e.currentTarget.getBoundingClientRect();
    gesture.current = {id:e.pointerId, x:e.clientX, y:e.clientY, left:rect.left, top:rect.top};
    e.currentTarget.setPointerCapture(e.pointerId);
  }
  function move(e) {
    const g = gesture.current;
    if (!g || g.id !== e.pointerId) return;
    const dx = e.clientX - g.x, dy = e.clientY - g.y;
    if (!g.moved && Math.hypot(dx, dy) < 6) return;
    g.moved = true;
    g.point = bounded(g.left + dx, g.top + dy);
    setPoint(g.point);
  }
  function end(e) {
    const g = gesture.current;
    if (!g || g.id !== e.pointerId) return;
    if (g.moved) { suppressClick.current = true; remember(g.point); }
    gesture.current = null;
  }
  function key(e) {
    if (open || !['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key)) return;
    e.preventDefault();
    const rect = e.currentTarget.getBoundingClientRect();
    const step = 24;
    const p = bounded(rect.left + (e.key === 'ArrowRight' ? step : e.key === 'ArrowLeft' ? -step : 0),
      rect.top + (e.key === 'ArrowDown' ? step : e.key === 'ArrowUp' ? -step : 0));
    remember(p); setPoint(p);
  }
  return <button ref={buttonRef} className="visitor-helper-trigger" type="button"
    title={open ? undefined : 'Drag or use arrow keys to move'}
    style={!open && point ? {position:'fixed',left:point.x,top:point.y} : undefined}
    aria-expanded={open} aria-controls="visitor-question-panel"
    onPointerDown={down} onPointerMove={move} onPointerUp={end} onPointerCancel={end}
    onLostPointerCapture={end} onKeyDown={key} onClick={e=>{
      if (!suppressClick.current || e.detail === 0) onToggle();
      suppressClick.current = false;
    }}>💬 {open ? 'Close' : 'Questions? Ask us'}</button>;
}
