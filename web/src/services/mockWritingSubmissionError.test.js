import { getMockWritingSubmissionError } from "./mockWritingSubmissionError";

describe("mock writing marking errors", () => {
  test.each([502, 503, 504])("keeps the draft and prompts a safe retry for %s", (status) => {
    const message = getMockWritingSubmissionError({ response: { status, data: {} } });
    expect(message).toContain(String(status));
    expect(message).toContain("saved in this browser");
    expect(message).toContain("Do not restart");
  });

  it("keeps useful application errors for non-transient responses", () => {
    expect(getMockWritingSubmissionError({
      response: { status: 429, data: { error: "Daily writing analysis limit reached" } },
    })).toContain("Daily writing analysis limit reached");
  });

  it("uses clear offline fallback, not technical Axios language", () => {
    const message = getMockWritingSubmissionError(new Error("Network Error"));
    expect(message).toContain("Could not reach");
    expect(message).toContain("without restarting");
  });
});
