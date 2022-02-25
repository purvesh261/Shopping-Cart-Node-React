const Product = require('../model/products.model');
var fs = require('fs');

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
    console.log(req.body);
    let product = new Product(req.body);

    if (req.file) {
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
                product.images.push(dir + imageName);
            }
        });
    }
    else{
        product.images = [];
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