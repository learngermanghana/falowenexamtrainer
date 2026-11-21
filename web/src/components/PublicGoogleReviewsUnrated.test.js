import fs from "fs";
import path from "path";

const source = (filename) => fs.readFileSync(path.resolve(__dirname, "../../public", filename), "utf8");

describe("public Google review export with a missing star rating", () => {
  const exported = JSON.parse(source("reviews.json")).reviews;
  const starValues = { ONE: 1, TWO: 2, THREE: 3, FOUR: 4, FIVE: 5 };

  test("preserves 21 rated reviews and adds Akua's written Google review without inventing stars", () => {
    expect(exported).toHaveLength(22);
    const akua = exported.find((review) => review.reviewer?.displayName === "Akua Anaaku");
    expect(akua).toBeDefined();
    expect(akua.comment).toContain("I had a wonderful learning experience");
    expect(akua.sourceUrl).toContain("google.com/maps/contrib/100786623976614248091/reviews");
    expect(akua.ratingStatus).toBe("not_verified");
    expect(akua.starRating).toBeUndefined();
    const rated = exported.filter((review) => starValues[review.starRating]);
    expect(rated).toHaveLength(21);
    const average = rated.reduce((sum, review) => sum + starValues[review.starRating], 0) / rated.length;
    expect(average.toFixed(1)).toBe("4.8");
  });

  test("all three public review views include written reviews without turning unknown ratings into five stars", () => {
    const home = source("homepage-reviews.js");
    const brochure = source("classes/brochure-footer-reviews.js");
    const listing = source("reviews/index.html");
    expect(home).toContain("review.rating > 0 || !!review.text");
    expect(home).toContain("ratedCount");
    expect(home).toContain("Rating not recorded");
    expect(brochure).toContain("Number(review?.starRating) || 0");
    expect(brochure).not.toContain("Number(review?.starRating) || 5");
    expect(brochure).toContain("Rating not recorded");
    expect(listing).toContain("review.rating > 0 || !!review.text");
    expect(listing).toContain("rated.length");
    expect(listing).toContain("Rating not recorded");
  });
});
