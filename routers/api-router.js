const apiRouter = require('express').Router();
const topicRouter = require('./topic-router');
const articleRouter = require('./article-router');
const userRouter = require('./user-router');
const commentRouter = require('./comment-router');
const statsRouter = require('./stats-router');

apiRouter.route('/')
    .get((req, res, next) => {
        res.render('pages/api/index');
    });
    
apiRouter.use('/topics', topicRouter);
apiRouter.use('/articles', articleRouter);
apiRouter.use('/users', userRouter);
apiRouter.use('/comments', commentRouter);
apiRouter.use('/stats', statsRouter);

module.exports = apiRouter;