const http = require("http");

jest.mock("../app", () => {
  const express = require("express");
  const app = express();
  app.get("/health", (req, res) => res.json({ ok: true }));
  return app;
});

const wrapper = require("../server");

function requestJson(app, path) {
  return new Promise((resolve, reject) => {
    const server = app.listen(0, () => {
      const { port } = server.address();
      const req = http.get({ port, path }, (res) => {
        let body = "";
        res.setEncoding("utf8");
        res.on("data", (chunk) => {
          body += chunk;
        });
        res.on("end", () => {
          server.close((closeErr) => {
            if (closeErr) {
              reject(closeErr);
              return;
            }

            try {
              resolve({
                status: res.statusCode,
                body: body ? JSON.parse(body) : null,
              });
            } catch (err) {
              reject(err);
            }
          });
        });
      });

      req.on("error", (err) => {
        server.close(() => reject(err));
      });
    });

    server.on("error", reject);
  });
}

describe("server route mounting", () => {
  it("serves health checks from root for local clients", async () => {
    const response = await requestJson(wrapper, "/health");

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({ ok: true });
  });

  it("keeps /api-prefixed health checks working", async () => {
    const response = await requestJson(wrapper, "/api/health");

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({ ok: true });
  });
});
