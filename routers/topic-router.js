const topicRouter = require('express').Router();
const {getTopics, getArticlesForTopic} = require('../controllers/topics');
const {addArticle} = require('../controllers/articles');

topicRouter.route('/')
    .get(getTopics);

topicRouter.route('/:topic_slug/articles')
    .get(getArticlesForTopic)
    .post(addArticle);
    
module.exports = topicRouter;