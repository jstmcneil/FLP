import Account from '../models/accountModel.js';
import AccountController from './accountController.js';
import EmailController from './emailController.js';
import Course from '../models/courseModel.js';
import Curriculum from '../models/curriculumModel.js';
import { verifyJWTToken } from '../util/auth.js';
import fs from 'fs';
import path from 'path';
const curriculum = JSON.parse(fs.readFileSync(path.resolve() + '\/curriculum.json'));

async function convertToUsername(arr) {
    var mutableArr = [];
    for (let i = 0; i < arr.length; i++) {
        mutableArr.push(JSON.parse(JSON.stringify(arr[i])));
        let username;
        await Account.findById(mutableArr[i].accountId, (err, acc) => {
            if (err) {
                console.error(err);
                return;
            }
            username = acc.username;
        });

        mutableArr[i].username = username;
        delete mutableArr[i].accountId;
    }
    return mutableArr;
}

// parameters: regCode, courseId, answers, emailResponse
exports.submitQuiz = async (req, res) => {
    //verify token
    const decoded = verifyJWTToken(req.headers['authorization']);
    if (!decoded) {
        res.send({
            msg: "Invalid Token",
            success: false
        });
        return;
    }

    const account = await AccountController.getAccountByToken(decoded);

    var quizTaken = false;
    await Course.find({accountId: account._id, regCode: req.body.regCode, courseId: req.body.courseId}, (err, course) => {
        if (err) {
            console.error(err);
            return;
        }
        quizTaken = course.length > 0;
    });

    if (quizTaken) {
        res.send({
            msg: "Cannot take same quiz twice",
            success: false
        });
        return;
    }

    const answers = JSON.parse(req.body.answers);
    var curriculumCopy = JSON.parse(JSON.stringify(curriculum));
    var courses = curriculumCopy.courses.filter((course => course.id == req.body.courseId));
    const quiz = courses[0].quiz;
    var correctCount = 0.0;

    answers.forEach(ans => {
        if (ans.answerIndex === quiz.mcQuestions[ans.questionId].correctAnswerIndex) {
            correctCount++;
        }
    });


    if (!await EmailController.sendEMail(req.body.regCode, req.body.emailResponse)) {
        res.send({
            msg: 'Sumbit quiz failed',
            success: false
        });
        return;
    }

    const course = new Course({
        accountId: account._id,
        regCode: req.body.regCode,
        courseId: req.body.courseId,
        mcGrade: correctCount / quiz.mcQuestions.length * 100,
        emailResponse: req.body.emailResponse
    });

    course.save(err => {if(err) console.error(err)});

    res.send({
        courseInfo: course,
        quiz: quiz,
        msg: null,
        success: true
    });
}

// parameters: regCode
exports.getCourses = async (req, res) => {
    //verify token
    const decoded = verifyJWTToken(req.headers['authorization']);
    if (!decoded) {
        res.send({
            msg: "Invalid Token",
            success: false
        });
        return;
    }

    var courseId = (await Curriculum.findOne({regCode: req.query.regCode}, {courses: 1})).courses;

    if (courseId.length === 0) {
        res.send({
            courses: null,
            msg: "no courses found for your account",
            success: false
        });
        return;
    }

    var curriculumCopy = JSON.parse(JSON.stringify(curriculum));
    var courses = curriculumCopy.courses.filter(course => courseId.includes(course.id));
    courses.forEach(cur => {
        cur.quiz.mcQuestions.forEach(question => {
            delete question.correctAnswerIndex;
        });
    });

    res.send({
        courses: courses,
        msg: null,
        success: true
    });
}

// parameters: regCode
exports.getGrades = async (req, res) => {
    //verify token
    const decoded = verifyJWTToken(req.headers['authorization']);
    if (!decoded) {
        res.send({
            msg: "Invalid Token",
            success: false
        });
        return;
    }

    const account = await AccountController.getAccountByToken(decoded);
    const courses = (await Curriculum.findOne({regCode: req.query.regCode}, {courses: 1})).courses;

    var grades = [];
    var query = {
        regCode: req.query.regCode
    };

    if (!account.isInstructor) {
        query.accountId = account._id;
    }

    for (const id of courses) {
        query.courseId = id;
        const courseInfo = await Course.findOne(query, {
            accountId: 1,
            regCode: 1,
            courseId: 1,
            mcGrade: 1,
            emailResponse: 1
        });
        grades.push(courseInfo);
    }

    if (account.isInstructor) {
        grades = await convertToUsername(grades);
    }

    res.send({
        grades: grades,
        msg: null,
        success: true
    });
}

// parameters: none
exports.getAllGrades = async (req, res) => {
    //verify token
    const decoded = verifyJWTToken(req.headers['authorization']);
    if (!decoded) {
        res.send({
            msg: "Invalid Token",
            success: false
        });
        return;
    }

    const account = await AccountController.getAccountByToken(decoded);
    var grades = [];
    var query = {};

    if (!account.isInstructor) {
        query.accountId = account._id;
    }

    for (const code of account.regCode) {
        const courses = (await Curriculum.findOne({regCode: code}, {courses: 1})).courses;
        query.regCode = code;
        for (const id of courses) {
            query.courseId = id;
            const grade = await Course.findOne(query, {
                accountId: 1,
                regCode: 1,
                courseId: 1,
                mcGrade: 1,
                emailResponse: 1
            });
            grades.push(grade);
        }
    }

    if (account.isInstructor) {
        grades = await convertToUsername(grades);
    }
    res.send({
        grades: grades,
        msg: null,
        success: true
    });
}

// parameters: none
exports.getAllCourses = async(req, res) => {
    //verify token
    const decoded = verifyJWTToken(req.headers['authorization']);
    if (!decoded) {
        res.send({
            msg: "Invalid Token",
            success: false
        });
        return;
    }

    var courses = JSON.parse(JSON.stringify(curriculum.courses));

    courses.forEach(cur => {
        cur.quiz.mcQuestions.forEach(question => {
            delete question.correctAnswerIndex;
        });
    });

    res.send({
        msg: null,
        courses: courses,
        success: true
    });
}