const {Article, Topic, User, Comment} = require('../models');
const mongoose = require('mongoose');

module.exports.getArticles = (req, res, next) => {
    let query = [];
    if (req.query.search) {
        query.push({$match:{title: {$regex: req.query.search, $options: 'i'}}});
    }
    if (req.query.sort && req.query.direction) {
        query.push({$sort: {[req.query.sort]:parseInt(req.query.direction)}})
    }
    if (req.query.page && req.query.pageSize) {
        query.push({$skip: (req.query.page - 1) * req.query.pageSize})
        query.push({$limit: parseInt(req.query.pageSize)});
    }    
    query.push({$lookup: { from:"comments", let: {"id": "$_id"}, pipeline:[{$match:{$expr:{$eq:["$$id","$belongs_to"]}}},{ $count: "count" }],as:"comments"}});
    query.push({$addFields: {"comment_count": { $sum: "$comments.count" }}});
    query.push({$project:{"comments":false}});
    Article.aggregate(query)   
        .then(results => {
            return Promise.all([
                Article.countDocuments(req.query.search ? {title: {$regex: req.query.search, $options: 'i'}} : {}),
                Article.populate(results, {path: "created_by"})
            ])
        })
        .then(([count, articles]) => {
            res.status(200).send({count, articles})
        })
        .catch(err => next(err));
}

module.exports.getArticleById = (req, res, next) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.article_id)) return next({msg:'Bad Request', status:400});
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
    if (!updateAction[req.query.vote]) return next({msg: 'Bad Request', status: 400});
    Article.findOneAndUpdate({_id: req.params.article_id}, updateAction[req.query.vote], {new: true})
        .then(article => {
            if (!article) return Promise.reject({msg: 'Page Not Found', status: 404});
            return Promise.all([
                Comment.countDocuments({belongs_to: req.params.article_id}),
                Article.populate(article, {path: "created_by"})
            ]);
        })  
        .then(([count, article]) => {
            article = article.toObject();
            article.comment_count = count;
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
            return Article.populate(article, {path: "created_by"});
        })
        .then(article => {
            article = article.toObject();
            article.comment_count = 0;
            res.status(201).send({article})
        })
        .catch(err => {
            if (err.name === 'ValidationError' || err.name === 'CastError') next({msg: 'Bad Request', status: 400});
            else next(err);
        });
}