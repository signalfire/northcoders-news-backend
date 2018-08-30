const articleRouter = require('express').Router();
const {getArticles, getArticleById, voteByArticleId} = require('../controllers/articles');
const {getArticleComments, addArticleComment} = require('../controllers/comments');

articleRouter.route('/')
    .get(getArticles);

articleRouter.route('/:article_id')
    .get(getArticleById)
    .patch(voteByArticleId);

articleRouter.route('/:article_id/comments')
    .get(getArticleComments)
    .post(addArticleComment);


module.exports = articleRouter;