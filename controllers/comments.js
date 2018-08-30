const {Comment, Article, User} = require('../models');

module.exports.getArticleComments = (req, res, next) => {
    Comment.find({belongs_to: req.params.article_id})
        .then(comments => {
            res.status(200).send({comments})
        })
        .catch(err => next(err));
}

module.exports.addArticleComment = (req, res, next) => {
    let belongs_to = req.params.article_id;
    Article.findOne({_id: belongs_to})
        .then(article => {
            if (!article) next({msg: 'Bad Request', status: 400});
            return User.findOne({_id: req.body.created_by});
        })
        .then(user => {
            if (!user) next({msg: 'Bad Request', status: 400});
            return Comment.create({...req.body, belongs_to});
        })
        .then(comment => {
            return comment.populate('created_by').execPopulate();
        })
        .then(comment => {
            res.status(201).send({comment});
        })
        .catch(err => {
            if (err.name === 'ValidationError' || err.name === 'CastError') next({msg: 'Bad Request', status: 400});
            else next(err);
        });
}

module.exports.deleteCommentById = (req, res, next) => {
    Comment.deleteOne({_id: req.params.comment_id})
        .then(status => {
            res.status(200).send({status});
        })
        .catch(err => next(err));
}

module.exports.voteByCommentId = (req, res, next) => {
    const updateAction = {up: {$inc: {votes: 1}}, down: {$inc: {votes: -1}}, undefined: null};
    if (!updateAction[req.query.vote]) next({msg: 'Bad Request', status: 400});
    Comment.findOneAndUpdate({_id: req.params.comment_id}, updateAction[req.query.vote], {new: true})
        .then(comment => {
            if (!comment) return Promise.reject({msg: 'Page Not Found', status: 404});
            res.status(200).send({comment});
        })  
        .catch(err => {
            if (err.name === 'CastError') next({msg: 'Bad Request', status: 400});
            else next(err);
        });  
}