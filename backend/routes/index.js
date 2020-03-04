import Account from '../controllers/accountController.js';
import SMTPEmail from '../controllers/emailController.js';
import Review from '../controllers/reviewController.js';
import Curriculum from '../controllers/curriculumController.js';
import Course from '../controllers/courseContoller.js';

export default (app) => {
    app.route('/').get((req, res)=> {
        res.status(400).send({
            status: false,
            response: "Invalid URL"
        });
    });

    //register and login
    app.route('/studentRegister').post(Account.studentRegister);
    app.route('/instructorRegister').post(Account.instructorRegister);
    app.route('/login').post(Account.login);
    app.route('/getAccount').get(Account.getAccountByToken);

    //email service
    app.route('/sendEmail').post(SMTPEmail.sendEMail);

    //review
    app.route('/getReviews').get(Review.getReviews);
    app.route('/createReview').post(Review.createReview);

    //curriculum
    app.route('/setCurriculum').post(Curriculum.setCurriculum);
    app.route('/getCurriculum').get(Curriculum.getCurriculum);

    //course
    app.route('/submitQuiz').post(Course.submitQuiz);
    app.route('/getCourses').get(Course.getCourses);
    app.route('/getAllGrades').get(Course.getAllGrades);
};