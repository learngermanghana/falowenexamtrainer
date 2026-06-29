import fs from "fs";
import path from "path";

describe("public signup deployment routing", () => {
  const repositoryRoot = path.resolve(__dirname, "../../..");

  it("sends signup requests to the React app before checking static files", () => {
    const config = JSON.parse(
      fs.readFileSync(path.join(repositoryRoot, "vercel.json"), "utf8")
    );

    const signupRouteIndex = config.routes.findIndex(
      (route) => route.src === "/signup/?" && route.dest === "/index.html"
    );
    const filesystemIndex = config.routes.findIndex(
      (route) => route.handle === "filesystem"
    );

    expect(signupRouteIndex).toBeGreaterThanOrEqual(0);
    expect(filesystemIndex).toBeGreaterThanOrEqual(0);
    expect(signupRouteIndex).toBeLessThan(filesystemIndex);
  });

  it("does not ship a static signup page that redirects away from the form", () => {
    expect(
      fs.existsSync(path.join(repositoryRoot, "web/public/signup/index.html"))
    ).toBe(false);
  });
});
