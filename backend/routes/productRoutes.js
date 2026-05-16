const express = require('express');
const {
  createProduct,
  deleteProduct,
  getCatalogMetadata,
  listProducts,
  updateProduct,
} = require('../controllers/productController');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

router.get('/meta', getCatalogMetadata);
router.get('/', listProducts);
router.post('/', requireAuth, createProduct);
router.put('/:productId', requireAuth, updateProduct);
router.delete('/:productId', requireAuth, deleteProduct);

module.exports = router;
