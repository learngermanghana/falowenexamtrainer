# Falowen Books — print pricing and individual product pages

## Quotation-based printed retail benchmark

A1 printer quotation: 250 pages, GHS 660 cost. Approved A1 printed selling price: GHS 800.

- Printing cost per page: GHS 660 / 250 = **GHS 2.64**.
- Retail revenue per page: GHS 800 / 250 = **GHS 3.20**.
- A1 contribution before Paystack, packaging, transport, returns and overhead: **GHS 140**, or 17.5% of the selling price.
- New-book estimating formula: `pages * 3.20`, then optionally round up to nearest GHS 50.
- **A2 (441 pages)**: estimated print cost **GHS 1,164.24**, formula retail **GHS 1,411.20**, provisional rounded estimate **GHS 1,450**.

This is **not** a fixed-price contract with the printer: binding, cover, paper weight, colour pages, volume, print runs and size can change the price. Obtain an actual A2 quotation before enabling the SKU, and choose a sale price that also covers packaging and Paystack fees. Shipping is additional and arranged manually. Automatic printing-price suggestions are for administrative planning and do not activate a new book. Digital pricing uses its own product pricing.

The benchmark logic is `functions/functionz/bookPrintPricing.js`, and its tests verify the A1 and A2 estimates.

## Public bookstore structure

- `/books` — searchable catalogue with every title.
- `/books/deutsch-a1-course-workbook` — A1 book detail, both editions, free sample and FAQ.
- `/books/deutsch-a2-course-workbook` — forthcoming A2 page (no checkout, no quoted retail price).
- `/books/how-to-unlock-your-german-writing-skills-a1-c2` — standalone writing handbook.
- `/books/cart` — quantities, prices, contact and checkout.
- `/books/complete?order=...&key=...` — private receipt verification (never index).

Only `BOOKS` in `functions/functionz/bookCommerce.js` supplies valid live checkout SKUs. `BOOK_CATALOG_TITLES` may include titles that are **not** available for purchase. Never enable an A2 checkout SKU until the rights audit, retail PDF release and approved private R2 delivery are complete.

## Cart and security

The visitor can add a maximum of 10 printed copies per edition, 15 copies total, and six different editions. Digital PDFs are limited to one copy per buyer email until multi-license delivery exists.

The frontend stores only SKU IDs and quantities in the browser. At checkout, the backend validates available SKUs, line quantities, combined total, buyer contact and server-approved prices before initializing Paystack in GHS (pesewas). The order records itemized quantities and a digest of the cart. The existing signed Paystack webhook requires matching digest, exact amount, currency, reference and customer email. Legacy single-SKU receipts still verify. USD is a display-only estimate based on the existing daily quote.

No payments have been initiated in this PR. Manual PDF and print fulfilment remains unchanged. Preview deployments remain disabled under Vercel Hobby. Before release, test an authorized payment with two distinct items and two printed copies, verify itemization in the receipt and admin fulfilment workflow, and ensure order totals and older paid receipts still reconcile.

## Next in the book publishing queue: two independent exam-preparation guides

Received as user-owned working manuscripts, **not published to any public GitHub
path or to the static website**:

| Manuscript | Proposed independent book listing | Pages | A1-benchmark print estimate | Indicative retail at GHS 3.20/page | Rounding up to GHS 50 |
| --- | --- | ---: | ---: | ---: | ---: |
| `goethe-zertifikat-a1-model-exam-guide-v2.pdf` | A1 Writing Model Exams & Practice Workbook | 30 (US Letter) | GHS 79.20 | GHS 96.00 | GHS 100 |
| `goethe-zertifikat-a2-complete-50p.pdf` | A2 Four-Skills Exam Preparation Guide | 50 (A4) | GHS 132.00 | GHS 160.00 | GHS 200 |

**These amounts are internal planning numbers only**, not checkout prices.
US Letter and A4 have different paper dimensions. The GHS 2.64/page benchmark
was based on a 250-page A1 printing quote and may not represent low-volume
30-page or 50-page binding costs. Obtain quotes for these specific paper sizes,
cover stocks, colour print choices, binding, and delivery before publishing
any printed SKU. Digital editions also need separate agreed retail prices.

Canonical future detail URLs:
- `/books/goethe-a1-writing-model-exams` — 30-page **Schreiben-only** training:
  six form/email model exams, writing workspace, annotated solutions and
  grammar tips. Do not claim the other three exam modules are included.
- `/books/goethe-a2-four-skills-exam-guide` — 50-page four-skills training:
  Lesen, Hören *scripts*, Schreiben and Sprechen. Do not suggest the PDF
  itself embeds protected audio or the Falowen examiner subscription.

**Editorial and rights gates before availability**
1. Review authorship and permission for every included task and reference,
   especially Goethe trademarks or statements of approval. The manuscripts
   contain phrases including *"Official Curriculum Standard"*, *"Official
   Goethe A1 Scoring Rubric"* and *"Academy Official Publication"*.
   Attribute correctly and ensure buyers understand that this is independent
   Falowen/Academy material, not an official Goethe-Institut book, certificate,
   or formally endorsed practice test.
2. Check exam descriptions, durations, scores, scripts and model answers
   against the correct current exam edition before any promise of precise
   official grading.
3. A2 PDF printed page 10 visibly contains the literal hex string
   `#EDF2F7` in the exam task section. Remove this design-code leak
   in a reviewed edition before sale. Reinspect other pages for layout faults.
4. Review each file visually for legibility, printable handwriting space,
   forms, answer keys, and expected listening/audio availability. The A1
   manuscript is US Letter while A2 is A4; standardize or quote separately.
5. Store the approved full PDF in the private books R2 bucket. Publish only a
   deliberately short, approved free sample; no direct public full-PDF URL.
6. Set server-side prices and allowlist purchasable SKU(s) **only after**
   print/digital pricing, rights, delivery, and a paid receipt fulfilment test.

Both titles currently use `status: "coming_soon"` and `bookIds: []`, so
`/books/checkout` rejects any attempted purchase. Adding them to the
catalogue does not activate sales or change existing A1/book-cart pricing.
