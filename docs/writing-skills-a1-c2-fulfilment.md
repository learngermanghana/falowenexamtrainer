# Writing Skills A1–C2: manual delivery and R2 release checklist

Current verified editorial asset: `Falowen-German-Writing-Skills-A1-C2-Expanded-2026.pdf`, 68 pages, SHA-256 `9c26bd008175554260fdd507315394ec02daaabeaa1239c6e2602093859d498e`.

## Current state (7 November 2026)
- The writing guide is sold in digital edition at **GH₵39**.
- Manual fulfilment was established in the original publication plan. **The full PDF was not uploaded into the private `falowen-books-private` R2 bucket.** Its existence in a private ChatGPT file library is not an R2 upload.
- The current `DIGITAL_BOOK_OBJECTS` allowlist has no writing-guide mapping. A Paystack receipt alone therefore does not produce a secure PDF download for this SKU.
- A manual customer email with the exact verified file is the immediate fulfilment path; the verified 68-page edition was emailed to the first buyer on 7 November 2026. Record completion against the paid order through an authorized administration process; never guess fulfillment state or publish an unrestricted file link.
- New printed edition uses the existing 250-page benchmark pricing helper: 68 pages → **GH₵250**; this is an *estimated retail schedule* and should be validated against the chosen print shop before offering broad print fulfilment. Delivery is charged separately.

## To enable self-service automatic downloads (separate gated release)
1. Upload the approved PDF directly to **private bucket `falowen-books-private`** under `book/Falowen-German-Writing-Skills-A1-C2-Expanded-2026.pdf`. This is a **proposed destination**, not a claimed existing object.
2. Confirm object existence, 68-page content and SHA-256 checksum; keep the bucket private and do **not** commit the full file under `web/public`.
3. Add the exact verified key and SKU `writing-skills-a1-c2-digital` to `DIGITAL_BOOK_OBJECTS`, with a test requiring a paid order and secret lookup key.
4. Ensure the Firebase API is bound to the book-specific private R2 credentials and `FALOWEN_BOOK_DIGITAL_DELIVERY_ENABLED=true` only after protected downloading works in production.
5. Verify real paid checkout receipt, receipt-page download, successful PDF fetch, expiry, wrong-key rejection, cross-book denial, printed-order denial and duplicate-payment safety before declaring delivery automatic.
6. Add an operator-visible fulfillment queue or notification for any digital products still using manual email delivery, and require an explicit recorded `fulfilled` state; do not rely on Paystack's merchant receipt to notify the buyer.

## Related code
- `functions/functionz/bookCommerce.js` — products, receipt, Paystack verification and manual/digital delivery modes.
- `functions/functionz/privateBookDelivery.js` — private R2 allowlist and signed download.
- `web/src/components/BookProductPage.jsx` and `BookStoreCheckout.js` — edition pricing and clear manual-delivery disclosure.

Do **not** store customer names, payment references, receipt lookup keys, or payment URLs in this public repository.
