const apiRouter = require('express').Router();
const topicRouter = require('./topic-router');
const articleRouter = require('./article-router');
const userRouter = require('./user-router');

apiRouter.use('/topics', topicRouter);
apiRouter.use('/articles', articleRouter);
apiRouter.use('/users', userRouter);

module.exports = apiRouter;