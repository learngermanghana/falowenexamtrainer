"use strict";

// Retail benchmark supplied by the Academy: 250 printed A1 pages cost GH₵660
// and retail at GH₵800, excluding delivery. Do not infer a printer quote
// for another format, cover or binding: this is an estimated retail schedule.
const A1_PRINT_BENCHMARK = Object.freeze({
  pages: 250, printerCostGhs: 660, retailPriceGhs: 800,
});
const PRINT_ROUNDING_GHS = 50;

function pricePrintedGuide(pages) {
  if (!Number.isInteger(pages) || pages < 1 || pages > 1500)
    throw new RangeError("Printed book page count must be 1–1500");
  const proportionalRetail = pages * A1_PRINT_BENCHMARK.retailPriceGhs / A1_PRINT_BENCHMARK.pages;
  return Math.ceil(proportionalRetail / PRINT_ROUNDING_GHS) * PRINT_ROUNDING_GHS;
}

// Small downloadable exam guides are priced by editorial scope rather than
// pretending PDF page count incurs the same cost as a printed book.
// The existing 32-page Writing Skills PDF is GH₵39, full A1 PDF GH₵99.
function priceDigitalExamGuide({ skills }) {
  if (!Number.isInteger(skills) || skills < 1 || skills > 4)
    throw new RangeError("Guide skills must be 1–4");
  return skills === 1 ? 29 : 39;
}

module.exports = { A1_PRINT_BENCHMARK, PRINT_ROUNDING_GHS,
  pricePrintedGuide, priceDigitalExamGuide };
