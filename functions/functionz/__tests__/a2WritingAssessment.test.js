jest.mock('../openaiClient', () => ({ createChatCompletion: jest.fn() }));
const { createChatCompletion } = require('../openaiClient');
const { createMockAssessment } = require('../mockAssessment');
const { validateA2WritingEvidence } = require('../a2WritingAssessment');
// Preserve the learner's grammar, but exclude their identifying signature.
const submission = {
  sms: 'Ich muss mit meine mutter einkaufen gehen darum werde ich spät bei unsere treffen kommen werde. Ich motchen wir nicht mehr ins Restaurant treffen aber jetzt ins Kino?',
  email: 'Sehr geehrte Frau Becker, ich möchte Ihnen Danke das Sie mich für die Sommerfest laden ein und ich möchte da sein. Frau Becker, ich möchte Ihnen frage ob ich mit meine Freundin mitbringen kann. Außerdem, möchte ich wissen wie ich zum Fest kommen kann. Nennen wir den Zug oder Bus? Mit freundlichen Grüßen',
};
const point = (status, evidence_de, missing_details_en = []) => ({ status, evidence_de, missing_details_en });
function assessment() {
  return { score: 17, parts: {
    teil1: { score: 4.5, content_score: 3, language_score: 1, appropriateness_score: 0.5,
      required_points_met: [false, true, true], missing_required_points: ['apology', 'new meeting time'],
      point_assessments: [point('missing', [], ['apology']), point('met', ['Ich muss mit meine mutter einkaufen gehen']), point('partial', ['aber jetzt ins Kino?'], ['new meeting time'])] },
    teil2: { score: 12.5, content_score: 9, structure_score: 2, language_score: 1, cohesion_score: 0.5,
      greeting_ok: true, closing_ok: true, required_points_met: [true, true, true], missing_required_points: [],
      point_assessments: [point('met', ['Danke das Sie mich für die Sommerfest laden ein und ich möchte da sein']), point('met', ['ob ich mit meine Freundin mitbringen kann.']), point('met', ['wie ich zum Fest kommen kann.'])] },
  } };
}
beforeEach(() => jest.resetAllMocks());
test('accepts content expressed with learner errors and preserves the missing apology/time', () => {
  const result = validateA2WritingEvidence(assessment(), submission);
  expect(result.parts.teil1.content_score).toBe(3);
  expect(result.parts.teil2.content_score).toBe(9);
});
test.each([
  result => { result.parts.teil2.missing_required_points = ['bring a person']; },
  result => { result.parts.teil2.required_points_met = [true, false, false]; },
  result => { result.parts.teil1.point_assessments[0] = point('met', ['Entschuldigung']); },
  result => { result.parts.teil1.point_assessments[1].evidence_de = ['wie ich zum Fest kommen kann.']; },
  result => { result.parts.teil2.content_score = 1; },
  result => { result.parts.teil2.language_score = 4; },
  result => { result.score = 5; },
  result => { result.parts.teil2.score = 1; },
])('rejects contradictory flags, invented evidence, invalid components or totals', mutate => {
  const result = assessment(); mutate(result);
  expect(() => validateA2WritingEvidence(result, submission)).toThrow(/Inconsistent/);
});
test('a truly omitted email point loses content credit and the missing-point cap applies', () => {
  const result = assessment(); const email = result.parts.teil2;
  email.point_assessments[1] = point('missing', [], ['bring a person']);
  email.required_points_met[1] = false; email.missing_required_points = ['bring a person'];
  email.content_score = 6; email.language_score = 3; email.cohesion_score = 1;
  email.score = 11; result.score = 15.5;
  expect(validateA2WritingEvidence(result, submission)).toBe(result);
});
test('a blank SMS cannot earn credit while the email remains assessable', () => {
  const result = assessment();
  result.parts.teil1 = { score: 0, content_score: 0, language_score: 0, appropriateness_score: 0,
    required_points_met: [false, false, false], missing_required_points: ['apology', 'reason', 'place and time'],
    point_assessments: ['apology', 'reason', 'place and time'].map(label => point('missing', [], [label])) };
  result.score = 12.5;
  expect(validateA2WritingEvidence(result, { ...submission, sms: '' })).toBe(result);
});
test('retries a contradictory assessment before accepting or persisting a result', async () => {
  const bad = assessment(); bad.parts.teil2.missing_required_points = ['bring a person'];
  createChatCompletion.mockResolvedValueOnce(JSON.stringify(bad)).mockResolvedValueOnce(JSON.stringify(assessment()));
  const result = await createMockAssessment([], {}, { validateResult: result => validateA2WritingEvidence(result, submission) });
  expect(JSON.parse(result).score).toBe(17);
  expect(createChatCompletion).toHaveBeenCalledTimes(2);
});
test('repeated contradictory assessments fail safely instead of returning a grade', async () => {
  const bad = assessment(); bad.parts.teil2.content_score = 1;
  createChatCompletion.mockResolvedValue(JSON.stringify(bad));
  await expect(createMockAssessment([], {}, { validateResult: result => validateA2WritingEvidence(result, submission) }))
    .rejects.toMatchObject({ code: 'MOCK_MARKING_UNAVAILABLE' });
  expect(createChatCompletion).toHaveBeenCalledTimes(2);
});
test('A2 route wires evidence validation into the bounded assessment before score persistence', () => {
  const fs = require('fs');
  const path = require('path');
  const source = fs.readFileSync(path.join(__dirname, '../app.js'), 'utf8');
  const route = source.slice(source.indexOf('app.post("/writing/a2-mock-score"'), source.indexOf('app.post("/writing/b2-mock-score"'));
  expect(route).toContain('validateResult: (assessment) => validateA2WritingEvidence(assessment, { sms, email })');
  const start = source.indexOf('const a2MockWritingScorePrompt');
  const promptSource = source.slice(start, source.indexOf('].join("\\n");', start) + '].join("\\n");'.length);
  const { A2_WRITING_GUIDANCE, pointAssessmentShape } = require('../a2WritingAssessment');
  const buildPrompt = new Function('A2_WRITING_GUIDANCE', 'pointAssessmentShape', 'mockTaskPrompt', `${promptSource}; return a2MockWritingScorePrompt;`)(A2_WRITING_GUIDANCE, pointAssessmentShape, () => 'Canonical task');
  const prompt = buildPrompt(submission);
  expect(prompt).toContain(submission.sms);
  expect(prompt).toContain(submission.email);
  expect(prompt).toContain('Assess content BEFORE language');
  expect(prompt).toContain('point_assessments');
});
