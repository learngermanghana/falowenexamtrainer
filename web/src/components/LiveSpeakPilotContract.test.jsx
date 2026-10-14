import React from "react";
import fs from "fs";
import path from "path";
import { render, screen, waitFor } from "@testing-library/react";
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
    ok:true, json:async()=>({enabled:false, approved:false, remaining:0, pilotAvailable:false, capReached:false}),
  });
});
afterEach(() => jest.restoreAllMocks());

test("private pilot is unavailable when disabled or not approved", async () => {
  render(<MemoryRouter><LiveSpeakPage /></MemoryRouter>);
  expect(screen.getByRole("heading",{name:"Falowen Live Speak"})).toBeInTheDocument();
  await waitFor(()=>expect(screen.getByText("Live Speak is in private testing")).toBeInTheDocument());
  expect(screen.queryByRole("button",{name:/Activate|Start 5-minute|Buy/})).not.toBeInTheDocument();
  expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining("/live-speak/status"),
    expect.objectContaining({headers:expect.objectContaining({Authorization:"Bearer fake-test-token"})}));
});

test("approved pilot offers two free test sessions without a payment control", async () => {
  global.fetch.mockResolvedValue({
    ok:true, json:async()=>({enabled:true, approved:true, remaining:0, pilotAvailable:true, maxTurns:10, capReached:false}),
  });
  render(<MemoryRouter><LiveSpeakPage /></MemoryRouter>);
  await waitFor(()=>expect(screen.getByRole("button",{name:"Activate 2 free test sessions"})).toBeInTheDocument());
  expect(screen.getByText(/There are no payments or subscriptions during this test/)).toBeInTheDocument();
  expect(screen.queryByRole("button",{name:/Buy|Pay|Subscribe|Checkout/i})).not.toBeInTheDocument();
});

test("server restricts both activation and voice usage to approved tester UIDs", () => {
  expect(backend).toContain('process.env.LIVE_SPEAK_ENABLED === "true"');
  expect(backend).toContain('process.env.LIVE_SPEAK_TESTER_UIDS');
  expect(backend).toContain('function registerLiveSpeakRoutes(');
  expect(backend).toContain('requireApprovedTester(student, res)');
  expect(backend).toContain('process.env.LIVE_SPEAK_MONTHLY_TURN_CAP');
  expect(backend).toContain('const MAX_TURNS = 10;');
  expect(backend).toContain('const SESSION_MS = 5 * 60 * 1000;');
  expect(backend).toContain('db().collection("liveSpeakPilotCredits").doc(student.auth.uid)');
  expect(backend).toContain('app.post("/live-speak/pilot/claim"');
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
