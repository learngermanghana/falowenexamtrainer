import fs from "fs";
import path from "path";

describe("public application shell", () => {
  const root = path.resolve(__dirname, "../../..");
  const html = fs.readFileSync(
    path.join(root, "web/public/index.html"),
    "utf8"
  );

  it("does not load Google AdSense", () => {
    expect(html).not.toContain("adsbygoogle");
    expect(html).not.toContain("pagead2.googlesyndication.com");
    expect(html).not.toContain("ca-pub-");
  });
});
