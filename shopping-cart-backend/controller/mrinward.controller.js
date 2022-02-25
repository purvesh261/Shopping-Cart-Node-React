const MRInward = require('../model/mrinward.model');
const Product = require('../model/products.model');

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
    MRInward.findByIdAndUpdate(req.params.id, req.body)
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
                
            });
        })
        .catch(err => {
            res.send('Error:' + err);
        });
}

exports.deleteMRInward = (req, res) => {
    MRInward.findByIdAndRemove(req.params.id)
        .then(mrinward => {
            res.send(mrinward);
        })
        .catch(err => {
            res.send('Error:' + err);
        });
}

