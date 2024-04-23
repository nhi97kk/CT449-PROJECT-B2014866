const express = require('express');

const authController = require('../controllers/auth.controller');
const cartController = require('../controllers/cart.controller');

const router = express.Router();

// Only for customer
router.use(authController.protect, authController.restrictTo('customer'));

router.route('/').get(cartController.getCartItems).post(cartController.createCartItem);

router
  .route('/:cartItemId')
  .patch(cartController.updateCartItem)
  .delete(cartController.deleteCartItem);

module.exports = router;

