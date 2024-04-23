const express = require('express');

const uploadImage = require('../utils/upload.util');

const productController = require('../controllers/product.controller');
const authController = require('../controllers/auth.controller');
const imageController = require('../controllers/image.controller');

const router = express.Router();

router
  .route('/')
  .get(productController.getAllProduct)
  .post(
    authController.protect,
    authController.restrictTo('admin', 'staff'),
    productController.createProduct,
  );

// Search product by name
router.route('/search').get(productController.searchProduct, productController.getAllProduct);

router
  .route('/:productId')
  .get(productController.getProduct)
  .patch(
    authController.protect,
    authController.restrictTo('admin', 'staff'),
    productController.updateProduct,
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'staff'),
    productController.deleteProduct,
  );

// Image routes

router.route('/images/:imageId').get(imageController.getImage);
router
  .route('/:productId/images')
  .post(
    authController.protect,
    authController.restrictTo('admin', 'staff'),
    uploadImage.multipleUpload,
    imageController.createProductImage,
  );

router
  .route('/:productId/images/:imageId')
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'staff'),
    imageController.deleteProductImage,
  );

module.exports = router;

