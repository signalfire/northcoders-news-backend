const {Topic, Article} = require('../models');

module.exports.getTopics = (req, res, next) => {
    Topic.find()
        .then(topics => {
           res.status(200).send({topics});
        })
        .catch(err => next(err));
}

module.exports.getArticlesForTopic = (req, res, next) => {
    Article.find({belongs_to: req.params.topic_slug})
        .populate('created_by')
        .then(articles => {
            res.status(200).send({articles})
        })
        .catch(err => next(err));
}