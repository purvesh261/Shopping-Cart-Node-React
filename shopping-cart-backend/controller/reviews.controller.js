const Review = require('../model/reviews.model');
const Product = require('../model/products.model');
const mongoose = require('mongoose');
const error500msg = "Something went wrong! Try again.";

exports.getProductReviewByUser = async (req, res) => {
    try{
        var review = await Review
                            .findOne({product: req.params.productId, user: req.params.userId})
        res.send(review);
    }
    catch(err) {
        res.status(500).send(error500msg);
    }
}

exports.getReviewsByProductId = async (req, res) => {
    try{
        var reviews = await Review
                            .find({product: req.params.id})
                            .populate("user", "username")
        res.send(reviews);
    }
    catch(err) {
        res.status(500).send(error500msg);
    }
}

exports.getWrittenReviewsByProductId = async (req, res) => {
    try{
        var reviews = await Review
                            .find({product: req.params.id, review: {"$ne": ""}})
                            .populate("user", "username")
        res.send(reviews);
    }
    catch(err){
        res.status(500).send(error500msg);
    }
}

exports.createReview = async (req, res) => {
    try{
        var newReview = await Review.create(req.body);
        newReview.save()
        var product = await Product.findOne({_id:newReview.product});
        product.averageRating = ((Number(product.averageRating) * product.totalRatings) + Number(newReview.rating)) / (product.totalRatings + 1);
        product.averageRating = Number(product.averageRating).toFixed(2);
        product.totalRatings = product.totalRatings + 1;
        product.save();
        res.send(newReview);
    }
    catch(err) {
        res.status(500).send(error500msg);
    }
}