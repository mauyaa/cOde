const ORDER_STATUSES = ['pending', 'confirmed', 'completed', 'cancelled'];
const PAYMENT_METHODS = ['M-Pesa', 'Cash', 'Bank Transfer'];

function validateOrderInput(payload = {}) {
  const quantity = Number(payload.quantity);
  const errors = [];

  if (!payload.productId) {
    errors.push('Product is required.');
  }

  if (!Number.isFinite(quantity) || quantity <= 0) {
    errors.push('Order quantity must be greater than 0.');
  }

  if (!payload.paymentMethod || !PAYMENT_METHODS.includes(payload.paymentMethod)) {
    errors.push('Payment method is invalid.');
  }

  return errors;
}

module.exports = {
  ORDER_STATUSES,
  PAYMENT_METHODS,
  validateOrderInput,
};
