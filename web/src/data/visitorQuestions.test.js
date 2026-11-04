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
