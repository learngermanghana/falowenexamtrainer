import assert from "node:assert/strict";
import test from "node:test";
import { PDFArray, PDFDocument, PDFName } from "pdf-lib";
import { createPdfNavigation } from "./pdfNavigation.mjs";

test("PDF navigation serializes clickable contents and hierarchical outlines", async () => {
  const pdf = await PDFDocument.create();
  pdf.addPage([595.28, 841.89]);

  const navigation = await createPdfNavigation(pdf, { level: "A2" });
  const lesson = { day: 1, title: "Test lesson" };
  const grammar = navigation.addSectionDivider({ lesson, sectionLabel: "Grammar" });
  pdf.addPage([595.28, 841.89]);
  const workbook = navigation.addSectionDivider({ lesson, sectionLabel: "Workbook" });
  pdf.addPage([595.28, 841.89]);

  navigation.finalize([
    {
      day: 1,
      title: lesson.title,
      sections: [
        { label: "Grammar", page: grammar },
        { label: "Workbook", page: workbook },
      ],
    },
  ]);

  const bytes = await pdf.save();
  const loaded = await PDFDocument.load(bytes);

  assert.ok(loaded.catalog.get(PDFName.of("Outlines")));
  assert.equal(loaded.catalog.get(PDFName.of("PageMode"))?.toString(), "/UseOutlines");

  const linkedPages = loaded.getPages().filter((page) => {
    const annots = page.node.lookupMaybe(PDFName.of("Annots"), PDFArray);
    return annots && annots.size() > 0;
  });

  assert.ok(linkedPages.length >= 1);
  assert.ok(loaded.getPageCount() >= 6);
});
