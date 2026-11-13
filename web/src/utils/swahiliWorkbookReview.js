export function getCurrentSwahiliReview(submission, review) {
  if (!submission || !review) return null;
  const submittedAt = submission.submittedAt?.toMillis?.();
  const reviewedAt = review.reviewedAt?.toMillis?.();
  if (submittedAt && (!reviewedAt || reviewedAt < submittedAt)) return null;
  return review;
}
