const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const orderSchema = new Schema({
    user: {type: Schema.Types.ObjectId, ref: 'User'},
    products: [{
        product: {type: Schema.Types.ObjectId, ref: 'Product'},
        quantity: {type: Number, required: true}
    }],
    total: {amount: {type: Number, required: true},
            tax: {type: Number, required: true},
            shipping: {type: Number, required: true},
            total: {type: Number, required: true}},
    address: {type: String, required: true},
    phone: {type: String, required: true},
    date: {type: Date, default: Date.now}
});

module.exports = mongoose.model('Orders', orderSchema);