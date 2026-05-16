const { readStore } = require('../config/store');
const { sanitizeUser } = require('../models/userModel');

async function getDashboard(req, res) {
  const store = await readStore();
  const user = sanitizeUser(req.user);

  const listings = store.products.filter((product) => product.sellerId === req.user.id);
  const orders =
    req.user.role === 'farmer'
      ? store.orders.filter((order) => order.sellerId === req.user.id)
      : store.orders.filter((order) => order.buyerId === req.user.id);
  const conversations = store.messages.filter((message) => message.participants.includes(req.user.id));

  const pendingOrders = orders.filter((order) => order.status === 'pending').length;
  const completedOrders = orders.filter((order) => order.status === 'completed').length;
  const confirmedOrders = orders.filter((order) => order.status === 'confirmed').length;
  const totalSales = orders
    .filter((order) => ['confirmed', 'completed'].includes(order.status))
    .reduce((sum, order) => sum + order.totalAmount, 0);

  return res.json({
    user,
    stats: {
      listings: listings.length,
      pendingOrders,
      confirmedOrders,
      completedOrders,
      totalSales,
      conversations: new Set(conversations.map((message) => message.conversationId)).size,
    },
    listings,
    orders: orders.sort((left, right) => new Date(right.createdAt) - new Date(left.createdAt)),
  });
}

module.exports = {
  getDashboard,
};
