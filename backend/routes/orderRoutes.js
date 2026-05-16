const express = require('express');
const {
  createOrder,
  listOrders,
  updateOrderStatus,
} = require('../controllers/orderController');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

router.use(requireAuth);
router.get('/', listOrders);
router.post('/', createOrder);
router.patch('/:orderId/status', updateOrderStatus);

module.exports = router;
