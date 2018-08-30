const {Topic, Article} = require('../models');

module.exports.getTopics = (req, res, next) => {
    Topic.find()
        .then(topics => {
           res.status(200).send({topics});
        })
        .catch(err => next(err));
}

module.exports.getArticlesForTopic = (req, res, next) => {
    Topic.findOne({slug: req.params.topic_slug})
        .then(topic => {
            if (!topic) return Promise.reject({msg: 'Page Not Found', status: 404})
            return Article.find({belongs_to: req.params.topic_slug}).populate('created_by')
        })
        .then(articles => {
            res.status(200).send({articles})
        })
        .catch(err => {
            if (err.name === 'CastError') next({msg: 'Bad Request', status: 400});
            else next(err);             
        });
}