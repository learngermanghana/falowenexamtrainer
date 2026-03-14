const request = require("supertest");
const wrapper = require("../server");

describe("server route mounting", () => {
  it("serves health checks from root for local clients", async () => {
    const response = await request(wrapper).get("/health");

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({ ok: true });
  });

  it("keeps /api-prefixed health checks working", async () => {
    const response = await request(wrapper).get("/api/health");

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({ ok: true });
  });
});
