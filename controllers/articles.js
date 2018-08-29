const {Article} = require('../models');

exports.articles = (req, res, next) => {
    return Article.find()
        .then(articles => {
           res.status(200).send({articles});
        })
        .catch(err => next(err));
}

exports.articleById = (req, res, next) => {
    return Article.findById(req.params.article_id)
        .then(article => {
            res.status(200).send({article});
        }) 
        .catch(err => next(err));   
}