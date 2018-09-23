const statsRouter = require('express').Router();
const {getStats} = require('../controllers/stats');

statsRouter.route('/')
    .get(getStats);

module.exports = statsRouter;