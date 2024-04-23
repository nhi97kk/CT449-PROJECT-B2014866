const express = require('express');

const orderController = require('../controllers/order.controller');
const authController = require('../controllers/auth.controller');

const router = express.Router();

// Protect routes
router.use(authController.protect);

router.get('/', orderController.getAllOrders);
router.get('/:orderId', orderController.getOrder);

// Only admin and staff can update order status
router
  .route('/:orderId')
  .patch(
    authController.restrictTo('admin', 'staff'),
    orderController.updateOrderStatus,
  )
  .delete(orderController.cancelOrder);

// Only customer
router.use(authController.restrictTo('customer'));

router.post('/', orderController.createOrder);
router
  .route('/:orderId')
  .post(orderController.deliverOrder)
  .delete(orderController.cancelOrder);

module.exports = router;

