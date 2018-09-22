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
            let query = [];
            query.push({$match: {belongs_to: topic.slug}});
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
            return Article.aggregate(query)            
        })
        .then(articles => {
            return Promise.all([
                Article.countDocuments({belongs_to: req.params.topic_slug}),
                Article.populate(articles, {path: "created_by"})
            ])            
        })
        .then(([count, articles]) => {
            res.status(200).send({count, articles})
        })
        .catch(err => {
            if (err.name === 'CastError') next({msg: 'Bad Request', status: 400});
            else next(err);             
        });
}