const mongoose = require('mongoose');

// const { cartMessage } = require('../languages/index.js');

const publisherSchema = mongoose.Schema({
  tennxb: {
    type: String,
    required: [true, 'Phai nhap ten'],
  },
  diachi: {
    type: String,
    required: [true, 'Phai nhap dia chi'],
  },
});

const Publisher = mongoose.model('Publisher', publisherSchema);

module.exports = Publisher;
