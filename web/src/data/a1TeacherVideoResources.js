const A1_TEACHER_VIDEO_ENTRIES = [
  [1, "0.1", "Greetings and Asking About Well-being", "https://youtu.be/jXUJ3VTBlcE"],
  [2, "0.2", "German Alphabet", "https://youtu.be/uhFgKp4WVEc"],
  [2, "1.1", "Personal Pronouns and Verb Conjugation", "https://youtu.be/AjsnO1hxDs4"],
  [3, "1.1", "Personal Information, Articles, Adjectives and W-Questions", "https://youtu.be/iZDv1rcYWsQ"],
  [3, "1.2", "Personal Pronouns and Verb Conjugation", "https://youtu.be/LdCVsY-SFTg"],
  [4, "2", "German Numbers", "https://youtu.be/lN7xxSbkPZ4"],
  [5, "1.3", "Introducing Yourself and Articles", "https://youtu.be/KuGq_0r0FCY"],
  [6, "2.3", "Family and Hobbies", "https://youtu.be/_WdlEcKXuVg"],
  [7, "3", "Asking About Prices", "https://youtu.be/Ioq0_bNJ1bE"],
  [8, "4", "Countries and Languages", "https://youtu.be/p3xFdekEZPg"],
  [9, "5", "German Cases", "https://youtu.be/Yi5ZA-XD-GY?si=nCX_pceEYgAL-FU0"],
  [10, "6", "Objects and Colors", "https://youtu.be/sDL5z3lsITk"],
  [11, "7", "Understanding Time", "https://youtu.be/8FnvD8LQEu0"],
  [12, "8", "The 24-Hour Clock", "https://youtu.be/ckuH1McZqJk"],
  [13, "3.5", "Revision: Numbers, Time and Prices", "https://youtu.be/eqSc_5p5uyQ", 1],
  [13, "3.5", "Revision: Numbers, Time and Prices", "https://youtu.be/zizS5WdOYs8", 2],
  [14, "3.6", "Modal Verbs", "https://youtu.be/0zps4OYwShg"],
  [15, "4.7", "Introduction to Speaking Exams", "https://youtu.be/o9nn_hSDzw8"],
  [16, "9", "Negation", "https://youtu.be/yYIjI6P-qmw"],
  [17, "11", "Instructions and Directions", "https://youtu.be/9wvr4iwGsIc"],
  [18, "12.1", "Two-Case Prepositions", "https://youtu.be/WzmgAmmmTJs"],
  [19, "5.9", "Goethe A1 Speaking Confidence Lab", "https://youtu.be/ZfXw4fRQ0Tg"],
  [20, "12.3", "Introduction to Letter Writing", "https://youtu.be/NZW4rJsekH4"],
  [21, "13", "Weather", "https://youtu.be/ijEY8XVrsZs"],
  [22, "14.1", "Health and Body Parts", "https://youtu.be/hktvDESwX3k"],
  [23, "14.2", "Dative and Accusative Verbs", "https://youtu.be/J98JJU2v4Uw"],
  [24, "5.10", "Conjunctions", "https://youtu.be/8l1LiXGYqFA", 1],
  [24, "5.10", "Conjunctions", "https://youtu.be/XpcC3uvBcwo", 2],
];

export const A1_TEACHER_VIDEO_RESOURCES = Object.freeze(
  A1_TEACHER_VIDEO_ENTRIES.map(([day, chapter, topic, url, requestedVideoNumber]) => {
    const videoNumber = Number(requestedVideoNumber) || 1;
    const hasExplicitNumber = requestedVideoNumber !== undefined && requestedVideoNumber !== null;
    const keyNumberSuffix = videoNumber > 1 ? `-${videoNumber}` : "";
    const videoLabel = hasExplicitNumber ? `Teacher video ${videoNumber}` : "Teacher lecture";

    return Object.freeze({
      day,
      chapter,
      topic,
      videoNumber,
      key: `a1-day${day}-chapter-${String(chapter).replace(/[^a-z0-9]+/gi, "-")}-teacher-video${keyNumberSuffix}`,
      title: `${topic} · ${videoLabel}`,
      description: hasExplicitNumber
        ? `Recorded A1 teacher video ${videoNumber} for ${topic}.`
        : `Recorded A1 teacher explanation for ${topic}.`,
      url,
    });
  })
);

export const getA1TeacherVideoResources = (day) =>
  A1_TEACHER_VIDEO_RESOURCES.filter((resource) => Number(resource.day) === Number(day));

export const hasTeacherVideoForEveryConfiguredA1Chapter = () =>
  A1_TEACHER_VIDEO_RESOURCES.every(
    (resource) =>
      Number.isFinite(Number(resource.day)) &&
      Boolean(String(resource.chapter || "").trim()) &&
      /^https:\/\/youtu\.be\//.test(resource.url)
  );
