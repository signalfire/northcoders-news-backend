const {User} = require('../models');

module.exports.getUserByUsername = (req, res, next) => {
    User.findOne({username: req.params.username})
        .then(user => {
           res.status(200).send({user});
        })
        .catch(err => next(err));
}