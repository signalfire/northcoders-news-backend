const app = require('../app');
const mongoose = require('mongoose');
const { expect } = require('chai');
const request = require('supertest')(app);
const seedDB = require('../seed/seed');
const {articles, comments, topics, users} = require('../seed/testData');

describe('Northcoders News API', () => {
    beforeEach(() => {
       return seedDB(topics, users, articles, comments)
            .then(([topicDocs, userDocs, articleDocs, commentDocs]) => {
                this.topicDocs = topicDocs;
                this.userDocs = userDocs;
                this.articleDocs = articleDocs;
                this.commentDocs = commentDocs;
            })
    })
    after(() => {
        return mongoose.disconnect();
    })
    describe('/api', () => {
        it('GET homepage', () => {
            return request
                .get('/api')
                .expect(200)
                .then(res => {
                    expect(res.text).to.contain('Northcoders News');
                })
        })
    })
    describe('/api/topics', () => {
        it('GET should return an array of topics', () => {
            return request
                .get('/api/topics')
                .expect(200)
                .then(res => {
                    expect(res.body).to.have.all.keys('topics');
                    expect(res.body.topics.length).to.equal(this.topicDocs.length);
                });
        });
    });
    describe('/api/topics/:topic_slug/articles', () => {
        it ('GET should respond with a status code 200 and an array containing the articles', () => {
            return request
                .get('/api/topics/mitch/articles')
                .expect(200)
                .then(res => {
                    expect(res.body).to.have.all.keys('articles');
                    expect(res.body.articles.length).to.equal(this.articleDocs.filter(article => article.belongs_to === 'mitch').length);
                })
        });
        it ('POST should respond with a status code 201 and an object representing the added article', () => {
            return request
                .post('/api/topics/mitch/articles')
                .send({
                    title: 'I am a test article',
                    body: 'I am a test body content for a new article in mitch topic',
                    created_by: this.userDocs[0]._id,
                })
                .expect(201)
                .then(res => {
                    expect(res.body).to.have.all.keys('article');
                    expect(res.body.article).to.have.all.keys(['_id', 'votes', 'title', 'body', 'created_by', 'belongs_to', 'created_at', '__v']);
                })
        });
    })
    describe('/api/articles', () => {
        it('GET should return an array of articles', () => {
            return request
                .get('/api/articles')
                .expect(200)
                .then(res => {
                    expect(res.body).to.have.all.keys('articles');
                    expect(res.body.articles.length).to.equal(this.articleDocs.length);
                });
        });
    });

    describe('/api/articles/:article_id', () => {
        it('GET should return a single article', () => {
            return request
                .get(`/api/articles/${this.articleDocs[0]._id}`)
                .expect(200)
                .then(res => {
                    expect(res.body).to.have.all.keys('article');
                    expect(res.body.article).to.have.all.keys(['__v','_id', 'title', 'body', 'votes', 'created_at', 'belongs_to', 'created_by']);
                })
        });
        it('PATCH should increment the votes of an article by 1', () => {
            return request
                .patch(`/api/articles/${this.articleDocs[0]._id}?vote=up`)
                .expect(200)
                .then(res => {
                    expect(res.body).to.have.all.keys('article');
                    expect(res.body.article.votes).to.equal(this.articleDocs[0].votes + 1);
                });                
        })
        it('PATCH should decrease the votes of an article by 1', () => {
            return request
                .patch(`/api/articles/${this.articleDocs[0]._id}?vote=down`)
                .expect(200)
                .then(res => {
                    expect(res.body).to.have.all.keys('article');
                    expect(res.body.article.votes).to.equal(this.articleDocs[0].votes - 1);
                });
        })        
    });
    
    describe('/api/articles/:article_id/comments', () => {
        it('GET should return comments for a single article', () => {
            return request
                .get(`/api/articles/${this.articleDocs[0]._id}/comments`)
                .expect(200)
                .then(res => {
                    expect(res.body).to.have.all.keys('comments');
                    expect(res.body.comments.length).to.equal(this.commentDocs.filter(comment => comment.belongs_to === this.articleDocs[0]._id).length);
                })
        });
        it('POST should create a new comment for a single article', () => {
            return request
                .post(`/api/articles/${this.articleDocs[0]._id}/comments`)
                .send({
                    body: `I am a test comment for article ${this.articleDocs[0].title}`,
                    created_by: this.userDocs[0]._id,
                })
                .expect(201)
                .then(res => {
                    expect(res.body).to.have.all.keys('comment');
                    expect(res.body.comment).to.have.all.keys(['_id', 'votes', 'body', 'created_by', 'belongs_to', 'created_at', '__v']);
                    expect(res.body.comment.created_by).to.be.an('object');
                    expect(res.body.comment.created_by).to.have.all.keys(['_id','username','name','avatar_url','__v']);
                })
        });
    });

    describe('/api/users/:username', () => {
        it('GET should return a single user', () => {
            return request
                .get(`/api/users/${this.userDocs[0].username}`)
                .expect(200)
                .then(res => {
                    expect(res.body).to.have.all.keys('user');
                    expect(res.body.user).to.have.all.keys(['__v', '_id', 'username', 'name', 'avatar_url'])
                })
        });
    })

    describe('/api/comments/:comment_id', () => {
        it('DELETE should delete a single comment', () => {
            return request
                .delete(`/api/comments/${this.commentDocs[0]._id}`)
                .expect(200)
                .then(res => {
                    expect(res.body).to.have.all.keys('status');
                    expect(res.body.status).to.have.all.keys('n', 'ok');
                })
        });
        it('PATCH should increment the votes of an comment by 1', () => {
            return request
                .patch(`/api/comments/${this.commentDocs[0]._id}?vote=up`)
                .expect(200)
                .then(res => {
                    expect(res.body).to.have.all.keys('comment');
                    expect(res.body.comment.votes).to.equal(this.commentDocs[0].votes + 1);
                });                
        })
        it('PATCH should decrease the votes of an comment by 1', () => {
            return request
                .patch(`/api/comments/${this.commentDocs[0]._id}?vote=down`)
                .expect(200)
                .then(res => {
                    expect(res.body).to.have.all.keys('comment');
                    expect(res.body.comment.votes).to.equal(this.commentDocs[0].votes - 1);
                });
        })         
    })

});