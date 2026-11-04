import { courseSchedules } from '../data/courseSchedule';
import { expandCourseBookEntries } from './courseBookEntries';
import { canJoinLiveClass, liveClassSessionStatus } from './liveClassCardPresentation';
import { isAppAssessment } from './appAssessment';
for (const [level, day, id] of [['A2',22,'A2-8.22'],['B1',23,'B1-7.23']]) {
 test(`${id} displays only the app speaking assessment without a live join`,()=>{
  const entry=courseSchedules[level].find(e=>e.day===day);
  expect(entry.topic).toBe(`Goethe ${level} Speaking Mock`);
  expect(entry.grammar_topic).toBeNull();
  expect(entry.instruction).toContain('No live class');
  const expanded=expandCourseBookEntries([entry],{level});
  expect(expanded.length).toBe(1);
  expect(expanded[0].sessionType).toBe('app_assessment');
  expect(expanded[0].lessonTitle || expanded[0].topic).toContain(`Goethe ${level} Speaking Mock`);
  const session={assignmentIds:[id],startsAt:'2026-11-04T10:00:00Z',endsAt:'2026-11-04T12:00:00Z'};
  expect(isAppAssessment(session)).toBe(true);
  expect(canJoinLiveClass(session,new Date('2026-11-04T11:00:00Z'))).toBe(false);
  expect(liveClassSessionStatus(session)).toBe('App Assessment · No live class');
 });
}
