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
