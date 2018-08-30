const express = require('express');
const mongoose = require('mongoose');
const apiRouter = require('./routers/api-router');
const bodyParser = require('body-parser');
const {databaseUrl} = require('./utils');

const app = express();

app.use(bodyParser.json());

app.set('view engine', 'ejs');

mongoose.connect(databaseUrl(), {useNewUrlParser: true})
    .then(() => {
        console.log(`Connected to Mongo via ${databaseUrl()}...`);
    });

app.use('/api', apiRouter);

app.use('/*', (req, res, next) => {
    next({status: 404, msg: 'Not found'});
});

app.use((err, req, res, next) => {
    if (err.status) res.status(err.status).send(err.msg)
    else {
        console.log(err);
        res.status(500).send('An error has occurred...');
    }
  });
  

module.exports = app;