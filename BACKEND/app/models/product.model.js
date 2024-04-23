const mongoose = require('mongoose');
const slugify = require('slugify');

const { productMessage } = require('../languages');

const productSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, productMessage.requiredName],
      unique: true,
      trim: true,
      minlength: [5, productMessage.minlengthName],
      maxlength: [200, productMessage.maxlengthName],
    },
    price: {
      type: Number,
      required: [true, productMessage.requiredPrice],
      min: [0, productMessage.minPrice],
    },
    stockQuantity: {
      type: Number,
      required: [true, productMessage.requiredStockQuantity],
      min: [0, productMessage.minStockQuantity],
    },
    images: {
      type: [{ type: mongoose.Schema.ObjectId, ref: 'Image' }],
    },
    manxb: {
      type: mongoose.Schema.ObjectId,
      ref: 'Publisher',
    },
    namxuatban: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      unique: true,
    },
    nguongoc: {
      type: String,
      default: '',
      required: [true, 'Sach phai co nguon goc'],
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    createdBy: {
      type: mongoose.Schema.ObjectId,
      required: [true, productMessage.requiredCreatedBy],
      ref: 'User',
    },
  },
  {
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
    id: false,
  },
);

productSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

productSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'manxb',
    select: '_id tennxb diachi',
  });
  next();
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;

