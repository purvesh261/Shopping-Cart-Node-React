const mongoose = require('mongoose');

const Schema = mongoose.Schema;

let MRInwardSchema = new Schema({
    MRInwardNo: {type: String, required: true},
    MRInwardDate: {type: Date, default: Date.now},
    Supplier: {type: String, required: true},
    MRInwardDetails: [{
        Product: {type: String, required: true},
        Quantity: {type: Number, required: true},
        Rate: {type: Number, required: true},
        Amount: {type: Number, required: true}
    }],
    MRInwardTotal: {type: Number, required: true}
});

module.exports = mongoose.model('MRInward', MRInwardSchema);
