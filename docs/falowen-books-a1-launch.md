# Falowen Books — A1 launch checklist

**First title:** Falowen A1 Grammar Notes & Workbook, 2026 edition, 250 pages.
**Launch price proposal:** GH₵99, plus the existing Falowen shared Paystack processing fee.
**Status:** Catalog and free sample prepared. Paid downloads remain OFF by default.

## Customer pages

- Catalog: https://www.falowen.app/books
- A1 product and buyer library: https://www.falowen.app/books/a1
- Free interactive Day 1 sample: https://www.falowen.app/books/a1/sample

Book buyers can use their Falowen login or register a free book-only Firebase Auth account. Buying the PDF does not grant tuition, classes, tutor, mocks or authenticated Course Book audio access.

## Release files

The validated editorial manuscript is in artifacts/course-material-bundles/A1/Falowen-A1-Course-Materials.pdf.

Generate new release candidates from a validated 250-page manuscript with:

    node scripts/course-material-bundles/prepareA1BookEditions.mjs

The script creates Falowen-A1-Free-Day1-Sample.pdf (a 14-page excerpt of the actual Day 1 grammar and workbook, with free-sample cover and closing purchase page) and Falowen-A1-Retail-Edition-PRIVATE.pdf (250 pages, with a new cover that replaces the original "Editorial review copy - not for sale").

Do not sell the original editorial manuscript or the retail candidate until the content licensing review and secure payment/download checks are finished.

### Public GitHub Actions security

The course-material-bundle workflow now uploads only the free sample for A1, never the complete paid manuscript or private retail PDF. Its A1 failure upload is restricted to render-diagnostics.json. The A2/B1/B2/C1 PDF publication behavior is unchanged.

**Older A1 full-PDF Actions artifacts remain accessible unless manually deleted.** The code change does not retroactively remove them. Remove them before accepting payments. Future A1 full PDF review must take place through a private workflow/storage path, not a public artifact.

## Private Cloudflare R2 delivery

Use Cloudflare R2 and the existing Falowen backend, not Vercel deployment storage and not a new Vercel project.

1. Create a separate private R2 bucket such as falowen-books-private in the same Cloudflare account. Do not enable an r2.dev public URL or a public custom domain; the entire paid bucket must stay private.
2. Upload only the commercially approved 250-page retail file to the exact object key: books/private/falowen-a1-grammar-workbook-v1.pdf. Set content-type application/pdf, and ideally Content-Disposition attachment with the filename Falowen-A1-Grammar-Notes-and-Workbook.pdf.
3. Ensure a book-specific R2 access token has Get/Head Object permission in that bucket. If the existing audio key is limited to another bucket, make a new books key rather than increasing the audio token's privileges.
4. Keep server environment variables private: R2_ACCOUNT_ID (existing), R2_BOOKS_BUCKET (new), R2_BOOKS_ACCESS_KEY_ID and R2_BOOKS_SECRET_ACCESS_KEY (recommended dedicated token), PAYSTACK_SECRET (existing), and FALOWEN_BOOKS_SALES_ENABLED=true (only after all release checks). For compatibility the backend may use existing R2_ACCESS_KEY_ID and R2_SECRET_ACCESS_KEY if a separate books token is absent and the existing credentials can read the books bucket.
5. Test signed HEAD availability and five-minute signed GET downloads for a confirmed buyer. Downloads go directly from private R2, not through a Vercel function streaming 50 MB.
6. Remove the previously published full A1 PDF artifacts from the public GitHub repository.
7. Confirm commercial rights for all third-party images, materials and links. Some Hören QR activities point to authenticated lessons that a standalone book purchase does not unlock.
8. Verify registration, a successful payment, a cancelled payment, Paystack signed webhook retry handling, re-download, unauthorized HTTP 403, invoice/support process and refund policy. Never treat a return from Paystack as proof of purchase.
9. Only then set FALOWEN_BOOKS_SALES_ENABLED=true on the backend. No sales begin by merely deploying the pages.

## Server routes

- GET /books/catalog: public A1 title and server-derived readiness.
- POST /books/checkout: authenticated Paystack payment with a server-enforced GH₵99 base price.
- GET /books/access: authenticated ownership.
- POST /books/download: authenticated private 300-second R2 signed GET URL.
- Shared signed /paystack/webhook: creates bookOrders, bookPurchases and bookEntitlements only. No tuition or mock subscription changes.

The public catalog returns unavailable unless explicitly enabled, Paystack credentials exist, the private R2 bucket is configured and signed HEAD confirms that the file exists. Checkout checks readiness again. All actual book downloads require prior confirmed ownership. R2 signed URLs are bearer tokens and must not be logged or distributed beyond authorized buyers.

Watermarks, automated refunds, physical books, school licences and affiliate commissions are not in this launch.

## Hosting cost guard

Preview deployments are disabled on Falowen, Sedifex and Falowen Admin. The PR stays off main until go-live. A production main-branch merge may still consume Vercel resources. Cloudflare R2 has separate resource usage and pricing, but direct R2 downloads avoid routing the full PDF body through Vercel.
