import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';

import routes from './routes/index.js';

const app = express();

/**
* Connect to the database
*/

mongoose.connect('mongodb://localhost:27017/FLP-DB', { useNewUrlParser: true, useUnifiedTopology: true });

/**
* Middleware
*/

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// https://enable-cors.org/server_expressjs.html
app.use(function(_, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "*");
    next();
});

// catch 400
app.use((err, req, res, next) => {
    console.log(err.stack);
    res.status(400).send(`Error: ${res.originUrl} not found`);
    next();
});

// catch 500
app.use((err, req, res, next) => {
    console.log(err.stack)
    res.status(500).send(`Error: ${err}`);
    next();
});

/**
    * Register the routes
    */

routes(app);

export default app;