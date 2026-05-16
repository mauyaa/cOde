const { mutateStore, readStore } = require('../config/store');
const { ORDER_STATUSES, validateOrderInput } = require('../models/orderModel');
const { sanitizeUser } = require('../models/userModel');

function createId(prefix) {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

function attachOrderRelations(order, store) {
  return {
    ...order,
    product: store.products.find((product) => product.id === order.productId) || null,
    buyer: sanitizeUser(store.users.find((user) => user.id === order.buyerId)),
    seller: sanitizeUser(store.users.find((user) => user.id === order.sellerId)),
  };
}

async function listOrders(req, res) {
  const store = await readStore();
  const orders = store.orders
    .filter((order) =>
      req.user.role === 'farmer' ? order.sellerId === req.user.id : order.buyerId === req.user.id
    )
    .sort((left, right) => new Date(right.createdAt) - new Date(left.createdAt))
    .map((order) => attachOrderRelations(order, store));

  return res.json({ orders });
}

async function createOrder(req, res) {
  if (req.user.role !== 'buyer') {
    return res.status(403).json({ message: 'Only buyers can place orders.' });
  }

  const errors = validateOrderInput(req.body);
  if (errors.length > 0) {
    return res.status(400).json({ message: 'Validation failed.', errors });
  }

  const response = await mutateStore(async (store) => {
    const product = store.products.find((candidate) => candidate.id === req.body.productId);

    if (!product || !product.available) {
      return { status: 404, body: { message: 'Product is not available.' } };
    }

    if (product.sellerId === req.user.id) {
      return { status: 400, body: { message: 'You cannot order your own listing.' } };
    }

    const quantity = Number(req.body.quantity);
    if (quantity > product.quantity) {
      return {
        status: 400,
        body: { message: `Only ${product.quantity} ${product.unit} are currently available.` },
      };
    }

    const now = new Date().toISOString();
    const order = {
      id: createId('order'),
      productId: product.id,
      buyerId: req.user.id,
      sellerId: product.sellerId,
      quantity,
      totalAmount: quantity * product.pricePerUnit,
      paymentMethod: req.body.paymentMethod,
      status: 'pending',
      note: String(req.body.note || '').trim(),
      createdAt: now,
      updatedAt: now,
    };

    store.orders.push(order);

    return { status: 201, body: { order: attachOrderRelations(order, store) } };
  });

  return res.status(response.status).json(response.body);
}

async function updateOrderStatus(req, res) {
  const nextStatus = String(req.body.status || '').trim();

  if (!ORDER_STATUSES.includes(nextStatus)) {
    return res.status(400).json({ message: 'Order status is invalid.' });
  }

  const response = await mutateStore(async (store) => {
    const order = store.orders.find((candidate) => candidate.id === req.params.orderId);

    if (!order) {
      return { status: 404, body: { message: 'Order not found.' } };
    }

    const isSeller = order.sellerId === req.user.id;
    const isBuyer = order.buyerId === req.user.id;

    if (!isSeller && !isBuyer) {
      return { status: 403, body: { message: 'You cannot update this order.' } };
    }

    if (['confirmed', 'completed'].includes(nextStatus) && !isSeller) {
      return {
        status: 403,
        body: { message: 'Only the farmer can confirm or complete this order.' },
      };
    }

    order.status = nextStatus;
    order.updatedAt = new Date().toISOString();

    if (nextStatus === 'completed') {
      const product = store.products.find((candidate) => candidate.id === order.productId);
      if (product) {
        product.quantity = Math.max(product.quantity - order.quantity, 0);
        product.available = product.quantity > 0;
        product.updatedAt = new Date().toISOString();
      }
    }

    return { status: 200, body: { order: attachOrderRelations(order, store) } };
  });

  return res.status(response.status).json(response.body);
}

module.exports = {
  listOrders,
  createOrder,
  updateOrderStatus,
};
