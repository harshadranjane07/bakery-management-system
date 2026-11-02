const express = require('express');
const router = express.Router();
const {
  createOrder,
  getCustomerOrders,
  getAllOrders,
  getOrderById,
  updateOrderStatus
} = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');

// Customer routes
router.post('/', protect, createOrder);
router.get('/my-orders', protect, getCustomerOrders);

// Admin routes
router.get('/', protect, adminOnly, getAllOrders);
router.put('/:id/status', protect, adminOnly, updateOrderStatus);

// Shared route (Customer owner or Admin)
router.get('/:id', protect, getOrderById);

module.exports = router;
