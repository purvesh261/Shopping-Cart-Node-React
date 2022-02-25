const User = require('../model/users.model');
const bcrypt = require('bcrypt');


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
                    res.send(user);
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
            res.send(user);
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

// exports.removeItemFromCart = (req, res) => {
//     let cartQuery = {$pull: {cart: {product: req.params.id}}};
//     User.findByIdAndUpdate(req.params.id, cartQuery)
//         .populate('cart.product')
//         .then(user => {
//             res.send(user);
//         })
//         .catch(err => {
//             res.send('Error: ' + err);
//         });
// }

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