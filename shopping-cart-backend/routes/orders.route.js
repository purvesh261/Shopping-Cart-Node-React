const express = require('express');
const router = express.Router();
const controller = require('../controller/orders.controller');

router.get('/', controller.getOrders);
router.get('/:id', controller.getOrderById);
router.get('/:userid/user/', controller.getOrderByUser)
router.post('/create', controller.createOrder);
router.put('/:id/update', controller.updateOrder);
router.delete('/:id/delete', controller.deleteOrder);

module.exports = router;
