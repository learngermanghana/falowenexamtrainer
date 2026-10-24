const {
  isReleasedMockHoerenAudio,
  EXISTING_RELEASED_CANONICAL_KEYS,
} = require("../publishedMockHoerenAccess");

const mockDb = {
  collection: jest.fn(name => ({ doc: id => ({
    get: jest.fn(async () => ({
      exists: name === "publishedMockHoerenAudio",
      data: () => ({
        status: "draft", level: "B1", mockId: "mock-02",
        parts: { "teil-1": "b1/mock-hoeren/mock-02/teil-1.mp3" },
      }),
    })),
  }) })),
};

test("existing A1 and A2 published Mock 1 MP3 files stay accessible", async () => {
  expect(EXISTING_RELEASED_CANONICAL_KEYS).toHaveProperty("size", 7);
  for (const level of ["A1", "A2"]) {
    const maxPart = level === "A1" ? 3 : 4;
    for (let number = 1; number <= maxPart; number++) {
      const part = `teil-${number}`;
      const key = `${level.toLowerCase()}/mock-hoeren/mock-01/${part}.mp3`;
      expect(await isReleasedMockHoerenAudio({ db: mockDb, level, mockId: "mock-01", part, key })).toBe(true);
    }
  }
  expect(mockDb.collection).not.toHaveBeenCalled();
});

test("existing noncanonical B1/B2 and A2 mock paths keep working unchanged", async () => {
  for (const [level, key] of [
    ["A1", "a1/mock-hoeren/mock-01/teil-1.wav"],
    ["A2", "a2/mock-horen-2/teil-1.mp3"],
    ["B1", "b1/mock-hoeren-1/teil-1.mp3"],
    ["B1", "b1/mock-hoeren-1/sprechen-teil-1.mp3"],
    ["B2", "b2/mock-hoeren-1/teil-4.mp3"],
  ]) {
    expect(await isReleasedMockHoerenAudio({ db: mockDb, level, mockId: "mock-01", part: "teil-1", key })).toBe(true);
  }
});

test("guessed new B1/B2 mock recordings and unreleased draft manifests are denied", async () => {
  const cases = [
    ["B1", "mock-01", "teil-1", "b1/mock-hoeren/mock-01/teil-1.mp3"],
    ["B1", "mock-02", "teil-1", "b1/mock-hoeren/mock-02/teil-1.mp3"],
    ["B2", "mock-99", "teil-4", "b2/mock-hoeren/mock-99/teil-4.mp3"],
    ["A2", "mock-02", "teil-1", "a2/mock-hoeren/mock-02/teil-1.mp3"],
    ["A1", "mock-03", "teil-1", "a1/mock-hoeren/mock-03/teil-1.mp3"],
  ];
  for (const [level, mockId, part, key] of cases) {
    expect(await isReleasedMockHoerenAudio({ db: mockDb, level, mockId, part, key })).toBe(false);
    expect(await isReleasedMockHoerenAudio({ db: null, level, mockId, part, key })).toBe(false);
  }
});

test("published server manifest grants only exact matching level, mock ID, part and object key", async () => {
  const manifest = {
    status: "published", level: "B1", mockId: "mock-02",
    parts: { "teil-1": "b1/mock-hoeren/mock-02/teil-1.mp3" },
  };
  const db = { collection: name => {
    expect(name).toBe("publishedMockHoerenAudio");
    return { doc: id => {
      expect(id).toBe("b1-mock-02");
      return { get: async () => ({ exists: true, data: () => manifest }) };
    } };
  } };
  const data = { db, level: "B1", mockId: "mock-02", part: "teil-1", key: manifest.parts["teil-1"] };
  expect(await isReleasedMockHoerenAudio(data)).toBe(true);
  expect(await isReleasedMockHoerenAudio({ ...data, part: "teil-2", key: "b1/mock-hoeren/mock-02/teil-2.mp3" })).toBe(false);
  manifest.status = "draft";
  expect(await isReleasedMockHoerenAudio(data)).toBe(false);
  manifest.status = "published";
  manifest.level = "B2";
  expect(await isReleasedMockHoerenAudio(data)).toBe(false);
  manifest.level = "B1";
  manifest.mockId = "mock-03";
  expect(await isReleasedMockHoerenAudio(data)).toBe(false);
  manifest.mockId = "mock-02";
  manifest.parts["teil-1"] = "b1/mock-hoeren/mock-02/teil-1-other.mp3";
  expect(await isReleasedMockHoerenAudio(data)).toBe(false);
});

test("an unavailable published-manifest database does not permit canonical signing", async () => {
  const data = { level: "B2", mockId: "mock-03", part: "teil-2", key: "b2/mock-hoeren/mock-03/teil-2.mp3" };
  await expect(isReleasedMockHoerenAudio({ ...data, db: { collection: () => { throw new Error("unavailable"); } } }))
    .rejects.toThrow("unavailable");
});
