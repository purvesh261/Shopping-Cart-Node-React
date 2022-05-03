const User = require('../model/users.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
var ObjectId = require('mongoose').Types.ObjectId;
const error500msg = "Something went wrong! Try again.";

exports.getUsers = (req, res) => {
    User.find()
        .populate('cart.product')
        .then(users => {
            res.send(users);
        })
        .catch(err => {
            res.send('Error: ' + err);
        });
}

exports.getUserCart = async (req, res) => {
    try{
        var user = await User.findOne({_id:req.params.id})
            .populate('cart.product')
        res.send(user.cart);
    }
    catch(err) {
        console.log(err)
        res.status(500).send(error500msg);
    }
}

var generateAccessToken = (user) => {
    console.log(user)
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn:'1h'});
}

exports.authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token === null) return res.sendStatus(401);
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    })
}

exports.authenticate = (req, res) => {
    User.findOne({
        username: req.body.username
    })
        .populate('cart.product')
        .then(user => {
            if (!user) {
                res.json({"error": "User not found"});
            } 
            else if(!user.status) {
                res.json({"error": "User inactive"})
            }
            else 
            {
                if (bcrypt.compareSync(req.body.password, user.password)) {
                    const userData = { id: user._id, username: user.username, admin: user.admin };
                    const accessToken = generateAccessToken(userData);
                    const refreshToken = jwt.sign(userData, process.env.REFRESH_TOKEN_SECRET);
                    user.refreshToken = refreshToken;
                    user.save();
                    const sendData = { _id: user._id, 
                                        username: user.username,
                                        admin: user.admin,
                                        status: user.status,
                                        cart: user.cart,
                                        accessToken: accessToken,
                                        refreshToken: refreshToken };
                    res.json(sendData);
                }
                else {
                    res.json({"error": "Invalid password"});
                }
            }
            }
        )
        .catch(err => {
            res.send('Error: ' + err);
        });
}

exports.token = (req, res) => {
    const refreshToken = req.body.token;
    if (refreshToken === null) return res.sendStatus(401);
    User.findById(req.body._id)
        .then((user) => {
            if(user.refreshToken != refreshToken) return res.sendStatus(403);
            jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, res) => {
                if (err) res.sendStatus(403);
                const userData = { id: _id, username: user.username, admin: user.admin };
                const accessToken = generateAccessToken(userData)
                res.json({ accessToken: accessToken });
            })
        })
}

exports.getUserByUsername = (req, res) => {
    User.find({username: req.params.username})
        .populate('cart.product')
        .then(user => {
            res.send(user);
        })
        .catch(err => {
            res.send('Error: ' + err);
        });
}

exports.createUser = (req, res) => {
    let newUser = req.body;
    newUser.password = bcrypt.hashSync(newUser.password, 10);
    User.create(newUser)
        .then(user => {
            const userData = { id: user._id, username: user.username, admin: user.admin };
            const accessToken = generateAccessToken(userData);
            const refreshToken = jwt.sign(userData, process.env.REFRESH_TOKEN_SECRET);
            user.refreshToken = refreshToken;
            user.save();
            const sendData = { _id: user._id, username: user.username, admin: user.admin, status: user.status, cart: user.cart, accessToken: accessToken, refreshToken: refreshToken };
            res.json(sendData);
        })
        .catch(err => {
            res.send('Error: ' + err);
        });
}

exports.updateUser = (req, res) => {
    User.findByIdAndUpdate(req.params.id, req.body)
        .populate('cart.product')
        .then(user => {
            res.send(user);
        })
        .catch(err => {
            res.send('Error: ' + err);
        });
}

exports.updateCart = (req, res) => {
    let cartQuery = {$set: {cart: req.body.cart}};
    User.findByIdAndUpdate(req.params.id, cartQuery)
        .populate('cart.product')
        .then(user => {
            res.send(user);
        })
        .catch(err => {
            res.send('Error: ' + err);
        });
}

exports.deleteUser = (req, res) => {
    User.findByIdAndRemove(req.params.id)
    .populate('cart.product')
    .then(user => {
        res.send(user);
    })
    .catch(err => {
        res.send('Error: ' + err);
    });
}

exports.removeProductFromCart = (req, res) => {
    User.find({cart: {$elemMatch: {product: new ObjectId(req.params.productID)}}})
        .then(users => {
            users.forEach(user => {
                user.cart.splice(user.cart.findIndex(item => item.product == req.params.productID), 1);
                user.save();
            });
            res.send(users);
           })
}

exports.logout = (req, res) => {
    User.findById(req.body._id)
        .then(user => {
            user.refreshToken = '';
            user.save();
            res.sendStatus(204)
        })
        .catch(err => {
            res.send(err);
        })
}