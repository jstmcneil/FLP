import Account from '../controllers/accountController.js';
import SMTPEmail from '../controllers/emailController.js';
import Review from '../controllers/reviewController.js';

var path = require('path');

export default (app) => {
    app.route('/').get((req, res)=> {
        res.send('Backend');
    });

    //register and login
    app.route('/studentRegister').post(Account.studentRegister);
    app.route('/instructorRegister').post(Account.instructorRegister);
    app.route('/login').get(Account.login);

    //email service
    app.route('/setEmail').post(SMTPEmail.setEMail);
    app.route('/sendEmail').get(SMTPEmail.sendEMail);

    //review
    app.route('/getReviews').get(Review.getReviews);
    app.route('/createReview').post(Review.createReview);
    app.route('/deleteReview').post(Review.deleteReview);

};