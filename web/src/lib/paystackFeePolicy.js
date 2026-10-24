export const PAYSTACK_GH_FEE_RATE = 0.0195;
export const PAYSTACK_STUDENT_FEE_SHARE = 0.5;

const roundMoney = (value) => Math.round((Number(value) + Number.EPSILON) * 100) / 100;

export const calculateSharedPaystackFee = (tuitionAmount) => {
  const tuition = roundMoney(Math.max(Number(tuitionAmount) || 0, 0));
  if (!tuition) {
    return {
      tuitionAmount: 0,
      checkoutAmount: 0,
      estimatedPaystackFee: 0,
      studentFeeContribution: 0,
      falowenFeeContribution: 0,
    };
  }

  const checkoutAmount = roundMoney(
    tuition / (1 - PAYSTACK_GH_FEE_RATE * PAYSTACK_STUDENT_FEE_SHARE)
  );
  const estimatedPaystackFee = roundMoney(checkoutAmount * PAYSTACK_GH_FEE_RATE);
  const studentFeeContribution = roundMoney(checkoutAmount - tuition);
  const falowenFeeContribution = roundMoney(
    Math.max(estimatedPaystackFee - studentFeeContribution, 0)
  );

  return {
    tuitionAmount: tuition,
    checkoutAmount,
    estimatedPaystackFee,
    studentFeeContribution,
    falowenFeeContribution,
  };
};
