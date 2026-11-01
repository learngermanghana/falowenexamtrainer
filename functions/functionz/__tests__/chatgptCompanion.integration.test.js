"use strict";

const express = require("express");
const crypto = require("crypto");
const { makeRouter, constants } = require("../chatgptCompanion");

const hash = (value) => crypto.createHash("sha256").update(value).digest("hex");
const verifier = "a".repeat(43);
const challenge = crypto.createHash("sha256").update(verifier).digest("base64url");

function mockFirebase() {
  const collections = new Map();
  const studentData = new Map([
    ["student-1", { uid: "student-1", role: "student", level: "A2", name: "Student One", studentCode: "TEST001" }],
    ["student-2", { uid: "student-2", role: "student", level: "B1", name: "Student Two", studentCode: "TEST002" }],
    ["b2-learner", { uid: "b2-learner", role: "student", level: "B2", name: "B2 Test Learner", studentCode: "TESTB2" }],
    ["inactive", { uid: "inactive", role: "student", level: "A1", trialStatus: "expired", paymentStatus: "pending" }],
    ["student-class", { uid: "student-class", role: "student", level: "A1", classId: "class-genuine", name: "Class Learner" }],
  ]);
  collections.set("students", studentData);
  collections.set("classes", new Map([
    ["class-genuine", { name: "A1 Genuine Klasse", levelId: "A1", status: "active", timezone: "Africa/Accra", zoomProfileId: "profile-genuine" }],
    ["class-other", { name: "A1 Private Klasse", levelId: "A1", status: "active", zoomUrl: "https://zoom.us/j/333?pwd=other" }],
  ]));
  collections.set("classSessions", new Map([
    ["session-genuine", { classId: "class-genuine", startsAt: "2099-01-04T10:00:00Z", endsAt: "2099-01-04T11:00:00Z", topic: "Guten Morgen", status: "scheduled", curriculumDay: 1 }],
    ["session-other", { classId: "class-other", startsAt: "2099-01-03T10:00:00Z", endsAt: "2099-01-03T11:00:00Z", topic: "Private topic", status: "scheduled" }],
  ]));
  collections.set("zoomProfiles", new Map([
    ["profile-genuine", { joinUrl: "https://us06web.zoom.us/j/111?pwd=own" }],
  ]));
  const getStore = (name) => {
    if (!collections.has(name)) collections.set(name, new Map());
    return collections.get(name);
  };
  const db = {
    collection(name) {
      const stored = getStore(name);
      return {
        doc(id) {
          return {
            async get() { return { id, exists: stored.has(id), data: () => stored.get(id) }; },
            async set(data) { stored.set(id, data); },
          };
        },
        where(field, operator, value) {
          if (operator !== "==") throw Error("unsupported fixture query");
          return {
            limit(max) {
              return {
                async get() {
                  const docs = [...stored.entries()].filter(([, row]) => row?.[field] === value)
                    .slice(0, max).map(([id, data]) => ({ id, data: () => data }));
                  return { docs, empty: !docs.length };
                },
              };
            },
          };
        },
      };
    },
    async runTransaction(fn) {
      const pending = [];
      const tx = {
        async get(ref) { return ref.get(); },
        delete(ref) { pending.push(async () => { getStore(ref.collectionName).delete(ref.id); }); },
      };
      // Explicit transaction adapter keyed to a one-time grant, not a real Firestore emulator.
      const originalCollection = db.collection.bind(db);
      db.collection = (name) => {
        const col = originalCollection(name);
        return {
          ...col,
          doc(id) {
            const ref = col.doc(id);
            return { ...ref, collectionName: name, id };
          },
        };
      };
      const result = await fn(tx);
      for (const operation of pending) await operation();
      return result;
    },
    batch() {
      const pending = [];
      return {
        set(ref, data) { pending.push(() => getStore(ref.collectionName).set(ref.id, data)); },
        async commit() { pending.forEach((fn) => fn()); },
      };
    },
  };
  // All refs contain their key and collection; batch and tx operate in memory.
  const origCollection = db.collection.bind(db);
  db.collection = (name) => {
    const col = origCollection(name);
    return {
      ...col,
      doc(id) { return { ...col.doc(id), collectionName: name, id }; },
    };
  };
  const admin = {
    firestore: () => db,
    auth: () => ({
      async verifyIdToken(idToken) {
        if (!["student-1", "student-2", "b2-learner", "student-class", "inactive"].includes(idToken)) throw Error("invalid token");
        return { uid: idToken, email: idToken + "@example.org", email_verified: true };
      },
    }),
  };
  return admin;
}

