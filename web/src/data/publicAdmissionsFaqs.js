import { QUICK_QUESTIONS, visitorAnswer } from './visitorQuestions';

// Only evergreen admissions answers are pre-rendered. Upcoming dates are always
// read from the live class catalog instead of freezing a date in public HTML.
export const admissionsFaqs = QUICK_QUESTIONS
  .filter(question => question !== 'When is the next A1 class?')
  .map(question => ({ question, ...visitorAnswer(question) }));
export const admissionsFaqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: admissionsFaqs.map(faq => ({
    '@type':'Question', name:faq.question,
    acceptedAnswer:{'@type':'Answer',text:faq.text},
  })),
};
export const PUBLIC_HELP_TITLE = 'Falowen Help | German Classes, Fees, Exams & Support';
export const PUBLIC_HELP_DESCRIPTION = 'Answers about Falowen German classes, hybrid learning, fees, payment plans, course duration, certificates, exam preparation and support for students in Ghana and abroad.';
