const ApiError = require('../utils/error.util');
const MongooseQuery = require('../utils/query.util');
const { filterPayload } = require('../utils/extract.util');
const catchAsync = require('../utils/catchAsync.util');
const { userMessage } = require('../languages');

const User = require('../models/user.model');

// For admin
exports.getAllUser = catchAsync(async (req, res, next) => {
  let mongooseQuery = new MongooseQuery(User.find(), {
    ...req.query,
    isAdminAccess: true,
  });
  mongooseQuery.filter().sort().paginate();

  const users = await mongooseQuery.query.select('-password +active');

  res.status(200).json({
    status: 'success',
    data: { users },
  });
});

exports.getUser = catchAsync(async (req, res, next) => {
  const user = await User.findOne({
    _id: req.params.userId,
    isAdminAccess: true,
  }).select('+active');

  if (!user) {
    return next(new ApiError(404, userMessage.userNotFound));
  }

  res.status(200).json({
    status: 'success',
    data: { user },
  });
});

exports.createUser = catchAsync(async (req, res, next) => {
  const payload = { ...req.body };
  const user = await User.create(payload);

  res.status(201).json({
    status: 'success',
    data: { user },
  });
});

exports.updateUser = catchAsync(async (req, res, next) => {
  const user = await User.findOneAndUpdate(
    { _id: req.params.userId, isAdminAccess: true },
    { ...req.body },
    { new: true, runValidators: true },
  ).select('+active');

  if (!user) {
    return next(new ApiError(404, userMessage.userNotFound));
  }

  res.status(200).json({
    status: 'success',
    data: { user },
  });
});

exports.deleteUser = catchAsync(async (req, res, next) => {
  // Remove user
  const user = await User.findOneAndUpdate(
    { _id: req.params.userId },
    { active: false },
    { new: true, runValidators: true },
  ).select('+active');

  if (!user) {
    return next(new ApiError(404, userMessage.userNotFound));
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

// For user
exports.getMe = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id).select(
    '-active -__v -password -passwordChangedAt',
  );

  res.status(200).json({
    status: 'success',
    data: { user },
  });
});

exports.updateMe = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.confirmPassword) {
    return next(new ApiError(400, userMessage.notForUpdatePassword));
  }

  // Remove field from req.body
  const filtered = filterPayload(req.body, [
    'role',
    'passwordChangedAt',
    'email',
    'active',
    '_id',
  ]);

  const user = await User.findByIdAndUpdate(req.user.id, filtered, {
    new: true,
    runValidators: true,
  }).select('-active -__v -password -passwordChangedAt');

  res.status(200).json({
    status: 'success',
    data: { user },
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  // Unactive user
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

