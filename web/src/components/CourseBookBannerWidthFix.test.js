import {
  applyCompactCourseBookBanner,
  findCourseBookHero,
  restoreCourseBookBanner,
} from "./CourseBookBannerWidthFix";

describe("Course Book banner width", () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <main>
        <section id="other"><h2>Welcome</h2></section>
        <section id="course-book" style="width: 100%; margin-left: 4px;">
          <h2>Course Book</h2>
        </section>
      </main>
    `;
  });

  it("centres the banner and limits its desktop width without changing mobile width", () => {
    const hero = findCourseBookHero(document);
    expect(hero?.id).toBe("course-book");

    applyCompactCourseBookBanner(document);
    expect(hero.style.width).toBe("100%");
    expect(hero.style.maxWidth).toBe("920px");
    expect(hero.style.marginLeft).toBe("auto");
    expect(hero.style.marginRight).toBe("auto");
    expect(hero.style.justifySelf).toBe("center");

    restoreCourseBookBanner(document);
    expect(hero.style.width).toBe("100%");
    expect(hero.style.maxWidth).toBe("");
    expect(hero.style.marginLeft).toBe("4px");
  });
});
