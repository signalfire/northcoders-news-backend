const {User, Article} = require('../models');

module.exports.getUserByUsername = (req, res, next) => {
    User.findOne({username: req.params.username})
        .then(user => {
            if (!user) return Promise.reject({msg: 'Page Not Found', status: 404});
            res.status(200).send({user});
        })
        .catch(err => next(err));
}

module.exports.getArticlesByUsername = (req, res, next) => {
    User.findOne({username: req.params.username})
        .then(user => {
            if (!user) return Promise.reject({msg: 'Page Not Found', status: 404});
            let query = [];
            query.push({$match:{created_by: user._id}})
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
            return Promise.all([
                user,
                Article.aggregate(query)
            ]);        
        })
        .then(([user, results]) => {
            return Promise.all([
                Article.countDocuments({created_by: user._id}),
                results
            ])
        })          
        .then(([count, articles]) => {
            res.status(200).send({count, articles})
        })
        .catch(err => next(err));         

}