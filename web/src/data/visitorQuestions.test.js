import { questionTopic, visitorAnswer, GOETHE_EXAM_REGISTRATION } from './visitorQuestions';

test.each(['Is the clas hybrid?', 'Are classes hybrid?', 'Is it face to face?', 'Can I attend online?', 'Is the class hybird?'])('hybrid variants: %s',question=>{
  expect(questionTopic(question).id).toBe('hybrid');
  expect(visitorAnswer(question).text).toMatch(/attend online or in person/);
  expect(visitorAnswer(question).text).toMatch(/Recorded lectures/);
});
test.each(['What if I miss a class?', 'Are lectures recorded?', 'Can I replay the lesson?'])('recording variants: %s',question=>{
  expect(visitorAnswer(question).text).toMatch(/recorded lectures are available/i);
});
test.each(['Can I join late?', 'The class already started, can I join?', 'Can I register after the class starts?', 'Can I join after four sessions?'])('late joining: %s',question=>{
  const answer=visitorAnswer(question);
  expect(answer.text).toContain('fewer than four sessions (0–3 sessions)');
  expect(answer.text).toContain('recorded lectures');
  expect(answer.handoff).toBe(true);
});
test('duration and catch-up preserve the six-month total',()=>{
  expect(visitorAnswer('How long is the course?').text).toContain('10 weeks');
  expect(visitorAnswer('How long is the course?').text).toContain('separately for each level');
  const answer=visitorAnswer('What if I am sick or travel?');
  expect(answer.text).toContain('within that six-month contract');
  expect(answer.text).toContain('not an extra three months after');
});
test('official exams, subscriptions and tuition have different answers',()=>{
  const a1=visitorAnswer('What is the A1 exams registration fee?',{context:'exams'});
  expect(a1.text).toContain('GHS 3,000');expect(a1.text).toContain('separate from the class tuition');
  expect(a1.href).toBe(GOETHE_EXAM_REGISTRATION);
  for(const level of ['A2','B1','B2','C1','C2']){
    const answer=visitorAnswer(`How much is ${level} Goethe registration?`);
    expect(answer.href).toBe(GOETHE_EXAM_REGISTRATION);
    expect(answer.text).not.toMatch(/3,000|30,000/);
  }
  expect(visitorAnswer('What is the mock exam fee?').href).toContain('exams.falowen.app/#pricing');
  expect(visitorAnswer('What is the class fee?',{context:'exams'}).text).toContain('Current tuition per level');
});
test('tuition includes digital access while printed books have their own page',()=>{
  expect(visitorAnswer('What does tuition include?').text).toContain('digital books');
  expect(visitorAnswer('Are physical books included?').href).toBe('https://www.falowen.app/books');
});
test.each(['Can I learn up to B1?', 'I want to learn up to B2', 'Do I pay for each level?', 'Do I need an exam for every level?', 'Do I pay exam fees for every level?', 'Can I go from A1 to B2?'])('target-level pathway: %s',question=>{
  const answer=visitorAnswer(question);
  expect(answer.text).toContain('Each German level takes 10 weeks');
  expect(answer.text).toContain('paid separately for each level');
  expect(answer.text).toContain('do not need to take an official exam after every level');
  expect(answer.href).toBe('/exam-practice');
});

