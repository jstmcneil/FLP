import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import routes from './routes/index.js';
import EmailController from './controllers/emailController.js';

const app = express();
app.use(cookieParser());

/**
* Connect to the database
*/
mongoose.connect('mongodb://localhost:27017/FLP-DB', { useNewUrlParser: true, useUnifiedTopology: true });
//for deployment
//mongoose.connect('mongodb+srv://flp:!TbTCfQu5SY1X@flp-db-os1xd.mongodb.net/test?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true });

/**
* Middleware
*/
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// https://enable-cors.org/server_expressjs.html
app.use(function(_, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Authorization, Content-Type");
    res.header("Access-Control-Allow-Credentials", true);
    next();
});

// catch 400
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(400).send(`Error: ${res.originUrl} not found`);
    next();
});

// catch 500
app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).send(`Error: ${err}`);
    next();
});

/**
* Register the routes
*/
routes(app);

// send email digest periodically
EmailController.scheduleEmailDigest();

export default app;