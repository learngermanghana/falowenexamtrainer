import fs from "fs";
import path from "path";
import {
  HOME_MOTIVATIONS,
  HOME_MOTIVATIONS_BY_LEVEL,
  HOME_MOTIVATION_LAST_KEY,
  HOME_MOTIVATION_SESSION_KEY,
  getSessionHomeMotivation,
  clearHomeMotivationSession,
} from "./homeMotivationMessages";

const memoryStorage = () => {
  const values = new Map();
  return {
    getItem: (key) => values.has(key) ? values.get(key) : null,
    setItem: (key, value) => values.set(key, String(value)),
    removeItem: (key) => values.delete(key),
  };
};

describe("signed-in Falowen session motivation", () => {
  test("ships 50+ positive non-repeating general and level-specific messages", () => {
    const all = [...HOME_MOTIVATIONS, ...Object.values(HOME_MOTIVATIONS_BY_LEVEL).flat()];
    expect(all.length).toBeGreaterThanOrEqual(50);
    expect(new Set(all.map(({id})=>id)).size).toBe(all.length);
    expect(new Set(all.map(({headline})=>headline)).size).toBe(all.length);
    for (const message of all) {
      expect(message.headline).toMatch(/^[a-z]/);
      expect(message.headline.length).toBeGreaterThan(28);
    }
    for (const level of ["A1", "A2", "B1", "B2", "C1", "C2"]) {
      expect(HOME_MOTIVATIONS_BY_LEVEL[level].length).toBeGreaterThanOrEqual(4);
    }
  });

  test("keeps a motivational heading identical across refresh, navigation and level changes in one session", () => {
    const sessionStorage = memoryStorage();
    const localStorage = memoryStorage();
    const choose = (level, random) => getSessionHomeMotivation({
      studentId: "student-one",
      level, sessionStorage, localStorage, random,
    });
    const first = choose("A2", () => .99);
    expect(first.id).toMatch(/^a2-/);
    expect(choose("A2", () => 0)).toEqual(first);
    expect(choose("B1", () => 0)).toEqual(first);
    expect(choose("C2", () => .7)).toEqual(first);
    expect(JSON.parse(sessionStorage.getItem(HOME_MOTIVATION_SESSION_KEY))).toEqual({
      owner: "student-one", id: first.id,
    });
  });

  test("changes after logging out and logging in again, even when random would repeat", () => {
    const sessionStorage = memoryStorage();
    const localStorage = memoryStorage();
    const config = {studentId:"student-one", level:"B1", sessionStorage, localStorage, random:()=>0};
    const first = getSessionHomeMotivation(config);
    clearHomeMotivationSession(sessionStorage);
    const second = getSessionHomeMotivation(config);
    expect(first.id).not.toBe(second.id);
    expect(localStorage.getItem(HOME_MOTIVATION_LAST_KEY)).toContain(second.id);
    expect(getSessionHomeMotivation(config)).toBe(second);
  });

  test("isolates greetings between users on the same device", () => {
    const sessionStorage = memoryStorage();
    const localStorage = memoryStorage();
    const first = getSessionHomeMotivation({studentId:"uid-1",level:"A1",sessionStorage,localStorage,random:()=>.99});
    const other = getSessionHomeMotivation({studentId:"uid-2",level:"C2",sessionStorage,localStorage,random:()=>.99});
    expect(first.id).toMatch(/^a1-/);
    expect(other.id).toMatch(/^c2-/);
    expect(other.id).not.toEqual(first.id);
  });

  test("missing identity uses existing welcome title until the student is loaded", () => {
    const result = getSessionHomeMotivation({studentId:"", level:"A1", random:()=>.99});
    expect(result.id).toBe("fallback");
    expect(result.headline).toBe("your campus is ready.");
  });

  test("bad or blocked browser storage never crashes the student homepage", () => {
    const blocked = {
      getItem: () => { throw Error("Storage disabled"); },
      setItem: () => { throw Error("Storage disabled"); },
      removeItem: () => { throw Error("Storage disabled"); },
    };
    expect(() => getSessionHomeMotivation({
      studentId:"uid-1",level:"A2",sessionStorage:blocked,localStorage:blocked,
      random:()=>NaN,
    })).not.toThrow();
    expect(() => clearHomeMotivationSession(blocked)).not.toThrow();
  });

  test("homepage keeps the learner name, existing subtitle, action buttons and responsive heading", () => {
    const source = fs.readFileSync(path.resolve(__dirname,"../components/GeneralHome.js"),"utf8");
    const auth = fs.readFileSync(path.resolve(__dirname,"../context/AuthContext.js"),"utf8");
    expect(source).toContain("getSessionHomeMotivation({ studentId: learnerId, level: levelKey })");
    expect(source).toContain("studentName");
    expect(source).toContain("data-testid=\"home-motivation-heading\"");
    expect(source).toContain('fontSize: "clamp(20px, 4vw, 26px)"');
    expect(source).toContain("Continue learning");
    expect(source).toContain("onOpenAccount");
    expect(source).toContain("onJoinZoom");
    expect(source).toContain("<ExamReadinessBadge");
    expect(source).toContain("Your {courseLabel} is ready.");
    expect(auth).toContain("if (userChanged && !firebaseUser) clearHomeMotivationSession()");
    expect(auth).toContain("await signOut(auth);\n      clearHomeMotivationSession();");
  });

  test("selector uses no Firebase reads, extra cloud API calls or timers", () => {
    const source=fs.readFileSync(path.resolve(__dirname,"homeMotivationMessages.js"),"utf8");
    expect(source).not.toMatch(/fetch\(|getDoc\(|getDocs\(|setDoc\(|onSnapshot\(|setInterval\(|setTimeout\(/);
  });
});
