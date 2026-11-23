// Billing stays visible for paid learners (history and receipts), but checkout
// must only be offered when there is a real, unpaid tuition balance.
export const shouldOfferTuitionPayment = ({ balanceDue, paymentCleared = false } = {}) => {
  const amount = Number(balanceDue);
  return balanceDue != null && Number.isFinite(amount) && amount > 0 && !paymentCleared;
};
