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
Book checkout is **OFF by default**. To enable it after agreeing a fulfilment process and verifying the PDF, configure `FALOWEN_BOOK_PAYMENTS_ENABLED=true` in the deployed Firebase Functions environment. The existing `PAYSTACK_SECRET` is used by the shared backend. Do not add payment secrets to the browser, Git repository, or Vercel frontend.

The public book page still displays editions/prices while checkout is disabled. Never switch payments on until there is a reliable process for fulfilling paid orders and contacting buyers.

## Verified payment flow
1. Buyer enters name, email, phone and selects an edition.
2. Server fixes product and price, initializes Paystack, and stores a pending Firestore `bookOrders` record.
3. Paystack redirects to the book confirmation page with a private order lookup link.
4. **Only the existing signed** `POST /paystack/webhook` handler can mark orders paid; client redirects cannot do so.
5. The book webhook verifies reference, email, amount, currency, book, and customer against the server-created order. Firestore transactions ensure duplicate webhook retries do not record another payment.
6. `bookPayments` is an independent collection; no tuition balance, course enrollment, or exam subscription is changed.

The status page verifies the private order key before showing the order status. No customer directory, PDF link, printed fulfillment, delivery tracking, or automatic download is exposed in this phase.

## Release checklist
- [ ] Review final A1 PDF quality and distribution rights.
- [ ] Confirm buyer support contact and fulfilment/refund policy.
- [ ] Use Paystack test credentials in a non-production Functions environment; verify valid and invalid webhooks and retries.
- [ ] Check buyer return works on mobile (success, pending, declined).
- [ ] Configure the enable flag only when fulfilment is operational.
- [ ] Add PDF access, admin fulfillment, and delivery integration as separate follow-up work.
