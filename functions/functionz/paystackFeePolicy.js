// Falowen payment policy: students and Falowen share the estimated Paystack fee equally.
const PAYSTACK_GH_FEE_RATE = 0.0195;
const PAYSTACK_STUDENT_FEE_SHARE = 0.5;

const roundMoney = (value) => Math.round((Number(value) + Number.EPSILON) * 100) / 100;

const calculateSharedPaystackFee = (tuitionAmount) => {
  const tuition = roundMoney(Math.max(Number(tuitionAmount) || 0, 0));
  if (!tuition) {
    return {
      tuitionAmount: 0,
      checkoutAmount: 0,
      estimatedPaystackFee: 0,
      studentFeeContribution: 0,
      falowenFeeContribution: 0,
      feeRate: PAYSTACK_GH_FEE_RATE,
      studentShareRate: PAYSTACK_STUDENT_FEE_SHARE,
    };
  }

  // Paystack charges its percentage on the full checkout amount. Solving
  // checkout - tuition = studentShare * feeRate * checkout ensures the
  // student contributes exactly half of the estimated transaction fee.
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
    feeRate: PAYSTACK_GH_FEE_RATE,
    studentShareRate: PAYSTACK_STUDENT_FEE_SHARE,
  };
};

module.exports = {
  PAYSTACK_GH_FEE_RATE,
  PAYSTACK_STUDENT_FEE_SHARE,
  calculateSharedPaystackFee,
};
