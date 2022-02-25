const express = require('express');
const router = express.Router();
const controller = require('../controller/users.controller');

router.get('/', controller.getUsers);
router.post('/authenticate', controller.authenticate);
router.get('/username/:username', controller.getUserByUsername);
router.post('/', controller.createUser);
router.put('/:id/update', controller.updateUser);
router.put('/:id/update/cart', controller.updateCart);
router.delete('/:id/delete', controller.deleteUser);
router.put('/:productID/cart/remove', controller.removeProductFromCart);

module.exports = router;