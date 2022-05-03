const express = require('express');
const router = express.Router();
const controller = require('../controller/reviews.controller');

router.get("/product/:id", controller.getReviewsByProductId);
router.get("/product/:id/reviews", controller.getWrittenReviewsByProductId);
router.get("/product/:productId/:userId", controller.getProductReviewByUser);
router.post("/", controller.createReview);

module.exports = router;