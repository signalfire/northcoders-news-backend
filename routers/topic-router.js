const topicRouter = require('express').Router();
const {topics, articlesForTopic} = require('../controllers/topics');
const {addArticle} = require('../controllers/articles');

topicRouter.route('/')
    .get(topics);

topicRouter.route('/:topic_slug/articles')
    .get(articlesForTopic)
    .post(addArticle);
    
module.exports = topicRouter;