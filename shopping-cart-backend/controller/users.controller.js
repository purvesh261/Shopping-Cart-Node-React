const User = require('../model/users.model');


exports.getUsers = (req, res) => {
    User.find()
        .then(users => {
            res.send(users);
        })
        .catch(err => {
            res.send('Error: ' + err);
        });
}

exports.getUserByUsername = (req, res) => {
    User.find({username: req.params.username})
        .then(user => {
            res.send(user);
        })
        .catch(err => {
            res.send('Error: ' + err);
        });
}

exports.createUser = (req, res) => {
    User.create(req.body)
        .then(user => {
            res.send(user);
        })
        .catch(err => {
            res.send('Error: ' + err);
        });
}

exports.updateUser = (req, res) => {
    User.findByIdAndUpdate(req.params.id, req.body)
        .then(user => {
            res.send(user);
        })
        .catch(err => {
            res.send('Error: ' + err);
        });
}

exports.deleteUser = (req, res) => {
    User.findByIdAndRemove(req.params.id)
    .then(user => {
        res.send(user);
    })
    .catch(err => {
        res.send('Error: ' + err);
    });
}