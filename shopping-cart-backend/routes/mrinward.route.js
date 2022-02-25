const express = require('express');
const router = express.Router();
const controller = require('../controller/mrinward.controller');

router.get('/', controller.getMRInwards);
router.get('/mr-numbers', controller.getMRInwardNos);
router.get('/:id', controller.getMRInwardById);
router.post('/create', controller.createMRInward);
router.put('/:id/update', controller.updateMRInward);
router.delete('/:id/delete', controller.deleteMRInward);
router.put('/:productID/items/remove', controller.removeProductFromItems);

module.exports = router;

