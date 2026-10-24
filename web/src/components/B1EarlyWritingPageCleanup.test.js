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
  test("recognizes B1 workbook days 1 to 28 only", () => {
    expect(getEarlyB1WorkbookDay("/campus/course/lesson/B1/20", "?view=workbook")).toBe(20);
    expect(getEarlyB1WorkbookDay("/campus/course/lesson/B1/28", "?view=workbook")).toBe(28);
    expect(getEarlyB1WorkbookDay("/campus/course/b1-day-28-klimafreundlich-leben-workbook", "")).toBe(28);
    expect(getEarlyB1WorkbookDay("/campus/course/lesson/B1/28", "?view=grammar")).toBeNull();
    expect(getEarlyB1WorkbookDay("/campus/course/lesson/B1/29", "?view=workbook")).toBeNull();
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

  test("reduces Day 13 to the film question and three writing points", () => {
    const section = buildWritingSection({
      title: "Sind spannende Filme besser als ruhige Filme?",
      includeVideo: false,
      extras: `
        <img alt="film" />
        <div><strong>Opinion Assignment</strong><p>Students are to write an essay …</p></div>
      `,
    });

    cleanEarlyB1WritingSection(section, 13);

    expect(getTaskPoints(section)).toEqual([
      "Sagen Sie, ob Sie spannende oder ruhige Filme lieber mögen.",
      "Vergleichen Sie beide Filmarten und nennen Sie jeweils einen Vorteil oder Nachteil.",
      "Begründen Sie Ihre Meinung mit einem konkreten Filmbeispiel.",
    ]);
    expect(section.querySelector("img")).toBeNull();
    expect(section.textContent).not.toContain("Opinion Assignment");
  });

  test("turns Day 14 into a concise formal-email task", () => {
    const section = buildWritingSection({
      title: "Formelle E-Mail: Teilnahme an einem Weiterbildungsprogramm ablehnen",
      includeVideo: false,
      extras: '<div><strong>Aufgabe</strong><p>Ihr Arbeitgeber bietet Ihnen …</p></div>',
    });

    cleanEarlyB1WritingSection(section, 14);

    expect(section.querySelector('section[aria-label="Your assignment · Writing"] > h3').textContent)
      .toBe("Schreiben Sie eine formelle E-Mail an Ihren Chef.");
    expect(getTaskPoints(section)).toEqual([
      "Bedanken Sie sich für das Angebot und sagen Sie höflich, dass Sie nicht teilnehmen können.",
      "Erklären Sie den Grund für Ihre Absage.",
      "Bitten Sie um Verständnis und beenden Sie die E-Mail mit einem passenden formellen Gruß.",
    ]);
    expect(section.textContent).not.toContain("Ihr Arbeitgeber bietet Ihnen");
  });

  test("keeps the Day 19 writing video but removes Emma and duplicate structure", () => {
    const section = buildWritingSection({
      title: "Sind Vorstellungsgespräche schwierig? Schreiben Sie Ihre Meinung.",
      includeVideo: false,
      extras: `
        <article data-b1-day19-writing-video="true">Day 19 writing video</article>
        <div><strong>Emma</strong><p>Ein Vorstellungsgespräch kann stressig sein …</p></div>
        <div><strong>Structure</strong><ol><li>Einleitung</li></ol></div>
      `,
    });

    cleanEarlyB1WritingSection(section, 19);

    expect(getTaskPoints(section)).toEqual([
      "Sagen Sie, ob Vorstellungsgespräche schwierig oder stressig sind, und begründen Sie Ihre Meinung.",
      "Erklären Sie, wie man sich auf ein Vorstellungsgespräch vorbereiten kann.",
      "Nennen Sie, was für ein erfolgreiches Gespräch besonders wichtig ist.",
    ]);
    expect(section.textContent).not.toContain("Emma");
    expect(section.textContent).not.toContain("Structure");
    const video = section.querySelector('[data-b1-day19-writing-video="true"]');
    const workspace = section.querySelector('[data-a2-b1-writing-workspace="standard"]');
    expect(video).not.toBeNull();
    expect(video.nextElementSibling).toBe(workspace);
  });

  test("cleans Day 20 Felix source card and duplicate content points", () => {
    const section = buildWritingSection({
      title: "Sind Ausbildung und Qualifikationen wichtig für den Beruf?",
      includeVideo: false,
      extras: `
        <img alt="career" />
        <div><strong>Beitrag von Felix</strong><p>Eine gute Ausbildung hilft …</p></div>
        <div><strong>Beantworten Sie diese Inhaltspunkte</strong><ul><li>Stimmen Sie Felix zu?</li></ul></div>
      `,
    });

    cleanEarlyB1WritingSection(section, 20);

    expect(getTaskPoints(section)).toEqual([
      "Sagen Sie, ob Ausbildung und Qualifikationen für den Beruf wichtig sind.",
      "Vergleichen Sie Ausbildung und praktische Erfahrung und erklären Sie, was für Sie wichtiger ist.",
      "Geben Sie ein konkretes Beispiel und begründen Sie Ihre Meinung.",
    ]);
    expect(section.textContent).not.toContain("Beitrag von Felix");
    expect(section.textContent).not.toContain("Beantworten Sie diese Inhaltspunkte");
    expect(section.querySelector("img")).toBeNull();
  });

  test("preserves the Day 21 writing video while removing Mara source content", () => {
    const section = buildWritingSection({
      title: "Welche Lebensform ist heute am besten – Familie, Wohngemeinschaft oder Singleleben?",
      includeVideo: false,
      extras: `
        <div><strong>Meinung von Mara</strong><p>Heute gibt es viele verschiedene Lebensformen …</p></div>
        <article data-b1-day21-writing-video="true">Day 21 writing video</article>
      `,
    });

    cleanEarlyB1WritingSection(section, 21);

    expect(getTaskPoints(section)).toEqual([
      "Vergleichen Sie Familie, Wohngemeinschaft und Singleleben und nennen Sie wichtige Vor- oder Nachteile.",
      "Sagen Sie, welche Lebensform für Sie am besten passt.",
      "Begründen Sie Ihre Meinung mit einem persönlichen Beispiel oder der Situation in Ihrem Heimatland.",
    ]);
    expect(section.textContent).not.toContain("Meinung von Mara");
    const video = section.querySelector('[data-b1-day21-writing-video="true"]');
    const workspace = section.querySelector('[data-a2-b1-writing-workspace="standard"]');
    expect(video).not.toBeNull();
    expect(video.nextElementSibling).toBe(workspace);
  });

  test("reduces Day 25 complaint letter to three required points", () => {
    const section = buildWritingSection({
      title: "Schreiben Sie einen formellen Beschwerdebrief an den Kundenservice.",
      includeVideo: false,
      extras: `
        <img alt="complaint" />
        <div><strong>Support structure</strong><ol><li>Anrede</li><li>Rücksendung</li></ol></div>
      `,
    });

    cleanEarlyB1WritingSection(section, 25);

    expect(getTaskPoints(section)).toEqual([
      "Erklären Sie, wann Sie das Handy gekauft haben und was bei der Lieferung kaputt war.",
      "Beschreiben Sie, wann und wie Sie das Handy zurückgeschickt haben.",
      "Sagen Sie, welche Lösung Sie erwarten, und bitten Sie höflich um eine schnelle Antwort.",
    ]);
    expect(section.textContent).not.toContain("Support structure");
    expect(section.querySelector("img")).toBeNull();
  });

  test("cleans Day 28 model opinion and keeps only three climate writing points", () => {
    const section = buildWritingSection({
      title: "Kann jeder Mensch klimafreundlich leben? Schreiben Sie Ihre Meinung.",
      includeVideo: false,
      extras: `
        <img alt="climate" />
        <div><strong>Meinungstext</strong><p>In der heutigen Zeit ist der Klimawandel ein großes Problem …</p></div>
      `,
    });

    cleanEarlyB1WritingSection(section, 28);

    expect(getTaskPoints(section)).toEqual([
      "Nennen Sie konkrete Möglichkeiten, im Verkehr, beim Einkaufen oder zu Hause klimafreundlicher zu leben.",
      "Beschreiben Sie eine Schwierigkeit, zum Beispiel Geld, Wohnort oder Gewohnheiten.",
      "Sagen Sie, ob jeder Mensch klimafreundlich leben kann, und begründen Sie Ihre Meinung.",
    ]);
    expect(section.textContent).not.toContain("Meinungstext");
    expect(section.querySelector("img")).toBeNull();
  });
});
