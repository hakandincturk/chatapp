require('dotenv').config();

module.exports = { 
	DB_HOST: process.env.DB_HOST,
	DB_USERNAME: process.env.DB_USERNAME,
	DB_PASSWORD: process.env.DB_PASSWORD,
	JWT_SECRET: process.env.APP_JWT_SECRET
};
