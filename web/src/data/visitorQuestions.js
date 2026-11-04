import { LEVEL_FEES, MIN_INSTALLMENT_GHS } from './levelFees';
import academy from './publicAcademyProfile.json';

export const VISITOR_WHATSAPP = 'https://wa.me/233205706589';
export const QUICK_QUESTIONS = ['When is the next A1 class?', 'What are the fees?', 'Can I pay in instalments?', 'How do I register?', 'Where are you located?'];
// Edit the approved answers and matching phrases here. Dates come from the
// public class catalog, and fees come from the same settings as registration.
export const VISITOR_QUESTIONS = [
  { id: 'fees', pattern: /\b(fees?|tuition|cost|price|how much)\b/i },
  { id: 'payment', pattern: /\b(instalments?|installments?|pay in parts|part payment|deposit|payment plan)\b/i },
  { id: 'classes', pattern: /\b(next|upcoming|start|starting|schedule|timetable|intake|when|class times?)\b/i },
  { id: 'register', pattern: /\b(register|registration|sign up|signup|enrol|enroll|join)\b/i,
    text: 'Create a free Falowen account to get started. You can also view available classes before registering.', href: '/classes', label: 'View classes and registration' },
  { id: 'location', pattern: /\b(location|located|address|where|visit|office)\b/i,
    text: `${academy.academyName} is in ${academy.locationLabel}.`, href: academy.mapsUrl, label: 'Open location' },
  { id: 'levels', pattern: /\b(levels?|beginner|placement)\b/i,
    text: 'Falowen offers German A1–C2. If you are unsure where to begin, try the free A1–B1 placement test.', href: '/placement-test', label: 'Find my level' },
  { id: 'online', pattern: /\b(online|self[ -]?paced|self[ -]?learning|recordings?|recorded|zoom|distance)\b/i,
    text: 'You can learn with live online classes or at your own pace. Falowen includes recorded lectures, interactive workbooks and learning support. Check each class for its format and schedule.', href: '/classes', label: 'Explore classes' },
  { id: 'trial', pattern: /\b(trial|try|free)\b/i,
    text: 'You can start a 7-day free trial from the homepage. The placement test is also free.', href: '/placement-test', label: 'Try the placement test' },
  { id: 'exam', pattern: /\b(goethe|exam|certificate|certification)\b/i,
    text: 'Falowen offers Goethe-style exam practice for reading, listening, writing and speaking. For official exam registration or certification questions, please contact our team.', href: '/exam-practice', label: 'Explore exam practice', handoff: true },
  { id: 'contact', pattern: /\b(whatsapp|human|person|staff|contact|call|talk|agent)\b/i,
    text: 'Our team can help you on WhatsApp. Use the button below to send your question.', handoff: true },
];

export function questionTopic(question) {
  const text = String(question || '').trim();
  // Prefer a human handoff to guessing sensitive exceptions or special offers.
  if (/\b(refund|discount|scholarship|visa|guarantee)\b/i.test(text)) return null;
  return VISITOR_QUESTIONS.find(row => row.pattern.test(text)) || null;
}
export function visitorAnswer(question, { classes = [], now = new Date() } = {}) {
  const topic = questionTopic(question);
  const level = String(question).match(/\b(a1|a2|b1|b2|c1|c2)\b/i)?.[1].toUpperCase();
  if (!topic) return { text: "I don't have a saved answer for that yet. Please ask our team on WhatsApp so you get the right information.", handoff: true };
  if (topic.id === 'fees') {
    const entries = level ? [[level, LEVEL_FEES[level]]] : Object.entries(LEVEL_FEES);
    if (entries.some(([,fee]) => !fee)) return {text: `Please contact our team to confirm the current ${level} fee.`, handoff: true};
    return {text: 'Current tuition per level: ' + entries.map(([name,fee]) => `${name}: GHS ${fee.toLocaleString('en-GH')}`).join(' · ') + '. Confirm your selected course details before paying.', href:'/classes', label:'View course details'};
  }
  if (topic.id === 'payment') return {text:`The current minimum instalment is GHS ${MIN_INSTALLMENT_GHS.toLocaleString('en-GH')}. Our team can confirm the payment arrangement for your course.`, handoff:true};
  if (topic.id === 'classes') {
    const today = now.toLocaleDateString('en-CA', {timeZone:'Africa/Accra',year:'numeric',month:'2-digit',day:'2-digit'});
    const upcoming = classes.filter(row => row.publicVisible !== false && row.registrationOpen !== false && row.availability !== 'always' && !row.isSelfLearning && /^\d{4}-\d{2}-\d{2}$/.test(row.startDate) && row.startDate >= today && (!level || row.level === level))
      .sort((a,b) => a.startDate.localeCompare(b.startDate)).slice(0,3);
    if (!upcoming.length) return {text:`I cannot confirm an upcoming ${level || 'live'} class from the published schedule right now. Please check with our team.`,href:'/classes',label:'View class schedule',handoff:true};
    return {text:upcoming.map(row => {
      const date = new Date(row.startDate+'T12:00:00Z').toLocaleDateString('en-GB',{day:'numeric',month:'long',year:'numeric',timeZone:'Africa/Accra'});
      const times = (row.meetingDays || []).map(slot=>`${slot.day} ${slot.startTime || ''}${slot.endTime ? '–'+slot.endTime : ''}`).join(' · ');
      return `${row.title || row.level}: starts ${date}${times ? '. '+times+' ('+(row.timeZone || row.timezone || 'Africa/Accra')+')' : ''}.`;
    }).join('\n'),href:'/classes',label:'View full schedule and register'};
  }
  return {text:topic.text,href:topic.href,label:topic.label,handoff:topic.handoff};
}
export function visitorWhatsAppLink(question = '') {
  return VISITOR_WHATSAPP + '?text=' + encodeURIComponent('Hello Falowen, I have a question: '+String(question).slice(0,500));
}
