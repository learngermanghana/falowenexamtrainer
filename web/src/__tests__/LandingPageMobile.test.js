import "@testing-library/jest-dom";
import fs from "fs";
import path from "path";
import React from "react";
import { cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import "../i18n";
import i18n from "../i18n";
import LandingPage from "../components/LandingPage";

jest.mock("../lib/publicFunnelTracking", () => ({
  rememberPublicFunnelContext: jest.fn(),
  trackPublicFunnelEvent: jest.fn(),
}));
jest.mock("../services/publicClassCatalogService", () => ({ loadPublicClasses: jest.fn(() => new Promise(() => {})) }));
jest.mock("../lib/pageMeta", () => ({ updatePageMeta: jest.fn() }));

const renderHome = (props={}) => render(<LandingPage program="german" onSignUp={jest.fn()} onLogin={jest.fn()} {...props} />);

describe("Falowen current six-slide public homepage and iPhone navigation", () => {
  beforeEach(async()=>{ await i18n.changeLanguage("en"); });
  afterEach(()=>{ cleanup(); jest.clearAllMocks(); });

  it("shows upcoming German classes first, without a French program or unsupported claims",()=>{
    const onSignUp=jest.fn();
    renderHome({program:"french",onSignUp});
    expect(screen.getByRole("navigation",{name:"Falowen"})).toBeInTheDocument();
    expect(screen.getByRole("heading",{name:/Learn German and Swahili/i})).toBeInTheDocument();
    expect(screen.getByRole("link",{name:/View German classes/i})).toHaveAttribute("href","/classes");
    expect(screen.queryByRole("button",{name:"French"})).not.toBeInTheDocument();
    expect(screen.queryByText(/Goethe pass rate/i)).not.toBeInTheDocument();
  });

  it("rotates six focused slides with classes, music, placement, exams, books and ChatGPT",()=>{
    renderHome();
    const slides=within(screen.getByRole("group",{name:"Select carousel slide"}));
    expect(slides.getAllByRole("button")).toHaveLength(6);
    fireEvent.click(slides.getByRole("button",{name:"Show slide 2"}));
    expect(screen.getByRole("link",{name:/German songs/i})).toHaveAttribute("href","https://music.falowen.app/");
    fireEvent.click(slides.getByRole("button",{name:"Show slide 3"}));
    expect(screen.getByRole("link",{name:/Take free placement test/i})).toHaveAttribute("href","/placement-test");
    fireEvent.click(slides.getByRole("button",{name:"Show slide 4"}));
    expect(screen.getByRole("link",{name:/Explore exam practice/i})).toHaveAttribute("href","/exam-practice");
    fireEvent.click(slides.getByRole("button",{name:"Show slide 5"}));
    expect(screen.getByRole("link",{name:/Browse German books/i})).toHaveAttribute("href","/books");
    fireEvent.click(slides.getByRole("button",{name:"Show slide 6"}));
    expect(screen.getByRole("link",{name:/How to use Falowen with ChatGPT/i})).toHaveAttribute("href","/learn-german-with-chatgpt");
    expect(screen.queryByRole("heading",{name:"Start in three simple steps"})).not.toBeInTheDocument();
  });

  it("keeps A1–C2 public course and exam links in the compact footer, not a giant hero list",()=>{
    renderHome();
    const courses=within(screen.getByRole("navigation",{name:"German courses by level"}));
    const exams=within(screen.getByRole("navigation",{name:"Goethe-style preparation by level"}));
    for(const level of ["a1","a2","b1","b2","c1","c2"]){
      expect(courses.getByRole("link",{name:level.toUpperCase()})).toHaveAttribute("href",`/learn-german-${level}`);
      expect(exams.getByRole("link",{name:level.toUpperCase()})).toHaveAttribute("href",`/goethe-${level}-preparation`);
    }
    expect(screen.getByRole("link",{name:/WhatsApp/i})).toHaveAttribute("href","https://wa.me/233205706589");
    expect(screen.queryByText(/★★★★★/)).not.toBeInTheDocument();
  });

  it("provides German Music links and usable English, German and French navigation",async()=>{
    renderHome();
    const nav=within(screen.getByRole("navigation",{name:"Falowen"}));
    expect(nav.getByRole("link",{name:"Music"})).toHaveAttribute("href","https://music.falowen.app/");
    fireEvent.change(screen.getByRole("combobox",{name:"Language"}),{target:{value:"de"}});
    await waitFor(()=>expect(nav.getByRole("link",{name:"Kommende Kurse"})).toHaveAttribute("href","/classes"));
    expect(nav.getByRole("link",{name:"Musik"})).toHaveAttribute("href","https://music.falowen.app/");
    expect(nav.getByRole("link",{name:"Bücher"})).toHaveAttribute("href","/books");
    fireEvent.change(screen.getByRole("combobox",{name:"Sprache"}),{target:{value:"fr"}});
    await waitFor(()=>expect(nav.getByRole("link",{name:"Prochains cours"})).toHaveAttribute("href","/classes"));
    expect(nav.getByRole("link",{name:"Musique"})).toHaveAttribute("href","https://music.falowen.app/");
    expect(nav.getByRole("link",{name:"Livres"})).toHaveAttribute("href","/books");
  });

  it("keeps iPhone-safe CSS, upcoming class card, team profiles and review area",()=>{
    const {container}=renderHome();
    const css=fs.readFileSync(path.resolve(__dirname,"../components/LandingPageMarketing.css"),"utf8");
    expect(css).toContain("env(safe-area-inset-bottom)");
    expect(css).toContain("@media (max-width: 600px)");
    expect(container.querySelector(".falowen-home-reviews-intro")).toBeInTheDocument();
    expect(container.querySelector(".falowen-team-section")).toBeInTheDocument();
    expect(screen.getByRole("heading",{name:"Meet our German and Kiswahili team"})).toBeInTheDocument();
    expect(container.querySelectorAll(".falowen-team-card")).toHaveLength(5);
    expect(container.querySelector(".falowen-home-hybrid")).not.toBeInTheDocument();
    expect(container.querySelector(".falowen-home-support")).not.toBeInTheDocument();
    expect(screen.getByRole("heading",{name:"Find your next class"})).toBeInTheDocument();
  });
});
