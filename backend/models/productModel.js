const PRODUCT_CATEGORIES = [
  'Vegetables',
  'Leafy Greens',
  'Grains',
  'Legumes',
  'Fruits',
  'Herbs',
  'Dairy',
];

const PRODUCT_UNITS = ['kg', 'bag', 'crate', 'bunch', 'litre', 'piece'];

function parseNumber(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : NaN;
}

function validateProductInput(payload = {}) {
  const errors = [];

  if (!payload.name || String(payload.name).trim().length < 2) {
    errors.push('Product name must be at least 2 characters.');
  }

  if (!payload.category || !PRODUCT_CATEGORIES.includes(payload.category)) {
    errors.push('Product category is invalid.');
  }

  if (!payload.unit || !PRODUCT_UNITS.includes(payload.unit)) {
    errors.push('Product unit is invalid.');
  }

  if (!payload.location || String(payload.location).trim().length < 2) {
    errors.push('Location is required.');
  }

  const quantity = parseNumber(payload.quantity);
  if (Number.isNaN(quantity) || quantity <= 0) {
    errors.push('Quantity must be greater than 0.');
  }

  const pricePerUnit = parseNumber(payload.pricePerUnit);
  if (Number.isNaN(pricePerUnit) || pricePerUnit <= 0) {
    errors.push('Price per unit must be greater than 0.');
  }

  return errors;
}

function sanitizeProductInput(payload = {}) {
  return {
    name: String(payload.name || '').trim(),
    category: String(payload.category || '').trim(),
    quantity: Number(payload.quantity),
    unit: String(payload.unit || '').trim(),
    pricePerUnit: Number(payload.pricePerUnit),
    location: String(payload.location || '').trim(),
    description: String(payload.description || '').trim(),
    available: payload.available !== false,
  };
}

module.exports = {
  PRODUCT_CATEGORIES,
  PRODUCT_UNITS,
  validateProductInput,
  sanitizeProductInput,
};
