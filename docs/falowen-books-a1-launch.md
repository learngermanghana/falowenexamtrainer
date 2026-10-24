# Falowen Books — A1 commercial launch

**First product:** Falowen A1 Grammar Notes & Workbook, 250-page October 2026 edition, GH₵99 plus the existing split Paystack processing fee.

## Customer pages
- Public catalogue: https://www.falowen.app/books
- A1 product and owned-book library: https://www.falowen.app/books/a1
- Free interactive HTML excerpt of Day 1: https://www.falowen.app/books/a1/sample

The free sample is not the full PDF. The 250-page book is never bundled into the public website.

## Required before accepting real payments

Sales fail closed on deployment; they remain OFF until the private book is uploaded and explicitly activated.

1. Check commercial resale rights for every photograph, teaching extract and illustration. Audio QR links lead to authenticated Falowen lessons and are not included in a PDF-only purchase.
2. Create a private Google Cloud Storage bucket with Public Access Prevention and no anonymous object reads.
3. Upload the reviewed 250-page PDF to the exact private object key books/private/falowen-a1-grammar-workbook-v1.pdf. Use the Google Cloud console or a privileged upload method, never the public repository.
4. Configure the function service identity to check the file and sign V4 Cloud Storage download URLs; test one five-minute private signed download. Service account IAM signing permissions may need setup.
5. Delete publicly downloadable full A1 PDF artifacts from this public GitHub repository and other public copies. Stop future public full-book artifact publication before opening sales. The current workflow is unchanged for quality assurance, so this is a mandatory separate go-live task.
6. Verify Paystack live credentials, signed webhook processing, failed and successful payments, and an authenticated buyer who gets their own PDF. Unpaid downloads must return 403.
7. Configure the existing server-side PAYSTACK_SECRET and add FALOWEN_BOOKS_PRIVATE_BUCKET with your private GCS bucket name.
8. Only when all previous steps pass set FALOWEN_BOOKS_SALES_ENABLED=true in the deployed backend environment. Never put these server values in a public React environment or GitHub source.

## Isolated book routes

- GET /books/catalog: one public A1 book and availability; OFF unless private delivery is ready.
- POST /books/checkout: requires Firebase ID token; server-enforced price GH₵99, Paystack checkout, no sale without the private PDF.
- GET /books/access: requires Firebase ID token and a signed-payment-created entitlement.
- POST /books/download: requires Firebase ID token and ownership; short private Cloud Storage signed URL.
- Shared /paystack/webhook: signed book_pdf events only write bookOrders, bookPurchases and bookEntitlements, not tuition/trial or mock subscriptions.

Book-only accounts can register with Firebase Auth without enrolling in a class. Existing Falowen accounts work too.

Before promotion, test an existing learner, a new book-only user, failed payment, webhook replay, second download, unauthenticated download, invoice/support and refunds. Affiliate payouts, watermarks, audio access and school licence automation are not included yet.

No changes to A2 or B1 workbook content or printing pipelines.
