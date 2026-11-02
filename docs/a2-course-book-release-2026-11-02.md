# Falowen Deutsch A2 — Course & Workbook (digital storefront release)

- **Product:** `a2-course-workbook` / `a2-course-workbook-digital`.
- **Public page:** `/books/deutsch-a2-course-workbook` (also in Campus books).
- **Edition:** 328-page clean A4 PDF, 28 lessons, digital only.
- **Price:** GH₵99 (same current digital retail benchmark as A1). Review/change this price through the server-authoritative `BOOKS` catalog, not browser code.
- **Private R2 bucket:** `falowen-books-private` (public access must remain disabled).
- **Exact uploaded object key:** `book/Falowen-A2-Course-Materials-Clean.pdf`.
- **Audio:** The book has authenticated Falowen lesson/Hören QR links, not embedded recordings. A purchase of the PDF does **not** grant course enrollment.
- **Fulfilment:** Book checkout requires `FALOWEN_BOOK_PAYMENTS_ENABLED=true`. A verified Paystack order can use `/books/download` only when `FALOWEN_BOOK_DIGITAL_DELIVERY_ENABLED=true` and R2 signing secrets are present. Otherwise fulfil manually against the verified receipt. Never put private R2 URLs on public pages.
- **Legacy exam guides unlisted:** `a1-writing-model-exams`, `a2-four-skills-exam-guide`, `b1-four-skills-exam-guide` are removed from public catalog/page maps, carousel and sitemap. New checkout for their SKUs is rejected on the server. Their existing private R2 keys, SKU identifiers and paid receipt links remain valid for previous purchasers.
- **Release safety:** Review the new A2 printed-page file and royalty/usage rights before retail promotion. The 328-page file is the **clean** version, not the 332-page draft or 50-page A2 exam guide.

## Production checks

1. Confirm frontend release contains `/books/deutsch-a2-course-workbook`, new A2 cover, three carousel slides, and no old guide cards.
2. Confirm live `GET /books/catalog` contains `a2-course-workbook-digital` at 99 GHS / 328 pages but omits every old exam-guide SKU.
3. Confirm direct old guide/checkout pages display not found, and backend `POST /books/checkout` rejects all six retired exam-guide SKUs.
4. Test book checkout with Paystack sandbox credentials in isolated nonproduction environment; ensure real buyer receipt and appropriate manual/automatic PDF fulfilment before accepting production orders.
5. Verify final R2 object PDF bytes and a sample of the QR code links with authenticated student access.
