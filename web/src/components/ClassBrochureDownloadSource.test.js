import fs from "fs";
import path from "path";

const publicClassFile = (fileName) =>
  fs.readFileSync(path.join(__dirname, "../../public/classes", fileName), "utf8");

describe("Falowen class brochure download", () => {
  test("loads the dedicated brochure PDF generator instead of calling window.print directly", () => {
    const indexSource = publicClassFile("index.html");

    expect(indexSource).toContain('id="downloadBrochureButton"');
    expect(indexSource).toContain('src="/classes/brochure-download.js');
    expect(indexSource).not.toContain('onclick="window.print()"');
  });

  test("generates a branded two-page PDF with a print fallback", () => {
    const source = publicClassFile("brochure-download.js");

    expect(source).toContain("html2canvas@1.4.1");
    expect(source).toContain("jspdf@2.5.2");
    expect(source).toContain('class="pdf-page pdf-page-one"');
    expect(source).toContain('class="pdf-page pdf-page-two"');
    expect(source).toContain("pdf.save(`${slugify(data.classTitle)}-falowen-brochure.pdf`)");
    expect(source).toContain("Full course fee");
    expect(source).toContain("Four simple steps");
    expect(source).toContain("falowen-brochure-print-fallback");
  });
});
