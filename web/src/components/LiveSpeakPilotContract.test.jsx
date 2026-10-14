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
const tuitionApi = fs.readFileSync(path.join(root, "functions/functionz/paymentAwareApp.js"), "utf8");
const app = fs.readFileSync(path.join(root, "web/src/App.js"), "utf8");
const home = fs.readFileSync(path.join(root, "web/src/components/GeneralHome.js"), "utf8");

beforeEach(() => {
  useAuth.mockReturnValue({
    user: { uid:"test-student", email:"student@example.com" },
    idToken:"fake-test-token",
    studentProfile:{level:"A2", email:"student@example.com"},
  });
  global.fetch = jest.fn().mockResolvedValue({
    ok:true, json:async()=>({
      enabled:false, remaining:0, priceGhs:40, sessionsPerPurchase:8, sessionMinutes:5,
      trialAvailable:false, capReached:false,
    }),
  });
});
afterEach(() => jest.restoreAllMocks());

test("disabled pilot does not expose checkout or consume paid audio in the UI", async () => {
  render(<MemoryRouter initialEntries={["/campus/live-speak"]}><LiveSpeakPage /></MemoryRouter>);
  expect(screen.getByRole("heading",{name:"Falowen Live Speak"})).toBeInTheDocument();
  await waitFor(()=>expect(screen.getByText("Live Speak pilot is being prepared")).toBeInTheDocument());
  expect(screen.queryByRole("button",{name:"Buy 8 sessions"})).not.toBeInTheDocument();
  expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining("/live-speak/status"),
    expect.objectContaining({headers:expect.objectContaining({Authorization:"Bearer fake-test-token"})}));
});

test("enabled pilot displays a separate paid package without changing tuition", async () => {
  global.fetch.mockResolvedValue({
    ok:true, json:async()=>({
      enabled:true, remaining:0, priceGhs:40, sessionsPerPurchase:8, sessionMinutes:5,
      trialAvailable:false, capReached:false,
    }),
  });
  render(<MemoryRouter><LiveSpeakPage /></MemoryRouter>);
  await waitFor(()=>expect(screen.getByText("Live Speak Basic")).toBeInTheDocument());
  expect(screen.getByRole("button",{name:"Buy 8 sessions"})).toBeInTheDocument();
  expect(screen.getByText(/One-time Paystack payment, no automatic renewal/)).toBeInTheDocument();
});

test("webhook verifies signed Paystack event before dispatching to speaking payments", () => {
  const signatureCheck = tuitionApi.indexOf("safeEqualHex(expectedSignature, signature)");
  const addonDispatch = tuitionApi.indexOf("handleLiveSpeakWebhook({ db, admin, data })");
  const tuitionUpdate = tuitionApi.indexOf("const { tuitionFee, paidSoFar: priorPaid");
  expect(signatureCheck).toBeGreaterThan(-1);
  expect(addonDispatch).toBeGreaterThan(signatureCheck);
  expect(tuitionUpdate).toBeGreaterThan(addonDispatch);
  expect(tuitionApi).toContain("registerLiveSpeakRoutes(app,");
  expect(backend).toContain('String(payment?.status || "").toLowerCase() === "success"');
  expect(backend).toContain('paidAmount === Number(intent.checkoutPesewas)');
  expect(backend).toContain('email === normalizeEmail(intent.email)');
});

test("backend enforces entitlements and real spend caps independently of the browser", () => {
  expect(backend).toContain('process.env.LIVE_SPEAK_ENABLED === "true"');
  expect(backend).toContain('process.env.LIVE_SPEAK_MONTHLY_TURN_CAP');
  expect(backend).toContain("const MAX_TURNS = 10;");
  expect(backend).toContain("const SESSION_MS = 5 * 60 * 1000;");
  expect(backend).toContain('db().collection("liveSpeakSubscriptions").doc(student.auth.uid)');
  expect(backend).toContain('const [sessionSnap, usageSnap]');
  expect(backend).toContain('tx.update(sessionRef, { inFlight: true, turnsUsed: admin.firestore.FieldValue.increment(1) })');
  expect(backend).toContain("if (!requireEnabled(res)) return;");
  expect(backend).not.toContain('paymentStatus: "paid"');
});

test("route and homepage expose only the optional add-on; existing free speaking remains", () => {
  expect(app).toContain('<Route path="/campus/live-speak" element={<LiveSpeakPage />} />');
  expect(home).toContain('navigate("/campus/live-speak")');
  expect(home).toContain("existing course speaking practice remains included");
  expect(backend).toContain('"gpt-4o-mini-tts"');
  expect(backend).toContain('"gpt-4o-mini-transcribe"');
  expect(backend).toContain("one relevant follow-up question".replace("one relevant", "ONE relevant"));
});
