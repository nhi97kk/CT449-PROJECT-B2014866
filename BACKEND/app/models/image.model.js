const mongoose = require('mongoose');

const { imageMessage } = require('../languages/en');

const imageSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, imageMessage.requiredName],
  },
  data: {
    type: Buffer,
    required: [true, imageMessage.requiredData],
  },
});

const Image = mongoose.model('Image', imageSchema);
module.exports = Image;

