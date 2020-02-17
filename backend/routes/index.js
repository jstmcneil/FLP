import Account from '../controllers/accountController.js';
import SMTPEmail from '../controllers/emailController.js';

var path = require('path');

export default (app) => {
    app.route('/').get((req, res)=> {
        res.send('Backend');
    });

    //register and login
    app.route('/studentRegister').post(Account.studentRegister);
    app.route('/instructorRegister').post(Account.instructorRegister);
    app.route('/login').get(Account.login);
    app.route('/sendEmail').get(SMTPEmail.sendEMail);
    app.route('/setEmail').post(SMTPEmail.setEMail);
};