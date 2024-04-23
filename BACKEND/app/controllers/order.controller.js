const ApiError = require('../utils/error.util');
const MongooseQuery = require('../utils/query.util');
const catchAsync = require('../utils/catchAsync.util');
const { orderMessage } = require('../languages');

const Order = require('../models/order.model');
const Product = require('../models/product.model');

const extractOrderItems = async (items, next) => {
  let totalPrice = 0;
  const orderItems = await Promise.all(
    items.map(async item => {
      if (!item.product || !item.quantity) {
        return next(new ApiError(400, orderMessage.invalidOrderItems));
      }

      const product = await Product.findById(item.product);
      if (!product) {
        return next(
          new ApiError(400, orderMessage.productNotFound).replace(
            '{{productId}}',
            item.product,
          ),
        );
      }

      if (item.quantity > product.stockQuantity) {
        return next(
          new ApiError(
            400,
            orderMessage.productOutOfStock
              .replace('{{productId}}', product._id)
              .replace('{{stockQuantity}}', product.stockQuantity),
          ),
        );
      }

      totalPrice += product.price * item.quantity;

      return {
        product: item.product,
        quantity: item.quantity,
        price: product.price,
      };
    }),
  );
  return { totalPrice, orderItems };
};

exports.getAllOrders = catchAsync(async (req, res, next) => {
  if (req.user.role === 'customer') {
    req.query.user = req.user.id;
  }

  let mongooseQuery = new MongooseQuery(Order.find(), { ...req.query });
  mongooseQuery.filter().sort().paginate();

  const orders = await mongooseQuery.query.populate([
    {
      path: 'orderItems.product',
      select: 'name price images ',
    },
    {
      path: 'user',
      select: 'email address _id active order fullname',
    },
    {
      path: 'status.updatedBy',
      select: 'role email _id',
    },
  ]);

  res.status(200).json({
    status: 'success',
    data: { orders },
  });
});

exports.getOrder = catchAsync(async (req, res, next) => {
  const order = await Order.findById(req.params.orderId)
    .populate([
      {
        path: 'orderItems.product',
        select: 'name price discount images',
      },
      {
        path: 'user',
        select: 'email address _id active order',
      },
      {
        path: 'status.updatedBy',
        select: 'role email _id',
      },
    ])
    .select('-__v');

  if (!order) {
    return next(
      new ApiError(
        404,
        orderMessage.orderNotFound.replace('{{orderId}}', req.params.orderId),
      ),
    );
  }

  res.status(200).json({
    status: 'success',
    data: { order },
  });
});

exports.createOrder = catchAsync(async (req, res, next) => {
  const payload = { ...req.body };

  if (!payload.orderItems || payload.orderItems.length === 0) {
    return next(new ApiError(400, orderMessage.invalidOrderItems));
  }

  // Extract order items
  const { totalPrice, orderItems } = await extractOrderItems(
    payload.orderItems,
    next,
  );

  const order = await Order.create({
    user: req.user.id,
    shippingAddress: payload.shippingAddress,
    telephone: payload.telephone,
    fullname: payload.fullname,
    totalPrice: totalPrice,
    orderItems: orderItems,
    status: [{ status: 'pending', updatedBy: req.user.id }],
  });

  // Remove stock quantity
  orderItems.forEach(async item => {
    const product = await Product.findById(item.product);
    product.stockQuantity -= item.quantity;
    await product.save();
  });

  res.status(200).json({
    status: 'success',
    data: { order },
  });
});

exports.updateOrderStatus = catchAsync(async (req, res, next) => {
  if (!req.body.status) {
    return next(new ApiError(400, orderMessage.invalidStatus));
  }

  const order = await Order.findById(req.params.orderId);

  if (!order) {
    return next(
      new ApiError(
        404,
        orderMessage.orderNotFound.replace('{{orderId}}', req.params.orderId),
      ),
    );
  }

  if (
    order.currentStatus === 'cancelled' ||
    order.currentStatus === 'delivered'
  ) {
    return next(
      new ApiError(
        400,
        orderMessage.orderCannotUpdate
          .replace('{{status}}', order.currentStatus)
          .replace('{{orderId}}', req.params.orderId),
      ),
    );
  }

  if (order.currentStatus === 'shipping') {
    order.orderItems.forEach(async item => {
      const product = await Product.findById(item.product);
      product.stockQuantity += item.quantity;
      await product.save();
    });
  }

  order.status.push({
    status: req.body.status,
    updatedBy: req.user.id,
  });
  await order.save();

  res.status(200).json({
    status: 'success',
    data: { order },
  });
});

exports.deliverOrder = catchAsync(async (req, res, next) => {
  const order = await Order.findById(req.params.orderId);

  if (order.currentStatus !== 'shipping') {
    return next(
      new ApiError(
        400,
        orderMessage.orderCannotBeUpdated
          .replace('{{status}}', order.currentStatus)
          .replace('{{orderId}}', req.params.orderId),
      ),
    );
  }

  order.status.push({
    status: 'delivered',
    updatedBy: req.user.id,
  });
  await order.save();

  res.status(200).json({
    status: 'success',
    data: { order },
  });
});

exports.cancelOrder = catchAsync(async (req, res, next) => {
  const order = await Order.findById(req.params.orderId);

  if (!order) {
    return next(
      new ApiError(
        404,
        orderMessage.orderNotFound.replace('{{orderId}}', req.params.orderId),
      ),
    );
  }

  if (order.currentStatus !== 'pending') {
    return next(
      new ApiError(
        400,
        orderMessage.orderCannotBeCancelled
          .replace('{{status}}', order.currentStatus)
          .replace('{{orderId}}', req.params.orderId),
      ),
    );
  }

  order.status.push({
    status: 'cancelled',
    updatedBy: req.user.id,
  });
  await order.save();

  // Add stock quantity
  order.orderItems.forEach(async item => {
    const product = await Product.findById(item.product);
    product.stockQuantity += item.quantity;
    await product.save();
  });

  res.status(200).json({
    status: 'success',
    message: orderMessage.cancelOrderSuccess,
  });
});

