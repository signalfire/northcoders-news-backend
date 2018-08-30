const {User} = require('../models');

module.exports.getUserByUsername = (req, res, next) => {
    User.findOne({username: req.params.username})
        .then(user => {
            if (!user) return Promise.reject({msg: 'Page Not Found', status: 404});
            res.status(200).send({user});
        })
        .catch(err => next(err));
}