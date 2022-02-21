const Product = require('../model/products.model');

exports.getProducts = (req, res) => {
    Product.find()
        .then(products => {
            res.send(products);
        })
        .catch(err => {
            res.send('Error: ' + err);
        });
}

exports.getProductById = (req, res) => {
    Product.findById(req.params.id)
        .then(product => {
            res.send(product);
        })
        .catch(err => {
            res.send('Error: ' + err);
        })
}

exports.createProduct = (req, res) => {
    let product = new Product(req.body);
    product.save()
        .then(product => {
            res.send(product);
        })
        .catch( err => {
            res.send('Error: ' + err)
        })
}

exports.updateProduct = (req,res) => {
    Product.findByIdAndUpdate(req.params.id, req.body)
        .then(product => {
            res.send(product);
        })
        .catch(err => {
            res.send('Error: ' + err)
        });
}

exports.deleteProduct = (req, res) => {
    Product.findByIdAndRemove(req.params.id)
        .then(product => {
            res.send(product);
        })
        .catch(err => {
            res.send('Error: ' + err);
        });
}