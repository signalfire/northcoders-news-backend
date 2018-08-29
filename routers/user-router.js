const userRouter = require('express').Router();
const {userByUsername} = require('../controllers/users');

userRouter.route('/:username')
    .get(userByUsername);

module.exports = userRouter;