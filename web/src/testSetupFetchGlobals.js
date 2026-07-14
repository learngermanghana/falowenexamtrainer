/*
 * Jest's jsdom environment does not always expose the Fetch API classes that
 * Firebase Auth references while modules are being initialized. The live-class
 * summary tests do not perform network requests, but they still import modules
 * that share Firebase dependencies with the browser app.
 */

if (typeof globalThis.Headers === "undefined") {
  globalThis.Headers = class Headers {
    constructor(init = {}) {
      this.values = new Map(Object.entries(init || {}));
    }

    get(name) {
      return this.values.get(String(name || "").toLowerCase()) || null;
    }

    set(name, value) {
      this.values.set(String(name || "").toLowerCase(), String(value));
    }
  };
}

if (typeof globalThis.Response === "undefined") {
  globalThis.Response = class Response {
    constructor(body = null, init = {}) {
      this.body = body;
      this.status = Number(init.status || 200);
      this.ok = this.status >= 200 && this.status < 300;
      this.headers = init.headers instanceof globalThis.Headers
        ? init.headers
        : new globalThis.Headers(init.headers || {});
    }

    async json() {
      return typeof this.body === "string" ? JSON.parse(this.body) : this.body;
    }

    async text() {
      return typeof this.body === "string" ? this.body : JSON.stringify(this.body ?? "");
    }
  };
}

if (typeof globalThis.Request === "undefined") {
  globalThis.Request = class Request {
    constructor(input = "", init = {}) {
      this.url = String(input?.url || input || "");
      this.method = String(init.method || "GET").toUpperCase();
      this.headers = init.headers instanceof globalThis.Headers
        ? init.headers
        : new globalThis.Headers(init.headers || {});
      this.body = init.body;
    }
  };
}
