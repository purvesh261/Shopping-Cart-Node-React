const mongoose = require('mongoose');

const Schema = mongoose.Schema;

let userSchema = new Schema({
    username: {type: String, maxlength: 40, required: true},
    email: {type: String, maxlength: 40, required: true},
    password: {type: String, maxlength: 200, required: true},
    admin: {type: Boolean, required: true},
    status: {type: Boolean, required: true},
    cart: [{
        product: {type: Schema.Types.ObjectId, ref: 'Product'},
        quantity: {type: Number, required: true}
    }]
});

module.exports = mongoose.model('User', userSchema);