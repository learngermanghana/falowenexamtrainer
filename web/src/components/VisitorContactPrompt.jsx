import React, { useRef, useState } from 'react';
import { sendVisitorEvent } from '../services/visitorEnquiries';
import { createAdmissionsRef } from '../services/admissionsEngagementService';

export default function VisitorContactPrompt({ surface, onContinue }) {
  const [saving,setSaving] = useState(false);
  const [error,setError] = useState('');
  const leadId = useRef('');
  async function submit(e) {
    e.preventDefault();
    if (saving) return;
    const data = new FormData(e.currentTarget);
    const email = data.get('email').trim();
    const phone = data.get('phone').trim();
    if (!email && !phone) { setError('Enter an email or phone number, or continue without sharing.'); return; }
    if (phone && !/^\+?[\d ()-]+$/.test(phone) || phone && !/^\d{7,15}$/.test(phone.replace(/\D/g,''))) {
      setError('Please check your phone number.'); return;
    }
    setSaving(true); setError('');
    if (!leadId.current) leadId.current = createAdmissionsRef('question');
    try {
      await sendVisitorEvent('contact_submitted',surface,{id:leadId.current,email,phone});
      onContinue(true);
    } catch {
      setError('Couldn’t send your details. Try again or continue to your question.');
    } finally { setSaving(false); }
  }
  return <form className="visitor-helper-contact" onSubmit={submit}>
    <strong>Would you like a reply from admissions?</strong>
    <p>Leave an email or WhatsApp number so Falowen can follow up about your enquiry.</p>
    <label>Email address<input name="email" type="email" autoComplete="email" maxLength={180}/></label>
    <label>WhatsApp or phone number<input name="phone" type="tel" autoComplete="tel" maxLength={32}/></label>
    {error && <p role="alert">{error}</p>}
    <button type="submit" disabled={saving}>{saving ? 'Sending…' : 'Request follow-up and continue'}</button>
    <button type="button" disabled={saving} onClick={()=>onContinue(false)}>Continue without sharing</button>
  </form>;
}
