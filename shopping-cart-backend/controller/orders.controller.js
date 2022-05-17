require('dotenv').config();
const Order = require('../model/orders.model');
const Product = require('../model/products.model');
const Razorpay = require('razorpay');
const uniqId = require('uniqId');
const crypto = require('crypto');
var orderId = '';
var razorpayInstance = new Razorpay({ key_id: process.env.RAZORPAY_KEY_ID, key_secret: process.env.RAZORPAY_SECRET })

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
            res.send(order);
        })
        .catch( err => {
            res.status('Error: ' + err)
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

exports.createRazorpayOrder = (req, res) => {
    var options = {
        amount: req.body.amount,
        currency: "INR",
        receipt: uniqId()
    };
    razorpayInstance.orders.create(options, (err, order) => {
        if(err)
        {
            return res.status(500).json({error: err})
        }
        orderId = order.id;
        res.json(order);
    })
}

exports.razorpayCallback = (req, res) => {
    const hash = crypto.createHmac('sha256', process.env.RAZORPAY_SECRET)
        .update(orderId + "|" + req.body.razorpay_payment_id)
        .digest('hex');
    console.log(hash, "hashh")
    console.log(req.body, "body")
    if(hash == req.body.razorpay_signature){
        res.redirect("http://localhost:3000/checkout/create-order")
    }
}