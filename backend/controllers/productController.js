const { mutateStore, readStore } = require('../config/store');
const {
  PRODUCT_CATEGORIES,
  PRODUCT_UNITS,
  sanitizeProductInput,
  validateProductInput,
} = require('../models/productModel');
const { sanitizeUser } = require('../models/userModel');

function createId(prefix) {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

function attachSeller(product, users) {
  const seller = users.find((user) => user.id === product.sellerId);
  return {
    ...product,
    seller: seller ? sanitizeUser(seller) : null,
  };
}

async function getCatalogMetadata(req, res) {
  return res.json({
    categories: PRODUCT_CATEGORIES,
    units: PRODUCT_UNITS,
  });
}

async function listProducts(req, res) {
  const store = await readStore();
  const search = String(req.query.search || '').trim().toLowerCase();
  const category = String(req.query.category || '').trim();
  const location = String(req.query.location || '').trim().toLowerCase();
  const sellerId = String(req.query.sellerId || '').trim();

  const products = store.products
    .filter((product) => product.available)
    .filter((product) => !category || product.category === category)
    .filter((product) => !sellerId || product.sellerId === sellerId)
    .filter((product) => !location || product.location.toLowerCase().includes(location))
    .filter((product) => {
      if (!search) {
        return true;
      }

      return [product.name, product.description, product.location, product.category]
        .join(' ')
        .toLowerCase()
        .includes(search);
    })
    .sort((left, right) => new Date(right.createdAt) - new Date(left.createdAt))
    .map((product) => attachSeller(product, store.users));

  return res.json({ products, count: products.length });
}

async function createProduct(req, res) {
  if (req.user.role !== 'farmer') {
    return res.status(403).json({ message: 'Only farmers can create listings.' });
  }

  const errors = validateProductInput(req.body);
  if (errors.length > 0) {
    return res.status(400).json({ message: 'Validation failed.', errors });
  }

  const productInput = sanitizeProductInput(req.body);
  const now = new Date().toISOString();

  const response = await mutateStore(async (store) => {
    const product = {
      id: createId('product'),
      sellerId: req.user.id,
      ...productInput,
      createdAt: now,
      updatedAt: now,
    };

    store.products.push(product);

    return {
      status: 201,
      body: { product: attachSeller(product, store.users) },
    };
  });

  return res.status(response.status).json(response.body);
}

async function updateProduct(req, res) {
  const errors = validateProductInput(req.body);
  if (errors.length > 0) {
    return res.status(400).json({ message: 'Validation failed.', errors });
  }

  const productInput = sanitizeProductInput(req.body);

  const response = await mutateStore(async (store) => {
    const product = store.products.find((candidate) => candidate.id === req.params.productId);

    if (!product) {
      return { status: 404, body: { message: 'Product not found.' } };
    }

    if (product.sellerId !== req.user.id) {
      return { status: 403, body: { message: 'You can only edit your own listings.' } };
    }

    Object.assign(product, productInput, { updatedAt: new Date().toISOString() });

    return {
      status: 200,
      body: { product: attachSeller(product, store.users) },
    };
  });

  return res.status(response.status).json(response.body);
}

async function deleteProduct(req, res) {
  const response = await mutateStore(async (store) => {
    const productIndex = store.products.findIndex((candidate) => candidate.id === req.params.productId);

    if (productIndex === -1) {
      return { status: 404, body: { message: 'Product not found.' } };
    }

    const product = store.products[productIndex];

    if (product.sellerId !== req.user.id) {
      return { status: 403, body: { message: 'You can only remove your own listings.' } };
    }

    store.products.splice(productIndex, 1);
    return { status: 204, body: null };
  });

  if (response.status === 204) {
    return res.status(204).send();
  }

  return res.status(response.status).json(response.body);
}

module.exports = {
  getCatalogMetadata,
  listProducts,
  createProduct,
  updateProduct,
  deleteProduct,
};
