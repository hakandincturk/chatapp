import express from 'express';

import AuthController from '../Controllers/AuthController';

const app = express();

app.post('/', AuthController.register);
app.post('/login', AuthController.login);

app.get('/health', AuthController.health);

module.exports = app;