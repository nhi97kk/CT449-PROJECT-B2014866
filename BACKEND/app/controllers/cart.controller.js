const ApiError = require('../utils/error.util');
const { cartMessage } = require('../languages');
const catchAsync = require('../utils/catchAsync.util');

const Cart = require('../models/cart.model');
const Product = require('../models/product.model');

exports.getCartItems = catchAsync(async (req, res, next) => {
  const cartItems = await Cart.find({ user: req.user.id }).populate({
    path: 'product',
  });

  // Set quantity <= Stock quantity
  cartItems.forEach(async item => {
    if (item.quantity > item.product.stockQuantity) {
      item.quantity = item.product.stockQuantity;
      await item.save();
    }
  });

  res.status(200).json({
    status: 'success',
    data: cartItems,
  });
});

exports.createCartItem = catchAsync(async (req, res, next) => {
  const { productId, quantity = 0 } = req.body;

  const product = await Product.findById(productId);

  // ProductId is not exist
  if (!product) {
    return next(
      new ApiError(
        400,
        cartMessage.productNotFound.replace('{{productId}}', productId),
      ),
    );
  }

  // quantity > stockQuantity
  if (quantity > product.stockQuantity) {
    return next(
      new ApiError(
        400,
        cartMessage.productOutOfStock
          .replace('{{productId}}', product._id)
          .replace('{{stockQuantity}}', product.stockQuantity),
      ),
    );
  }

  // Create new or override
  const item = await Cart.findOneAndUpdate(
    {
      user: req.user.id,
      product: productId,
    },
    {
      user: req.user.id,
      product: productId,
      quantity,
    },
    {
      new: true,
      upsert: true,
      runValidators: true,
    },
  );

  res.status(201).json({
    status: 'success',
    data: item,
  });
});

exports.updateCartItem = catchAsync(async (req, res, next) => {
  const { quantity } = req.body;
  const { cartItemId } = req.params;

  // Find cart item by ID
  const item = await Cart.findById(cartItemId);
  if (!item) {
    return next(
      new ApiError(
        400,
        cartMessage.cartItemNotFound.replace('{{cartItemId}}', cartItemId),
      ),
    );
  }

  const product = await Product.findById(item.product);
  if (!product) {
    await item.remove();
    return next(
      new ApiError(
        400,
        cartMessage.productNotFound.replace('{{productId}}', item.product),
      ),
    );
  }

  // quantity > stockQuantity
  if (!product || quantity > product.stockQuantity) {
    return next(
      new ApiError(
        400,
        cartMessage.productOutOfStock
          .replace('{{productId}}', product._id)
          .replace('{{stockQuantity}}', product.stockQuantity),
      ),
    );
  }

  item.quantity = quantity;
  await item.save();

  res.status(201).json({
    status: 'success',
    data: item,
  });
});

exports.deleteCartItem = catchAsync(async (req, res, next) => {
  const { cartItemId } = req.params;

  await Cart.findOneAndDelete({
    _id: cartItemId,
    user: req.user.id,
  });

  res.status(204).json({
    status: 'success',
    message: cartMessage.deleteCartItemSuccess,
  });
});

