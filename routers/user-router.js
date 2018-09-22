const userRouter = require('express').Router();
const {getUserByUsername, getArticlesByUsername} = require('../controllers/users');

userRouter.route('/:username')
    .get(getUserByUsername);

userRouter.route('/:username/articles')
    .get(getArticlesByUsername)

module.exports = userRouter;