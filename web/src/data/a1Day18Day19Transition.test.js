import { A1_ASSIGNMENT_ORDER } from './a1AssignmentRegistry';
import { getCurriculumEntriesForLevel } from './curriculumManifest';
import { getA1CanonicalLesson } from './a1CanonicalLessonCatalog';
import { mergeAssignmentProgress } from '../utils/assignmentProgress';
import { getA1TutorDraftProfile } from './a1TutorDraftProfiles';

test('the active curriculum has 19 required assignments and one Day 18 exercise', () => {
  const required = getCurriculumEntriesForLevel('A1').filter(row => row.assignment === true);
  expect(required).toHaveLength(19);
  expect(required.filter(row => row.assignmentDay === 18).map(row => row.assignment_id)).toEqual(['A1-12.1']);
  expect(A1_ASSIGNMENT_ORDER).toContain('A1-5.9');
  expect(A1_ASSIGNMENT_ORDER).not.toContain('A1-12.2');
  expect(getA1CanonicalLesson('12.2').assignmentKey).toBe('A1-12.1');
});
test('12.1 has five reading and five unchanged listening questions', () => {
  const profile = getA1TutorDraftProfile('A1-12.1');
  expect(Object.values(profile.sections).map(part => part.items.length)).toEqual([5,5]);
});
test('old 12.2 results remain historical and do not pass the new speaking assignment', () => {
  const rows = mergeAssignmentProgress({
    curriculumEntries: getCurriculumEntriesForLevel('A1'), studentCode: 'student',
    sheetResults: [{ assignmentId: 'A1-12.2', level: 'A1', studentCode: 'student', score: 90 }],
  });
  expect(rows.find(row => row.assignmentId === 'A1-12.2').status).toBe('passed');
  expect(rows.find(row => row.assignmentId === 'A1-5.9').status).toBe('not_started');
  expect(rows.filter(row => A1_ASSIGNMENT_ORDER.includes(row.assignmentId))).toHaveLength(19);
});
