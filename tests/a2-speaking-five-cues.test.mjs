import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const source = readFileSync(new URL('../web/src/data/a2PresentationCards.js', import.meta.url), 'utf8');
const match = source.match(/export const A2_PRESENTATION_CARDS = (\{[\s\S]*\});\s*$/);
assert.ok(match, 'A2 speaking card source is readable');
const cards = JSON.parse(match[1]);

test('each A2 speaking card contains five distinct, usable keyword branches', () => {
  assert.equal(Object.keys(cards).length, 28);
  for (const [day, card] of Object.entries(cards)) {
    assert.equal(card.keywords.length, 5, 'Day ' + day);
    assert.equal(card.branches.length, 5, 'Day ' + day);
    assert.equal(new Set(card.keywords).size, 5, 'Day ' + day);
    assert.deepEqual(card.branches.map(branch => branch.label), card.keywords, 'Day ' + day);
    assert.deepEqual(card.branches.map(branch => branch.id), ['point-1','point-2','point-3','point-4','point-5'], 'Day ' + day);
    assert.ok(card.branches.every(branch => branch.question && branch.starter && branch.modelSentence), 'Day ' + day);
    assert.match(card.instruction, /fünf Stichpunkten/, 'Day ' + day);
    assert.match(card.instructionEn, /five keywords/, 'Day ' + day);
  }
});

test('the A2 speaking mind-map defines a valid type for all five branches', () => {
  const code = readFileSync(new URL('../web/src/data/speakingMindMaps/a2/index.js', import.meta.url), 'utf8');
  assert.match(code, /type: \["topic", "detail", "example", "opinion", "closing"\]\[index\]/);
});

test('printed A2 speaking mind maps fit the page and retain every branch', () => {
  const css = readFileSync(new URL('../web/src/components/SpeakingMindMap.css', import.meta.url), 'utf8');
  const printRules = css.split('@media print')[1];
  assert.ok(printRules, 'A dedicated print layout is required for the A2 course PDF');
  for (const selector of [
    '.speaking-mind-map__viewport',
    '.speaking-mind-map__canvas',
    '.speaking-mind-map__centre',
    '.speaking-mind-map__branches',
    '.speaking-mind-map__branch,',
  ]) assert.ok(printRules.includes(selector), 'Missing print-safe selector: ' + selector);
  assert.match(printRules, /min-width:\s*0\s*!important/);
  assert.match(printRules, /overflow:\s*visible\s*!important/);
  assert.match(printRules, /grid-template-columns:\s*repeat\(2, minmax\(0, 1fr\)\)/);
  assert.match(printRules, /position:\s*static\s*!important/);
});
