const MRInward = require('../model/mrinward.model');
const Product = require('../model/products.model');
var ObjectId = require('mongoose').Types.ObjectId;

exports.getMRInwards = (req, res) => {
    MRInward.find()
    .populate('MRInwardItems.product')
    .then(mrinwards => {
        res.send(mrinwards);
    })
    .catch(err => {
        res.send('Error:' + err);
    })
};

exports.getMRInwardById = (req, res) => {
    MRInward.findById(req.params.id)
    .populate('MRInwardItems.product')
    .then(mrinward => {
        res.send(mrinward);
    })
    .catch(err => {
        res.send('Error:' + err);
    })
}

exports.getMRInwardNos = (req, res) => {
    MRInward.find({},{_id:1, MRInwardNo:1})
    .then(mrinwards => {
        res.send(mrinwards);
    })
    .catch(err => {
        res.send('Error:' + err);
    })
}


exports.createMRInward = (req, res) => {
    let newMRInward = new MRInward(req.body);
    newMRInward.save()
        .then(mrinward => {
            res.send(mrinward);
            mrinward.MRInwardItems.forEach(item => {
                Product.findByIdAndUpdate(item.product._id, {$inc: {stock: item.quantity}})
                    .then(product => {
                        console.log(product);
                    })
                    .catch(err => {
                        console.log(err);
                    })
                })
        })
        .catch(err => {
            res.send('Error:' + err);
        });
}

exports.updateMRInward = (req, res) => {
    var updatedMR = {
        MRInwardNo: req.body.MRInwardNo,
        MRInwardDate: req.body.MRInwardDate,
        Supplier: req.body.Supplier,
        MRInwardItems: req.body.MRInwardItems,
        MRInwardTotal: req.body.MRInwardTotal
    }
    
    MRInward.findByIdAndUpdate(req.params.id, updatedMR)
        .then(mrinward => {
            res.send(mrinward);
            mrinward.MRInwardItems.forEach(item => {
                Product.findByIdAndUpdate(item.product, {$inc: {stock: -Number(item.quantity)}})
                    .then(product => {
                        updatedMR.MRInwardItems.forEach(newItem => {
                            Product.findByIdAndUpdate(newItem.product, {$inc: {stock: Number(newItem.quantity)}})
                                .then(newProduct => {
                                    if((newProduct.stock + Number(newItem.quantity)) < 0) {
                                        newProduct.stock = 0;
                                        newProduct.save();
                                    }
                                })
                                .catch(err => {
                                    console.log(err);
                                })
                        });

                        if((product.stock -Number(item.quantity)) < 0) {
                            product.stock = 0;
                            product.save();
                        }

                    })
                    .catch(err => {
                        console.log(err);
                    })
                })
        })
        .catch(err => {
            res.send('Error:' + err);
        });
}

exports.deleteMRInward = (req, res) => {
    MRInward.findByIdAndRemove(req.params.id)
        .then(mrinward => {
            res.send({MRInwardNo: mrinward.MRInwardNo});
        })
        .catch(err => {
            res.send('Error:' + err);
        });
}

exports.removeProductFromItems = (req, res) => {
    MRInward.find({MRInwardItems: {$elemMatch: {product: new ObjectId(req.params.productID)}}})
        .then(mrinward => {
            var removedItem = null;
            mrinward.forEach(inward => {
                removedItem = inward.MRInwardItems.splice(inward.MRInwardItems.findIndex(item => item.product == req.params.productID), 1);
                if(removedItem.length > 0) {
                    removedItem = removedItem[0];
                    inward.RemovedMRInwardItems = { product: removedItem.product.name, quantity: removedItem.quantity, rate: removedItem.rate, amount: removedItem.amount };
                    inward.save()
                }

                
            });
            
        })
        .catch(err => {
            res.send('Error:' + err);
        }
    );
}


