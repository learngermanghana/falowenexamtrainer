import {
  cleanEarlyB1WritingSection,
  getEarlyB1WorkbookDay,
} from "./B1EarlyWritingPageCleanup";

const buildWritingSection = ({
  title = "Writing task",
  body = "Old guidance",
  extras = "",
  includeVideo = true,
} = {}) => {
  const section = document.createElement("section");
  section.innerHTML = `
    <h2>Teil 2 · Schreiben (Assignment)</h2>
    <section aria-label="Your assignment · Writing">
      <span>Your assignment · Writing</span>
      <h3>${title}</h3>
      <div><p>${body}</p></div>
      <div>Write approximately 80 words and submit through the Submit tab.</div>
    </section>
    ${extras}
    ${includeVideo ? '<div data-b1-writing-video-support="true">Writing video</div>' : ""}
    <div data-a2-b1-writing-workspace="standard">Writing workspace</div>
    <div data-submission-reminder="true">Submit reminder</div>
    <label><input type="checkbox" /> I prepared this part.</label>
  `;
  return section;
};

const getTaskPoints = (section) => Array.from(
  section.querySelectorAll('section[aria-label="Your assignment · Writing"] > div:first-of-type ol li'),
  (item) => item.textContent,
);

describe("B1EarlyWritingPageCleanup", () => {
  test("recognizes B1 workbook days 1 to 12 only", () => {
    expect(getEarlyB1WorkbookDay("/campus/course/lesson/B1/6", "?view=workbook")).toBe(6);
    expect(getEarlyB1WorkbookDay("/campus/course/lesson/B1/12", "?view=workbook")).toBe(12);
    expect(getEarlyB1WorkbookDay("/campus/course/b1-day-11-teamspiele-workbook", "")).toBe(11);
    expect(getEarlyB1WorkbookDay("/campus/course/lesson/B1/12", "?view=grammar")).toBeNull();
    expect(getEarlyB1WorkbookDay("/campus/course/lesson/B1/13", "?view=workbook")).toBeNull();
  });

  test("keeps Day 5 task and removes duplicated page guidance", () => {
    const section = buildWritingSection({
      title: "Schreiben Sie eine höfliche E-Mail an den Vermieter.",
      extras: `
        <div><strong>Empfohlene E-Mail-Struktur</strong><ol><li>Betreff</li></ol></div>
        <div>Verwenden Sie mindestens zwei höfliche Strukturen, zum Beispiel …</div>
      `,
    });

    cleanEarlyB1WritingSection(section, 5);

    expect(getTaskPoints(section)).toEqual([
      "Erklären Sie, dass Sie sich für die Wohnung interessieren.",
      "Fragen Sie nach einem möglichen Besichtigungstermin oder schlagen Sie selbst einen Termin vor.",
      "Bitten Sie um eine Bestätigung und erklären Sie, wie der Vermieter Sie erreichen kann.",
    ]);
    expect(section.textContent).not.toContain("Empfohlene E-Mail-Struktur");
    expect(section.textContent).not.toContain("Verwenden Sie mindestens zwei höfliche Strukturen");
    const video = section.querySelector("[data-b1-writing-video-support]");
    const workspace = section.querySelector('[data-a2-b1-writing-workspace="standard"]');
    expect(video.nextElementSibling).toBe(workspace);
    expect(section.querySelector('[data-submission-reminder="true"]')).not.toBeNull();
  });

  test("cleans Day 6 source opinion and structure while keeping the writing tools", () => {
    const section = buildWritingSection({
      title: "Stadt oder Land – welches ist Ihrer Meinung nach besser und warum?",
      extras: `
        <div><strong>Meinung von Tanja</strong><p>Die Stadt ist besser …</p></div>
        <div><strong>Empfohlene Struktur</strong><ol><li>Einleitung</li></ol></div>
      `,
    });

    cleanEarlyB1WritingSection(section, 6);

    expect(getTaskPoints(section)).toEqual([
      "Vergleichen Sie das Leben in der Stadt mit dem Leben auf dem Land und nennen Sie wichtige Vor- oder Nachteile.",
      "Sagen Sie, wo Sie lieber leben würden.",
      "Begründen Sie Ihre Meinung mit einem konkreten Beispiel.",
    ]);
    expect(section.textContent).not.toContain("Meinung von Tanja");
    expect(section.textContent).not.toContain("Empfohlene Struktur");
    expect(section.querySelector('[data-a2-b1-writing-workspace="standard"]')).not.toBeNull();
  });

  test("cleans a standard Day 9 page even when there is no writing video", () => {
    const section = buildWritingSection({
      title: "Ist eine gute Work-Life-Balance im modernen Arbeitsumfeld möglich?",
      includeVideo: false,
      extras: `
        <img alt="writing" />
        <div><strong>Meinung von Lisa</strong><p>Viele Menschen …</p></div>
      `,
    });

    cleanEarlyB1WritingSection(section, 9);

    expect(getTaskPoints(section)).toEqual([
      "Erklären Sie einen Vorteil und einen Nachteil moderner Arbeitsmodelle für die Work-Life-Balance.",
      "Beschreiben Sie, welche Rolle flexible Arbeitszeiten oder Homeoffice spielen.",
      "Geben Sie ein Beispiel und formulieren Sie Ihre eigene Meinung.",
    ]);
    expect(section.querySelector("img")).toBeNull();
    expect(section.textContent).not.toContain("Meinung von Lisa");
    expect(section.querySelector('[data-a2-b1-writing-workspace="standard"]')).not.toBeNull();
  });

  test("reduces Day 11 to the question and three content points", () => {
    const section = buildWritingSection({
      title: "Ist Teamkooperation in der heutigen Arbeitswelt wichtig? Schreiben Sie Ihre Meinung.",
      extras: `
        <img alt="team" />
        <div><strong>Markus</strong><p>Teamkooperation ist entscheidend …</p></div>
        <div><strong>Writing content points</strong><ul><li>Extra duplicate point</li></ul></div>
      `,
    });

    cleanEarlyB1WritingSection(section, 11);

    expect(getTaskPoints(section)).toEqual([
      "Nennen Sie zwei Vorteile der Teamkooperation.",
      "Erklären Sie eine Herausforderung und eine mögliche Lösung.",
      "Geben Sie ein Beispiel und begründen Sie Ihre eigene Meinung.",
    ]);
    expect(section.textContent).not.toContain("Markus");
    expect(section.textContent).not.toContain("Writing content points");
  });

  test("keeps Day 12 as a simple informal-letter task with three points", () => {
    const section = buildWritingSection({
      title: "Schreiben Sie einen informellen Brief an Ihren Freund Felix über ein spannendes Abenteuer.",
      includeVideo: false,
      extras: `
        <img alt="adventure" />
        <div><strong>Aufgabe</strong><p>Sie haben kürzlich ein spannendes Abenteuer erlebt …</p></div>
      `,
    });

    cleanEarlyB1WritingSection(section, 12);

    expect(getTaskPoints(section)).toEqual([
      "Begrüßen Sie Felix und erzählen Sie, welches Abenteuer Sie erlebt haben und wo es war.",
      "Beschreiben Sie wichtige Erlebnisse sowie eine Schwierigkeit und wie Sie sie gelöst haben.",
      "Erklären Sie, warum das Erlebnis besonders war, und beenden Sie den Brief freundlich.",
    ]);
    expect(section.querySelector("img")).toBeNull();
    expect(section.textContent).not.toContain("Sie haben kürzlich ein spannendes Abenteuer erlebt");
  });
});
