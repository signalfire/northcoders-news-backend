const {Article} = require('../models');

module.exports.articles = (req, res, next) => {
    return Article.find()
        .then(articles => {
           res.status(200).send({articles});
        })
        .catch(err => next(err));
}

module.exports.articleById = (req, res, next) => {
    return Article.findById(req.params.article_id)
        .then(article => {
            res.status(200).send({article});
        }) 
        .catch(err => next(err));   
}

module.exports.voteByArticleId = (req, res, next) => {
    const updateAction = {up: {$inc: {votes: 1}}, down: {$inc: {votes: -1}}};
    return Article.findOneAndUpdate({_id: req.params.article_id}, updateAction[req.query.vote], {new: true})
        .then(article => {
            res.status(200).send({article});
        })  
        .catch(err => next(err));  
}

module.exports.addArticle = (req, res, next) => {
    const belongs_to = req.params.topic_slug;
    return new Article({...req.body, belongs_to}).save()
        .then(article => {
            res.status(201).send({article})
        })
        .catch(err => next(err));
}