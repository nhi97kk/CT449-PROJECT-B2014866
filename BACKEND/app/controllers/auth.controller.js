const jwt = require('jsonwebtoken');

const ApiError = require('../utils/error.util');
const { filterPayload } = require('../utils/extract.util');
const { setCookie, getCookie, clearCookie } = require('../utils/cookie.util');
const catchAsync = require('../utils/catchAsync.util');
const { mailTemplate, userMessage } = require('../languages');

const User = require('../models/user.model');

const signToken = _id => {
  return jwt.sign({ _id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const filtered = filterPayload(req.body, ['role', 'active']);
  await User.create(filtered);

  res.status(201).json({
    status: 'success',
    message: userMessage.signupSuccess,
  });
});

exports.activeUser = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ userActiveToken: req.params.activeToken });

  // Invalid token
  if (!user) {
    return next(new ApiError(400, userMessage.invalidActiveToken));
  }

  user.active = true;
  user.userActiveToken = undefined;
  await user.save({ validateBeforeSave: false });

  res.status(200).json({
    status: 'success',
    message: userMessage.activeSuccess,
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  console.log(req.body);

  if (!email || !password) {
    return next(new ApiError(400, userMessage.emptyLoginInfo));
  }

  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.comparePassword(password, user.password))) {
    return next(new ApiError(401, userMessage.incorrectLoginInfo));
  }

  setCookie(res, signToken(user._id));
  res.status(200).json({
    status: 'success',
    message: userMessage.loginSuccess,
    data: {
      user: {
        email: user.email,
        role: user.role,
      },
    },
  });
});

exports.protect = catchAsync(async (req, res, next) => {
  /* bearer token
    if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer')) {
      return next(new ApiError(401, 'Please login before accessing this route'));
    }
    const token = req.headers.authorization.split(' ')[1];
  */
  const decodedToken = jwt.verify(getCookie(req), process.env.JWT_SECRET_KEY);

  const user = await User.findById(decodedToken._id);

  if (!user) {
    return next(new ApiError(404, userMessage.userNotFound));
  }

  if (user.passwordChangedAfter(decodedToken.iat)) {
    return next(new ApiError(401, userMessage.passwordChanged));
  }

  // Grant access to protected route
  req.user = {
    id: user._id,
    role: user.role,
  };

  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (roles.includes(req.user.role)) {
      next();
    } else {
      return next(new ApiError(403, userMessage.notHavePermission));
    }
  };
};

exports.resetPassword = catchAsync(async (req, res, next) => {
  const { resetToken } = req.params;
  const user = await User.findOne({
    passwordResetToken: resetToken,
    passwordResetTokenExpiresIn: { $gte: Date.now() },
  });

  if (!user) {
    return next(new ApiError(400, userMessage.invalidResetToken));
  }

  user.password = req.body.password;
  user.confirmPassword = req.body.confirmPassword;
  user.passwordResetToken = undefined;
  user.passwordResetTokenExpiresIn = undefined;
  await user.save();

  res.status(200).json({
    status: 'success',
    message: userMessage.resetPasswordSuccess,
  });
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id).select('+password');

  if (
    !req.body.oldPassword ||
    !(await user.comparePassword(req.body.oldPassword, user.password))
  ) {
    return next(new ApiError(401, userMessage.incorrectOldPassword));
  }

  user.password = req.body.password;
  user.confirmPassword = req.body.confirmPassword;
  await user.save();

  setCookie(res, signToken(user._id));
  res.status(200).json({
    status: 'success',
    message: userMessage.updatePasswordSuccess,
  });
});

exports.logout = catchAsync(async (req, res, next) => {
  await clearCookie(res);
  res.status(200).json({
    status: 'success',
    message: userMessage.logoutSuccess,
  });
});

