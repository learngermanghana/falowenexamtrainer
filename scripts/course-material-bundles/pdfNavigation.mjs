import { PDFArray, PDFHexString, PDFName, StandardFonts, rgb } from "pdf-lib";

export const A4_PAGE = [595.28, 841.89];

const pageNumberFor = (output, targetPage) => {
  const index = output.getPages().findIndex((page) => page.ref === targetPage.ref);
  return index >= 0 ? index + 1 : null;
};

const ensureAnnots = (output, page) => {
  const key = PDFName.of("Annots");
  const existing = page.node.lookupMaybe(key, PDFArray);
  if (existing) return existing;
  const created = output.context.obj([]);
  page.node.set(key, created);
  return created;
};

const addInternalLink = (output, page, targetPage, { x, y, width, height }) => {
  const annotation = output.context.register(
    output.context.obj({
      Type: "Annot",
      Subtype: "Link",
      Rect: [x, y, x + width, y + height],
      Border: [0, 0, 0],
      Dest: [targetPage.ref, "Fit"],
    }),
  );
  ensureAnnots(output, page).push(annotation);
};

const truncate = (text, max = 76) => {
  const value = String(text || "").trim();
  return value.length <= max ? value : `${value.slice(0, Math.max(1, max - 1)).trimEnd()}…`;
};

export const createPdfNavigation = async (output, { level }) => {
  const font = await output.embedFont(StandardFonts.Helvetica);
  const bold = await output.embedFont(StandardFonts.HelveticaBold);

  const addSectionDivider = ({ lesson, sectionLabel }) => {
    const page = output.addPage(A4_PAGE);
    page.drawText("FALOWEN", {
      x: 54,
      y: 755,
      size: 24,
      font: bold,
      color: rgb(0.08, 0.25, 0.65),
    });
    page.drawText(`${level} · Day ${lesson.day}`, {
      x: 54,
      y: 680,
      size: 18,
      font,
      color: rgb(0.35, 0.4, 0.48),
    });

    const title = String(lesson.title || "").trim();
    const titleLines = title.length > 58
      ? [title.slice(0, 58).trimEnd(), title.slice(58, 116).trim()]
      : [title];
    let titleY = 625;
    for (const line of titleLines.filter(Boolean)) {
      page.drawText(line, { x: 54, y: titleY, size: 24, font: bold });
      titleY -= 32;
    }

    page.drawText(String(sectionLabel || "").toUpperCase(), {
      x: 54,
      y: 475,
      size: 32,
      font: bold,
      color: rgb(0.08, 0.25, 0.65),
    });
    page.drawText("Falowen Grammar Notes & Workbook", {
      x: 54,
      y: 430,
      size: 12,
      font,
      color: rgb(0.45, 0.5, 0.58),
    });
    return page;
  };

  const addBookmarks = (navigation) => {
    if (!navigation.length) return;

    const context = output.context;
    const outlinesRef = context.nextRef();
    const lessonRefs = navigation.map(() => context.nextRef());
    const childRefs = navigation.map((entry) => entry.sections.map(() => context.nextRef()));

    navigation.forEach((entry, lessonIndex) => {
      const children = childRefs[lessonIndex];
      const firstTarget = entry.sections[0]?.page;
      const lessonDict = {
        Title: PDFHexString.fromText(`Day ${entry.day} · ${entry.title}`),
        Parent: outlinesRef,
        Dest: [firstTarget.ref, "Fit"],
        Count: children.length,
      };
      if (lessonIndex > 0) lessonDict.Prev = lessonRefs[lessonIndex - 1];
      if (lessonIndex < lessonRefs.length - 1) lessonDict.Next = lessonRefs[lessonIndex + 1];
      if (children.length) {
        lessonDict.First = children[0];
        lessonDict.Last = children[children.length - 1];
      }
      context.assign(lessonRefs[lessonIndex], context.obj(lessonDict));

      entry.sections.forEach((section, sectionIndex) => {
        const childDict = {
          Title: PDFHexString.fromText(section.label),
          Parent: lessonRefs[lessonIndex],
          Dest: [section.page.ref, "Fit"],
        };
        if (sectionIndex > 0) childDict.Prev = children[sectionIndex - 1];
        if (sectionIndex < children.length - 1) childDict.Next = children[sectionIndex + 1];
        context.assign(children[sectionIndex], context.obj(childDict));
      });
    });

    const totalChildren = childRefs.reduce((sum, refs) => sum + refs.length, 0);
    context.assign(
      outlinesRef,
      context.obj({
        Type: "Outlines",
        First: lessonRefs[0],
        Last: lessonRefs[lessonRefs.length - 1],
        Count: navigation.length + totalChildren,
      }),
    );
    output.catalog.set(PDFName.of("Outlines"), outlinesRef);
    output.catalog.set(PDFName.of("PageMode"), PDFName.of("UseOutlines"));
  };

  const addClickableContents = (navigation) => {
    if (!navigation.length) return [];

    const rows = [];
    for (const entry of navigation) {
      const first = entry.sections[0];
      if (!first) continue;
      rows.push({
        label: `Day ${entry.day} · ${entry.title}`,
        targetPage: first.page,
        indent: 0,
        size: 10.5,
        useBold: true,
        rowHeight: 18,
      });
      for (const section of entry.sections) {
        rows.push({
          label: section.label,
          targetPage: section.page,
          indent: 18,
          size: 9.5,
          useBold: false,
          rowHeight: 15,
        });
      }
      rows.push({ gap: 5 });
    }

    const pageRows = [[]];
    let y = 748;
    for (const row of rows) {
      if (row.gap) {
        y -= row.gap;
        continue;
      }
      if (y - row.rowHeight < 65) {
        pageRows.push([]);
        y = 748;
      }
      pageRows[pageRows.length - 1].push({ ...row, y });
      y -= row.rowHeight;
    }

    const tocPages = pageRows.map((_, index) => {
      const page = output.insertPage(1 + index, A4_PAGE);
      page.drawText(index === 0 ? "Contents" : "Contents continued", {
        x: 54,
        y: 790,
        size: index === 0 ? 24 : 18,
        font: bold,
      });
      return page;
    });

    pageRows.forEach((rowsForPage, pageIndex) => {
      const tocPage = tocPages[pageIndex];
      for (const row of rowsForPage) {
        const x = 58 + row.indent;
        const pageNumber = pageNumberFor(output, row.targetPage);
        const pageText = pageNumber ? String(pageNumber) : "—";
        const shown = truncate(row.label, row.indent ? 62 : 72);
        tocPage.drawText(shown, {
          x,
          y: row.y,
          size: row.size,
          font: row.useBold ? bold : font,
        });
        const pageTextWidth = font.widthOfTextAtSize(pageText, row.size);
        tocPage.drawText(pageText, {
          x: 528 - pageTextWidth,
          y: row.y,
          size: row.size,
          font,
        });
        addInternalLink(output, tocPage, row.targetPage, {
          x,
          y: row.y - 3,
          width: 480 - row.indent,
          height: row.rowHeight,
        });
      }
    });

    return tocPages;
  };

  const finalize = (navigation) => {
    const tocPages = addClickableContents(navigation);
    addBookmarks(navigation);
    return tocPages;
  };

  return { font, bold, addSectionDivider, finalize };
};
