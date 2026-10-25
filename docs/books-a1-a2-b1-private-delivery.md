# Falowen Books: A1, A2, B1 exam guide private R2 delivery

## Confirmed upload locations (Cloudflare dashboard references)
Private bucket: `falowen-books-private` (public access OFF), folder **`book/`** (singular).

| Digital exam-guide edition | Private object key |
| --- | --- |
| A1 Writing Model Exams (30 pages) | `book/Falowen_A1_Writing_Exam_Guide_Fresh.pdf` |
| A2 Four-Skills Guide (50 pages) | `book/Falowen_A2_Exam_Guide_Fresh.pdf` |
| B1 Four-Skills Guide (50 pages) | `book/Falowen_B1_Guide.pdf` |

These exact keys are in `functions/functionz/privateBookDelivery.js`. The server
never accepts an arbitrary R2 object key from the buyer; it only signs an
allowlisted item paid for in their order.

The B1 book has been redesigned for readable white-background printing, but
editorial rights and factual accuracy are not automatically approved by an
upload. All three titles remain **coming_soon** and cannot be purchased yet.

## Release-safe controls

1. Private R2 access: create a **bucket-scoped, read-only object token**
   restricted to `falowen-books-private` only. Do not reuse course audio or
   admin-wide R2 keys. Leave R2.dev and public bucket domains disabled.
2. Provision these Firebase Functions Secret Manager keys in the **Falowen
   Firebase project**, not in the Vercel frontend (do not share values in a
   chat, GitHub commit or Actions logs):
   `R2_BOOKS_ACCOUNT_ID`, `R2_BOOKS_BUCKET`,
   `R2_BOOKS_ACCESS_KEY_ID`, `R2_BOOKS_SECRET_ACCESS_KEY`.
   Set bucket value to `falowen-books-private`. All four are bound to
   `exports.api` in `functions/index.js` and must exist before deployment.
3. The kill switch `FALOWEN_BOOK_DIGITAL_DELIVERY_ENABLED` defaults off
   (anything except exact `true` returns HTTP 503).
   Do not set to `true` until verified payment, delivery, and cross-book
   denial tests pass in the deployed environment.
4. Each GET signature expires in **90 seconds**. Signature is issued only
   after checking the 48-character receipt lookup secret, paid order,
   independent paid receipt, amount, Paystack reference, and exact purchased
   digital SKU. Printed-book purchases cannot download PDFs. `/books/download`
   never exposes the bucket contents, R2 credentials or permanent URL.
5. For launch, create approved server-side digital SKUs and agreed GHS prices
   separately; do **not** automatically turn the uploaded guide IDs into
   purchasable products. Verify retail rights, audio disclosure and updated
   exam claims first. Keep receipts private and ensure customers receive only
   the digital edition they purchased.
6. Test first on a real, authorised low-cost Paystack purchase (or a properly
   isolated non-production environment): paid receipt allows signed download;
   pending/missing/other book/wrong lookup key/printed-order requests are
   rejected; R2 object returns the correct PDF before expiry; link expires;
   old A1/book payment flows still work. Run
   `node --test functions/functionz/privateBookDelivery.test.js
   functions/__tests__/bookCommerce.test.js`.

**Deployment warning:** The function secret bindings require prior
configuration. Do not deploy this branch to production, merge it, or activate
paid book SKUs before that configuration and paid end-to-end validation.
There is no new Vercel blob store or public file hosting cost.
