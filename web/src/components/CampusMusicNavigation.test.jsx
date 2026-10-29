import React from "react";
import { render, screen } from "@testing-library/react";
import fs from "fs";
import path from "path";
import CampusMusicPage from "./CampusMusicPage";

const projectRoot = path.resolve(__dirname, "../..");
const file = relative => fs.readFileSync(path.join(projectRoot, relative), "utf8");

describe("Student Music and Books navigation", () => {
  test("embeds the existing, same-origin music player inside the student campus", () => {
    render(<CampusMusicPage />);
    expect(screen.getByRole("heading", { name: "Music" })).toBeTruthy();
    const frame = screen.getByTitle("Falowen Music — German listening room");
    expect(frame.getAttribute("src")).toBe("/music/index.html?embedded=1");
    expect(frame.getAttribute("src")).not.toContain("https://music.falowen.app/");
    const external = screen.getByRole("link", { name: /Open public Music site/ });
    expect(external.getAttribute("href")).toBe("https://music.falowen.app/");
    expect(external.getAttribute("target")).toBe("_blank");
  });

  test("adds direct Campus Music and Books navigation for all course levels", () => {
    const app = file("src/App.js");
    expect(app).toContain('{ key: "music", label: "Music", section: "music" }');
    expect(app).toContain('{ key: "books", label: "Books", section: "books" }');
    expect(app).toContain("music: true");
    expect(app).toContain("books: true");
    expect(app).toContain('resolvedSection === "music" && allowedSections.music ? <CampusMusicPage />');
    expect(app).toContain('path="/campus/:section/*"');
    expect(app).toContain('resolvedSection === "books" && allowedSections.books ? <CampusBooksPage />');
    expect(app).toContain('<Route path="/campus/vocab" element={<Navigate to="/campus/music" replace />} />');
    expect(app).not.toContain('key: "vocab"');
    expect(app).not.toContain('resolvedSection === "vocab" && allowedSections.vocab');
    expect(app).toContain('{examSection === "vocab" ? <VocabExamPage /> : null}');
    expect((app.match(/if \(tab\.route\)/g) || []).length).toBe(2); // Campus + deep lesson nav
    expect(app).toContain('if (location.pathname === "/books" || location.pathname === "/books/")');
  });

  test("reuses music backend and keeps sharing and song navigation correct inside iframe", () => {
    const music = file("../web/public/music/app.js");
    const css = file("../web/public/music/style.css");
    expect(music).toContain('const embedded = new URLSearchParams(location.search).get("embedded") === "1"');
    expect(music).toContain('document.body.classList.add("music-embedded")');
    expect(music).toContain('link.target = "_top"');
    expect(music).toContain('new URL("/music/index.html?track="');
    expect(music).toContain('url.searchParams.set("embedded", "1")');
    expect(music).toContain('const url = publicSongUrl(selected || current).href;');
    expect(music).toContain('embedded ? "/music/index.html?embedded=1" : "/"');
    expect(css).toContain(".music-embedded .site-header");
    expect(css).toContain(".music-embedded .library-section");
    const vercel = JSON.parse(file("../vercel.json"));
    expect(vercel.routes.some(route => route.src === "/campus/(.*)" && route.dest === "/index.html")).toBe(true);
    expect(vercel.routes.some(route => route.src === "/api/music" && route.dest === "/api/approved-music.js")).toBe(true);
  });

  test("homepage shortcuts and official navigation use only known Falowen paths", () => {
    const home = file("src/components/GeneralHome.js");
    expect(home).toContain('navigate("/campus/music")');
    expect(home).toContain('navigate("/campus/books")');
    const nav = JSON.parse(file("../web/public/falowen-navigation.json"));
    expect(nav.navigation.find(item => item.id === "music").route).toBe("/campus/music");
    expect(nav.navigation.find(item => item.id === "books").route).toBe("/campus/books");
    expect(nav.navigation.some(item => item.route === "/campus/vocab")).toBe(false);
    expect(nav.navigation.filter(item => item.id === "music")).toHaveLength(1);
  });
});