async function withServer(test) {
  const app = express();
  app.use(express.json());
  app.use("/api/chatgpt", makeRouter(mockFirebase()));
  const server = await new Promise((resolve) => {
    const handle = app.listen(0, "127.0.0.1", () => resolve(handle));
  });
  try {
    return await test("http://127.0.0.1:" + server.address().port);
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
}

function requestParams(state) {
  return {
    response_type: "code", client_id: constants.CLIENT_ID, redirect_uri: constants.CALLBACK,
    code_challenge: challenge, code_challenge_method: "S256", scope: constants.SCOPE,
    resource: constants.RESOURCE, state,
  };
}

async function postJson(url, body, bearer) {
  const response = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json", ...(bearer ? { authorization: "Bearer " + bearer } : {}) },
    body: JSON.stringify(body),
  });
  return { status: response.status, data: await response.json() };
}

async function connectStudent(origin, uid, state) {
  const approve = await postJson(origin + "/api/chatgpt/approve", { ...requestParams(state), idToken: uid });
  expect(approve.status).toBe(200);
  const callback = new URL(approve.data.redirectUrl);
  expect(callback.origin).toBe("https://chatgpt.com");
  expect(callback.searchParams.get("state")).toBe(state);
  expect(callback.searchParams.get("iss")).toBe(constants.ISSUER);
  const code = callback.searchParams.get("code");
  const response = await fetch(origin + "/api/chatgpt/token", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "authorization_code", client_id: constants.CLIENT_ID,
      redirect_uri: constants.CALLBACK, resource: constants.RESOURCE,
      code, code_verifier: verifier,
    }),
  });
  return { code, response, tokens: await response.json() };
}

