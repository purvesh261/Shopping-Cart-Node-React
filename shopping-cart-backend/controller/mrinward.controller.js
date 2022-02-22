const MRInward = require('../model/mrinward.model');

exports.getMRInwards = (req, res) => {
    MRInward.find()
    .then(mrinwards => {
        res.send(mrinwards);
    })
    .catch(err => {
        res.send('Error:' + err);
    })
};

exports.getMRInwardById = (req, res) => {
    MRInward.findById(req.params.id)
    .then(mrinward => {
        res.send(mrinward);
    })
    .catch(err => {
        res.send('Error:' + err);
    })
}

exports.createMRInward = (req, res) => {
    let newMRInward = new MRInward(req.body);
    console.log(newMRInward);
    newMRInward.save()
        .then(mrinward => {
            res.send(mrinward);
        })
        .catch(err => {
            res.send('Error:' + err);
        });
}

exports.updateMRInward = (req, res) => {
    MRInward.findByIdAndUpdate(req.params.id, req.body)
        .then(mrinward => {
            res.send(mrinward);
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

