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
    ["c1-learner", { uid: "c1-learner", role: "student", level: "C1", name: "C1 Learner" }],
    ["c2-learner", { uid: "c2-learner", role: "student", level: "C2", name: "C2 Learner" }],
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
            async create(data) { if (stored.has(id)) throw Error("ALREADY_EXISTS"); stored.set(id, data); },
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
        if (!["student-1", "student-2", "b2-learner", "c1-learner", "c2-learner", "student-class", "inactive"].includes(idToken)) throw Error("invalid token");
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

function requestParams(state, scope = constants.SCOPE) {
  return {
    response_type: "code", client_id: constants.CLIENT_ID, redirect_uri: constants.CALLBACK,
    code_challenge: challenge, code_challenge_method: "S256", scope,
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

async function connectStudent(origin, uid, state, scope = constants.SCOPE) {
  const approve = await postJson(origin + "/api/chatgpt/approve", { ...requestParams(state, scope), idToken: uid });
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

describe("ChatGPT practice permission and exam export", () => {
  test("read-only tokens refuse practice notes; explicit extra-scope tokens can write a private note", async () => {
    await withServer(async (origin) => {
      const call = (token, name, args) => postJson(origin + "/api/chatgpt/mcp", {
        jsonrpc: "2.0", id: 31, method: "tools/call", params: { name, arguments: args },
      }, token);
      const readonly = await connectStudent(origin, "student-1", "scope-readonly");
      expect(readonly.response.status).toBe(200);
      const args = { day: 4, skill: "writing", note: "Review sentence order.",
        requestId: "writing_day4_once_2026" };
      const denied = await call(readonly.tokens.access_token, "save_my_falowen_practice_note", args);
      expect(denied.data.result.isError).toBe(true);

      const scoped = await connectStudent(origin, "student-1", "scope-write",
        constants.SCOPE + " " + constants.PRACTICE_WRITE_SCOPE);
      expect(scoped.response.status).toBe(200);
      expect(scoped.tokens.scope).toContain(constants.PRACTICE_WRITE_SCOPE);
      const saved = await call(scoped.tokens.access_token, "save_my_falowen_practice_note", args);
      expect(saved.data.result.structuredContent.saved).toBe(true);
      const retry = await call(scoped.tokens.access_token, "save_my_falowen_practice_note", args);
      expect(retry.data.result.structuredContent.saved).toBe(true);

      const exam = await call(scoped.tokens.access_token, "get_my_falowen_exam_practice",
        { mockId: "a2-mock-02", skill: "writing", part: "teil1" });
      expect(exam.data.result.structuredContent.task.situation).toMatch(/Julia/);
      expect(JSON.stringify(exam.data.result.structuredContent)).not.toMatch(/readingAnswerKey|rubric/);

      const other = await connectStudent(origin, "student-2", "scope-other");
      const inaccessible = await call(other.tokens.access_token, "get_my_falowen_exam_practice",
        { mockId: "a2-mock-02", skill: "writing" });
      expect(inaccessible.data.result.structuredContent.available).toBe(false);
    });
  });
});

describe("ChatGPT MCP OAuth integration with fake Firebase store", () => {
  test("discovers capabilities, protects account tools, exchanges PKCE and rotates refresh token", async () => {
    await withServer(async (origin) => {
      const meta = await fetch(origin + "/api/chatgpt/.well-known/oauth-protected-resource");
      expect((await meta.json()).authorization_servers).toContain(constants.ISSUER);
      const list = await postJson(origin + "/api/chatgpt/mcp", { jsonrpc: "2.0", id: 1, method: "tools/list" });
      expect(list.data.result.tools).toHaveLength(16);
      expect(list.data.result.tools[0]._meta["openai/profile"]).toBe(true);
      expect(list.data.result.tools[0].securitySchemes[0].type).toBe("oauth2");
      expect(list.data.result.tools.map((tool) => tool.name)).toContain("get_my_falowen_study_plan");
      expect(list.data.result.tools.map((tool) => tool.name)).toContain("get_my_falowen_vocabulary_practice");
      expect(list.data.result.tools.map((tool) => tool.name)).toContain("get_my_falowen_exam_practice");
      const writeTool = list.data.result.tools.find((tool) => tool.name === "save_my_falowen_practice_note");
      expect(writeTool.annotations.readOnlyHint).toBe(false);
      expect(writeTool.securitySchemes[0].scopes).toContain("falowen:practice:write");
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

  test("isolates student connections and permits Campus-eligible limited trials", async () => {
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
      // Existing ChatGPT installations expose the older lesson(day) tool.
      // It must now deliver actual A2/B1 questions without revealing grading keys.
      const legacy = (token) => postJson(origin + "/api/chatgpt/mcp", {
        jsonrpc: "2.0", id: 14, method: "tools/call",
        params: { name: "get_my_falowen_lesson",
          arguments: { day: 1, level: "C2", section: "reading" } },
      }, token);
      const a2 = (await legacy(first.tokens.access_token)).data.result.structuredContent;
      const b1 = (await legacy(second.tokens.access_token)).data.result.structuredContent;
      expect(a2.level).toBe("A2");
      expect(b1.level).toBe("B1");
      for (const exercise of [a2, b1]) {
        expect(exercise.featuredCourseBookSection.section).toBe("reading");
        expect(exercise.featuredCourseBookSection.material.questions.length).toBeGreaterThan(2);
        expect(exercise.featuredCourseBookSection.material.questions[0]).not.toHaveProperty("answerIndex");
        expect(JSON.stringify(exercise.featuredCourseBookSection)).not.toContain('"transcript"');
      }
      const expired = await postJson(origin + "/api/chatgpt/approve", {
        ...requestParams("expired"), idToken: "inactive",
      });
      expect(expired.status).toBe(200);
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

  test("C1 and C2 course materials remain OAuth-bound and match original skill days", async () => {
    await withServer(async (origin) => {
      const [c1, c2] = await Promise.all([
        connectStudent(origin, "c1-learner", "real-c1"),
        connectStudent(origin, "c2-learner", "real-c2"),
      ]);
      expect(c1.response.status).toBe(200);
      expect(c2.response.status).toBe(200);
      const call = (token, day, section, requestedLevel) => postJson(origin + "/api/chatgpt/mcp", {
        jsonrpc: "2.0", id: 76, method: "tools/call",
        params: { name: "get_my_falowen_lesson_content",
          arguments: { day, section, level: requestedLevel } },
      }, token);

      const c1Reading = (await call(c1.tokens.access_token, 1, "reading", "C2"))
        .data.result.structuredContent;
      expect(c1Reading.level).toBe("C1");
      expect(c1Reading.material.passageIncluded).toBe(true);
      expect(c1Reading.material.paragraphs).toHaveLength(3);
      expect(c1Reading.material.questions).toHaveLength(4);
      expect(c1Reading.material.questions[0]).not.toHaveProperty("answerIndex");
      const c1AdvancedReading = (await call(c1.tokens.access_token, 20, "reading", "C2"))
        .data.result.structuredContent;
      expect(c1AdvancedReading.level).toBe("C1");
      expect(c1AdvancedReading.available).toBe(true);
      expect(c1AdvancedReading.material.paragraphs).toHaveLength(3);
      expect(c1AdvancedReading.material.questions).toHaveLength(4);
      const c1Day20 = (await call(c1.tokens.access_token, 20, "overview", "B2"))
        .data.result.structuredContent;
      expect(c1Day20.level).toBe("C1");
      expect(c1Day20.title).toBe("Digitale Gesundheit");

      const c2Reading = (await call(c2.tokens.access_token, 1, "reading", "B2"))
        .data.result.structuredContent;
      expect(c2Reading.level).toBe("C2");
      expect(c2Reading.available).toBe(true);
      expect(c2Reading.material.paragraphs.length).toBeGreaterThan(2);
      expect(c2Reading.material.questions[0]).not.toHaveProperty("answerIndex");

      // Existing published connections expose the legacy lesson tool but not
      // the new section tool. They must still receive the real Day 5 Lesen.
      const legacy = (await postJson(origin + "/api/chatgpt/mcp", {
        jsonrpc: "2.0", id: 77, method: "tools/call",
        params: { name: "get_my_falowen_lesson",
          arguments: { day: 5, level: "B1", section: "reading" } },
      }, c2.tokens.access_token)).data.result.structuredContent;
      expect(legacy.level).toBe("C2");
      expect(legacy.featuredCourseBookSection.section).toBe("reading");
      expect(legacy.featuredCourseBookSection.material.title)
        .toBe("Das Mandat des Zweifels: Über das fragile Fundament politischer Legitimität");
      expect(legacy.featuredCourseBookSection.material.paragraphs).toHaveLength(4);
      expect(legacy.featuredCourseBookSection.material.questions).toHaveLength(10);
      expect(legacy.featuredCourseBookSection.material.questions[0]).not.toHaveProperty("answerIndex");
      expect(JSON.stringify(legacy.featuredCourseBookSection)).not.toContain('"explanation"');
      const legacyWriting = (await postJson(origin + "/api/chatgpt/mcp", {
        jsonrpc: "2.0", id: 78, method: "tools/call",
        params: { name: "get_my_falowen_lesson", arguments: { day: 20 } },
      }, c2.tokens.access_token)).data.result.structuredContent;
      expect(legacyWriting.featuredCourseBookSection.section).toBe("writing");
      expect(legacyWriting.featuredCourseBookSection.material.targetWords).toBe(350);
      expect(legacyWriting).not.toHaveProperty("reading");

      const c2Day20 = (await call(c2.tokens.access_token, 20, "reading", "B2"))
        .data.result.structuredContent;
      expect(c2Day20.level).toBe("C2");
      expect(c2Day20.available).toBe(false);
      const c2Writing = (await call(c2.tokens.access_token, 20, "writing", "C1"))
        .data.result.structuredContent;
      expect(c2Writing.material.targetWords).toBe(350);

      const exam = await postJson(origin + "/api/chatgpt/mcp", {
        jsonrpc: "2.0", id: 85, method: "tools/call",
        params: { name: "get_my_falowen_practice_guide",
          arguments: { day: 5, skill: "reading", mode: "exam", language: "en", level: "B1" } },
      }, c2.tokens.access_token);
      const guide = exam.data.result.structuredContent;
      expect(guide.level).toBe("C2");
      expect(guide.available).toBe(true);
      expect(guide.explanationLanguage).toBe("en");
      expect(guide.interaction.method).toBe("one_question_at_a_time");
      expect(guide.interaction.estimatedScoreIsPracticeOnly).toBe(true);
      expect(guide.material.questions).toHaveLength(10);
      expect(guide.material.questions[0]).not.toHaveProperty("answerIndex");
      expect(guide.material.questions[0]).not.toHaveProperty("explanation");
      const missingAudio = await postJson(origin + "/api/chatgpt/mcp", {
        jsonrpc: "2.0", id: 86, method: "tools/call",
        params: { name: "get_my_falowen_practice_guide", arguments: { day: 5, skill: "listening" } },
      }, c2.tokens.access_token);
      expect(missingAudio.data.result.structuredContent.available).toBe(false);
    });
  });

  test("OAuth-bound A1 learner gets original class preparation without impersonating B2", async () => {
    await withServer(async (origin) => {
      const grant = await connectStudent(origin, "student-class", "prep-a1-class");
      expect(grant.response.status).toBe(200);
      const result = await postJson(origin + "/api/chatgpt/mcp", {
        jsonrpc: "2.0", id: 90, method: "tools/call",
        params: { name: "get_my_falowen_class_preparation",
          arguments: { level: "B2", classId: "class-other", day: 1 } },
      }, grant.tokens.access_token);
      const prep = result.data.result.structuredContent;
      expect(prep.level).toBe("A1");
      expect(prep.className).toBe("A1 Genuine Klasse");
      expect(prep.nextSession.topic).toBe("Guten Morgen");
      expect(prep.exactLessonAvailable).toBe(true);
      expect(prep.practiceQuestions[0].question).toMatch(/7:00 Uhr/);
      expect(prep.practiceQuestions[0]).not.toHaveProperty("answer");
      expect(JSON.stringify(prep)).not.toContain("Private Klasse");

      const oldPluginLesson = await postJson(origin + "/api/chatgpt/mcp", {
        jsonrpc: "2.0", id: 92, method: "tools/call",
        params: { name: "get_my_falowen_lesson",
          arguments: { day: 1, level: "C2" } },
      }, grant.tokens.access_token);
      const a1 = oldPluginLesson.data.result.structuredContent;
      expect(a1.level).toBe("A1");
      expect(a1.featuredCourseBookSection.section).toBe("reading");
      expect(a1.featuredCourseBookSection.material.questions).toHaveLength(10);
      expect(a1.featuredCourseBookSection.material.questions[0]).not.toHaveProperty("answerIndex");
    });
  });

  test("OAuth-bound A2 learner sees exact original reading instead of a fabricated checklist", async () => {
    await withServer(async (origin) => {
      const grant = await connectStudent(origin, "student-1", "content-a2");
      expect(grant.response.status).toBe(200);
      const result = await postJson(origin + "/api/chatgpt/mcp", {
        jsonrpc: "2.0", id: 91, method: "tools/call",
        params: { name: "get_my_falowen_lesson_content",
          arguments: { day: 1, section: "reading", level: "B2" } },
      }, grant.tokens.access_token);
      const reading = result.data.result.structuredContent;
      expect(reading.level).toBe("A2");
      expect(reading.material.title).toBe("Neu im Büro");
      expect(reading.material.text).toContain("Firma Keller");
      expect(reading.material.questions[0]).not.toHaveProperty("answerIndex");
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
