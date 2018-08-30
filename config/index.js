const ENV = process.env.NODE_ENV || 'development';

const config = {
	development: {
		DB_URL: 'mongodb://localhost:27017/northcoders_news_dev',
        PORT: 9090,
        SEED_PATH: './devData',
	},
	test: {
		DB_URL: 'mongodb://localhost:27017/northcoders_news_test',
        SEED_PATH: './testData',
    },
    production: {
        DB_URL: process.env.MONGODB_URI,
        PORT: process.env.PORT,
        SEED_PATH: './devData',
    }
} 

module.exports = config[ENV];