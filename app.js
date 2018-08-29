const express = require('express');
const mongoose = require('mongoose');
const apiRouter = require('./routers/api-router');
const bodyParser = require('body-parser');
const {databaseUrl} = require('./utils');

const DB_URL = databaseUrl('development');

const app = express();

app.use(bodyParser.json());

mongoose.connect(DB_URL, {useNewUrlParser: true})
    .then(() => {
        console.log(`Connected to Mongo via ${DB_URL}...`);
    });

app.use('/', (req, res, next) => {
    console.log('wibble');
})

//app.use('/api', apiRouter);

module.exports = app;