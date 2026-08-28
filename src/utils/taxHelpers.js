function calculateNetAmount(amount, tax) {
  let net = amount / (1 + tax / 100);
  return net;
}

function calculateFinalAmount(amount, tax) {
  let finalAmount = amount * (1 + tax / 100);
  return roundOfNumber(finalAmount);
}

function calculateTax(amount, tax) {
  return (amount * tax) / 100;
}

function percentageDifference(val1, val2) {
  return ((val2 - val1) / val1) * 100;
}

function calculateDiscountedAmount(amount, discount) {
  return amount * (discount / 100);
}

function roundOfNumber(num) {
  num = num * 100;
  num = Math.round(num);
  return num / 100;
}

function applyDiscounts(amount, discounts) {
  let finalAmount = amount;
  let discountDetails = [];
  discounts.forEach((discount) => {
    let discountAmount = finalAmount * (discount.amount / 100);
    finalAmount -= discountAmount;
    discountDetails.push({
      ...discount,
      discountAmount: discountAmount,
    });
  });

  return {
    finalAmount: finalAmount,
    discountDetails: discountDetails,
  };
}

function calculateUnitPrice(amount, tax) {
  let unit = amount / (1 + tax / 100);
  return unit;
}

function calculateNetPrice(amount, tax) {
  let net = amount * (1 + tax / 100);
  return roundOfNumber(net);
}

function getTotalTaxPercentage(taxes = []) {
  return taxes.reduce((sum, tax) => sum + (tax.taxRatePercentage || 0), 0);
}

function calculateServiceAmount(service) {
  const { price, taxes, includesTax } = service;

  const totalTaxPercentage = getTotalTaxPercentage(taxes);

  let netAmount = price;
  let taxAmount = 0;
  let finalAmount = price;

  if (!includesTax && totalTaxPercentage > 0) {
    taxAmount = calculateTax(price, totalTaxPercentage);
    finalAmount = calculateFinalAmount(price, totalTaxPercentage);
  }

  return {
    netAmount: roundOfNumber(netAmount),
    taxPercentage: totalTaxPercentage,
    taxAmount: roundOfNumber(taxAmount),
    finalAmount,
  };
}

export {
  calculateNetAmount,
  calculateFinalAmount,
  calculateTax,
  percentageDifference,
  calculateDiscountedAmount,
  roundOfNumber,
  applyDiscounts,
  calculateUnitPrice,
  calculateNetPrice,
  getTotalTaxPercentage,
  calculateServiceAmount,
};
