const articleRouter = require('express').Router();
const {articles, articleById} = require('../controllers/articles');
const {articleComments, addArticleComment} = require('../controllers/comments');

articleRouter.route('/')
    .get(articles);

articleRouter.route('/:article_id')
    .get(articleById);

articleRouter.route('/:article_id/comments')
    .get(articleComments)
    .post(addArticleComment);


module.exports = articleRouter;