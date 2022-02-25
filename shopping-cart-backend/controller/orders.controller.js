const Order = require('../model/orders.model');
const Product = require('../model/products.model');

exports.getOrders = (req, res) => {
    Order.find()
        .populate('user')
        .populate('products.product')
        .then(orders => {
            res.send(orders);
        })
        .catch(err => {
            res.send('Error: ' + err);
        });
}

exports.getOrderById = (req, res) => {
    Order.findById(req.params.id)
        .populate('products.product')
        .populate('products.product')
        .then(order => {
            res.send(order);
        })
        .catch(err => {
            res.send('Error: ' + err);
        })
}

exports.getOrderByUser = (req, res) => {
    Order.find({user: req.params.userid})
        .populate('products.product')
        .then(ordersList => {
            console.log(ordersList);
            res.send(ordersList)
        })
        .catch( err => {
            res.send('Error: ' + err)
        })
}

exports.createOrder = (req, res) => {
    let order = new Order(req.body);
    order.save()
        .then(order => {
            order.products.forEach(item => {
                Product.findByIdAndUpdate(item.product._id, {$inc: {stock: -item.quantity}})
                        .then(product => {
                            console.log(product);
                        })
                        .catch(err => {
                            console.log(err);
                        })
                res.send(order);
            })
        })
        .catch( err => {
            res.send('Error: ' + err)
        })
}

exports.updateOrder = (req,res) => {
    Order.findByIdAndUpdate(req.params.id, req.body)
        .then(order => {
            res.send(order);
        })
        .catch(err => {
            res.send('Error: ' + err)
        });
}

exports.deleteOrder = (req, res) => {
    Order.findByIdAndRemove(req.params.id)
        .then(order => {
            res.send(order);
        })
        .catch(err => {
            res.send('Error: ' + err);
        });
}