import Account from '../controllers/accountController.js';

var path = require('path');

export default (app) => {
    app.route('/').get((req, res)=> {
        res.send('Backend');
    });

    //register and login
    app.route('/studentRegister').post(Account.studentRegister);
    app.route('/instructorRegister').post(Account.instructorRegister);
    app.route('/login').get(Account.login);
};