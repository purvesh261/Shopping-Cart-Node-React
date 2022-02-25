const Product = require('../model/products.model');
var fs = require('fs');
const { userInfo } = require('os');

exports.getProducts = (req, res) => {
    Product.find()
        .then(products => {
            res.send(products);
        })
        .catch(err => {
            res.send('Error: ' + err);
        });
}

exports.getProductNames = (req, res) => {
    Product.find({},{_id:1, name:1})
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
    if (req.files) {
        let image = req.files.images;
        let imageName = Date.now() + '-' + image.name;
        let dir = './public/products/' + product._id + '/';
        if (!fs.existsSync(dir)){
            fs.mkdirSync(dir, { recursive: true });
        }
        image.mv(dir + imageName, function (err) {
            if (err) {
                console.log(err);
                return res.status(500).send(err);
            }
            else
            {
                product.images = imageName;
                product.save();
            }
        });
    }
    else{
        product.images = null;
    }

    product.save()
        .then(product => {  
            res.send(product);
        })
        .catch(err => {
            res.send('Error: ' + err);
        })
}


exports.updateProduct = (req,res) => {
    Product.findByIdAndUpdate(req.params.id, {$set: req.body})
        .then(product => {
            res.send(product);
        })
        .catch(err => {
            res.send('Error: ' + err)
        });
}

exports.updateProductStock = (req,res) => {
    Product.findByIdAndUpdate(req.params.productID, {$inc: {stock: -req.body.orderQuantity}})
        .then(product => {
            res.json({message: "Order Placed Successfully", success: true});
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
