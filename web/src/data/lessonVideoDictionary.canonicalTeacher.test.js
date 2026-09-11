import { getLessonVideoResources } from './lessonVideoDictionary';
import { A1_TEACHER_VIDEO_RESOURCES } from './a1TeacherVideoResources';

const isTeacher = resource => /teacher|tutor lecture/i.test(`${resource.key} ${resource.title}`);
test.each(A1_TEACHER_VIDEO_RESOURCES.filter(r => r.videoNumber === 1))(
  'shared resolver uses current Day $day chapter $chapter lecture over stale page data', ({day, chapter, url}) => {
    const staleUrl = 'https://youtu.be/stalelecture';
    const resources = getLessonVideoResources('A1', day, {
      chapter,
      teacherVideo: staleUrl,
      video: staleUrl,
    });
    const teachers = resources.filter(r => isTeacher(r) && r.chapter === chapter);
    expect(teachers.map(r => r.url)).toContain(url);
    expect(teachers.map(r => r.url)).not.toContain(staleUrl);
  }
);
test('keeps supplemental lectures and AI revision', () => {
  const resources = getLessonVideoResources('A1', 13);
  expect(resources.filter(isTeacher).map(r => r.url)).toEqual(expect.arrayContaining([
    'https://youtu.be/eqSc_5p5uyQ', 'https://youtu.be/zizS5WdOYs8',
  ]));
});
