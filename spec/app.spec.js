const app = require('../app');
const mongoose = require('mongoose');
const { expect } = require('chai');
const request = require('supertest')(app);
const seedDB = require('../seed/seed');
const {articles, comments, topics, users} = require('../seed/testData');

describe('Northcoders News API', () => {
    let topicsDocs, userDocs, articleDocs, commentDocs;
    beforeEach(() => {
       return seedDB(topics, users, articles, comments)
            .then(docs => {
                [topicDocs, userDocs, articleDocs, commentDocs] = docs;
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
                .then(({body}) => {
                    const {topics} = body;
                    expect(body).to.have.all.keys('topics');
                    expect(topics).to.be.an('array');
                    expect(topics.length).to.equal(topicDocs.length);
                    expect(topics[0]).to.be.an('object');
                    expect(topics[0]).to.have.all.keys(['_id', '__v', 'slug', 'title']);
                    expect(topics[0].title).to.equal(topicDocs[0].title);
                });
        });
    });
    describe('/api/topics/:topic_slug/articles', () => {
        it ('GET should respond with a status code 200 and an array containing the articles', () => {
            return request
                .get(`/api/topics/${topicDocs[0].slug}/articles`)
                .expect(200)
                .then(({body}) => {
                    const {articles} = body;
                    const filteredDocs = articleDocs.filter(article => article.belongs_to === topicDocs[0].slug);
                    expect(body).to.have.all.keys('articles');
                    expect(articles).to.be.an('array');
                    expect(articles.length).to.equal(filteredDocs.length);
                    expect(articles[0]).to.be.an('object');
                    expect(articles[0].title).to.equal(filteredDocs[0].title);
                })
        });
        it ('GET should respond with a status code 404 when passed a topic slug that does not exist', () => {
            return request
                .get('/api/topics/i-do-not-exist/articles')
                .expect(404)
                .then(({body}) => {
                    expect(body).to.be.an('object');
                    expect(body).to.have.all.keys(['msg', 'status']);
                    expect(body.status).to.equal(404);
                    expect(body.msg).to.equal('Page Not Found');                    
                })
        });  
        it ('POST should respond with a status code 201 and an object representing the added article', () => {
            return request
                .post(`/api/topics/${topicDocs[0].slug}/articles`)
                .send({
                    title: 'I am a test article',
                    body: 'I am a test body content for a new article in mitch topic',
                    created_by: userDocs[0]._id,
                })    
                .expect(201)
                .then(({body}) => {
                    const {article} = body;
                    expect(body).to.have.all.keys('article');
                    expect(article).to.be.an('object');
                    expect(article).to.have.all.keys(['_id', 'votes', 'title', 'body', 'created_by', 'belongs_to', 'created_at', 'comment_count', '__v']);
                    expect(article.created_by).to.be.an('object');
                    expect(article.created_by).to.have.all.keys(['_id','username','name','avatar_url','__v'])
                    expect(article.belongs_to).to.equal(topicDocs[0].slug);
                })
        });
        it ('POST should respond with a status code 400 as object posted is missing a required title field', () => {
            return request
                .post(`/api/topics/${topicDocs[0].slug}/articles`)
                .send({
                    body: 'I am a test body content for a new article in mitch topic',
                    created_by: userDocs[0]._id,
                })
                .expect(400)
                .then(({body}) => {
                    expect(body).to.be.an('object');
                    expect(body).to.have.all.keys(['msg', 'status']);
                    expect(body.status).to.equal(400);
                    expect(body.msg).to.equal('Bad Request');
                })
        });    
        it ('POST should respond with a status code 400 as object posted is missing a required body field', () => {
            return request
                .post(`/api/topics/${topicDocs[0].slug}/articles`)
                .send({
                    title: 'I am a test article',
                    created_by: userDocs[0]._id,
                })
                .expect(400)
                .then(({body}) => {
                    expect(body).to.be.an('object');
                    expect(body).to.have.all.keys(['msg', 'status']);
                    expect(body.status).to.equal(400);
                    expect(body.msg).to.equal('Bad Request');
                })
        }); 
        it ('POST should respond with a status code 400 as object posted is missing a required created_by field', () => {
            return request
                .post(`/api/topics/${topicDocs[0].slug}/articles`)
                .send({
                    title: 'I am a test article',
                    body: 'I am a test body content for a new article in mitch topic',
                })
                .expect(400)
                .then(({body}) => {
                    expect(body).to.be.an('object');
                    expect(body).to.have.all.keys(['msg', 'status']);
                    expect(body.status).to.equal(400);
                    expect(body.msg).to.equal('Bad Request');
                })
        });            
        it ('POST should respond with a status code 400 as object posted has an invalid created_by mongo id for user', () => {
            return request
                .post(`/api/topics/${topicDocs[0].slug}/articles`)
                .send({
                    title: 'I am a test article',
                    body: 'I am a test body content for a new article in mitch topic',
                    created_by: 'mr-wibble',
                })
                .expect(400)
                .then(({body}) => {
                    expect(body).to.be.an('object');
                    expect(body).to.have.all.keys(['msg', 'status']);
                    expect(body.status).to.equal(400);
                    expect(body.msg).to.equal('Bad Request');
                })
        });
        it ('POST should respond with a status code 400 as object posted has an valid mongoid for created_by but the id does not exist as a user', () => {
            return request
                .post(`/api/topics/${topicDocs[0].slug}/articles`)
                .send({
                    title: 'I am a test article',
                    body: 'I am a test body content for a new article in mitch topic',
                    created_by: topicDocs[0]._id,
                })
                .expect(400)
                .then(({body}) => {
                    expect(body).to.be.an('object');
                    expect(body).to.have.all.keys(['msg', 'status']);
                    expect(body.status).to.equal(400);
                    expect(body.msg).to.equal('Bad Request');
                })
        });             
    })
    describe('/api/articles', () => {
        it('GET should return an array of articles', () => {
            return request
                .get('/api/articles')
                .expect(200)
                .then(({body}) => {
                    const {articles} = body;
                    const filteredDocs = userDocs.filter(user => user._id === articleDocs[0].created_by);
                    expect(body).to.have.all.keys('articles');
                    expect(articles).to.be.an('array');
                    expect(articles.length).to.equal(articleDocs.length);
                    expect(articles[0].title).to.equal(articleDocs[0].title);
                    expect(articles[0].created_by).to.be.an('object');
                    expect(articles[0].created_by.username).to.equal(filteredDocs[0].username);
                });
        });
    });

    describe('/api/articles/:article_id', () => {
        it('GET should return a single article when a valid mongoid is used for a document in the articles collection', () => {
            return request
                .get(`/api/articles/${articleDocs[0]._id}`)
                .expect(200)
                .then(({body}) => {
                    const {article} = body;
                    const filteredDocs = userDocs.filter(user => user._id === articleDocs[0].created_by);
                    expect(body).to.have.all.keys('article');
                    expect(article).to.be.an('object');
                    expect(article).to.have.all.keys(['__v','_id', 'title', 'body', 'votes', 'created_at', 'belongs_to', 'created_by', 'comment_count']);
                    expect(article._id).to.equal(`${articleDocs[0]._id}`);
                    expect(article.created_by).to.be.an('object');
                    expect(article.created_by.username).to.equal(filteredDocs[0].username);

                })
        });
        it('GET should return a 400 status when the mongoid used is invalid', () =>{
            return request
                .get(`/api/articles/something-terribly-geeky`)
                .expect(400)
                .then(({body}) => {
                    expect(body).to.be.an('object');
                    expect(body).to.have.all.keys(['msg', 'status']);
                    expect(body.status).to.equal(400);
                    expect(body.msg).to.equal('Bad Request');
                })
        })
        it('GET should return a 404 status when the mongoid used is valid, but data with mongoid doesnt exist in articles collection', () => {
            return request
                .get(`/api/articles/${topicDocs[0]._id}`)
                .expect(404)
                .then(({body}) => {
                    expect(body).to.be.an('object');
                    expect(body).to.have.all.keys(['msg', 'status']);
                    expect(body.status).to.equal(404);
                    expect(body.msg).to.equal('Page Not Found');
                })
        })
        it('PATCH should increment the votes of an article by 1', () => {
            return request
                .patch(`/api/articles/${articleDocs[0]._id}?vote=up`)
                .expect(200)
                .then(({body}) => {
                    const {article} = body;
                    expect(body).to.have.all.keys('article');
                    expect(article.votes).to.equal(articleDocs[0].votes + 1);
                });                
        })        
        it('PATCH should decrease the votes of an article by 1', () => {
            return request
                .patch(`/api/articles/${articleDocs[0]._id}?vote=down`)
                .expect(200)
                .then(({body}) => {
                    const {article} = body;
                    expect(body).to.have.all.keys('article');
                    expect(article.votes).to.equal(articleDocs[0].votes - 1);
                });
        })
        it('PATCH should return a 400 as article mongoid is invalid', () => {
            return request
                .patch(`/api/articles/something-terrible-geeky?vote=up`)
                .expect(400)
                .then(({body}) => {
                    expect(body).to.be.an('object');
                    expect(body).to.have.all.keys(['msg', 'status']);
                    expect(body.status).to.equal(400);
                    expect(body.msg).to.equal('Bad Request');
                });                
        })  
        it('PATCH should return a 404 as article mongoid is valid, but data with mongoid doesnt exist in collection', () => {
            return request
                .patch(`/api/articles/${topicDocs[0]._id}?vote=up`)
                .expect(404)
                .then(({body}) => {
                    expect(body).to.be.an('object');
                    expect(body).to.have.all.keys(['msg', 'status']);
                    expect(body.status).to.equal(404);
                    expect(body.msg).to.equal('Page Not Found');
                });                
        })   
        it('PATCH should return a 400 as vote key is missing in query', () => {
            return request
                .patch(`/api/articles/${topicDocs[0]._id}`)
                .expect(400)
                .then(({body}) => {
                    expect(body).to.be.an('object');
                    expect(body).to.have.all.keys(['msg', 'status']);
                    expect(body.status).to.equal(400);
                    expect(body.msg).to.equal('Bad Request');
                });                
        })     
        it('PATCH should return a 400 as vote key is in query but unexpected value', () => {
            return request
                .patch(`/api/articles/${topicDocs[0]._id}?vote=test`)
                .expect(400)
                .then(({body}) => {
                    expect(body).to.be.an('object');
                    expect(body).to.have.all.keys(['msg', 'status']);
                    expect(body.status).to.equal(400);
                    expect(body.msg).to.equal('Bad Request');
                });                
        })                
    });
    
    describe('/api/articles/:article_id/comments', () => {
        it('GET should return comments for a single article', () => {
            return request
                .get(`/api/articles/${articleDocs[0]._id}/comments`)
                .expect(200)
                .then(({body}) => {
                    const {comments} = body;
                    const filteredComments = commentDocs.filter(comment => comment.belongs_to === articleDocs[0]._id);
                    const filteredUsers = userDocs.filter(user => user._id === filteredComments[0].created_by);
                    expect(body).to.have.all.keys('comments');
                    expect(comments).to.be.an('array');
                    expect(comments.length).to.equal(filteredComments.length);
                    expect(comments[0]).to.have.all.keys(['_id','__v', 'votes', 'body', 'belongs_to', 'created_by', 'created_at']);
                    expect(comments[0].body).to.equal(filteredComments[0].body);
                    expect(comments[0].created_by).to.be.an('object');
                    expect(comments[0].created_by._id).to.equal(`${filteredUsers[0]._id}`);
                })
        });
        it('GET should return 400 when requesting comments for an article by mongoid that is invalid', () => {
            return request
                .get('/api/articles/something-terribly-geeky/comments')
                .expect(400)
                .then(({body}) => {
                    expect(body).to.be.an('object');
                    expect(body).to.have.all.keys(['msg', 'status']);
                    expect(body.status).to.equal(400);
                    expect(body.msg).to.equal('Bad Request');
                })
        });        
        it('POST should create a new comment for a single article', () => {
            return request
                .post(`/api/articles/${articleDocs[0]._id}/comments`)
                .send({
                    body: `I am a test comment for article ${articleDocs[0].title}`,
                    created_by: userDocs[0]._id,
                })
                .expect(201)
                .then(({body}) => {
                    const {comment} = body;
                    expect(body).to.have.all.keys('comment');
                    expect(comment).to.be.an('object');
                    expect(comment).to.have.all.keys(['_id', 'votes', 'body', 'created_by', 'belongs_to', 'created_at', '__v']);
                    expect(comment.created_by).to.be.an('object');
                    expect(comment.created_by).to.have.all.keys(['_id','username','name','avatar_url','__v']);
                    expect(comment.created_by._id).to.equal(`${userDocs[0]._id}`);
                    expect(comment.belongs_to).to.be.an('object');
                    expect(comment.belongs_to).to.have.all.keys(['__v','_id', 'title', 'body', 'votes', 'created_at', 'belongs_to', 'created_by']);
                })
        });

        it('POST should respond with a status code 400 when attempting to add a comment with an invalid mongoid', () => {
            return request
                .post('/api/articles/something-really-geeky-here/comments')
                .send({
                    body: `I am a test comment for article ${articleDocs[0].title}`,
                    created_by: userDocs[0]._id,
                })
                .expect(400)
                .then(({body}) => {
                    expect(body).to.be.an('object');
                    expect(body).to.have.all.keys(['msg', 'status']);
                    expect(body.status).to.equal(400);
                    expect(body.msg).to.equal('Bad Request');
                })
        });

        it ('POST should respond with a status code 400 as object posted has an invalid created_by mongo id for user', () => {
            return request
                .post(`/api/articles/${articleDocs[0]._id}/comments`)
                .send({
                    body: `I am a test comment for article ${articleDocs[0].title}`,
                    created_by: 'mr-wibble',
                })
                .expect(400)
                .then(({body}) => {
                    expect(body).to.be.an('object');
                    expect(body).to.have.all.keys(['msg', 'status']);
                    expect(body.status).to.equal(400);
                    expect(body.msg).to.equal('Bad Request');
                })
        });

        it ('POST should respond with a status code 400 as object posted has an valid created_by mongo id but for another collection', () => {
            return request
                .post(`/api/articles/${articleDocs[0]._id}/comments`)
                .send({
                    body: `I am a test comment for article ${articleDocs[0].title}`,
                    created_by: topicDocs[0]._id,
                })
                .expect(400)
                .then(({body}) => {
                    expect(body).to.be.an('object');
                    expect(body).to.have.all.keys(['msg', 'status']);
                    expect(body.status).to.equal(400);
                    expect(body.msg).to.equal('Bad Request');
                })
        });

        it('POST should respond with a status code 400 when attempting to add a comment with an valid mongoid but for another collection', () => {
            return request
                .post(`/api/articles/${topicDocs[0]._id}/comments`)
                .send({
                    body: `I am a test comment for article ${articleDocs[0].title}`,
                    created_by: userDocs[0]._id,
                })
                .expect(400)
                .then(({body}) => {
                    expect(body).to.be.an('object');
                    expect(body).to.have.all.keys(['msg', 'status']);
                    expect(body.status).to.equal(400);
                    expect(body.msg).to.equal('Bad Request');
                })
        });        

        it('POST should respond with a status code 400 as object posted is missing a required body field', () => {
            return request
                .post(`/api/articles/${articleDocs[0]._id}/comments`)
                .send({
                    created_by: userDocs[0]._id,
                })
                .expect(400)
                .then(({body}) => {
                    expect(body).to.be.an('object');
                    expect(body).to.have.all.keys(['msg', 'status']);
                    expect(body.status).to.equal(400);
                    expect(body.msg).to.equal('Bad Request');
                })
        });     

        it('POST should respond with a status code 400 as object posted is missing a created_by field', () => {
            return request
                .post(`/api/articles/${articleDocs[0]._id}/comments`)
                .send({
                    body: `I am a test comment for article ${articleDocs[0].title}`,
                })
                .expect(400)
                .then(({body}) => {
                    expect(body).to.be.an('object');
                    expect(body).to.have.all.keys(['msg', 'status']);
                    expect(body.status).to.equal(400);
                    expect(body.msg).to.equal('Bad Request');
                })
        });                
    });

    describe('/api/users/:username', () => {
        it('GET should return a single user', () => {
            return request
                .get(`/api/users/${userDocs[0].username}`)
                .expect(200)
                .then(({body}) => {
                    const {user} = body;
                    expect(body).to.have.all.keys('user');
                    expect(user).to.be.an('object');
                    expect(user).to.have.all.keys(['__v', '_id', 'username', 'name', 'avatar_url'])
                    expect(user.username).to.equal(userDocs[0].username);
                })
        });
        it('GET should return a 404 when user is not found in collection', () => {
            return request
                .get(`/api/users/benny-hill`)
                .expect(404)
                .then(({body}) => {
                    expect(body).to.be.an('object');
                    expect(body).to.have.all.keys(['msg', 'status']);
                    expect(body.status).to.equal(404);
                    expect(body.msg).to.equal('Page Not Found');
                })
        });        
    })

    describe('/api/comments/:comment_id', () => {
        it('DELETE should delete a single comment', () => {
            return request
                .delete(`/api/comments/${commentDocs[0]._id}`)
                .expect(200)
                .then(({body}) => {
                    const {comment} = body;
                    expect(body).to.have.all.keys('comment');
                    expect(comment).to.be.an('object');
                    expect(comment).to.have.all.keys(['_id', '__v', 'body', 'votes', 'created_at', 'belongs_to', 'created_by']);
                })
        });
        it('DELETE should return a 404 status when trying to delete a valid mongoid that does not exist in the collection', () => {
            return request
                .delete(`/api/comments/${topicDocs[0]._id}`)
                .expect(404)
                .then(({body}) => {
                    expect(body).to.be.an('object');
                    expect(body).to.have.all.keys(['msg', 'status']);
                    expect(body.status).to.equal(404);
                    expect(body.msg).to.equal('Page Not Found');
                })
        });  
        it('DELETE should return a 400 status when trying to delete a invalid mongoid', () => {
            return request
                .delete('/api/comments/something-really-geeky-here')
                .expect(400)
                .then(({body}) => {
                    expect(body).to.be.an('object');
                    expect(body).to.have.all.keys(['msg', 'status']);
                    expect(body.status).to.equal(400);
                    expect(body.msg).to.equal('Bad Request');
                })
        });        
        it('PATCH should increment the votes of an comment by 1', () => {
            return request
                .patch(`/api/comments/${commentDocs[0]._id}?vote=up`)
                .expect(200)
                .then(({body}) => {
                    const {comment} = body;
                    expect(body).to.have.all.keys('comment');
                    expect(comment).to.be.an('object');
                    expect(comment).to.have.all.keys(['_id', 'body', 'belongs_to', 'created_by', 'created_at', 'votes', '__v']);
                    expect(comment.created_by).to.be.an('object');
                    expect(comment.created_by).to.have.all.keys(['_id', 'username', 'name', 'avatar_url', '__v']);
                    expect(comment.votes).to.equal(commentDocs[0].votes + 1);
                });                
        })
        it('PATCH should decrease the votes of an comment by 1', () => {
            return request
                .patch(`/api/comments/${commentDocs[0]._id}?vote=down`)
                .expect(200)
                .then(({body}) => {
                    const {comment} = body;
                    expect(body).to.have.all.keys('comment');
                    expect(comment).to.be.an('object');
                    expect(comment).to.have.all.keys(['_id', 'body', 'belongs_to', 'created_by', 'created_at', 'votes', '__v']);
                    expect(comment.created_by).to.be.an('object');
                    expect(comment.created_by).to.have.all.keys(['_id', 'username', 'name', 'avatar_url', '__v']);
                    expect(comment.votes).to.equal(commentDocs[0].votes - 1);
                });
        })  
        it('PATCH should return a 400 as comment mongoid is invalid', () => {
            return request
                .patch(`/api/comments/something-terrible-geeky?vote=up`)
                .expect(400)
                .then(({body}) => {
                    expect(body).to.be.an('object');
                    expect(body).to.have.all.keys(['msg', 'status']);
                    expect(body.status).to.equal(400);
                    expect(body.msg).to.equal('Bad Request');
                });                
        }) 
        it('PATCH should return a 404 as comment mongoid is valid, but data with mongoid doesnt exist in collection', () => {
            return request
                .patch(`/api/comments/${topicDocs[0]._id}?vote=up`)
                .expect(404)
                .then(({body}) => {
                    expect(body).to.be.an('object');
                    expect(body).to.have.all.keys(['msg', 'status']);
                    expect(body.status).to.equal(404);
                    expect(body.msg).to.equal('Page Not Found');
                });                
        })      
        it('PATCH should return a 400 as vote key is missing in query', () => {
            return request
                .patch(`/api/comments/${commentDocs[0]._id}`)
                .expect(400)
                .then(({body}) => {
                    expect(body).to.be.an('object');
                    expect(body).to.have.all.keys(['msg', 'status']);
                    expect(body.status).to.equal(400);
                    expect(body.msg).to.equal('Bad Request');
                });                
        })     
        it('PATCH should return a 400 as vote key is in query but unexpected value', () => {
            return request
                .patch(`/api/comments/${commentDocs[0]._id}?vote=test`)
                .expect(400)
                .then(({body}) => {
                    expect(body).to.be.an('object');
                    expect(body).to.have.all.keys(['msg', 'status']);
                    expect(body.status).to.equal(400);
                    expect(body.msg).to.equal('Bad Request');
                });                
        })              
    })

});