const express = require('express');

const userController = require('../controllers/user.controller');
const authController = require('../controllers/auth.controller');

const router = express.Router();

// Authentication
router.post('/signup', authController.signup);
router.patch('/active/:activeToken', authController.activeUser);
router.post('/login', authController.login);
router.patch('/resetPassword/:resetToken', authController.resetPassword);
router.post('/logout', authController.logout);

router.use(authController.protect);

router.patch('/updatePassword', authController.updatePassword);

// User route
router
  .route('/me')
  .get(userController.getMe)
  .patch(userController.updateMe) // This route is not used for update password
  .delete(userController.deleteMe);

// Only for admin
router.use(authController.restrictTo('admin'));

router
  .route('/')
  .get(userController.getAllUser)
  .post(userController.createUser);

router
  .route('/:userId')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;

