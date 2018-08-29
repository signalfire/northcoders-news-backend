const mongoose = require('mongoose');
const seedDB = require('./seed');
const {databaseUrl} = require('../utils');
const {articles, comments, topics, users} = require('./devData');

const DB_URL = databaseUrl('development');

mongoose.connect(DB_URL, {useNewUrlParser: true})
    .then(() => {
        console.log(`Connected to ${DB_URL}...`);
        return seedDB(topics, users, articles, comments);
    })
    .then(([topicDocs, userDocs, articleDocs, commentDocs]) => {
        console.log(`Finished seeding data to ${DB_URL}`);
    })
    .then(() => {
        return mongoose.disconnect();
    })
    .then(() => {
        console.log(`Disconnected from ${DB_URL}...`)
    })