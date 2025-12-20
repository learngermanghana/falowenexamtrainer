export const LEVEL_FEES = {
  // Customize each CEFR level's tuition here.
  // These amounts are used at signup to set the student's tuitionFee and balance.
  A1: 2800,
  A2: 3000,
  B1: 3000,
  B2: 3000,
};

export const getTuitionFeeForLevel = (level) => LEVEL_FEES[level] ?? 0;
