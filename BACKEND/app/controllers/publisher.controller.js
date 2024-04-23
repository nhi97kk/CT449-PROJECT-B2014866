const ApiError = require('../utils/error.util');
const MongooseQuery = require('../utils/query.util');
const catchAsync = require('../utils/catchAsync.util');

const Publisher = require('../models/publisher.model');

exports.searchPublisher = catchAsync(async (req, res, next) => {
  req.query.tennxb = { $regex: req.query.tennxb, $options: 'i' };
  next();
});

exports.getAllPublisher = catchAsync(async (req, res, next) => {
  let mongooseQuery = new MongooseQuery(Publisher.find(), { ...req.query });
  mongooseQuery.filter().sort().paginate();

  const publishers = await mongooseQuery.query;

  res.status(200).json({
    status: 'success',
    data: { publishers },
  });
});

exports.getPublisher = catchAsync(async (req, res, next) => {
  const publisher = await Publisher.findById(req.params.publisherId);

  if (!publisher) {
    return next(new ApiError(404, 'Khong tim thay Nha Xuat Ban'));
  }

  res.status(200).json({
    status: 'success',
    data: { publisher },
  });
});

exports.createPublisher = catchAsync(async (req, res, next) => {
  const publisher = await Publisher.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      data: publisher,
    },
  });
});

exports.updatePublisher = catchAsync(async (req, res, next) => {
  const publisher = await Publisher.findByIdAndUpdate(
    req.params.publisherId,
    req.body,
    {
      new: true,
      runValidators: true,
    },
  );

  if (!publisher) {
    return next(new AppError('No publisher found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      data: publisher,
    },
  });
});

exports.deletePublisher = catchAsync(async (req, res, next) => {
  const publisher = await Publisher.findByIdAndDelete(req.params.publisherId);

  if (!publisher) {
    return next(new ApiError(404, 'Khong tim thay nha xuat ban'));
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
});
