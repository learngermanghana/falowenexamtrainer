# Falowen A1 book payment checkout (phase 1)

This adds a separate book-payment checkout to the **existing** Falowen frontend and Firebase/Paystack backend. No separate Vercel project, PDF distribution, printing, or shipping integration is created.

## Routes
- `https://www.falowen.app/books` — public catalog and Paystack checkout
- `https://www.falowen.app/books/complete` — return and verified payment status
- `GET /books/catalog`, `POST /books/checkout`, `GET /books/order` — Firebase API

## Book prices
- A1 digital PDF: **GH₵99 total**
- A1 printed (on demand): **GH₵800 total**, delivery billed separately
- Paystack processing fee for book orders is absorbed by Falowen; book buyers see the advertised total. Tuition and mock exam fee policy stays unchanged.

## Safe launch gate
Book checkout is **OFF by default**. The initial fulfilment process is manual, using Paystack's customer receipt and verified transaction reference. To enable it after final PDF review, configure `FALOWEN_BOOK_PAYMENTS_ENABLED=true` in the deployed Firebase Functions environment. The existing `PAYSTACK_SECRET` is used by the shared backend. Do not add payment secrets to the browser, Git repository, or Vercel frontend.

The public book page displays editions/prices while checkout is disabled. On production API deployment, the release workflow verifies that the receipt-verification API is live and both prices are correct, then sets `FALOWEN_BOOK_PAYMENTS_ENABLED=true` in the existing Cloud Run service. If deployment or those checks fail, book payments stay off. To suspend payments, set the same Cloud Run environment variable to `false` and review the release workflow before the next deployment.

## Verified payment flow
1. Buyer enters name, email, phone and selects an edition.
2. Server fixes product and price, initializes Paystack, and stores a pending Firestore `bookOrders` record.
3. Paystack redirects to the book confirmation page with a private order lookup link.
4. **Only the existing signed** `POST /paystack/webhook` handler can mark orders paid; client redirects cannot do so.
5. The book webhook verifies reference, email, amount, currency, book, and customer against the server-created order. Firestore transactions ensure duplicate webhook retries do not record another payment.
6. `bookPayments` is an independent collection; no tuition balance, course enrollment, or exam subscription is changed.

The status page verifies the private order key before showing the order status. It also offers a **Verify with Paystack** action and displays the Paystack transaction reference after a private token check. Confirmation calls `GET /transaction/verify/:reference` from the backend, comparing currency, amount, reference, email, product, and order ID before recording payment. The verification endpoint rate-limits checks for the same order to once every 30 seconds.

## Manual Paystack receipt fulfilment
1. Buyer pays through the book checkout. If customer receipt email is enabled in Paystack Dashboard, Paystack emails the buyer the official transaction receipt.
2. The buyer returns to `/books/complete`, where Falowen verifies the transaction with Paystack server-to-server and displays the order ID and Paystack reference. A return link or screenshot alone never marks a payment paid.
3. The buyer can copy the order/reference details. If confirmation is delayed, use **Verify with Paystack** later; do not purchase again while a debit is being investigated.
4. Falowen checks the unique reference in **Paystack Dashboard → Transactions**, matching the successful status and GH₵99/GH₵800 amount to the book edition and customer email. Paystack metadata now labels the product and edition.
5. Falowen manually fulfils the digital PDF or arranges print-on-demand, using the verified order/receipt. Delivery cost is separate for print orders. Avoid public download links.
6. Paystack Dashboard → Settings → Preferences: enable **customer transaction receipts** and optionally **merchant email notifications**, and configure a valid business support email for buyers.

No automated PDF delivery, admin tracking, or printing workflow is included.

## Release checklist
- [ ] Review final A1 PDF quality and distribution rights.
- [ ] Confirm buyer support contact and fulfilment/refund policy.
- [ ] Turn on Paystack customer email receipts and merchant receipt notifications in Dashboard.
- [ ] Use Paystack test credentials in a non-production Functions environment; verify valid and invalid webhooks and retries.
- [ ] Check buyer return works on mobile (success, pending, declined).
- [ ] Check the activation step in the Firebase API deployment and confirm `GET /books/catalog` reports `paymentsEnabled: true`.
- [ ] Test one end-to-end live Paystack receipt and confirm the Paystack Dashboard reference matches the Falowen order.
- [ ] Add PDF access, admin fulfillment, and delivery integration as separate follow-up work.
