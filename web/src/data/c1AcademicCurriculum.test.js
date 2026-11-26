import { C1_ACADEMIC_DAYS, getC1AcademicDay, C1_EXAM_FORMAT, C1_EXAM_PREPARATION } from "./c1AcademicCurriculum";
import { alignC1LessonContent } from "./c1ContentRefresh";
test("academic C1 layer retains 28 assignment identities", () => {
  expect(C1_ACADEMIC_DAYS).toHaveLength(28);
  for (let day = 1; day <= 28; day += 1) {
    const item = getC1AcademicDay(day);
    expect(item.day).toBe(day); expect(item.vocabulary).toHaveLength(4); expect(item.example && item.task).toBeTruthy(); expect(item.part).toBeGreaterThanOrEqual(1); expect(item.part).toBeLessThanOrEqual(C1_EXAM_FORMAT[item.skill].parts); expect(alignC1LessonContent({ level: 'C1', day }).c1ContentRefresh.academic).toEqual(item);
  }
  expect(getC1AcademicDay(29)).toBeNull(); expect(C1_EXAM_PREPARATION.map(x => x.day)).toEqual([29,30]);
});
