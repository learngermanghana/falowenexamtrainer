// Central place to register Paystack plan metadata and price points.
// Update plan codes with values from your Paystack Dashboard (Subscriptions > Plans).

export const PAYMENT_PROVIDER = "Paystack";

export const COURSE_LEVEL_PRICES = [
  { level: "A1", price: 2800 },
  { level: "A2", price: 3000 },
  { level: "B1", price: 3000 },
  { level: "B2", price: 3000 },
];

export const EXAM_PREP_PRICE = 700;

export const PAYSTACK_PLAN_CODES = {
  coursePartial: {
    description: "Part payment — 1 month course access",
    planCode: "REPLACE_WITH_PART_PAYMENT_PLAN_CODE",
  },
  courseFull: {
    description: "Full payment — 6 months course + exams",
    planCode: "REPLACE_WITH_FULL_PAYMENT_PLAN_CODE",
  },
  examMonthly: {
    description: "Exam preparation — monthly automation",
    planCode: "REPLACE_WITH_EXAM_PREP_PLAN_CODE",
  },
};

export const PAYSTACK_GUIDANCE = `
Save Paystack plan codes here so components can import them. 
When you create plans in the Paystack dashboard, copy the plan code (e.g., PLN_abcd1234) 
into the matching entry above.
`;
