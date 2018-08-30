const {Comment} = require('../models');

module.exports.articleComments = (req, res, next) => {
    return Comment.find({belongs_to: req.params.article_id})
        .then(comments => {
            res.status(200).send({comments})
        })
        .catch(err => next(err));
}

module.exports.addArticleComment = (req, res, next) => {
    let belongs_to = req.params.article_id;
    return new Comment({...req.body, belongs_to}).save()
        .then(comment => {
            return comment.populate('created_by').execPopulate();
        })
        .then(comment => {
            res.status(201).send({comment});
        })
        .catch(err => next(err));
}

module.exports.deleteCommentById = (req, res, next) => {
    return Comment.deleteOne({_id: req.params.comment_id})
        .then(status => {
            res.status(200).send({status});
        })
        .catch(err => next(err));
}

module.exports.voteByCommentId = (req, res, next) => {
    const updateAction = {up: {$inc: {votes: 1}}, down: {$inc: {votes: -1}}};
    return Comment.findOneAndUpdate({_id: req.params.comment_id}, updateAction[req.query.vote], {new: true})
        .then(comment => {
            res.status(200).send({comment});
        })  
        .catch(err => next(err));  
}