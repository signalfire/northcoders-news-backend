const {Comment} = require('../models');

exports.articleComments = (req, res, next) => {
    return Comment.find({belongs_to: req.params.article_id})
        .then(comments => {
            res.status(200).send({comments})
        })
        .catch(err => next(err));
}

exports.addArticleComment = (req, res, next) => {
    let belongs_to = req.params.article_id;
    return new Comment({...req.body, belongs_to}).save()
        .then(comment => {
            res.status(201).send({comment})
        })
        .catch(err => next(err));
}

exports.deleteCommentById = (req, res, next) => {
    return Comment.deleteOne({_id: req.params.comment_id})
        .then(comment => {
            console.log(comment);
        })
        .catch(err => next(err));
}