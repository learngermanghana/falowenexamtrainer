import { LEVEL_FEES, MIN_INSTALLMENT_GHS } from './levelFees';
import academy from './publicAcademyProfile.json';

export const VISITOR_WHATSAPP = 'https://wa.me/233205706589';
export const GOETHE_EXAM_REGISTRATION = 'https://www.goethe.de/ins/gh/en/spr/prf/anm.html';
export const QUICK_QUESTIONS = ['Is the class hybrid?', 'When is the next A1 class?', 'What are the fees?', 'What is the exam registration fee?', 'How long is the course?', 'Can I learn up to B1 or B2?', 'Can I join late?', 'What does tuition include?', 'Can I pay in instalments?', 'How do I register?', 'Where are you located?', 'What is the minimum age?', 'Can a complete beginner join?', 'Do you help with exam registration?', 'What certificates will I receive?', 'What do I need for online classes?', 'Can I switch attendance each day?', 'What is the refund policy?'];
// Admissions policies and A1 exam guidance confirmed by the academy on 2026-11-04.
// Official exam charges are separate from tuition and Falowen practice access.
const EXAM_REGISTRATION_ANSWER = 'A1 exam registration is currently GHS 3,000, separate from the class tuition fee. For A2–C2, check the Goethe-Institut Ghana website for the current fee. Please confirm the latest official charge and registration availability before paying.';
// Edit the approved answers and matching phrases here. Dates come from the
// public class catalog, and fees come from the same settings as registration.
export const VISITOR_QUESTIONS = [
  { id: 'eligibility', pattern: /\b(minimum age|how old|age limit|(?:16|sixteen|15|fifteen|under.{0,5}16).{0,20}(?:years?|join|enrol|register)|vocational|secondary school|junior high|jhs|education(?:al)? (?:requirements?|qualifications?)|who can (?:join|enrol|register))\b/i,
    text: 'The minimum age is 16. Applicants should have at least vocational training or secondary school education. If you have only junior high school education, our team must assess your eligibility, including whether you can use your phone to access the Falowen app.', handoff: true },
  { id: 'beginner', pattern: /\b(beginner|no (?:prior |previous )?(?:german|knowledge|experience)|(?:need|require).{0,25}(?:prior|previous).{0,15}(?:knowledge|german|experience)|(?:never|cannot|can.t|don.t).{0,20}(?:studied|speak|know).{0,15}german|start from (?:zero|scratch))\b/i,
    text: 'Yes, you can join A1 as a complete beginner. You do not need any prior German knowledge.', href: '/classes', label: 'Find an A1 class' },
  { id: 'equipment', pattern: /\b(phone|computer|laptop|internet|equipment|device|online requirements|requirements for online|what do i need|what (?:is|are) required)\b/i,
    text: 'You need a good smartphone or computer and a reliable internet connection to use Falowen and attend online classes.', href: '/classes', label: 'View classes' },
  { id: 'switchAttendance', pattern: /\b(switch.{0,30}(?:online|in.person|attendance|format)|switch between|alternate|change.{0,20}(?:online|in.person|attendance)|(?:choose|decide).{0,20}(?:each|every) day|(?:online|in.person).{0,20}(?:today|tomorrow)|(?:each|every) day.{0,20}(?:online|in.person|choose|decide))\b/i,
    text: 'Yes. Each day you can choose to attend online or in person, or use the recorded lectures if you cannot attend live.', href: '/classes', label: 'View class schedules' },
  { id: 'examHelp', pattern: /\b(?:help|assist|support|guid(?:e|ance))\b.{0,60}\b(?:exam|exams|goethe|regist(?:er|ration))\b|\b(?:exam|exams|goethe)\b.{0,40}\b(?:help|assist|guid(?:e|ance))\b/i,
    text: 'Yes, we help students with exam registration. Falowen has a platform that guides students through the registration process. Contact our team if you need assistance. Official exam registration fees are separate from tuition.', href: GOETHE_EXAM_REGISTRATION, label: 'View official exam registration', handoff: true },
  { id: 'certificates', pattern: /\b(certificates?|transcript|attendance cert|participation cert|certification|completion document)\b/i,
    text: 'You receive a Falowen certificate, transcript, attendance certificate and class participation certificate. These do not replace a Goethe certificate. For visa purposes, confirm the required certificate with the relevant authority before relying on a Falowen document.', handoff: true },
  { id: 'refund', pattern: /\b(refunds?|refundable|non.refundable|money back|cancel(?:lation|ling)?|cannot start|can.t start)\b/i,
    text: 'Course tuition fees are non-refundable. We offer a 7-day free trial so you can try Falowen before paying.', href: 'https://www.falowen.app/', label: 'Explore the 7-day trial', handoff: true },
  { id: 'payment', pattern: /\b(instalments?|installments?|pay in parts|part payment|deposits?|payment plan|remaining|balance|full payment|pay (?:upfront|in full)|pay.{0,15}full|(?:pay|payment).{0,15}(?:3000|3,000)|(?:one|1) month.{0,15}access|after (?:one|1) month|(?:2000|2,000))\b/i },

  { id: 'levelPath', pattern: /\b(up to|until|through to|from a[12].{0,20}(?:b[12]|c[12])|each level|every level|per level|preferred level|b1 or b2|b1 and b2|all levels|exam.{0,20}(?:each|every) level|(?:each|every) level.{0,20}exam)\b/i,
    text: 'Each German level takes 10 weeks, and tuition is paid separately for each level. You can study up to your preferred level, such as B1 or B2. Falowen provides mock exam samples to practise and check your progress, so you do not need to take an official exam after every level as part of our learning pathway. You can take the official exam at your chosen target level. Official exam registration is paid separately.', href: '/exam-practice', label: 'Explore mock exam samples' },
  { id: 'lateJoin', pattern: /\b(join(?:ing)? late|late (?:registration|enrolment|enrollment|joining)|already (?:started|begun)|after.{0,25}(?:start(?:s|ed|ing)?|begun)|(?:four|4) sessions?|catch up.{0,20}(?:join|new))\b/i,
    text: 'You can join a class only while it has completed fewer than four sessions (0–3 sessions). You will need to use the recorded lectures to catch up. Contact our team to confirm the current session count before enrolling.', href: '/classes', label: 'View classes', handoff: true },
  { id: 'hybrid', pattern: /\b(hybrid|hybird|in[ -]person|face[ -]to[ -]face|physical (?:class(?:es)?|lessons?|sessions?)|classroom|from home|both online|attend online)\b/i,
    text: 'Yes, our classes are hybrid: you can attend online or in person. Recorded lectures are also available if you miss a class.', href: '/classes', label: 'View classes and schedules' },
  { id: 'catchup', pattern: /\b(sick(?:ness)?|ill(?:ness)?|travel(?:led|ing|ling)?|pause|interrupt(?:ion|ed)?|extension|extend|extra.{0,15}months?|free.{0,15}months?)\b/i,
    text: 'The course is designed to finish in 10 weeks, and your contract lasts six months in total. If travel or illness interrupts your studies, you have three months of free catch-up time within that six-month contract to finish the class. It is not an extra three months after the contract ends.', handoff: true },
  { id: 'duration', pattern: /\b(how long|duration|(?:many|ten|10) weeks?|(?:six|6) months?|contract|finish|complete the course)\b/i,
    text: 'Each level can be completed in 10 weeks, and you pay tuition separately for each level. Your contract lasts six months in total, allowing three months of free catch-up time within that period if travel or illness interrupts your studies.', href: '/classes', label: 'View course details' },
  { id: 'physicalBooks', pattern: /\b(physical|printed|print|hard[ -]?copy|paperback)\b/i,
    text: 'Your Falowen app access includes the digital books. If you prefer a physical book, you can request one through the book page; check the available title and order details there.', href: 'https://www.falowen.app/books', label: 'Request a physical book' },
  { id: 'includes', pattern: /\b(includ(?:e|es|ed)|inclusions|what do i get|what comes with|books? and|access to (?:the )?app)\b/i,
    text: 'Tuition includes your classes, recorded lectures and access to the Falowen app, including your digital books and learning materials. Physical books can be requested separately through the book page if preferred. Official exam registration is not included in tuition.', href: 'https://www.falowen.app/books', label: 'View physical books' },
  { id: 'recordings', pattern: /\b(recordings?|recorded|replay|miss(?:ed)? (?:a |the |my )?(?:class|lesson|session)|absen(?:t|ce))\b/i,
    text: 'Yes, recorded lectures are available in Falowen if you miss a class. You can watch them to follow up and catch up on the lessons.', href: '/classes', label: 'Explore classes' },

  { id: 'fees', pattern: /\b(fees?|tuition|cost|price|how much)\b/i },
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
  { id: 'exam', pattern: /\b(goethe|exams?|certificate|certification)\b/i,
    text: 'Falowen offers Goethe-style exam practice for reading, listening, writing and speaking. For official exam registration or certification questions, please contact our team.', href: '/exam-practice', label: 'Explore exam practice', handoff: true },
  { id: 'contact', pattern: /\b(whatsapp|human|person|staff|contact|call|talk|agent)\b/i,
    text: 'Our team can help you on WhatsApp. Use the button below to send your question.', handoff: true },
];

