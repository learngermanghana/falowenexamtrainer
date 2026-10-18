import { getA1Assignment } from '../data/a1AssignmentRegistry';
import { getA1TutorDraftProfile } from '../data/a1TutorDraftProfiles';
import { buildA1WorkbookDraftStorageKey, readA1WorkbookDraft, saveA1WorkbookDraft, buildA1WorkbookSubmissionText } from './a1WorkbookDraft';
test('new signs clear both old reading sections while preserving listening', () => {
 localStorage.clear();
 localStorage.setItem(buildA1WorkbookDraftStorageKey('A1-12.1'), JSON.stringify({ sections: { 'teil-1': { answers: { 1: 'B' } }, 'teil-2': { answers: { 1: 'Falsch' } }, 'teil-3': { answers: { 1: 'Richtig' } } } }));
 const draft = readA1WorkbookDraft('A1-12.1');
 expect(draft.sections['teil-1']).toBeUndefined();
 expect(draft.sections['teil-2']).toBeUndefined();
 expect(draft.sections['teil-3'].answers[1]).toBe('Richtig');
 const saved = saveA1WorkbookDraft({ assignmentKey: 'A1-12.1', sections: { ...draft.sections, 'teil-1': { answers: { 1: 'Richtig', 2: 'Falsch', 3: 'Falsch', 4: 'Richtig', 5: 'Falsch' } } } });
 const assignment = getA1Assignment('A1-12.1');
 expect(assignment.sections.map(s => s.key)).toEqual(['teil-1', 'teil-3']);
 expect(Object.keys(getA1TutorDraftProfile('A1-12.1').sections)).toEqual(['teil-1', 'teil-3']);
 const text = buildA1WorkbookSubmissionText({ assignment, draft: saved });
 expect(text).toContain('A1-12.1-READING-V2');
 expect(text).toContain('TEIL 3\n1. Richtig');
 expect(text).not.toContain('TEIL 2');
});
