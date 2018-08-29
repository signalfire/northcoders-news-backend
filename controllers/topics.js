const {Topic, Article} = require('../models');

exports.topics = (req, res, next) => {
    return Topic.find()
        .then(topics => {
           res.status(200).send({topics});
        })
        .catch(err => next(err));
}

exports.articlesForTopic = (req, res, next) => {
    return Article.find({belongs_to: req.params.topic_slug})
        .then(articles => {
            res.status(200).send({articles})
        })
        .catch(err => next(err));
}