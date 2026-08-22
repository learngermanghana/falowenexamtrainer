import {
  cleanEarlyB1WritingSection,
  getEarlyB1WorkbookDay,
} from "./B1EarlyWritingPageCleanup";

const buildWritingSection = ({ title = "Writing task", body = "Old guidance" } = {}) => {
  const section = document.createElement("section");
  section.innerHTML = `
    <h2>Teil 2 · Schreiben (Assignment)</h2>
    <section aria-label="Your assignment · Writing">
      <span>Your assignment · Writing</span>
      <h3>${title}</h3>
      <div><p>${body}</p></div>
      <div>Write approximately 80 words and submit through the Submit tab.</div>
    </section>
    <div data-b1-writing-video-support="5">Writing video</div>
    <div data-a2-b1-writing-workspace="standard">Writing workspace</div>
  `;
  return section;
};

describe("B1EarlyWritingPageCleanup", () => {
  test("recognizes only B1 workbook days 1 to 5", () => {
    expect(getEarlyB1WorkbookDay("/campus/course/lesson/B1/5", "?view=workbook")).toBe(5);
    expect(getEarlyB1WorkbookDay("/campus/course/b1-day-4-wohnung-suchen-workbook", "")).toBe(4);
    expect(getEarlyB1WorkbookDay("/campus/course/lesson/B1/5", "?view=grammar")).toBeNull();
    expect(getEarlyB1WorkbookDay("/campus/course/lesson/B1/6", "?view=workbook")).toBeNull();
  });

  test("keeps Day 5 task and removes duplicated page guidance", () => {
    const section = buildWritingSection({ title: "Schreiben Sie eine höfliche E-Mail an den Vermieter." });
    section.insertAdjacentHTML("beforeend", `
      <div><strong>Empfohlene E-Mail-Struktur</strong><ol><li>Betreff</li></ol></div>
      <div>Verwenden Sie mindestens zwei höfliche Strukturen, zum Beispiel …</div>
    `);

    cleanEarlyB1WritingSection(section, 5);

    expect(section.textContent).toContain("Schreiben Sie eine höfliche E-Mail an den Vermieter.");
    expect(section.textContent).not.toContain("Empfohlene E-Mail-Struktur");
    expect(section.textContent).not.toContain("Verwenden Sie mindestens zwei höfliche Strukturen");
    expect(section.querySelector('[data-a2-b1-writing-workspace="standard"]')).not.toBeNull();
    const video = section.querySelector("[data-b1-writing-video-support]");
    const workspace = section.querySelector('[data-a2-b1-writing-workspace="standard"]');
    expect(video.nextElementSibling).toBe(workspace);
  });

  test("reduces Day 4 to the question and three writing points", () => {
    const section = buildWritingSection({ title: "Sind persönliche Kontakte bei der Wohnungssuche hilfreicher als Online-Portale?" });
    section.insertAdjacentHTML("beforeend", `
      <div><strong>Beispielmeinung aus dem Online-Gästebuch</strong><p>Maria …</p></div>
      <div><strong>Schreiben Sie jetzt Ihre Meinung.</strong><ol><li>Extra structure</li></ol></div>
      <div>Verwenden Sie möglichst: Einerseits … Andererseits …</div>
    `);

    cleanEarlyB1WritingSection(section, 4);

    const points = Array.from(
      section.querySelectorAll('section[aria-label="Your assignment · Writing"] > div:first-of-type ol li'),
      (item) => item.textContent,
    );
    expect(points).toEqual([
      "Sagen Sie, welche Methode Sie bei der Wohnungssuche hilfreicher finden.",
      "Vergleichen Sie persönliche Kontakte mit Online-Portalen.",
      "Begründen Sie Ihre Meinung und geben Sie ein konkretes Beispiel.",
    ]);
    expect(section.textContent).not.toContain("Beispielmeinung aus dem Online-Gästebuch");
    expect(section.textContent).not.toContain("Schreiben Sie jetzt Ihre Meinung.");
  });

  test("removes Day 1 guestbook and local writing/cheat tabs but keeps the shared workspace", () => {
    const section = buildWritingSection({ title: "Ist persönlicher Kontakt im Traumberuf wichtiger als flexible Arbeit im Homeoffice?" });
    section.insertAdjacentHTML("beforeend", `
      <img alt="writing" />
      <div><strong>Beispielmeinung aus dem Online-Gästebuch</strong><p>Tanja …</p></div>
      <div><button>Schreiben</button><button>Cheat sheet</button></div>
      <div><strong>Cheat sheet · Writing support template</strong></div>
    `);

    cleanEarlyB1WritingSection(section, 1);

    expect(section.querySelector("img")).toBeNull();
    expect(section.textContent).not.toContain("Beispielmeinung aus dem Online-Gästebuch");
    expect(section.textContent).not.toContain("Cheat sheet · Writing support template");
    expect(section.querySelector('[data-a2-b1-writing-workspace="standard"]')).not.toBeNull();
  });
});
