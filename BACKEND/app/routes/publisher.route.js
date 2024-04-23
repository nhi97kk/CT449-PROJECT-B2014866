const express = require('express');

const publisherController = require('../controllers/publisher.controller');
const authController = require('../controllers/auth.controller');

const router = express.Router();

router
  .route('/')
  .get(publisherController.getAllPublisher)
  .post(
    authController.protect,
    authController.restrictTo('admin', 'staff'),
    publisherController.createPublisher,
  );

router
  .route('/search')
  .get(
    publisherController.searchPublisher,
    publisherController.getAllPublisher,
  );

router
  .route('/:publisherId')
  .get(publisherController.getPublisher)
  .patch(
    authController.protect,
    authController.restrictTo('admin', 'staff'),
    publisherController.updatePublisher,
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'staff'),
    publisherController.deletePublisher,
  );

module.exports = router;
