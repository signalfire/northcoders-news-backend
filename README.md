# Northcoders News

Northcoders News project completed as block review at end of backend modules. The frontend of this project can be seen at https://northcoders-news-rgcfe.herokuapp.com/

## Getting Started

Clone the project at https://github.com/signalfire/northcoders-news-backend to your local machine using the git
command *git clone <url>*

### Prerequisites

* Mongo (4.0.0)
* NPM (6.1.0)
* Node (10.6.0)

Follow installation instructions for Mongo at https://docs.mongodb.com/manual/installation/

Follow installation instructions for NPM / Node for Mac at http://blog.teamtreehouse.com/install-node-js-npm-mac

Follow installation instructions for NPM / Node for PC at http://blog.teamtreehouse.com/install-node-js-npm-windows

### Installing

1. Clone the project at URL above
2. Once cloned / downloaded run *npm install* in the directory downloaded to
3. Create a config directory and then create an index.js file inside this config directory. The format of the file is as follows...

```
const ENV = process.env.NODE_ENV || 'development';

const config = {
	development: {
        DB_URL: '<local development database in mongo>',
        PORT: <local port>,
        SEED_PATH: './devData',
	},
	test: {
        DB_URL: '<local test database in mongo>',
        SEED_PATH: './testData',
    },
} 

module.exports = config[ENV];
```
4. Update the *<values>* above with your own values
5. Ensure that you have the mongo daemon running (mongod). 
6. You will need to seed your local mongo database. To do this run the command *npm run seed:dev*. At the end of this process you will see a "Finished seeding data message..."
7. Once seeded run the application using the command *npm run dev*

To check that you have data seeded hit the end point at http://*<url>*:*<port>*/api/articles where *<url>* could be localhost,
127.0.0.1 and *<port>* equals 9090 etc...etc...You should see a json response containing seeded articles.

## Running the tests

Inside the directory downloaded to run the command *npm t*

Tests check the endpoints available on this application which include...

<table>
    <thead>
        <tr>
            <th scope="col" style="text-align:left">Endpoint</th>
            <th scope="col" style="text-align:left">Method</th>
            <th scope="col" style="text-align:left">Description</th>
        </tr>
    </thead>
    <tbody>   
        <tr>
            <th scope="row" style="text-align:left">/api/topics</th>
            <td style="text-align:left">GET</td>
            <td style="text-align:left">Get all the topics</td>
        </tr>
        <tr>
            <th scope="row" style="text-align:left">/api/topics/:topic_slug/articles</th>
            <td style="text-align:left">GET</td>
            <td style="text-align:left">Return all the articles for a certain topic e.g /api/topics/football/articles</td>
        </tr>                    
        <tr>
            <th scope="row" style="text-align:left">/api/topics/:topic_slug/articles</th>
            <td style="text-align:left">POST</td>
            <td style="text-align:left">Add a new article to a topic.<br>This route requires a JSON post body with title and body key value pairs<br><pre>{<br>    "title": "new article",<br>    "body": "This is my new article content",<br>    "created_by": "user_id goes here"<br>}</pre></td>
        </tr>   
        <tr>
            <th scope="row" style="text-align:left">/api/articles</th>
            <td style="text-align:left">GET</td>
            <td style="text-align:left">Returns all the articles</td>
        </tr>           
        <tr>
            <th scope="row" style="text-align:left">/api/articles/:article_id</th>
            <td style="text-align:left">GET</td>
            <td style="text-align:left">Get an individual article</td>
        </tr>                       
        <tr>
            <th scope="row" style="text-align:left">/api/articles/:article_id/comments</th>
            <td style="text-align:left">GET</td>
            <td style="text-align:left">Get all the comments for a individual article</td>
        </tr>   
        <tr>
            <th scope="row" style="text-align:left">/api/articles/:article_id/comments</th>
            <td style="text-align:left">POST</td>
            <td style="text-align:left">Add a new comment to an article.<br>This route requires a JSON body with body and created_by key value pairs.<br><pre>{<br>    "body": "This is my new comment",<br>    "created_by": "user_id goes here"<br>}</pre></td>
        </tr>    
        <tr>
            <th scope="row" style="text-align:left">/api/articles/:article_id?vote=up|down</th>
            <td style="text-align:left">PATCH</td>
            <td style="text-align:left">Increment or Decrement the votes of an article by one</td>
        </tr>    
        <tr>
            <th scope="row" style="text-align:left">/api/comments/:comment_id?vote=up|down</th>
            <td style="text-align:left">PATCH</td>
            <td style="text-align:left">Increment or Decrement the votes of a comment by one</td>
        </tr> 
        <tr>
            <th scope="row" style="text-align:left">/api/comments/:comment_id</th>
            <td style="text-align:left">DELETE</td>
            <td style="text-align:left">Deletes a comment</td>
        </tr> 
        <tr>
            <th scope="row" style="text-align:left">/api/users/:username</th>
            <td style="text-align:left">GET</td>
            <td style="text-align:left">Returns a JSON object with the profile data for the specified user</td>
        </tr>                                        
    </tbody>
</table>

An example test includes...

```
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
```
...which checks that the body of the request has the key *topics*, that *topics* is an array, that the length of *topics* is equal to the length of the number of of topic documents created *topicDocs*, the the first item in the *topics* array is an object, that the object has the required keys and that the first item returned by the api - *topics[0]* has the same title as the first item in the created *topicDocs*. 

## Built With

* [Express](https://expressjs.com)
* [Mongo](https://mongodb.com)
* [Mongoose](https://mongoosejs.com)
* [Chai](http://www.chaijs.com/)
* [Mocha](https://mochajs.org/)
* [EJS](http://ejs.co/)
* [BodyParser](https://github.com/expressjs/body-parser)
* [Supertest](https://github.com/visionmedia/supertest)
* [Nodemon](https://github.com/remy/nodemon)

## Contributing

Please read [CONTRIBUTING.md](https://gist.github.com/PurpleBooth/b24679402957c63ec426) for details on our code of conduct, and the process for submitting pull requests to us.

## Versioning

For the versions available, see the [tags on this repository](https://github.com/your/project/tags). 

## Authors

* **Robert Coster** - [Signalfire](https://github.com/signalfire)

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

* Hat tip to anyone whose code was used
