const express = require('express');
const router = express.Router();
const controller = require('../controller/products.controller');

router.get('/', controller.getProducts);
router.get('/names', controller.getProductNames);
router.get('/:id', controller.getProductById);
router.post('/create', controller.createProduct);
router.put('/:id/update', controller.updateProduct);
router.put('/:productID/update/stock', controller.updateProductStock);
router.delete('/:id/delete', controller.deleteProduct);

module.exports = router;