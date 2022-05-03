const mongoose = require('mongoose');

const Schema = mongoose.Schema;

let ReviewSchema = new Schema({
    user: {type: Schema.Types.ObjectId, ref: 'User', required: true},
    product: {type: Schema.Types.ObjectId, ref: 'Product', required: true},
    rating: {type: Number, required: true},
    review: {type: String, default:""}
});

module.exports = mongoose.model('Reviews', ReviewSchema);