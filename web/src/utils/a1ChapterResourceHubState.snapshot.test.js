jest.mock('./courseBookEntries', () => ({
  findCourseBookEntry: () => ({day: 2, chapter: '1.1', workbookRoute: '', workbook_link: ''}),
}));
import {buildA1ChapterResourceHubState} from './a1ChapterResourceHubState';
test('completed Radio resolves the workbook even when the schedule was initialized without a destination', () => {
  expect(buildA1ChapterResourceHubState({day: 2, search: '?chapter=1.1&hub=1&radio=done'}).entry.workbookRoute)
    .toBe('/campus/course/a1-day-2-kapitel-1-1-workbook?radio=done');
});
