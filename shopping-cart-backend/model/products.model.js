const mongoose = require('mongoose');

const Schema = mongoose.Schema;

let productSchema = new Schema({
    name: {type: String, maxlength: 40, required: true},
    price: {type: Number, required: true},
    description: {type: String, maxlength: 200, required: false},
    stock: {type: Number, required: true, default: 0},
    category: {type: String, required: true},
    status: {type: Boolean, required: true, default: true},
    images: {type: String, maxlength: 300, required: false},
    dateAdded: {type: Date, default: Date.now, required: true},
});

module.exports = mongoose.model('Product', productSchema);