import React from "react";
import { fireEvent, render, screen, waitFor, cleanup } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom";
import PlacementTestPage from "./PlacementTestPage";
import PlacementTestPage2026 from "./PlacementTestPage2026";
import { postPlacementEvent, sendPlacementEventOnce } from "../lib/placementMonitoring";
import fs from "fs";
import path from "path";

jest.mock("react-i18next", () => ({ useTranslation: () => ({
  t: (_,opts) => opts?.defaultValue || "", i18n: { language: "en" }
}) }));
jest.mock("../lib/pageMeta", () => ({ updatePageMeta: jest.fn() }));
jest.mock("../lib/publicFunnelTracking", () => ({
  rememberPublicFunnelContext: jest.fn(() => ({})),
  trackPublicFunnelEvent: jest.fn(),
  buildPublicFunnelUrl: jest.fn(path => path),
  followUpIso: jest.fn(() => ""),
  getPublicFunnelContext: jest.fn(() => ({})),
  submitPublicLead: jest.fn(async () => ({})),
}));
jest.mock("../lib/placementMonitoring", () => ({
  makePlacementAttemptId: jest.fn(() => "pt_test1234567890"),
  postPlacementEvent: jest.fn(),
  sendPlacementEventOnce: jest.fn(async () => ({ ok: true })),
  answersToIndices: jest.fn((_,questions) => Array(questions.length).fill(null)),
}));

beforeEach(() => {
  localStorage.clear();
  jest.clearAllMocks();
  postPlacementEvent.mockImplementation(async payload => payload.action === "start"
    ? {ok: true, id: "pt_test1234567890", ticket:"signed-ticket"}
    : {ok: true, score:{a1:8,a2:8,b1:7,b2:2,total:25,answered:25,level:"B1"}});
});
afterEach(cleanup);

test.each([
  ["german","Free German Placement Test (A1–B1)","German"],
  ["swahili","Free Kiswahili Placement Test (A1–B2)","Kiswahili"]
])("%s shows the Figma two-column introduction and accessible full-width email form", (language,title,label) => {
  const view=render(<PlacementTestPage2026 language={language} />);
  expect(screen.getByRole("heading", { name:title })).toBeInTheDocument();
  const intro=view.container.querySelector(".falowen-placement-intro");
  expect(intro).toBeInTheDocument();
  expect(intro.querySelector(".falowen-placement-intro-copy")).toBeInTheDocument();
  expect(intro.querySelector(".falowen-placement-start-card")).toBeInTheDocument();
  expect(intro.querySelectorAll(".falowen-placement-level")).toHaveLength(language==="swahili"?4:3);
  expect(screen.getByRole("form", {name:label+" placement registration"})).toBeInTheDocument();
  expect(screen.getByRole("textbox", {name:/Email address/})).toBeRequired();
  expect(screen.getByRole("button", {name:/Start test/})).toBeInTheDocument();
  expect(screen.getByText(/20-minute timed assessment/)).toBeInTheDocument();
});

test.each([["/placement-test","Deutsch"],["/placement-test?language=swahili","Kiswahili"]])
("the page header offers both test languages while showing %s correctly", (url,brand) => {
  const view=render(<MemoryRouter initialEntries={[url]}><PlacementTestPage /></MemoryRouter>);
  expect(view.container.querySelector(".falowen-placement-shell")).toBeInTheDocument();
  expect(screen.getByRole("link",{name:"Falowen home"})).toHaveTextContent(brand);
  const nav=screen.getByRole("navigation",{name:"Choose placement-test language"});
  expect(nav.querySelectorAll("a")).toHaveLength(2);
  expect(nav.querySelector('a[href="/placement-test"]')).toBeInTheDocument();
  expect(nav.querySelector('a[href="/placement-test?language=swahili"]')).toBeInTheDocument();
});

test("the timed German question screen keeps answer navigation and submission controls",async()=>{
  const view=render(<PlacementTestPage2026 language="german"/>);
  fireEvent.change(screen.getByRole("textbox",{name:/Email address/}),{target:{value:"learner@example.com"}});
  fireEvent.click(screen.getByRole("button",{name:/Start test/}));
  expect(await screen.findByRole("heading",{name:"German · A1–B1"})).toBeInTheDocument();
  expect(screen.getByRole("region",{name:"Placement test progress and timer"})).toBeInTheDocument();
  expect(view.container.querySelector(".falowen-placement-question-card")).toBeInTheDocument();
  expect(screen.getAllByRole("radio")).toHaveLength(4);
  fireEvent.click(screen.getByRole("button",{name:/Next question/}));
  expect(screen.getByText(/Question 2 of 30/)).toBeInTheDocument();
  expect(postPlacementEvent).toHaveBeenCalledWith(expect.objectContaining({action:"start",language:"german"}));
});

test("Kiswahili results display server-scored B1 and no public answer key",async()=>{
  const view=render(<PlacementTestPage2026 language="swahili"/>);
  fireEvent.change(screen.getByRole("textbox",{name:/Email address/}),{target:{value:"learner@example.com"}});
  fireEvent.click(screen.getByRole("button",{name:/Start test/}));
  await screen.findByRole("heading",{name:"Kiswahili · A1–B2"});
  fireEvent.click(screen.getByRole("button",{name:"Submit test"}));
  await screen.findByText("Your suggested starting level: B1");
  expect(postPlacementEvent).toHaveBeenCalledWith(expect.objectContaining({action:"complete",language:"swahili",ticket:"signed-ticket"}));
  expect(view.container.querySelector('[data-placement-language="swahili"]')).toBeInTheDocument();
  expect(screen.getByText(/Score: 25\/40/)).toBeInTheDocument();
  fireEvent.click(screen.getByText("Review your submitted answers"));
  expect(screen.queryByText(/Correct:/)).not.toBeInTheDocument();
  expect(screen.getByRole("link",{name:/Continue with Kiswahili/})).toHaveAttribute("href",expect.stringContaining("program=swahili"));
  expect(sendPlacementEventOnce).not.toHaveBeenCalled();
});

test("Figma layout includes stack-on-mobile rules and scopes style to placement page",()=>{
  const css=fs.readFileSync(path.join(__dirname,"PlacementTestPage.css"),"utf8");
  expect(css).toContain(".falowen-placement-shell");
  expect(css).toContain("grid-template-columns: minmax(0,1.13fr) minmax(330px,.89fr)");
  expect(css).toContain("@media (max-width: 700px)");
  expect(css).toContain(".falowen-placement-form-label input");
  expect(css).toContain("width: 100%");
});
