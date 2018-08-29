const mongoose = require('mongoose');
const seedDB = require('./seed');
const {databaseUrl, seedFilePath} = require('../utils');
const {articles, comments, topics, users} = require(seedFilePath());

mongoose.connect(databaseUrl(), {useNewUrlParser: true})
    .then(() => {
        console.log(`Connected to ${databaseUrl()}...`);
        return seedDB(topics, users, articles, comments);
    })
    .then(([topicDocs, userDocs, articleDocs, commentDocs]) => {
        console.log(`Finished seeding data to ${databaseUrl()}`);
    })
    .then(() => {
        return mongoose.disconnect();
    })
    .then(() => {
        console.log(`Disconnected from ${databaseUrl()}...`)
    })