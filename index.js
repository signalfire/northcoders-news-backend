const {PORT = require('./config').PORT} = process.env;

const app = require('./app');

app.listen(PORT, err => {
    if (err) console.log(err);
    else console.log(`Server listening on port ${PORT}...`);
})