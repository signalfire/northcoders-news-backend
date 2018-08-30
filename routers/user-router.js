const userRouter = require('express').Router();
const {getUserByUsername} = require('../controllers/users');

userRouter.route('/:username')
    .get(getUserByUsername);

module.exports = userRouter;