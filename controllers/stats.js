const {User} = require('../models');

module.exports.getStats = (req, res, next) => {

    User.aggregate([
        {$lookup:{from:"comments",let:{"id":"$_id"},pipeline:[{$match:{$expr:{$eq:["$$id","$created_by"]}}},{$count:"count" }],as:"comments"}},
        {$addFields: {"comment_count": { $sum: "$comments.count" }}},
        {$project:{"comments":false}},
        {$sort:{"comment_count":-1}},	
    ])   
    .then(comments => {
        return Promise.all([
            comments,
            User.aggregate([
                {$lookup:{from:"articles",let: {"id": "$_id"},pipeline:[{$match:{$expr:{$eq:["$$id","$created_by"]}}},{ $count: "count" }],as:"articles"}},
                {$addFields: {"article_count": { $sum: "$articles.count" }}},
                {$project:{"articles":false}},
                {$sort:{"article_count":-1}}		
            ])
        ])
    })
    .then(([comments, articles]) => {
        res.status(200).send({comments, articles})
    })
    .catch(err => next(err));

};