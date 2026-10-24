const {
  BOOK_OBJECT_KEY, BOOK_DOWNLOAD_SECONDS, isBooksR2Configured,
  getR2BooksConfig, createBookR2SignedUrl, checkBookR2Object,
} = require("../bookStorageR2");

const env = () => ({
  R2_ACCOUNT_ID: "f".repeat(32),
  R2_ACCESS_KEY_ID: "R2TESTBOOKACCESS",
  R2_SECRET_ACCESS_KEY: "r2-test-only-secret",
  R2_BOOKS_BUCKET: "falowen-books-private",
});

describe("private A1 book R2 storage", () => {
  test("allows a distinct dedicated private books bucket without Google Cloud dependencies", () => {
    expect(BOOK_OBJECT_KEY).toBe("books/private/falowen-a1-grammar-workbook-v1.pdf");
    expect(BOOK_DOWNLOAD_SECONDS).toBe(300);
    expect(isBooksR2Configured(env())).toBe(true);
    expect(getR2BooksConfig(env()).bucket).toBe("falowen-books-private");
    expect(isBooksR2Configured({ ...env(), R2_BOOKS_BUCKET: "" })).toBe(false);
    expect(() => getR2BooksConfig({ ...env(), R2_ACCOUNT_ID: "unsafe-account" })).toThrow("Invalid R2 account identifier");
  });

  test("creates a fixed-object five-minute GET URL with AWS4 signature and no public domain", () => {
    const at = new Date("2026-10-24T13:22:43.000Z");
    const signed = createBookR2SignedUrl({ env: env(), now: at });
    const url = new URL(signed.url);
    expect(url.protocol).toBe("https:");
    expect(url.hostname).toBe("falowen-books-private." + env().R2_ACCOUNT_ID + ".r2.cloudflarestorage.com");
    expect(url.pathname).toBe("/" + BOOK_OBJECT_KEY);
    expect(url.searchParams.get("X-Amz-Expires")).toBe("300");
    expect(url.searchParams.get("X-Amz-Algorithm")).toBe("AWS4-HMAC-SHA256");
    expect(url.searchParams.get("X-Amz-Date")).toBe("20261024T132243Z");
    expect(url.searchParams.get("X-Amz-Signature")).toMatch(/^[a-f0-9]{64}$/);
    expect(url.href).not.toContain(env().R2_SECRET_ACCESS_KEY);
    expect(url.href).not.toContain(".r2.dev");
    expect(signed.expiresAt - at.getTime()).toBe(300000);
  });

  test("GET signature does not authorize HEAD; HEAD signing is a separate operation", () => {
    const now = new Date("2026-10-24T13:22:43Z");
    const get = new URL(createBookR2SignedUrl({ env: env(), now, method: "GET" }).url);
    const head = new URL(createBookR2SignedUrl({ env: env(), now, method: "HEAD" }).url);
    expect(get.searchParams.get("X-Amz-Signature")).not.toEqual(head.searchParams.get("X-Amz-Signature"));
    expect(head.pathname).toBe(get.pathname);
    expect(() => createBookR2SignedUrl({ env: env(), method: "PUT" })).toThrow("Only signed book GET and HEAD");
  });

  test("private file presence probe uses HEAD and transfers no PDF body", async () => {
    const calls = [];
    const ok = await checkBookR2Object({
      env: env(),
      fetchFn: async (url, opts) => {
        calls.push({ url, opts });
        return { ok: true, status: 200 };
      },
    });
    expect(ok).toBe(true);
    expect(calls).toHaveLength(1);
    expect(calls[0].opts.method).toBe("HEAD");
    expect(calls[0].opts.redirect).toBe("error");
    expect(calls[0].url).toContain("/" + BOOK_OBJECT_KEY);
    expect(await checkBookR2Object({ env: env(), fetchFn: async () => ({ ok: false, status: 404 }) })).toBe(false);
  });
});
