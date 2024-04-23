const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');

const ApiError = require('./app/utils/error.util');
const { routeMessage } = require('./app/languages');

const globalErrorHandler = require('./app/controllers/error.controller');

const productRouter = require('./app/routes/product.route');
const userRouter = require('./app/routes/user.route');
const cartRouter = require('./app/routes/cart.route');
const orderRouter = require('./app/routes/order.route');
const publisherRouter = require('./app/routes/publisher.route');

const app = express();

// Middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev')); // Use for dev
}
app.set('trust proxy', 1);
app.use(
  cors({
    credentials: true,
    origin: process.env.CLIENT_URL.split(','),
  }),
);

console.log(`Allow CORS: ${process.env.CLIENT_URL.split(',')}`);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(`${__dirname}/public}`));

// Routes
app.use('/api/v1/products', productRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/carts', cartRouter);
app.use('/api/v1/orders', orderRouter);
app.use('/api/v1/publishers', publisherRouter);

// Undefined routes
app.use('*', (req, res, next) => {
  return next(
    new ApiError(
      404,
      routeMessage.notFound.replace('{{originalUrl}}', req.originalUrl),
    ),
  );
});

// Handle Errors
app.use(globalErrorHandler);

module.exports = app;

