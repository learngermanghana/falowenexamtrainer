// Evidence is checked against the submitted text; semantic judgments remain with
// the examiner. Partial compound points earn partial content credit, not a
// second language penalty or the cap for an entirely absent point.
const A2_WRITING_GUIDANCE = [
  'Assess content BEFORE language. Read every sentence, including ungrammatical sentences, for its understandable intended meaning.',
  'For each canonical point return point_assessments in order: status (met, partial, missing), evidence_de (an array of exact quotes from this response), and missing_details_en (only the unexpressed elements).',
  'A compound point is partial when only one element is expressed. Credit the expressed element. Do not describe the entire point as absent.',
  'required_points_met means addressed: true for met OR partial; false only for missing. Missing-point caps count only entirely missing points, not partial points. missing_required_points must be the flattened missing_details_en arrays in point order.',
  'Do not confuse announcing lateness with apologizing. A reason such as shopping with a parent counts even with case/word-order errors. A proposed cinema counts as a place but does not supply a time.',
  'Thanks plus an understandable intention to attend counts as acceptance. A polite request to bring a friend counts as addressing bringing a person. A question about reaching the event or taking bus/train counts as asking how to get there.',
  'Do not require exact model-answer wording. Do not infer an apology, time, reason, or other detail that the learner did not express.',
  'Content rubric: Teil 1 gives 2 points per met point, 1 per partial point, 0 per missing point (maximum 6). Teil 2 gives 3 per met, 1.5 per partial, 0 per missing (maximum 9).',
  'Teil 1 language_score is 0–3 and appropriateness_score 0–1. Teil 2 structure_score is 0–2, language_score 0–3, cohesion_score 0–1. Judge these independently of content; zero language means no assessable understandable German, not merely frequent A2 errors.',
  'Part score is the component sum, subject to the stated missing-point caps and (for email missing both greeting and closing) a cap of 13. Overall score is the two part scores added.',
  'Use the task word targets when assessing concision/appropriateness. Overlength does not erase expressed content. Do not invent an automatic failure or zero-language rule for length.',
  'Before returning, check that feedback and corrections agree with the evidence, missing details, format flags, component scores and total. Feedback must acknowledge expressed content and name only actual omissions.',
].join('\n');

const pointAssessmentShape = () => Array.from({ length: 3 }, () => ({
  status: 'missing', evidence_de: [], missing_details_en: ['Unexpressed element of this point.'],
}));

const invalid = () => { throw Object.assign(new Error('Inconsistent A2 writing evidence or scores.'), { code: 'INVALID_MOCK_ASSESSMENT' }); };
const normalized = (text) => String(text || '').normalize('NFC').replace(/\s+/g, ' ').trim();
const same = (a, b) => Math.abs(a - b) < 0.011;

function validateA2WritingEvidence(result, { sms, email }) {
  for (const [key, source, weight, components, caps] of [
    ['teil1', sms, 2, { language_score: 3, appropriateness_score: 1 }, [7, 4, 1]],
    ['teil2', email, 3, { structure_score: 2, language_score: 3, cohesion_score: 1 }, [11, 7, 3]],
  ]) {
    const part = result.parts?.[key];
    if (!part || !Array.isArray(part.point_assessments) || part.point_assessments.length !== 3) invalid();
    let content = 0;
    const missing = [];
    let absent = 0;
    part.point_assessments.forEach((point, index) => {
      if (!point || !['met', 'partial', 'missing'].includes(point.status) ||
          !Array.isArray(point.evidence_de) || !Array.isArray(point.missing_details_en)) invalid();
      if (point.evidence_de.some(quote => typeof quote !== 'string' || !normalized(quote) || !normalized(source).includes(normalized(quote)))) invalid();
      if (point.missing_details_en.some(detail => typeof detail !== 'string' || !detail.trim())) invalid();
      if (point.status !== 'missing' && point.evidence_de.length === 0) invalid();
      if (point.status === 'met' ? point.missing_details_en.length !== 0 : point.missing_details_en.length === 0) invalid();
      if (part.required_points_met?.[index] !== (point.status !== 'missing')) invalid();
      content += point.status === 'met' ? weight : point.status === 'partial' ? weight / 2 : 0;
      absent += Number(point.status === 'missing');
      missing.push(...point.missing_details_en);
    });
    if (JSON.stringify(part.missing_required_points) !== JSON.stringify(missing)) invalid();
    if (typeof part.content_score !== 'number' || !same(part.content_score, content)) invalid();
    let score = content;
    for (const [field, max] of Object.entries(components)) {
      if (typeof part[field] !== 'number' || !Number.isFinite(part[field]) || part[field] < 0 || part[field] > max) invalid();
      score += part[field];
    }
    if (absent) score = Math.min(score, caps[absent - 1]);
    if (key === 'teil2' && !part.greeting_ok && !part.closing_ok) score = Math.min(score, 13);
    if (!normalized(source)) score = 0;
    if (!same(part.score, score)) invalid();
  }
  if (!same(result.score, result.parts.teil1.score + result.parts.teil2.score)) invalid();
  return result;
}

module.exports = { A2_WRITING_GUIDANCE, pointAssessmentShape, validateA2WritingEvidence };
