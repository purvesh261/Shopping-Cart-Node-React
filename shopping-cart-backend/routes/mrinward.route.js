const express = require('express');
const router = express.Router();
const controller = require('../controller/mrinward.controller');

router.get('/', controller.getMRInwards);
router.get('/:id', controller.getMRInwardById);
router.post('/create', controller.createMRInward);
router.put('/:id/update', controller.updateMRInward);
router.delete('/:id/delete', controller.deleteMRInward);

module.exports = router;

