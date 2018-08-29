const {User} = require('../models');

exports.userByUsername = (req, res, next) => {
    return User.findOne({username: req.params.username})
        .then(user => {
           res.status(200).send({user});
        })
        .catch(err => next(err));
}