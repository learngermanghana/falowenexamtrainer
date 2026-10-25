"use strict";

// Original printer quotation: 250 A1 pages cost GHS 660, sell at GHS 800.
// Estimates exclude new binding quotes, delivery, packaging and payment fees.
// Do NOT enable a SKU automatically from this estimate.
const A1_PRINT_BENCHMARK = Object.freeze({ pages: 250, quotedPrintCostGhs: 660, retailGhs: 800 });
const currency = n => Math.round((n + Number.EPSILON) * 100) / 100;
const estimatePrintedBookPrice = (pages, { roundingStepGhs = 50 } = {}) => {
  if (!Number.isInteger(pages) || pages < 1 || pages > 1500)
    throw new Error("Printed book pages must be an integer from 1 to 1500.");
  if (!Number.isInteger(roundingStepGhs) || roundingStepGhs < 1 || roundingStepGhs > 100)
    throw new Error("Invalid price rounding step.");
  const printingPerPageGhs = A1_PRINT_BENCHMARK.quotedPrintCostGhs / A1_PRINT_BENCHMARK.pages;
  const sellingPerPageGhs = A1_PRINT_BENCHMARK.retailGhs / A1_PRINT_BENCHMARK.pages;
  const estimatedCostGhs = currency(pages * printingPerPageGhs);
  const rawRetailGhs = currency(pages * sellingPerPageGhs);
  const suggestedRetailGhs = Math.ceil(rawRetailGhs / roundingStepGhs) * roundingStepGhs;
  return Object.freeze({
    pages, printingPerPageGhs, sellingPerPageGhs, estimatedCostGhs, rawRetailGhs,
    suggestedRetailGhs,
    estimatedGrossProfitGhs: currency(suggestedRetailGhs - estimatedCostGhs),
    requiresPrinterQuote: true,
  });
};
module.exports = { A1_PRINT_BENCHMARK, estimatePrintedBookPrice };
