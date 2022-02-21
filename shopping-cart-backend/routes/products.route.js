const express = require('express');
const router = express.Router();
const controller = require('../controller/products.controller');

router.get('/', controller.getProducts);
router.get('/:id', controller.getProductById);
router.post('/', controller.createProduct);
router.put('/:id/update', controller.updateProduct);
router.delete('/:id/delete', controller.deleteProduct);

module.exports = router;