const mongoose = require('mongoose');

const {
  orderItemMessage,
  statusMessage,
  orderMessage,
} = require('../languages');

const orderItemSchema = mongoose.Schema({
  product: {
    type: mongoose.Schema.ObjectId,
    ref: 'Product',
    required: [true, orderItemMessage.requiredProduct],
  },
  quantity: {
    type: Number,
    required: [true, orderItemMessage.requiredQuantity],
    min: [1, orderItemMessage.minQuantity],
  },
  price: {
    type: Number,
    required: [true, orderItemMessage.requiredPrice],
  },
});

const statusSchema = mongoose.Schema({
  status: {
    type: String,
    enum: ['pending', 'shipping', 'delivered', 'cancelled', 'accepted'],
    default: 'pending',
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  updatedBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, statusMessage.requiredUpdatedBy],
  },
});

const order = mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, orderMessage.requiredUser],
  },
  orderItems: {
    type: [orderItemSchema],
    required: [true, orderMessage.requiredOrderItems],
    validate: {
      validator: function (val) {
        return val.length > 0;
      },
      message: orderMessage.requiredOrderItemsLength,
    },
  },
  fullname: {
    type: String,
    required: [true, orderMessage.requiredFullname],
  },
  shippingAddress: {
    type: String,
    required: [true, orderMessage.requiredShippingAddress],
  },
  telephone: {
    type: String,
    required: [true, orderMessage.requiredTelephone],
  },
  totalPrice: {
    type: Number,
    required: [true, orderMessage.requiredTotalPrice],
  },
  status: {
    type: [statusSchema],
    required: [true, orderMessage.requiredStatus],
  },
  currentStatus: {
    type: String,
    enum: ['pending', 'shipping', 'delivered', 'cancelled', 'accepted'],
    default: 'pending',
  },
  endDate: {
    type: Date,
    default: Date.now() + 3600000 * 24 * 14,
  },
  updatedAt: Date,
});

// Set currentStatus
order.pre('save', async function (next) {
  this.currentStatus = this.status[this.status.length - 1].status;
  this.updatedAt = this.status[this.status.length - 1].updatedAt;
  next();
});

const Order = mongoose.model('Order', order);

module.exports = Order;

