const commentRouter = require('express').Router();
const {deleteCommentById, voteByCommentId} = require('../controllers/comments');

commentRouter.route('/:comment_id')
    .delete(deleteCommentById)
    .patch(voteByCommentId);


module.exports = commentRouter;