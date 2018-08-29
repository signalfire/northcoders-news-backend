const articleRouter = require('express').Router();
const {articles, articleById, voteByArticleId} = require('../controllers/articles');
const {articleComments, addArticleComment} = require('../controllers/comments');

articleRouter.route('/')
    .get(articles);

articleRouter.route('/:article_id')
    .get(articleById)
    .patch(voteByArticleId);

articleRouter.route('/:article_id/comments')
    .get(articleComments)
    .post(addArticleComment);


module.exports = articleRouter;