test.each(['What is the minimum age?', 'Can my 15 year old join?', 'I have only JHS education', 'What educational qualifications do I need?'])('eligibility: %s',question=>{
  const answer=visitorAnswer(question);
  expect(answer.text).toContain('minimum age is 16');
  expect(answer.text).toContain('team must assess');
  expect(answer.handoff).toBe(true);
});
test.each(['Can a complete beginner join?', 'I have no German knowledge', 'Do I need prior German knowledge?', 'I cannot speak German'])('A1 beginner: %s',question=>{
  expect(visitorAnswer(question).text).toContain('do not need any prior German knowledge');
});
test.each(['Can I pay in instalments?', 'When do I pay the balance?', 'How much is the deposit?', 'Can I pay full tuition?', 'Can I pay 3000?', 'Do I get one month access?'])('payment and access: %s',question=>{
  const answer=visitorAnswer(question);
  expect(answer.text).toContain('GHS 2,000 for one month');
  expect(answer.text).toContain('remaining GHS 1,000 after one month');
  expect(answer.text).toContain('GHS 3,000 in full for six months');
  expect(answer.text).not.toContain('GHS 300 in full');
});
test.each(['Do you help students register for the exams?', 'Do you assist with Goethe registration?', 'Is there exam registration guidance?'])('registration assistance: %s',question=>{
  expect(visitorAnswer(question).text).toContain('platform that guides students');
});
test.each(['What certificates will I receive?', 'Will I receive a transcript?', 'Is your certificate valid for a visa?'])('Falowen documents: %s',question=>{
  const answer=visitorAnswer(question);
  for(const name of ['Falowen certificate','transcript','attendance certificate','class participation certificate']) expect(answer.text).toContain(name);
  expect(answer.text).toContain('do not replace a Goethe certificate');
  expect(answer.text).toContain('confirm the required certificate');
});
test.each(['What do I need for online classes?', 'Do I need a computer?', 'Can I use my phone?'])('devices: %s',question=>{
  expect(visitorAnswer(question).text).toContain('smartphone or computer');
  expect(visitorAnswer(question).text).toContain('internet connection');
});
test.each(['Can I switch attendance each day?', 'Can I switch between online and in person?', 'Can I attend online today and in person tomorrow?'])('flexible attendance: %s',question=>{
  expect(visitorAnswer(question).text).toContain('Each day you can choose');
  expect(visitorAnswer(question).text).toContain('recorded lectures');
});
test.each(['What is your refund policy?', 'Can I get my money back?', 'What if I pay but cannot start?'])('course refunds and trial: %s',question=>{
  const answer=visitorAnswer(question);
  expect(answer.text).toContain('non-refundable');expect(answer.text).toContain('7-day free trial');
});
test('refund answers do not extend the course policy to books and exam providers',()=>{
  expect(visitorAnswer('Can Goethe refund my exam payment?').text).toContain('confirm the applicable refund terms');
  expect(visitorAnswer('Can I get a refund?',{context:'books'}).text).toContain('confirm the applicable refund terms');
});
test('advanced fees and unrelated switches do not invent course payment policies',()=>{
  expect(visitorAnswer('C2 deposit').handoff).toBe(true);
  expect(visitorAnswer('Can I switch levels?').text).not.toContain('Each day you can choose');
});


test.each(['Can I ask teachers questions outside class?', 'Do I have study buddy support?', 'Can I ask a teacher after class?'])('learning support: %s',question=>{
  const answer=visitorAnswer(question);
  expect(answer.text).toContain('teachers questions outside class');
  expect(answer.text).toContain('24 hours a day');
});
test.each(['Can I transfer to another timetable?', 'Can I pause my course?', 'Can I change class schedule?'])('timetable changes: %s',question=>{
  expect(visitorAnswer(question).text).toContain('within your six-month contract');
  expect(visitorAnswer(question).handoff).toBe(true);
});
test.each(['Can I join from abroad?', 'Do you accept students from Nigeria?', 'Can I enrol from another country?'])('international students: %s',question=>{
  expect(visitorAnswer(question).text).toContain('accept students living abroad');
  expect(visitorAnswer(question).text).toContain('time zone');
});
test.each(['How do I know I am ready for the official exam?', 'How can I check my exam readiness?'])('exam readiness: %s',question=>{
  const answer=visitorAnswer(question);
  expect(answer.text).toContain('timers and AI as an examiner');
  expect(answer.href).toBe('/exams/overview');
  expect(answer.text).not.toMatch(/guarantee|will pass/);
});


test.each(['How do I create an account?', 'How do i create account', 'How do I register?', 'Where can I sign up?', 'I want to open a Falowen account'])('signup instructions and correct link: %s', question => {
  const answer = visitorAnswer(question);
  expect(answer.href).toBe('/signup?program=german');
  expect(answer.alternateHref).toBe('/login/');
  expect(answer.text).toContain('Enter your full name, email and a password');
  expect(answer.text).toContain('7-day free trial');
  expect(answer.text).toContain('Creating an account is free');
});
