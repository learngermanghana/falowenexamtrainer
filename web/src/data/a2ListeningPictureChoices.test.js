import fs from "fs";
import path from "path";

describe("A2 Hören sample picture choices", () => {
  test("Teil 2 and Teil 3 reuse their visual picture components in Hören Sample 1", () => {
    const sample = fs.readFileSync(
      path.join(process.cwd(), "src", "components", "ListeningPracticeSamplePage.jsx"),
      "utf8"
    );
    const teil2 = fs.readFileSync(
      path.join(process.cwd(), "src", "components", "A2GoetheListeningMockTeil2Preview.jsx"),
      "utf8"
    );
    const teil3 = fs.readFileSync(
      path.join(process.cwd(), "src", "components", "A2GoetheListeningMockTeil3Preview.jsx"),
      "utf8"
    );

    expect(teil2).toContain("export const A2ListeningTeil2PictureScene");
    expect(teil3).toContain("export const A2ListeningTeil3Picture");
    expect(sample).toContain("<A2ListeningTeil2PictureScene");
    expect(sample).toContain("<A2ListeningTeil3Picture");
    expect(sample).toContain('"./A2GoetheListeningMockTeil2Preview.css"');
    expect(sample).toContain('"./A2GoetheListeningMockTeil3Preview.css"');
  });

  test("Teil 2 no longer falls back to a text-only picture list", () => {
    const sample = fs.readFileSync(
      path.join(process.cwd(), "src", "components", "ListeningPracticeSamplePage.jsx"),
      "utf8"
    );
    expect(sample).toContain('className="a2-hoeren-picture-grid"');
    expect(sample).not.toContain('<strong>{picture.id}</strong>\n                <span>{picture.label}</span>');
  });
});
