import React from "react";
import { render, screen } from "@testing-library/react";
import fs from "fs";
import os from "os";
import path from "path";
import { spawnSync } from "child_process";
import OtherLevelSeoSamples from "./OtherLevelSeoSamples";
import practice from "../data/otherLevelSeoPracticeContent.json";

const webRoot = path.resolve(__dirname, "../..");
const repoRoot = path.resolve(webRoot, "..");
let tempDist;

beforeAll(() => {
  tempDist = fs.mkdtempSync(path.join(os.tmpdir(), "falowen-other-level-seo-"));
  fs.copyFileSync(path.join(webRoot, "index.html"), path.join(tempDist, "index.html"));
  const result = spawnSync(process.execPath, [path.join(webRoot, "scripts/generate-a1-public-seo.mjs"), tempDist], { encoding: "utf8" });
  if (result.status !== 0) throw new Error(result.stderr || result.stdout);
});
afterAll(() => {
  if (tempDist) fs.rmSync(tempDist, { recursive: true, force: true });
});

test.each(["A2", "B1", "B2", "C1", "C2"])("%s has public question pages with canonical SEO and answers", level => {
  const slug = level.toLowerCase();
  const example = practice[level];
  for (const [file, publicPath, expectedTitle] of [
    ["goethe-" + slug + "-preparation.html", "/goethe-" + slug + "-preparation", example.titles.landing],
    ["exam-practice-" + slug + ".html", "/exam-practice/" + slug, example.titles.practice]
  ]) {
    const html = fs.readFileSync(path.join(tempDist, "__seo", file), "utf8");
    expect(html).toContain("<title>" + expectedTitle + "</title>");
    expect(html).toContain('href="https://www.falowen.app' + publicPath + '"');
    expect(html).toContain('content="https://www.falowen.app' + publicPath + '"');
    expect(html).toContain(example.reading.question);
    expect(html).toContain(example.reading.answer);
    expect(html).toContain(example.writing.task);
    expect(html).toContain(example.speaking.task);
    expect(html).toContain('href="/login/"');
    expect(html).toContain('class="a1-seo-fallback"');
    expect((html.match(/<h1\b/g) || []).length).toBe(1);
  }
});

test("publishes correct routes and sitemap entries without exposing student exam routes", () => {
  const vercel = JSON.parse(fs.readFileSync(path.join(repoRoot, "vercel.json"), "utf8"));
  const sitemap = fs.readFileSync(path.join(webRoot, "public/sitemap.xml"), "utf8");
  const appSource = fs.readFileSync(path.join(webRoot, "src/App.js"), "utf8");
  for (const level of ["a2", "b1", "b2", "c1", "c2"]) {
    for (const [src, dest] of [
      ["/goethe-" + level + "-preparation/?", "/__seo/goethe-" + level + "-preparation.html"],
      ["/exam-practice/" + level + "/?", "/__seo/exam-practice-" + level + ".html"]
    ]) expect(vercel.routes).toContainEqual(expect.objectContaining({ src, dest }));
    expect(sitemap).toContain("<loc>https://www.falowen.app/goethe-" + level + "-preparation</loc>");
    expect(sitemap).toContain("<loc>https://www.falowen.app/exam-practice/" + level + "</loc>");
  }
  expect(appSource).toContain("a1|a2|b1|b2|c1|c2");
  expect(vercel.headers).toEqual(expect.arrayContaining([
    expect.objectContaining({ source: "/exams/:path*", headers: expect.arrayContaining([
      expect.objectContaining({ key: "X-Robots-Tag", value: "noindex, nofollow, noarchive" })
    ]) })
  ]));
});

test.each(["A2", "B1", "B2", "C1", "C2"])("%s renders examples and protected exam sign-in", level => {
  const example = practice[level];
  const { unmount } = render(React.createElement(OtherLevelSeoSamples, { level }));
  expect(screen.getByText(example.reading.question)).toBeInTheDocument();
  expect(screen.getByText(example.writing.task)).toBeInTheDocument();
  expect(screen.getByText(example.speaking.task)).toBeInTheDocument();
  expect(screen.getByRole("link", { name: /Sign in for student mock exams/ })).toHaveAttribute("href", "/login/");
  unmount();
});

test("accurately distinguishes unfinished advanced full mocks", () => {
  expect(practice.C1.status).toMatch(/not yet published/);
  expect(practice.C2.status).toMatch(/no complete four-module C2 mock/);
});
