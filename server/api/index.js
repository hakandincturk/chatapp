require('dotenv').config();

import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

import { swaggerOptions } from './src/config/swaggerOptions';

import SocketServer from './Helpers/SocketServer';
import FirebaseApp from './Helpers/Firebase';

import PublicRoutes from './Public/index';
import PrivateRoutes from './Private/index';

const PORT = process.env.PORT || 5000;
const app = express();

const swaggerGenerator = require('express-swagger-generator')(app);

app.listen();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

swaggerGenerator(swaggerOptions);

SocketServer.start();
FirebaseApp.app();

app.use('/', PublicRoutes);
app.use('/private', PrivateRoutes);

app.get('/health', (req, res) => {
	res.json({type: true, message: 'server is running'});
});

app.listen(PORT, () => {
	console.log(` * SERVER IS RUNNING ON ${PORT}`);
});