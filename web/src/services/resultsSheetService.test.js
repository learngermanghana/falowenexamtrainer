import { fetchResultsFromPublishedSheet } from "./resultsSheetService";

describe("fetchResultsFromPublishedSheet", () => {
  const originalFetch = global.fetch;

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it("maps assignment_id header into assignmentId fields", async () => {
    const csv = [
      "studentcode,name,assignment,score,comments,date,level,link,assignment_id",
      "st-001,Ana,Task 1,88,Good,2026-01-01,A1,https://example.com,A1-DAY-1",
    ].join("\n");

    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      text: async () => csv,
    });

    const rows = await fetchResultsFromPublishedSheet(
      "https://docs.google.com/spreadsheets/d/abc/export?format=csv&gid=0"
    );

    expect(rows).toHaveLength(1);
    expect(rows[0].assignment_id).toBe("A1-DAY-1");
    expect(rows[0].assignmentId).toBe("A1-DAY-1");
  });
});
