import account from '../controllers/accountController.js';
import express from 'express';

var path = require('path');

export default (app) => {
    app.route('*').get(account.login);
};