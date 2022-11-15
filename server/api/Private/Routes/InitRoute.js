import express from 'express';

import InitController from '../Controllers/InitController';

const app = express();

app.get('/health', InitController.health);

module.exports = app;