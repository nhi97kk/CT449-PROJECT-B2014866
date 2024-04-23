const mongoose = require('mongoose');

const { cartMessage } = require('../languages/index.js');

const cartSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, cartMessage.requiredUser],
  },
  product: {
    type: mongoose.Schema.ObjectId,
    ref: 'Product',
    required: [true, cartMessage.requiredProduct],
  },
  quantity: {
    type: Number,
    required: [true, cartMessage.requiredQuantity],
    min: [1, cartMessage.minQuantity],
  },
});

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;

