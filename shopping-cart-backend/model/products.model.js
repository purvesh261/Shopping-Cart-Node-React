const mongoose = require('mongoose');

const Schema = mongoose.Schema;

let productSchema = new Schema({
    name: {type: String, maxlength: 40, required: true},
    price: {type: Number, required: true},
    quantity: {type: Number, required: true},
    supplier: {type: String, maxlength: 40, required: true},
    description: {type: String, maxlength: 200, required: false},
    status: {type: Boolean, required: true},
    images: [{type: String, maxlength: 200, required: false}],
});

module.exports = mongoose.model('Product', productSchema);