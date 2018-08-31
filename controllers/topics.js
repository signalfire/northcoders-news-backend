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
            return Article.aggregate([
                {$match: {belongs_to: topic.slug}},
                {$lookup: { from:"comments", let: {"id": "$_id"}, pipeline:[{$match:{$expr:{$eq:["$$id","$belongs_to"]}}},{ $count: "count" }],as:"comments"}},
                {$addFields: {"comment_count": { $sum: "$comments.count" }}},
                {$project:{"comments":false}}    
            ])            
        })
        .then(articles => {
            return Article.populate(articles, {path: "created_by"});
        })
        .then(articles => {
            res.status(200).send({articles})
        })
        .catch(err => {
            if (err.name === 'CastError') next({msg: 'Bad Request', status: 400});
            else next(err);             
        });
}