const app = require('./app');
const PORT = process.env.NODE_ENV === 'production' ? process.env.PORT : 9090;

app.listen(PORT, err => {
    if (err) console.log(err);
    else console.log(`Server listening on port ${PORT}...`);
})