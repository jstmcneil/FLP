import Account from '../controllers/accountController.js';

var path = require('path');

export default (app) => {
    app.route('/').get(()=> {
        res.send('Backend');
    });
    app.route('/register').post(Account.register);
    app.route('/login').post(Account.login)
};