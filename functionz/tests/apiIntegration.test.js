const fs = require("fs");
const path = require("path");
const request = require("supertest");

const questionsCsv = fs.readFileSync(
  path.join(__dirname, "fixtures", "speaking-questions.csv"),
  "utf-8"
);
const writingCsv = fs.readFileSync(
  path.join(__dirname, "fixtures", "writing-tasks.csv"),
  "utf-8"
);

describe("API integration", () => {
  let app;

  beforeEach(() => {
    jest.resetModules();
    global.fetch = jest.fn();
  });

  afterEach(() => {
    delete global.fetch;
  });

  const loadApp = () => {
    app = require("../app");
  };

  it("serves normalized speaking questions from the sheet", async () => {
    global.fetch.mockResolvedValue({
      ok: true,
      status: 200,
      text: async () => questionsCsv,
    });

    loadApp();
    const response = await request(app).get("/api/speaking/questions");

    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          level: "A1",
          teil: "Teil 1 – Vorstellung",
          topic: "Introduce yourself",
          keyword: "Hallo",
        }),
      ])
    );
    expect(global.fetch).toHaveBeenCalled();
  });

  it("returns structured writing tasks", async () => {
    global.fetch.mockResolvedValue({
      ok: true,
      status: 200,
      text: async () => writingCsv,
    });

    loadApp();
    const response = await request(app).get("/api/writing/tasks");

    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: "weekend-plans",
          level: "A1",
          durationMinutes: 10,
          whatToInclude: ["Bring snacks", "Invite friend"],
        }),
      ])
    );
  });

  it("reports cache stats and uptime on /api/health", async () => {
    global.fetch
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        text: async () => questionsCsv,
      })
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        text: async () => writingCsv,
      });

    loadApp();

    await request(app).get("/api/speaking/questions");
    await request(app).get("/api/writing/tasks");
    const response = await request(app).get("/api/health");

    expect(response.status).toBe(200);
    expect(response.body.status).toBe("ok");
    expect(response.body.cache.questions.entries).toBeGreaterThan(0);
    expect(response.body.cache.writingTasks.entries).toBeGreaterThan(0);
    expect(typeof response.body.uptime).toBe("number");
  });
});
