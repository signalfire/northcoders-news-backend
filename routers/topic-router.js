const topicRouter = require('express').Router();
const {topics} = require('../controllers/topics');
const {articlesForTopic} = require('../controllers/topics');

topicRouter.route('/')
    .get(topics);

topicRouter.route('/:topic_slug/articles')
    .get(articlesForTopic);

module.exports = topicRouter;