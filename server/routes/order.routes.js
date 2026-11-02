const express = require('express');
const {
  createOrder,
  getUserOrders,
  getOrderById,
  updateOrderStatus,
  getAllOrders
} = require('../controllers/order.controller');
const { protect } = require('../middleware/auth.middleware');

const router = express.Router();

// All order routes require authentication
router.use(protect);

// User routes
router.post('/', createOrder);
router.get('/', getUserOrders);
router.get('/:id', getOrderById);

// Admin routes (you might want to add admin middleware)
router.get('/admin/all', getAllOrders);
router.put('/:id/status', updateOrderStatus);

module.exports = router;