describe("ChatGPT MCP OAuth integration with fake Firebase store", () => {
  test("discovers capabilities, protects account tools, exchanges PKCE and rotates refresh token", async () => {
    await withServer(async (origin) => {
      const meta = await fetch(origin + "/api/chatgpt/.well-known/oauth-protected-resource");
      expect((await meta.json()).authorization_servers).toContain(constants.ISSUER);
      const list = await postJson(origin + "/api/chatgpt/mcp", { jsonrpc: "2.0", id: 1, method: "tools/list" });
      expect(list.data.result.tools).toHaveLength(7);
      expect(list.data.result.tools[0]._meta["openai/profile"]).toBe(true);
      expect(list.data.result.tools[0].securitySchemes[0].type).toBe("oauth2");
      const unlinked = await postJson(origin + "/api/chatgpt/mcp", {
        jsonrpc: "2.0", id: 2, method: "tools/call",
        params: { name: "get_my_falowen_profile", arguments: {} },
      });
      expect(unlinked.data.result.isError).toBe(true);
      expect(unlinked.data.result._meta["mcp/www_authenticate"]).toHaveLength(1);

      const grant = await connectStudent(origin, "student-1", "state-1");
      expect(grant.response.status).toBe(200);
      expect(grant.tokens.access_token).toEqual(expect.any(String));
      const profile = await postJson(origin + "/api/chatgpt/mcp", {
        jsonrpc: "2.0", id: 3, method: "tools/call",
        params: { name: "get_my_falowen_profile", arguments: {} },
      }, grant.tokens.access_token);
      expect(profile.data.result.structuredContent.name).toBe("Student One");
      expect(profile.data.result.structuredContent).not.toHaveProperty("studentCode");
      expect(profile.data.result.structuredContent.id).toMatch(/^flw_/);

      const replay = await fetch(origin + "/api/chatgpt/token", {
        method: "POST",
        headers: { "content-type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          grant_type: "authorization_code", client_id: constants.CLIENT_ID,
          redirect_uri: constants.CALLBACK, resource: constants.RESOURCE,
          code: grant.code, code_verifier: verifier,
        }),
      });
      expect(replay.status).toBe(400);

      const refresh = await fetch(origin + "/api/chatgpt/token", {
        method: "POST",
        headers: { "content-type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          grant_type: "refresh_token", client_id: constants.CLIENT_ID,
          resource: constants.RESOURCE, refresh_token: grant.tokens.refresh_token,
        }),
      });
      const refreshed = await refresh.json();
      expect(refresh.status).toBe(200);
      expect(refreshed.refresh_token).not.toBe(grant.tokens.refresh_token);
    });
  });

  test("isolates connections for two students and blocks expired trials", async () => {
    await withServer(async (origin) => {
      const [first, second] = await Promise.all([
        connectStudent(origin, "student-1", "one"),
        connectStudent(origin, "student-2", "two"),
      ]);
      expect(first.response.status).toBe(200);
      expect(second.response.status).toBe(200);
      const call = (token) => postJson(origin + "/api/chatgpt/mcp", {
        jsonrpc: "2.0", id: 5, method: "tools/call",
        params: { name: "get_my_falowen_profile", arguments: {} },
      }, token);
      const [one, two] = await Promise.all([call(first.tokens.access_token), call(second.tokens.access_token)]);
      expect(one.data.result.structuredContent.name).toBe("Student One");
      expect(two.data.result.structuredContent.name).toBe("Student Two");
      expect(one.data.result.structuredContent.id).not.toEqual(two.data.result.structuredContent.id);
      const expired = await postJson(origin + "/api/chatgpt/approve", {
        ...requestParams("expired"), idToken: "inactive",
      });
      expect(expired.status).toBe(403);
    });
  });
  test("B2 authenticated student can read self-study lessons and progress without score sheet access", async () => {
    await withServer(async (origin) => {
      const grant = await connectStudent(origin, "b2-learner", "b2-course");
      expect(grant.response.status).toBe(200);
      const call = (name, args = {}) => postJson(origin + "/api/chatgpt/mcp", {
        jsonrpc: "2.0", id: 19, method: "tools/call",
        params: { name, arguments: args },
      }, grant.tokens.access_token);

      const profile = await call("get_my_falowen_profile");
      expect(profile.data.result.structuredContent.nickname).toBe("Falowen B2 student");
      const list = await call("get_my_falowen_assignments");
      expect(list.data.result.structuredContent.level).toBe("B2");
      expect(list.data.result.structuredContent.courseMode).toBe("self_study");
      expect(list.data.result.structuredContent.assignments).toHaveLength(28);
      expect(list.data.result.structuredContent.assignments[0].lessonUrl).toContain("/lesson/B2/1");

      const progress = await call("get_my_falowen_progress");
      expect(progress.data.result.structuredContent.completionAvailable).toBe(false);
      expect(progress.data.result.structuredContent.completedCount).toBeNull();
      const lesson = await call("get_my_falowen_lesson", { day: 1 });
      expect(lesson.data.result.structuredContent.title).toMatch(/Umweltschutz/);
      expect(lesson.data.result.structuredContent.lessonUrl).toContain("/lesson/B2/1");
      expect(lesson.data.result.structuredContent.exactContentAvailable).toBe(true);
      expect(lesson.data.result.structuredContent.courseBookContent.readingTitle)
        .toBe("Müll vermeiden statt nur besser entsorgen");

      const reading = await call("get_my_falowen_lesson_content", { day: 1, section: "reading" });
      expect(reading.data.result.structuredContent.material.paragraphs[0]).toMatch(/Papiertonne/);
      expect(reading.data.result.structuredContent.material.questions[0]).not.toHaveProperty("answerIndex");

      const vocabulary = await call("get_my_falowen_lesson_content", { day: 1, section: "vocabulary" });
      expect(vocabulary.data.result.structuredContent.material.length).toBeGreaterThan(2);
      const grammar = await call("get_my_falowen_lesson_content", { day: 1, section: "grammar" });
      expect(grammar.data.result.structuredContent.material.task).toMatch(/drei Sätzen/);

    });
  });

  test("B1 authenticated learner receives original Day 1 passage and cannot query B2 material", async () => {
    await withServer(async (origin) => {
      const grant = await connectStudent(origin, "student-2", "b1-original-reading");
      expect(grant.response.status).toBe(200);
      const call = (params) => postJson(origin + "/api/chatgpt/mcp", {
        jsonrpc: "2.0", id: 70, method: "tools/call",
        params: { name: "get_my_falowen_lesson_content", arguments: params },
      }, grant.tokens.access_token);
      const lesson = await call({ day: 1, section: "reading" });
      expect(lesson.data.result.structuredContent.level).toBe("B1");
      expect(lesson.data.result.structuredContent.material.title).toBe("Traumdeutung und ihre Bedeutung");
      expect(lesson.data.result.structuredContent.material.paragraphs).toHaveLength(5);
      expect(lesson.data.result.structuredContent.material.questions).toHaveLength(7);
      expect(lesson.data.result.structuredContent.material.questions[0]).not.toHaveProperty("answerIndex");
      const spoofed = await call({ day: 1, section: "reading", level: "B2" });
      expect(spoofed.data.result.structuredContent.level).toBe("B1");
      expect(spoofed.data.result.structuredContent.material.title).toBe("Traumdeutung und ihre Bedeutung");
    });
  });

  test("OAuth-bound A1 learner sees only own class's next session and Zoom link", async () => {
    await withServer(async (origin) => {
      const grant = await connectStudent(origin, "student-class", "live-class");
      expect(grant.response.status).toBe(200);
      const result = await postJson(origin + "/api/chatgpt/mcp", {
        jsonrpc: "2.0", id: 80, method: "tools/call",
        params: { name: "get_my_falowen_next_class", arguments: { classId: "class-other", level: "B1" } },
      }, grant.tokens.access_token);
      const content = result.data.result.structuredContent;
      expect(content.classAssigned).toBe(true);
      expect(content.className).toBe("A1 Genuine Klasse");
      expect(content.level).toBe("A1");
      expect(content.nextSession.topic).toBe("Guten Morgen");
      expect(content.nextSession.startsAt).toBe("2099-01-04T10:00:00.000Z");
      expect(content.zoomUrl).toContain("pwd=own");
      expect(JSON.stringify(content)).not.toContain("pwd=other");
    });
  });

});
