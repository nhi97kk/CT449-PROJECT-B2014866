const fs = require('fs').promises;

const ApiError = require('../utils/error.util');
const catchAsync = require('../utils/catchAsync.util');

const Image = require('../models/image.model');
const Product = require('../models/product.model');
const { imageMessage } = require('../languages');

exports.createProductImage = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.productId);

    if (!product) {
      return next(
        new ApiError(
          404,
          imageMessage.productNotFound.replace(
            '{{productId}}',
            req.params.productId,
          ),
        ),
      );
    }

    const imageBuffers = await Promise.all(
      req.files.map(async file => {
        const fileBuffer = await fs.readFile(file.path);
        return {
          name: file.filename,
          data: Buffer.from(fileBuffer),
        };
      }),
    );

    const images = await Image.create(imageBuffers);
    product.images.push(...images.map(image => image._id));
    await product.save();

    res.status(201).json({
      status: 'success',
      data: {
        product,
      },
    });
  } catch (err) {
    next(err);
  } finally {
    await Promise.all(
      req.files.map(async file => {
        return await fs.rm(file.path);
      }),
    );
  }
};

exports.deleteProductImage = catchAsync(async (req, res, next) => {
  await Image.findByIdAndDelete(req.params.imageId);
  const product = await Product.findById(req.params.productId);

  if (!product) {
    return next(
      new ApiError(
        404,
        imageMessage.productNotFound.replace(
          '{{productId}}',
          req.params.productId,
        ),
      ),
    );
  }

  product.images = product.images.filter(
    imageId => imageId.toString() !== req.params.imageId,
  );
  await product.save();

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

exports.getImage = catchAsync(async (req, res, next) => {
  const image = await Image.findById(req.params.imageId);

  if (!image) {
    return next(
      new ApiError(
        404,
        imageMessage.imageNotFound.replace('{{imageId}}', req.params.imageId),
      ),
    );
  }

  res.contentType('image/jpeg');
  res.status(200).send(image.data);
});

