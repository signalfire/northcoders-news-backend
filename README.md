# Northcoders News

Northcoders News project completed as block review at end of backend modules
The demo site is available at https://northcoders-news-rgc.herokuapp.com
The api documentation is available at https://northcoders-news-rgc.herokuapp.com/api

## Getting Started

Clone the project at https://github.com/signalfire/BE2-northcoders-news to your local machine using the git
command *git clone <url>*

### Prerequisites

* Mongo (4.0.0)
* NPM (6.1.0)
* Node (10.6.0)
* Nodemon (1.18.3)

Follow installation instructions for Mongo at https://docs.mongodb.com/manual/installation/

Follow installation instructions for NPM / Node for Mac at http://blog.teamtreehouse.com/install-node-js-npm-mac

Follow installation instructions for NPM / Node for PC at http://blog.teamtreehouse.com/install-node-js-npm-windows

For nodemon, install using npm but with -g to ensure globally (this may not be necessary but proved so on mac) 

### Installing

1. Clone the project at URL above
2. Once cloned / downloaded run *npm install* in the directory downloaded to
3. Create a index.js file inside the config directory in the project. The format of the file is as follows...
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
    production: {
        DB_URL: '<production database on mLab etc..',
        SEED_PATH: './devData',
    }
} 

module.exports = config[ENV];
```
4. Update the <values> above with your own values
4. You will need to seed your local mongo database. To do this run the command *npm run seed:dev*
5. Once seeded run the application using the command *npm run dev*

To check that you have data seeded hit the end point at http://*<url>*/api/articles where *<url>* could be localhost,
127.0.0.1 etc...You should see a json response containing seeded articles.

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


## Deployment

To install on a live environment upload (or reclone) the files which make up this project to a web accessible directory and run *npm install*

To seed the data to a production mongo installation (or just one you are "pretending" is production) ensure config details inside config file are correct and then run *npm run seed:production* to install data.

For example to deploy to heroku and use mLabs mongo addon...

1. Run the command *heroku create <name>* where *<name>* is what you want to call your app
2. You will now - if you run *git remote* - see heroku listed as a remote
3. Follow instructions at https://elements.heroku.com/addons/mongolab in order to install the mlabs mongo add on...in brief this should be command *heroku addons:create mongolab:sandbox*
4. In config variables on heroku web interface copy the created MONGODB_URI variable and create a new variable called DB_URL, pasting in the mongo connection string. You can safely delete the existing MONGODB_URI.
5. Update your local config file (config/index.js) production DB_URL with above MONGODB_URI value provided by mlabs/heroku.
6. If you want to seed local data to the "production" database run (locally) the command *npm run seed:production*
7. When ready push the local files to heroku by *git push heroku master*. 
8. Heroku will run its build and the app should be available at the url chosen.

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
* etc
