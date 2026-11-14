export function getCurrentSwahiliReview(submission, review) {
  if (!submission || !review) return null;
  if (review.submissionVersion) {
    const timestamp = submission.submittedAt;
    return timestamp && `${timestamp.seconds}:${timestamp.nanoseconds}` === review.submissionVersion
      ? review
      : null;
  }
  const submittedAt = submission.submittedAt?.toMillis?.();
  const reviewedAt = review.reviewedAt?.toMillis?.();
  if (submittedAt && (!reviewedAt || reviewedAt < submittedAt)) return null;
  return review;
}