export function questionTopic(question) {
  const text = String(question || '').trim()
    .replace(/\bclas\b/gi, 'class').replace(/\bclases\b/gi, 'classes')
    .replace(/\bregistraton\b/gi, 'registration');
  // Prefer a human handoff to guessing sensitive exceptions or special offers.
  if (/\b(discount|scholarship|guarantee)\b/i.test(text)) return null;
  // Certificate recognition is never inferred from a visa keyword.
  if (/\bvisa\b/i.test(text)) return VISITOR_QUESTIONS.find(row => row.id === 'certificates');
  // These confirmed policies take precedence over generic words such as
  // 'registration', 'fees', 'when' and 'class'. Official fee questions still
  // resolve separately below from Falowen documents and registration help.
  for (const id of ['refund','eligibility','beginner','switchAttendance','examHelp']) {
    const row = VISITOR_QUESTIONS.find(item => item.id === id);
    if (row.pattern.test(text)) return row;
  }
  const officialExam = /\b(goethe|official|certificate|exams?|examinations?)\b/i.test(text)
    && /\b(regist(?:er|ration)|book(?:ing)?|fees?|cost|price|pay|how much)\b/i.test(text)
    && !/\b(mock|practice|subscription)\b/i.test(text);
  if (/\b(?:each|every) level\b/i.test(text) && /\bexams?\b/i.test(text)) return VISITOR_QUESTIONS.find(row => row.id === 'levelPath');
  if (officialExam) return {id:'examRegistration'};
  return VISITOR_QUESTIONS.find(row => row.pattern.test(text)) || null;
}
export function visitorAnswer(question, { classes = [], now = new Date(), context = "" } = {}) {
  const topic = questionTopic(question);
  const level = String(question).match(/\b(a1|a2|b1|b2|c1|c2)\b/i)?.[1].toUpperCase();
  if (!topic) return { text: "I don't have a saved answer for that yet. Please ask our team on WhatsApp so you get the right information.", handoff: true };
  if (topic.id === 'refund' && (/\b(exams?|goethe|mock|subscription|books?|shipping)\b/i.test(question) || context === 'books' || context === 'exams'))
    return {text:'Our course tuition is non-refundable, and the course offers a 7-day free trial before payment. For a book order, exam-practice subscription or official exam payment, please contact our team or the exam provider to confirm the applicable refund terms.', handoff:true};
  if (topic.id === 'examRegistration') return {
    text: level && level !== 'A1'
      ? `${level} official exam registration is separate from class tuition. Check the Goethe-Institut Ghana website for the current fee and available registration dates.`
      : EXAM_REGISTRATION_ANSWER,
    href: GOETHE_EXAM_REGISTRATION, label: 'Check Goethe exam fees and registration', handoff: true,
  };
  const explicitTuition = /\b(course|class|tuition)\b/i.test(question);
  if (topic.id === 'fees' && (/\b(exams?|mock|subscription)\b/i.test(question) || (context === 'exams' && !explicitTuition)))
    return {text:'Exam-practice access is separate from course tuition. Please check the current plan and price on Falowen Exams before paying.',href:'https://exams.falowen.app/#pricing',label:'View exam plans',handoff:true};
  if (topic.id === 'fees' && (/\b(book|books|workbook|delivery|shipping)\b/i.test(question) || (context === 'books' && !explicitTuition)))
    return {text:'Book prices depend on the title and available format. Open the book catalog for current prices and checkout details.',href:'https://www.falowen.app/books',label:'View book prices',handoff:true};
  if (topic.id === 'fees') {
    const entries = level ? [[level, LEVEL_FEES[level]]] : Object.entries(LEVEL_FEES);
    if (entries.some(([,fee]) => !fee)) return {text: `Please contact our team to confirm the current ${level} fee.`, handoff: true};
    return {text: 'Tuition is paid separately for each 10-week level. Current tuition per level: ' + entries.map(([name,fee]) => `${name}: GHS ${fee.toLocaleString('en-GH')}`).join(' · ') + '. Confirm your selected course details before paying.', href:'/classes', label:'View course details'};
  }
  if (topic.id === 'payment') {
    const listedFees = [...new Set(Object.values(LEVEL_FEES))];
    const fullFee = level ? LEVEL_FEES[level] : listedFees.length === 1 ? listedFees[0] : 0;
    if (!fullFee || fullFee <= MIN_INSTALLMENT_GHS) return {text:'Please contact our team to confirm the deposit and balance for your chosen level.', handoff:true};
    const money = amount => 'GHS ' + amount.toLocaleString('en-GH');
    return {text:`You can pay an initial deposit of ${money(MIN_INSTALLMENT_GHS)} for one month of access, then pay the remaining ${money(fullFee - MIN_INSTALLMENT_GHS)} after one month to unlock the full six-month access period. Alternatively, pay ${money(fullFee)} in full for six months of access. Tuition is paid separately for each level.`, href:'/classes', label:'View courses and registration'};
  }
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
