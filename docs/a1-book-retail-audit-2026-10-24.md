# Falowen Deutsch A1 — Print / Digital Release QA

**Source:** GitHub Actions `Course material bundle`, successful manual build #161
([run 40101320019](https://github.com/learngermanghana/falowenexamtrainer/actions/runs/40101320019)).
**Date:** 24 October 2026.

## PDF audit summary

| Run | A1 pages | PDF artifact |
| --- | ---: | --- |
| #145 | 260 | Uploaded |
| #151 | 255 | Uploaded |
| #161 | 250 | Uploaded (53,191,247 source bytes) |

The #161 PDF contains **250 pages**, **60 outline entries**, and **60 clickable table-of-contents links** on its opening pages. The 22 printable lesson days, Days 1–22, are represented by the document outline. The course manifest intentionally excludes Day 0 (onboarding tutorial) and Day 23 (final mock exam kept in the Exams Room). Manifest counts: 24 canonical entries, 22 printable, zero unresolved, zero missing days.

Programmatic page-by-page comparison (matching document sections by day) found no losses of unique words of length seven or more between builds #151 and #161. The five-page reduction from #151 to #161 is accounted for by tighter layout / page flow on Days 5, 6, 7, 13 and 16 (one page fewer each). Between #145 and #151, Days 7, 13, 19 and 22 decreased by one, two, one and one pages respectively.

**Important limitation:** This vocabulary-level comparison is not equivalent to sentence-by-sentence proofreading; short text, duplicated sections, layout or images can still vary. A final human editorial review is recommended.

Automated extraction found no email addresses. No occurrences of "class-shared" or "class shared" were found in the PDF text. Page 1 of #161 **does say "Editorial review copy - not for sale"**; the retail PDF cover has been replaced by the new original Falowen design, and future `renderA1Bundle.mjs` runs now render an A1 retail cover. The separate optional `buildPressProof.mjs` keeps its **NOT FOR SALE** warning for internal proofs.

## Release scope and merchandising

The book is advertised as **Deutsch A1 — Course & Workbook**, with **250 pages** and **22 printable lesson days**.
- Digital PDF: **GH₵99**, fulfilled manually after verified Paystack payment.
- Printed on demand: **GH₵800**, delivery separately arranged and charged.
- The **final mock exam is not included** and remains in the Falowen Exams Room.

The bookstore cover is `web/public/books/a1-cover.svg`. Public preview uses representative, checked Day 1 text excerpts from grammar and workbook sections, reformatted as a small PDF generated in the browser with jsPDF. The preview **must never contain the entire paid PDF**. The separate full print-ready file is for private fulfilment.

## Publication checklist

- [x] PDF page count, TOC, bookmarks, link preservation and manifest coverage checked.
- [x] Retail cover implemented; ordinary A1 export no longer renders a "not for sale" banner.
- [x] PDF sample excerpts verified against Day 1 text.
- [x] Paid full PDF omitted from the public site.
- [x] Delivery fee disclosed separately for printed orders.
- [ ] Publisher to confirm rights to embedded text, photos and sourced external lesson PDFs before retail distribution.
- [ ] Human proofread of all exercises, images, page breaks and answer-key policy.
- [ ] Verify latest generated retail PDF matches release candidate before future automated publication.
- [ ] Complete a real payment-to-manual-delivery test through Paystack.

## Print fulfilment note

The audited PDF has 250 A4 pages. Discuss with the print shop whether GH₵660 includes printing **the cover**, binding, paper size, colour versus black-and-white, and VAT, before treating GH₵140 as margin. Do not promise a delivery time that the print shop has not confirmed.
