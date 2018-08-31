const {Article, Topic, User, Comment} = require('../models');
const mongoose = require('mongoose');

module.exports.getArticles = (req, res, next) => {
    Article.aggregate([
        {$lookup: { from:"comments", let: {"id": "$_id"}, pipeline:[{$match:{$expr:{$eq:["$$id","$belongs_to"]}}},{ $count: "count" }],as:"comments"}},
        {$addFields: {"comment_count": { $sum: "$comments.count" }}},
        {$project:{"comments":false}}    
    ])    
    .then((results) => {
        return Article.populate(results, {path: "created_by"});
    })
    .then(articles => {
        res.status(200).send({articles})
    })
    .catch(err => next(err));
}

module.exports.getArticleById = (req, res, next) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.article_id)) next({msg:'Bad Request', status:400});
    Article.aggregate([
        {$match: {_id: mongoose.Types.ObjectId(req.params.article_id)}},
        {$lookup: { from:"comments", let: {"id": "$_id"}, pipeline:[{$match:{$expr:{$eq:["$$id","$belongs_to"]}}},{ $count: "count" }],as:"comments"}},
        {$addFields: {"comment_count": { $sum: "$comments.count" }}},
        {$project:{"comments":false}}    
    ])
    .then((result) => {
        if (result.length === 0) return Promise.reject({msg: 'Page Not Found', status: 404});
        const [article] = result;
        return Article.populate(article, {path: "created_by"});
    })
    .then(article => {
        res.status(200).send({article})
    })
    .catch(err => {
        next(err)
    });   
}

module.exports.voteByArticleId = (req, res, next) => {
    const updateAction = {up: {$inc: {votes: 1}}, down: {$inc: {votes: -1}}, undefined: null};
    if (!updateAction[req.query.vote]) next({msg: 'Bad Request', status: 400});
    Article.findOneAndUpdate({_id: req.params.article_id}, updateAction[req.query.vote], {new: true})
        .then(article => {
            if (!article) return Promise.reject({msg: 'Page Not Found', status: 404});
            res.status(200).send({article});
        })  
        .catch(err => {
            if (err.name === 'CastError') next({msg: 'Bad Request', status: 400});
            else next(err);
        });  
}

module.exports.addArticle = (req, res, next) => {
    let belongs_to = req.params.topic_slug;
    User.findOne({_id: req.body.created_by})
        .then(user => {
            if (!user) return Promise.reject({msg: 'Bad Request', status: 400});
            return Topic.findOne({slug: belongs_to});
        })
        .then(topic => {
            if (!topic) return Promise.reject({msg: 'Bad Request', status: 400});
            return Article.create({...req.body, belongs_to});
        })
        .then(article => {
            res.status(201).send({article})
        })
        .catch(err => {
            if (err.name === 'ValidationError' || err.name === 'CastError') next({msg: 'Bad Request', status: 400});
            else next(err);
        });
}