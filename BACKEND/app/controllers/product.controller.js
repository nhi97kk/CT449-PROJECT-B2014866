const ApiError = require('../utils/error.util');
const MongooseQuery = require('../utils/query.util');
const catchAsync = require('../utils/catchAsync.util');
const { productMessage } = require('../languages');

const Product = require('../models/product.model');
const Image = require('../models/image.model');

exports.searchProduct = catchAsync(async (req, res, next) => {
  req.query.slug = { $regex: req.query.slug, $options: 'i' };
  next();
});

exports.getAllProduct = catchAsync(async (req, res, next) => {
  let mongooseQuery = new MongooseQuery(Product.find(), { ...req.query });
  mongooseQuery.filter().sort().paginate();

  const products = await mongooseQuery.query;

  res.status(200).json({
    status: 'success',
    data: { products },
  });
});

exports.getProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findById(req.params.productId).populate({
    path: 'createdBy',
  });

  if (!product) {
    return next(
      new ApiError(
        404,
        productMessage.productNotFound.replace(
          '{{productId}}',
          req.params.productId,
        ),
      ),
    );
  }

  res.status(200).json({
    status: 'success',
    data: { product },
  });
});

exports.createProduct = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  const payload = { ...req.body, createdBy: userId };
  payload.images = [];

  const product = await Product.create(payload);

  res.status(201).json({
    status: 'success',
    data: { product },
  });
});

exports.updateProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findByIdAndUpdate(
    req.params.productId,
    { ...req.body },
    { new: true, runValidators: true },
  );

  if (!product) {
    return next(
      new ApiError(
        404,
        productMessage.productNotFound.replace(
          '{{productId}}',
          req.params.productId,
        ),
      ),
    );
  }

  res.status(200).json({
    status: 'success',
    data: { product },
  });
});

exports.deleteProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findByIdAndDelete(req.params.productId);

  if (!product) {
    return next(
      new ApiError(
        404,
        productMessage.productNotFound.replace(
          '{{productId}}',
          req.params.productId,
        ),
      ),
    );
  }

  product.images.forEach(async image => {
    await Image.findByIdAndDelete(image);
  });

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

