const mongoose = require('mongoose');

const Schema = mongoose.Schema;

let MRInwardSchema = new Schema({
    MRInwardNo: {type: String, required: true},
    MRInwardDate: {type: Date, default: Date.now},
    Supplier: {type: String, required: true},
    MRInwardItems: [{
        product: {type: String, required: true},
        quantity: {type: Number, required: true},
        rate: {type: Number, required: true},
        amount: {type: Number, required: true}
    }],
    MRInwardTotal: {type: Number, required: true}
});

module.exports = mongoose.model('MRInward', MRInwardSchema);
