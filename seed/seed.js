const mongoose = require('mongoose');
const {User, Article, Comment, Topic } = require('../models');
const {createRefObj, formatArticleData, formatCommentData} = require('../utils');

const seedDB = (topics, users, articles, comments ) => {
    return mongoose.connection.dropDatabase()
        .then(() => {
            return Promise.all([
                Topic.insertMany(topics),
                User.insertMany(users)
            ])
        }) 
        .then(([topicDocs, userDocs]) => {
            const topicRefs = createRefObj(topics, topicDocs, 'slug', 'slug');
            const userRefs = createRefObj(users, userDocs, 'username', '_id');
            return Promise.all([
                topicDocs,
                userDocs,
                userRefs,
                Article.insertMany(formatArticleData(articles, topicRefs, userRefs))
            ])            
        })
        .then(([topicDocs, userDocs, userRefs, articleDocs]) => {
            const articleRefs = createRefObj(articles, articleDocs, 'title', '_id');
            return Promise.all([
                topicDocs,
                userDocs,
                articleDocs, 
                Comment.insertMany(formatCommentData(comments, articleRefs, userRefs))
            ]);
        })
        .catch(console.log);
}

module.exports = seedDB;