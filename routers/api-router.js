const apiRouter = require('express').Router();
const topicRouter = require('./topic-router');

apiRouter.use('/topics', topicRouter);

module.exports = apiRouter;