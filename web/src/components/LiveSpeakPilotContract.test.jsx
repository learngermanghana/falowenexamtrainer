import React from "react";
import fs from "fs";
import path from "path";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LiveSpeakPage from "./LiveSpeakPage";

jest.mock("../context/AuthContext", () => ({ useAuth: jest.fn() }));

const root = path.resolve(__dirname, "../../..");
const backend = fs.readFileSync(path.join(root, "functions/functionz/liveSpeak.js"), "utf8");
const paymentApi = fs.readFileSync(path.join(root, "functions/functionz/paymentAwareApp.js"), "utf8");
const app = fs.readFileSync(path.join(root, "web/src/App.js"), "utf8");
const homepage = fs.readFileSync(path.join(root, "web/src/components/GeneralHome.js"), "utf8");
const account = fs.readFileSync(path.join(root, "web/src/components/AccountSettings.js"), "utf8");

beforeEach(() => {
  useAuth.mockReturnValue({
    idToken:"fake-test-token",
    studentProfile:{level:"A2", email:"student@example.com"},
  });
  global.fetch = jest.fn().mockResolvedValue({
    ok:true, json:async()=>({enabled:false, remaining:0, pilotAvailable:false, capReached:false}),
  });
});
afterEach(() => jest.restoreAllMocks());

test("direct-link pilot is unavailable when explicitly disabled", async () => {
  render(<MemoryRouter><LiveSpeakPage /></MemoryRouter>);
  expect(screen.getByRole("heading",{name:"German speaking practice"})).toBeInTheDocument();
  await waitFor(()=>expect(screen.getByText("Speaking practice is temporarily unavailable.")).toBeInTheDocument());
  expect(screen.queryByRole("button",{name:/Start speaking|Buy|Pay/})).not.toBeInTheDocument();
  expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining("/live-speak/status"),
    expect.objectContaining({headers:expect.objectContaining({Authorization:"Bearer fake-test-token"})}));
});

test("free speaking begins with one action and hides pilot counters", async () => {
  global.fetch.mockResolvedValue({
    ok:true, json:async()=>({enabled:true, remaining:0, pilotAvailable:true, maxTurns:10, capReached:false}),
  });
  render(<MemoryRouter><LiveSpeakPage /></MemoryRouter>);
  await waitFor(()=>expect(screen.getByRole("button",{name:"Start speaking"})).toBeInTheDocument());
  expect(screen.queryByText(/session.*remaining|test access expires|free voice test|about this voice test/i)).not.toBeInTheDocument();
  expect(screen.queryByRole("button",{name:/Buy|Pay|Subscribe|Checkout/i})).not.toBeInTheDocument();
});

test("server restricts access to authenticated students with cost caps", () => {
  expect(backend).toContain('process.env.LIVE_SPEAK_ENABLED !== "false"');
  expect(backend).not.toContain("LIVE_SPEAK_TESTER_UIDS");
  expect(backend).toContain('function registerLiveSpeakRoutes(');
  expect(backend).toContain('const student = await requireStudent(req, res)');
  expect(backend).toContain('process.env.LIVE_SPEAK_MONTHLY_TURN_CAP');
  expect(backend).toContain('const MAX_TURNS = 10;');
  expect(backend).toContain('const SESSION_MS = 5 * 60 * 1000;');
  expect(backend).toContain('db().collection("liveSpeakPilotCredits").doc(student.auth.uid)');
  expect(backend).toContain('app.post("/live-speak/pilot/claim"');
  expect(backend).toContain('app.post("/live-speak/session/confirm"');
  expect(backend).toContain('"gpt-4o-transcribe"');
  expect(backend).toContain('germanTranscriptionPrompt(level)');
});

test("normal tuition Paystack route is untouched and no pilot checkout exists", () => {
  expect(paymentApi).toContain('app.post("/paystack/initialize"');
  expect(paymentApi).toContain('app.post("/paystack/webhook"');
  expect(paymentApi).not.toContain("handleLiveSpeakWebhook");
  expect(backend).not.toMatch(/\/live-speak\/checkout|\/live-speak\/payment\/verify|paystack|PRICE_GHS|paymentIntents/i);
  expect(homepage).not.toContain('Explore Live Speak');
  expect(account).not.toContain('Live Speak add-on');
  expect(app).toContain('<Route path="/campus/live-speak" element={<LiveSpeakPage />} />');
});

// Regression: a misunderstood recording must not be silently corrected by the tutor.
test("learner must review the microphone transcript before AI feedback", () => {
  const source = fs.readFileSync(path.join(root, "web/src/components/LiveSpeakPage.jsx"), "utf8");
  expect(source).toContain("Did Falowen hear you correctly?");
  expect(source).toContain("/live-speak/session/confirm");
  expect(source).toContain("Record again");
  expect(source).toContain("Listen to your own recording");
  expect(source).toContain("result.needsConfirmation");
});

test("the embedded banner and resumed conversation retain backend topic after same-source changes", async () => {
  const expiresAt = new Date(Date.now() + 240000).toISOString();
  const active = {
    sessionId:"already-running", expiresAt, resumed:true,
    level:"B1", topic:"Nachhaltige Mobilität", source:"exam-speaking-practice",
  };
  global.fetch.mockImplementation(async (url) => ({
    ok:true,
    json:async () => String(url).endsWith("/live-speak/status")
      ? {enabled:true, remaining:1, maxTurns:10, capReached:false,
         pilotAvailable:false, activeSession:active}
      : {ok:true,...active},
  }));
  const { rerender } = render(
    <MemoryRouter><LiveSpeakPage embedded initialLevel="B1"
      practiceTopic="Nachhaltige Mobilität" practiceSource="exam-speaking-practice" /></MemoryRouter>,
  );
  await waitFor(() => expect(screen.getByRole("button", {name:"Resume speaking"})).toBeInTheDocument());
  const activeNotice = () => screen.getByText(/Current task: Nachhaltige Mobilität/);
  expect(screen.queryByText(/Current task:/)).not.toBeInTheDocument();
  expect(screen.queryByText(/This voice conversation is still using/)).not.toBeInTheDocument();

  // Change a selected exam prompt without changing source or remounting the component.
  rerender(
    <MemoryRouter><LiveSpeakPage embedded initialLevel="B1"
      practiceTopic="Im Restaurant" practiceSource="exam-speaking-practice" /></MemoryRouter>,
  );
  expect(activeNotice()).toBeInTheDocument();

  fireEvent.click(screen.getByRole("button", {name:"Resume speaking"}));
  await waitFor(() => expect(screen.getByText(/Your existing voice session is still using its original topic and level/)).toBeInTheDocument());
  expect(screen.getByRole("heading",{name:"Nachhaltige Mobilität"})).toBeInTheDocument();

  // Changing both lesson and level while active must never overwrite the saved context.
  rerender(
    <MemoryRouter><LiveSpeakPage embedded initialLevel="A2"
      practiceTopic="Mein Urlaub" practiceSource="exam-speaking-practice" /></MemoryRouter>,
  );
  expect(activeNotice()).toBeInTheDocument();
});
